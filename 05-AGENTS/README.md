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
- Toute passe ou action réelle doit être documentée dans les dossiers actifs du projet concerné.
- La synchronisation local ↔ repo doit être faite à chaque fin de passe, sinon l'état réel devient flou et du temps est perdu à revérifier.
- Si un dossier dans Google Drive (`Mon disque`) doit être synchronisé réellement, privilégier une action côté Windows (PowerShell, Git Windows, GitHub Desktop, VS Code Windows ou Explorateur), car les écritures WSL directes peuvent ne pas être détectées par Google Drive.

## Workflow standard
- Debut de session:
  - lire `05-AGENTS/README.md`
  - puis lire les fichiers projet demandes par l'utilisateur ; si aucun projet n'est mentionne par l'utilisateur, revenir dans la conversation pour attendre des instructions
  - ordre standard projet:`README.md`, `WORKLOG.md`, `TODO.md`, `NOTES.md`, `NOTES_DE_PAULINE.md` 
  - lire les fichiers de `RESSOURCES/`
  - analyser l'organisation et la cohérence des instructions et des fichiers du projet et donner le résultat de l'analyse à l'utilisateur
  - attendre les instructions de l'utilisateur


- Fin de session:
  - mettre a jour `TODO.md` si l'etat des taches a change
  - mettre a jour `NOTES.md` si une decision, une question ouverte ou un repere actif a change
  - mettre a jour `WORKLOG.md` si une action reelle a ete faite
  - synchroniser le SCC local avec le clone GitHub quand le projet existe dans les deux emplacements
  - pour les dossiers Google Drive, verifier que la synchronisation est déclenchée côté Windows quand c'est nécessaire
  - verifier que la prod, le repo et la documentation racontent le meme etat
  - ne pas creer de fichier intermediaire de reprise ou de workflow


## Ce qui appartient ici
- règles stables des agents
- notes sur le comportement des agents dans SCC
- observations sur les dossiers ou fichiers auto-créés par des outils

## Ce qui n'appartient pas ici
- état runtime d'un projet
- détails VPS, secrets ou commandes d'exploitation
- suivi opérationnel d'un projet particulier
