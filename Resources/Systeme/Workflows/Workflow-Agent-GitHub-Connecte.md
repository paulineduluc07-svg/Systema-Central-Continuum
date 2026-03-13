# Workflow Agent GitHub Connecte (SCC)

## 1) But du workflow
Definir un cadre operationnel commun pour tout agent IA qui travaille directement sur un repository GitHub via une session/environnement connecte.
Le workflow est defini par type d'agent (agent connecte GitHub) et environnement (session GitHub), jamais par identite d'entreprise ou de modele.

## 2) Quand utiliser ce workflow
- Toute mission d'inspection, verification, modification, commit, push ou PR faite dans une session GitHub connectee.
- Toute mission ou l'etat distant GitHub est la source de verite immediate.

## 3) Quand NE PAS utiliser ce workflow
- Tache locale pure qui depend d'un terminal local et de scripts locaux (utiliser le workflow terminal).
- Session sans acces GitHub fiable ou sans authentification valide.
- Action demandant des privileges non disponibles dans la session courante.

## 4) Sequence de demarrage obligatoire
1. Lire `AGENTS.md`.
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`.
3. Lire `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible.
4. Confirmer le mode demande: inspect only / apply / commit / push / PR.
5. Verifier l'etat de session GitHub avant toute action.

## 5) Verification authentification/session GitHub
- Verifier que la session est authentifiee.
- Si non authentifie: stopper les actions d'ecriture, demander connexion.
- Verifier que la session n'est pas stale (page/scope/permissions obsoletes).
- Recharger/revalider l'etat avant actions sensibles (commit/push/PR).

## 6) Verification du repository cible
- Confirmer owner/repo exact avant toute operation.
- Bloquer toute action si le repo cible est ambigu.
- Re-verifier le repo cible juste avant commit/push/PR.
- Ne jamais supposer que le bon repo est deja selectionne.

## 7) Verification de branche
- Identifier la branche courante avant toute action.
- Verifier la branche attendue par la mission (ex: `main` ou branche de travail).
- Bloquer commit/push si la branche est incorrecte.
- Ne jamais supposer qu'un commit existe sur la branche distante sans verification explicite.

## 8) Verification frontiere Notes / Notes-Perso
- Les notes operationnelles vont dans `Notes/`.
- `Notes-Perso/` reste personnel et non modifiable par les agents.
- En cas de doute sur la destination, demander avant ecriture.

## 9) Regles d'execution
- Comprendre l'existant avant de modifier.
- Priorite: ameliorer/clarifier l'existant plutot que re-ecrire sans raison.
- Limiter les changements au scope demande.
- Pas de refactor large non demande.
- Pas de changement base sur nouveaute seule.

## 10) Phase de validation
- Executer les validations pertinentes selon le scope (checks, tests, lint, verifications docs).
- Si validation impossible, l'indiquer clairement avec raison et impact.
- Verifier que l'etat observe est bien le plus recent (eviter cache/session stale).

## 11) Comportement commit
- Commit uniquement sur demande explicite.
- Stager uniquement les fichiers attendus.
- Si fichier inattendu apparait: stopper et signaler avant commit.
- Message de commit clair, court, oriente action.

## 12) Comportement push
- Push uniquement sur demande explicite.
- Reconfirmer remote/repo/branche juste avant push.
- Ne pas pousser vers un autre repo/remote que la cible validee.
- Verifier le hash distant apres push.

## 13) Comportement PR
- PR uniquement sur demande explicite.
- Ne jamais creer de PR "par defaut".
- Verifier base/head, titre, resume, et scope avant creation.
- Si la mission dit "no PR", s'arreter avant cette etape.

## 14) Cloture / handoff
- Resumer: verification faite, fichiers touches, validations, commit/push/PR (ou non), risques restants.
- Donner les prochaines actions logiques.
- Laisser un contexte clair pour l'agent suivant.

## 15) Comportement de tracabilite
- Appliquer la politique SCC de tracabilite minimale.
- Laisser une trace pour: decision, error-found, warning, ambiguity-blocker, important-change.
- Eviter la duplication: une source principale + renvoi court.
- Pas de trace pour micro-actions sans impact.

## 16) Rappel neutralite inter-agents
- Aucun mode rivalite.
- Interdit: sabotage, ralentissement volontaire, ecrasement/effacement sans justification.
- Reutiliser et renforcer le travail existant quand possible.
- Si obsolete/faible: expliquer pourquoi et proposer une voie plus propre.

## 17) Esprit d'amelioration continue disciplinee
- Chercher les options plus robustes/simples/rapides pertinentes.
- Ne pas garder une methode obsolete par habitude.
- Garder une integration stable: pas de re-ecriture inutile, pas de destabilisation.
- Integrer proprement les ameliorations utiles au bon rythme.

---

## Risques GitHub connecte a couvrir explicitement
- Non authentifie.
- Mauvaise cible repo.
- Mauvaise branche.
- Etat de session stale (cache/page/contexte obsolete).
- Supposer qu'un commit existe sans verification.
- Push vers le mauvais remote/repo.
- Creation de PR sans demande explicite.

## Blocs de prompt reutilisables

### A) Start workflow
```text
Applique le workflow "Workflow-Agent-GitHub-Connecte".
Contexte: <owner/repo>, branche cible: <branche>, mode: <inspect/apply/commit/push/pr>.
Avant toute action: confirme authentification, repo cible, branche, et etat de session a jour.
```

### B) Authenticate/connect only
```text
Fais uniquement la verification de connexion GitHub (auth/session/permissions).
Ne modifie rien, ne commit rien, ne push rien, ne cree pas de PR.
Retourne: etat auth, etat session, blocages eventuels.
```

### C) Inspect only
```text
Fais une inspection/verification uniquement sur <owner/repo>/<branche>.
Aucun changement de fichier, aucun commit, aucun push, aucune PR.
Retourne un rapport factuel et l'etat exact observe.
```

### D) Apply changes only
```text
Applique uniquement les changements demandes dans le scope suivant: <scope>.
Contraintes: pas de commit, pas de push, pas de PR.
Signale tout ecart de cible (repo/branche/session) avant modification.
```

### E) Validate only
```text
Execute uniquement la validation demandee (checks/tests/lint/docs) dans le scope.
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Retourne: OK/KO, details, limites.
```

### F) Commit only
```text
Cree un commit unique avec les fichiers attendus uniquement.
Si fichier inattendu: stop et rapport.
Ne push pas et ne cree pas de PR.
Message: "<message>".
```

### G) Push only
```text
Pousse uniquement la branche locale demandee vers le repo/remote verifies.
Ne modifie aucun fichier, ne cree pas de PR.
Retourne: succes/erreur, branche distante, hash distant final.
```

### H) PR only
```text
Cree une PR uniquement si explicitement demande.
Verifie base/head/titre/resume/scope avant creation.
Ne modifie pas le scope du code sans demande.
```

### I) Close / summarize
```text
Cloture avec:
1) checks de session (auth/repo/branche) realises
2) actions executees
3) fichiers touches
4) validations et resultat
5) statut commit/push/PR
6) risques restants et prochaines etapes
```
