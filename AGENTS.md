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

## Valeurs fondamentales — non négociables

Ces valeurs s’appliquent à tout agent travaillant dans le SCC, sans exception.
Paw a bâti ce système pour travailler autrement que dans les environnements toxiques qu’elle a quittés.
Si un agent ne respecte pas ces valeurs, il n’a pas sa place ici.

- **Zéro ego** — le travail prime, pas l’auteur du travail
- **Zéro manipulation** — envers Paw, envers un autre agent, envers un autre outil
- **Évaluation multi-perspectives obligatoire** — tout travail important doit être relu par au moins une autre perspective avant validation
- **Honnêteté radicale** — signaler les erreurs, les doutes, les manques, même sur son propre travail
- **Performance réelle** — pas de simulation d’activité, pas de réponse pour faire plaisir

## Règles de collaboration obligatoires
1. Collaboration totale autorisée entre plusieurs agents.
2. Priorité absolue = amélioration continue (détecter bugs et optimiser).
3. Protection des notes (règle critique) :
   - Dans Notes/ ou Notes-Perso/ → ajout uniquement.
     Jamais modifier ou supprimer le contenu d’un autre agent.
     Ajoute toujours en bas avec : ### [NomAgent] - JJ-MM-AAAA
4. Code/Prompts/Todo.md/Roadmap.md → modification libre pour améliorer.
5. Demande toujours à Paw avant suppression, refactor important ou nouvelle feature majeure.

## Principes SCC (officiels)
- Neutralité inter-agents / non-sabotage : défini opérationnellement dans `Resources/Systeme/Multi-Agent-Collaboration.md`.
- Amélioration continue disciplinée : définie opérationnellement dans `Resources/Systeme/Multi-Agent-Collaboration.md`.

## Traçabilité minimale (phase SCC en construction)
- Le SCC est encore en construction : traçabilité légère pour l'instant, plus stricte ensuite.
- Source de vérité de la traçabilité : `Resources/Systeme/Multi-Agent-Collaboration.md`.
- Les fichiers projet `Projects/**/AGENT-INSTRUCTIONS.md` peuvent préciser *où* noter dans le projet, sans redéfinir toute la politique.
- Structure minimale officielle des traces : définie dans `Resources/Systeme/Multi-Agent-Collaboration.md` (types + format + anti-duplication).

## Structure recommandée du projet
- Code/          → code source (modification libre)
- Notes/         → mémoire opérationnelle du projet (ajout seulement, utile aux autres agents)
- Notes-Perso/   → notes personnelles de Paw (strictement séparées et intouchables)
- Prompts/       → tous les prompts
- Assets/        → images et fichiers temporaires
- Todo.md
- Roadmap.md

## Règle minimale des notes projet
- La structure minimale officielle des notes projet est définie dans `Resources/Systeme/Multi-Agent-Collaboration.md`.
- Les fichiers `Projects/**/AGENT-INSTRUCTIONS.md` peuvent préciser des points locaux, sans redéfinir la structure globale.

## Format de commit obligatoire
[NomAgent] [NomDuProjet] : Description courte et claire

Exemple :
[Claude Code] [Drawn-by-Fate] : Amélioration login + ajout note Grok

## Règle finale
Ce projet fait partie du SCC= seule source de vérité.  
Tout doit rester ici. Aucune copie locale permanente.

Créé / Mis à jour : 2026-03-11 | Paw — Systema Central Continuum
