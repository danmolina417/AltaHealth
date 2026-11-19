# Alta Health

Responsive web app for Alta Health, built with Next.js 16 (App Router, Turbopack), React 19, TypeScript and Tailwind CSS 4.

## Structure

```
app/          Routes only (App Router)
  (auth)/       /login, /signup
  (app)/        Signed-in pages; layout.tsx guards them and renders the app shell
    areas/        Wellness area pages sharing the areas sidebar layout
  api/          Route handlers (GET /api/health, Better Auth under /api/auth/*)
  [...slug]/    Unknown URLs redirect to /
components/   Shared UI (charts, buttons, nav, app shell)
features/     Feature code: auth, myHealth, appointments, areas
lib/          Route paths, auth/db setup, accent styles, health status
db/           dbmate migrations and the generated schema.sql
assets/       Images imported by components
test/         Vitest setup, the in-memory router and auth fake used by tests
design/       Design references (not shipped)
proxy.ts      Optimistic sign-in redirect for every request (see Authentication)
```

Components are Server Components by default. Only the interactive pieces (forms, tabs, nav, app shell, auth) are marked `'use client'`. Design tokens live in `app/globals.css` (`@theme`). Imports use the `@/` alias for the project root.

## Requirements

- Node.js 24 LTS (see `.nvmrc`; minimum 22.22.2 or 24.15)
- npm 10+

## Setup

```bash
npm install
vercel env pull .env.local   # Development env vars (needs `vercel link`)
npm run db:up                # apply migrations to the database in .env.local
```

### Environment variables

| Variable                | Where                       | Purpose                                                                                |
| ----------------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| `DATABASE_URL`          | All envs (Neon integration) | Pooled Neon URL used by the app                                                        |
| `DATABASE_URL_UNPOOLED` | All envs (Neon integration) | Direct Neon URL used by dbmate                                                         |
| `BETTER_AUTH_SECRET`    | All envs                    | Signs session cookies. `openssl rand -base64 32`; use a different value for Production |
| `BETTER_AUTH_URL`       | Production only, optional   | Canonical URL once there is a custom domain                                            |

Local development uses the Neon `dev` branch through Vercel's Development environment. Preview deployments get their own Neon branch from the integration.

## Run

```bash
npm run dev
```

- App: http://localhost:3000
- API: http://localhost:3000/api/health

## Scripts

| Script                              | Description                              |
| ----------------------------------- | ---------------------------------------- |
| `npm run dev`                       | Start the dev server (Turbopack)         |
| `npm run build` / `npm start`       | Production build (Turbopack) and server  |
| `npm test`                          | Run Vitest                               |
| `npm run typecheck`                 | Generate Next route types and type-check |
| `npm run lint` / `npm run lint:fix` | ESLint (with `@next/eslint-plugin-next`) |
| `npm run format`                    | Prettier                                 |

## Authentication

Email/password accounts use self-hosted [Better Auth](https://www.better-auth.com), with users and sessions stored in Postgres (the `auth` schema, see Database). `lib/auth.ts` is the server config, `lib/authClient.ts` the browser client, and `app/api/auth/[...all]/route.ts` serves the endpoints.

Every route needs a signed-in user except a short public allowlist: `/login`, `/signup`, `/api/auth/*` and `/api/health`. There are three layers:

1. `proxy.ts` checks only that a session cookie exists (no database call). Signed-out page requests redirect to `/login`, and signed-out `/api/*` calls get a `401`. This is a fast redirect, not the security boundary.
2. `app/(app)/layout.tsx` calls `requireUser()` (`features/auth/session.ts`), which validates the session against the database.
3. Every Server Action, route handler and data fetcher must call `requireUser()` / `getSession()` itself. Don't rely on the proxy or layouts: layouts don't re-run on client-side navigation.

Sign-in and sign-up are rate limited per client IP (5 per minute), with counters stored in `auth.rate_limits`.

## Database

[dbmate](https://github.com/amacneil/dbmate) owns the schema. Migrations live in `db/migrations`, and `db/schema.sql` is regenerated on every migrate or rollback (it needs `pg_dump`) and committed so schema changes show up in review.

| Script                     | Description                         |
| -------------------------- | ----------------------------------- |
| `npm run db:new -- <name>` | Create a migration file             |
| `npm run db:up`            | Apply pending migrations            |
| `npm run db:status`        | Show applied and pending migrations |
| `npm run db:rollback`      | Roll back the latest migration      |

The scripts read `DATABASE_URL_UNPOOLED` from `.env.local`, because dbmate shouldn't go through Neon's connection pooler.

### Conventions

- Table and column names are snake_case, table names are plural, and primary keys are `uuid` (`gen_random_uuid()`).
- Better Auth's tables live in the `auth` schema: `users`, `sessions`, `accounts`, `verifications` and `rate_limits`. Its defaults are camelCase and singular, so `lib/auth.ts` maps every table and column (`modelName` / `fields`). Better Auth's `casing` option isn't implemented in 1.7.
- App tables live in `public` and reference `auth.users (id)`. Keep app data, especially health data, out of Better Auth's tables: fields added there are returned in session responses by default. A `public.profiles` table (created by a trigger on `auth.users`, with a backfill) arrives with the first app-owned user field.

### Changing the schema

- **Better Auth schema changes** (upgrades, new plugins): first add `modelName` / `fields` mappings in `lib/auth.ts` for any new tables and columns. Then run `npx auth@latest generate --config lib/auth.ts` against an up-to-date database to get the SQL diff, and paste it into a new `db:new` migration. Never run `npx auth migrate`, which changes the database outside dbmate's history.
- **A migration that hasn't reached production** is edited in place rather than fixed by a second migration. Roll it back on `dev` with the old file before rewriting it.
- **Production** is migrated by hand, not during the Vercel build: `npx dbmate --url "<production unpooled URL>" up`. Preview branches created afterwards inherit the tables and `schema_migrations` from production.

## Testing

Tests use Vitest and Testing Library. `test/renderApp.tsx` renders the real `app/` pages and layouts behind an in-memory stand-in for the Next.js router (`next/navigation` and `next/link` are mocked in `test/setup.ts`), so tests can log in and click through the app. Async server layouts are resolved before rendering, like the App Router does. Better Auth is replaced by an in-memory fake (`test/fakeAuth.ts`) seeded with `jane@example.com` / `password123`. `proxy.test.ts` and `features/auth/session.test.ts` cover the proxy and the real session check.

## Current scope

- Email/password sign-up, login and logout with server-side sessions. No email verification or password reset yet. Google/Facebook buttons are disabled placeholders.
- Pages show mock data from `features/*/mockData.ts`.
