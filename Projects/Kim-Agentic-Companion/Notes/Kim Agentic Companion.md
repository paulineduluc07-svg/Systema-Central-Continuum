Type : #context
Subject : #product
Status : #inprogress
Date : 2026-03-22

# PROJET -- Kim

## Ligne darrivee
MVP cloud-first d un AI agent Kim ultra-competent avec actions MCP controlees et auditables.

## Cest quoi
Application agentique conversationnelle (texte + voix) avec memoire long terme.
Kim peut agir hors de l app via MCP, dans un cadre de permissions explicites, pour aider sur fichiers, dossiers, sites et workflows.

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
[2026-03-22] Raffinement du flux permissions/outils frontend: memoire locale des permissions reutilisee pour les commandes `/tool ...`, nettoyage au logout, affichage des refus outils dans le chat.
[2026-03-22] Couverture de tests et verifications locales passees sur le frontend et les types partages.
[2026-03-22] Preparation PWA initiale ajoutee: metadata / viewport et manifest web app de base.
[2026-03-22] Staging frontend redeploye en preview puis en URL canonique `https://kim-frontend-staging.vercel.app`.
[2026-03-22] Verification Vercel faite: le token backend attendu par le frontend est `API_AUTH_TOKEN` dans le projet `kim-agentic-companion-staging`.
[2026-03-22] Passage manuel sur le staging avec vrai token API realise.
[2026-03-22] Retour produit retenu: le chat est la surface la plus convaincante; auth, tools, settings et le visuel global demandent encore une reprise importante.
[2026-03-22] Estimation qualitative retenue pour la fidelite frontend actuelle: environ 10% de la vision cible.
[2026-03-22] Decision explicite: ne pas signer `F6` cote produit et ne pas ouvrir `F7`.
[2026-03-22] Rebaseline documentaire engagee dans `README.md`, `Todo.md`, `Roadmap.md`, `Frontend/README.md`, `Frontend/AGENT-INSTRUCTIONS.md` et les livrables frontend.
[2026-03-22] Nouveaux livrables de cadrage ajoutes: `Livrables/F6-Staging-Validation-Checklist-2026-03-22.md`, `Livrables/F7-Preparation-Plan-2026-03-22.md`, `Livrables/Frontend-Rebaseline-2026-03-22.md`.
[2026-03-22] Clarification produit: Kim n est pas une app de compagnie; Kim est un AI agent ultra-competent oriente execution et amelioration de performance de vie.
[2026-03-22] Clarification references: posture produit / backend plus proche d un produit type OpenClaw; Replika et des references jeu video servent seulement a cadrer la qualite visuelle frontend et la 3D.
[2026-03-22] Des captures de comparaison Replika / Kim ont ete ajoutees dans `Notes/` pour servir de support d audit visuel.
[2026-03-22] Nouveau livrable de positionnement ajoute: `Livrables/Product-Positioning-2026-03-22.md`.

## Prochaines etapes immediates
- Faire un audit ecran par ecran du frontend actuel contre le positionnement clarifie
- Lister les ecarts visuels et UX par severite
- Isoler un premier lot de reprise coeur frontend hors chat
- Decider si la scene actuelle doit etre iteree ou reprise plus franchement
- Reprioriser le backlog avant tout nouveau dev significatif
- Garder `F7` fermee tant que le coeur frontend n est pas juge credible

*Mis a jour : 2026-03-22 | Codex -- SCC*
