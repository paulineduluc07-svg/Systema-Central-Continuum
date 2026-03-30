Type : #context
Subject : #business
Status : #inprogress
Date : 2026-03-21

# PROJET -- Systema Agency

## Ligne d'arrivee
Dashboard de vie personnel, sobre et fonctionnel, synchronise entre appareils.

## C'est quoi
Application web organisee autour de 3 entrees fixes (Prompt Vault, Suivi medicament, Tableau blanc).
Tableau blanc = sticky notes syncees. Suivi = prise medicament. Prompt Vault = bibliotheque IA pleine page.
Pas de RPG, pas d'avatar, pas de tarot. Interface minimaliste orientee utilite reelle.

## Infos techniques
- Stack : React 19 + Tailwind v4 + shadcn/ui + tRPC + Drizzle ORM + Neon PostgreSQL + Vercel
- Code : `Projects/Systema-Agency/Code/`
- Live : `https://systema-agency.vercel.app`
- Auth : email/password via crypto Node.js natif (OWNER_EMAIL + OWNER_PASSWORD en variables d'env)
- Sync : localStorage si non connecte, Neon PostgreSQL si connecte

## Architecture frontend actuelle
```
pages/
  Home.tsx        -- 3 onglets (Prompt Vault, Suivi, Tableau blanc)
  Suivi.tsx       -- suivi medicament (DB si auth, localStorage sinon)
  PromptVault.tsx -- bibliotheque prompts (statique)
hooks/
  useSyncedData.ts -- gere notes/tasks/prefs : DB si auth, localStorage sinon
```

## Schema DB (Neon PostgreSQL)
Tables actives : users, tasks, notes, user_preferences, custom_tabs, canvas_data, suivi_entries

## Ce qui reste a faire avant que tout fonctionne en prod
1. Configurer les variables Vercel (Vercel > Project Settings > Environment Variables) :
   - DATABASE_URL  (deja la normalement)
   - JWT_SECRET    (openssl rand -hex 32)
   - OWNER_EMAIL   (ton email)
   - OWNER_PASSWORD (mot de passe choisi)
2. Appliquer la migration SQL dans Neon (table suivi_entries) :
   - Soit via `pnpm drizzle-kit push` (necessite DATABASE_URL local dans .env)
   - Soit via Neon SQL Editor : copier le contenu de drizzle/0001_suivi_entries.sql
3. Deployer sur Vercel

## Ce qui a ete supprime (ne pas reimplanter)
- Drawn by Fate / Tarot (toutes les pages et composants)
- VisionBoard, DraggableGrid, DraggableWidget
- LifeCommandChat (le module chat IA s'appellera Kim, c'est un projet separe)
- Map, Whiteboard, GameTabs, ManusDialog, QuickActions
- Widgets RPG : Avatar, Calendar, StatsGraph
- Hooks : useLifeCommandItems, useSpeechToText, useInfiniteCanvas
- Doublons : components/PromptVault.tsx, components/prompt-vault.jsx
- Routers backend : tarot, ai (LifeCommand)
- Auth Manus OAuth (remplace par email/password auto-contenu)

## Kim et Systema Agency
Kim est un projet separe (`Projects/Kim-Agentic-Companion/`), en cours de construction.
Ne pas toucher Kim. Ne pas l'integrer dans Systema Agency avant que son MVP soit stable.
Quand Kim sera pret, l'integration dans Systema Agency sera une decision consciente et explicite.

## Notes de session
[2026-03-08] Transfert complet depuis backup SCC.
[2026-03-17] Validation import GitHub -> SCC.
[2026-03-18] Audit documentaire SCC : remise a niveau du contexte et des priorites.
[2026-03-19] Vague 1 securite : retrait fallback mot de passe, retrait gate global, protection endpoints ai, rate-limit /api.
[2026-03-20] Audit complet du projet. Decision de refonte : retirer tout ce qui est RPG/Tarot/LifeCommand.
[2026-03-20] Refonte frontend executee :
  - 31 fichiers supprimes (drawn-by-fate, vision-board, widgets RPG, hooks inutilises, doublons)
  - Nouveau Home.tsx : 6 onglets fixes + sticky notes syncees par onglet
  - App.tsx nettoye, server/routers.ts allege
  - Documentation SCC mise a jour : AGENT-INSTRUCTIONS, Todo, Roadmap, Notes
[2026-03-20] Auth OAuth Manus remplacee par auth email/password :
  - Probleme : VITE_OAUTH_PORTAL_URL inaccessible hors plateforme Manus
  - Solution : verifyCredentials() HMAC + timingSafeEqual (crypto Node.js, zero dependance)
  - Fichiers modifies : sdk.ts, env.ts, routers.ts, useAuth.ts, Home.tsx, const.ts, api/oauth/callback.ts
[2026-03-21] Sync DB suivi medicament implementee :
  - drizzle/schema.ts : ajout table suivi_entries (id, userId, timestamp, date, prise, dose, reasons JSON, note)
  - drizzle/0001_suivi_entries.sql : migration SQL (a appliquer dans Neon)
  - server/db.ts : fonctions getSuiviEntriesByUser, createSuiviEntry, replaceSuiviEntries
  - server/routers.ts : router tRPC suivi.list / suivi.add / suivi.replace (protectedProcedure)
  - client/src/pages/Suivi.tsx : sync tRPC si authentifiee, localStorage fallback sinon
  - Comportement : au login, donnees DB remplacent localStorage ; chaque prise = envoyee en DB + localStorage
  - En attente : appliquer la migration SQL + configurer variables Vercel + deployer
[2026-03-30] Simplification UX + methode de travail:
  - Home reduit a 3 onglets: Prompt Vault, Suivi medicament, Tableau blanc
  - Prompt Vault passe en pleine page avec style plus sobre
  - Bug build getLoginUrl corrige
  - Processus d'execution en taches mis en place: WORKFLOW.md + SESSION-LOG.md
  - Scripts de validation ajoutes: pnpm verify:step, pnpm verify:full
  - Etat qualite: pnpm test OK, pnpm build OK, pnpm check KO (dette historique documentee)
[2026-03-30] Stabilisation typecheck (T001):
  - `pnpm check` repasse au vert
  - Ajouts compatibilite: `useComposition.ts` (hook), `AIChatBox.tsx` (composant demo pour ComponentShowcase)
  - `env.ts` complete pour les cles `forge*` et `openai*`
  - `oauth.ts` neutralise (redirect simple), `rateLimit.ts` ajuste, `vite.config.ts` corrige
  - Verification finale: `pnpm verify:full` OK
[2026-03-30] Alignement environnement (T002):
  - `.env.example` mis a jour pour correspondre aux variables reelles du code
  - variables OAuth obsoletes retirees (`OAUTH_SERVER_URL`, `OWNER_OPEN_ID`)
  - ajout variables auth actuelles (`OWNER_EMAIL`, `OWNER_PASSWORD`, `VITE_LOGIN_URL`)
  - ajout variables analytics (`VITE_ANALYTICS_ENDPOINT`, `VITE_ANALYTICS_WEBSITE_ID`)
  - verification: `pnpm check` OK, `pnpm verify:step` OK

*Mis a jour : 2026-03-30 | Codex (workflow, simplification UX, stabilisation typecheck, env alignment) -- Systema Central Continuum*
