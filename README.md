# Alta Health

Responsive web app for Alta Health. npm-workspaces monorepo with a React client and an Express API.

## Structure

```
client/   React + Vite + TypeScript + Tailwind CSS (mobile-first SPA)
server/   Express + TypeScript API
```

Client code is organized by feature (`src/features/auth`, `src/features/landing`) with shared UI in `src/components`, routing in `src/routes`, and design tokens in `src/index.css` (`@theme`).

## Requirements

- Node.js 24 LTS (see `.nvmrc`; minimum 22.22.2 or 24.15)
- npm 10+

## Setup

```bash
npm install
cp server/.env.example server/.env
```

## Run

```bash
npm run dev
```

- Client: http://localhost:5173 (proxies `/api` to the API)
- API: http://localhost:4000 (`GET /api/health`)

## Scripts (run from the repo root)

| Script                              | Description                   |
| ----------------------------------- | ----------------------------- |
| `npm run dev`                       | Start API and client together |
| `npm run build`                     | Build both workspaces         |
| `npm test`                          | Run Vitest in both workspaces |
| `npm run typecheck`                 | Type-check both workspaces    |
| `npm run lint` / `npm run lint:fix` | ESLint                        |
| `npm run format`                    | Prettier                      |

## Current scope

- Mock login and signup pages. Any valid input logs in, with no server call. Google/Facebook buttons are disabled placeholders.
- Auth state is in-memory only (`features/auth`), so it resets on refresh.
- Landing page is an empty shell behind a route guard. Cards will be added once the design is provided.
