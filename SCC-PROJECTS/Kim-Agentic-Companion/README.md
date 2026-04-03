# Anima Ingenium

> **Note de lien : Kim-Agentic-Companion = Anima Ingenium Prototype 2.**
> Ce projet porte le nom de dossier `Kim-Agentic-Companion` dans le SCC mais son nom officiel est **Anima Ingenium**.
> Kim est le nom de l'agent IA (le personnage). Anima Ingenium est le nom du produit/projet global.
> Prototype 1 = `Systema-Agency`. Prototype 2 = ce projet (le plus avance).
> Le prochain cycle de developpement repartira de cette base, pas de zero.

Point d entree rapide du projet dans SCC.

## Dossiers
- `Code/`: app backend principale (API + agent core + voice + tests)
- `Frontend/`: app frontend separee (Next.js + UI + 3D + mobile)
- `MCP-Server/`: serveur MCP minimal
- `Assets/`: assets visuels
- `Notes/`: notes produit, memoire operationnelle partagee et traces de session
- `Prompts/`: prompts/outils de prompt engineering
- `Livrables/`: plans, checklists et direction frontend
- `Roadmap.md`: vision et phases
- `Todo.md`: backlog execution
- `AGENT-INSTRUCTIONS.md`: consignes de reprise agent

## Etat de reference (2026-03-26)
- Backend: stable en staging, endpoints critiques actifs, CORS frontend staging corrige.
- Frontend: prototype redeploye sur staging, mais non signe cote produit.
- Convention de nommage clarifiee: **Anima Ingenium** = nom du produit/projet; **Kim** = nom de l agent IA / personnage.
- Positionnement produit clarifie: Anima Ingenium n est pas une app de compagnie; Kim est un AI agent ultra-competent oriente execution, fichiers, dossiers, sites et workflows.
- Reference de posture produit hors frontend immersif: approche plus proche d un produit type OpenClaw que d une app de compagnie.
- Replika et certains jeux video ne sont que des references de qualite visuelle frontend, de presence 3D et de finition.
- Retour produit le plus recent avec token reel: le chat semble etre la brique la plus crediblement utilisable; auth, tools, settings et la direction visuelle demandent encore une reprise importante.
- Le rendu visuel actuel est juge tres loin de la cible produit, ordre de grandeur estime: ~10% de la vision.
- Nouvelle priorite backend en cours: fonder un cognitive runtime centre regulation, fiabilite, retention de contexte et action, plutot qu une simple logique de prompt ou de companionship.
- Socle envisage pour cette couche: OpenClaw comme base d outils/runtime, et extension propre pour la lecture de situation, les engagements, la policy et la consolidation post-tour.
- Les phases `F1` a `F7` sont strictement des phases frontend.
- Une validation backend ne change jamais le statut d une phase `F`.
- Frontend conserve la stack validee: `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`.
- Alternatives refusees: pas de Babylon.js, pas de Unity WebGL.
- Cadrage produit detaille: `Livrables/Product-Positioning-2026-03-22.md`.
- Direction frontend a suivre: `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`.
- Validation frontend locale recente: `npm test`, `npm run typecheck`, `npm run build` passes dans `Frontend/`; deploiement staging canonical refait le 2026-03-22.
- `F7` ne doit pas etre ouverte tant que le frontend courant n a pas ete recadre contre la vision.
- Traces projet a lire pour la session backend/runtime: `Notes/Anima Ingenium.md`
- Prochaine etape utile backend: specifier et implementer la fondation du cognitive runtime (`state snapshot`, `commitment ledger`, `context engine`, `policy gate`, `post-turn consolidation`).
- Prochaine etape utile frontend: audit frontend complet, backlog de reprise priorise, puis corrections du coeur frontend avant tout travail mobile/PWA.

## Validation backend recente (2026-03-22)
- Backend `Code/` valide localement dans un worktree temporaire isole.
- Commandes passees: `npm run check`, `npm test`, `npm run build`.
- Resultat tests: `10` fichiers / `33` tests passes.
- Validation reseau staging: `OPTIONS /v1/tools` et `GET /v1/tools` renvoient les headers CORS attendus pour `https://kim-frontend-staging.vercel.app`.
- Cette validation backend n affecte aucun statut de phase `F`.
- Le dossier temporaire de test a ete supprime apres execution pour eviter tout doublon local persistant.

## Services cloud actifs
- App staging backend: `https://kim-agentic-companion-staging.vercel.app`
- App staging frontend: `https://kim-frontend-staging.vercel.app`
- MCP staging: `https://kim-mcp-staging.vercel.app`

## Reprise rapide (nouvel agent)
1. Lire `AGENT-INSTRUCTIONS.md`
2. Lire `Todo.md` et `Roadmap.md`
3. Lire `Notes/Anima Ingenium.md`
4. Lire `Livrables/Product-Positioning-2026-03-22.md`
5. Si travail frontend: lire `Frontend/README.md`, `Frontend/AGENT-INSTRUCTIONS.md`, `Livrables/Frontend-Rebaseline-2026-03-22.md`, `Livrables/Frontend-Implementation-Plan.md` et `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`
6. Identifier si le lot concerne `Code/` ou `Frontend/`
7. Respecter le protocole multi-agent avant de passer a la phase suivante

## Regle operationnelle
- Remote obligatoire.
- Le local sert seulement pour coder, tester puis redeployer.
- Supprimer toute trace locale du repo, des tests et du travail a la fin des taches.
- Pour les tests locaux, preferer un worktree temporaire isole si le clone principal est sale.
- Ne pas stocker de secrets dans le repo.
- Une phase frontend est marquee complete seulement apres verification par un second agent.
- Ne pas confondre presence en code et acceptation produit.
