# Kim Agentic Companion -- Frontend Implementation Plan

## Statut de reference (2026-03-21)
- Etat reel confirme sur `main`: le frontend est a la fin de F4 et avant F5.
- Le frontend autonome existe deja dans `Frontend/`.
- Les phases F1, F2, F3 et F4 sont considerees completees.
- Ce document sert maintenant a cadrer la suite F5 -> F7 sans reouvrir les phases deja closes.

## Direction validee
- Garder `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`.
- Ne pas introduire Babylon.js.
- Ne pas introduire Unity WebGL.
- Faire evoluer la scene F4 actuelle vers un rendu compagnon Replika-like.
- Cible: avatar principal `GLB`, presence animee, PBR propre, post-processing mesure, wardrobe, room decoration, perf mobile.
- Reference detaillee: `Frontend-Fidelity-Direction-2026-03-21.md`.

## Base deja livree

### F1 -- Foundation + Chat
- Frontend Next.js autonome
- API client type
- Design system galaxy / glass
- Chat fonctionnel

### F2 -- Tabs
- Memory
- Profile
- Activities
- Diary

### F3 -- Voice
- Speech-to-Text navigateur
- Text-to-Speech via backend
- Push-to-talk et auto-TTS

### F4 -- Scene Foundation
- Three.js + React Three Fiber en place
- Starfield, lights et room baseline
- Presence visuelle actuelle integree a la scene

## Phases restantes

### F5 -- Fidelity + Customization
**Objectif**: transformer la base F4 en presentation compagnon plus credible sans changer de stack.

**Livrables attendus**:
- pipeline avatar principal en `GLB`
- etats d animation minimaux: idle, greet, listen, speak, react
- materiaux PBR propres et coherents
- post-processing mesure et optionnel
- wardrobe par slots
- room decoration baseline
- perf mobile controlee pendant toute la phase

**Contraintes**:
- compression des assets obligatoire
- garder un fallback degrade si la 3D ne passe pas
- chaque effet visuel doit justifier son cout GPU

### F6 -- Auth UX + Tools UI + Settings
**Objectif**: fermer les trous UX avant la phase mobile.

**Livrables attendus**:
- login UX plus propre
- guard d acces
- UI de permissions MCP
- settings utilisateur

### F7 -- PWA + Mobile
**Objectif**: rendre le frontend installable puis emballable en natif.

**Livrables attendus**:
- PWA installable
- Capacitor iOS / Android
- shell offline
- packaging stores

## Contraintes d architecture
- `Frontend/` reste une application separee de `Code/`.
- Zero import depuis les sources backend.
- Le frontend appelle le backend via `NEXT_PUBLIC_API_URL`.
- Les types frontend qui refletent le backend restent synchronises manuellement.

## Protocole multi-agent
1. Un agent implemente une phase ou un sous-lot borne.
2. Un autre agent verifie ce lot avant de valider la phase.
3. La verification couvre au minimum le scope, la coherence documentaire et les validations techniques utiles.
4. Une phase frontend n est marquee complete qu apres verification.
5. `README.md`, `AGENT-INSTRUCTIONS.md`, `Roadmap.md`, `Todo.md`, `Frontend/README.md` et `Frontend/AGENT-INSTRUCTIONS.md` doivent rester synchronises.

## Ordre de progression
`F5 -> verification -> F6 -> verification -> F7`

## Rappel de travail
- Partir du frontend actuel, pas d une reconstruction.
- Prioriser la clarte de phase, la coherence de doc et la tenue mobile.
- Utiliser `Frontend-Fidelity-Direction-2026-03-21.md` comme reference de direction frontend.