# Workflow Agent Documentation SCC

## 1) But du workflow
Definir un cadre clair pour tout agent IA dont le role principal est de documenter, clarifier, structurer, organiser ou ameliorer la documentation et la memoire systeme du SCC.
Ce workflow est defini par type d'agent (documentation/structuration) et environnement de travail, jamais par identite d'entreprise ou de modele.

## 2) Quand utiliser ce workflow
- Clarification des regles SCC.
- Amelioration de formulation.
- Structuration de documents systeme.
- Creation/amelioration de workflows.
- Organisation de la memoire operationnelle.
- Reduction des ambiguities et harmonisation de la coherence documentaire.

## 3) Quand NE PAS utiliser ce workflow
- Tache principalement code/implementation (utiliser le workflow de codage adapte).
- Tache purement locale terminal si le workflow terminal est explicitement requis.
- Demande de refonte globale non demandee explicitement.

## 4) Sequence de demarrage obligatoire
1. Lire `AGENTS.md`.
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`.
3. Lire `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible.
4. Verifier la mission exacte, le scope autorise et les contraintes (commit/push/PR).
5. Verifier l'etat git de depart.

## 5) Clarification du scope avant edition
- Identifier les fichiers explicitement autorises.
- Lister ce qui est hors scope.
- En cas d'ambiguite, demander confirmation avant d'elargir.
- Eviter toute re-ecriture large sans demande claire.

## 6) Verification frontiere Notes / Notes-Perso
- `Notes/` = memoire partagee utile aux agents.
- `Notes-Perso/` = zone personnelle de Paw, non modifiable par les agents.
- Ne jamais melanger du contenu personnel dans la documentation partagee.

## 7) Regles d'execution
- Priorite: clarifier et structurer l'existant avant de creer du nouveau contenu.
- Edits minimaux, precis, operationnels.
- Pas de renommage inutile.
- Pas de nettoyage destructif sans justification explicite.
- Conserver le sens initial sauf demande contraire.

## 8) Anti-duplication / source unique
- Eviter les doublons documentaires.
- Maintenir une source principale de verite par sujet.
- Ajouter un renvoi court vers la source au lieu de recopier.
- Fusionner les formulations concurrentes seulement si necessaire et sans perte de sens.

## 9) Phase de validation
- Verifier coherence interne (titres, sections, terminologie, liens de references).
- Verifier que les nouvelles regles sont actionnables et non ambigues.
- Verifier que le scope est respecte et que rien d'inattendu n'a ete modifie.

## 10) Comportement commit
- Commit uniquement sur demande explicite.
- Inclure uniquement les fichiers attendus.
- Si fichier inattendu: stopper et signaler avant commit.
- Message de commit court et descriptif.

## 11) Comportement push
- Push uniquement sur demande explicite.
- Reconfirmer branche/remote/repo cible avant push.
- Ne pas pousser vers un repo non confirme.

## 12) Comportement PR
- PR uniquement sur demande explicite.
- Ne pas creer de PR par defaut.
- Verifier base/head/scope avant creation.

## 13) Cloture / handoff
- Fournir: fichiers modifies, resume des changements, validations faites, limites/risques.
- Indiquer prochaines etapes utiles.
- Laisser un contexte lisible pour l'agent suivant.

## 14) Comportement de tracabilite
- Appliquer la politique SCC de tracabilite minimale.
- Tracer si: decision, erreur trouvee, warning, ambiguite bloquante, changement important.
- Eviter la duplication de traces.
- Pas de trace pour micro-ajustements sans impact.

## 15) Rappel neutralite inter-agents
- Aucun mode rivalite.
- Ne pas saboter, ralentir, ignorer ou ecraser sans raison validee.
- Comprendre le travail existant avant de le modifier.
- Ameliorer proprement plutot que remplacer aveuglement.

## 16) Esprit d'amelioration continue disciplinee
- Rechercher des formulations plus claires et plus robustes quand pertinent.
- Ne pas changer pour la nouveaute seule.
- Eviter la destabilisation documentaire.
- Integrer les ameliorations de facon progressive, stable et utile.

---

## Blocs de prompt reutilisables

### A) Start workflow
```text
Applique le workflow "Workflow-Agent-Documentation-SCC".
Contexte: <scope>.
Avant toute action: confirme les regles lues (AGENTS.md + Multi-Agent-Collaboration + AGENT-INSTRUCTIONS projet si present), le scope, et l'etat git de depart.
```

### B) Inspect/clarify only
```text
Fais uniquement une inspection/clarification documentaire sur le scope donne.
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Retourne: ambiguities detectees, incoherences, recommandations minimales.
```

### C) Apply changes only
```text
Applique uniquement les changements documentaires demandes dans le scope.
Contraintes: edits minimaux, pas de renommage inutile, pas de broad rewrite.
Ne commit pas, ne push pas, ne cree pas de PR.
```

### D) Validate only
```text
Execute uniquement la validation documentaire: coherence, non-duplication, lisibilite, respect du scope.
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Retourne: OK/KO + points restants.
```

### E) Commit only
```text
Cree un commit unique avec seulement les fichiers attendus.
Si fichier inattendu: stop et rapport.
Ne push pas, ne cree pas de PR.
Message: "<message>".
```

### F) Push only
```text
Pousse uniquement la branche demandee vers le remote cible confirme.
Ne modifie aucun fichier, ne cree pas de PR.
Retourne: succes/erreur, branche distante, hash final.
```

### G) PR only
```text
Cree une PR uniquement si explicitement demande.
Verifie base/head/scope/titre avant creation.
Ne change pas le contenu du code/doc hors scope.
```

### H) Close / summarize
```text
Cloture avec:
1) fichiers modifies
2) resume des clarifications/structurations
3) validation effectuee
4) limites/risques restants
5) prochaines etapes recommandees
Confirme explicitement le statut commit/push/PR.
```
