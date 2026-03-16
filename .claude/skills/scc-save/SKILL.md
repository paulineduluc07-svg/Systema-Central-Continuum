---
name: scc-save
description: SCC session close. Creates a dated session note in Inbox/ and updates MEMORY.md if it exists. Use at the end of every session on the Systema Central Continuum.
---

# SCC Save — Fermeture de session

Sauvegarde ce qui a été fait cette session. Crée une note de session propre dans `Inbox/`.

## Workflow

Make a todo list and work through each step sequentially.

### Étape 1 — Résumer la session courante

Analyse la conversation de cette session. Identifie :
- Ce qui a été accompli concrètement (fichiers créés/modifiés, décisions prises)
- Les fichiers touchés (chemins exacts)
- Les décisions importantes prises
- Les blocages rencontrés (si applicable)
- La prochaine étape logique

### Étape 2 — Créer la note de session

Détermine la date du jour (format `YYYY-MM-DD`).

Crée le fichier : `Inbox/[YYYY-MM-DD] [Claude Code Terminal].md`

Si un fichier avec ce nom existe déjà : ajoute le contenu à la fin avec un séparateur `---`.

Contenu de la note :

```markdown
# [YYYY-MM-DD] [Claude Code Terminal]

## Résumé session
[2-4 phrases décrivant ce qui a été fait]

## Fichiers modifiés / créés
- `chemin/fichier1` — [action : créé / modifié / supprimé]
- `chemin/fichier2` — [action]

## Décisions prises
- [Décision 1]
- [Décision 2]

## Blocages / Avertissements
[Si aucun : "Aucun"]

## Prochaine étape
[Action concrète suivante]
```

### Étape 3 — Mettre à jour MEMORY.md (si existant)

Vérifie si `MEMORY.md` existe à la racine du repo.

Si oui : identifie les nouveaux faits importants de cette session (décisions structurantes, changements d'état projet, règles ajoutées) et ajoute-les à la fin avec la date.

Si non : ne le crée pas. Note simplement "MEMORY.md absent — non créé."

### Étape 4 — Confirmer

Affiche :

```
# SCC Save — [DATE]

## Note de session créée
Fichier : Inbox/[YYYY-MM-DD] [Claude Code Terminal].md ✅

## MEMORY.md
[Mis à jour / Absent — non créé]

## Pour commiter (si Paw le demande)
git add Inbox/[YYYY-MM-DD]\ [Claude\ Code\ Terminal].md
git commit -m "[Claude Code] [SCC] : Note session [YYYY-MM-DD]"
```

Ne commit PAS automatiquement. Attends l'instruction de Paw.
