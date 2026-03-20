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
- `src/agent-core/` : logique conversation, memoire, reponse LLM
- `src/mcp-gateway/` : policy d'autorisation et client MCP
- `src/shared/` : types et logging
- `tests/` : tests unitaires de base

## Endpoints exposes
- `GET /health`
- `POST /v1/chat`

## Exemple de payload `POST /v1/chat`
```json
{
  "userId": "user_123",
  "message": "Aide moi a organiser ma journee",
  "grantedTools": ["calendar.create_event"],
  "requestedTool": {
    "name": "calendar.create_event",
    "input": {
      "title": "Call",
      "time": "2026-03-21T10:00:00Z"
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
- Confirmation par defaut avant action MCP (`MCP_REQUIRE_CONFIRMATION=true`)
- Journalisation minimale des evenements cote serveur