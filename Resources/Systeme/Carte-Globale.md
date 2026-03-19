# Carte-Globale

- **Statut** : actif
- **But du fichier** : documenter la vue d'ensemble actuelle du SCC.

## Architecture generale
- `AGENTS.md` : source de verite globale des regles agents
- `Resources/Systeme/Multi-Agent-Collaboration.md` : politique transverse du SCC
- `Resources/Systeme/Workflows/` : methodes de travail par role et environnement
- `Resources/Systeme/Agent-Bureaux/` : personnalisation de collaboration par agent, secondaire et subordonnee aux regles globales
- `Projects/` : travail reel par projet
- `Projects/Creation-SCC/` : gouvernance, maintenance, verification et evolution du SCC
- `Areas/` : contexte de responsabilites continues
- `Inbox/` : zone de capture et de transit, a garder legere
- `Archives/` : elements termines

## Hierarchie de lecture
1. `AGENTS.md`
2. `Resources/Systeme/Multi-Agent-Collaboration.md`
3. `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible
4. `Resources/Systeme/Agent-Bureaux/<NomAgent>/` si un bureau existe pour l'agent concerne

## Regle de separation
- Les regles globales vivent dans les fichiers systeme officiels.
- Le travail projet et ses traces vivent dans le projet concerne.
- Les bureaux agents ne remplacent ni les regles globales ni les traces projet.

Mis a jour : 2026-03-18