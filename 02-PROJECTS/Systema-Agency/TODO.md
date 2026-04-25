# TODO - Systema-Agency

## En cours
- [ ] Étape 2 — Page principale : ajouter les 5 boutons stylisés à droite (Syncer Gmail, Générer mes tâches, Prompts, Suivis, Supplément). Routes branchées pour Prompts/Suivis, placeholders « À venir » pour les 3 autres.

## À faire
- [ ] Étape 3+ — Implémenter Syncer Gmail (intégration Gmail API)
- [ ] Étape 3+ — Implémenter Générer mes tâches (génération IA de tâches)
- [ ] Étape 3+ — Implémenter Supplément (suivi de prises, lié ou séparé de Suivi médicament à clarifier)
- [ ] Réparer `node_modules` local (procédure dans `Code/DEV-SETUP.md`) pour permettre `pnpm dev` local et tests avant deploy
- [ ] Créer `.env` local à partir de `.env.example` (DATABASE_URL Neon + JWT_SECRET + OWNER_EMAIL/PASSWORD — voir SECRETS dans Assets)

## Terminé
- [x] Refonte de l'architecture du layout (Header sticky glassmorphism).
- [x] Déplacement de la navigation dans le header.
- [x] Alignement structurel local complet (RESSOURCES, Livrables).
- [x] Analyse et comparaison avec le dépôt GitHub (Local > GitHub).
- [x] Audit et vérification de la cohérence des instructions (Anima/Agency/Standard SCC).
- [x] Synchronisation complète du SCC local vers GitHub (2026-04-19).
- [x] Mise en place de la protection des secrets sur GitHub via `.gitignore`.
- [x] Restructuration IPARA (01-05).
