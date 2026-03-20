Type : #context
Subject : #product
Status : #inprogress
Date : 2026-03-20

# PROJET -- Kim Agentic Companion

## Ligne darrivee
MVP cloud-first dun compagnon Kim agentic avec actions MCP controlees et auditables.

## Cest quoi
Application compagnon conversationnelle (texte + voix) avec memoire long terme.
Kim peut agir hors de lapp via MCP, dans un cadre de permissions explicites.

## Hypotheses de depart
- Le produit doit rester cloud-first (pas de dependance locale obligatoire)
- Les actions externes sont autorisees par scopes et consentement utilisateur
- Lobservabilite des actions est non-negociable

## Architecture cible v1
- Client : UI chat/voix
- Backend : orchestrateur agentique + politique daction
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
[2026-03-20] Extension API: `POST /v1/sessions` + `POST /v1/webhooks/vapi`.
[2026-03-20] Securite API ajoutee: bearer token optionnel + verification HMAC webhook Vapi.
[2026-03-20] Premier connecteur MCP reel integre: `calendar.create_event` avec validation payload.
[2026-03-20] Client MCP cloud renforce: API key + timeout + headers auth.
[2026-03-20] Persistance Postgres ajoutee en mode mirror (hydratation au boot + replication ecritures).
[2026-03-20] Templates env staging/prod ajoutes pour configuration cloud.
[2026-03-20] Endpoint `GET /v1/mcp/health` ajoute pour probe MCP staging cote backend.
[2026-03-20] Webhook Vapi etendu pour propager `grantedTools` + `requestedTool`.
[2026-03-20] User stories MVP v1 publiees dans `Livrables/MVP-User-Stories-v1.md`.
[2026-03-20] Spec permissions MCP v1 publiee dans `Livrables/MCP-Permissions-v1.md`.
[2026-03-20] Types permissions/revoke/confirmation ajoutes et relies a la policy.
[2026-03-20] Flux API et webhook connectes a `revokedTools` et `confirmationProvided`.
[2026-03-20] Tests integration et unitaires etendus (chat nominal, webhook signe, refus policy, confirmation).
[2026-03-20] README technique mis a jour pour contrat permissions et codes derreur.
[2026-03-20] Checklist readiness MVP publiee dans `Livrables/MVP-Readiness-Checklist.md`.

## Prochaines etapes immediates
- Integrer un MCP server cloud en staging avec secrets reels
- Finaliser la validation GO/NO-GO sur la checklist readiness
- Ajouter enforcement explicite dexpiration de consentement (TTL) dans la voie integration
- Preparer un dry-run de release beta interne

*Mis a jour : 2026-03-20 | Codex -- SCC*
