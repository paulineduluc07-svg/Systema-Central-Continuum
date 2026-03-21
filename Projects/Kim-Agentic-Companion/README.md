# Kim Agentic Companion

Point dentree rapide du projet Kim dans SCC.

## Dossiers
- `Code/`: app principale (API + UI web + agent core + tests)
- `MCP-Server/`: serveur MCP (health, tools, invoke)
- `Assets/`: assets visuels
- `Notes/`: notes produit et direction visuelle
- `Prompts/`: prompts/outils de prompt engineering
- `Roadmap.md`: vision et phases
- `Todo.md`: backlog execution
- `AGENT-INSTRUCTIONS.md`: consignes de reprise agent

## Services cloud actifs
- App staging: `https://kim-agentic-companion-staging.vercel.app`
- MCP staging: `https://kim-mcp-staging.vercel.app`

## Reprise rapide (nouvel agent)
1. Lire `AGENT-INSTRUCTIONS.md`
2. Lire `Todo.md` et `Roadmap.md`
3. Lire `Code/README.md` et `MCP-Server/README.md`
4. Valider:
   - `Code`: `npm run check && npm test && npm run build`
   - Cloud endpoints de sante (avec auth si requis)

## Regle operationnelle
Remote-first prioritaire.
Le local sert seulement pour coder/tester puis redeployer.
Ne pas stocker de secrets dans le repo.
