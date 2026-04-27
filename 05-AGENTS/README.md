# 05-AGENTS

## Rôle
Ce dossier sert à cadrer les agents dans SCC.

**Note de structure :** `05-AGENTS` est un dossier de gouvernance et de cadrage. Il ne suit pas la logique de "dossier projet" définie dans `02-PROJECTS` (README/TODO/WORKLOG/NOTES) car il définit les règles transversales applicables à tous les agents.

Il doit permettre de :
- fixer les règles stables de travail des agents
- éviter les improvisations
- séparer cadre agent, projets, runtime et archives

## Règles
- Un agent ne doit pas inventer sa propre méthode.
- Il lit d'abord ce cadre, puis les fichiers projet explicitement demandés.
- Il travaille dans le bon périmètre.
- Il met à jour la documentation active seulement si l'état réel a changé.
- Il laisse une trace courte dans le `WORKLOG.md` concerné quand une action réelle a été faite.

## Workflow standard
- Debut de session:
  - lire `05-AGENTS/README.md`
  - puis lire les fichiers projet demandes par l'utilisateur
  - ordre standard projet:`README.md`, `WORKLOG.md`, `TODO.md`, `NOTES.md`, `NOTES_DE_PAULINE.md` 
  - lire les fichiers de `RESSOURCES/`
  - analyser l'organisation et la cohérence des instructions et des fichiers du projet et donner le résultat de l'analyse à l'utilisateur
  - attendre les instructions de l'utilisateur


- Fin de session:
  - mettre a jour `TODO.md` si l'etat des taches a change
  - mettre a jour `NOTES.md` si une decision, une question ouverte ou un repere actif a change
  - mettre a jour `WORKLOG.md` si une action reelle a ete faite
  - ne pas creer de fichier intermediaire de reprise ou de workflow


## Ce qui appartient ici
- règles stables des agents
- notes sur le comportement des agents dans SCC
- observations sur les dossiers ou fichiers auto-créés par des outils

## Ce qui n'appartient pas ici
- état runtime d'un projet
- détails VPS, secrets ou commandes d'exploitation
- suivi opérationnel d'un projet particulier
