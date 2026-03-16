---
name: scc-status
description: SCC active projects dashboard. Reads Todo.md and Roadmap.md for every active project plus the Reconstruction area, and produces a clean status overview. Read-only.
---

# SCC Status — Dashboard projets actifs

Vue d'ensemble rapide de l'état de tous les projets actifs. Lis tout, modifie rien.

## Workflow

Make a todo list and work through each step sequentially.

### Étape 1 — Lister les projets actifs

Liste tous les dossiers dans `Projects/`. Pour chacun, note s'il contient `Todo.md` et/ou `Roadmap.md`.

### Étape 2 — Lire l'état de chaque projet

Pour chaque projet trouvé :
- Lis `Todo.md` en entier (s'il existe)
- Lis `Roadmap.md` en entier (s'il existe)
- Lis `Notes/` si des notes récentes existent (les 2-3 fichiers les plus récents seulement)

Détermine le statut perçu :
- **En cours** — travail actif, tâches en progression
- **En attente** — tâches définies mais bloquées ou non démarrées
- **Bloqué** — bloqué par une décision, une dépendance externe, ou un manque de ressource
- **Pas encore démarré** — structure créée mais aucun contenu réel

### Étape 3 — Lire l'état de l'Area Reconstruction

Lis `Areas/Reconstruction/_CONTEXT.md` en entier (s'il existe).
Résume l'état de la transition professionnelle en 2-3 lignes.

### Étape 4 — Dashboard final

Présente le dashboard suivant :

```
# SCC Status — [DATE]

## Vue d'ensemble
[X] projets actifs | [X] en cours | [X] en attente | [X] bloqués

---

## [Nom Projet 1]
**Statut :** En cours / En attente / Bloqué / Pas encore démarré
**Stack :** [depuis CLAUDE.md ou Notes]
**Prochaines actions :**
- [action 1]
- [action 2]
**Blocages :** [Si aucun : "Aucun"]

---

## [Nom Projet 2]
(idem)

---

## Area — Reconstruction
**Période :** Mars–Juin 2026
**État :** [résumé 2-3 lignes]
**Prochaine étape :** [X]

---

## Résumé Paw
[1-2 phrases synthétisant l'état global : où en est-on, quelle est la priorité du moment]
```

Direct, sans embellissement. Si un fichier est vide ou manquant, indique-le clairement.
