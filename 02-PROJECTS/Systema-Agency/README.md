# Systema-Agency

## Rôle du dossier
Ce dossier regroupe les éléments de travail liés à `Systema-Agency`.

⚠️ FICHIER EN LECTURE SEULE

INTERDICTION ABSOLUE de modifier, supprimer, ajouter, reformater, renommer ou remplacer ce fichier.


Il sert à :
- cadrer le projet
- centraliser sa documentation
- conserver ses assets, son code et ses livrables
- éviter que les informations du projet soient dispersées

## Vision
Dashboard personnel
Onglet actif a ce jour:
- **Prompt Vault** — bibliothèque de prompts IA 
- **Suivi médicament** — suivi de prises avec sync DB
- **IA kim**


Interface glassmorphism, minimaliste, orientée utilité réelle. Pas de RPG, pas de tarot, pas d'avatar.

## Statut
Production déployée et stable — `systema-agency.vercel.app`

## Stack technique
- TypeScript + React 19 + Vite + Tailwind v4 + shadcn/ui
- tRPC + Drizzle ORM + Neon PostgreSQL
- Auth : email/password auto-contenu (OWNER_EMAIL + OWNER_PASSWORD, crypto Node.js natif)
- Session : cookie JWT via `jose`
- Deploy : Vercel

## Structure
```text
Systema-Agency/
├── README.md           # Cadrage et vision
├── TODO.md             # Suivi des tâches
├── NOTES.md            # Notes et décisions
├── NOTES_DE_PAULINE.md # Instructions de Pauline
├── WORKLOG.md          # Historique des sessions
├── Assets/             # Assets, secrets et médias
├── Code/               # Code source de l'application
├── RESSOURCES/         # Documentation technique et ressources
└── Livrables/          # Documents finaux et exports
```
