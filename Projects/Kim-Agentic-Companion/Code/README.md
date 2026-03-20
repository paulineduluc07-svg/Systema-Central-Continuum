# Code -- Kim Agentic Companion

## Objectif du dossier
Contenir l'implementation technique cloud-first du produit Kim agentic companion.

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
- `src/mcp-gateway/` : policy d'autorisation, client MCP et connecteurs outils
- `src/persistence/` : bootstrap PostgreSQL + migrations minimales
- `src/shared/` : types, auth, signature webhook, logging
- `tests/` : tests unitaires et integration

## Endpoints exposes
- `GET /health`
- `GET /v1/mcp/health` (token bearer requis si `API_AUTH_TOKEN` configure)
- `POST /v1/sessions` (token bearer requis si `API_AUTH_TOKEN` configure)
- `POST /v1/chat` (token bearer requis si `API_AUTH_TOKEN` configure)
- `POST /v1/webhooks/vapi` (signature HMAC requise si `VAPI_WEBHOOK_SECRET` configure)

## Webhook Vapi
`POST /v1/webhooks/vapi` accepte maintenant aussi:
- `grantedTools: string[]`
- `requestedTool: { name, input, sensitive? }`

Cela permet de declencher des tool-calls MCP depuis les evenements webhook (sous policy gate).

## Variables cloud critiques
- `DATABASE_URL` : active la persistance Postgres
- `PGSSL_DISABLE` : desactive SSL DB si necessaire (`false` par defaut)
- `MCP_SERVER_BASE_URL` : URL du serveur MCP cloud
- `MCP_API_KEY` : cle API pour le serveur MCP cloud
- `MCP_TIMEOUT_MS` : timeout reseau MCP

## Templates d'environnement
- `.env.example`
- `.env.staging.example`
- `.env.production.example`

## Lancer localement (optionnel)
```bash
npm install
npm run dev
```

## Principes securite deja poses
- Aucune action outil sans policy gate
- Liste blanche outils via `MCP_ALLOWED_TOOLS`
- Consentement utilisateur requis via `grantedTools`
- Confirmation par defaut avant action MCP (`MCP_REQUIRE_CONFIRMATION=true`)
- Auth bearer optionnelle via `API_AUTH_TOKEN`
- Verification de signature webhook Vapi via `VAPI_WEBHOOK_SECRET`
- Journalisation minimale des evenements cote serveur