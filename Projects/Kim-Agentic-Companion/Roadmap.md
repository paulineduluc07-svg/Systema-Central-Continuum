# Roadmap -- Kim Agentic Companion

> Vision et etapes du projet.

---

## Vision
Construire une experience compagnon IA proche Replika, mais orientee execution utile: Kim dialogue, se souvient et agit via MCP avec supervision utilisateur.

## Etat actuel
- [x] Projet cree dans SCC
- [x] Cadre produit et architecture v1 poses
- [x] Code applicatif demarre (scaffold API + agent-core + MCP)
- [x] Contrat API v0 etabli (sessions, chat, webhook Vapi)
- [x] Connecteur MCP calendrier v0 integre
- [x] Client MCP cloud configure (API key + timeout)
- [x] Persistance Postgres optionnelle ajoutee (sessions + memoire)
- [x] Endpoint de probe MCP staging ajoute (`GET /v1/mcp/health`)
- [x] User stories MVP v1 redigees
- [x] Modele permissions MCP v1 specifie
- [x] Types permissions scopes integres
- [x] Policy branchee dans les flux API/agent/webhook
- [x] Tests integration critiques ajoutes
- [x] Documentation technique et checklist readiness publiees

## Prochaines etapes
- [ ] Phase 0 -- Product framing + trust boundaries
- [ ] Phase 1 -- MVP chat + memoire + identite Kim
- [ ] Phase 2 -- Voice loop + tool calling MCP limite
- [ ] Phase 3 -- Orchestration agentique + autonomie supervisee
- [ ] Phase 4 -- Durcissement securite + qualite + release beta

## Definition MVP v1
- Chat temps reel
- Memoire profil + contexte
- 1-2 actions MCP non critiques
- Historique des actions
- Fallback/refus clair en cas de risque

---

*Mis a jour : 2026-03-20*
