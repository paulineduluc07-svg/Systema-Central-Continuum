# WORKLOG - Systema-Agency

Journal court. Garder seulement les faits utiles a la reprise.

---

## 2026-05-03 - Agenda Liquid Week livre

- Ajout route `/agenda` avec entree Agenda dans la navbar.
- Implementation du tableau hebdomadaire Liquid Week : navigation semaine, 7 jours, evenements editables, objectifs cochables, habitudes 3 etats.
- Persistance locale via `localStorage` et persistance cloud authentifiee via tRPC `agenda.get/save`, clee par semaine ISO.
- Ajout table `agenda_week_data` + migration `drizzle/0005_agenda_week_data.sql`; migration appliquee sur Neon et verifiee.
- Tests ajoutes : `server/agenda.test.ts`.
- Validation depuis le clone hors Drive : `pnpm check`, `pnpm test`, `pnpm build` OK.
- Commit/push sur `main` : `7a49b4e`.
- Correctif UX : remplacement des `contentEditable` par de vrais inputs transparents, puis passage en sauvegarde immediate a chaque frappe pour rendre l'edition fiable; validation `pnpm check`, `pnpm test`, `pnpm build` OK.
- Ajustements UI demandes : suppression d'evenements via bouton `X`, navigation de semaine centree, titres des groupes d'habitudes editables et persistants.

Statut : livre dans GitHub/main; Vercel redeploie automatiquement sur push.

---

## 2026-05-02 - CustomTabs visibles dans la nav

- Probleme : les `customTabs` crees via MCP etaient en DB mais invisibles dans l'UI.
- Ajout route dynamique `/tab/:tabId` avec page `CustomTabPage`.
- La navbar charge `customTabs.list` et affiche les onglets custom apres les sections built-in.
- Les tabs `widgets` affichent tasks + notes persistantes; les tabs `whiteboard` affichent un placeholder.
- Validation locale : `pnpm check`, `pnpm build`, `pnpm test` OK.

Statut : pret a deployer; valider ensuite que `Test Cowork` apparait en prod.

---

## 2026-05-02 - Patch MCP secret query

- Probleme : Cowork ne permet pas les headers HTTP custom pour les connectors MCP.
- Patch : le transport HTTP accepte maintenant le secret via `x-systema-mcp-secret` ou `?secret=...`.
- `MCP_VERSION` passe a `0.3.1`.
- Tests ajoutes : header valide, query valide, sans secret 401, mauvais query secret 401.
- Validation locale : `pnpm check`, `pnpm test -- server/mcp/writes.test.ts`, `pnpm build` OK.
- Convention ajoutee : plans/patchs agents dans `RESSOURCES/AGENT_PLANS/`; `NOTES_DE_PAULINE.md` reste personnel et hors MCP.

Statut : pret a deployer; apres deploy, configurer Cowork avec l'URL contenant `?secret=`.

---

## 2026-05-02 - MCP writes Systema prepares

- Ajout auth MCP : `SYSTEMA_MCP_USER_OPEN_ID` pour resoudre Paw, `SYSTEMA_MCP_SECRET` pour les writes HTTP.
- Ajout tools MCP DB : tasks, notes, notes volantes, custom tabs.
- Lecture MCP conservee sans secret; writes HTTP rejetes 401 sans `x-systema-mcp-secret`.
- Tests ajoutes : `server/mcp/writes.test.ts`.
- Validation locale : `pnpm check` OK; `pnpm test -- server/mcp/writes.test.ts` OK.
- Commit/push : `0a000dd`.
- Variables Vercel Production ajoutees/reecrites via CLI.
- Validation prod : `/mcp` expose 20 tools; write sans secret rejete 401; `create_task` puis `delete_task` avec secret OK.

Statut : livre en prod; reste a connecter Cowork/Kim avec le header secret.

---

## 2026-05-01 - Login repare et prod validee

- Probleme : le modal de connexion s'ouvrait, mais les champs email/mot de passe pouvaient ne pas accepter le focus.
- Cause : `LoginModal` est rendu dans `Navbar`, dont le header parent est en `pointer-events-none`.
- Fix : `LoginModal.tsx` garde maintenant `pointer-events-auto`; `useAuth.ts` refetch `auth.me` apres login.
- Validation : prod `auth.login=200`, cookie `app_session_id`, puis `auth.me=200`.
- Commits : `7d5a33e`, `dbe23e9`.

Trace Gemini :
- Un marqueur texte accidentel `=====` etait reste dans `FloatingNotes.tsx`, ce qui a casse le build Vercel du premier push.
- Fix build : `b8214fc`.

Nettoyage Vercel :
- Ancien projet archive `kim-frontend-staging` deconnecte du repo GitHub pour ne plus creer de faux echecs a chaque push Systema.

Statut : termine, en ligne.

---

## 2026-05-01 - Notes volantes stabilisees

- Probleme : certaines notes pouvaient devenir difficiles a recuperer pres de la navbar.
- Fix : z-index/focus, clamping de position, mecanismes de recuperation.
- Page `/notes` validee visuellement par Pauline.
- Commits principaux : `61133c4`, `3287130`, `02b1ff9`.

Statut : desktop valide; mobile masonry/bottom sheet reste a faire.

---

## 2026-05-01 - Serveur MCP Systema

- Ajout MCP TypeScript/Node dans `Code/server/mcp/`.
- Transports : stdio local et HTTP public `/mcp`.
- Surface : lecture seule des docs projet et outils `list/read/search_project_docs`.
- Validation : endpoint public fonctionnel.

Statut : termine; mutations DB a garder pour une passe separee.

---

## 2026-04-29 - Notes volantes Passe A

- Ajout table `floating_notes`, router tRPC, page `/notes`, drawer d'archives et persistance DB.
- Migration Neon appliquee.
- Build/test OK puis deploiement GitHub/Vercel.

Statut : livre puis valide le 2026-05-01.

---

## 2026-04-27/28 - Kim dans Systema

- Ajout `/kim`, endpoint tRPC protege `ai.chat`, service serveur OpenAI.
- Kim peut discuter et ajouter des prompts dans Prompt Vault.
- Texte visible de `/kim` aligne avec l'etat reel.

Statut : Kim active; creation de notes/taches a faire plus tard.

---

## 2026-04-25 - Auth et sync restaurees

- Cause prod initiale : imports Vercel ESM strict + `VITE_APP_ID` absent.
- Fix : imports serveur ajustes, mini-app Express pour tRPC, `VITE_APP_ID=systema-agency` ajoute en prod.
- Validation Pauline : login + sync ordi/cellulaire fonctionnels.

Statut : stable.

---

## 2026-04-28 - Regle sync Drive

- Constat : Google Drive ne capte pas toujours les changements faits directement depuis WSL dans `Mon disque`.
- Decision : build/test/Git depuis `SCC-github-clone`; synchronisation Drive via action cote Windows quand c'est important.

Statut : regle active.
