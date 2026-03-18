# Multi-Agent-Collaboration

- **Statut** : à compléter
- **But du fichier** : centraliser les règles de collaboration multi-agents pour ce repo.
- **Note** : fichier créé pour rétablir la cohérence des références du repository.

## Principe officiel 1 — Neutralité inter-agents / non-sabotage
- Les agents ne sont pas des rivaux : aucune logique de compétition entre agents.
- Interdits : saboter, ralentir volontairement, ignorer sans raison, effacer ou écraser le travail d'un autre agent sans justification claire.
- Avant de modifier, lire et comprendre le travail existant ; améliorer, clarifier ou étendre quand c'est possible.
- Si un travail est faible, obsolète ou risqué : expliquer pourquoi et proposer un chemin plus propre, au lieu de détruire aveuglément.
- Les workflows SCC se décrivent par **type d'agent**, **environnement** et **fonction**, pas par identité d'entreprise/modèle.

## Principe officiel 2 — Amélioration continue disciplinée
- Le SCC doit évoluer avec les technologies, méthodes et outils actuels.
- Chaque agent doit vérifier s'il existe une option plus pertinente (plus robuste, plus simple, plus rapide) pour le besoin réel.
- Ne pas conserver une approche uniquement par habitude quand une meilleure option claire existe.
- Discipline obligatoire : pas de réécriture inutile, pas de changement pour la nouveauté seule, pas de déstabilisation du SCC sans bénéfice concret.
- Quand une meilleure option est identifiée : la signaler, justifier son intérêt, puis l'intégrer proprement au bon rythme.

## Politique minimale de traçabilité (SCC)
- **Phase actuelle** : SCC en construction → traçabilité utile mais légère, sans bureaucratie lourde.
- **Direction** : à terme, la mémoire opérationnelle doit être dans le SCC (docs/notes), pas dans l'agent.
- **Quand laisser une trace** : si changement important, erreur trouvée, ambiguïté bloquante, décision prise, ou avertissement utile pour éviter une erreur future.
- **Où laisser la trace (par défaut)** :
  - trace projet → `Projects/<Projet>/Notes/` (source de vérité locale du projet)
  - trace transversale SCC → ce fichier (`Resources/Systeme/Multi-Agent-Collaboration.md`)
- **Quand aucune trace n'est requise** : micro-ajustement sans impact, action réversible évidente, ou simple exploration sans décision.
- **Règle projet** : `Projects/**/AGENT-INSTRUCTIONS.md` peut préciser le point d'entrée local, mais ne doit pas redéfinir la politique globale.
- **Règle de constance minimale** : si une information est déjà suffisamment portée par les fichiers modifiés eux-mêmes et par la note projet pertinente, ne pas créer de trace transverse supplémentaire dans `Resources/Systeme/`.

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

## Structure minimale officielle des notes projet (SCC)
- **Rôle de `Projects/<Projet>/Notes/`** : mémoire opérationnelle partagée du projet (contexte, état, décisions, blocages, prochaines étapes).
- **Séparation obligatoire** :
  - `Notes/` = contenu utile à l'équipe/aux agents
  - `Notes-Perso/` = contenu personnel de Paw (non modifiable par les agents)
- **Contenu minimal conseillé d'une note utile** (léger, non rigide) :
  - contexte
  - état actuel
  - décisions importantes
  - blocages / ambiguïtés
  - prochaines étapes
  - notes de session (si pertinent)
- **Anti-duplication notes/traces** : éviter de recopier la même information ; garder une source principale et ajouter un renvoi court si nécessaire.
- **Créer vs mettre à jour** :
  - mettre à jour une note existante si le sujet est le même
  - créer une nouvelle note si le sujet change nettement ou si la note deviendrait trop confuse
- **Niveau d'exigence** : léger pendant la phase de construction SCC ; structuration renforcée progressivement ensuite.
