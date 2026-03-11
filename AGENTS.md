# AGENT-INSTRUCTIONS.md — [NOM DU PROJET]

**Instructions spécifiques pour tous les agents travaillant sur ce projet**

Ce fichier complète AGENTS.md (racine) et Multi-Agent-Collaboration.md.  
Toujours les lire en premier.

## Contexte du projet
(À remplir par Paw ou le premier agent)
- Objectif principal : 
- État actuel :
- Stack tech :
- Deadline / Priorités :

## Règles de collaboration (obligatoires)
1. **Collaboration totale autorisée** : plusieurs agents peuvent travailler sur le même projet en même temps.
2. **Priorité absolue = Amélioration continue**  
   → Détecte bugs, mauvaises pratiques, optimisations → propose et améliore.
3. **Protection des notes** (règle critique)  
   - Fichiers `Notes/`, `Notes-Perso/`, logs de réflexion → **AJOUT UNIQUEMENT**.  
     Jamais modifier ou supprimer le contenu d’un autre agent.  
     Ajoute toujours en bas avec : `### [NomAgent] - JJ-MM-AAAA`
   - Code, Prompts, Todo.md, Roadmap.md → modification libre pour améliorer.
4. **Demande toujours à Paw avant** :  
   - Toute suppression de fichier  
   - Toute modification importante (refactor, changement d’architecture)  
   - Toute correction majeure ou nouvelle feature

## Structure recommandée du projetCode/                                          Code source (agents modifient librement)
Notes/         ← Notes de tous les agents (ajout seulement)
Notes-Perso/   ← Tes notes personnelles (intouchables par les agents)
Prompts/       ← Tous les prompts utilisés
Assets/        ← Images, screenshots, fichiers temporaires
Todo.md
Roadmap.md
text## Format de commit (obligatoire)
[NomAgent] [NomDuProjet] : Description courte et claire
Exemple :
[Claude Code] [Drawn-by-Fate] : Amélioration auth + ajout note Grok sur UX
text**Règle finale** : Ce projet fait partie du SCC-IPARA = seule source de vérité.  
Tout doit rester ici. Aucune copie locale permanente.

*Créé/Mis à jour : 2026-03-11 | Paw — Systema Central Continuum*
