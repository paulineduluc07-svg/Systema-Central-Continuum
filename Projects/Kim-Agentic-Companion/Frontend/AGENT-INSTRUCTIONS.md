# Agent Instructions -- Kim Frontend

> Read BEFORE any work on `Frontend/`. See parent `../AGENT-INSTRUCTIONS.md` for global rules.

## Current state (2026-03-22)
- Etat reel confirme sur `main`: F5 implemente et deploye en staging.
- Frontend standalone deja en place.
- F1 complete: foundation + chat.
- F2 complete: tabs fonctionnels.
- F3 complete: voice.
- F4 complete: scene Three.js / React Three Fiber de base.
- Verification independante F5 requise avant F6.

## Validated direction
- Keep `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`.
- Do not introduce Babylon.js.
- Do not introduce Unity WebGL.
- Build toward a Replika-like companion presentation with:
  - primary `GLB` avatar
  - credible animated presence
  - clean PBR materials
  - measured post-processing
  - wardrobe
  - room decoration
  - mobile performance discipline
- Reference: `../Livrables/Frontend-Fidelity-Direction-2026-03-21.md`.

## What exists already
- Next.js 15 + React 19 app scaffold
- Jotai stores for app state
- Zustand scene state for 3D flow
- Chat flow wired to backend API
- Memory / Profile / Activities / Diary pages
- Voice input and TTS playback hooks
- Galaxy scene foundation with current Kim presence
- Local `GLB` avatar served from `public/models/kim-avatar.glb`
- Runtime fallback to `/models/kim-avatar.glb`
- Wardrobe slot system and room decoration baseline
- React 19 / R3F / Drei / postprocessing stack aligned and stable
- Galaxy / glass design language

## What does NOT exist yet
- F6 auth UX, MCP tools UX and settings
- F7 PWA / Capacitor packaging

## Current gate
1. Verify F5 with a second agent.
2. Confirm end-to-end staging behavior with a real API token.
3. Only then open F6.

## Multi-agent phase gate
1. One agent implements the current phase or sub-lot.
2. A different agent verifies it before the project advances.
3. Do not mark F5 complete until verification updates the shared docs.
4. Do not open F6 before F5 verification is done.

## Key design decisions
- Frontend remains fully separate from `../Code/`.
- No imports from backend source files.
- `NEXT_PUBLIC_API_URL` points to the backend.
- Keep a graceful fallback path if 3D capabilities are unavailable.

## Env vars required
- `NEXT_PUBLIC_API_URL` -- backend URL
- `NEXT_PUBLIC_APP_NAME` -- UI companion name

## Dev commands
```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

## Read before editing
- `README.md`
- `../Todo.md`
- `../Roadmap.md`
- `../Livrables/Frontend-Implementation-Plan.md`
- `../Livrables/Frontend-Fidelity-Direction-2026-03-21.md`
