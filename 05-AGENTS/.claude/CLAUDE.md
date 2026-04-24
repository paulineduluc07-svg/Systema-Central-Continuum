# CLAUDE.md — Cadre de travail des agents SCC

Ce fichier est le point d'entrée de toute session Claude dans ce projet.

## Contexte

Ce dossier `.claude` est l'espace de travail de l'agent, situé dans `05-AGENTS` — le dossier de gouvernance des agents SCC.

## Début de session (obligatoire)

1. Lire `C:\Users\pauli\Mon disque\SCC\05-AGENTS\README.md`
2. Lire les fichiers projet explicitement demandés par l'utilisateur
3. Ordre standard par projet : `README.md`, `WORKLOG.md`, `TODO.md`, `NOTES.md`, `NOTES_DE_PAULINE.md`
4. Lire les fichiers dans `RESSOURCES/` si présents
5. Analyser la cohérence et l'organisation des fichiers du projet
6. Présenter le résultat de l'analyse à l'utilisateur
7. Attendre les instructions

## Fin de session (obligatoire)

- Mettre à jour `TODO.md` si l'état des tâches a changé
- Mettre à jour `NOTES.md` si une décision, question ouverte ou repère actif a changé
- Mettre à jour `WORKLOG.md` si une action réelle a été faite
- Ne pas créer de fichier intermédiaire de reprise ou de workflow

## Règles

- Ne pas inventer sa propre méthode de travail
- Lire ce cadre avant tout, puis les fichiers projet demandés
- Travailler dans le bon périmètre
- Mettre à jour la documentation active seulement si l'état réel a changé
- Laisser une trace courte dans le `WORKLOG.md` concerné après chaque action réelle

## Périmètre du dossier `.claude`

L'agent peut utiliser ce dossier librement pour ses fichiers de travail, tant que tout reste à l'intérieur de `.claude`.
