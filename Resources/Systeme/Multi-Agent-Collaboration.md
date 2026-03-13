# Multi-Agent-Collaboration

- **Statut** : à compléter
- **But du fichier** : centraliser les règles de collaboration multi-agents pour ce repo.
- **Note** : fichier créé pour rétablir la cohérence des références du repository.

## Politique minimale de traçabilité (SCC)
- **Phase actuelle** : SCC en construction → traçabilité utile mais légère, sans bureaucratie lourde.
- **Direction** : à terme, la mémoire opérationnelle doit être dans le SCC (docs/notes), pas dans l'agent.
- **Quand laisser une trace** : si changement important, erreur trouvée, ambiguïté bloquante, décision prise, ou avertissement utile pour éviter une erreur future.
- **Où laisser la trace (par défaut)** :
  - trace projet → `Projects/<Projet>/Notes/` (source de vérité locale du projet)
  - trace transversale SCC → ce fichier (`Resources/Systeme/Multi-Agent-Collaboration.md`)
- **Quand aucune trace n'est requise** : micro-ajustement sans impact, action réversible évidente, ou simple exploration sans décision.
- **Règle projet** : `Projects/**/AGENT-INSTRUCTIONS.md` peut préciser le point d'entrée local, mais ne doit pas redéfinir la politique globale.

## Types minimaux de traces (officiels)
- `decision`
- `error-found`
- `warning`
- `ambiguity-blocker`
- `important-change`

## Format minimal de trace (officiel)
- Date :
- Type :
- Contexte :
- Fait / Décision :
- Impact / Prochaine étape :

## Règle anti-duplication
- Une trace = un seul emplacement de référence.
- Si une trace existe déjà ailleurs, ajouter uniquement un renvoi court vers la source, sans recopier le contenu.

## Niveau d'exigence
- Maintenant : appliquer ce minimum, sans tracer chaque micro-action.
- Plus tard : renforcer progressivement la couverture quand la structure SCC sera stabilisée.
