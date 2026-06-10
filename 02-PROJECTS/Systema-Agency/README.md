# Systema-Agency
> Vision et cadrage du projet. ⚠️ LECTURE SEULE — ne pas modifier sans validation.

---
## Vision
Dashboard personnel « OS de vie » pensé pour un cerveau ADHD.

Fonctionnalités actives :
- **Cosmos** — page d'accueil `/` : météo cosmique & biologique (cartes réelles)
- **Prompt Vault** — bibliothèque de prompts IA (`/prompt-vault`)
- **Agenda** — hebdomadaire (`/agenda`)
- **Notes volantes** — (`/notes`)
- **Onglets custom + Tableau blanc** — (`/tab/:tabId`)

Interface glassmorphism, minimaliste, orientée utilité réelle. Pas de RPG, pas d'avatar.

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
Systema-Agency/            (Drive = docs ; le CODE vit dans le clone Git)
├── README.md              # Vision et cadrage (LECTURE SEULE)
├── TODO.md                # Prochaines actions
├── NOTES.md               # Décisions ouvertes, repères actifs
├── WORKLOG.md             # Journal de bord session par session
├── NOTES_DE_PAULINE.md    # Demandes de Pauline (prioritaire)
├── BRIEF_IA.md            # Brief collé en début de session LLM
├── STACK.md               # Carte du stack technique
├── Assets/                # Secrets, assets, médias
├── RESSOURCES/            # Documentation technique et plans agents
├── Livrables/             # Documents finaux et exports
├── AUDIT/                 # Carnets d'audit (juin 2026) + liste maître des corrections
└── Archives/              # (clone/GitHub) Pages supprimées et code archivé
```
> Code source : `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency\Code` (clone Git, déploie sur Vercel). Plus de copie `Code/` dans le Drive depuis 2026-06-09.
