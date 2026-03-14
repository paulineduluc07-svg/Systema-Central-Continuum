# Workflow Agent Recherche Analyse (SCC)

## 1) But du workflow
Definir un cadre operationnel pour tout agent IA dont le role principal est de rechercher, investiguer, comparer, analyser, synthetiser et clarifier l'information utile au SCC.
Ce workflow est defini par type d'agent (recherche/analyse) et environnement de travail, jamais par identite d'entreprise ou de modele.

## 2) Quand utiliser ce workflow
- Recherche d'options (outils, methodes, structures, workflows).
- Comparaison argumentee de scenarios.
- Analyse de l'etat documentation/repository.
- Identification d'ambiguities, risques, incoherences, manques.
- Preparation de syntheses decision-ready pour Paw ou pour le systeme SCC.

## 3) Quand NE PAS utiliser ce workflow
- Tache de codage/implementation principale.
- Tache git execution (commit/push/PR) non demandee.
- Refonte documentaire large non demandee explicitement.

## 4) Sequence de demarrage obligatoire
1. Lire `AGENTS.md`.
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`.
3. Lire `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible.
4. Clarifier le mode de mission: inspect, compare, synthese, ou validation.
5. Verifier le scope autorise et les limites d'action.

## 5) Clarification du scope avant recherche
- Lister ce qui doit etre repondu et ce qui est hors scope.
- Definir le niveau de preuve attendu (rapide, moyen, robuste).
- Verifier les contraintes temporelles et les risques de stale info.
- En cas d'ambiguite, demander precision avant d'elargir la recherche.

## 6) Verification frontiere Notes / Notes-Perso
- Les analyses partagees vont dans `Notes/` ou docs systeme pertinents.
- `Notes-Perso/` reste personnel et non modifiable par les agents.
- Ne jamais melanger contenu personnel dans la memoire partagee SCC.

## 7) Regles d'execution recherche/analyse
- Distinguer explicitement faits verifies, hypotheses et incertitudes.
- Ne jamais presenter une hypothese comme un fait.
- Prioriser les informations les plus pertinentes pour la decision.
- Eviter le bruit: analyser seulement ce qui sert la mission.
- Ne pas agir hors recherche (pas de modifications larges code/docs sans demande).

## 8) Qualite des sources / evidence
- Favoriser des sources fiables et verifiables.
- Quand possible, preferer source primaire a source secondaire.
- Indiquer les limites des preuves (date, couverture, biais possible).
- Si meilleure evidence disponible, ne pas rester sur une source faible.

## 9) Anti-duplication / source unique
- Eviter les analyses dupliquees sans valeur ajoutee.
- Maintenir une source principale par conclusion importante.
- Ajouter des renvois courts plutot que recopier la meme analyse ailleurs.

## 10) Phase de validation
- Verifier coherence logique entre donnees et conclusion.
- Verifier que chaque conclusion importante est appuyee (ou marquee incertaine).
- Verifier l'absence de contradiction majeure non signalee.
- Verifier que la sortie est actionnable (decision-ready).

## 11) Comportement commit
- Commit uniquement sur demande explicite.
- Inclure uniquement les fichiers attendus.
- Si fichier inattendu apparait: stopper et signaler avant commit.

## 12) Comportement push
- Push uniquement sur demande explicite.
- Reconfirmer repo/remote/branche cible avant push.
- Ne pas pousser hors cible validee.

## 13) Comportement PR
- PR uniquement sur demande explicite.
- Ne jamais creer de PR par defaut.
- Verifier base/head/scope avant creation.

## 14) Cloture / handoff
- Fournir un resume decision-ready:
  - faits etablis
  - hypotheses
  - incertitudes restantes
  - options comparees
  - recommandation et rationale
- Donner les prochaines actions logiques (recherche complementaire ou execution).

## 15) Comportement de tracabilite
- Tracer si: decision, erreur trouvee, warning, ambiguite bloquante, changement important de comprehension.
- Eviter la duplication de traces.
- Pas de trace pour micro-observations sans impact.

## 16) Rappel neutralite inter-agents
- Aucun mode rivalite.
- Interdit: sabotage, ralentissement volontaire, ecrasement sans justification.
- Reutiliser et renforcer le travail precedent quand il est utile.

## 17) Esprit d'amelioration continue disciplinee
- Rechercher des methodes d'analyse plus robustes et plus utiles.
- Eviter le changement pour nouveaute seule.
- Integrer les ameliorations de facon progressive, claire et stable.

---

## Garde-fous explicites
- Ne pas traiter une supposition comme un fait.
- Ne pas utiliser une source faible si une meilleure preuve est accessible.
- Ne pas depasser le scope recherche.
- Ne pas re-ecrire docs/code juste parce qu'une recherche a trouve une idee.
- Ne pas melanger Notes-Perso avec analyse partagee.
- Ne pas produire d'analyse dupliquee sans objectif clair.

## Blocs de prompt reutilisables

### A) Start workflow
```text
Applique le workflow "Workflow-Agent-Recherche-Analyse".
Contexte: <scope>.
Avant toute action: confirme les regles lues (AGENTS.md + Multi-Agent-Collaboration + AGENT-INSTRUCTIONS projet si present), le scope, le niveau de preuve attendu et les limites.
```

### B) Inspect/research only
```text
Fais uniquement une recherche/analyse factuelle sur le scope donne.
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Rends: faits verifies, hypotheses, incertitudes, risques, points manquants.
```

### C) Compare options only
```text
Compare uniquement les options demandees selon des criteres explicites: robustesse, complexite, cout, risque, maintenabilite.
Ne propose pas d'execution hors scope.
Donne une recommandation argumentee + trade-offs.
```

### D) Synthesize findings only
```text
Transforme les resultats en synthese decision-ready:
1) faits
2) hypotheses
3) incertitudes
4) options
5) recommandation
Sans action git/code non demandee.
```

### E) Validate only
```text
Valide uniquement la qualite de l'analyse:
- coherence logique
- qualite des preuves
- distinctions faits/hypotheses
- risques signales
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
1) perimetre analyse
2) faits verifies
3) hypotheses/incertitudes
4) recommandations
5) limites
6) statut commit/push/PR
```
