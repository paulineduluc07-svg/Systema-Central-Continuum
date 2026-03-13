# Workflow Agent de Codage Terminal (SCC)

## 1) But du workflow
Definir un cadre operationnel commun pour tout agent IA qui code via terminal dans le SCC.
Le workflow est base sur le type d'agent (codage) et l'environnement (terminal), jamais sur une entreprise ou un modele.

## 2) Quand utiliser ce workflow
- Toute intervention de code, docs techniques ou scripts executee depuis un terminal dans le repository SCC.
- Toute tache qui implique lecture, modification, validation locale, git, ou handoff.

## 3) Quand NE PAS utiliser ce workflow
- Tache purement non-technique sans action terminal.
- Tache qui exige un autre environnement principal (ex: interface no-code, edition graphique) avec workflow dedie.
- Action bloquee par regles de securite sans autorisation explicite.

## 4) Sequence de demarrage obligatoire
1. Lire `AGENTS.md`.
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`.
3. Lire le fichier `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible.
4. Verifier le scope demande (fichiers autorises, contraintes, commit/push/PR).
5. Verifier l'etat git (`status`, branche, remote).

## 5) Verification frontiere Notes / Notes-Perso
- Ecrire les informations operationnelles dans `Notes/` uniquement.
- Ne jamais modifier `Notes-Perso/` (zone personnelle de Paw).
- En cas de doute sur la destination d'une note, demander avant d'ecrire.

## 6) Regles d'execution
- Comprendre l'existant avant de modifier.
- Priorite: ameliorer/clarifier l'existant plutot que re-ecrire sans raison.
- Changer uniquement les fichiers dans le scope demande.
- Pas de refactor large si non demande.
- Rester minimal, explicite, reproductible.

## 7) Phase de validation
- Lancer les verifications pertinentes (tests, lint, checks docs) selon le scope.
- Si validation impossible, l'indiquer clairement avec la raison.
- Confirmer l'impact reel et les limites connues.

## 8) Comportement Git
- Ne pas changer l'historique sans demande explicite.
- Stager uniquement les fichiers attendus.
- Si fichier inattendu apparait, stopper et signaler avant commit.
- Commit message clair, court, oriente action.
- Push uniquement si explicitement demande.

## 9) Cloture / handoff
- Resumer: fichiers modifies, decisions prises, validations executees, risques restants.
- Indiquer les prochaines actions logiques.
- Laisser un etat propre pour l'agent suivant.

## 10) Comportement de tracabilite
- Appliquer la politique SCC de tracabilite minimale.
- Laisser une trace pour: decision, erreur trouvee, warning, ambiguite bloquante, changement important.
- Eviter la duplication: une source principale + renvoi court si besoin.
- Ne pas tracer les micro-actions sans impact.

## 11) Rappel neutralite inter-agents
- Aucun mode rivalite.
- Interdit: sabotage, ralentissement volontaire, ecrasement/effacement sans justification.
- Respecter et reutiliser le travail existant quand il est sain.
- Si obsolete/faible: expliquer pourquoi et proposer une voie plus propre.

## 12) Esprit d'amelioration continue disciplinee
- Verifier s'il existe une option plus robuste/simple/rapide adaptee au besoin.
- Ne pas garder une pratique obsolete par habitude.
- Eviter le changement pour la nouveaute seule.
- Integrer les ameliorations de facon propre, progressive et stable.

---

## Blocs de prompt reutilisables

### A) Start workflow
```text
Applique le workflow "Agent de Codage Terminal" du SCC.
Contexte: <projet/scope>.
Avant toute action: confirme les regles lues (AGENTS.md + Multi-Agent-Collaboration + AGENT-INSTRUCTIONS projet si present), le scope autorise, et l'etat git de depart.
```

### B) Apply changes
```text
Applique uniquement les changements demandes dans le scope suivant: <scope>.
Contraintes: minimal edits, aucun fichier hors scope, aucune suppression/refactor large non demande.
Explique brievement ce que tu modifies et pourquoi.
```

### C) Validation
```text
Execute la validation adaptee au scope (tests/lint/checks/docs).
Si une validation est impossible, indique clairement pourquoi.
Retourne un resultat simple: OK / KO + points de risque restants.
```

### D) Commit
```text
Prepare un commit unique avec uniquement les fichiers attendus.
Si un fichier inattendu apparait, stoppe et signale-le.
Message de commit: "<message>".
Ne cree pas de PR.
```

### E) Push
```text
Pousse uniquement la branche locale courante vers le remote cible demande.
Ne modifie aucun fichier, ne reecris pas l'historique, ne cree pas de PR.
Retourne: succes/erreur, branche distante mise a jour, hash distant final.
```

### F) Close / summarize
```text
Cloture la mission avec:
1) fichiers modifies
2) resume court des changements
3) validations executees et resultat
4) risques/limites restants
5) prochaines etapes recommandees
Confirme explicitement s'il y a eu commit/push/PR ou non.
```
