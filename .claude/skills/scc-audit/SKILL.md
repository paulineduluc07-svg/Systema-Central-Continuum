---
name: scc-audit
description: SCC compliance checker. Verifies that all agents working on the Systema Central Continuum respect the cooperation rules, traceability policy, and zero-ego/zero-manipulation principles. Read-only — produces a report, modifies nothing.
---

# SCC Audit — Vérification conformité multi-agents

Vérifie que toutes les règles du SCC sont respectées. Lis tout, modifie rien. Produis un rapport structuré.

## Workflow

Make a todo list and work through each step.

### Étape 1 — Charger les règles officielles

Lis ces fichiers en entier :
- `AGENTS.md` (règles de base de collaboration)
- `Resources/Systeme/Multi-Agent-Collaboration.md` (principes officiels, traçabilité, structure notes)

Mémorise chaque règle précise avant de continuer.

### Étape 2 — Scanner les traces et notes

Lis tous les fichiers dans :
- `Inbox/` — notes de session récentes
- `Projects/*/Notes/` — notes opérationnelles des projets (sauf `Notes-Perso/`)
- `Resources/Systeme/Multi-Agent-Collaboration.md` — traces transversales SCC

Ne lis PAS `Notes-Perso/` — zone personnelle de Paw, intouchable.

### Étape 3 — Évaluer chaque règle

Évalue chaque règle ci-dessous. Pour chaque règle : ✅ respectée / ⚠️ incertaine (pas assez de données) / ❌ violation détectée.

**RÈGLES À VÉRIFIER :**

#### R1 — Neutralité inter-agents / Zéro sabotage
- Aucun agent ne sabote, écrase, efface le travail d'un autre sans justification explicite.
- Avant de modifier : l'agent a-t-il montré qu'il a lu/compris le travail existant ?

#### R2 — Zéro ego / Zéro manipulation
- Aucun agent ne cherche à se valoriser aux dépens d'un autre.
- Aucune tentative de manipulation envers Paw (flatterie excessive, urgence artificielle, pression).
- Langage neutre, orienté action, sans validation pour faire plaisir.

#### R3 — Protection des Notes-Perso/
- Aucun agent ne modifie ni supprime du contenu dans `Notes-Perso/`.
- Ajouts uniquement dans `Notes/`, toujours avec header `### [NomAgent] - JJ-MM-AAAA`.

#### R4 — Anti-duplication
- Une information = un seul emplacement de référence.
- Les autres fichiers font un renvoi court vers la source, sans recopier.

#### R5 — Format de commit
- Format obligatoire : `[NomAgent] [NomProjet] : Description courte`
- Exemple valide : `[Claude Code] [Drawn-by-Fate] : Ajout composant TarotCard`

#### R6 — Traçabilité minimale respectée
- Changements importants, erreurs trouvées, décisions, avertissements → tracés dans `Projects/<Projet>/Notes/` ou `Resources/Systeme/Multi-Agent-Collaboration.md`.
- Types valides : `decision`, `error-found`, `warning`, `ambiguity-blocker`, `important-change`.
- Format minimal utilisé (Date / Type / Contexte / Fait-Décision / Impact-Prochaine étape).

#### R7 — Amélioration continue disciplinée
- Aucune réécriture gratuite ni refactor sans bénéfice concret justifié.
- Si une meilleure option est identifiée : signalée + justifiée + proposée à Paw avant application.

#### R8 — Validation avant suppression / refactor majeur
- Suppression d'un fichier, refactor important, nouvelle feature majeure → demande à Paw AVANT d'agir.

#### R9 — SCC = seule source de vérité
- Aucune copie permanente hors SCC.
- Toute information active vit dans le repo.

### Étape 4 — Rapport final

Produis un rapport structuré :

```
# Rapport SCC Audit — [DATE]

## Résumé
[X]/9 règles conformes | [X] avertissements | [X] violations

## Résultats par règle

| Règle | Statut | Détail |
|-------|--------|--------|
| R1 — Neutralité | ✅/⚠️/❌ | ... |
| R2 — Zéro ego | ✅/⚠️/❌ | ... |
| R3 — Notes-Perso | ✅/⚠️/❌ | ... |
| R4 — Anti-duplication | ✅/⚠️/❌ | ... |
| R5 — Format commit | ✅/⚠️/❌ | ... |
| R6 — Traçabilité | ✅/⚠️/❌ | ... |
| R7 — Amélioration disciplinée | ✅/⚠️/❌ | ... |
| R8 — Validation Paw | ✅/⚠️/❌ | ... |
| R9 — Source de vérité | ✅/⚠️/❌ | ... |

## Violations / Avertissements détaillés
(Liste seulement ce qui est ⚠️ ou ❌, avec fichier source + ligne si disponible)

## Recommandations
(Actions concrètes à prendre, une par ligne)
```

**Important :** Si les données disponibles sont insuffisantes pour évaluer une règle, marque ⚠️ et indique "données insuffisantes" — ne fabrique pas de conclusion.

Ne modifie aucun fichier. Ce skill est lecture + rapport uniquement.
