# AGENT-INSTRUCTIONS -- Kim Agentic Companion

Lire avant toute intervention sur ce projet.
Regles generales: voir `../../AGENTS.md`.
Ce document complete les regles globales avec le contexte Kim.

## Mission
Construire Kim, une assistante type Replika (chat + voix + presence visuelle), avec memoire persistante et outils agentiques via MCP.

## Etats de reference (2026-03-21)
- Web app API + UI disponibles sur `kim-agentic-companion-staging`.
- MCP server disponible sur `kim-mcp-staging`.
- Flux critiques actifs: sessions, chat LLM, outils MCP, Vapi webhook signe, ElevenLabs synthesis.
- Persistance sessions/memoire: Postgres (`DATABASE_URL`).

## URLs cloud de travail
- App: `https://kim-agentic-companion-staging.vercel.app`
- MCP: `https://kim-mcp-staging.vercel.app`

## Layout du projet
- `Code/`: backend principal + UI web integree + tests
- `MCP-Server/`: serveur MCP minimal (health/tools/invoke)
- `Assets/`: references visuelles produit
- `Notes/`: notes produit/fonctionnelles
- `Prompts/`: prompts et variants
- `Roadmap.md`: macro planning
- `Todo.md`: execution backlog

## Workflow recommande (remote-first)
1. Prioriser verifications cloud (Vercel + endpoints deployes) avant de toucher au local.
2. Si code change necessaire: modifier localement, tester (`check`, `test`, `build`), deploy preview.
3. Mettre a jour docs de reprise si comportement/vars/routes changent.
4. Eviter les secrets en clair dans les fichiers du repo.

## Checklist reprise agent
1. Lire `Roadmap.md`, `Todo.md`, puis `Code/README.md` et `MCP-Server/README.md`.
2. Verifier endpoints:
   - `GET /health`
   - `GET /v1/integrations/health` (Bearer)
   - `GET /v1/mcp/health` (Bearer)
   - MCP `GET /health` et `GET /tools` (`x-api-key`)
3. Valider localement dans `Code/`:
   - `npm run check`
   - `npm test`
   - `npm run build`

## Variables critiques (sans valeurs)
- App: `APP_NAME`, `API_AUTH_TOKEN`, `DATABASE_URL`, `OPENAI_API_KEY`, `VAPI_API_KEY`, `VAPI_WEBHOOK_SECRET`, `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `MCP_SERVER_BASE_URL`, `MCP_API_KEY`
- Policy MCP: `MCP_ALLOWED_TOOLS`, `MCP_REQUIRE_CONFIRMATION`, `MCP_ALLOWLIST_AS_DEFAULT_GRANTS`

## Guardrails
- Ne pas supprimer `kim-mcp-staging` sans migration explicite de `MCP_SERVER_BASE_URL`.
- Ne pas casser les endpoints existants pour introduire une nouveaute UI.
- Ne pas faire de nettoyage destructif local sans sauvegarde distante verifiee.

*Mis a jour: 2026-03-21 | Codex*
