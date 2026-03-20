# Code -- Kim Agentic Companion

## Objectif du dossier
Contenir l'implementation technique du produit Kim agentic companion.

## Architecture proposee (v1)
- `client/` : interface chat/voix
- `api/` : endpoints publics (webhooks, sessions, actions)
- `agent-core/` : orchestration, memory policies, decision loop
- `mcp-gateway/` : interface avec serveurs MCP
- `shared/` : schemas, types et utilitaires

## Principes techniques
- Cloud-first et deploiement continu
- Secrets via environnement uniquement
- Actions externes MCP sous politique de permissions
- Logs d'actions horodates et auditables
- Validation automatique des flux critiques

## Prerequis de securite
- Authentification utilisateur avant actions externes
- Confirmation explicite pour actions sensibles
- Timeouts/retries limites sur appels outils
- Circuit breaker sur outils indisponibles