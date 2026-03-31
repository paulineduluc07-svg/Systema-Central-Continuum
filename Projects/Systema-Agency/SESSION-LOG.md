# Session Log - Systema Agency

Trace courte de chaque etape executee.

## 2026-03-30 - Etape 000 - Preparation du terrain
- Scope:
  - Garder 3 onglets: Prompt Vault, Suivi medicament, Tableau blanc.
  - Prompt Vault en pleine page avec style plus sobre.
  - Mise en place du cadre de travail par taches.
- Livrables:
  - `client/src/pages/Home.tsx` (navigation 3 onglets)
  - `client/src/pages/PromptVault.tsx` (layout pleine page)
  - `client/src/const.ts` (ajout `getLoginUrl`)
  - `WORKFLOW.md` (processus de travail)
  - `Todo.md`, `Roadmap.md`, `Notes/Systema Agency.md` (etat mis a jour)
  - `Code/package.json` (`verify:step`, `verify:full`)
- Verification:
  - `pnpm test` = OK
  - `pnpm build` = OK
  - `pnpm check` = KO (dette historique deja connue, documentee)
- Resultat:
  - Base de travail prete pour enchainement en taches courtes.
  - Prochaine tache recommandee: stabiliser `pnpm check`.

## 2026-03-30 - Etape 001 - Stabilisation typecheck
- Scope:
  - Faire passer `pnpm check` sans erreur.
  - Conserver build et tests verts.
- Livrables:
  - `client/src/hooks/useComposition.ts` ajoute.
  - `client/src/components/AIChatBox.tsx` ajoute (usage demo `ComponentShowcase`).
  - `server/_core/env.ts` aligne avec les usages (`forgeApiUrl`, `forgeApiKey`, `openaiApiKey`, `openaiApiUrl`, `openaiModel`).
  - `server/_core/oauth.ts` simplifie (OAuth retire, redirect `/`).
  - `server/_core/rateLimit.ts` ajuste pour compat TypeScript.
  - `vite.config.ts` corrige (`allowedHosts: true`).
- Verification:
  - `pnpm check` = OK
  - `pnpm verify:full` = OK
- Resultat:
  - Qualite de base retablie: check + test + build passent.
  - Prochaine tache recommandee: T002 (`.env.example`).

## 2026-03-30 - Etape 002 - Alignement .env.example
- Scope:
  - Aligner `.env.example` avec les variables actuellement lues par le code.
- Livrables:
  - `Code/.env.example` recompose avec sections:
    - required runtime
    - optional client
    - optional analytics
    - optional legacy integrations
    - runtime-provided vars (`NODE_ENV`, `PORT`)
  - Variables OAuth obsoletes retirees.
- Verification:
  - `pnpm check` = OK
  - `pnpm verify:step` = OK
- Resultat:
  - Setup d'environnement clarifie et coherent avec l'etat du code.
  - Prochaine tache recommandee: T003 (politique cookie dev/prod).

## 2026-03-30 - Etape 003 - Politique cookie dev/prod
- Scope:
  - Rendre la politique cookie stable en local HTTP et configurable pour le cross-site HTTPS.
- Livrables:
  - `server/_core/cookies.ts`
    - default: `SameSite=Lax`
    - cross-site explicite: `COOKIE_CROSS_SITE=true` => `SameSite=None` uniquement sur requete HTTPS
  - `server/auth.logout.test.ts` complete avec 2 cas:
    - mode par defaut (`lax`)
    - mode cross-site (`none`)
  - `Code/.env.example` complete avec `COOKIE_CROSS_SITE`
- Verification:
  - `pnpm check` = OK
  - `pnpm verify:step` = OK
- Resultat:
  - Sessions plus fiables en dev local, comportement cross-site explicite et controle.
  - Prochaine tache recommandee: T004 (`replaceSuiviEntries` sous transaction).

## 2026-03-30 - Etape 004 - Transaction suivi.replace
- Scope:
  - Rendre `replaceSuiviEntries` atomique pour eviter la perte de donnees entre delete et insert.
- Livrables:
  - `server/db.ts` : `replaceSuiviEntries` execute maintenant delete + insert dans `db.transaction(...)`.
- Verification:
  - `pnpm check` = OK
  - `pnpm verify:step` = OK
- Resultat:
  - Remplacement des entrees suivi securise en une seule unite transactionnelle.
  - Prochaine tache recommandee: T005 (CI PR check/test/build).

## 2026-03-30 - Etape 005 - CI Pull Request
- Scope:
  - Ajouter un workflow CI execute a chaque PR vers `main`.
- Livrables:
  - `Code/.github/workflows/ci-pr.yml` ajoute.
  - Pipeline: install + `pnpm check` + `pnpm test` + `pnpm build`.
  - Cache pnpm configure avec lockfile du projet.
- Verification:
  - `pnpm check` = OK
  - `pnpm verify:step` = OK
- Resultat:
  - Garde-fou CI en place pour eviter les regressions en PR.
  - Prochaine tache recommandee: T006 (config Vercel + migration Neon + validation prod).

## 2026-03-30 - Etape 006 - Vercel + Neon + validation prod
- Scope:
  - Reprendre la mise en production T006 en execution reelle.
  - Verifier environnement Vercel, tenter migration Neon, redeployer en production.
- Livrables:
  - Projet local relie a Vercel (`vercel link`) pour `systema-agency`.
  - Deploiement prod relance via `vercel deploy --prod -y` (deployment `Ready`, alias actif).
  - Hygiene secrets locale: fichiers `.env.vercel*` supprimes apres diagnostic.
  - `Code/.gitignore` renforce avec `.env.vercel*` et `.vercel`.
- Verification:
  - `pnpm check` = OK
  - `pnpm test` = OK
  - `pnpm build` = OK
  - Tentative migration DB = KO (`28P01` password authentication failed for `neondb_owner`)
- Resultat:
  - Pipeline local et deploy Vercel valides.
  - Blocage restant: `OWNER_EMAIL` et `OWNER_PASSWORD` absents sur Vercel.
  - Blocage critique DB: `DATABASE_URL` actuelle invalide (format/pwd), migration `0001_suivi_entries` non appliquee.
  - Prochaine action: corriger `DATABASE_URL` Neon + definir credentials owner, puis relancer migration et validation fonctionnelle prod.

## 2026-03-31 - Etape 006B - Cloture T006 (env + migration + prod)
- Scope:
  - Finaliser les variables runtime production et supprimer les blocages de migration.
- Livrables:
  - Variables Vercel mises a jour en `development` et `production`: `DATABASE_URL`, `OWNER_EMAIL`, `OWNER_PASSWORD`.
  - Note Vercel Preview: variables custom non appliquees (projet avec Preview branche-scopee, aucune branche preview active).
  - Migration DB executee avec succes via `pnpm drizzle-kit migrate`.
  - Nouveau deploiement production effectue (`vercel deploy --prod -y`) et deployment `Ready`.
- Verification:
  - `pnpm check` = OK
  - `pnpm test` = OK
  - `pnpm build` = OK
  - `pnpm drizzle-kit migrate` = OK
  - `vercel inspect` deployment = `Ready`
- Resultat:
  - T006 complete et fermee.
  - Prochaine tache recommandee: T007 (nettoyage final docs README).

## 2026-03-31 - Etape 007 - Nettoyage README (stack + auth + onboarding)
- Scope:
  - Nettoyer le README technique pour supprimer les infos obsoletes et fiabiliser l'onboarding.
- Livrables:
  - `Code/README.md` reecrit avec stack actuelle (React 19, Vite, tRPC, Drizzle, Neon, Vercel).
  - Section auth mise a jour (email/password + JWT cookie, plus aucun OAuth).
  - Onboarding clarifie (`pnpm install`, `.env`, prerequis, commandes qualite, migration, deploy).
- Verification:
  - `pnpm check` = OK
  - `pnpm test` = OK
  - `pnpm build` = OK
- Resultat:
  - Documentation d'entree projet coherent avec l'etat reel du code et de la prod.
  - Prochaine tache recommandee: T008 (nettoyage server legacy).

## 2026-03-31 - Etape 008 - Nettoyage server legacy
- Scope:
  - Supprimer les modules backend legacy devenus inutilises (OAuth/LLM/Image/Voice/Map/Data API/Notification).
  - Retirer les branchements legacy encore actifs dans le serveur et le routeur tRPC.
- Livrables:
  - `Code/server/_core/index.ts`
    - retrait de l'import/appel `registerOAuthRoutes`.
  - `Code/server/routers.ts`
    - retrait de `systemRouter` et de la section `system`.
  - Fichiers supprimes:
    - `Code/server/_core/oauth.ts`
    - `Code/server/_core/llm.ts`
    - `Code/server/_core/imageGeneration.ts`
    - `Code/server/_core/voiceTranscription.ts`
    - `Code/server/_core/map.ts`
    - `Code/server/_core/dataApi.ts`
    - `Code/server/_core/notification.ts`
    - `Code/server/_core/systemRouter.ts`
- Verification:
  - `pnpm check` = OK
  - `pnpm test` = OK
  - `pnpm build` = OK
- Resultat:
  - Dette technique legacy retiree du backend actif sans regression de qualite.
  - Prochaine tache recommandee: T009 (ajout des foreign keys Drizzle).
