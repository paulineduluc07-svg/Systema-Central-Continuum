# AGENT-INSTRUCTIONS -- Systema Agency

Lire avant toute intervention sur ce projet.
Regles generales : voir `../../AGENTS.md`
Ce fichier ajoute uniquement le contexte et les consignes specifiques a ce projet.

## Contexte du projet
**Systema Agency** -- Dashboard de vie personnel organise par domaines.
Stack : TypeScript + React 19 + Vite + Tailwind v4 + shadcn/ui + tRPC + Drizzle ORM + Neon PostgreSQL + Vercel.
Code actif : `Projects/Systema-Agency/Code/`.
Deploye : `systema-agency.vercel.app`

## Vision produit (2026-03-20)
Dashboard minimaliste organise en 6 onglets fixes :
- **Sante** : notes + raccourci vers Suivi medicament (/suivi)
- **Finance** : notes
- **Carriere** : notes
- **Etude** : notes
- **Maison** : notes
- **Ressources IA** : redirection vers Prompt Vault (/prompt-vault)

Interface sobre et fonctionnelle. Pas de gamification, pas de RPG, pas d'elements tarot.
Le module Kim (compagnon IA) est un projet separe dans `Projects/Kim-Agentic-Companion/` -- ne pas l'integrer ici pour le moment.

## Architecture technique actuelle

### Frontend (`client/src/`)
```
pages/
  Home.tsx        -- dashboard principal (onglets + notes par onglet)
  Suivi.tsx       -- suivi medicament (page complete, route /suivi)
  PromptVault.tsx -- bibliotheque prompts IA (route /prompt-vault)
  NotFound.tsx
components/
  AdminPanel.tsx, DashboardLayout.tsx, EditableText.tsx
  ErrorBoundary.tsx, ExportDialog.tsx, PasswordGate.tsx
  widgets/
    NotesWidget.tsx, StickyNote.tsx
  ui/ (shadcn components)
hooks/
  useSyncedData.ts    -- sync notes/tasks/prefs (DB si auth, localStorage sinon)
  useDataMigration.ts -- migration localStorage -> DB
  usePersistedState.ts, useMobile.tsx, usePersistFn.ts
contexts/
  ConfigContext.tsx, ThemeContext.tsx
_core/hooks/
  useAuth.ts
```

### Backend (`server/`)
```
routers.ts   -- API tRPC : auth, tasks, notes, preferences, migration, customTabs, canvas
db.ts        -- couche Drizzle ORM
_core/       -- trpc, context, oauth, cookies, env, sdk, rateLimit, llm...
```

### Schema DB (Neon PostgreSQL, via Drizzle)
Tables : `users`, `tasks`, `notes`, `user_preferences`, `custom_tabs`, `canvas_data`

### Deploiement Vercel
- Build : `pnpm run build:client` (frontend seulement)
- Routes API : `api/oauth/`, `api/trpc/` (Vercel Functions)
- Rewrites : tout vers `/index.html` sauf `/api/*`

## Etat actuel (2026-03-20)
- [x] Migration GitHub -> SCC validee
- [x] Refonte architecture frontend complete (session 2026-03-20)
  - Suppression : Drawn by Fate, VisionBoard, LifeCommandChat, Map, Whiteboard, GameTabs, widgets RPG
  - Nouveau Home.tsx : 6 onglets fixes, sticky notes syncees par onglet
  - App.tsx nettoye, routers.ts allege (tarot + ai retires)
- [ ] Auth a finaliser (VITE_OAUTH_PORTAL_URL non configure en prod)
- [ ] Suivi medicament : sync DB a implementer (actuellement localStorage)
- [ ] .env.example incomplet (variables manquantes)
- [ ] Suppression definitive ancien repo decidee

## Problemes connus
| Probleme | Fichier | Priorite |
|---|---|---|
| VITE_OAUTH_PORTAL_URL non configure Vercel | Variables Vercel | Haute (bloque sync) |
| Suivi.tsx utilise localStorage uniquement | pages/Suivi.tsx | Haute |
| .env.example incomplet | .env.example | Moyenne |
| Foreign keys absentes en DB | drizzle/schema.ts | Basse |

## Consignes specifiques
- Ne pas reimplanter de Drawn by Fate, tarot, RPG, ou LifeCommandChat.
- Ne pas toucher au projet Kim (`Projects/Kim-Agentic-Companion/`).
- La sync des donnees entre appareils passe par l'auth OAuth -- ne pas contourner.
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

*Mis a jour : 2026-03-20 | Claude (session refonte) -- Systema Central Continuum*
