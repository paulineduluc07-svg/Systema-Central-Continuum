# Stratégie d'évolution du SCC

**Statut :** actif
**But :** Définir comment le SCC grandit et s'améliore dans le temps sans se déstabiliser.

---

## 1) Principe directeur

Le SCC évolue par amélioration continue disciplinée — pas par réécriture impulsive.
Accélérer sans perdre le contrôle. Toujours dans cet ordre : **détecter → proposer → Paw valide → appliquer → tracer.**

---

## 2) Qui peut proposer des changements

- **Tout agent** peut détecter une amélioration possible et la proposer.
- **Paw** décide de ce qui s'applique et quand.
- Aucun agent n'applique un changement structurant sans validation de Paw.

---

## 3) Ce qui ne peut jamais changer sans validation explicite de Paw (N4)

- Structure racine IPARA (`Inbox/`, `Projects/`, `Areas/`, `Resources/`, `Archives/`)
- Règles fondamentales dans `AGENTS.md`
- Principes dans `Multi-Agent-Collaboration.md`
- Structure standard des projets (Code, Notes, Notes-Perso, Prompts, Assets, Todo, Roadmap)
- Valeurs fondamentales (zéro ego, zéro manipulation, évaluation multi-agents)

---

## 4) Ce qui peut être amélioré librement par les agents (N1-N2)

- Contenu des workflows (clarifications, exemples, ajouts)
- Nouvelles notes dans `Notes/` des projets
- Contenu de `MEMORY.md`
- Bibliothèque de prompts (`Resources/Prompts/`)
- Documentation non structurante

---

## 5) Processus d'évolution pour les changements N3

```
1. Détecter — l'agent identifie un problème ou une amélioration
2. Proposer — l'agent soumet à Paw avec justification (format Workflow-Revue-Validation-Paw.md)
3. Paw valide — approuve, modifie ou rejette
4. Appliquer — l'agent applique uniquement ce qui a été approuvé
5. Tracer — type `decision` ou `important-change` dans l'emplacement approprié
```

---

## 6) Phases d'évolution du SCC

| Phase | Description | Critère de passage |
|-------|-------------|-------------------|
| **Phase 1 — Construction** | Gouvernance de base, workflows, règles | SCC approuvé par Paw |
| **Phase 2 — Projets** | Alimenter les projets actifs (Todo, Roadmap, Notes) | Phase 1 validée |
| **Phase 3 — Opérationnel** | Travail actif sur les projets via le SCC | Phase 2 validée |
| **Phase 4 — Évolution** | Ajout de nouvelles capacités, nouveaux agents | Phase 3 stable |

**Statut actuel : Phase 1**

---

## 7) Cadence de révision recommandée

- **Hebdomadaire** : vider Inbox/, noter les apprentissages dans `MEMORY.md`
- **Mensuelle** : révision de `Multi-Agent-Collaboration.md` — quelque chose à ajouter ou clarifier ?
- **À chaque nouveau projet** : créer `Projects/<NomProjet>/AGENT-INSTRUCTIONS.md` avant de commencer

---

## 8) Références

- `Resources/Systeme/Niveaux-Risque.md` — Niveaux d'autorisation
- `Resources/Systeme/Workflows/Workflow-Revue-Validation-Paw.md` — Processus de validation
- `MEMORY.md` — Mémoire long terme des décisions SCC
