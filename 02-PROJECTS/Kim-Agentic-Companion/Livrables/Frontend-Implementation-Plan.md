# Kim -- Frontend Implementation Plan

## Statut de reference (2026-03-22)
- Etat reel retenu apres passage manuel sur le staging avec un vrai token API: le frontend courant reste un prototype produit.
- Le frontend autonome existe bien dans `Frontend/`, mais sa simple presence en code ne vaut pas sign-off.
- Le chat texte semble etre la surface la plus convaincante a ce stade.
- Auth, tools, settings, scene et direction visuelle demandent encore une reprise importante.
- Ordre de grandeur qualitatif retenu pour la fidelite actuelle: environ 10% de la vision cible.
- `F7` reste bloquee tant que le coeur frontend n est pas juge credible cote produit.

## Direction validee
- Garder `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`.
- Ne pas introduire Babylon.js.
- Ne pas introduire Unity WebGL.
- Kim doit rester un AI agent ultra-competent, pas une app de compagnie.
- Utiliser Replika et certaines references jeu video pour la qualite visuelle frontend et la presence 3D, pas pour le positionnement produit.
- Faire evoluer la scene F4 actuelle vers un rendu d AI agent premium.
- Cible: avatar principal `GLB`, presence animee, PBR propre, post-processing mesure, cohesion scene/UI, signaux de competence et perf mobile.
- Reference detaillee: `Frontend-Fidelity-Direction-2026-03-21.md`.
- Positionnement detaille: `Product-Positioning-2026-03-22.md`.

## Base deja livree

### F1 -- Foundation + Chat
- Frontend Next.js autonome
- API client type
- Design system galaxy / glass
- Chat est aujourd hui la partie la plus exploitable

### F2 -- Tabs
- Memory
- Profile
- Activities
- Diary
- Presents en code, pas encore preuve de qualite produit globale

### F3 -- Voice
- Speech-to-Text navigateur
- Text-to-Speech via backend
- Push-to-talk et auto-TTS
- Base presente, non consideree comme boucle produit signee

### F4 -- Scene Foundation
- Three.js + React Three Fiber en place
- Starfield, lights et room baseline
- Presence visuelle actuelle integree a la scene
- Base presente, fidelite encore tres loin de la cible

## Phases restantes

### F5 -- Fidelity + Customization (non atteinte cote produit)
**Lecture retenue**: une partie du scope existe en code, mais le resultat n est pas considere comme atteint cote produit.

**Cible toujours valide**:
- pipeline avatar principal en `GLB`
- etats d animation minimaux: idle, greet, listen, speak, react
- materiaux PBR propres et coherents
- post-processing mesure et optionnel
- scene et UI coherentes avec un AI agent execution-first
- signaux visuels de competence, clarte et controle
- perf mobile controlee pendant toute la phase

**Contraintes**:
- compression des assets obligatoire
- garder un fallback degrade si la 3D ne passe pas
- chaque effet visuel doit justifier son cout GPU

**Ce qui manque encore cote produit**:
- direction visuelle globale credible pour un AI agent premium
- desirabilite et credibilite de la presence Kim
- scene plus signee, moins generique et moins codee relationnel
- cohesion entre chat, scene, panels et ambiance
- sentiment d experience agent premium plutot que prototype UI

### F6 -- Auth UX + Tools UI + Settings (presente en code, non signee)
**Lecture retenue**: le scope F6 existe partiellement dans la base courante, mais il n est pas signe cote produit.

**Livrables presents**:
- login UX plus propre
- guard d acces
- UI de permissions MCP
- settings utilisateur
- memoire locale des permissions outils
- reutilisation de `always` / `denied` pour les commandes `/tool ...` dans le chat

**Ce qui doit etre repris serieusement**:
- auth UX et perception globale du gate
- tools panel et clarte des permissions
- cohesion entre outils directs et commandes `/tool ...`
- settings UX, niveau de finition et perception produit
- qualite percue hors chat

**Etat de validation**:
- un passage manuel avec vrai token a ete fait sur le staging
- ce passage n a pas donne de sign-off produit
- la checklist F6 doit maintenant servir a retester apres corrections
- aucune ouverture de `F7` ne doit etre faite tant que ce bloc n est pas repris puis revalide

### F7 -- PWA + Mobile (bloquee)
**Objectif futur**: rendre le frontend installable puis emballable en natif.

**Livrables attendus**:
- PWA installable
- Capacitor iOS / Android
- shell offline
- packaging stores

**Condition d ouverture**:
- ne demarrer `F7` qu apres audit, reprise coeur frontend et revalidation serieuse de `F5` / `F6`

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
`audit frontend -> rebaseline produit -> corrections coeur frontend -> revalidation staging -> seulement ensuite preparation F7`

## Rappel de travail
- Partir du frontend actuel, pas d une reconstruction.
- Prioriser le recalage produit avant tout elargissement de scope.
- Ne pas confondre presence de composants et maturite produit.
- Utiliser `Frontend-Fidelity-Direction-2026-03-21.md` comme reference de direction frontend.
- Utiliser `Frontend-Rebaseline-2026-03-22.md` comme reference de statut reel.
- Utiliser `Product-Positioning-2026-03-22.md` comme reference de positionnement.
