# Kim Agentic Companion

Point d entree rapide du projet Kim dans SCC.

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

## Etat de reference (2026-03-21)
- Backend: stable en staging, endpoints critiques actifs.
- Frontend: etat reel confirme sur `main` = fin F4 / pre-F5.
- Frontend conserve la stack validee: `Next.js 15 + React 19 + Three.js + React Three Fiber + Drei`.
- Alternatives refusees: pas de Babylon.js, pas de Unity WebGL.
- Direction frontend a suivre: `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`.
- Prochaine phase executable: F5 = montee en fidelite, avatar `GLB`, wardrobe, room decoration, perf mobile.

## Services cloud actifs
- App staging backend: `https://kim-agentic-companion-staging.vercel.app`
- MCP staging: `https://kim-mcp-staging.vercel.app`

## Reprise rapide (nouvel agent)
1. Lire `AGENT-INSTRUCTIONS.md`
2. Lire `Todo.md` et `Roadmap.md`
3. Si travail frontend: lire `Frontend/README.md`, `Frontend/AGENT-INSTRUCTIONS.md`, `Livrables/Frontend-Implementation-Plan.md` et `Livrables/Frontend-Fidelity-Direction-2026-03-21.md`
4. Identifier si le lot concerne `Code/` ou `Frontend/`
5. Respecter le protocole multi-agent avant de passer a la phase suivante

## Regle operationnelle
- Remote-first prioritaire.
- Le local sert seulement pour coder, tester puis redeployer.
- Ne pas stocker de secrets dans le repo.
- Une phase frontend est marquee complete seulement apres verification par un second agent.