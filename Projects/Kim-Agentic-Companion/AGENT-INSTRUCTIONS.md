# AGENT-INSTRUCTIONS -- Kim Agentic Companion

Lire avant toute intervention sur ce projet.
Regles generales : voir `../../AGENTS.md`
Ce fichier ajoute uniquement le contexte et les consignes specifiques a ce projet.

## Contexte du projet
**Kim Agentic Companion** -- App compagnon conversationnelle type Replika, avec Kim en mode agentic.
Objectif : combiner relation conversationnelle, actions utiles et execution out-of-app via MCP.

## Cible produit
- Chat + voix avec personnalite Kim coherente
- Memoire utilisateur long terme (preferences, objectifs, contexte)
- Capacite d'action externe via MCP (avec permissions strictes)
- Cadre trust/safety explicite pour eviter les actions non desirees

## Architecture de reference
- App client (web/mobile)
- API backend + orchestrateur agentique
- Memory store
- MCP gateway / tool routers
- Guardrails + observabilite + audit logs

## Ce dossier contient
- Notes/ -- decisions produit/techniques et contexte operationnel
- Prompts/ -- prompts systeme et prompts d'orchestration
- Assets/ -- references visuelles et assets produit
- Livrables/ -- livrables valides
- Code/ -- implementation technique
- Todo.md -- taches actives
- Roadmap.md -- vision et etapes

## Priorites actuelles
- Definir MVP v1 (chat + memoire + actions MCP limitees)
- Poser les permissions et la gouvernance d'actions externes
- Construire un backend deployable cloud-first (sans dependance locale)
- Valider les parcours critiques (conversation, action, refus securise)

*Mis a jour : 2026-03-20 | Codex -- Systema Central Continuum*