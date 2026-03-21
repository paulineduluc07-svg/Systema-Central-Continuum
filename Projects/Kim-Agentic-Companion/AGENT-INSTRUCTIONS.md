# AGENT-INSTRUCTIONS -- Kim Agentic Companion

> Lire INTEGRALEMENT avant toute intervention sur ce projet.
> Regles generales: voir ../../AGENTS.md
> Ce document complete les regles globales avec le contexte Kim.

---

## REGLE #1 : ARCHITECTURE SEPAREE BACKEND / FRONTEND

**Le projet est compose de DEUX applications completement independantes.**

```
Projects/Kim-Agentic-Companion/
  Code/              <-- BACKEND (API + agent core + MCP + voice)
  Frontend/          <-- FRONTEND (UI React + 3D + mobile)
```

### Backend (Code/)
- **Role** : API HTTP, agent conversationnel, MCP gateway, voice (Vapi/ElevenLabs), persistance Postgres
- **Stack** : TypeScript, Node 20, Vercel serverless, Postgres, OpenAI Responses API
- **Deploiement** : kim-agentic-companion-staging.vercel.app
- **Entrypoint** : Code/api/index.ts (Vercel serverless)
- **Tests** : Code/tests/ (Vitest)
- **Config** : Code/package.json, Code/tsconfig.json, Code/vercel.json

### Frontend (Frontend/)
- **Role** : UI utilisateur, scene 3D (Three.js), avatar Kim, chat, voice, customisation, mobile
- **Stack** : Next.js 15, React 19, Three.js + React Three Fiber, Zustand + Jotai, Tailwind CSS, Capacitor 7
- **Deploiement** : Projet Vercel SEPARE (ex: kim-frontend-staging.vercel.app)
- **Config** : Frontend/package.json, Frontend/tsconfig.json, Frontend/next.config.ts

### Communication entre les deux

```
Frontend  ---- HTTP fetch ---->  Backend
                                  /v1/chat
                                  /v1/sessions
                                  /v1/tools
                                  /v1/voice/synthesize
                                  /health
```

- **ZERO import partage** entre Code/ et Frontend/
- Le frontend a sa propre copie des types dans Frontend/src/lib/api/types.ts
- Ces types doivent miroir Code/src/shared/types.ts (synchronisation manuelle)
- Le frontend se connecte au backend via NEXT_PUBLIC_API_URL (variable env)

### REGLES STRICTES

1. **NE JAMAIS modifier Code/ quand on travaille sur le frontend** (et vice versa)
2. **NE JAMAIS creer imports croises** entre Code/ et Frontend/
3. **Chaque app a son propre package.json** -- pas de monorepo, pas de workspace
4. **Chaque app se deploie independamment** sur son propre projet Vercel
5. **Si un type backend change**, mettre a jour le miroir dans Frontend/src/lib/api/types.ts

---

## Mission

Construire Kim, une assistante type Replika (chat + voix + presence visuelle 3D), avec memoire persistante et outils agentiques via MCP.

## Etats de reference (2026-03-21)

### Backend (STABLE)
- Web app API disponible sur kim-agentic-companion-staging.vercel.app
- MCP server disponible sur kim-mcp-staging.vercel.app
- Flux critiques actifs: sessions, chat LLM, outils MCP, Vapi webhook signe, ElevenLabs synthesis
- Persistance sessions/memoire: Postgres (DATABASE_URL)
- Tests passes: npm run check && npm test && npm run build dans Code/

### Frontend (EN CONSTRUCTION)
- Plan detaille: Livrables/Frontend-Implementation-Plan.md
- Phase en cours: voir Todo.md (section Frontend Phase F...)
- Si Frontend/ existe pas encore, commencer par Phase F1

## URLs cloud de travail
- Backend API: https://kim-agentic-companion-staging.vercel.app
- MCP Server: https://kim-mcp-staging.vercel.app
- Frontend: a deployer sur projet Vercel separe

## Endpoints API (contrat backend vers frontend)

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | /health | Non | Liveness probe |
| GET | /v1/mcp/health | Bearer | Sante MCP |
| GET | /v1/integrations/health | Bearer | Sante integrations |
| GET | /v1/tools | Bearer | Liste outils MCP disponibles |
| POST | /v1/sessions | Bearer | Creer session (userId) |
| POST | /v1/chat | Bearer | Envoyer message (sessionId, message) |
| POST | /v1/tools/invoke | Bearer | Executer outil MCP directement |
| POST | /v1/voice/synthesize | Bearer | TTS ElevenLabs (text) |
| POST | /v1/vapi/calls | Bearer | Appel vocal sortant Vapi |
| POST | /v1/webhooks/vapi | HMAC | Webhook entrant Vapi |

## Layout complet du projet

```
Projects/Kim-Agentic-Companion/
  AGENT-INSTRUCTIONS.md     <-- CE FICHIER (lire en premier)
  README.md                 <-- Point entree rapide
  Roadmap.md                <-- Vision + phases backend + frontend
  Todo.md                   <-- Backlog detaille (backend + frontend F1-F7)

  Code/                     <-- BACKEND (NE PAS TOUCHER SI TRAVAIL FRONTEND)
    package.json
    tsconfig.json
    vercel.json
    vitest.config.ts
    api/index.ts             <-- Vercel serverless entry
    src/
      api/server.ts          <-- Routes HTTP + UI inline legacy
      agent-core/            <-- kimAgent, llm, memoryStore, sessionStore
      integrations/          <-- elevenLabsClient, vapiClient
      mcp-gateway/           <-- mcpClient, mcpPolicy, connectors/
      persistence/           <-- pg.ts (Postgres)
      shared/                <-- auth, logger, signature, types
    tests/                   <-- 10 fichiers de tests
    assets/kim-avatar.png

  Frontend/                  <-- FRONTEND (NE PAS TOUCHER SI TRAVAIL BACKEND)
    package.json
    tsconfig.json
    next.config.ts
    tailwind.config.ts
    .env.example
    README.md                <-- Setup frontend
    AGENT-INSTRUCTIONS.md    <-- Instructions specifiques frontend
    src/
      app/                   <-- Pages Next.js (layout, page, globals.css)
      components/            <-- UI (chat/, avatar/, scene/, wardrobe/, room/)
      lib/                   <-- API client, voice utils, 3D helpers, auth
      stores/                <-- Zustand (3D) + Jotai (app data)
      hooks/                 <-- useChat, useAuth, useTools, useVoice
    public/                  <-- Assets statiques (models/, icons/)
    e2e/                     <-- Tests Playwright

  MCP-Server/                <-- Serveur MCP minimal (health/tools/invoke)
  Assets/                    <-- References visuelles produit
  Notes/                     <-- Notes produit + screenshots
  Prompts/                   <-- Prompts et variants
  Livrables/
    Frontend-Implementation-Plan.md  <-- Plan detaille 7 phases
```

## Phases frontend (resume)

| Phase | Nom | Contenu principal |
|-------|-----|-------------------|
| F1 | Foundation + Chat | Next.js scaffold, API client, chat fonctionnel, galaxy UI |
| F2 | Tabs | Memory, Profile, Activities, Diary -- tous fonctionnels |
| F3 | Voice | STT (Web Speech API) + TTS (ElevenLabs) |
| F4 | 3D Scene | Three.js galaxy room + avatar Kim + animations Mixamo |
| F5 | Customisation | Wardrobe (vetements) + Room decoration (mobilier) |
| F6 | Auth + Tools | Login UX, permissions MCP visuelles, Settings |
| F7 | PWA + Mobile | Service worker, Capacitor, builds Play Store + App Store |

**Detail complet** : Livrables/Frontend-Implementation-Plan.md
**Statut en cours** : Todo.md

## Workflow recommande (remote-first)

1. Lire CE FICHIER en entier
2. Lire Roadmap.md et Todo.md pour savoir ou on en est
3. Identifier si le travail concerne Code/ (backend) ou Frontend/ (frontend)
4. **NE JAMAIS travailler sur les deux en meme temps dans la meme session**
5. Si code change necessaire: modifier, tester, deployer
6. Mettre a jour Todo.md apres chaque tache completee
7. Mettre a jour AGENT-INSTRUCTIONS.md si comportement/vars/routes changent

## Checklist reprise agent

### Si travail BACKEND:
1. Lire Code/README.md
2. Verifier endpoints: GET /health, GET /v1/integrations/health (Bearer)
3. Valider: npm run check && npm test && npm run build dans Code/

### Si travail FRONTEND:
1. Lire Frontend/README.md et Frontend/AGENT-INSTRUCTIONS.md
2. Lire Livrables/Frontend-Implementation-Plan.md pour le plan complet
3. Consulter Todo.md pour la phase en cours
4. Valider: npm run dev, npm test, npm run build dans Frontend/
5. Verifier que le frontend se connecte au backend staging

## Variables critiques

### Backend (Code/)
- APP_NAME, API_AUTH_TOKEN, DATABASE_URL
- OPENAI_API_KEY, OPENAI_MODEL
- VAPI_API_KEY, VAPI_WEBHOOK_SECRET
- ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID
- MCP_SERVER_BASE_URL, MCP_API_KEY, MCP_ALLOWED_TOOLS
- MCP_REQUIRE_CONFIRMATION, MCP_ALLOWLIST_AS_DEFAULT_GRANTS

### Frontend (Frontend/)
- NEXT_PUBLIC_API_URL -- URL du backend
- NEXT_PUBLIC_APP_NAME -- Nom affiche dans UI (ex: Kim)

## Guardrails

- Ne pas supprimer kim-mcp-staging sans migration explicite
- Ne pas casser les endpoints backend existants
- Ne pas creer imports entre Code/ et Frontend/
- Ne pas stocker de secrets dans le repo
- Ne pas faire de nettoyage destructif sans sauvegarde verifiee
- Toujours mettre a jour Todo.md apres completion tache

---

*Mis a jour: 2026-03-21*
