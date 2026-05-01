# WORKLOG - Systema-Agency

Journal court. Garder seulement les faits utiles a la reprise.

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
