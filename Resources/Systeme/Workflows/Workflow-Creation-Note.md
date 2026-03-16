# Workflow — Création et mise à jour de note

## 1) But de ce workflow

Définir quand et comment un agent crée ou met à jour une note dans `Notes/`.

---

## 2) Créer vs mettre à jour

| Situation | Action |
|-----------|--------|
| Le sujet de la note existe déjà dans un fichier | Mettre à jour — ajouter en bas |
| Le sujet est clairement différent de tous les fichiers existants | Créer un nouveau fichier |
| La note existante deviendrait confuse ou trop longue en ajoutant | Créer un nouveau fichier, ajouter un renvoi dans l'ancienne |

**Règle par défaut :** toujours vérifier les fichiers existants avant de créer.

---

## 3) Format d'une note dans Notes/

Chaque ajout d'un agent dans `Notes/` doit être signé :

```markdown
### [NomAgent] - JJ-MM-AAAA

[Contenu de la note]
```

Exemples valides :
- `### Claude Code - 16-03-2026`
- `### Grok - 16-03-2026`

---

## 4) Structure minimale d'une note utile

Une note dans `Notes/` doit être utile à un autre agent qui arrive sans contexte.
Contenu minimal conseillé (non rigide — adapter selon le besoin) :

- **Contexte** — pourquoi cette note existe
- **État actuel** — où en est le projet / la décision
- **Décisions importantes** — ce qui a été choisi et pourquoi
- **Blocages / ambiguïtés** — ce qui est en suspens
- **Prochaines étapes** — action concrète suivante

---

## 5) Anti-duplication notes / traces

- Si l'information existe déjà dans une trace (`Projects/<Projet>/Notes/`) : ajouter un renvoi court, ne pas recopier.
- Si l'information est déjà dans `Multi-Agent-Collaboration.md` (trace transversale) : renvoi seulement.
- Une information = un seul emplacement de référence.

---

## 6) Ce qu'un agent ne fait pas dans Notes/

- Ne modifie pas une note rédigée par un autre agent.
- Ne supprime pas de contenu existant.
- N'écrase pas une section signée par un autre agent.

---

## 7) Niveau de risque

- Ajouter dans Notes/ → **N1** (permis librement, commit local OK)
- Modifier une note existante d'un autre agent → **N3** (demander à Paw avant)
- Supprimer un fichier dans Notes/ → **N3** (demander à Paw avant)

---

## 8) Références

- `AGENTS.md` — Règle 3 (protection des notes)
- `Resources/Systeme/Multi-Agent-Collaboration.md` — Structure officielle des notes projet
- `Resources/Systeme/Niveaux-Risque.md` — Niveaux de risque SCC
- `Resources/Systeme/Workflows/Workflow-Notes-Perso.md` — Règle Notes-Perso/
