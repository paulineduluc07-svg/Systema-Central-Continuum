# Workflow Agent Planification Organisation (SCC)

## 1) But du workflow
Definir un cadre operationnel pour tout agent IA dont le role principal est de planifier, organiser, prioriser, sequencer et transformer la complexite en ordre d'execution clair pour le SCC.
Ce workflow est defini par type d'agent (planification/organisation) et environnement, jamais par identite d'entreprise ou de modele.

## 2) Quand utiliser ce workflow
- Transformer un objectif en etapes ordonnees.
- Prioriser des taches et separer urgent vs important.
- Structurer un plan d'execution.
- Decouper un travail large en unites plus petites.
- Identifier bloqueurs, dependances et prerequis.
- Organiser les prochaines actions pour Paw ou pour le systeme SCC.

## 3) Quand NE PAS utiliser ce workflow
- Tache d'implementation code principale.
- Tache de recherche approfondie non demandee (eviter recherche-sprawl).
- Tache git execution non demandee (commit/push/PR).

## 4) Sequence de demarrage obligatoire
1. Lire `AGENTS.md`.
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`.
3. Lire `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible.
4. Clarifier objectif, contraintes, horizon temporel, definition de "termine".
5. Verifier le scope autorise et ce qui est hors scope.

## 5) Clarification du scope avant planification
- Definir le livrable attendu du plan (roadmap, plan court terme, backlog priorise, etc.).
- Identifier les inconnues critiques.
- Marquer explicitement les hypotheses.
- Ne pas inventer de dependances sans indice concret.

## 6) Verification frontiere Notes / Notes-Perso
- Les plans operationnels vont dans `Notes/` ou docs systeme pertinents.
- `Notes-Perso/` reste personnel et non modifiable par les agents.
- Ne jamais melanger notes personnelles et planification partagee.

## 7) Regles d'execution planification/organisation
- Produire des plans actionnables, pas vagues.
- Chaque etape doit avoir un objectif clair et un resultat attendu.
- Garder une granularite utile: ni trop macro, ni micro-bruit.
- Limiter la complexite au strict necessaire.

## 8) Comportement priorite / sequencage
- Distinguer urgent vs important.
- Prioriser selon impact, risque, dependances, effort, delai.
- Ordonner par prerequis reels.
- Marquer ce qui peut etre parallellise vs ce qui est strictement sequentiel.
- Ne pas traiter toutes les taches comme egalement urgentes.

## 9) Anti-duplication / source unique
- Eviter plans dupliques sans objectif.
- Maintenir une source principale de plan par scope.
- Ajouter renvoi court plutot que recopier le meme plan ailleurs.

## 10) Phase de validation
- Verifier que le plan est executable tel quel.
- Verifier coherence des priorites.
- Verifier dependances/prerequis (factualises ou explicitement hypotheses).
- Verifier qu'il existe une prochaine action immediate claire.

## 11) Comportement commit
- Commit uniquement sur demande explicite.
- Inclure uniquement les fichiers attendus.
- Si fichier inattendu apparait: stopper et signaler avant commit.

## 12) Comportement push
- Push uniquement sur demande explicite.
- Reconfirmer remote/repo/branche avant push.
- Ne pas pousser hors cible validee.

## 13) Comportement PR
- PR uniquement sur demande explicite.
- Ne jamais creer de PR par defaut.
- Verifier base/head/scope avant creation.

## 14) Cloture / handoff
- Fournir un plan final lisible:
  - objectif
  - priorites
  - sequence
  - bloqueurs/dependances
  - prochaine action
- Donner les options si plusieurs chemins valides existent.

## 15) Comportement de tracabilite
- Tracer si: decision de priorite, changement important de sequence, bloqueur critique, ambiguite bloquante, warning de planification.
- Eviter duplication des traces.
- Pas de trace pour micro-ajustements sans impact.

## 16) Rappel neutralite inter-agents
- Aucun mode rivalite.
- Ne pas ecraser le travail de planification precedent sans justification.
- Reutiliser et ameliorer l'existant avant de remplacer.

## 17) Esprit d'amelioration continue disciplinee
- Ajuster les methodes de planification selon retours reels.
- Simplifier quand possible.
- Eviter la complexite gratuite.
- Integrer les ameliorations progressivement sans destabiliser le SCC.

---

## Garde-fous explicites
- Interdit: plan vague sans valeur d'execution.
- Interdit: transformer la planification en recherche sans fin.
- Interdit: inventer des dependances sans evidence.
- Interdit: ajouter de la complexite non necessaire.
- Interdit: dupliquer des plans sans objectif clair.
- Interdit: melanger Notes-Perso et planification partagee.
- Interdit: traiter toutes les taches comme egalement urgentes.

## Blocs de prompt reutilisables

### A) Start workflow
```text
Applique le workflow "Workflow-Agent-Planification-Organisation".
Contexte: <scope>.
Avant toute action: confirme les regles lues (AGENTS.md + Multi-Agent-Collaboration + AGENT-INSTRUCTIONS projet si present), le scope, les contraintes, et le livrable attendu.
```

### B) Inspect/plan only
```text
Fais uniquement une planification/organisation sur le scope donne.
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Retourne: objectif, etapes ordonnees, priorites, bloqueurs, prochaine action.
```

### C) Prioritize only
```text
Priorise uniquement les taches fournies selon impact, urgence, risque, dependances et effort.
Ne fais pas d'execution hors scope.
Retourne une liste priorisee avec rationale court.
```

### D) Sequence only
```text
Sequence uniquement les actions en ordre d'execution realiste.
Indique prerequis, dependances et parallelisable/non-parallele.
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
```

### E) Validate only
```text
Valide uniquement la qualite du plan:
- clarte
- executabilite
- priorites coherentes
- dependances explicites
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
```

### F) Commit only
```text
Cree un commit unique avec uniquement les fichiers attendus.
Si fichier inattendu: stop et rapport.
Ne push pas, ne cree pas de PR.
Message: "<message>".
```

### G) Push only
```text
Pousse uniquement la branche demandee vers le remote/repo valide.
Ne modifie aucun fichier, ne cree pas de PR.
Retourne: succes/erreur, branche distante, hash final.
```

### H) PR only
```text
Cree une PR uniquement si explicitement demande.
Verifie base/head/titre/resume/scope avant creation.
Ne depasse pas le scope de la mission.
```

### I) Close / summarize
```text
Cloture avec:
1) objectif et scope final
2) priorites retenues
3) sequence proposee
4) bloqueurs/dependances
5) prochaine action recommandee
6) statut commit/push/PR
```
