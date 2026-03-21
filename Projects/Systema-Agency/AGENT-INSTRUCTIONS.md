# AGENT-INSTRUCTIONS -- Systema Agency

Lire avant toute intervention sur ce projet.
Regles generales : voir `../../AGENTS.md`
Ce fichier ajoute uniquement le contexte et les consignes specifiques a ce projet.

## Contexte du projet
**Systema Agency** -- Dashboard de vie personnel organise par domaines.
Stack : TypeScript + React 19 + Vite + Tailwind v4 + shadcn/ui + tRPC + Drizzle ORM + Neon PostgreSQL + Vercel.
Code actif : `Projects/Systema-Agency/Code/`.
Deploye : `systema-agency.vercel.app`

## Vision produit
Dashboard minimaliste organise en 6 onglets fixes :
- **Sante** : notes + raccourci vers Suivi medicament (/suivi)
- **Finance** : notes
- **Carriere** : notes
- **Etude** : notes
- **Maison** : notes
- **Ressources IA** : redirection vers Prompt Vault (/prompt-vault)

Interface sobre et fonctionnelle. Pas de gamification, pas de RPG, pas d'elements tarot.
Le module Kim (compagnon IA) est un projet separe dans `Projects/Kim-Agentic-Companion/` -- ne pas l'integrer ici.

## Systeme d'auth
Auth email/password auto-contenu. Aucun OAuth, aucun tiers.
- `sdk.verifyCredentials(email, password)` : comparaison HMAC timing-safe (crypto Node.js natif)
- Variables requises : OWNER_EMAIL, OWNER_PASSWORD, JWT_SECRET
- Session : cookie JWT via `jose`
- Fichiers cles : `server/_core/sdk.ts`, `server/_core/env.ts`

## Architecture technique actuelle

### Frontend (`client/src/`)
```
pages/
  Home.tsx        -- dashboard principal (6 onglets + notes par onglet + LoginModal)
  Suivi.tsx       -- suivi medicament (tRPC si auth, localStorage fallback sinon)
  PromptVault.tsx -- bibliotheque prompts IA
  NotFound.tsx
hooks/
  useSyncedData.ts    -- sync notes/tasks/prefs (DB si auth, localStorage sinon)
  useDataMigration.ts -- migration localStorage -> DB
  usePersistedState.ts
_core/hooks/
  useAuth.ts          -- login(email, password), logout, isAuthenticated
```

### Backend (`server/`)
```
routers.ts   -- API tRPC : auth, tasks, notes, preferences, migration, customTabs, canvas, suivi
db.ts        -- couche Drizzle ORM
_core/       -- trpc, context, cookies, env, sdk, rateLimit
```

### Schema DB (Neon PostgreSQL, via Drizzle)
Tables actives : `users`, `tasks`, `notes`, `user_preferences`, `custom_tabs`, `canvas_data`, `suivi_entries`

Schema suivi_entries :
- id (serial PK), userId (int), timestamp (timestamp), date (varchar 10)
- prise (varchar 5), dose (int), reasons (text JSON array), note (text)

### tRPC suivi.*
- `suivi.list` : retourne toutes les entrees de l'utilisateur connecte (timestamp converti en ISO string)
- `suivi.add` : ajoute une entree
- `suivi.replace` : remplace toutes les entrees (utilise pour import JSON)

### Deploiement Vercel
- Build : `pnpm run build:client`
- Routes API : `api/trpc/` (Vercel Functions)
- Variables d'env requises : DATABASE_URL, JWT_SECRET, OWNER_EMAIL, OWNER_PASSWORD

## Etat actuel (2026-03-21)
- [x] Migration GitHub -> SCC validee
- [x] Refonte architecture frontend (2026-03-20) : suppression RPG/Tarot/LifeCommand
- [x] Nouveau Home.tsx : 6 onglets fixes + sticky notes syncees
- [x] Auth email/password (2026-03-20) : remplace OAuth Manus, zero nouvelle dependance
- [x] Suivi medicament sync DB (2026-03-21) : tRPC + localStorage fallback
- [ ] **Variables Vercel a configurer** (DATABASE_URL, JWT_SECRET, OWNER_EMAIL, OWNER_PASSWORD)
- [ ] **Migration SQL a appliquer** dans Neon : `drizzle/0001_suivi_entries.sql`
  - Option A : `pnpm drizzle-kit push` (necessite .env local avec DATABASE_URL)
  - Option B : coller le SQL dans Neon SQL Editor
- [ ] Deployer sur Vercel apres les 2 etapes ci-dessus
- [ ] Completer .env.example (ajouter OWNER_EMAIL, OWNER_PASSWORD ; retirer variables Manus)
- [ ] Nettoyer les fichiers server inutilises : oauth.ts, llm.ts, imageGeneration.ts, voiceTranscription.ts, map.ts, dataApi.ts, notification.ts
- [ ] Ajouter foreign keys dans schema Drizzle

## Problemes connus
| Probleme | Action requise | Qui |
|---|---|---|
| Variables Vercel non configurees | Vercel > Settings > Env Vars | Proprietaire |
| Migration suivi_entries non appliquee | pnpm drizzle-kit push OU Neon SQL Editor | Proprietaire |
| .env.example obsolete | Mettre a jour le fichier | Agent |
| Fichiers server inutilises | Verifier et supprimer | Agent |
| Foreign keys absentes | Ajouter dans schema.ts | Agent |

## Consignes specifiques
- Ne pas reimplanter de Drawn by Fate, tarot, RPG, ou LifeCommandChat.
- Ne pas toucher au projet Kim (`Projects/Kim-Agentic-Companion/`).
- Ne pas ajouter de dependances npm sans justification explicite.
- Respecter la convention de commit : `[NomAgent] [Systema-Agency] : Description courte`
- Toute decision importante -> trace dans `Notes/Systema Agency.md`

## Ce dossier contient
- Notes/ -- decisions d'architecture, contexte operationnel
- Notes-Perso/ -- strictement interdit aux agents
- Prompts/ -- prompts IA specifiques au projet
- Assets/ -- references visuelles
- Livrables/ -- exports finaux
- Todo.md -- taches actives
- Roadmap.md -- vision et etapes

*Mis a jour : 2026-03-21 | Claude (session sync DB) -- Systema Central Continuum*
