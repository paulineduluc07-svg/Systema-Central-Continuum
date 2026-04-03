# Agent Instructions -- Kim Frontend

> Read BEFORE any work on `Frontend/`. See parent `../AGENT-INSTRUCTIONS.md` for global rules.

## Current state (2026-03-22)
- Etat reel: prototype frontend redeploye sur staging, non signe cote produit.
- Frontend standalone deja en place.
- Ce frontend doit servir un AI agent execution-first, pas une app de compagnie.
- Le chat semble etre le parcours le plus convaincant a ce stade.
- Le reste du frontend demande encore une reprise importante.
- Le rendu visuel est juge tres loin de la cible produit, ordre de grandeur estime: ~10%.
- Validation locale recente: `npm test`, `npm run typecheck`, `npm run build`.
- `F7` est bloquee tant que le frontend coeur n est pas recadre.

## Validated direction
- Keep `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`.
- Do not introduce Babylon.js.
- Do not introduce Unity WebGL.
- Build toward a premium AI agent presentation with:
  - primary `GLB` avatar
  - credible animated presence
  - clean PBR materials
  - measured post-processing
  - mobile performance discipline
- Use Replika and selected video-game references for visual quality and 3D presence only, not for a relationship-style positioning.
- Treat wardrobe and room decoration as secondary extensions, not as the core product signal.
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
- AuthGate with local token persistence and session bootstrap
- ToolsPanel with confirmation flow and client-side permission memory
- Settings panel for theme, TTS and account/session state
- Slash-tool chat flow reuses stored `always` / `denied` tool permissions

## What is NOT product-ready yet
- Overall frontend sign-off
- Auth / tools / settings quality bar
- Visual identity, presence, and perceived premium quality
- Trust in non-chat flows
- F7 PWA / Capacitor packaging

## Current gate
1. Use the latest product feedback as truth source, not code presence.
2. Rebaseline the frontend against the target experience.
3. Do not open F7 before the core frontend is judged credible.

## Multi-agent phase gate
1. One agent implements the current phase or sub-lot.
2. A different agent verifies it before the project advances.
3. Do not mark F5 or F6 complete on the product side until verification updates the shared docs.
4. Do not open F7 before the frontend core is signed off.

## Key design decisions
- Frontend remains fully separate from `../Code/`.
- No imports from backend source files.
- `NEXT_PUBLIC_API_URL` points to the backend.
- Keep a graceful fallback path if 3D capabilities are unavailable.

## Env vars required
- `NEXT_PUBLIC_API_URL` -- backend URL
- `NEXT_PUBLIC_APP_NAME` -- UI product name

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
- `../Livrables/Product-Positioning-2026-03-22.md`
- `../Livrables/Frontend-Rebaseline-2026-03-22.md`
- `../Livrables/Frontend-Implementation-Plan.md`
- `../Livrables/Frontend-Fidelity-Direction-2026-03-21.md`
