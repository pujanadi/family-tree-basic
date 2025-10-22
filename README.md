# Family Tree Explorer

Interactive family tree visualiser built with Next.js, React, and Tailwind CSS. The app renders hierarchical relationships, highlights spouses side by side, supports search-driven focus, light/dark/sepia themes, lazy rendering for large trees, and PNG exports of the visible view.

## Features
- Hierarchical tree layout with pan + zoom powered by `react-d3-tree`.
- Node cards display name, birth and death years, and paired spouses.
- Collapse/expand controls on every branch.
- Keyboard-friendly search with highlight + auto-focus.
- Theme toggle (light, dark, sepia) persisted via `next-themes`.
- Client-side PNG export using `html-to-image`.
- Gentle ambient styling with Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the demo using the sample dataset from `data/sample.json`.

## Key paths
- `pages/index.tsx` - main experience and state wiring.
- `components/TreeCanvas.tsx` - tree renderer, pan/zoom wrapper, export hook.
- `components/Toolbar.tsx` - search, theme toggle, export, and quick actions.
- `lib/tree-utils.ts` - helpers for layout data, search, and ancestor expansion.
- `data/sample.json` - starter family record.

## Exporting
Use the **Export PNG** button in the toolbar. The file automatically downloads with a timestamped name and respects the current theme backdrop.

## Customising data
Update `data/sample.json` or replace the fetch in `pages/index.tsx` with an API call or dynamic data source that matches the `FamilyTree` interface found in `lib/types.ts`.

## Authentication (Auth.js Core)
This project now uses the Auth.js core runtime instead of the legacy `next-auth` package. The `/api/auth/[...nextauth]` route proxies requests to `@auth/core`, and the `/login` page consumes the generated provider list.

To enable OAuth providers locally:

1. Copy `.env.example` to `.env.local` and fill in provider credentials (GitHub, Google) plus `NEXTAUTH_SECRET`.
2. Install any provider-specific peer dependencies that Auth.js requires (for example, GitHub and Google providers are bundled).
3. Start the dev server and visit `/login` to initiate sign-in. When `NEXT_PUBLIC_DEMO_MODE=true`, the page also exposes a "Continue as demo" button for local testing without OAuth.

Remember to configure redirect URLs in your OAuth provider dashboard (e.g., GitHub callback → `http://localhost:3000/api/auth/callback/github`).
