# Structure officielle du dossier Workflows/

**Statut :** actif
**But :** Définir comment le dossier Workflows/ est organisé et comment ajouter un nouveau workflow.

---

## 1) Rôle du dossier Workflows/

`Resources/Systeme/Workflows/` contient tous les protocoles d'exécution pour les agents.
Chaque workflow définit comment un type d'agent ou une opération spécifique doit se comporter dans le SCC.

---

## 2) Deux types de workflows

| Type | Nommage | Rôle |
|------|---------|------|
| **Workflow agent** | `Workflow-Agent-[TypeAgent].md` | Protocole complet pour un type d'agent (Terminal, IDE, GitHub, etc.) |
| **Workflow opération** | `Workflow-[NomOperation].md` | Protocole pour une opération spécifique (Traces, Notes-Perso, Handoff, etc.) |

---

## 3) Liste des workflows existants

### Workflows agents (9)
| Fichier | Rôle |
|---------|------|
| `Workflow-Agent-Automation-NoCode.md` | Agent automation / no-code (Airtable, Make.com) |
| `Workflow-Agent-Codage-Terminal.md` | Agent de codage via terminal / CLI |
| `Workflow-Agent-Documentation-SCC.md` | Agent de documentation SCC |
| `Workflow-Agent-GitHub-Connecte.md` | Agent avec session GitHub connectée |
| `Workflow-Agent-IDE.md` | Agent travaillant dans un IDE (Cursor, VSCode) |
| `Workflow-Agent-Memoire-Centralisation.md` | Agent de centralisation de la mémoire |
| `Workflow-Agent-Planification-Organisation.md` | Agent de planification et organisation |
| `Workflow-Agent-Recherche-Analyse.md` | Agent de recherche et analyse |
| `Workflow-Agent-Visuel-Design.md` | Agent de design visuel |

### Workflows opérations (4)
| Fichier | Rôle |
|---------|------|
| `Workflow-Creation-Note.md` | Créer ou mettre à jour une note dans Notes/ |
| `Workflow-Notes-Perso.md` | Règle absolue sur Notes-Perso/ |
| `Workflow-Revue-Validation-Paw.md` | Processus de validation humaine |
| `Workflow-Traces.md` | Système de traçabilité SCC |

---

## 4) Structure interne obligatoire d'un workflow

Tout nouveau workflow doit contenir au minimum :

```markdown
# Workflow — [Nom]

## 1) But de ce workflow
[1-2 phrases]

## 2) [Section principale — contenu spécifique au workflow]

## [Sections supplémentaires selon besoin]

## [Dernière section] Références
- [Fichiers référencés avec chemins]
```

Les workflows agents doivent également inclure :
- Séquence de démarrage (lire AGENTS.md → Multi-Agent-Collaboration.md → AGENT-INSTRUCTIONS projet)
- Comportement git (commit/push uniquement sur demande explicite)
- Règle Notes/ vs Notes-Perso/
- Règle traçabilité

---

## 5) Comment ajouter un nouveau workflow

1. Identifier le type : workflow agent ou workflow opération
2. Nommer selon la convention : `Workflow-Agent-[Type].md` ou `Workflow-[Operation].md`
3. Utiliser la structure interne obligatoire
4. Ajouter une ligne dans la liste ci-dessus (section 3)
5. Commit N1 (ajout de contenu)

---

## 6) Références

- `Resources/Systeme/Conventions-Nommage.md` — Conventions de nommage globales
- `AGENTS.md` — Règles de base lues par tous les agents
