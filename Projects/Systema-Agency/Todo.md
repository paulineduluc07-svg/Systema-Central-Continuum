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
- [ ] T003 - Ajuster la politique cookie (`sameSite` / `secure`) pour dev + prod

## NEXT
- [ ] T004 - Mettre `replaceSuiviEntries` sous transaction
- [ ] T005 - CI PR (check/test/build)
- [ ] T006 - Config Vercel + migration Neon + validation prod

## DONE
- [x] T002 - Mettre a jour `.env.example` (2026-03-30)
  - [x] Retrait des variables OAuth obsoletes (`OAUTH_SERVER_URL`, `OWNER_OPEN_ID`)
  - [x] Ajout des variables auth actuelles (`OWNER_EMAIL`, `OWNER_PASSWORD`, `VITE_LOGIN_URL`)
  - [x] Ajout des variables analytics utilisees par `client/index.html`
  - [x] Ajout des variables integration legacy (`BUILT_IN_FORGE_*`, `OPENAI_*`) avec marquage optionnel
  - [x] Validation: `pnpm check` OK et `pnpm verify:step` OK
- [x] T001 - Stabiliser `pnpm check` (2026-03-30)
  - [x] Ajout de `client/src/hooks/useComposition.ts`
  - [x] Ajout de `client/src/components/AIChatBox.tsx` (composant demo pour `ComponentShowcase`)
  - [x] Alignement `server/_core/env.ts` avec les usages (`forge*`, `openai*`)
  - [x] Neutralisation OAuth legacy dans `server/_core/oauth.ts` (redirect simple)
  - [x] Correction typing `vite.config.ts` (`allowedHosts: true`)
  - [x] Correction compat TS `server/_core/rateLimit.ts`
  - [x] Validation: `pnpm verify:full` OK
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
