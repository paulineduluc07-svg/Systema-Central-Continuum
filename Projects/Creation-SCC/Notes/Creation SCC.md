Type : #context
Subject : #scc #governance
Status : #inprogress
Date : 2026-03-18

# PROJET -- Creation-SCC

## Role
Projet central de gouvernance et de maintenance du SCC.

## Ce qui appartient ici
- regles globales SCC
- structure generale du repo
- verification des manquements aux regles SCC
- nettoyage transverse des informations obsoletes ou inutiles
- evolution des mecanismes de controle et de constance entre agents

## Ce qui n'appartient pas ici
- execution metier d'un projet applicatif
- backlog produit d'un projet metier
- details locaux qui doivent rester dans les Notes du projet concerne

## Note de gouvernance
Le but est de concentrer la maintenance du SCC dans un seul projet pour limiter la dispersion et la charge de contexte.

*Mis a jour : 2026-03-18 | Paw -- Systema Central Continuum*
## Bureau Codex
- Un bureau operateur minimal pour Codex est maintenu dans `Projects/Creation-SCC/Agent-Bureaux/Codex/`.
- Ce bureau sert uniquement a la personnalisation de la collaboration avec Codex.
- Il n'override jamais `AGENTS.md` et ne remplace jamais les traces projet.
- Des bureaux operateurs minimaux existent pour `Codex`, `Gemini`, `Claude` et `Manus` dans `Projects/Creation-SCC/Agent-Bureaux/`.