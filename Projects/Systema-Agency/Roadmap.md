# Roadmap - Systema Agency

Vision et etapes du projet.

---

## Vision produit (etat cible)
Dashboard personnel simple et stable, organise autour de 3 entrees:
- Prompt Vault
- Suivi medicament
- Tableau blanc illimite (notes volantes)

Stack:
- TypeScript + React 19 + Vite + Tailwind v4
- tRPC + Drizzle ORM + Neon PostgreSQL
- Deploy Vercel

---

## Phase 0 - Base UX (done)
- [x] Simplification navigation a 3 onglets
- [x] Prompt Vault en pleine page (layout normal)
- [x] Tableau blanc conserve avec notes volantes
- [x] Build frontend retabli (`getLoginUrl`)

## Phase 1 - Discipline execution (done)
- [x] Workflow de travail par taches documente (`WORKFLOW.md`)
- [x] Journal de session (`SESSION-LOG.md`)
- [x] Scripts de verification (`verify:step`, `verify:full`)
- [x] Retour a zero erreur sur `pnpm check`

## Phase 2 - Stabilisation technique (done)
- [x] Corriger incoherences ENV serveur
- [x] Mettre a jour `.env.example`
- [x] Politique cookie robuste dev/prod
- [x] Transaction sur `replaceSuiviEntries`
- [x] CI PR (check/test/build)
- [x] README technique/onboarding aligne (stack + auth + runbook)
- [x] Nettoyage modules server legacy (`oauth`, `llm`, `imageGeneration`, `voiceTranscription`, `map`, `dataApi`, `notification`)
- [x] Foreign keys ajoutees dans le schema Drizzle + migration SQL (`0002_add_user_foreign_keys.sql`)

## Phase 3 - Production
- [x] Deploy production relance (`vercel deploy --prod -y`) et alias actif
- [x] Variables Vercel completes (`DATABASE_URL`, `JWT_SECRET`, `OWNER_EMAIL`, `OWNER_PASSWORD`)
- [x] `DATABASE_URL` Vercel assainie et validee
- [x] Migration SQL Neon appliquee (`drizzle/0001_suivi_entries.sql`)
- [x] Validation production fonctionnelle complete (auth + sync DB)
- [x] Migration FK appliquee en prod (`drizzle/0002_add_user_foreign_keys.sql`) + smoke check prod (`Ready`, HTTP 200)

## Phase 4 - Qualite UX/Perf (done)
- [x] Stabilisation integration analytics (retrait warnings build lies a `%VITE_ANALYTICS_*`)
- [x] Reduction taille bundle frontend (>500 kB) via code-splitting routes

## Phase 5 - Robustesse operationnelle (done)
- [x] Smoke e2e backend (login + notes + suivi)
- [x] Observabilite frontend (runtime errors + alerting minimal)
- [x] Fallback UX pendant lazy loading des pages

## Phase 6 - Direction visuelle finale (done)
- [x] Refonte Home dashboard selon reference visuelle (glass / rose-marbre / ambiance lumineuse)
- [x] Conservation complete des flux produit (auth, sync taches/notes, navigation)

## Phase 7 - Persistance totale des donnees (done)
- [x] Prompt Vault persistant et synchronise (local + cloud)
- [x] Migration locale -> cloud reactivee au login (`useDataMigration`) pour taches/notes/preferences
- [x] Flux Suivi durci pour eviter les pertes de donnees au premier login (cloud vide -> import local auto)
- [x] Routeur + stockage backend dedies Prompt Vault (`prompt_vault_data`, tRPC `promptVault.get/save`)

---

Mis a jour: 2026-03-31
