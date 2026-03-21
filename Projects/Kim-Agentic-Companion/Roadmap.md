# Roadmap -- Kim Agentic Companion

> Vision, etapes et statut reel.

---

## Vision
Construire une experience compagnon IA proche Replika, mais orientee execution utile: Kim dialogue, se souvient et agit via MCP avec supervision utilisateur.

## Etat actuel (confirme)
- [x] API backend deployee sur Vercel (staging) avec auth bearer optionnelle
- [x] UI web de base en ligne (galaxy room + avatar rose + chat reel)
- [x] Sessions + memoire persistantes via Postgres
- [x] LLM connecte via OpenAI Responses API
- [x] Voice stack active (Vapi + ElevenLabs)
- [x] MCP policy gate active (allowlist/grants/revokes/confirmation)
- [x] Outils MCP exposes (`calendar.create_event`, `system.get_time`, `web.fetch`)
- [x] Endpoints outils app (`GET /v1/tools`, `POST /v1/tools/invoke`)
- [x] Tests unitaires/integration passes

## Phases restantes
- [ ] Phase 3 -- Orchestration agentique plus riche (skills composees, workflows multi-outils)
- [ ] Phase 4 -- Frontend 3D evolue (customisation avatar, scene interactive)
- [ ] Phase 5 -- Durcissement securite + observabilite + beta publique
- [ ] Phase 6 -- Mobile packaging (PWA avancee ou app native)

## Cibles produit court terme
- Personnalisation Kim (tenues/accessoires/profil)
- Memoires consultables/modifiables dans linterface
- Outils "clawbot-like" prioritaires avec permissions claires
- Qualite conversationnelle et latence plus stables
- Nommage final de lapp (`APP_NAME`) applique sur tous les environnements

---

*Mis a jour : 2026-03-21*
