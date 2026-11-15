# Alta Health

Responsive web app for Alta Health, built with Next.js 16 (App Router, Turbopack), React 19, TypeScript and Tailwind CSS 4.

## Structure

```
app/          Routes only (App Router)
  (auth)/       /login, /signup
  (app)/        Signed-in pages; layout.tsx guards them and renders the app shell
    areas/        Wellness area pages sharing the areas sidebar layout
  api/          Route handlers (GET /api/health)
  [...slug]/    Unknown URLs redirect to /
components/   Shared UI (charts, buttons, nav, app shell)
features/     Feature code: auth, landing, myHealth, appointments, areas
lib/          Route paths, accent styles, health status
assets/       Images imported by components
test/         Vitest setup and the in-memory router used by tests
design/       Design references (not shipped)
```

Components are Server Components by default. Only the interactive pieces (forms, tabs, nav, app shell, auth) are marked `'use client'`. Design tokens live in `app/globals.css` (`@theme`). Imports use the `@/` alias for the project root.

## Requirements

- Node.js 24 LTS (see `.nvmrc`; minimum 22.22.2 or 24.15)
- npm 10+

## Setup

```bash
npm install
```

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

## Testing

Tests use Vitest and Testing Library. `test/renderApp.tsx` renders the real `app/` pages and layouts behind an in-memory stand-in for the Next.js router (`next/navigation` and `next/link` are mocked in `test/setup.ts`), so tests can log in and click through the app.

## Current scope

- Mock login and signup pages. Any valid input logs in, with no server call. Google/Facebook buttons are disabled placeholders.
- Auth state is in-memory only (`features/auth`), so it resets on a full page load, and signed-in pages redirect to `/login` when rendered on the server.
- Pages show mock data from `features/*/mockData.ts`.
