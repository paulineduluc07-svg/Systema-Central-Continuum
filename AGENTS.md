# AGENTS.md

Ce fichier est la source de vérité unique des règles agents pour ce dépôt.
Tous les autres documents doivent rester alignés avec ce fichier.

## Portée
- Système multi-agent basé sur rôle + contexte.
- Aucune règle spécifique à un modèle IA particulier.
- Interdit de créer des fichiers de règles dédiés à une IA particulière (`CLAUDE.md`, équivalents).

## Ordre de lecture obligatoire
1. `AGENTS.md`
2. `Resources/Systeme/Multi-Agent-Collaboration.md`
3. `Projects/<Projet>/AGENT-INSTRUCTIONS.md` (si projet ciblé)

## Règles opérationnelles
1. Source de vérité: ce repo uniquement.
2. Zéro doublon actif.
3. `Code/`, `Prompts/`, `Todo.md`, `Roadmap.md`: modification autorisée dans le scope demandé.
4. `Notes/`: mise à jour autorisée pour garder une mémoire utile et cohérente.
5. `Notes-Perso/`: strictement interdit aux agents.
6. Demander validation à Paw avant:
   - suppression
   - refactor majeur
   - nouvelle feature majeure
7. Commit/push/PR uniquement sur demande explicite.

## Traçabilité minimale
- Laisser une trace si: décision, erreur trouvée, warning, ambiguïté bloquante, changement important.
- Éviter les doublons de trace: une source principale + renvoi court.

## Convention de commit
`[NomAgent] [NomProjet] : Description courte et claire`

Exemple:
`[Agent IDE] [Systema-Agency] : Corrige incohérences règles AGENT`

Mis à jour: 2026-03-17