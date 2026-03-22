# Kim Frontend

Frontend autonome du projet Kim Agentic Companion.

## Etat actuel (2026-03-21)
- Etat reel confirme sur `main`: fin F4 / pre-F5.
- F1 complete: foundation + chat.
- F2 complete: tabs fonctionnels.
- F3 complete: voice.
- F4 complete: scene 3D de base via React Three Fiber.
- F5 est la prochaine phase executable.

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
- Design system galaxy / glassmorphism

## Phase suivante: F5 -- Fidelity + Customization
- pipeline avatar principal en `GLB`
- etats d animation minimaux
- materiaux PBR et post-processing mesure
- wardrobe par slots
- room decoration
- verification par un second agent avant F6

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

*Mis a jour: 2026-03-21*