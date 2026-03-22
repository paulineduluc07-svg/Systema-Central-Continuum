# Roadmap -- Kim

> Vision, etapes et statut reel.

---

## Vision
Construire un AI agent ultra-competent, oriente execution utile: Kim dialogue, se souvient et agit via MCP avec supervision utilisateur pour aider sur fichiers, dossiers, sites et workflows.

## Etat actuel (base frontend courante)
- [x] API backend deployee sur Vercel avec auth, memoire, outils MCP et voice
- [x] CORS backend staging corrige pour `https://kim-frontend-staging.vercel.app`
- [x] Frontend standalone dans `Frontend/`
- [x] Base chat frontend presente et actuellement percue comme la brique la plus fiable
- [x] Plusieurs briques frontend additionnelles existent en code: tabs, voice, scene, avatar, auth, tools, settings
- [x] Validation locale F6: `npm test`, `npm run typecheck`, `npm run build`
- [x] Deploiement staging canonical refait le 2026-03-22
- [ ] Latest product review with real token does not grant frontend sign-off
- [ ] Le rendu visuel reste tres loin de la vision cible, estimation qualitative ~10%
- [ ] `F7` reste bloquee tant que le frontend coeur n est pas recadre

## Phases backend restantes
- [ ] Phase 3 -- Orchestration agentique plus riche (skills composees, workflows multi-outils)
- [ ] Phase 4 -- Durcissement securite + observabilite + beta publique

## Direction frontend validee (2026-03-21)
- Garder `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`
- Ne pas introduire Babylon.js
- Ne pas introduire Unity WebGL
- Replika et certains jeux video servent de references de qualite visuelle frontend, pas de positionnement produit
- Evoluer la base F4 actuelle vers un rendu d AI agent premium avec avatar `GLB`, presence animee, PBR propre, post-processing mesure et cohesion UI/scene
- Wardrobe et room decoration deviennent secondaires tant que la presence Kim et la lisibilite produit ne sont pas au niveau
- Reference: `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`
- Positionnement: `Livrables/Product-Positioning-2026-03-22.md`

## Phases frontend

### Phase F1 -- Foundation + Chat
- [x] Scaffold frontend autonome
- [x] API client type, stores et UI principale
- [x] Chat fonctionnel aligne avec le backend

### Phase F2 -- Tabs (prototypes presents)
- [x] Memory
- [x] Profile
- [x] Activities
- [x] Diary

### Phase F3 -- Voice (prototype present)
- [x] Speech-to-Text navigateur
- [x] Text-to-Speech via backend
- [x] Push-to-talk et auto-TTS

### Phase F4 -- Scene Foundation (prototype present)
- [x] Three.js + React Three Fiber en place
- [x] Starfield, lighting et room baseline
- [x] Presence visuelle actuelle dans la scene

### Phase F5 -- Fidelity + Customization (non atteinte cote produit)
- [x] Pipeline avatar `GLB` present en code
- [x] Wardrobe et room decoration presentes en code
- [ ] Rendu visuel juge aligne avec un AI agent premium
- [ ] Presence Kim percue comme competente, memorable et intentionnelle

### Phase F6 -- Auth UX + Tools UI + Settings (presente en code, non signee)
- [x] Login UX et guard presents
- [x] Permissions MCP visibles
- [x] Settings utilisateur presents
- [x] Memoire locale des permissions outils
- [x] Cohesion de base entre panneau outils et commandes `/tool ...`
- [ ] Niveau produit juge satisfaisant en usage reel

### Phase F7 -- PWA + Mobile (bloquee)
- [ ] PWA installable
- [ ] Capacitor iOS + Android
- [ ] Offline shell et packaging stores

## Rebaseline frontend prioritaire
1. Faire un audit complet du frontend actuel contre la vision et le positionnement clarifie.
2. Prioriser la reprise du coeur produit avant toute extension mobile.
3. Reprendre auth, tools, settings et la direction visuelle jusqu a un niveau juge satisfaisant pour un AI agent execution-first.
4. Revalider ensuite le staging avec un vrai usage produit.
5. Seulement apres cela, rouvrir la question `F7`.

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
