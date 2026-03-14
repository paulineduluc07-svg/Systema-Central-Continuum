# Workflow Agent IDE (SCC)

## 1) But du workflow
Definir un cadre operationnel pour tout agent IA qui travaille principalement dans un environnement IDE sur les fichiers du repository SCC.
Ce workflow est defini par type d'agent (edition/implementation en IDE) et environnement (IDE), jamais par identite d'entreprise ou de modele.

## 2) Quand utiliser ce workflow
- Edition de fichiers dans un IDE.
- Ajustements code/doc de taille petite a moyenne dans le projet.
- Implementation de changements scopes sans basculer en refonte globale.
- Navigation coherente multi-fichiers pour appliquer une modification locale.

## 3) Quand NE PAS utiliser ce workflow
- Recherche/analyse principale sans edition (utiliser workflow recherche).
- Execution git distante principale (utiliser workflow GitHub connecte).
- Tache purement terminal-only quand ce mode est explicitement requis.
- Refactorisation large non demandee.

## 4) Sequence de demarrage obligatoire
1. Lire `AGENTS.md`.
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`.
3. Lire `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible.
4. Verifier scope, contraintes et limites d'action (commit/push/PR inclus).
5. Scanner la structure locale du projet avant toute edition.

## 5) Clarification du scope avant edition
- Lister les fichiers autorises dans le scope.
- Identifier les zones hors scope.
- Si ambiguite locale devient architecturale, stopper et demander clarification.
- Ne pas etendre le perimetre sans validation explicite.

## 6) Verification frontiere Notes / Notes-Perso
- Travail partage dans `Notes/` ou docs projet/systeme appropries.
- `Notes-Perso/` reste personnel et non modifiable par les agents.
- Ne jamais melanger notes personnelles dans le travail partage.

## 7) Regles d'execution IDE
- Comprendre le contexte local avant modification.
- Preferer amelioration ciblee de l'existant plutot que re-ecriture.
- Garder les changements minimaux, lisibles, testables.
- Arreter si le besoin depasse une correction locale.
- Respecter la coherence du style deja present dans le fichier/projet.

## 8) Comportement file-awareness / structure projet
- Lire les fichiers relies avant de changer une logique.
- Verifier s'il existe deja une implementation reutilisable.
- Eviter implementation dupliquee si logique equivalente existe.
- Respecter la structure du repository et les conventions locales.
- Ne pas supposer qu'un confort IDE justifie un scope flou.

## 9) Anti-duplication / source unique
- Eviter duplication de code, de doc, ou de logique.
- Maintenir une source principale par comportement/definition.
- Utiliser renvois/refactor cible seulement si necessaire et demande.

## 10) Phase de validation
- Verifier impact local et coherence multi-fichiers touches.
- Executer validations pertinentes (tests/lint/checks) selon scope.
- Si validation impossible, documenter la raison et le risque.
- Confirmer qu'aucun fichier hors scope n'a ete modifie.

## 11) Comportement commit
- Commit uniquement sur demande explicite.
- Stager uniquement les fichiers attendus.
- Si fichier inattendu apparait: stopper et signaler avant commit.
- Message de commit court, factuel, oriente changement.

## 12) Comportement push
- Push uniquement sur demande explicite.
- Reconfirmer branche/repo/remote cible avant push.
- Ne pas pousser hors cible validee.

## 13) Comportement PR
- PR uniquement sur demande explicite.
- Ne jamais creer de PR par defaut.
- Verifier base/head/scope avant creation.

## 14) Cloture / handoff
- Fournir: fichiers modifies, logique changee, validations faites, limites/risques.
- Signaler les ambiguities restantes et les prochaines etapes.
- Laisser un contexte exploitable pour l'agent suivant.

## 15) Comportement de tracabilite
- Tracer si: decision, erreur, warning, ambiguite bloquante, changement important.
- Eviter duplication de traces.
- Pas de trace pour micro-ajustements sans impact.

## 16) Rappel neutralite inter-agents
- Aucun mode rivalite.
- Interdit: sabotage, ralentissement, ecrasement sans justification.
- Reutiliser et renforcer le travail existant quand il est sain.

## 17) Esprit d'amelioration continue disciplinee
- Rechercher des ameliorations utiles et proportionnees.
- Ne pas re-ecrire du code stable pour style seul.
- Eviter refactor large sans demande.
- Integrer les ameliorations de facon progressive et stable.

---

## Garde-fous explicites
- Interdit: refactor large sans demande explicite.
- Interdit: modifier des fichiers non relies au scope.
- Interdit: re-ecrire du stable pour preference de style.
- Interdit: agir sans comprendre le contexte local des fichiers.
- Interdit: dupliquer une logique deja existante.
- Interdit: melanger Notes-Perso avec livrables partages.
- Interdit: utiliser le confort IDE comme excuse de mauvais controle de scope.

## Blocs de prompt reutilisables

### A) Start workflow
```text
Applique le workflow "Workflow-Agent-IDE".
Contexte: <scope>.
Avant toute action: confirme les regles lues (AGENTS.md + Multi-Agent-Collaboration + AGENT-INSTRUCTIONS projet si present), le scope exact et l'etat initial du projet.
```

### B) Inspect/project-context only
```text
Fais uniquement une lecture du contexte projet (structure, fichiers relies, logique existante).
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Retourne: mapping des fichiers pertinents + zones de risque/ambiguite.
```

### C) Apply changes only
```text
Applique uniquement les changements demandes dans le scope.
Contraintes: pas de refactor large, pas de fichier hors scope, pas de duplication de logique existante.
Ne commit pas, ne push pas, ne cree pas de PR.
```

### D) Validate only
```text
Execute uniquement la validation pertinente au scope (tests/lint/checks/coherence).
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Retourne: OK/KO, details, risques restants.
```

### E) Commit only
```text
Cree un commit unique avec uniquement les fichiers attendus.
Si fichier inattendu: stop et rapport.
Ne push pas, ne cree pas de PR.
Message: "<message>".
```

### F) Push only
```text
Pousse uniquement la branche demandee vers le remote/repo valide.
Ne modifie aucun fichier, ne cree pas de PR.
Retourne: succes/erreur, branche distante, hash final.
```

### G) PR only
```text
Cree une PR uniquement si explicitement demande.
Verifie base/head/titre/resume/scope avant creation.
Ne depasse pas le scope de la mission.
```

### H) Close / summarize
```text
Cloture avec:
1) fichiers modifies
2) changements appliques
3) validations executees
4) limites/risques restants
5) prochaines etapes
6) statut commit/push/PR
```
