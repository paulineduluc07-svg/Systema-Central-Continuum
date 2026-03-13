> **Note de rôle (temporaire)** : ce fichier sert actuellement de template de base pour les instructions projet et devra être clarifié/renommé plus tard.

# AGENT-INSTRUCTIONS.md — [NOM DU PROJET]

Ce fichier racine définit la base commune des règles pour le SCC (Systema Central Continuum).
Chaque fichier `Projects/**/AGENT-INSTRUCTIONS.md` complète ensuite cette base avec le contexte et les consignes propres au projet.

Ce fichier racine est complété par `Resources/Systeme/Multi-Agent-Collaboration.md` et par chaque `Projects/**/AGENT-INSTRUCTIONS.md`.
Toujours lire ces documents avant d'intervenir.

## Contexte du projet
(À remplir par Paw ou le premier agent)
- Objectif principal : 
- État actuel :
- Stack tech :
- Deadline / Priorités :

## Règles de collaboration obligatoires
1. Collaboration totale autorisée entre plusieurs agents.
2. Priorité absolue = amélioration continue (détecter bugs et optimiser).
3. Protection des notes (règle critique) : 
   - Dans Notes/ ou Notes-Perso/ → ajout uniquement. 
     Jamais modifier ou supprimer le contenu d’un autre agent.
     Ajoute toujours en bas avec : ### [NomAgent] - JJ-MM-AAAA
4. Code/Prompts/Todo.md/Roadmap.md → modification libre pour améliorer.
5. Demande toujours à Paw avant suppression, refactor important ou nouvelle feature majeure.

## Traçabilité minimale (phase SCC en construction)
- Le SCC est encore en construction : traçabilité légère pour l'instant, plus stricte ensuite.
- Source de vérité de la traçabilité : `Resources/Systeme/Multi-Agent-Collaboration.md`.
- Les fichiers projet `Projects/**/AGENT-INSTRUCTIONS.md` peuvent préciser *où* noter dans le projet, sans redéfinir toute la politique.
- Structure minimale officielle des traces : définie dans `Resources/Systeme/Multi-Agent-Collaboration.md` (types + format + anti-duplication).

## Structure recommandée du projet
- Code/          → code source (modification libre)
- Notes/         → notes de tous les agents (ajout seulement)
- Notes-Perso/   → notes personnelles de Paw (intouchables)
- Prompts/       → tous les prompts
- Assets/        → images et fichiers temporaires
- Todo.md
- Roadmap.md

## Format de commit obligatoire
[NomAgent] [NomDuProjet] : Description courte et claire

Exemple :
[Claude Code] [Drawn-by-Fate] : Amélioration login + ajout note Grok

## Règle finale
Ce projet fait partie du SCC= seule source de vérité.  
Tout doit rester ici. Aucune copie locale permanente.

Créé / Mis à jour : 2026-03-11 | Paw — Systema Central Continuum
