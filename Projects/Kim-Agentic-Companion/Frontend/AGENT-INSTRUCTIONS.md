# Agent Instructions -- Kim Frontend

> Read BEFORE any work on `Frontend/`. See parent `../AGENT-INSTRUCTIONS.md` for global rules.

## Current state (2026-03-21)
- Etat reel confirme sur `main`: fin F4 / pre-F5.
- Frontend standalone deja en place.
- F1 complete: foundation + chat.
- F2 complete: tabs fonctionnels.
- F3 complete: voice.
- F4 complete: scene Three.js / React Three Fiber de base.
- Prochaine phase executable: F5.

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
- Galaxy / glass design language

## What does NOT exist yet
- F5 avatar `GLB` production pipeline in the main scene
- F5 wardrobe slot system and initial catalog
- F5 room decoration baseline
- F5 dedicated mobile perf pass
- F6 auth UX, MCP tools UX and settings
- F7 PWA / Capacitor packaging

## Next phase: F5 -- Fidelity + Customization
Priority order:
1. Integrate the main `GLB` avatar into the existing scene.
2. Define minimal animation states: idle, greet, listen, speak, react.
3. Upgrade materials / lighting toward controlled PBR.
4. Add measured post-processing only if it improves presence.
5. Add wardrobe slots.
6. Add room decoration baseline and presets.
7. Verify mobile performance before calling F5 complete.

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