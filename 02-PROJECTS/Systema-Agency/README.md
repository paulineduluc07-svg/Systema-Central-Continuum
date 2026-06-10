# Systema-Agency
> Vision et cadrage du projet. ⚠️ LECTURE SEULE — ne pas modifier sans validation.
> (Dernière mise à jour validée par Pauline : 2026-06-10, clôture de l'audit juin 2026.)

---
## Vision
Dashboard personnel « OS de vie » pensé pour un cerveau ADHD.

Fonctionnalités actives :
- **Cosmos** — page d'accueil `/` : météo cosmique & biologique (9 cartes réelles)
- **Prompt Vault** — bibliothèque de prompts IA (`/prompt-vault`)
- **Agenda** — hebdomadaire (`/agenda`)
- **Notes volantes** — (`/notes`)
- **Onglets custom + Tableau blanc** — (`/tab/:tabId`)

Interface glassmorphism, minimaliste, orientée utilité réelle. Pas de RPG, pas d'avatar.

## Statut
Production déployée et stable — `systema-agency.vercel.app`
CI GitHub Actions (« CI Systema ») : `check + test + build` automatiques à chaque push sur `main`.

## Stack technique
- TypeScript + React 19 + Vite + Tailwind v4 + shadcn/ui
- tRPC + Drizzle ORM + Neon PostgreSQL
- Auth : email/password auto-contenu (OWNER_EMAIL + OWNER_PASSWORD, crypto Node.js natif)
- Session : cookie JWT via `jose`
- Deploy : Vercel (auto au push sur `main`)
- BD : pas de migrations automatiques — `drizzle/schema.ts` = source de vérité, changements en SQL manuel volontaire

## Règles de base
- **Docs = Drive, code = clone.** Le code source vit uniquement dans
  `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency\Code` (clone Git → Vercel).
- **Les carnets (TODO/NOTES/WORKLOG) sont gérés par l'agent dév**, Pauline ne les édite pas ;
  l'agent les propage Drive → clone à chaque session (le MCP les lit depuis GitHub).
- **Le canal Pauline ↔ agent est conversationnel** (Claude + mémoire Airtable) — pas de
  fichiers de notes intermédiaires.
- Rien n'est poussé sur GitHub sans le feu vert de Pauline ; `pnpm verify:full` avant tout push.

## Structure
```text
Systema-Agency/            (Drive = docs ; le CODE vit dans le clone Git)
├── README.md              # Vision, cadrage et règles de base (LECTURE SEULE)
├── TODO.md                # Prochaines actions          ┐
├── NOTES.md               # Décisions, repères actifs   ├─ gérés par l'agent dév
├── WORKLOG.md             # Journal session par session ┘
├── POUR PAW/              # Docs d'étude perso de Pauline (STACK.md, CARNET-REACT.md) — Drive only
├── Assets/                # Secrets (jamais commités), assets, médias
├── RESSOURCES/            # Documentation technique et plans agents
├── Livrables/             # Documents finaux et exports
├── AUDIT/                 # Carnets d'audit (juin 2026) + liste maître des corrections
└── Archives/              # (clone/GitHub) Pages supprimées et code archivé
```
