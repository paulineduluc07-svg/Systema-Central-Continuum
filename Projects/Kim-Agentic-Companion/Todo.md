# Todo -- Kim Agentic Companion

> Taches actives. Mise a jour a chaque session.

---

- [x] Initialiser la structure SCC du projet
- [x] Poser le cadre produit (Kim agentic + MCP)
- [ ] Definir user stories MVP (chat, voix, memoire, actions)
- [ ] Definir schema de permissions MCP (grant/revoke + scopes)
- [ ] Specifier le contrat API webhook/tool-calls
- [x] Choisir stack de deploiement cloud v1
- [x] Implementer squelette backend agent + memory
- [ ] Integrer premier connecteur MCP (calendrier ou notes)
- [x] Ajouter observabilite minimale (logs, erreurs, traces actions)
- [ ] Ecrire tests de parcours critiques

## Checklist securite initiale
- [x] Secrets uniquement en variables d'environnement
- [x] Aucune action MCP sans consentement explicite
- [x] Journalisation de chaque action externe
- [x] Politique de refus sur actions sensibles

## Checklist technique v0
- [x] Endpoint `GET /health`
- [x] Endpoint `POST /v1/chat`
- [x] Store memoire in-memory
- [x] Policy MCP allowlist + confirmation
- [x] Client MCP (stub HTTP)
- [x] Tests unitaires policy + memory

---

*Mis a jour : 2026-03-20*