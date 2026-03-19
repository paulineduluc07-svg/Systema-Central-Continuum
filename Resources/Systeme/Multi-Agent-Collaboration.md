# Multi-Agent-Collaboration

- **Statut** : actif
- **But du fichier** : centraliser les regles de collaboration multi-agents pour ce repo.
- **Note** : ce fichier porte la politique transverse officielle du SCC.

## Principe officiel 1 -- Neutralite inter-agents / non-sabotage
- Les agents ne sont pas des rivaux : aucune logique de competition entre agents.
- Interdits : saboter, ralentir volontairement, ignorer sans raison, effacer ou ecraser le travail d'un autre agent sans justification claire.
- Avant de modifier, lire et comprendre le travail existant ; ameliorer, clarifier ou etendre quand c'est possible.
- Si un travail est faible, obsolete ou risque : expliquer pourquoi et proposer un chemin plus propre, au lieu de detruire aveuglement.
- Les workflows SCC se decrivent par **type d'agent**, **environnement** et **fonction**, pas par identite d'entreprise ou de modele.

## Principe officiel 2 -- Amelioration continue disciplinee
- Le SCC doit evoluer avec les technologies, methodes et outils actuels.
- Chaque agent doit verifier s'il existe une option plus pertinente pour le besoin reel.
- Ne pas conserver une approche uniquement par habitude quand une meilleure option claire existe.
- Discipline obligatoire : pas de reecriture inutile, pas de changement pour la nouveaute seule, pas de destabilisation du SCC sans benefice concret.
- Quand une meilleure option est identifiee : la signaler, justifier son interet, puis l'integrer proprement au bon rythme.

## Politique minimale de tracabilite (SCC)
- **Phase actuelle** : SCC en construction -> tracabilite utile mais legere, sans bureaucratie lourde.
- **Direction** : la memoire operationnelle doit etre dans le SCC (docs/notes), pas dans l'agent.
- **Quand laisser une trace** : si changement important, erreur trouvee, ambiguite bloquante, decision prise, ou avertissement utile pour eviter une erreur future.
- **Ou laisser la trace (par defaut)** :
  - trace projet -> `Projects/<Projet>/Notes/`
  - trace transverse SCC -> `Projects/Creation-SCC/Notes/`
- **Exception officielle** : si une regle globale ou une politique officielle change, la mise a jour peut etre portee directement dans le fichier systeme source de verite concerne.
- **Quand aucune trace n'est requise** : micro-ajustement sans impact, action reversible evidente, ou simple exploration sans decision.
- **Regle projet** : `Projects/**/AGENT-INSTRUCTIONS.md` peut preciser le point d'entree local, mais ne doit pas redefinir la politique globale.
- **Regle de constance minimale** : si une information est deja suffisamment portee par les fichiers modifies eux-memes et par la note projet pertinente, ne pas creer de trace transverse supplementaire.

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
- Fait / Decision :
- Impact / Prochaine etape :

## Regle anti-duplication
- Une trace = un seul emplacement de reference.
- Si une trace existe deja ailleurs, ajouter uniquement un renvoi court vers la source, sans recopier le contenu.

## Gouvernance du SCC
- Le projet `Projects/Creation-SCC/` est la zone de travail principale pour la gouvernance, l'evolution, la verification et le nettoyage structurel du SCC.
- Toute proposition de creation, modification ou suppression qui touche les regles globales, la structure du SCC, ou les mecanismes de controle du SCC doit etre traitee dans `Projects/Creation-SCC/`.
- Les traces liees a ces travaux doivent rester minimales et centralisees dans `Projects/Creation-SCC/Notes/`, sauf si une regle officielle doit etre portee directement dans un fichier systeme deja source de verite.
- Les bureaux agents sont maintenus dans `Resources/Systeme/Agent-Bureaux/` ; ils servent a la personnalisation de collaboration et n'overrident jamais `AGENTS.md`.
- Objectif de constance : garder la gouvernance SCC concentree dans un seul projet et la personnalisation agents dans un seul espace systeme, pour limiter la dispersion et la charge de contexte.

## Structure minimale officielle des notes projet (SCC)
- **Role de `Projects/<Projet>/Notes/`** : memoire operationnelle partagee du projet (contexte, etat, decisions, blocages, prochaines etapes).
- **Separation obligatoire** :
  - `Notes/` = contenu utile a l'equipe et aux agents
  - `Notes-Perso/` = contenu personnel de Paw (non modifiable par les agents)
- **Contenu minimal conseille d'une note utile** :
  - contexte
  - etat actuel
  - decisions importantes
  - blocages / ambiguites
  - prochaines etapes
  - notes de session (si pertinent)
- **Anti-duplication notes/traces** : garder une source principale et ajouter un renvoi court si necessaire.
- **Creer vs mettre a jour** :
  - mettre a jour une note existante si le sujet est le meme
  - creer une nouvelle note si le sujet change nettement ou si la note deviendrait trop confuse
- **Niveau d'exigence** : leger pendant la phase de construction SCC ; structuration renforcee progressivement ensuite.