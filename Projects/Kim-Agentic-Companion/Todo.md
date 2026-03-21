# Todo -- Kim Agentic Companion

> Taches actives. Mise a jour a chaque session.

---

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

## Priorites immediates
- [ ] Definir et appliquer le nom final via `APP_NAME` (dev/preview/prod)
- [ ] Ajouter page memoire (liste + edition) dans UI
- [ ] Ajouter auth UX plus simple que token manuel en frontend
- [ ] Prioriser 3 outils "clawbot-like" a implementer ensuite
- [ ] Rendre les docs de runbook encore plus operationnelles

## Checklist securite
- [x] Secrets uniquement en variables denvironnement
- [x] Aucune action MCP sans consentement explicite
- [x] Journalisation de chaque action externe
- [x] Politique de refus sur actions sensibles
- [x] Verification signature webhook Vapi (si secret configure)
- [x] Bearer auth API (si token configure)

## Checklist technique
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

*Mis a jour : 2026-03-21*
