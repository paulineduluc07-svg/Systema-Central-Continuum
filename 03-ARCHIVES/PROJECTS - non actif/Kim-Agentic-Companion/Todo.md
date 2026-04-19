# Todo -- Anima Ingenium

> Taches actives. Mise a jour a chaque session.

---

## Etat de reference
- Backend stable et CORS frontend staging valide.
- Frontend courant reste un prototype cote produit malgre plusieurs briques presentes en code.
- Convention de nommage clarifiee: Anima Ingenium = produit/projet; Kim = agent/personnage.
- Positionnement clarifie: Anima Ingenium n est pas une app de compagnie; Kim est un AI agent ultra-competent oriente execution.
- Replika et les references jeu video servent uniquement a cadrer le niveau de qualite visuelle frontend et le 3D.
- Retour produit du 2026-03-22 avec token reel: le chat semble etre la brique la plus convaincante; auth, tools, settings et la qualite visuelle demandent encore une reprise importante.
- Estimation qualitative du rendu visuel courant par rapport a la cible: ~10%.
- Nouvelle priorite backend (2026-03-26): cognitive runtime pour lecture de situation, retention de contexte, engagements, regulation et fiabilite d action.
- Base technique visee pour cette couche: OpenClaw + extension runtime propre.
- Les phases `F1` a `F7` sont strictement frontend.
- Une validation backend ne modifie jamais le statut des phases `F`.
- `F7` est bloquee tant que le frontend coeur n atteint pas un niveau produit satisfaisant.
- Prochaine etape executable backend: specifier puis implementer la fondation du cognitive runtime.
- Prochaine etape executable frontend: audit frontend complet contre le positionnement clarifie, backlog de reprise priorise, puis premier lot de corrections coeur frontend.
- Toute validation de phase frontend exige un second agent de verification avant le passage a la suite.

## Session backend runtime (2026-03-26)
- [x] Relecture des README et fichiers agent du depot avant mise a jour documentaire
- [x] Decision explicite: le produit se nomme Anima Ingenium; Kim reste le nom de l agent / personnage
- [x] Decision explicite: le cognitive runtime devient une base prioritaire pour la suite de la vision
- [x] Direction comportementale clarifiee: servir regulation, fiabilite et action; refuser la fabulation et l illusion de relation affective
- [x] Cible comportementale clarifiee: lire une situation multi-facteurs sans perdre contexte, engagements ni contraintes
- [x] OpenClaw retenu comme base plausible pour le runtime, les outils, les hooks, la memoire et les approvals
- [x] Architecture de reference posee: `Nuance Pass`, `State Service`, `Context Engine`, `Commitment Ledger`, `Policy Gate`, `Post Turn Consolidation`
- [x] Trois livrables externes crees dans Google Drive `01 - PROJETS/Anima Ingenium/Backend/Agent autonome`
- [ ] Definir les schemas `AgentStateSnapshot`, `Commitment`, `DecisionRecord`
- [ ] Definir le squelette du plugin `kim-runtime`
- [ ] Definir le backlog V1 de la fondation cognitive

## Validation backend recente (2026-03-22)
- [x] Backend `Code/` valide dans un worktree temporaire isole
- [x] `npm run check`
- [x] `npm test` (`10` fichiers / `33` tests passes)
- [x] `npm run build`
- [x] CORS staging valide sur `OPTIONS /v1/tools` et `GET /v1/tools`
- [x] Worktree temporaire supprime apres execution
- [x] Aucun changement de statut des phases `F`

## Validation frontend recente (2026-03-22)
- [x] Relecture structurelle du scope F6 dans `Frontend/`
- [x] `npm test` (`2` fichiers / `8` tests passes)
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] Flux permissions/outils raffine localement pour reutiliser `always` / `denied` aussi sur les commandes `/tool ...` dans le chat
- [x] Frontend staging redeploye sur `https://kim-frontend-staging.vercel.app`
- [x] Passage manuel avec token API reel effectue
- [ ] Sign-off frontend refuse a ce stade

## Backend (complete)
- [x] Initialiser la structure SCC du projet
- [x] Poser le cadre produit (Kim agentic + MCP)
- [x] Definir user stories MVP (chat, voix, memoire, actions)
- [x] Definir schema de permissions MCP (grant/revoke + scopes)
- [x] Specifier le contrat API webhook/tool-calls
- [x] Choisir stack de deploiement cloud v1
- [x] Implementer squelette backend agent + memory
- [x] Integrer premier connecteur MCP (calendrier)
- [x] Brancher client MCP cloud (auth + timeout)
- [x] Ajouter observabilite minimale (logs, erreurs, traces actions)
- [x] Ajouter persistance DB sessions + memoire (Postgres + fallback)
- [x] Ecrire tests de parcours critiques
- [x] Ajouter endpoint `GET /v1/tools`
- [x] Ajouter endpoint `POST /v1/tools/invoke`
- [x] Exposer outil `system.get_time` cote MCP
- [x] Exposer outil `web.fetch` cote MCP
- [x] Ajouter UI web en racine (`/`) avec chat reel
- [x] Integrer avatar rose (`/assets/kim-avatar.png`)
- [x] Stabiliser parsing LLM OpenAI Responses
- [x] Standardiser variable ElevenLabs (`ELEVENLABS_API_KEY`)
- [x] Verifier chaines de sante app + MCP en cloud

## Frontend Phase F1 -- Foundation + Chat (BASE LA PLUS AVANCEE)
- [x] Creer `Frontend/` avec scaffold Next.js 15 + React 19
- [x] Configurer Tailwind + design tokens galaxy
- [x] Creer `KimApiClient` type
- [x] Creer types frontend miroir
- [x] Creer stores Jotai et hooks de base
- [x] Creer layout, composants UI et chat fonctionnel
- [x] Deployer sur Vercel

## Frontend Phase F2 -- Tabs (PRESENTES EN CODE / NON PRIORITAIRES TANT QUE LE COEUR N EST PAS RECADRE)
- [x] Page Memory
- [x] Page Profile
- [x] Page Activities
- [x] Page Diary
- [x] Navigation client-side des tabs

## Frontend Phase F3 -- Voice (PRESENTE EN CODE / NON VALIDEE COTE PRODUIT)
- [x] Speech Recognition navigateur
- [x] TTS playback via backend
- [x] Push-to-talk et toggle TTS auto
- [x] Hooks voice et TTS

## Frontend Phase F4 -- Scene Foundation (PRESENTE / FIDELITE ENCORE TRES INSUFFISANTE)
- [x] Scene Three.js + React Three Fiber
- [x] Starfield, lights et room baseline
- [x] Presence visuelle actuelle dans la scene
- [x] Remplacement du fond CSS par la scene principale
- [x] Deploy frontend avec base F4

## Frontend Phase F5 -- Fidelity + Customization (NON ATTEINTE / TRES LOIN DE LA CIBLE)

> Des pieces F5 existent en code et sont deployees en staging.
> Cela ne constitue pas un sign-off produit.
> Retour produit le plus recent: le rendu actuel reste tres loin de la vision cible, ordre de grandeur estime ~10%.

### Ce qui existe en code
- [x] Pipeline avatar GLB: KimAvatarGLB + placeholder procedural PBR (rose metallique)
- [x] Avatar GLB local embarque dans `Frontend/public/models/kim-avatar.glb`
- [x] Fallback runtime sur `/models/kim-avatar.glb`
- [x] `NEXT_PUBLIC_AVATAR_URL` mis a jour sur Vercel vers `/models/kim-avatar.glb`
- [x] Etats d animation: idle, wave (sur message Kim), sit -- via useSceneStore
- [x] Materiaux PBR: Environment night + MeshPhysicalMaterial + envMapIntensity 1.4
- [x] Post-processing: SMAA + Bloom (luminanceThreshold 0.82) + Vignette
- [x] SceneLighting PBR: key/fill/rim/nebula lights + animated pink rim
- [x] Wardrobe: catalog, wardrobeSlots, wardrobeStore (Zustand persist), WardrobePanel UI
- [x] Room decoration: roomStore, FurnitureItem (couch/rug/lamp proceduraux), RoomDecoration
- [x] Bridge animation: useAvatar (Jotai messages -> Zustand sceneStore) dans AppShell
- [x] Onglet Wardrobe dans page.tsx + slide-in panel
- [x] .env.example mis a jour avec NEXT_PUBLIC_AVATAR_URL
- [x] Stack R3F alignee avec React 19 (`@react-three/fiber` 9, `drei` 10, `postprocessing` 3)
- [x] Frontend staging deploye: https://kim-frontend-staging.vercel.app

### Ce qui manque encore cote produit
- [ ] Presence visuelle, posture, ambiance et desirabilite alignes a un AI agent premium
- [ ] Avatar percu comme credible et premium plutot que placeholder
- [ ] Direction artistique forte et coherente a travers scene, UI et identite Kim
- [ ] Perception utilisateur que le produit ressemble a la destination voulue

## Frontend Phase F6 -- Auth + Tools + Settings (STRUCTURE PRESENTE / NON SIGNEE)
- [x] Login page (agent access token)
- [x] AuthGate local storage + session bootstrap
- [x] ToolsPanel + ToolCard + PermissionBadge
- [x] ConfirmationDialog (Allow once / Always / Deny)
- [x] Settings page (voix, theme, compte)
- [x] Preferences theme et TTS persistantes
- [x] Memoire locale des permissions outils
- [x] Reutilisation de la permission `always` / `denied` pour les commandes `/tool ...` envoyees via le chat

### Ce qui reste a reprendre serieusement
- [ ] UX auth plus propre et plus convaincante pour un produit AI agent
- [ ] Flux permissions/outils juges vraiment clairs, fiables et operationnels
- [ ] Settings suffisamment solides pour etre consideres comme une vraie surface produit utile
- [ ] Parcours hors chat au meme niveau de confiance que le chat
- [ ] Sign-off produit reel sur staging

## Frontend Phase F7 -- PWA + Mobile (BLOQUEE / NON OUVERTE)
- [ ] Ne pas ouvrir tant que le frontend coeur n est pas recadre
- [ ] PWA manifest + service worker
- [ ] Icons PWA
- [ ] Capacitor config + init
- [ ] Build iOS
- [ ] Build Android
- [ ] Support offline
- [ ] Safe area insets iOS
- [ ] Packaging mobile seulement apres un frontend coeur juge satisfaisant

## Checklist securite
- [x] Secrets uniquement en variables d environnement
- [x] Aucune action MCP sans consentement explicite
- [x] Journalisation de chaque action externe
- [x] Politique de refus sur actions sensibles
- [x] Verification signature webhook Vapi (si secret configure)
- [x] Bearer auth API (si token configure)

## Checklist technique backend
- [x] Endpoint `GET /health`
- [x] Endpoint `GET /v1/mcp/health`
- [x] Endpoint `GET /v1/integrations/health`
- [x] Endpoint `GET /v1/tools`
- [x] Endpoint `POST /v1/tools/invoke`
- [x] Endpoint `POST /v1/sessions`
- [x] Endpoint `POST /v1/chat`
- [x] Endpoint `POST /v1/webhooks/vapi`
- [x] Endpoint `POST /v1/vapi/calls`
- [x] Endpoint `POST /v1/voice/synthesize`
- [x] Store memoire Postgres
- [x] Store sessions Postgres
- [x] Policy MCP allowlist + consentement + confirmation
- [x] Connecteurs MCP: calendrier + system + web
- [x] Tests unitaires et integration des parcours critiques

---

*Mis a jour : 2026-03-22 -- retour produit reel integre ; positionnement AI agent clarifie ; chat le plus avance ; frontend global encore loin de la vision ; F7 bloquee*
