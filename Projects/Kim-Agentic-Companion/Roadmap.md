# Roadmap -- Kim Agentic Companion

> Vision, etapes et statut reel.

---

## Vision
Construire une experience compagnon IA proche Replika, mais orientee execution utile: Kim dialogue, se souvient et agit via MCP avec supervision utilisateur.

## Etat actuel (confirme sur `main`)
- [x] API backend deployee sur Vercel avec auth, memoire, outils MCP et voice
- [x] CORS backend staging corrige pour `https://kim-frontend-staging.vercel.app`
- [x] Frontend standalone dans `Frontend/`
- [x] F1 complete: foundation + chat parity
- [x] F2 complete: tabs fonctionnels
- [x] F3 complete: voice
- [x] F4 complete: scene R3F de base et presence visuelle actuelle
- [x] F5 implemente en staging: avatar `GLB` local, wardrobe, room decoration, stack R3F React 19 stable
- [ ] Verification independante F5 avant ouverture officielle de F6

## Phases backend restantes
- [ ] Phase 3 -- Orchestration agentique plus riche (skills composees, workflows multi-outils)
- [ ] Phase 4 -- Durcissement securite + observabilite + beta publique

## Direction frontend validee (2026-03-21)
- Garder `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`
- Ne pas introduire Babylon.js
- Ne pas introduire Unity WebGL
- Evoluer la base F4 actuelle vers un rendu compagnon Replika-like
- Cible F5: avatar `GLB`, presence animee, PBR propre, post-processing mesure, wardrobe, room decoration, perf mobile
- Reference: `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`

## Phases frontend

### Phase F1 -- Foundation + Chat
- [x] Scaffold frontend autonome
- [x] API client type, stores et UI principale
- [x] Chat fonctionnel aligne avec le backend

### Phase F2 -- Tabs
- [x] Memory
- [x] Profile
- [x] Activities
- [x] Diary

### Phase F3 -- Voice
- [x] Speech-to-Text navigateur
- [x] Text-to-Speech via backend
- [x] Push-to-talk et auto-TTS

### Phase F4 -- Scene Foundation
- [x] Three.js + React Three Fiber en place
- [x] Starfield, lighting et room baseline
- [x] Presence visuelle actuelle dans la scene

### Phase F5 -- Fidelity + Customization (implementation faite, verification en attente)
- [x] Pipeline avatar `GLB`
- [x] Presence animee credible
- [x] Materiaux PBR et post-processing mesure
- [x] Wardrobe par slots
- [x] Room decoration
- [x] Perf mobile tenue pendant l implementation
- [ ] Verification independante et sign-off de phase

### Phase F6 -- Auth UX + Tools UI + Settings
- [ ] Login UX et guard
- [ ] Permissions MCP visibles
- [ ] Settings utilisateur

### Phase F7 -- PWA + Mobile
- [ ] PWA installable
- [ ] Capacitor iOS + Android
- [ ] Offline shell et packaging stores

## Protocole de progression frontend
1. Un agent implemente la phase ou le sous-lot courant.
2. Un second agent le verifie avant tout passage a la phase suivante.
3. `Roadmap.md`, `Todo.md`, `README.md` et les docs frontend restent synchronises.

## Stack frontend
- Next.js 15 + React 19
- Three.js + React Three Fiber + drei
- Zustand (3D) + Jotai (app)
- Tailwind CSS
- Capacitor 7 (cible mobile)
- Vitest + Playwright

---

*Mis a jour : 2026-03-22*
