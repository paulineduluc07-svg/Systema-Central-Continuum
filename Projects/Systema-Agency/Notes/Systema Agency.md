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

## Etat production (2026-03-31)
1. Variables runtime configurees sur Vercel (`DATABASE_URL`, `JWT_SECRET`, `OWNER_EMAIL`, `OWNER_PASSWORD`).
2. Migration SQL Neon appliquee (`drizzle/0001_suivi_entries.sql` via Drizzle migrate).
3. Deploiement production valide (`systema-agency.vercel.app` + alias custom actif).

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
[2026-03-30] Politique cookie dev/prod (T003):
  - `getSessionCookieOptions()` passe en mode securise par defaut: `SameSite=Lax`
  - mode cross-site explicite via `COOKIE_CROSS_SITE=true` -> `SameSite=None` seulement sur HTTPS
  - `secure` reste derive du protocole effectif (`https` ou `x-forwarded-proto`)
  - tests logout enrichis pour couvrir les 2 modes
  - verification: `pnpm check` OK, `pnpm verify:step` OK
[2026-03-30] Transaction `suivi.replace` (T004):
  - `replaceSuiviEntries` passe en execution transactionnelle (`db.transaction`)
  - suppression + reinsertion des entrees dans une meme unite atomique
  - reduction du risque de perte de donnees en cas d'echec intermediaire
  - verification: `pnpm check` OK, `pnpm verify:step` OK
[2026-03-30] CI Pull Request (T005):
  - ajout workflow `ci-pr.yml` dans `Code/.github/workflows/`
  - declenchement sur pull_request vers `main`
  - gates automatiques: `pnpm check`, `pnpm test`, `pnpm build`
  - objectif: bloquer les regressions de compilation/tests avant merge
  - verification locale: `pnpm check` OK, `pnpm verify:step` OK
[2026-03-30] Reprise production (T006):
  - projet local relie a Vercel (`systema-agency`) pour execution CLI end-to-end
  - deploiement production relance via `vercel deploy --prod -y` (deployment `Ready`, alias actif)
  - verification locale complete: `pnpm check` OK, `pnpm test` OK, `pnpm build` OK
  - tentative migration Neon via Drizzle echouee: `28P01` (password authentication failed)
  - observation env Vercel: `OWNER_EMAIL` et `OWNER_PASSWORD` manquants; `DATABASE_URL` actuelle mal formee et non exploitable
  - decision: ne pas injecter de credentials fictifs en production; attendre les vraies valeurs owner + une URL Neon valide
  - hygiene: suppression locale des `.env.vercel*` et ajout `.env.vercel*` au `.gitignore`
[2026-03-31] Cloture T006:
  - `DATABASE_URL` Vercel corrigee et credentials owner ajoutes en runtime (`development` + `production`)
  - migration Neon executee avec succes via `pnpm drizzle-kit migrate`
  - validation locale complete: `pnpm check`, `pnpm test`, `pnpm build` OK
  - deploiement production relance et verifie `Ready` via `vercel inspect`
  - decision: conserver `.env.vercel*` ignore et ne jamais versionner les extractions d'env
[2026-03-31] T007 README onboarding:
  - `Code/README.md` passe de version legacy (MySQL/OAuth/widgets obsoletes) a version operationnelle actuelle
  - stack documentee: React 19 + Vite + tRPC + Drizzle + Neon + Vercel
  - auth documentee: email/password proprietaire + JWT cookie (plus aucun OAuth)
  - onboarding simplifie: prerequis, variables `.env`, commandes qualite, migration DB, deploy prod
  - decision: utiliser `Code/README.md` comme point d'entree unique pour les nouveaux handoffs techniques
[2026-03-31] T008 nettoyage server legacy:
  - suppression des branchements restants: `registerOAuthRoutes` retire de `server/_core/index.ts`, `systemRouter` retire de `server/routers.ts`
  - suppression des modules legacy: `oauth.ts`, `llm.ts`, `imageGeneration.ts`, `voiceTranscription.ts`, `map.ts`, `dataApi.ts`, `notification.ts`
  - suppression `server/_core/systemRouter.ts` devenu orphelin apres retrait de `notification`
  - verification complete executee: `pnpm check` OK, `pnpm test` OK, `pnpm build` OK
  - decision: garder l'endpoint de compatibilite `api/oauth/callback.ts` (redirect `/`) pour ne pas casser d'eventuels anciens liens externes
[2026-03-31] T009 foreign keys Drizzle:
  - `drizzle/schema.ts` enrichi avec FK explicites vers `users.id` sur toutes les tables metiers liees au `userId`
  - choix de suppression: `onDelete: "cascade"` pour eviter les orphelins en cas de purge utilisateur
  - migration versionnee ajoutee: `drizzle/0002_add_user_foreign_keys.sql`
  - migration ecrite de facon idempotente (`DO $$` + `IF NOT EXISTS`) pour faciliter les environnements deja partiellement modifies
  - verification complete executee: `pnpm check` OK, `pnpm test` OK, `pnpm build` OK
[2026-03-31] T010 application migration FK en production:
  - migration Neon appliquee via `pnpm drizzle-kit migrate` (inclut `0002_add_user_foreign_keys.sql`)
  - validation prod executee: `vercel inspect` retourne `Ready` + `https://systema-agency.vercel.app` repond en HTTP 200
  - hygiene securite: fichier temporaire `.env.migrate` supprime immediatement apres usage
  - decision: conserver un flux court "pull env temporaire -> migrate -> suppression fichier" pour les futures migrations prod
[2026-03-31] T011 nettoyage ENV serveur:
  - `env.ts` aligne sur les usages reels (suppression des champs `forge/openai` non consommes)
  - suppression `server/storage.ts` (reste template non utilise depuis le cleanup legacy)
  - `.env.example` simplifie avec retrait complet de la section `Legacy integrations`
  - verification complete executee: `pnpm check` OK, `pnpm test` OK, `pnpm build` OK
  - decision: phase 2 "stabilisation technique" consideree complete cote backend
[2026-03-31] T012 analytics build-safe:
  - retrait du script analytics statique dans `client/index.html` pour eviter les placeholders Vite non resolus
  - ajout d'une injection dynamique Umami dans `client/src/main.tsx` (activee uniquement si `VITE_ANALYTICS_ENDPOINT` + `VITE_ANALYTICS_WEBSITE_ID`)
  - decision: l'analytics devient strictement optionnel sans bruit de build ni impact si non configure
  - verification complete executee: `pnpm check` OK, `pnpm test` OK, `pnpm build` OK
[2026-03-31] T013 reduction bundle frontend:
  - routing passe en lazy loading dans `client/src/App.tsx` (`Home`, `Suivi`, `PromptVault`)
  - le chunk principal frontend passe a ~418 kB (avant ~639 kB), avec generation de chunks routes dedies
  - warning build "Some chunks are larger than 500 kB" supprime
  - verification complete executee: `pnpm check` OK, `pnpm test` OK, `pnpm build` OK
  - decision: conserver le split route-level comme baseline perf pour les prochaines features
[2026-03-31] T014 smoke e2e backend:
  - ajout `server/smoke.e2e.test.ts` pour valider un parcours bout-en-bout critique (`login -> notes -> suivi`)
  - mocks etatful db/sdk pour verifier le chainage tRPC sans reseau externe
  - verification complete executee: `pnpm check` OK, `pnpm test` OK, `pnpm build` OK
  - decision: garder ce smoke test comme garde-fou de non-regression fonctionnelle rapide
[2026-03-31] T015 observabilite frontend:
  - nouveau module `client/src/lib/observability.ts` (capture globale + dedupe + reporting)
  - integration dans `main.tsx` pour erreurs tRPC + hooks globaux `window.error` / `unhandledrejection`
  - `ErrorBoundary` enrichi avec `componentDidCatch` et reporting structure
  - alerting minimal ajoute: toast utilisateur unique sur erreur runtime
  - variable optionnelle ajoutee: `VITE_ERROR_LOG_ENDPOINT`
  - verification complete executee: `pnpm check` OK, `pnpm test` OK, `pnpm build` OK
  - decision: garder un pipeline observability lean (sans backend dedie pour le moment, endpoint externe optionnel)
[2026-03-31] T016 fallback UX lazy pages:
  - `App.tsx` passe de `Suspense fallback=null` a un fallback visuel (spinner + message)
  - objectif: eviter les blancs de transition lors du chargement des routes en lazy
  - verification complete executee: `pnpm check` OK, `pnpm test` OK, `pnpm build` OK
  - decision: conserver ce fallback comme standard UX tant que les routes restent code-split
[2026-03-31] T017 design final Home:
  - refonte complete de `Home.tsx` pour coller a la reference visuelle (glassmorphism rose/marbre, glow, structure en 3 colonnes)
  - maintien des fonctions metier: login/logout, sync cloud, taches/notes reliees aux hooks synchronises, liens vers Prompt Vault et Suivi
  - ajout horloge temps reel + calendrier mensuel integres dans la nouvelle composition
  - verification complete executee: `pnpm check` OK, `pnpm test` OK, `pnpm build` OK
  - decision: cette version devient la base du design final dashboard
[2026-03-31] T018 persistance + synchronisation complete:
  - backend Prompt Vault ajoute (`prompt_vault_data` + routeur tRPC `promptVault.get/save`) avec migration SQL `0003_prompt_vault_data.sql`
  - `PromptVault.tsx` passe en persistance hybride:
    - backup localStorage permanent (`prompt_vault_state_v1`)
    - hydratation cloud au login
    - bootstrap local -> cloud si compte sans donnees cloud
  - `Home.tsx` reactive `useDataMigration()` pour importer taches/notes/preferences locales vers le cloud au premier login
  - `Suivi.tsx` durci:
    - cloud vide au login => import auto des entrees locales vers DB
    - restauration JSON en mode connecte => push cloud immediat
  - verification complete executee: `pnpm check` OK, `pnpm verify:step` OK
  - decision: la source de verite utilisateur devient cloud-first avec fallback local resilient, sans perte de donnees offline au premier login
[2026-03-31] T019 migration prod Prompt Vault:
  - migration Neon executee via `pnpm drizzle-kit migrate` (applique `drizzle/0003_prompt_vault_data.sql`)
  - verification prod executee: `vercel inspect` = `Ready`, `https://systema-agency.vercel.app` = HTTP `200`
  - hygiene secrets maintenue: fichier temporaire `.env.migrate` supprime apres execution
  - verification qualite complete executee: `pnpm check` OK, `pnpm verify:step` OK
  - decision: le flux standard de migration prod reste "pull env temporaire -> migrate -> suppression fichier -> check prod"
[2026-03-31] T020 durcissement Prompt Vault:
  - validation snapshot robuste pour la persistence (`PromptVault.tsx`)
  - les snapshots avec `list: []` restent valides (plus de retour force sur la base `DATA`)
  - categories dedupees/normalisees + fallback categorie valide pour eviter les incoherences
  - favoris nettoyes (suppression IDs obsoletes) + deduplication
  - tags assainis au restore (trim + suppression vides)
  - verification qualite complete executee: `pnpm check` OK, `pnpm verify:step` OK
  - decision: conserver une strategie de restauration permissive et defensive pour ne jamais perdre les etats utilisateur edge-case
[2026-03-31] T021 e2e UI Playwright:
  - ajout du runner Playwright (`@playwright/test`) + config `Code/playwright.config.ts` (Chromium, webServer Vite local)
  - ajout du script `pnpm test:e2e`
  - nouveau scenario `Code/e2e/app-flow.spec.ts` couvrant:
    - login UI
    - Prompt Vault CRUD (create/update/delete)
    - verification sync cloud Prompt Vault (mock tRPC stateful)
    - Suivi import JSON + verification sync cloud (`suivi.replace` mocke)
  - hygiene test: ajout des ignores `playwright-report/` et `test-results/`
  - verification complete executee: `pnpm test:e2e` OK, `pnpm check` OK, `pnpm verify:step` OK
  - decision: conserver ce test comme garde-fou UI critical-path independant de l'infrastructure backend
[2026-03-31] T022 hardening backend sync:
  - priorite retenue: hardening backend (et non export/import global ni indicateur sync UI)
  - contrainte retenue: code d'abord, sans operation production
  - `server/routers.ts` durci:
    - `promptVault.save`: JSON valide obligatoire + limite taille payload
    - `suivi.add` / `suivi.replace`: validation stricte datetime/date/heure + limites de champs
    - limite du volume `suivi.replace` pour eviter les imports massifs abusifs
  - couverture tests etendue:
    - `promptVault.test.ts`: rejet JSON invalide + payload trop volumineux
    - `suivi.test.ts`: nouveau fichier de tests de validation backend suivi
    - `smoke.e2e.test.ts`: alignement du format `prise` avec le contrat `HH:mm`
  - verification complete executee: `pnpm verify:step` OK, `pnpm check` OK
  - decision: prochaine priorite candidate cote UX = indicateur de synchronisation global (T023)
[2026-03-31] T023 indicateur sync global:
  - priorite retenue: visibilite UX de la synchronisation globale
  - contrainte retenue: code d'abord, sans operation prod
  - ajout du hook `useGlobalSyncStatus`:
    - derive les etats `local`, `syncing`, `synced`, `error`
    - lit l'activite et l'historique recent depuis le cache React Query
    - expose un detail temporel (derniere sync / dernier echec)
  - ajout du composant `GlobalSyncIndicator`:
    - pill flottant global avec feedback visuel selon statut
    - visible sur toutes les routes via integration dans `App.tsx`
  - verification complete executee: `pnpm verify:step` OK, `pnpm check` OK
  - decision: prochaine priorite candidate cote robustesse data = export/import global unifie (T024)
[2026-03-31] T024 export/import global unifie:
  - backend `backup` ajoute dans `routers.ts`:
    - `backup.export`: sortie unique taches + notes + suivi + prompt vault
    - `backup.import`: restauration unique avec validation stricte
  - couche DB enrichie:
    - `replaceTasksByUser` et `replaceNotesByUser` (replace atomique)
    - `deletePromptVaultData` pour restaurer un snapshot prompt vault vide
  - frontend:
    - nouveau panneau `GlobalBackupPanel` (modal export/import)
    - bouton integre a Home dans la zone d'etat globale
    - fonctionnement dual: localStorage en mode local, tRPC cloud en mode authentifie
  - tests:
    - `server/backup.test.ts` ajoute pour couvrir export/import unifies
  - verification complete executee: `pnpm verify:step` OK, `pnpm check` OK
  - decision: prochaine priorite candidate = ajouter une couverture e2e UI du flux backup (T025)
*Mis a jour : 2026-03-31 | Codex (workflow, simplification UX, stabilisation typecheck, env alignment, cookie policy, suivi transaction, CI PR, reprise prod T006, cloture prod, T007 README, T008 cleanup server legacy, T009 foreign keys Drizzle, T010 apply FK migration prod, T011 env cleanup, T012 analytics stabilization, T013 bundle reduction, T014 smoke e2e, T015 observability, T016 lazy fallback UX, T017 final home design, T018 persistence/sync complete, T019 prompt-vault prod migration, T020 prompt-vault hardening, T021 playwright e2e ui, T022 backend sync hardening, T023 global sync indicator, T024 unified backup import-export) -- Systema Central Continuum*
