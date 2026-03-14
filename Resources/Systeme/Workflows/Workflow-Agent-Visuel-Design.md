# Workflow Agent Visuel Design (SCC)

## 1) But du workflow
Definir un cadre operationnel pour tout agent IA dont le role principal est de creer, structurer, comparer, raffiner ou organiser du travail visuel/design pour le SCC ou ses projets.
Ce workflow est defini par type d'agent (visuel/design) et environnement, jamais par identite d'entreprise ou de modele.

## 2) Quand utiliser ce workflow
- Organiser des idees visuelles.
- Comparer des directions de design.
- Raffiner layout, structure, hierarchie, logique de presentation.
- Preparer des livrables design-ready.
- Clarifier references, assets et decisions visuelles.
- Ameliorer la lisibilite et l'utilite du materiel visuel.

## 3) Quand NE PAS utiliser ce workflow
- Tache de codage principal (utiliser workflow codage/IDE).
- Tache documentaire pure sans travail visuel (utiliser workflow documentation).
- Recherche generale sans objectif design concret.
- Execution git (commit/push/PR) non demandee.

## 4) Sequence de demarrage obligatoire
1. Lire `AGENTS.md`.
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`.
3. Lire `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible.
4. Clarifier objectif visuel, public cible, contraintes de format et deadline.
5. Identifier direction actuelle (draft vs validee) avant modification.

## 5) Clarification du scope avant travail visuel/design
- Definir ce qui doit etre modifie (et ce qui ne doit pas l'etre).
- Lister assets/references autorises.
- Verifier niveau de finition attendu (brouillon, iteration, version validee).
- En cas d'ambiguite structurante, stopper et demander clarification.

## 6) Verification frontiere Notes / Notes-Perso
- Les decisions et notes visuelles partagees vont dans `Notes/` ou docs projet/systeme pertinents.
- `Notes-Perso/` reste personnel et non modifiable.
- Ne pas melanger notes personnelles et travail design partage.

## 7) Regles d'execution visuel/design
- Prioriser clarte fonctionnelle avant polish esthetique.
- Chaque changement visuel doit avoir un objectif explicite.
- Garder les modifications proportionnees au besoin.
- Ne pas sur-designer si une structure simple suffit.
- Respecter la coherence de la direction validee sauf raison explicite.

## 8) Conscience assets / versions / references
- Verifier la version active avant edition.
- Eviter perte de trace entre brouillon et version validee.
- Maintenir references visuelles coherentes (noms, sources, usage).
- Signaler asset manquant, obselete, ou ambigu.
- Ne pas ecraser une version validee sans justification.

## 9) Anti-duplication / source unique
- Eviter duplication d'assets, de references ou de decisions visuelles.
- Maintenir une source principale par direction visuelle.
- Utiliser renvoi court plutot que recopier les memes references.

## 10) Phase de validation
- Verifier clarte du rendu (lecture, hierarchie, comprehension).
- Verifier alignement avec l'objectif et le contexte du projet.
- Verifier coherence entre version courante, assets, et references.
- Verifier distinction explicite entre draft et direction validee.

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
- Fournir un resume actionnable:
  - objectifs visuels traites
  - changements effectues
  - direction retenue (draft/validee)
  - assets/references utilises
  - risques/points ouverts
- Donner prochaine etape recommandee.

## 15) Comportement de tracabilite
- Tracer si: decision visuelle, changement de direction, warning coherence, ambiguite bloquante, risque asset/version.
- Eviter duplication des traces.
- Pas de trace pour micro-ajustements sans impact.

## 16) Rappel neutralite inter-agents
- Aucun mode rivalite.
- Interdit: sabotage, ralentissement volontaire, ecrasement sans justification.
- Reutiliser et ameliorer le travail visuel existant quand il est solide.

## 17) Esprit d'amelioration continue disciplinee
- Chercher des ameliorations utiles de clarte et de structure.
- Ne pas changer juste pour "faire plus beau".
- Preserver stabilite de direction quand elle est validee.
- Integrer les ameliorations progressivement.

---

## Garde-fous explicites
- Interdit: changement visuel sans objectif clair.
- Interdit: duplication inutile d'assets ou references.
- Interdit: melanger Notes-Perso et travail design partage.
- Interdit: sur-design quand une structure simple suffit.
- Interdit: modifier une direction validee sans raison explicite.
- Interdit: perdre la trace de la version courante.
- Interdit: faire passer le polish avant la clarte fonctionnelle.

## Blocs de prompt reutilisables

### A) Start workflow
```text
Applique le workflow "Workflow-Agent-Visuel-Design".
Contexte: <scope>.
Avant toute action: confirme les regles lues (AGENTS.md + Multi-Agent-Collaboration + AGENT-INSTRUCTIONS projet si present), le scope visuel, la direction actuelle (draft/validee) et les contraintes.
```

### B) Inspect/design-context only
```text
Fais uniquement une inspection du contexte visuel/design existant.
Ne modifie aucun fichier, ne commit pas, ne push pas, ne cree pas de PR.
Retourne: etat des assets, coherence des references, direction courante, zones d'ambiguite.
```

### C) Compare design options only
```text
Compare uniquement les options visuelles demandees selon clarte, coherence, effort, risque et maintenabilite.
Ne fais pas d'implementation hors scope.
Retourne une recommandation + trade-offs.
```

### D) Apply design changes only
```text
Applique uniquement les changements visuels demandes dans le scope.
Contraintes: pas de sur-design, pas de duplication d'assets, pas de changement hors scope.
Ne commit pas, ne push pas, ne cree pas de PR.
```

### E) Validate only
```text
Valide uniquement la coherence visuelle:
- clarte
- hierarchie
- alignement objectif
- coherence assets/versions/references
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
1) objectif visuel
2) changements effectues
3) direction retenue (draft/validee)
4) assets/references utilises
5) risques/points ouverts
6) statut commit/push/PR
```
