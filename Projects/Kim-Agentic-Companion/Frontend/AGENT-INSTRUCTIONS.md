# Agent Instructions — Kim Frontend

> Read BEFORE any work on Frontend/. See parent AGENT-INSTRUCTIONS.md for global rules.

## Current state (2026-03-21)

**Phase F1 complete** — Foundation + Chat parity.

### What exists
- Next.js 15 + React 19 scaffold
- Jotai stores: authStore, chatStore, toolStore
- Hooks: useAuth, useChat, useTools
- UI components: GlassPanel, Button, Input, ChatBubble, Badge, TabBar
- Layout: CosmosBackground, TopNav, AppShell
- Chat: ChatPanel, ChatLog, ChatInput, TypingIndicator
- Avatar: AvatarStage (2D orb + image)
- Sidebar: InfoCards, ToolList
- API client: KimApiClient (all backend endpoints typed)
- Galaxy glassmorphism theme matching current staging UI

### What does NOT exist yet
- F2: Memory, Profile, Activities, Diary tabs
- F3: Voice (STT/TTS)
- F4: 3D scene (Three.js)
- F5: Wardrobe/room customisation
- F6: Login page, AuthGuard, MCP tools UI
- F7: PWA, Capacitor

## Next phase: F2 — Functional Tabs

See `../Livrables/Frontend-Implementation-Plan.md` Phase 2 for full spec.

Files to create:
- `src/app/(tabs)/memory/page.tsx`
- `src/app/(tabs)/profile/page.tsx`
- `src/app/(tabs)/activities/page.tsx`
- `src/app/(tabs)/diary/page.tsx`
- `src/components/memory/`, `profile/`, `activities/`, `diary/`
- `src/stores/memoryStore.ts`, `profileStore.ts`, `activityStore.ts`
- `src/hooks/useMemory.ts`, `useActivities.ts`

## Key design decisions

- **Auth**: tokenAtom in Jotai, synced to localStorage via useAuth hook. Backend allows no-token requests if API_AUTH_TOKEN not set.
- **Session**: created lazily on first chat message
- **userId**: generated once, stored in localStorage via getUserId()
- **CORS**: frontend calls backend cross-origin — if issues arise, check backend CORS headers

## Env vars required
- `NEXT_PUBLIC_API_URL` — backend URL (default: staging)
- `NEXT_PUBLIC_APP_NAME` — companion name (default: Kim)

## Dev commands
```bash
npm install
npm run dev        # localhost:3000
npm run typecheck  # TS check
npm test           # vitest
npm run build      # production build
```

## Deploy
Deploy Frontend/ as its own Vercel project (separate from backend).
Set env vars on Vercel dashboard.