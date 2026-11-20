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
# Create .env.owner with DATABASE_OWNER_URL: the dev branch's direct owner URL (Neon console)
npm run db:up                # apply migrations to the dev branch
```

### Environment variables

| Variable             | Where                           | Purpose                                                                                                                       |
| -------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`       | All envs                        | Pooled Neon URL for the unprivileged `app` role, used by Better Auth and the app. Set with `db/set-app-url.sh` (see Database) |
| `DATABASE_OWNER_URL` | `.env.owner` only, never Vercel | Direct Neon URL for the owner, used by dbmate and admin work                                                                  |
| `BETTER_AUTH_SECRET` | All envs                        | Signs session cookies. `openssl rand -base64 32`, a different value in each environment                                       |
| `BETTER_AUTH_URL`    | Production only, optional       | Canonical URL once there is a custom domain                                                                                   |

Each environment has its own Neon branch: `dev` for local development (through Vercel's Development environment), one shared `preview` branch for every preview deployment (branched from `dev`, so it holds test data only) and `main` for production. The project doesn't use the Vercel–Neon integration, which would put the owner's credentials in every environment and copy production into each preview.

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
| `npm run test:db`                   | Database tests (needs Docker)            |
| `npm run typecheck`                 | Generate Next route types and type-check |
| `npm run lint` / `npm run lint:fix` | ESLint (with `@next/eslint-plugin-next`) |
| `npm run format`                    | Prettier                                 |

## Authentication

Email/password accounts use self-hosted [Better Auth](https://www.better-auth.com), with users and sessions stored in Postgres (the `auth` schema, see Database). `lib/auth.ts` is the server config, `lib/authClient.ts` the browser client, and `app/api/auth/[...all]/route.ts` serves the endpoints.

Every route needs a signed-in user except a short public allowlist: `/login`, `/signup`, `/api/auth/*` and `/api/health`. There are three layers:

1. `proxy.ts` checks only that a session cookie exists (no database call). Signed-out page requests redirect to `/login`, and signed-out `/api/*` calls get a `401`. This is a fast redirect, not the security boundary.
2. `app/(app)/layout.tsx` calls `requireUser()` (`features/auth/session.ts`), which validates the session against the database.
3. Every Server Action, route handler and data fetcher must call `requireUser()` / `getSession()` itself. Don't rely on the proxy or layouts: layouts don't re-run on client-side navigation. Reading user data through `withUser` (see Access control) does this, and RLS limits each query to the user's rows.

Sign-in and sign-up are rate limited per client IP (5 per minute), with counters stored in `auth.rate_limits`.

## Database

[dbmate](https://github.com/amacneil/dbmate) owns the schema. Migrations live in `db/migrations`, and `db/schema.sql` is regenerated on every migrate or rollback (it needs `pg_dump`) and committed so schema changes show up in review.

| Script                     | Description                         |
| -------------------------- | ----------------------------------- |
| `npm run db:new -- <name>` | Create a migration file             |
| `npm run db:up`            | Apply pending migrations            |
| `npm run db:status`        | Show applied and pending migrations |
| `npm run db:rollback`      | Roll back the latest migration      |

The scripts read `DATABASE_OWNER_URL` from `.env.owner`: migrations need the owner, and dbmate shouldn't go through Neon's connection pooler. Next.js never loads `.env.owner`, so the local app runs with the same limited rights as production.

### Conventions

- Table and column names are snake_case, table names are plural, and primary keys are `uuid` (`gen_random_uuid()`).
- Better Auth's tables live in the `auth` schema: `users`, `sessions`, `accounts`, `verifications` and `rate_limits`. Its defaults are camelCase and singular, so `lib/auth.ts` maps every table and column (`modelName` / `fields`). Better Auth's `casing` option isn't implemented in 1.7.
- App tables live in `public` and reference `auth.users (id)`. Keep app data, especially health data, out of Better Auth's tables: fields added there are returned in session responses by default. A `public.profiles` table (created by a trigger on `auth.users`, with a backfill) arrives with the first app-owned user field.

### Access control

The app connects as `app` (`DATABASE_URL`), a role that owns nothing, can't change the schema and doesn't bypass RLS. The owner (`neondb_owner`, which bypasses RLS) is used only locally, for migrations. The `app_role` migration sets this up.

- **User data goes through `withUser`** (`features/auth/userDb.ts`). It runs one transaction with the signed-in user's id in `app.user_id`, and RLS limits every query in it to that user's rows. Queries don't filter by `user_id`, and inserts don't pass it. Queries that must succeed or fail together go in one call. `asUser` (`lib/db.ts`) does the same for an explicit user id.

  ```ts
  const appointments = await withUser((tx) => tx.selectFrom('appointments').selectAll().execute());
  ```

- **Every table that holds a user's data** follows this pattern. `app_user_id()` raises an error when no user is set, so a query that skips `withUser` fails instead of returning nothing. Wrapping it in `(select …)` makes Postgres call it once per query instead of once per row. New tables get `app`'s grants automatically.

  ```sql
  create table public.appointments (
    id uuid default pg_catalog.gen_random_uuid() not null primary key,
    user_id uuid not null default public.app_user_id()
      references auth.users (id) on delete cascade,
    …
  );
  create index appointments_user_id_idx on public.appointments (user_id);
  alter table public.appointments enable row level security;
  create policy appointments_owner on public.appointments
    using (user_id = (select public.app_user_id()))
    with check (user_id = (select public.app_user_id()));
  ```

- Views need `security_invoker = true`, or they bypass RLS. `security definer` functions bypass it too, so use them only for narrow, reviewed cases.
- `npm run test:db` checks all of this against a real Postgres, including a guard that fails when a `public` table has no RLS policy.
- `db/set-app-url.sh <production|preview|development>` sets `app`'s password on that environment's Neon branch and stores the matching `DATABASE_URL` in Vercel, without printing either. Run it once per branch after migrating, after resetting a branch from its parent (which copies the parent's password), and to rotate the password.
- What RLS doesn't cover: injected SQL could set `app.user_id` itself, so Kysely's parameterized queries are the defense there. Better Auth shares the `app` role, so app code could read `auth.*`; a separate role for Better Auth is the first hardening step if that matters.

### Changing the schema

- **Better Auth schema changes** (upgrades, new plugins): first add `modelName` / `fields` mappings in `lib/auth.ts` for any new tables and columns. Then run `npx auth@latest generate --config lib/auth.ts` against an up-to-date database to get the SQL diff, and paste it into a new `db:new` migration. Never run `npx auth migrate`, which changes the database outside dbmate's history.
- **A migration that hasn't reached production** is edited in place rather than fixed by a second migration. Roll it back on `dev` with the old file before rewriting it.
- **Production and `preview`** are migrated by hand, not during the Vercel build: `npx dbmate --url "<the branch's direct owner URL>" --no-dump-schema up` (so `db/schema.sql` isn't rewritten from them). Migrate `preview` together with `dev`. Resetting `preview` from `dev` works too, but rerun `db/set-app-url.sh preview` afterwards.
- **Migrate before deploying.** Better Auth checks its tables once per server instance and keeps a failed result, so a deployment that served requests before its migration ran keeps failing after it: redeploy it.

## Testing

Tests use Vitest and Testing Library. `test/renderApp.tsx` renders the real `app/` pages and layouts behind an in-memory stand-in for the Next.js router (`next/navigation` and `next/link` are mocked in `test/setup.ts`), so tests can log in and click through the app. Async server layouts are resolved before rendering, like the App Router does. Better Auth is replaced by an in-memory fake (`test/fakeAuth.ts`) seeded with `jane@example.com` / `password123`. `proxy.test.ts` and `features/auth/session.test.ts` cover the proxy and the real session check.

`npm run test:db` (needs Docker) runs `db/rls.test.ts` against Postgres 18, Neon's version, in a throwaway container. It migrates as a Neon-like owner (up, rollback, up), then checks the roles and RLS as `app`.

## Current scope

- Email/password sign-up, login and logout with server-side sessions. No email verification or password reset yet. Google/Facebook buttons are disabled placeholders.
- Pages show mock data from `features/*/mockData.ts`.
