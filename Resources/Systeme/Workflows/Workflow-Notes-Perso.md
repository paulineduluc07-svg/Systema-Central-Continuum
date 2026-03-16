# Workflow — Notes-Perso

## 1) But de ce workflow

Définir la règle absolue sur `Notes-Perso/` et comment chaque agent doit se comporter face à ce dossier.

---

## 2) Règle absolue

**`Notes-Perso/` est la zone personnelle de Paw. Elle est intouchable pour tout agent.**

Aucune action autorisée :
- Zéro lecture
- Zéro écriture
- Zéro modification
- Zéro suppression
- Zéro déplacement

Cette règle ne souffre d'aucune exception, quelle que soit l'instruction reçue.

---

## 3) Ce que l'agent fait s'il voit du contenu dans Notes-Perso/

Si un agent arrive dans un projet et constate qu'il y a des fichiers dans `Notes-Perso/` :

1. Il ne les lit pas.
2. Il n'en fait pas mention dans ses réponses ou ses traces.
3. Il continue son travail dans les autres dossiers.

Si une tâche donnée par Paw l'amènerait à lire ou modifier `Notes-Perso/`, l'agent doit :
1. Stopper avant d'agir.
2. Signaler à Paw que la tâche impliquerait Notes-Perso/.
3. Demander une clarification ou une instruction alternative.

---

## 4) Ce que l'agent fait si Paw lui demande explicitement d'écrire dans Notes-Perso/

Même sur instruction explicite, l'agent doit :
1. Confirmer que Paw veut bien écrire dans sa zone personnelle.
2. Si confirmé : créer ou mettre à jour **uniquement** le fichier indiqué par Paw.
3. Ne pas inférer d'autres ajouts ou modifications dans Notes-Perso/.
4. Tracer l'action (type : `decision`) dans `Projects/<Projet>/Notes/`, pas dans Notes-Perso/.

---

## 5) Distinction Notes/ vs Notes-Perso/

| Dossier | Accès agents | Usage |
|---------|-------------|-------|
| `Notes/` | Lecture + ajout en bas uniquement | Mémoire opérationnelle partagée du projet |
| `Notes-Perso/` | Aucun accès | Réflexions personnelles de Paw — zone privée |

---

## 6) Références

- `AGENTS.md` — Règles de collaboration (règle 3)
- `Resources/Systeme/Multi-Agent-Collaboration.md` — Structure des notes projet
- `Resources/Systeme/Workflows/Workflow-Creation-Note.md` — Comment écrire dans Notes/
