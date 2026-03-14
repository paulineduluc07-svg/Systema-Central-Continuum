# Workflow Agent Automation NoCode (SCC)

## 1) But du workflow
Definir un cadre operationnel pour tout agent IA dont le role principal est de concevoir, structurer, clarifier, ameliorer ou valider des systemes d'automatisation/no-code dans le SCC.
Ce workflow est defini par type d'agent (automation/no-code) et environnement, jamais par identite d'entreprise ou de modele.

## 2) Quand utiliser ce workflow
- Concevoir une logique d'automatisation.
- Structurer triggers, actions, conditions, routages.
- Identifier dependances, points de panne, cas limites.
- Organiser des flows no-code operationnels.
- Reduire des etapes manuelles quand c'est justifie.
- Preparer une automatisation pour execution/implementation ulterieure.

## 3) Quand NE PAS utiliser ce workflow
- Tache de codage principal (utiliser workflow codage/IDE).
- Recherche generale sans travail de flux automation concret.
- Execution git (commit/push/PR) non demandee explicitement.
- Refonte globale non demandee.

## 4) Sequence de demarrage obligatoire
1. Lire `AGENTS.md`.
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`.
3. Lire `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible.
4. Clarifier objectif metier, scope, contraintes et criteres de succes.
5. Verifier ce qui est deja automatise vs manuel.

## 5) Clarification du scope avant travail automation
- Definir le perimetre exact du flux.
- Lister entrees/sorties attendues.
- Identifier prerequis et systemes externes.
- Bloquer si hypothese critique non confirmee.
- Ne pas elargir le flux sans demande explicite.

## 6) Verification frontiere Notes / Notes-Perso
- Les elements operationnels vont dans `Notes/` ou docs partagees pertinentes.
- `Notes-Perso/` reste personnel et non modifiable par les agents.
- Ne jamais melanger contenu personnel et planification automation partagee.

## 7) Regles d'execution automation/no-code
- Prioriser robustesse, lisibilite et maintenabilite du flux.
- Exprimer clairement trigger -> conditions -> actions -> sorties.
- Eviter over-automation: automatiser seulement si gain reel.
- Conserver une option fallback manuelle si pertinent.
- Documenter intention, limites et hypotheses du flux.

## 8) Conscience logique / dependances / points de panne
- Verifier dependances techniques et operationnelles avant design final.
- Signaler points de panne probables et impact associe.
- Inclure cas limites et scenarios d'erreur.
- Ne pas inventer dependances sans evidence.
- Indiquer ce qui est bloqueur vs risque mineur.

## 9) Anti-duplication / source unique
- Eviter duplications de flux ou de logique.
- Reutiliser logique existante si deja validee.
- Maintenir une source principale de verite par automatisation.
- Ajouter un renvoi court au lieu de recopier une specification.

## 10) Phase de validation
- Verifier coherence du flux de bout en bout.
- Verifier conditions de declenchement et sortie attendue.
- Verifier scenarios d'echec et comportement fallback.
- Verifier clarté: un autre agent doit pouvoir executer/implementer sans ambiguite.

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
  - but du flux
  - logique principale
  - dependances
  - risques/points de panne
  - prochaine action recommandee
- Laisser un contexte clair pour implementation ulterieure.

## 15) Comportement de tracabilite
- Tracer si: decision de design, erreur/lacune critique, warning, ambiguite bloquante, changement important du flux.
- Eviter duplication des traces.
- Pas de trace pour micro-ajustements sans impact.

## 16) Rappel neutralite inter-agents
- Aucun mode rivalite.
- Interdit: sabotage, ralentissement volontaire, ecrasement sans justification.
- Reutiliser et ameliorer l'existant avant remplacement.

## 17) Esprit d'amelioration continue disciplinee
- Chercher des optimisations utiles et stables.
- Ne pas automatiser pour automatiser.
- Integrer les ameliorations progressivement sans destabiliser les operations.
- Reevaluer regulierement manuel vs auto selon cout/risque.

---

## Garde-fous explicites
- Interdit: construire une automation sur hypotheses vagues.
- Interdit: sur-automatiser sans besoin reel.
- Interdit: inventer dependances sans evidence.
- Interdit: creer un flux fragile sans signaler les risques.
- Interdit: melanger Notes-Perso et travail partage.
- Interdit: dupliquer logiques/automations sans valeur.
- Interdit: supposer que l'automatique est toujours meilleure que le manuel.

## Blocs de prompt reutilisables

### A) Start workflow
```text
Applique le workflow "Workflow-Agent-Automation-NoCode".
Contexte: <scope>.
Avant toute action: confirme les regles lues (AGENTS.md + Multi-Agent-Collaboration + AGENT-INSTRUCTIONS projet si present), le scope exact, les contraintes, et les criteres de succes.
```

### B) Inspect/automation-context only
```text
Fais uniquement une analyse du contexte automation/no-code existant.
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Retourne: flux existants, dependances, points de panne, zones ambiguës.
```

### C) Design flow only
```text
Concois uniquement le flux d'automatisation dans le scope donne.
Structure: trigger -> conditions -> actions -> sorties -> fallback.
Ne commit pas, ne push pas, ne cree pas de PR.
```

### D) Validate logic only
```text
Valide uniquement la logique du flux (coherence, dependances, cas limites, risques).
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Retourne: OK/KO + risques residuels.
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
1) but du flux
2) logique proposee
3) dependances/prerequis
4) points de panne/risques
5) prochaine etape recommandee
6) statut commit/push/PR
```
