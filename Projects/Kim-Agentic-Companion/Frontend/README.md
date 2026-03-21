# Kim Frontend

React frontend for Kim Agentic Companion.

## Stack
- Next.js 15 + React 19
- Jotai (state)
- Tailwind CSS (glassmorphism galaxy theme)
- Vitest + Playwright (tests)

## Setup

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL
npm install
npm run dev
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm test` | Run unit tests |
| `npm run e2e` | Run Playwright tests |

## Env vars

| Var | Default | Description |
|-----|---------|-------------|
| `NEXT_PUBLIC_API_URL` | staging backend | Backend API URL |
| `NEXT_PUBLIC_APP_NAME` | `Kim` | Companion name shown in UI |

## Architecture

```
src/
  app/            Next.js pages (layout, page, globals.css)
  components/     UI (chat/, avatar/, scene/, layout/, sidebar/, ui/)
  lib/            API client, auth, config
  stores/         Jotai atoms (auth, chat, tools)
  hooks/          useChat, useAuth, useTools
```

## Phase status
- [x] F1 — Foundation + Chat (current)
- [ ] F2 — Tabs (Memory, Profile, Activities, Diary)
- [ ] F3 — Voice
- [ ] F4 — 3D Scene
- [ ] F5 — Customisation
- [ ] F6 — Auth + Tools UI
- [ ] F7 — PWA + Mobile

## Backend
Backend API: https://kim-agentic-companion-staging.vercel.app
Set `NEXT_PUBLIC_API_URL` to point to it.

*Phase F1 completed: 2026-03-21*