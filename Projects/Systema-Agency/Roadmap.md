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

## Phase 2 - Stabilisation technique (in progress)
- [ ] Corriger incoherences ENV serveur
- [x] Mettre a jour `.env.example`
- [x] Politique cookie robuste dev/prod
- [x] Transaction sur `replaceSuiviEntries`
- [ ] CI PR (check/test/build)

## Phase 3 - Production
- [ ] Variables Vercel completes (`DATABASE_URL`, `JWT_SECRET`, `OWNER_EMAIL`, `OWNER_PASSWORD`)
- [ ] Migration SQL Neon appliquee
- [ ] Validation production complete

---

Mis a jour: 2026-03-30
