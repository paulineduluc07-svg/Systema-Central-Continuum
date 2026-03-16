# Niveaux de risque SCC

**Statut :** actif
**But :** Classifier les actions des agents par dangerosité pour accélérer sans perdre le contrôle.
**Portée :** toute action d'un agent dans le SCC.

---

## Échelle de risque

### N0 — Lecture / Exploration
**Toujours permis. Aucune restriction.**

- Lire n'importe quel fichier (sauf Notes-Perso/)
- Explorer la structure du repo
- Analyser, résumer, comparer

Git : aucune action git requise.

---

### N1 — Ajout de contenu
**Permis librement. Commit local OK.**

- Ajouter une note dans `Notes/` (avec signature)
- Créer un nouveau fichier non sensible
- Ajouter une entrée dans `Inbox/`
- Ajouter un prompt dans `Prompts/`
- Compléter un fichier stub vide

Git : commit local autorisé sans confirmation de Paw.

---

### N2 — Modification de contenu existant
**Permis avec trace obligatoire. Commit OK. Push = confirmation de Paw recommandée.**

- Modifier un fichier de documentation existant
- Mettre à jour un workflow ou une règle sans en changer le sens
- Corriger une erreur dans un fichier (typo, lien cassé, syntaxe)
- Mettre à jour `MEMORY.md` ou `CLAUDE.md`

Git : commit OK. Avant push, confirmer avec Paw sauf si elle l'a demandé explicitement.

Trace : obligatoire si le changement est significatif (type `important-change` ou `error-found`).

---

### N3 — Action à risque élevé
**Demander à Paw AVANT d'agir. Commit seulement après accord.**

- Supprimer un fichier ou un dossier
- Refactor majeur d'une structure existante
- Modifier une règle SCC en en changeant le sens
- Ajouter une nouvelle feature majeure dans un projet
- Push vers le remote

Git : ni commit ni push avant l'accord de Paw.

---

### N4 — Action critique
**Instruction explicite de Paw uniquement. Jamais proactif.**

- Modifier la structure racine du SCC (Inbox, Projects, Areas, Resources, Archives)
- Modifier les fichiers fondamentaux (AGENTS.md, Multi-Agent-Collaboration.md) de façon structurante
- Créer ou fusionner une Pull Request
- Force push
- Action qui affecte simultanément plusieurs projets

Git : attendre l'instruction explicite, ne jamais initier.

---

## Tableau de référence rapide

| Action | Niveau | Git |
|--------|--------|-----|
| Lire un fichier | N0 | — |
| Ajouter dans Notes/ | N1 | commit local OK |
| Créer un nouveau fichier | N1 | commit local OK |
| Modifier un fichier existant | N2 | commit OK, push avec confirmation |
| Corriger une erreur | N2 | commit OK |
| Supprimer un fichier | N3 | accord Paw avant tout |
| Modifier une règle SCC | N3-N4 | accord Paw avant tout |
| Push vers remote | N3 | accord Paw avant |
| Pull Request | N4 | instruction explicite seulement |
| Modifier structure racine | N4 | instruction explicite seulement |

---

## Références

- `AGENTS.md` — Règle 5 (demander avant suppression/refactor/feature)
- `Resources/Systeme/Workflows/Workflow-Revue-Validation-Paw.md` — Processus de validation
