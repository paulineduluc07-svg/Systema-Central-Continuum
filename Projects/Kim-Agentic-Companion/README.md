# Anima Ingenium

Point d entree rapide du projet dans SCC.

## Dossiers
- `Code/`: app backend principale (API + agent core + voice + tests)
- `Frontend/`: app frontend separee (Next.js + UI + 3D + mobile)
- `MCP-Server/`: serveur MCP minimal
- `Assets/`: assets visuels
- `Notes/`: notes produit et direction visuelle
- `Prompts/`: prompts/outils de prompt engineering
- `Livrables/`: plans, checklists et direction frontend
- `Roadmap.md`: vision et phases
- `Todo.md`: backlog execution
- `AGENT-INSTRUCTIONS.md`: consignes de reprise agent

## Etat de reference (2026-03-22)
- Backend: stable en staging, endpoints critiques actifs, CORS frontend staging corrige.
- Frontend: etat reel confirme sur `main` = F5 implemente et deploye en staging.
- Les phases `F1` a `F7` sont strictement des phases frontend.
- Une validation backend ne change jamais le statut d une phase `F`.
- Frontend conserve la stack validee: `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`.
- Direction frontend a suivre: `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`.
- Prochaine etape utile: verification independante de F5, puis ouverture de F6.

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
3. Si travail frontend: lire `Frontend/README.md`, `Frontend/AGENT-INSTRUCTIONS.md`, `Livrables/Frontend-Implementation-Plan.md` et `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`
4. Identifier si le lot concerne `Code/` ou `Frontend/`
5. Respecter le protocole multi-agent avant de passer a la phase suivante

## Regle operationnelle
- Remote obligatoire.
- Le local sert seulement pour tester puis redeployer.
- suprimer toute trace du repos, des tests et du travail dans le local a la fin des taches. 

