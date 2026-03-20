# Code -- Kim Agentic Companion

## Objectif du dossier
Contenir limplementation technique cloud-first du produit Kim agentic companion.

## Stack v1
- Runtime: Node.js 20+
- Langage: TypeScript
- Serveur: HTTP natif Node
- DB: PostgreSQL optionnelle (fallback in-memory)
- Tests: Vitest
- LLM: OpenAI Responses API (optionnel, fallback local si cle absente)

## Arborescence
- `src/api/` : endpoints HTTP
- `src/agent-core/` : logique conversation, memoire, sessions, reponse LLM
- `src/mcp-gateway/` : policy dautorisation, client MCP et connecteurs outils
- `src/persistence/` : bootstrap PostgreSQL + migrations minimales
- `src/shared/` : types, auth, signature webhook, logging
- `tests/` : tests unitaires et integration

## Endpoints exposes
- `GET /health`
- `GET /v1/mcp/health` (token bearer requis si `API_AUTH_TOKEN` configure)
- `POST /v1/sessions` (token bearer requis si `API_AUTH_TOKEN` configure)
- `POST /v1/chat` (token bearer requis si `API_AUTH_TOKEN` configure)
- `POST /v1/webhooks/vapi` (signature HMAC requise si `VAPI_WEBHOOK_SECRET` configure)

## Payload permissions et outils
`POST /v1/chat` et `POST /v1/webhooks/vapi` peuvent inclure:
- `grantedTools: string[]`
- `revokedTools: string[]`
- `confirmationProvided: boolean`
- `requestedTool: { name, input, sensitive? }`

Optionnellement, un format enrichi est supporte:
- `permissionContext.revokes[].scope`
- `permissionContext.confirmationProvided`

## Policy MCP (v1)
Decision gate applique dans les flux API -> Agent -> MCP:
1. verify allowlist (`MCP_ALLOWED_TOOLS`)
2. deny si scope revoque
3. deny si scope non accorde
4. demander confirmation si action sensible ou confirmation globale active
5. executer outil MCP seulement si autorise

Reason codes courants:
- `tool_not_in_server_allowlist`
- `tool_not_granted_by_user`
- `tool_scope_revoked`
- `confirmation_required`

## Variables cloud critiques
- `DATABASE_URL` : active la persistance Postgres
- `PGSSL_DISABLE` : desactive SSL DB si necessaire (`false` par defaut)
- `MCP_SERVER_BASE_URL` : URL du serveur MCP cloud
- `MCP_API_KEY` : cle API pour le serveur MCP cloud
- `MCP_TIMEOUT_MS` : timeout reseau MCP
- `MCP_ALLOWED_TOOLS` : allowlist des outils
- `MCP_REQUIRE_CONFIRMATION` : confirmation par defaut (`true` ou `false`)
- `API_AUTH_TOKEN` : token bearer API optionnel
- `VAPI_WEBHOOK_SECRET` : secret signature webhook

## Exemples derreurs API
- `401 unauthorized` si token bearer invalide
- `401 invalid_signature` sur webhook signe incorrect
- `400 invalid_payload` sur schema invalide
- `404 session_not_found` si session inconnue
- `tool.status = blocked` avec detail policy si outil refuse

## Templates denvironnement
- `.env.example`
- `.env.staging.example`
- `.env.production.example`

## Lancer localement (optionnel)
```bash
npm install
npm run dev
```

## Principes securite poses
- Aucune action outil sans policy gate
- Liste blanche outils via `MCP_ALLOWED_TOOLS`
- Consentement utilisateur explicite via payload permissions
- Confirmation sur action sensible
- Auth bearer optionnelle via `API_AUTH_TOKEN`
- Verification signature webhook Vapi via `VAPI_WEBHOOK_SECRET`
- Journalisation minimale des evenements cote serveur
