---
name: scc-init
description: SCC session startup. Loads context from CLAUDE.md, reads the latest session note, and reports active project states. Use at the start of every session on the Systema Central Continuum.
---

# SCC Init — Démarrage de session

Charge le contexte SCC complet et présente un résumé d'état. Lis tout, modifie rien.

## Workflow

Make a todo list and work through each step sequentially.

### Étape 1 — Charger le contexte Paw

Lis `CLAUDE.md` en entier. Retiens :
- Projets actifs + stacks
- Codes de session (INIT, SAVE)
- Style de communication attendu
- Règles absolues SCC

### Étape 2 — Charger les règles agents

Lis en entier :
- `AGENTS.md`
- `Resources/Systeme/Multi-Agent-Collaboration.md`

Confirme mentalement que les règles sont chargées avant de continuer.

### Étape 3 — Trouver la dernière note de session

Liste tous les fichiers dans `Inbox/`. Identifie le plus récent (format `[YYYY-MM-DD]*.md`).
Lis-le en entier. Résume en 3-5 lignes max : ce qui a été fait, les décisions prises, la prochaine étape indiquée.

Si `Inbox/` est vide ou ne contient aucune note de session : indique "Aucune session précédente trouvée."

### Étape 4 — État des projets actifs

Pour chaque projet dans `Projects/` :
- Lis `Todo.md` (s'il existe et n'est pas vide)
- Lis `Roadmap.md` (s'il existe et n'est pas vide)
- Note le statut perçu : En cours / En attente / Bloqué / Pas encore démarré

### Étape 5 — Rapport de démarrage

Présente le rapport suivant :

```
# SCC Init — [DATE]

## Contexte chargé
- Paw : [lieu, situation en 1 ligne]
- Projets actifs : [liste des projets]
- Règles agents : ✅ AGENTS.md + Multi-Agent-Collaboration.md lus

## Dernière session
[Résumé 3-5 lignes de la note la plus récente dans Inbox/]
Prochaine étape indiquée : [X]

## État des projets

### [Nom Projet 1]
- Todo : [résumé ou "vide"]
- Roadmap : [résumé ou "vide"]
- Statut : En cours / En attente / Bloqué / Pas encore démarré

### [Nom Projet 2]
(idem)

## Prêt à travailler
Session active. En attente de la prochaine instruction de Paw.
```

Court, direct, sans validation ni embellissement.
