# Code -- Kim Agentic Companion

## Objectif du dossier
Contenir l'implementation technique cloud-first du produit Kim agentic companion.

## Stack v1 (scaffold)
- Runtime: Node.js 20+
- Langage: TypeScript
- Serveur: HTTP natif Node
- Tests: Vitest
- LLM: OpenAI Responses API (optionnel, fallback local si cle absente)

## Arborescence
- `src/api/` : endpoints HTTP
- `src/agent-core/` : logique conversation, memoire, sessions, reponse LLM
- `src/mcp-gateway/` : policy d'autorisation, client MCP et connecteurs outils
- `src/shared/` : types, auth, signature webhook, logging
- `tests/` : tests unitaires de base

## Endpoints exposes
- `GET /health`
- `POST /v1/sessions` (token bearer requis si `API_AUTH_TOKEN` configure)
- `POST /v1/chat` (token bearer requis si `API_AUTH_TOKEN` configure)
- `POST /v1/webhooks/vapi` (signature HMAC requise si `VAPI_WEBHOOK_SECRET` configure)

## Exemple de payload `POST /v1/sessions`
```json
{
  "userId": "user_123"
}
```

## Exemple de payload `POST /v1/chat`
```json
{
  "sessionId": "session_abc",
  "message": "Aide moi a organiser ma journee",
  "grantedTools": ["calendar.create_event"],
  "requestedTool": {
    "name": "calendar.create_event",
    "input": {
      "title": "Call",
      "startAt": "2026-03-21T10:00:00Z",
      "timezone": "America/Toronto"
    },
    "sensitive": false
  }
}
```

## Variables d'environnement
Voir `.env.example`.

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