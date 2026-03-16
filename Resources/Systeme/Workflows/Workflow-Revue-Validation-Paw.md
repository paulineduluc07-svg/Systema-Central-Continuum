# Workflow — Revue et validation humaine (Paw)

## 1) But de ce workflow

Définir ce qui doit passer par Paw avant d'être appliqué, comment présenter une demande de validation, et comment l'agent se comporte en attendant la réponse.

---

## 2) Ce qui requiert obligatoirement la validation de Paw

Tout ce qui est classé **N3 ou N4** dans `Niveaux-Risque.md` :

**N3 — Demander avant d'agir :**
- Suppression d'un fichier ou dossier
- Refactor majeur d'une structure existante
- Push vers le remote
- Modification d'une règle SCC existante
- Ajout d'une nouvelle feature majeure dans un projet

**N4 — Instruction explicite de Paw uniquement :**
- Changement de la structure racine du SCC (Inbox, Projects, Areas, Resources, Archives)
- Modification des règles fondamentales (AGENTS.md, Multi-Agent-Collaboration.md)
- Pull Request
- Force push
- Tout ce qui affecte plusieurs projets simultanément

---

## 3) Ce qui ne requiert PAS la validation de Paw

Actions N0, N1, N2 — voir `Niveaux-Risque.md`.

---

## 4) Format de présentation d'une demande de validation

Quand un agent soumet quelque chose à Paw, il doit :

1. **Nommer l'action clairement** — ce qu'il veut faire exactement
2. **Justifier** — pourquoi c'est nécessaire ou bénéfique
3. **Montrer l'impact** — ce qui change si Paw approuve
4. **Donner les options** — si applicable (approuver / modifier / rejeter / différer)
5. **Ne pas créer d'urgence artificielle** — zéro pression, zéro manipulation

Format attendu :
```
Action proposée : [description précise]
Raison : [pourquoi c'est nécessaire]
Impact si approuvé : [ce qui change]
Alternatives : [si applicable]
```

---

## 5) Ce que Paw peut répondre

| Réponse | Ce que l'agent fait |
|---------|-------------------|
| ✅ Approuvé | Appliquer l'action, tracer si N3/N4 |
| ✏️ Modifier | Ajuster selon les instructions, re-soumettre si nécessaire |
| ❌ Rejeté | Ne pas appliquer, tracer la décision (type : `decision`) |
| ⏳ Différer | Mettre en attente, noter dans Notes/ du projet ou dans Inbox/ |

---

## 6) Ce que l'agent fait en attendant la réponse

- Ne fait pas l'action.
- Peut continuer sur d'autres tâches N0/N1/N2 dans le même scope.
- Documente l'état d'attente dans `Notes/` du projet si pertinent.
- Ne relance pas Paw — elle répondra à son rythme.

---

## 7) Évaluation multi-agents (principe fondamental)

Pour tout travail important, Paw peut demander une évaluation par plusieurs agents avant validation.

L'agent qui soumet doit :
- Accepter que son travail soit évalué sans défense
- Traiter la critique d'un autre agent comme une information utile, pas une attaque
- Zéro ego sur le résultat de l'évaluation

---

## 8) Références

- `AGENTS.md` — Règle 5 (demander à Paw avant suppression/refactor/feature majeure)
- `Resources/Systeme/Niveaux-Risque.md` — Échelle de risque liée aux autorisations
- `Resources/Systeme/Multi-Agent-Collaboration.md` — Principes de neutralité et évaluation
