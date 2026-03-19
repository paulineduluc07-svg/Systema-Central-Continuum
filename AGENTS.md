# AGENTS.md

Ce fichier est la source de verite unique des regles agents pour ce depot.
Tout le reste doit rester aligne avec ce fichier.
Les autres documents systeme ne doivent pas re-porter la meme gouvernance en double.

## Portee
- Systeme multi-agent base sur role + contexte.
- Aucune regle specifique a un modele IA particulier.
- Interdit de creer des fichiers de regles dedies a une IA particuliere hors bureau agent autorise.
- Source de verite : ce repo uniquement.

## Ordre de lecture obligatoire
1. `AGENTS.md`
2. `Projects/<Projet>/AGENT-INSTRUCTIONS.md` (si projet cible)
3. `Ressources/Agent-Bureaux/<NomAgent>/WELCOME.md` puis les fichiers de bureau associes (si bureau agent existe)
4. `Ressources/Workflows/<Workflow>.md` (si un workflow est utile ou explicitement demande)
5. Tout autre fichier explicitement demande par la mission

## Architecture utile du SCC
- `Projects/` : travail reel par projet.
- `Projects/Creation-SCC/` : gouvernance, maintenance, verification et evolution du SCC.
- `Ressources/Workflows/` : methodes de travail par role et environnement.
- `Ressources/Agent-Bureaux/` : personnalisation de collaboration par agent, secondaire et subordonnee.
- `Areas/` : contexte de responsabilites continues.
- `Inbox/` : capture et transit, a garder legers.
- `Archives/` : elements termines.

## Regles operationnelles
1. Zero doublon actif.
2. Comprendre l'existant avant de modifier.
3. Interdit : sabotage, ralentissement volontaire, ecrasement ou effacement sans justification claire.
4. `Code/`, `Prompts/`, `Todo.md`, `Roadmap.md` : modification autorisee dans le scope demande.
5. `Notes/` : mise a jour autorisee pour garder une memoire utile et coherente.
6. `Notes-Perso/` : strictement interdit aux agents.
7. Demander validation a Paw avant :
   - suppression
   - refactor majeur
   - nouvelle feature majeure
8. Commit/push/PR uniquement sur demande explicite.
9. Les changements de gouvernance SCC se traitent dans `Projects/Creation-SCC/`.
10. Les bureaux agents sont maintenus dans `Ressources/Agent-Bureaux/` et n'override jamais `AGENTS.md`.
11. Si une contradiction apparait, `AGENTS.md` fait foi.

## Amelioration continue disciplinee
- Chercher une option plus pertinente quand le besoin reel le justifie.
- Ne pas changer pour la nouveaute seule.
- Ne pas reecrire largement sans benefice concret.
- Integrer les ameliorations proprement, progressivement et de facon stable.

## Tracabilite minimale
- Laisser une trace si : decision, erreur trouvee, warning, ambiguite bloquante, changement important.
- Trace projet par defaut : `Projects/<Projet>/Notes/`
- Trace transverse SCC : `Projects/Creation-SCC/Notes/`
- Si une regle globale change, la mise a jour peut vivre directement dans le fichier systeme source de verite concerne.
- Si l'information est deja suffisamment portee par les fichiers modifies et par la note pertinente, ne pas creer de trace supplementaire.
- Une trace = une source principale + renvoi court si necessaire.

## Notes projet
- `Notes/` = memoire operationnelle partagee.
- Mettre a jour une note existante si le sujet reste le meme.
- Creer une nouvelle note seulement si le sujet change nettement ou si la note deviendrait confuse.

## Convention de commit
`[NomAgent] [NomProjet] : Description courte et claire`

Exemple :
`[Agent IDE] [Systema-Agency] : Clarifie gouvernance SCC`

Mis a jour: 2026-03-19