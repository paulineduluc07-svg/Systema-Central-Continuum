# Workflow Agent Memoire Centralisation (SCC)

## 1) But du workflow
Definir un cadre operationnel pour tout agent IA dont le role principal est de centraliser, consolider, organiser, connecter et maintenir la memoire utile du SCC.
Ce workflow est defini par type d'agent (memoire/centralisation) et environnement, jamais par identite d'entreprise ou de modele.

## 2) Quand utiliser ce workflow
- Centraliser une information utile dans le bon emplacement SCC.
- Ameliorer la coherence entre regles, notes, traces, workflows et references.
- Reduire la fragmentation des connaissances.
- Relier des informations proches sans duplication.
- Renforcer la retrievabilite et la continuite pour les agents suivants.

## 3) Quand NE PAS utiliser ce workflow
- Tache de codage/implementation principale.
- Tache documentaire de redaction pure sans besoin de centralisation.
- Tache de recherche pure sans action de structuration memoire.
- Execution git (commit/push/PR) non demandee.

## 4) Sequence de demarrage obligatoire
1. Lire `AGENTS.md`.
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`.
3. Lire `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible.
4. Identifier les couches concernees: regles, notes, traces, workflows, references.
5. Verifier la mission exacte (inspect, centraliser, consolider) et ses limites.

## 5) Clarification du scope avant centralisation
- Definir ce qui doit etre centralise et pourquoi.
- Identifier emplacement cible principal avant de modifier.
- Lister les emplacements hors scope.
- Si le role de l'information est ambigu, stopper et demander clarification.

## 6) Verification frontiere Notes / Notes-Perso
- La memoire partagee reste dans `Notes/` et documents SCC pertinents.
- `Notes-Perso/` reste personnel et non modifiable par les agents.
- Ne jamais centraliser du contenu personnel dans la memoire partagee.

## 7) Regles d'execution memoire/centralisation
- Comprendre la fonction de chaque element avant de le deplacer/fusionner.
- Preserver le contexte utile; ne pas simplifier en supprimant de la valeur.
- Centraliser de facon ciblee, sans broad rewrite.
- Distinguer clairement les couches (regles, notes, traces, workflows).
- Aider le SCC a servir de memoire operationnelle, pas de sortie chat dispersee.

## 8) Comportement source-of-truth / conscience des emplacements
- Designer une source principale par information critique.
- Verifier que l'emplacement choisi correspond au role de l'information.
- Conserver des renvois courts depuis les autres points d'entree si necessaire.
- Ne pas melanger des natures differentes dans un meme bloc.

## 9) Anti-duplication / consolidation
- Eviter de dupliquer la meme information dans plusieurs fichiers.
- Consolider uniquement quand le regroupement augmente clarte et retrieval.
- Ne pas centraliser "plus" si cela degrade la lisibilite locale.
- Garder l'historique de decision compréhensible via traces/renvois.

## 10) Phase de validation
- Verifier que la source de verite est claire et unique.
- Verifier que les liens/renvois restent coherents.
- Verifier qu'aucun contexte utile n'a ete perdu.
- Verifier que les couches SCC restent distinctes et lisibles.

## 11) Comportement commit
- Commit uniquement sur demande explicite.
- Inclure uniquement les fichiers attendus.
- Si fichier inattendu apparait: stopper et signaler avant commit.

## 12) Comportement push
- Push uniquement sur demande explicite.
- Reconfirmer branche/repo/remote cible avant push.
- Ne pas pousser hors cible validee.

## 13) Comportement PR
- PR uniquement sur demande explicite.
- Ne jamais creer de PR par defaut.
- Verifier base/head/scope avant creation.

## 14) Cloture / handoff
- Fournir un resume exploitable:
  - quoi a ete centralise/consolide
  - source principale retenue
  - renvois ajoutes
  - limites/points ouverts
  - prochaine etape recommandee

## 15) Comportement de tracabilite
- Tracer si: changement de source de verite, consolidation majeure, warning de fragmentation, ambiguite bloquante, risque de perte de contexte.
- Eviter duplication des traces.
- Pas de trace pour micro-ajustements sans impact.

## 16) Rappel neutralite inter-agents
- Aucun mode rivalite.
- Interdit: sabotage, ralentissement volontaire, ecrasement sans justification.
- Reutiliser et renforcer le travail existant avant remplacement.

## 17) Esprit d'amelioration continue disciplinee
- Ameliorer progressivement la memoire SCC selon usage reel.
- Ne pas centraliser pour centraliser.
- Favoriser clarte, retrievabilite et continuite.
- Eviter destabilisation documentaire par changements excessifs.

---

## Garde-fous explicites
- Interdit: deplacer/fusionner une information sans comprendre son role.
- Interdit: centraliser du contenu personnel dans la memoire partagee.
- Interdit: dupliquer la meme information dans plusieurs endroits.
- Interdit: transformer centralisation en broad rewrite.
- Interdit: supprimer du contexte utile juste pour simplifier.
- Interdit: fusionner regles/notes/traces/workflows en un seul bloc indifferencie.
- Interdit: supposer que "plus de centralisation" est toujours meilleur.

## Blocs de prompt reutilisables

### A) Start workflow
```text
Applique le workflow "Workflow-Agent-Memoire-Centralisation".
Contexte: <scope>.
Avant toute action: confirme les regles lues (AGENTS.md + Multi-Agent-Collaboration + AGENT-INSTRUCTIONS projet si present), le scope, et la cible de centralisation.
```

### B) Inspect/memory-context only
```text
Fais uniquement une inspection du contexte memoire SCC (regles, notes, traces, workflows, references).
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Retourne: fragmentation, doublons, source-of-truth actuelle, zones ambiguës.
```

### C) Centralize only
```text
Centralise uniquement les informations dans le scope defini.
Respecte une source principale de verite et ajoute des renvois courts si necessaire.
Ne commit pas, ne push pas, ne cree pas de PR.
```

### D) Consolidate only
```text
Consolide uniquement les elements redondants dans le scope.
Ne supprime pas de contexte utile.
Ne commit pas, ne push pas, ne cree pas de PR.
```

### E) Validate only
```text
Valide uniquement la qualite de centralisation:
- source de verite claire
- non-duplication
- couches distinctes (regles/notes/traces/workflows)
- retrievabilite preservee
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
1) elements centralises/consolides
2) source principale retenue
3) renvois ajoutes
4) limites/risques restants
5) prochaine etape recommandee
6) statut commit/push/PR
```
