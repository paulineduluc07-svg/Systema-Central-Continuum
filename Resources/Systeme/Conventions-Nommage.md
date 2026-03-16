# Conventions de nommage — SCC

**Statut :** actif
**Portée :** tout le repo Systema Central Continuum

---

## Dossiers

| Niveau | Convention | Exemples |
|--------|-----------|---------|
| Racine (IPARA) | PascalCase | `Inbox/`, `Projects/`, `Areas/`, `Resources/`, `Archives/` |
| Projets | kebab-case | `Drawn-by-Fate/`, `Systema-Agency/`, `Plateforme-Restaurant/` |
| Sous-dossiers projet | PascalCase | `Code/`, `Notes/`, `Notes-Perso/`, `Prompts/`, `Assets/` |
| Système | kebab-case ou PascalCase selon usage | `Systeme/`, `Workflows/`, `Prompts/` |

---

## Fichiers Markdown

| Type | Convention | Exemples |
|------|-----------|---------|
| Fichiers système / règles | PascalCase ou kebab-case | `AGENTS.md`, `CLAUDE.md`, `Multi-Agent-Collaboration.md` |
| Fichiers workflow | `Workflow-[Type]-[Fonction].md` | `Workflow-Agent-Codage-Terminal.md`, `Workflow-Traces.md` |
| Notes de projet | Titre lisible avec espaces | `Drawn by Fate.md`, `Systema Agency.md` |
| Fichiers de contexte area | `_CONTEXT.md` (underscore + PascalCase) | `_CONTEXT.md` |
| Notes de session Inbox | `[YYYY-MM-DD] [NomAgent].md` | `[2026-03-16] [Claude Code Terminal].md` |
| Fichiers projet standard | PascalCase | `Todo.md`, `Roadmap.md`, `AGENT-INSTRUCTIONS.md` |

---

## Commits

Format obligatoire :
```
[NomAgent] [NomProjet] : Description courte et claire
```

- `NomAgent` : nom de l'IA ou de l'outil (Claude Code, Grok, Cursor, etc.)
- `NomProjet` : nom exact du dossier projet (`Drawn-by-Fate`, `Systema-Agency`, `SCC`, etc.)
- Description : en français, orientée action, sans ponctuation finale

Exemples valides :
```
[Claude Code] [SCC] : Finalisation gouvernance — corrections + 4 workflows
[Grok] [Drawn-by-Fate] : Ajout composant TarotCard
[Claude Code] [Systema-Agency] : Correction bug Map.tsx URL hardcodée
```

---

## Dates

Format ISO partout : `YYYY-MM-DD`

Exemples : `2026-03-16`, `[2026-03-16]`

---

## Langue

| Type de contenu | Langue |
|----------------|--------|
| Docs stratégiques, règles, notes | Français |
| Noms de variables, code, commandes git | Anglais |
| Noms de projets / stacks tech | Anglais si nom propre (TypeScript, Vite, etc.) |

---

## Ce qui ne doit PAS être utilisé

- Underscores dans les noms de dossiers (sauf `_CONTEXT.md` — exception documentée)
- Majuscules dans les noms de projets en kebab-case (`drawn-by-fate` ❌ — `Drawn-by-Fate` ✅)
- Espaces dans les noms de dossiers
- Acronymes non définis dans les noms de fichiers
