# Kim MCP Server (Staging)

Serveur MCP minimal pour les tests de staging de Kim.

## Endpoints exposes
- `GET /health`
- `GET /tools`
- `POST /invoke`
- `POST /calendar/create-event`

## Auth
Si `MCP_SERVER_API_KEY` est defini, le serveur exige soit:
- header `x-api-key: <key>`
- ou `authorization: Bearer <key>`

## Outils supportes
- `calendar.create_event`
- `system.get_time`
- `web.fetch`
