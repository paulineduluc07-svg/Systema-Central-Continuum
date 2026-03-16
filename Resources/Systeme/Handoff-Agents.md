# Handoff entre agents — SCC

**Statut :** actif
**But :** Définir comment un agent passe le relais proprement pour qu'un autre puisse continuer sans perdre de contexte.

---

## 1) Ce qu'un agent doit documenter avant de terminer

Avant de clore une session, l'agent doit s'assurer que les éléments suivants sont accessibles au prochain agent :

- **Ce qui a été fait** — fichiers créés, modifiés, supprimés
- **État actuel** — où en est le travail, qu'est-ce qui est terminé
- **Décisions prises** — et pourquoi (tracées si N2+)
- **Blocages en suspens** — ce qui attend Paw ou une autre ressource
- **Prochaine étape concrète** — l'action suivante la plus logique

---

## 2) Où documenter le handoff

| Contexte | Emplacement |
|----------|------------|
| Handoff fin de session | Créer une note dans `Inbox/` via `scc-save` |
| Handoff en cours de projet | Ajouter dans `Projects/<Projet>/Notes/` avec signature |
| Handoff transversal SCC | Ajouter dans `Resources/Systeme/Multi-Agent-Collaboration.md` si trace nécessaire |

---

## 3) Format de note de handoff dans Inbox/

Utiliser le skill `scc-save` pour créer automatiquement la note de handoff de fin de session.

Format du fichier : `[YYYY-MM-DD] [NomAgent].md`

```markdown
# [YYYY-MM-DD] [NomAgent]

## Ce qui a été fait
- [fichier/action 1]
- [fichier/action 2]

## État actuel
[Description en 2-3 phrases]

## Décisions prises
- [Décision 1]

## Blocages / en attente
- [Ce qui attend Paw ou une ressource externe]

## Prochaine étape
[Action concrète la plus logique pour le prochain agent]
```

---

## 4) Ce que le prochain agent doit faire en arrivant

Séquence de démarrage obligatoire (ou utiliser `/scc-init`) :

1. Lire `AGENTS.md`
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`
3. Lire la note de handoff la plus récente dans `Inbox/`
4. Lire `AGENT-INSTRUCTIONS.md` du projet si applicable
5. Confirmer le scope de travail avec Paw avant d'agir

---

## 5) Principe fondamental

Le handoff doit permettre à n'importe quel agent (même un nouveau, même un agent d'une autre plateforme) de reprendre le travail sans avoir à interroger Paw sur ce qui s'est passé.

Si Paw doit réexpliquer quelque chose que l'agent précédent aurait dû documenter, c'est un échec de handoff.

---

## 6) Références

- `Resources/Systeme/Workflows/Workflow-Creation-Note.md` — Comment écrire dans Notes/
- `.claude/skills/scc-save/SKILL.md` — Skill de clôture de session
- `.claude/skills/scc-init/SKILL.md` — Skill de démarrage de session
