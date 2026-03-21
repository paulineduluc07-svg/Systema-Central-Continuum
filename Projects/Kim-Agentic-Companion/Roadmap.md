# Roadmap -- Kim Agentic Companion

> Vision, etapes et statut reel.

---

## Vision
Construire une experience compagnon IA proche Replika, mais orientee execution utile: Kim dialogue, se souvient et agit via MCP avec supervision utilisateur.

## Etat actuel (confirme)
- [x] API backend deployee sur Vercel (staging) avec auth bearer optionnelle
- [x] UI web de base en ligne (galaxy room + avatar rose + chat reel)
- [x] Sessions + memoire persistantes via Postgres
- [x] LLM connecte via OpenAI Responses API
- [x] Voice stack active (Vapi + ElevenLabs)
- [x] MCP policy gate active (allowlist/grants/revokes/confirmation)
- [x] Outils MCP exposes (`calendar.create_event`, `system.get_time`, `web.fetch`)
- [x] Endpoints outils app (`GET /v1/tools`, `POST /v1/tools/invoke`)
- [x] Tests unitaires/integration passes

## Phases backend restantes
- [ ] Phase 3 -- Orchestration agentique plus riche (skills composees, workflows multi-outils)
- [ ] Phase 4 -- Durcissement securite + observabilite + beta publique

## Phases frontend (NOUVEAU)

Voir `Livrables/Frontend-Implementation-Plan.md` pour le detail complet.

### Phase F1 -- Foundation: Next.js + Chat Parity
- [ ] Scaffold Next.js 15 + React 19 + Tailwind dans `Frontend/`
- [ ] API client type (KimApiClient) pour tous les endpoints
- [ ] Stores Jotai (auth, chat, tools)
- [ ] UI galaxy glassmorphism identique (zero regression)
- [ ] Chat fonctionnel avec session + auth token

### Phase F2 -- Tabs fonctionnels
- [ ] Memory page (liste + edition)
- [ ] Profile page (sliders personnalite)
- [ ] Activities page (timeline interactions)
- [ ] Diary page (journal avec Kim)

### Phase F3 -- Voice Chat
- [ ] Speech-to-Text (Web Speech API)
- [ ] Text-to-Speech (ElevenLabs via backend)
- [ ] Push-to-talk + mode toggle

### Phase F4 -- 3D Galaxy Room + Avatar Kim
- [ ] Scene Three.js + React Three Fiber
- [ ] Avatar Ready Player Me GLB + animations Mixamo (idle, walk, wave, sit, dance)
- [ ] Starfield particules + nebula lighting
- [ ] Camera OrbitControls contraints
- [ ] Fallback 2D si pas de WebGL

### Phase F5 -- Customisation: Wardrobe + Room
- [ ] Systeme de garde-robe (swap mesh par slot)
- [ ] Catalogue vetements/accessoires
- [ ] Editeur de room (drag-and-drop mobilier 3D)
- [ ] Presets de room (Cozy, Minimal, Studio, Galaxy Lounge)
- [ ] Persistance localStorage (future: sync backend)

### Phase F6 -- Auth UX + Tools UI + Settings
- [ ] Login page (code companion, pas de Bearer brut)
- [ ] AuthGuard sur toutes les routes
- [ ] UI permissions MCP (ToolCard, ConfirmationDialog)
- [ ] Page Settings (voix, theme, compte)

### Phase F7 -- PWA + Capacitor Mobile
- [ ] PWA installable (manifest, service worker, icons)
- [ ] Capacitor 7 wrap iOS + Android
- [ ] Build natif pour Play Store + App Store
- [ ] Support offline (cache app shell + models)

## Cibles produit court terme
- Personnalisation Kim (tenues/accessoires/profil)
- Memoires consultables/modifiables dans linterface
- Outils "clawbot-like" prioritaires avec permissions claires
- Qualite conversationnelle et latence plus stables
- Nommage final de lapp (`APP_NAME`) applique sur tous les environnements

## Stack frontend
- Next.js 15 + React 19
- Three.js + React Three Fiber + drei
- Zustand (3D) + Jotai (app)
- Tailwind CSS
- Capacitor 7 (mobile)
- Vitest + Playwright (tests)

---

*Mis a jour : 2026-03-21*
