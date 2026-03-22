# Todo -- Kim Agentic Companion

> Taches actives. Mise a jour a chaque session.

---

## Etat de reference
- Backend stable.
- Frontend confirme sur `main` a la fin de F4.
- Les phases `F1` a `F7` sont strictement frontend.
- Une validation backend ne modifie jamais le statut des phases `F`.
- Prochaine phase executable: F5.
- Toute validation de phase frontend exige un second agent de verification avant le passage a la suite.

## Validation locale backend recente (2026-03-21)
- [x] Backend `Code/` valide dans un worktree temporaire isole
- [x] `npm run check`
- [x] `npm test` (`10` fichiers / `32` tests passes)
- [x] `npm run build`
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

## Frontend Phase F5 -- Fidelity + Customization (CODE COMPLETE -- AVATAR EN ATTENTE)

> Infrastructure 100% en place. Seul element manquant: le fichier GLB 3D de Kim.
> Une fois NEXT_PUBLIC_AVATAR_URL defini dans Vercel, la phase est visuellement finalisee.

### Ce qui est fait (deploye sur Vercel)
- [x] Pipeline avatar GLB: KimAvatarGLB + placeholder procedural PBR (rose metallique)
- [x] Etats d animation: idle, wave (sur message Kim), sit -- via useSceneStore
- [x] Materiaux PBR: Environment night + MeshPhysicalMaterial + envMapIntensity 1.4
- [x] Post-processing: SMAA + Bloom (luminanceThreshold 0.82) + Vignette
- [x] SceneLighting PBR: key/fill/rim/nebula lights + animated pink rim
- [x] Wardrobe: catalog, wardrobeSlots, wardrobeStore (Zustand persist), WardrobePanel UI
- [x] Room decoration: roomStore, FurnitureItem (couch/rug/lamp proceduraux), RoomDecoration
- [x] Bridge animation: useAvatar (Jotai messages -> Zustand sceneStore) dans AppShell
- [x] Onglet Wardrobe dans page.tsx + slide-in panel
- [x] .env.example mis a jour avec NEXT_PUBLIC_AVATAR_URL
- [x] Deploye sur Vercel: https://kim-agentic-companion-staging.vercel.app

### Seul blocage restant
- [ ] **NEXT_PUBLIC_AVATAR_URL** -- fournir un GLB 3D de Kim (Ready Player Me ou equivalent)
  - Option A: Creer l avatar sur https://readyplayer.me, exporter GLB, coller l URL dans Vercel
  - Option B: Utiliser un service tiers (IN3D, Avaturn, Bitmoji 3D) pour generer le GLB
  - Option C: Utiliser un GLB libre de droit comme point de depart temporaire
  - Une fois l URL definie dans les env vars Vercel + redeploy -> phase visuellement complete

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

*Mis a jour : 2026-03-22 -- F1..F4 completes ; F5 code complet, avatar GLB en attente ; F6 demarre apres avatar*