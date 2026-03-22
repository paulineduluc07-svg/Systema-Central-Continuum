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
- Role : API HTTP, agent conversationnel, MCP gateway, voice (Vapi/ElevenLabs), persistance Postgres
- Stack : TypeScript, Node 20, Vercel serverless, Postgres, OpenAI Responses API
- Deploiement : kim-agentic-companion-staging.vercel.app
- Entree : `Code/api/index.ts`
- Tests : `Code/tests/`
- Validation locale recente: `npm run check`, `npm test`, `npm run build` passes le 2026-03-21 dans un worktree temporaire isole
- Cette validation backend n a aucun effet sur les phases `F`

### Frontend (Frontend/)
- Role : UI utilisateur, scene 3D, avatar Kim, chat, voice, customisation, mobile
- Stack validee : `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`
- Les phases `F1` a `F7` sont strictement des phases frontend
- Etat reel sur `main` : F1..F4 completes ; F5 implemente et deploye ; verification independante avant F6
- Direction a suivre : `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`
- Alternatives refusees : pas de Babylon.js, pas de Unity WebGL
- Deploiement : projet Vercel separe du backend

### Communication entre les deux

```
Frontend  ---- HTTP fetch ---->  Backend
                                  /v1/chat
                                  /v1/sessions
                                  /v1/tools
                                  /v1/voice/synthesize
                                  /health
```

- ZERO import partage entre `Code/` et `Frontend/`
- Le frontend maintient son miroir de types cote client
- Le frontend pointe vers le backend via `NEXT_PUBLIC_API_URL`

### REGLES STRICTES
1. NE JAMAIS modifier `Code/` quand on travaille sur le frontend (et inversement)
2. NE JAMAIS creer d imports croises entre `Code/` et `Frontend/`
3. Chaque app a son propre `package.json`
4. Chaque app se deploie independamment
5. Si un contrat backend change, mettre a jour le miroir de types frontend

---

## Mission
Construire Kim, une assistante type Replika: chat, voix, presence visuelle 3D, memoire persistante et outils agentiques via MCP.

## Etats de reference (2026-03-22)

### Backend (STABLE)
- Backend staging disponible sur `https://kim-agentic-companion-staging.vercel.app`
- MCP staging disponible sur `https://kim-mcp-staging.vercel.app`
- Flux critiques actifs: sessions, chat LLM, outils MCP, webhook Vapi signe, ElevenLabs synthesis
- Persistance sessions/memoire: Postgres
- CORS staging valide pour `https://kim-frontend-staging.vercel.app`

### Frontend (F5 IMPLEMENTEE / VERIFICATION EN ATTENTE)
- Frontend autonome deja present dans `Frontend/`
- F1 complete: foundation + chat
- F2 complete: tabs fonctionnels
- F3 complete: voice
- F4 complete: scene R3F de base et presence visuelle actuelle
- F5 implemente: avatar `GLB` local, wardrobe, room decoration, stack R3F stable sous React 19
- Verification independante requise avant F6
- Reference de direction: `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`

## Direction frontend validee
- Conserver `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`
- Viser un rendu compagnon Replika-like avec avatar `GLB`
- Ajouter une presence animee credible, des materiaux PBR et un post-processing mesure
- Integrer wardrobe et room decoration sans casser la perf mobile
- Ne pas repartir de zero et ne pas changer de moteur 3D

## URLs cloud de travail
- Backend API: `https://kim-agentic-companion-staging.vercel.app`
- MCP Server: `https://kim-mcp-staging.vercel.app`

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

## Layout du projet

```
Projects/Kim-Agentic-Companion/
  AGENT-INSTRUCTIONS.md
  README.md
  Roadmap.md
  Todo.md
  Code/
  Frontend/
  MCP-Server/
  Assets/
  Notes/
  Prompts/
  Livrables/
    Frontend-Implementation-Plan.md
    Frontend-Fidelity-Direction-2026-03-21.md
```

## Phases frontend

| Phase | Statut | Contenu principal |
|-------|--------|-------------------|
| F1 | Complete | Foundation, chat, API client, design system |
| F2 | Complete | Memory, Profile, Activities, Diary |
| F3 | Complete | STT/TTS, push-to-talk, auto TTS |
| F4 | Complete | Scene R3F, starfield, room baseline, presence visuelle actuelle |
| F5 | Implemente, verification en attente | Avatar `GLB`, fidelite visuelle, wardrobe, room decoration, perf mobile |
| F6 | En attente | Auth UX, permissions MCP, settings |
| F7 | En attente | PWA, Capacitor, mobile stores |

Details complets : `Livrables/Frontend-Implementation-Plan.md`
Direction visuelle et protocole phase-gate : `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`

## Workflow multi-agent obligatoire
1. Un agent implemente une phase ou un sous-lot clairement borne.
2. Un autre agent verifie le lot avant de passer a la phase suivante.
3. La verification doit couvrir le code, les tests utiles, la doc et le statut des phases.
4. `Todo.md`, `Roadmap.md`, `README.md` et les docs frontend ne sont mis a jour en phase complete qu apres verification.
5. Ne pas lancer F6 tant que F5 n a pas ete verifiee.

## Protocole de tests locaux
1. Ne pas utiliser le clone principal si son worktree est sale ou sert deja a un autre agent.
2. Creer un worktree temporaire isole pour les validations locales.
3. Lancer les checks utiles dans ce worktree seulement.
4. Supprimer le worktree temporaire apres execution pour eviter les doublons locaux persistants.
5. Une validation backend locale reste une note backend et ne modifie jamais le statut des phases `F`.

## Checklist reprise agent

### Si travail BACKEND
1. Lire `Code/README.md`
2. Verifier `GET /health` et `GET /v1/integrations/health`
3. Valider `npm run check && npm test && npm run build` dans `Code/`
4. Si le clone principal est sale, utiliser un worktree temporaire pour cette validation

### Si travail FRONTEND
1. Lire `Frontend/README.md` et `Frontend/AGENT-INSTRUCTIONS.md`
2. Lire `Livrables/Frontend-Implementation-Plan.md`
3. Lire `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`
4. Consulter `Todo.md` pour la phase en cours
5. Verifier que le frontend reste connecte au backend staging

## Variables critiques

### Backend (Code/)
- `APP_NAME`, `API_AUTH_TOKEN`, `DATABASE_URL`
- `OPENAI_API_KEY`, `OPENAI_MODEL`
- `VAPI_API_KEY`, `VAPI_WEBHOOK_SECRET`
- `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`
- `MCP_SERVER_BASE_URL`, `MCP_API_KEY`, `MCP_ALLOWED_TOOLS`
- `MCP_REQUIRE_CONFIRMATION`, `MCP_ALLOWLIST_AS_DEFAULT_GRANTS`

### Frontend (Frontend/)
- `NEXT_PUBLIC_API_URL` -- URL du backend
- `NEXT_PUBLIC_APP_NAME` -- Nom affiche dans UI

## Guardrails
- Ne pas casser les endpoints backend existants
- Ne pas creer d imports entre `Code/` et `Frontend/`
- Ne pas stocker de secrets dans le repo
- Toujours distinguer etat reel et cible frontend dans la doc
- Toujours faire verifier une phase frontend avant de marquer la suivante active

---

*Mis a jour: 2026-03-22*
