# TODO - Systema-Agency

Suivi court des prochaines actions. Les details historiques vivent dans Git.

---

## Regles actives

- A chaque action reelle : garder `TODO.md`, `NOTES.md` et `WORKLOG.md` courts et alignes.
- Synchroniser `Mon disque\SCC` et `SCC-github-clone` avant de cloturer.
- Utiliser le clone `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency` pour build/test/Git.
- Ne pas ajouter de nouvelle grosse fonctionnalite tant que la base courante n'est pas propre.

---

## Etat valide

- Prod active : `https://systema-agency.vercel.app`.
- Auth email/mot de passe fonctionnelle.
- Sync cloud fonctionnelle apres login.
- Kim repond dans `/kim` et peut ajouter des prompts dans Prompt Vault.
- Notes volantes desktop `/notes` livrees, corrigees et validees visuellement.
- Agenda hebdomadaire `/agenda` livre : evenements, objectifs et habitudes persistants par semaine.
- Serveur MCP Systema expose `/mcp`; lecture sans secret, writes prod valides avec secret.
- CustomTabs visibles dans la nav via `/tab/:tabId`; widgets tasks/notes fonctionnels.
- Notes volantes : deux types `note` / `task` choisis au FAB; pastille rend uniquement le contenu pertinent (texte libre OU checklist).
- Home `/` remplacee par le dashboard V4 modifie : navbar home retiree, logo agrandi, pastilles holo utilisees comme navigation interne, raccourcis reserves aux sites web, news allongees, projets allonges, agenda/stat/greeting/search retires.
- Home dashboard dynamique livre (PR `e4782c5`) : raccourcis editables, meteo reelle, news/projets via MCP, persistes dans la table `home_data`.

---

## Priorite immediate (avant toute nouvelle feature)

- [x] **Reparer la dependance `@neondatabase/serverless` non resolue par Node 24 + pnpm**. Cause confirmee : `node_modules` du clone avait ete installe depuis WSL, donc les liens pnpm etaient lisibles par WSL mais pas par PowerShell. Correction : suppression du `node_modules` WSL, reinstall depuis PowerShell via `corepack pnpm install --frozen-lockfile`. Validation PowerShell : import Neon OK et `node --env-file=.env scripts/apply-home-data-migration.mjs` OK.
- [x] Exposer `pnpm` cote Windows : `pnpm@10.4.1` installe dans `C:\Users\pauli\AppData\Local\pnpm`, chemin ajoute au PATH utilisateur, shims `.ps1` retires pour laisser PowerShell utiliser `pnpm.cmd` sans modifier l'execution policy.
- [x] Documenter dans `NOTES.md` la marche a suivre pour les migrations DB futures.

---

## Prochaines passes

### Home dashboard

- [x] Implementer la V4 modifiee selon les annotations de Pauline.
- [x] Passer les pastilles holo en boutons vers les pages Systema et reserver les raccourcis aux sites web.
- [x] Raccourcis editables, meteo reelle, news/projets dynamiques via MCP livres (table `home_data` migree).
- [ ] Configurer les vrais liens web dans les raccourcis cote UI (saisie utilisateur).
- [ ] Verifier que le flux MCP news/projets repond bien en prod une fois Cowork branche.

### Agenda

- [ ] Ajouter un editeur detail evenement : heure, titre, couleur, suppression.
- [ ] Ajouter une adaptation mobile complete pour `/agenda`.
- [ ] Inclure les donnees Agenda dans le backup/export global si necessaire.

### Notes volantes

- [x] Split pastilles en deux types : `note` (texte libre) et `task` (checklist), avec accents par defaut differents.
- [x] Cacher la scrollbar interne et adapter les tailles de police a la largeur de la pastille.
- [ ] Passe B : vue mobile masonry + bottom sheet pour `/notes`.
- [ ] Revalider le flux mobile : creer, editer, archiver, restaurer, supprimer.
- [ ] Garder le bouton/flux de recuperation des notes coincées tant que le drag mobile n'est pas parfaitement valide.

### Kim dans Systema

- [x] Passe 2 : connecter Cowork/Kim aux tools MCP write de Systema.
- [x] Afficher les customTabs crees via MCP dans la nav principale.
- [ ] Passe 3 : permettre a Kim de modifier/archiver avec confirmation.
- [ ] Garder la suppression directe interdite au depart.

### MCP Systema

- [x] Ajouter `SYSTEMA_MCP_USER_OPEN_ID` dans Vercel.
- [x] Generer et ajouter `SYSTEMA_MCP_SECRET` dans Vercel.
- [x] Tester `tools/list` et un write HTTP avec header secret apres deploy.
- [x] Configurer Cowork/Kim avec l'URL `https://systema-agency.vercel.app/mcp?secret=<secret>`.

### Prompt Vault

- [ ] Ajouter les images associees aux prompts.

### Plus tard

- [ ] Syncer Gmail.
- [ ] Generer mes taches.
- [ ] Clarifier/implementer Supplement.

---

## Incidents a garder en tete

- Auth 2026-04-25 : verifier d'abord `VITE_APP_ID=systema-agency` si la session recasse.
- Modal login 2026-05-01 : `LoginModal` doit rester en `pointer-events-auto`, car il est rendu dans la navbar.
- Incident Gemini 2026-05-01 : un marqueur texte `=====` laisse dans `FloatingNotes.tsx` a casse le build Vercel; corrige par `b8214fc`.
- pnpm/Node 24 2026-05-04 : `node --env-file=.env scripts/apply-home-data-migration.mjs` echoue avec `ERR_MODULE_NOT_FOUND` sur `@neondatabase/serverless` malgre symlink pnpm valide; contourne ce coup-ci par import via chemin absolu `file:///.../node_modules/.pnpm/.../index.mjs`. Bloquant pour les futures migrations executees depuis Windows. A reparer en priorite.
