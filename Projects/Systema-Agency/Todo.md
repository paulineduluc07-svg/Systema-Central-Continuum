# Todo - Systema Agency

Taches actives. Mise a jour a chaque session.

---

## Mode execution
- Une seule tache active a la fois.
- Verification avant push:
  - `pnpm verify:step` obligatoire
  - `pnpm check` suivi a chaque etape (dette actuelle connue)
- Apres chaque push:
  - Mettre a jour `Todo.md`, `Roadmap.md`, `SESSION-LOG.md`, `Notes/Systema Agency.md`

---

## IN PROGRESS
- [ ] T001 - Stabiliser `pnpm check` (objectif: zero erreur TypeScript)
  - [ ] Corriger imports orphelins UI (`useComposition`, `AIChatBox`)
  - [ ] Aligner `server/_core/env.ts` avec les usages reels
  - [ ] Corriger `vite.config.ts` (typing)
  - [ ] Revalider `pnpm check`

## NEXT
- [ ] T002 - Mettre a jour `.env.example` (variables actuelles uniquement)
- [ ] T003 - Ajuster la politique cookie (`sameSite` / `secure`) pour dev + prod
- [ ] T004 - Mettre `replaceSuiviEntries` sous transaction
- [ ] T005 - CI PR (check/test/build)
- [ ] T006 - Config Vercel + migration Neon + validation prod

## DONE
- [x] T000 - Preparation du terrain de travail (2026-03-30)
  - [x] Home simplifie a 3 onglets: Prompt Vault, Suivi medicament, Tableau blanc
  - [x] Prompt Vault passe en vue pleine page, design plus sobre
  - [x] Bug build `getLoginUrl` corrige
  - [x] Scripts de verification ajoutes: `verify:step`, `verify:full`
  - [x] Workflow et journal de session mis en place
- [x] Migration code vers `Projects/Systema-Agency/Code/` validee
- [x] Ancien repo `systema.agency` archive en lecture seule
- [x] Vague 1 securite (2026-03-19)
- [x] Refonte architecture frontend (2026-03-20)
- [x] Auth email/password implementee (2026-03-20)
- [x] Suivi medicament: sync DB (2026-03-21)

---

Mis a jour: 2026-03-30
