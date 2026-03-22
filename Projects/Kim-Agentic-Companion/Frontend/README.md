# Kim Frontend

Frontend autonome du projet Kim Agentic Companion.

## Etat actuel (2026-03-22)
- Etat reel confirme sur `main`: F5 implemente et deploye en staging.
- F1 complete: foundation + chat.
- F2 complete: tabs fonctionnels.
- F3 complete: voice.
- F4 complete: scene 3D de base via React Three Fiber.
- F5 attend une verification independante avant ouverture de F6.

## Direction validee
- Conserver `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`.
- Ne pas introduire Babylon.js.
- Ne pas introduire Unity WebGL.
- Viser une presence type Replika-like avec avatar `GLB`, animation credible, PBR propre, post-processing mesure, wardrobe, room decoration et perf mobile.
- Reference: `../Livrables/Frontend-Fidelity-Direction-2026-03-21.md`.

## Stack
- Next.js 15 + React 19
- Three.js + React Three Fiber + drei
- Zustand (scene / 3D)
- Jotai (etat app)
- Tailwind CSS
- Vitest + Playwright

## Ce qui existe deja
- Chat fonctionnel branche sur le backend staging
- Pages Memory, Profile, Activities, Diary
- Voice input / output
- Scene 3D de base et presence visuelle actuelle
- Avatar `GLB` local servi depuis `public/models/kim-avatar.glb`
- Fallback runtime sur `/models/kim-avatar.glb`
- Wardrobe et room decoration baseline
- Stack React 19 / R3F / Drei / postprocessing alignee
- Design system galaxy / glassmorphism

## Etat de phase
- F5 implementee en staging
- verification par un second agent avant F6
- prochaine phase apres verification: F6 -- Auth + Tools + Settings

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Configurer `NEXT_PUBLIC_API_URL` vers le backend voulu.

## Commandes

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm test` | Unit tests |
| `npm run e2e` | Playwright tests |

## Variables d environnement

| Var | Description |
|-----|-------------|
| `NEXT_PUBLIC_API_URL` | URL du backend API |
| `NEXT_PUBLIC_APP_NAME` | Nom affiche dans UI |

## Architecture

```
src/
  app/            pages Next.js
  components/     chat, avatar, scene, layout, sidebar, ui, voice
  lib/            API client, auth, config, helpers 3D
  stores/         Jotai + Zustand
  hooks/          useChat, useAuth, useTools, useVoice, useTTS
```

## Documents a lire avant intervention
- `AGENT-INSTRUCTIONS.md`
- `../Todo.md`
- `../Roadmap.md`
- `../Livrables/Frontend-Implementation-Plan.md`
- `../Livrables/Frontend-Fidelity-Direction-2026-03-21.md`

*Mis a jour: 2026-03-22*
