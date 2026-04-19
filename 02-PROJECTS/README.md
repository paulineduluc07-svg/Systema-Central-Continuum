# 02-PROJECTS

Dossiers projets suivis dans SCC.

## Rôle
Ce dossier sert à regrouper les projets suivis dans SCC.

Il permet de :
- séparer clairement chaque projet
- garder une structure cohérente par projet
- réunir au même endroit la documentation, les assets, le code et les livrables liés à un projet

## Dossiers actuellement présents
- Anima Ingenium
- Drawn-by-Fate
- Plateforme-Restaurant
- Systema-Agency

Certains dossiers non projet peuvent parfois s’y retrouver temporairement.
Ils doivent alors être reclassés, archivés ou supprimés si ce n’est pas leur place.

## Principe
Chaque dossier projet présent dans `02-PROJECTS/` doit idéalement suivre une structure claire.

Ce dossier sert de base de travail documentaire et opérationnelle du projet :
- vision
- notes
- tâches
- trace de travail
- assets
- code
- livrables

Important :
- `02-PROJECTS` = dossiers projets suivis dans SCC
- `03-ARCHIVES` = éléments inactifs, anciens ou figés
- le runtime Hermes n’est pas géré ici ; il reste sur le VPS

## Structure standard d’un projet

```text
02-PROJECTS/<Projet>/
├── README.md      ← vision, portée, objectif final, règles projet
├── TODO.md        ← plan de travail actuel
├── NOTES.md       ← notes, questions, idées, réflexion datée
├── WORKLOG.md     ← trace courte des actions effectuées
├── Assets/        ← images, références visuelles, ressources
├── Code/          ← code source, scripts, structure technique
└── Livrables/     ← exports, versions remises, fichiers finaux
