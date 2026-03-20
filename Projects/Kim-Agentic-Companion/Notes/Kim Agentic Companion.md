Type : #context
Subject : #product
Status : #inprogress
Date : 2026-03-20

# PROJET -- Kim Agentic Companion

## Ligne d'arrivee
MVP cloud-first d'un compagnon Kim agentic avec actions MCP controlees et auditables.

## C'est quoi
Application compagnon conversationnelle (texte + voix) avec memoire long terme.
Kim peut agir hors de l'app via MCP, dans un cadre de permissions explicites.

## Hypotheses de depart
- Le produit doit rester cloud-first (pas de dependance locale obligatoire)
- Les actions externes sont autorisees par scopes et consentement utilisateur
- L'observabilite des actions est non-negociable

## Architecture cible v1
- Client : UI chat/voix
- Backend : orchestrateur agentique + politique d'action
- Memoire : profil, preferences, historique utile
- MCP gateway : routage vers outils externes
- Safety : guardrails, refus, validation action sensible

## Decisions de session
[2026-03-20] Creation du projet SCC `Projects/Kim-Agentic-Companion/`.
[2026-03-20] Structure standard SCC initialisee (AGENT-INSTRUCTIONS, Todo, Roadmap, Notes, Code, Prompts, Assets, Livrables).
[2026-03-20] Cadrage initial sur un MVP Replika-like + mode agentic + sortie app via MCP.
[2026-03-20] Phase 2 lancee : scaffold TypeScript cloud-first ajoute dans `Code/`.
[2026-03-20] Endpoints initiaux exposes: `GET /health`, `POST /v1/chat`.
[2026-03-20] Policy MCP appliquee: allowlist + consentement utilisateur + confirmation par defaut.
[2026-03-20] Tests unitaires initiaux ajoutes sur memory store et policy MCP.

## Prochaines etapes immediates
- Finaliser les user stories MVP
- Definir le protocole permissions/outils MCP
- Integrer un premier connecteur MCP reel
- Brancher une couche auth/session

*Mis a jour : 2026-03-20 | Codex -- SCC*