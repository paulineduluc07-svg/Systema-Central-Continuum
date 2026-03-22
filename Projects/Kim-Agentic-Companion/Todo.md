# Todo -- Kim Agentic Companion

> Taches actives. Mise a jour a chaque session.

---

## Etat de reference
- Backend stable et CORS frontend staging valide.
- Frontend confirme sur `main` avec implementation F5 deployee.
- Les phases `F1` a `F7` sont strictement frontend.
- Une validation backend ne modifie jamais le statut des phases `F`.
- Prochaine etape executable: verification independante de F5, puis ouverture de F6.
- Toute validation de phase frontend exige un second agent de verification avant le passage a la suite.

## Validation backend recente (2026-03-22)
- [x] Backend `Code/` valide dans un worktree temporaire isole
- [x] `npm run check`
- [x] `npm test` (`10` fichiers / `33` tests passes)
- [x] `npm run build`
- [x] CORS staging valide sur `OPTIONS /v1/tools` et `GET /v1/tools`
- [x] Worktree temporaire supprime apres execution
- [x] Aucun changement de statut des phases `F`

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

## Frontend Phase F1 -- Foundation + Chat (COMPLETE)
- [x] Creer `Frontend/` avec scaffold Next.js 15 + React 19
- [x] Configurer Tailwind + design tokens galaxy
- [x] Creer `KimApiClient` type
- [x] Creer types frontend miroir
- [x] Creer stores Jotai et hooks de base
- [x] Creer layout, composants UI et chat fonctionnel
- [x] Deployer sur Vercel

## Frontend Phase F2 -- Tabs (COMPLETE)
- [x] Page Memory
- [x] Page Profile
- [x] Page Activities
- [x] Page Diary
- [x] Navigation client-side des tabs

## Frontend Phase F3 -- Voice (COMPLETE)
- [x] Speech Recognition navigateur
- [x] TTS playback via backend
- [x] Push-to-talk et toggle TTS auto
- [x] Hooks voice et TTS

## Frontend Phase F4 -- Scene Foundation (COMPLETE)
- [x] Scene Three.js + React Three Fiber
- [x] Starfield, lights et room baseline
- [x] Presence visuelle actuelle dans la scene
- [x] Remplacement du fond CSS par la scene principale
- [x] Deploy frontend avec base F4

## Frontend Phase F5 -- Fidelity + Customization (IMPLEMENTEE / VERIFICATION INDEPENDANTE EN ATTENTE)

> Le scope F5 est implemente et deploye en staging.
> Le passage officiel a F6 reste conditionne a une verification par un second agent.

### Ce qui est fait (deploye sur Vercel)
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

### Verification restante avant passage a F6
- [ ] Verification independante F5 par un second agent
- [ ] Validation end-to-end frontend staging avec token API reel
- [ ] Decision explicite d ouverture de F6 apres verification

## Frontend Phase F6 -- Auth + Tools + Settings
- [ ] Login page (companion access code)
- [ ] AuthGuard redirect
- [ ] ToolsPanel + ToolCard + PermissionBadge
- [ ] ConfirmationDialog (Allow once / Always / Deny)
- [ ] Settings page (voix, theme, compte)

## Frontend Phase F7 -- PWA + Mobile
- [ ] PWA manifest + service worker
- [ ] Icons PWA
- [ ] Capacitor config + init
- [ ] Build iOS
- [ ] Build Android
- [ ] Support offline
- [ ] Safe area insets iOS

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

*Mis a jour : 2026-03-22 -- F1..F4 completes ; F5 implemente et deploye ; verification independante requise avant F6 ; CORS backend staging corrige*
