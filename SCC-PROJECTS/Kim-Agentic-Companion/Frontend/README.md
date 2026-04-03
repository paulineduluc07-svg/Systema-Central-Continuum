# Kim Frontend

Frontend autonome du projet Kim.

## Etat actuel (2026-03-22)
- Etat reel: prototype frontend redeploye sur staging, non signe cote produit.
- Ce frontend doit servir un AI agent ultra-competent, pas une app de compagnie.
- Le chat semble etre le parcours le plus convaincant a ce stade.
- Auth, tools, settings et plusieurs surfaces hors chat demandent encore des ajustements importants.
- Le rendu visuel est juge tres loin de la vision produit, ordre de grandeur estime: ~10%.
- Validation locale recente: `npm test`, `npm run typecheck`, `npm run build`.
- `F7` reste bloquee tant que le frontend coeur n est pas remis a niveau.

## Direction validee
- Conserver `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`.
- Ne pas introduire Babylon.js.
- Ne pas introduire Unity WebGL.
- Viser un frontend d AI agent premium avec avatar `GLB`, animation credible, PBR propre, post-processing mesure et perf mobile.
- Utiliser Replika et certains jeux video comme references de qualite visuelle, de presence 3D et de finition seulement.
- Garder wardrobe et room decoration comme options secondaires tant que la presence Kim et la lisibilite produit ne sont pas reglees.
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
- AuthGate navigateur avec token local et bootstrap de session
- ToolsPanel avec PermissionBadge, ConfirmationDialog et invocation directe
- Settings panel pour theme, TTS et etat de compte
- Memoire locale des permissions outils, reutilisee aussi pour les commandes chat `/tool ...`

## Ce qui n est pas au niveau produit aujourd hui
- Les surfaces hors chat ne sont pas encore considerees comme suffisamment solides
- Le flux auth / tools / settings n est pas signe
- La scene, la presence Kim et l identite visuelle sont encore loin de la cible AI agent premium
- Ne pas utiliser la presence de composants comme preuve que la vision est atteinte

## Etat de phase
- chat = surface la plus avancee
- F5 non atteinte cote produit
- F6 non signee cote produit
- F7 bloquee / non ouverte

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
- `../Livrables/Product-Positioning-2026-03-22.md`
- `../Livrables/Frontend-Rebaseline-2026-03-22.md`
- `../Livrables/Frontend-Implementation-Plan.md`
- `../Livrables/Frontend-Fidelity-Direction-2026-03-21.md`

*Mis a jour: 2026-03-22*
