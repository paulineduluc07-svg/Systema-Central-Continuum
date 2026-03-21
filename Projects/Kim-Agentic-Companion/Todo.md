# Todo -- Kim Agentic Companion

> Taches actives. Mise a jour a chaque session.

---

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
- [x] Creer `KimApiClient` type (tous les endpoints backend)
- [x] Creer types frontend (miroir de `shared/types.ts`)
- [x] Creer stores Jotai (auth, chat, tools)
- [x] Creer hooks (useChat, useAuth, useTools)
- [x] Creer composants UI (GlassPanel, Button, Input, ChatBubble, TabBar, Badge)
- [x] Creer layout (TopNav, CosmosBackground CSS, AppShell)
- [x] Creer ChatPanel + ChatLog + ChatInput + TypingIndicator
- [x] Creer AvatarStage (image 2D + orb anime)
- [x] Creer InfoCards + ToolList sidebar
- [x] Creer page principale (layout.tsx + page.tsx + globals.css)
- [x] Creer README.md + AGENT-INSTRUCTIONS.md frontend
- [x] Deployer sur Vercel (staging frontend) -- kim-frontend-staging.vercel.app
- [x] Verifier zero regression vs UI inline actuelle

## Frontend Phase F2 -- Tabs (COMPLETE)
- [x] Page Memory (Ask Kim + search)
- [x] Page Profile (sliders personnalite)
- [x] Page Activities (timeline session)
- [x] Page Diary (journal + reflexion Kim)
- [x] Tab switching client-side via TabBar (Chat/Memory/Profile/Activities/Diary)

## Frontend Phase F3 -- Voice
- [ ] Speech Recognition (Web Speech API)
- [ ] TTS playback (ElevenLabs via backend)
- [ ] Push-to-talk + toggle modes
- [ ] VoiceWaveform animation CSS

## Frontend Phase F4 -- 3D Scene
- [ ] Scene Three.js + React Three Fiber + Canvas
- [ ] Galaxy room (floor + glass walls + fog)
- [ ] Starfield particules (2000 points)
- [ ] Nebula lighting (pink/cyan/purple)
- [ ] Avatar Kim GLB (Ready Player Me)
- [ ] Animations Mixamo (idle, walk, wave, sit, dance)
- [ ] AnimationController (react aux events chat)
- [ ] Camera OrbitControls
- [ ] Fallback 2D

## Frontend Phase F5 -- Customisation
- [ ] Wardrobe systeme slot (hair, top, bottom, shoes, accessory)
- [ ] meshSwapper.ts
- [ ] Catalogue vetements JSON
- [ ] Room editor (drag-and-drop)
- [ ] Furniture raycasting + snap grid
- [ ] Room presets
- [ ] Persistance Zustand + localStorage

## Frontend Phase F6 -- Auth + Tools + Settings
- [ ] Login page (companion access code)
- [ ] AuthGuard redirect
- [ ] ToolsPanel + ToolCard + PermissionBadge
- [ ] ConfirmationDialog (Allow once / Always / Deny)
- [ ] Settings page (voix, theme, compte)

## Frontend Phase F7 -- PWA + Mobile
- [ ] PWA manifest + service worker (Serwist)
- [ ] Icons PWA (192, 512, apple-touch)
- [ ] Capacitor config + init
- [ ] Build iOS (Xcode)
- [ ] Build Android (Android Studio)
- [ ] Support offline
- [ ] Safe area insets iOS

## Checklist securite
- [x] Secrets uniquement en variables denvironnement
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
- [x] Store memoire in-memory
- [x] Store sessions in-memory
- [x] Store memoire Postgres (mode mirror)
- [x] Store sessions Postgres (mode mirror)
- [x] Policy MCP allowlist + consentement + confirmation
- [x] Connecteurs MCP: calendrier + system + web
- [x] Templates env staging/prod
- [x] Tests unitaires policy + memory + session + connector + signature + mcp client
- [x] Tests integration webhook signe + chat nominal + refus policy

---

*Mis a jour : 2026-03-21 -- F1 complete, F2 complete, F3 a venir*
