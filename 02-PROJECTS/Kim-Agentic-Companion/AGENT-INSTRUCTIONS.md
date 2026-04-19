# AGENT-INSTRUCTIONS -- Anima Ingenium

> Lire INTEGRALEMENT avant toute intervention sur ce projet.
> Regles generales: voir ../../AGENTS.md
> Ce document complete les regles globales avec le contexte Kim.

Nom du produit/projet : **Anima Ingenium**
Nom de l agent / personnage : **Kim**
Le dossier SCC reste `Projects/Kim-Agentic-Companion/` tant qu un renommage structurel explicite n est pas decide.

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
- Etat reel sur la base frontend courante : prototype frontend deploye, chat le plus avance, reste non signe, rebaseline produit necessaire avant toute ouverture de F7
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
Construire Anima Ingenium, un produit AI agent ultra-competent oriente execution. Kim en est l agent IA principal: chat, voix, memoire persistante, outils agentiques via MCP, aide sur fichiers, dossiers, sites et workflows.

## Positionnement non negociable
- Anima Ingenium n est pas une application de compagnie.
- Kim n existe pas pour "tenir compagnie", mais pour ameliorer la performance de vie de l utilisateur.
- La reference de posture produit hors frontend immersif est plus proche d un produit type OpenClaw.
- Replika et certains jeux video ne sont utiles ici que comme references de qualite visuelle frontend, de presence 3D et de finition.

## Etats de reference (2026-03-22)

### Backend (STABLE)
- Backend staging disponible sur `https://kim-agentic-companion-staging.vercel.app`
- MCP staging disponible sur `https://kim-mcp-staging.vercel.app`
- Flux critiques actifs: sessions, chat LLM, outils MCP, webhook Vapi signe, ElevenLabs synthesis
- Persistance sessions/memoire: Postgres
- CORS staging valide pour `https://kim-frontend-staging.vercel.app`

### Backend (PRIORITE ACTUELLE 2026-03-26)
- La priorite backend actuelle est la fondation d un cognitive runtime.
- Objectif: augmenter la lecture de situation, la retention de contexte, le suivi des engagements, la regulation et la fiabilite d action.
- Le comportement cible sert la regulation, la fiabilite et l action, et non la fabulation ni l illusion de relation affective.
- Base technique retenue a explorer: OpenClaw comme socle runtime/outils, avec une extension propre pour `Nuance Pass`, `State Service`, `Context Engine`, `Policy Gate`, `Commitment Ledger` et `Post Turn Consolidation`.
- Trace de session a lire: `Notes/Anima Ingenium.md`

### Frontend (PROTOTYPE / REBASELINE NECESSAIRE)
- Frontend autonome deja present dans `Frontend/`
- F1 complete: foundation + chat
- F2 complete: tabs fonctionnels
- F3 complete: voice
- F4 complete: scene R3F de base et presence visuelle actuelle
- Retour produit le plus recent avec token reel: le chat semble etre le parcours le plus fiable; auth, tools, settings et la qualite visuelle demandent encore une reprise importante
- F5 n est pas consideree atteinte cote produit malgre la presence de pieces en code; l ecart visuel a la cible est estime tres important
- F6 n est pas signee cote produit; les ecrans existent mais ne sont pas encore au niveau attendu
- Validation locale 2026-03-22: `npm test`, `npm run typecheck`, `npm run build`
- Deploiement staging canonical refait le 2026-03-22: `https://kim-frontend-staging.vercel.app`
- `F7` reste bloquee tant que le frontend coeur n est pas recadre
- Reference de direction: `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`

## Direction frontend validee
- Conserver `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`
- Viser un frontend d AI agent premium avec avatar `GLB`
- Utiliser Replika et des references jeu video pour la qualite visuelle, la presence 3D, l animation et la finition, pas pour un positionnement relationnel
- Ajouter une presence animee credible, des materiaux PBR et un post-processing mesure
- Garder wardrobe et room decoration comme options secondaires, jamais comme coeur de la proposition de valeur
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
| F2 | Prototype presente | Memory, Profile, Activities, Diary |
| F3 | Prototype presente | STT/TTS, push-to-talk, auto TTS |
| F4 | Prototype presente | Scene R3F, starfield, room baseline, presence visuelle actuelle |
| F5 | Non atteinte cote produit | Avatar `GLB`, fidelite visuelle, wardrobe, room decoration, perf mobile |
| F6 | Non signee cote produit | Auth UX, permissions MCP, settings |
| F7 | Bloquee / non ouverte | PWA, Capacitor, mobile stores |

Details complets : `Livrables/Frontend-Implementation-Plan.md`
Direction visuelle et protocole phase-gate : `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`
Rebaseline et handoff courant : `Livrables/Frontend-Rebaseline-2026-03-22.md`
Positionnement produit : `Livrables/Product-Positioning-2026-03-22.md`

## Workflow multi-agent obligatoire
1. Un agent implemente une phase ou un sous-lot clairement borne.
2. Un autre agent verifie le lot avant de passer a la phase suivante.
3. La verification doit couvrir le code, les tests utiles, la doc et le statut des phases.
4. `Todo.md`, `Roadmap.md`, `README.md` et les docs frontend ne sont mis a jour en phase complete qu apres verification.
5. Ne pas presenter F5 ou F6 comme completes cote produit ni ouvrir F7 tant que le frontend coeur n a pas ete juge satisfaisant.

## Protocole de tests locaux
1. Ne pas utiliser le clone principal si son worktree est sale ou sert deja a un autre agent.
2. Creer un worktree temporaire isole pour les validations locales.
3. Lancer les checks utiles dans ce worktree seulement.
4. Supprimer le worktree temporaire apres execution pour eviter les doublons locaux persistants.
5. Une validation backend locale reste une note backend et ne modifie jamais le statut des phases `F`.

## Checklist reprise agent

### Si travail BACKEND
1. Lire `Code/README.md`
2. Lire `Notes/Anima Ingenium.md`
3. Verifier `GET /health` et `GET /v1/integrations/health`
4. Valider `npm run check && npm test && npm run build` dans `Code/`
5. Si le clone principal est sale, utiliser un worktree temporaire pour cette validation

### Si travail FRONTEND
1. Lire `Frontend/README.md` et `Frontend/AGENT-INSTRUCTIONS.md`
2. Lire `Livrables/Product-Positioning-2026-03-22.md`
3. Lire `Livrables/Frontend-Rebaseline-2026-03-22.md`
4. Lire `Livrables/Frontend-Implementation-Plan.md`
5. Lire `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`
6. Consulter `Todo.md` pour la phase en cours
7. Verifier que le frontend reste connecte au backend staging

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
- Ne pas surinterpreter la presence de composants UI comme preuve de maturite produit

---

*Mis a jour: 2026-03-22*
