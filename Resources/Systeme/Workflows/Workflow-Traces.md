# Workflow — Traçabilité SCC

## 1) But de ce workflow

Formaliser quand tracer, quoi tracer, où et dans quel format.

---

## 2) Quand tracer

Tracer uniquement si l'action entre dans un de ces 5 types :

| Type | Quand l'utiliser |
|------|-----------------|
| `decision` | Un choix structurant a été fait (technologie, architecture, règle, approche) |
| `error-found` | Une erreur réelle a été trouvée dans le code, la structure ou la documentation |
| `warning` | Quelque chose qui n'est pas une erreur maintenant mais pourrait en devenir une — à surveiller |
| `ambiguity-blocker` | Une ambiguïté bloque la progression — l'agent ne peut pas continuer sans clarification |
| `important-change` | Une modification significative a été apportée à un fichier ou une structure clé |

**Ne pas tracer :** lecture, exploration, micro-ajustement sans impact, action évidente et réversible.

---

## 3) Où tracer

| Contexte | Emplacement |
|----------|------------|
| Trace liée à un projet spécifique | `Projects/<NomProjet>/Notes/` |
| Trace transversale (concerne tout le SCC) | `Resources/Systeme/Multi-Agent-Collaboration.md` |

Règle anti-duplication : une trace = un seul emplacement. Si pertinente dans les deux, mettre la trace complète dans un seul et un renvoi court dans l'autre.

---

## 4) Format officiel

```markdown
---
- Date : YYYY-MM-DD
- Type : [decision | error-found | warning | ambiguity-blocker | important-change]
- Contexte : [en 1-2 phrases — pourquoi cette trace existe]
- Fait / Décision : [ce qui s'est passé ou ce qui a été décidé]
- Impact / Prochaine étape : [conséquence concrète ou action à faire]
---
```

---

## 5) Exemples

**decision :**
```
- Date : 2026-03-16
- Type : decision
- Contexte : Choix du format de nommage pour les fichiers de notes projet.
- Fait / Décision : Titres avec espaces adoptés (ex: "Drawn by Fate.md") pour les notes projet, kebab-case pour tout le reste.
- Impact / Prochaine étape : Mettre à jour Conventions-Nommage.md.
```

**error-found :**
```
- Date : 2026-03-16
- Type : error-found
- Contexte : Audit de cohérence AGENTS.md vs Multi-Agent-Collaboration.md.
- Fait / Décision : AGENTS.md disait "ajout autorisé dans Notes-Perso/" alors que Multi-Agent-Collaboration.md dit "intouchable". Contradiction corrigée dans AGENTS.md.
- Impact / Prochaine étape : Vérifier si d'autres fichiers répètent cette erreur.
```

**warning :**
```
- Date : 2026-03-16
- Type : warning
- Contexte : Inbox/2026-03-09.md était vide (0 octets).
- Fait / Décision : Fichier supprimé. scc-init lit le fichier le plus récent dans Inbox/ — un fichier vide cassait le résultat.
- Impact / Prochaine étape : Veiller à ne pas créer de fichiers Inbox vides à l'avenir.
```

---

## 6) Niveau de risque de la traçabilité elle-même

- Ajouter une trace → **N1** (permis librement)
- Modifier une trace existante → **N2** (trace obligatoire sur la modification)
- Supprimer une trace → **N3** (demander à Paw)

---

## 7) Références

- `Resources/Systeme/Multi-Agent-Collaboration.md` — Politique officielle de traçabilité
- `Resources/Systeme/Niveaux-Risque.md` — Niveaux de risque SCC
- `Resources/Systeme/Workflows/Workflow-Creation-Note.md` — Créer une note dans Notes/
