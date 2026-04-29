# WORKLOG - Systema-Agency

Trace du travail effectué avec dates.

---

## 2026-04-29

**Session :** Implémentation Passe A des notes volantes (`/notes`)

**Source design :** `RESSOURCES/design_handoff_floating_notes_unzip/design_handoff_floating_notes/` (zip extrait depuis `Documents/Downloads/systema agency.zip`).

**Décisions de design retenues avec Pauline :**
- URL `/notes`.
- Tweaks panel exclu (handoff dit « do NOT ship ») ; defaults : style `neon`, accent `pink`, blur 22, opacity 0.9, grain on, grille on.
- Fond : `/backgrounds/main-v2.jpg` (cohérent avec HomeV2/Kim) au lieu du `room-bg.png` du handoff.
- Passe A = desktop ; Passe B = mobile masonry + bottom sheet (à venir).
- Ne pas toucher au tableau blanc historique. La page `/notes` est une nouvelle route séparée.

**Ce qui a été fait :**
- `drizzle/schema.ts` : nouvelle table `floating_notes` + enums `floatingNoteAccent`, `floatingNoteStyle`. Champs : id, userId, title, body, checklist (JSON dans text), x/y/w/h, accent, style nullable, archived, archivedAt, createdAt, updatedAt.
- `drizzle/0004_floating_notes.sql` : migration idempotente (CREATE TYPE/TABLE/INDEX IF NOT EXISTS + bloc DO $$ pour le FK).
- `server/db.ts` : helpers `listActiveFloatingNotes`, `listArchivedFloatingNotes`, `createFloatingNote`, `updateFloatingNote`, `archiveFloatingNote`, `restoreFloatingNote`, `deleteFloatingNote`.
- `server/routers.ts` : router tRPC `floatingNotes` (listActive/listArchived/create/update/archive/restore/delete), schémas Zod, mapper DTO `toFloatingNoteDto`.
- `client/src/pages/FloatingNotes.tsx` : page complète — board free-form 100vh, FAB bottom-right (au-dessus du sync indicator), drawer Tiroir glassmorphism à droite, trois traitements glass (neon/frost/holo), 5 accents, grain SVG, grille de fond, pointer events natifs pour drag/resize, optimistic + debounce 600 ms par note.
- `client/src/App.tsx` : route lazy `/notes` ajoutée.
- `client/src/components/Navbar.tsx` : lien « Notes » + icône `StickyNote` ajouté entre Kim et Prompt Vault.

**Validation locale (depuis le clone, env Windows) :**
- Réinstallation `node_modules` depuis PowerShell (l'install initiale via WSL avait posé des symlinks non lisibles côté Windows natif).
- `pnpm check` ✅ exit 0 — aucune erreur TypeScript.
- `pnpm build` ✅ exit 0 — bundle `FloatingNotes-BpUZKgdS.js` 24.88 kB (gzip 6.57 kB), 2118 modules transformés en 3.31s.

**Migration DB :**
- `pnpm db:push` non utilisé (le journal Drizzle local était désynchronisé avec la prod — risque de regénérer toutes les migrations).
- À la place : script `scripts/apply-floating-notes-migration.mjs` qui applique directement le SQL `0004_floating_notes.sql` via `@neondatabase/serverless`. Idempotent (CREATE ... IF NOT EXISTS + DO $$). Réutilisable.
- Vérification post-migration : la table `floating_notes` existe sur Neon avec les 15 colonnes attendues.

**Smoke tests (dev local + prod) :**
- Local `pnpm dev` : `auth.me` HTTP 200, `floatingNotes.listActive` HTTP 401 "Please login" (= route protégée branchée correctement).
- Prod `https://systema-agency.vercel.app` : `/notes` HTTP 200, `auth.me` HTTP 200, `floatingNotes.listActive` HTTP 401 — déploiement Vercel auto-passé après le push.

**Push :**
- Commit `7d3aa26` poussé sur `main` (8 fichiers, +1534/-1 lignes).
- Auto-deploy Vercel déclenché et complété.

**Reste à faire (Pauline) :**
1. **Test visuel sur prod** : `https://systema-agency.vercel.app/notes` (ou en local via `pnpm dev` puis `http://localhost:3000/notes`).
2. Tester : création (FAB en bas à droite + double-clic sur le tableau), drag (barre du haut), resize (coin bas-droit), édition titre/body/checklist, archivage (bouton archive dans la barre), tiroir (bouton « Tiroir » en haut à droite), restauration, suppression définitive.

**Statut :** ✅ Passe A desktop **livrée en prod**. Passe B (mobile masonry + bottom sheet) à planifier.

---

## 2026-04-28 (suite 2)

**Session :** Nettoyage de `NOTES.md`

**Ce qui a été fait :**
- Réduction de `NOTES.md` aux décisions, repères actifs et règles stables.
- Retrait du narratif d'incident et des détails historiques déjà conservés dans `WORKLOG.md`.
- Conservation des points vraiment utiles : état actuel, routes, Kim, déploiement, auth/env, dev local, sync Drive/GitHub et priorités ouvertes.
- Reformatage de `NOTES_DE_PAULINE.md` en Markdown lisible, sans changement de fond.

**Statut :** terminé ; commit/push de clôture demandé par Pauline.

---

## 2026-04-28 (suite)

**Session :** Alignement documentaire + texte Kim

**Ce qui a été fait :**
- Confirmation que les bandeaux « fichier en lecture seule » dans la documentation active viennent de Pauline et doivent être conservés.
- Synchronisation vers le clone GitHub des versions Drive de `README.md` et `NOTES_DE_PAULINE.md`.
- Correction du texte visible dans `/kim` : il ne dit plus « Passe 1 : conversation active seulement ».
- Nouveau texte aligné sur l'état réel : Kim peut discuter et ajouter des prompts dans Prompt Vault ; création de notes, modification et archivage restent des étapes futures.

**Validation :**
- `pnpm check` OK depuis le clone GitHub.

**Statut :** terminé, en attente du push GitHub.

---

## 2026-04-27

**Session :** Démarrage intégration Kim dans Systema Agency

**Demande Pauline :** intégrer Kim directement dans Systema, avec une progression étape par étape. Objectif long terme : Kim peut discuter, puis créer/modifier des éléments dans Systema avec des outils sur mesure.

**Ce qui a été fait :**
- Clarification : Anima Ingenium ne doit pas être fusionné comme runtime dans Systema. Systema devient plutôt la maison/interface de Kim.
- Choix d'une approche par passes :
  - Passe 1 : conversation Kim dans Systema, sans écriture.
  - Passe 2 : création de notes/tâches.
  - Passe 3 : modification/archivage avec confirmation.
- Ajout page `/kim` dans `Code/client/src/pages/Kim.tsx`.
- Ajout route `/kim` dans `Code/client/src/App.tsx`.
- Ajout lien « Kim » dans `Code/client/src/components/Navbar.tsx`.
- Ajout endpoint tRPC protégé `ai.chat` dans `Code/server/routers.ts`.
- Ajout service serveur `Code/server/ai/kim.ts`, appelant OpenAI Responses API côté serveur uniquement.
- Ajout variables `OPENAI_API_KEY` et `OPENAI_MODEL` dans `.env.example`.
- Ajout `openaiApiKey` et `openaiModel` dans `server/_core/env.ts`.

**Garde-fous actifs :**
- Kim ne peut pas encore modifier les notes, tâches, prompts ou données Systema.
- L'endpoint est protégé par l'auth existante.
- La clé OpenAI reste côté serveur.
- Si Pauline demande une action, Kim doit proposer le résultat mais ne pas prétendre l'avoir appliqué.

**Validation :**
- `pnpm check` exécuté et terminé OK.

**À reprendre :**
- Ajouter `OPENAI_API_KEY` dans Vercel Production.
- Tester visuellement `/kim`.
- Tester un échange réel avec Kim.
- Synchroniser vers le clone GitHub puis push/deploy quand l'utilisation sera disponible.

**Statut :** Passe 1 codée localement et validée TypeScript, pas encore testée visuellement ni déployée.

---

## 2026-04-27 (suite)

**Session :** Kim peut ajouter des prompts dans Prompt Vault

**Ce qui a été fait :**
- Correction de périmètre : le tableau blanc n'est pas encore prêt, donc l'action Kim cible uniquement Prompt Vault.
- Ajout d'un outil serveur `promptVault.addPrompt` piloté par Kim dans `server/ai/kim.ts`.
- Kim peut maintenant créer un prompt avec titre, contenu, catégorie et tags.
- Kim ne peut toujours pas modifier, archiver ou supprimer des éléments existants.
- L'interface `/kim` affiche une confirmation quand un prompt est ajouté.
- Cache client Prompt Vault invalidé après action Kim.

**Validation :**
- `pnpm check` OK depuis le clone GitHub hors Drive.
- `pnpm build` OK depuis le clone GitHub hors Drive.

**Note environnement :**
- Le build depuis Google Drive a échoué à cause de `node_modules` corrompu/incomplet (`@rollup/rollup-linux-x64-gnu` manquant).
- Décision pratique : utiliser le clone `SCC-github-clone` comme environnement de build/test fiable.

**Statut :** commit GitHub poussé (`056aea2`), déploiement Vercel en cours au moment de la trace.

---

## 2026-04-27 (mise à jour état Kim)

**Session :** Vérification exacte de Kim dans Systema + réalignement documentaire

**Constat vérifié :**
- La route `/kim` répond en prod.
- L'endpoint `ai.chat` est protégé par l'auth.
- Le build production passe depuis le clone GitHub hors Drive.
- Pauline confirme que `OPENAI_API_KEY` est bien configurée en Vercel Production et que Kim répond.
- Le code réel permet déjà à Kim d'ajouter des prompts dans Prompt Vault via `promptVault.addPrompt`.

**Désalignement corrigé dans la documentation :**
- `TODO.md` ne doit plus indiquer que la clé OpenAI, le test réel ou la synchronisation sont encore à faire.
- `NOTES.md` ne doit plus dire que Kim est limitée à la conversation seulement.
- Règle ajoutée : chaque passe/action réelle doit mettre à jour `TODO.md`, `NOTES.md`, `WORKLOG.md` et synchroniser SCC local ↔ clone GitHub avant clôture.

**Synchronisation :**
- SCC local et clone GitHub local synchronisés sur les fichiers documentaires modifiés.
- Commit local créé dans `SCC-github-clone` : `docs: aligne etat Kim Systema`.
- Premier push distant GitHub bloqué par l'auth HTTPS non interactive côté WSL (`could not read Username for 'https://github.com'`).
- Après reconnexion de Pauline, push réussi via Git Windows / PowerShell : `d8dd4a6 docs: aligne etat Kim Systema` sur `main`.

**Reste à faire :**
- Corriger le texte visible dans `/kim`, qui dit encore « Passe 1 : conversation active seulement » alors que Kim peut déjà ajouter des prompts.

---

## 2026-04-28

**Session :** Diagnostic synchronisation Google Drive pour Systema Agency

**Demande Pauline :** vérifier pourquoi le projet Systema ne semble pas se synchroniser avec Google Drive.

**Constats :**
- Google Drive est lancé côté Windows (`GoogleDriveFS.exe` actif).
- Le dossier `Systema-Agency` est petit : environ 4.2 MB et 165 fichiers.
- Aucun dossier lourd ou instable trouvé dans le dossier Drive : pas de `node_modules`, `dist`, `.git`, `.vercel`, `test-results`.
- Les fichiers récents du projet ont des attributs Windows normaux côté fichiers (`Archive`) ; les dossiers en `ReadOnly, Directory` sont courants côté Windows/Drive et ne suffisent pas à expliquer le souci.
- La base locale Google Drive contient bien le dossier `Systema-Agency`.

**Cause probable trouvée :**
- Google Drive ne détecte pas toujours les modifications faites depuis WSL/Codex dans `C:\Users\pauli\Mon disque`.
- Exemple : `TODO.md` sur disque faisait 6845 octets après modification, mais Google Drive le voyait encore à 5212 octets dans sa base miroir.
- Même type de décalage observé pour `NOTES.md` et `WORKLOG.md`.
- Google Drive indiquait `pending_uploads = 0`, `queued_uploads = 0`, `pending_deletes = 0`, donc il ne considérait pas ces modifications comme en attente.

**Décision pratique :**
- Continuer à utiliser `SCC-github-clone` pour Git/build/test.
- Pour synchroniser vers Google Drive, privilégier une action côté Windows (PowerShell, Git Windows, GitHub Desktop, VS Code Windows ou Explorateur), car cela déclenche mieux Google Drive qu'une écriture directe WSL.
- Ne pas considérer `Mon disque\SCC` comme synchronisé avec Drive uniquement parce qu'un fichier a changé depuis WSL.

**Vérification après documentation :**
- Les docs ont été copiées vers le clone via PowerShell puis poussées sur GitHub (`a2d01f6 docs: documente sync Google Drive`).
- SCC local et clone GitHub local sont alignés.
- Un simple `touch` Windows sur les fichiers Drive n'a pas suffi : la base Drive voyait encore les anciennes tailles pour `TODO.md`, `NOTES.md` et `WORKLOG.md`, avec `pending_uploads = 0` et `queued_uploads = 0`.
- Si Google Drive reste figé, prochaine action recommandée : vraie recopie/réécriture côté Windows ou redémarrage de Google Drive.

---

## 2026-04-23

**Session :** Alignement structurel et nettoyage

**Ce qui a été fait :**
- Comparaison avec le dépôt GitHub (version locale confirmée comme plus récente).
- Création des dossiers manquants (`RESSOURCES/`, `Livrables/`) pour alignement SCC.
- Mise à jour de la documentation (`README.md`, `TODO.md`) pour refléter la structure réelle.
- Analyse du projet technique `Code/`.
- Refonte de l'architecture du layout :
    - Création de `MainLayout` et `Navbar` (Glassmorphism, sticky).
    - Déplacement de la navigation (Home, Prompt Vault, Suivi) dans le header.
    - Centralisation de l'arrière-plan et de la barre d'outils (Thème, Auth, Paramètres).
    - Nettoyage de `Home.tsx` pour cohérence.

**Statut :** terminé

---

## 2026-04-24

**Session :** Nettoyage GitHub — alignement complet SCC local → GitHub

**Ce qui a été fait :**
- Analyse complète du SCC local et du repo GitHub — identification de toutes les incohérences.
- Suppression de `02-PROJECTS/Creation-SCC` (déjà archivé localement dans `03-ARCHIVES/A TRIER ET A CLASSER`).
- Suppression de `02-PROJECTS/Kim-Agentic-Companion` (prototype archivé — déjà présent dans `03-ARCHIVES/PROJECTS - non actif/`).
- Suppression de `03-ARCHIVES/OBSOLETE-GITHUB-REPO-BACKUP` (absent du local).
- Suppression de `04-RESSOURCES/Agent-Bureaux/` et `04-RESSOURCES/Workflows/` (absents du local).
- Nettoyage Systema-Agency GitHub : suppression des fichiers ancienne convention Codex (`SESSION-LOG.md`, `WORKFLOW.md`, `AGENT-INSTRUCTIONS.md`, `Roadmap.md`, `Todo.md`, `Notes/`, `Notes-Perso/`, `Prompts/`).
- Ajout `RESSOURCES/.gitkeep`, `TODO.md`, `WORKLOG.md` conformes SCC.
- Ajout `05-AGENTS/.claude/CLAUDE.md` et `README.md` sur GitHub.
- Création `.gitignore` racine pour protéger `Assets/SECRETS*.md` et `.env`.
- Push sur `main` — repo GitHub maintenant identique au SCC local.

**Statut :** terminé

---

## 2026-04-24 (session V2 — refonte page principale)

**Session :** Démarrage refonte itérative de la page principale (HomeV2)

**Ce qui a été fait :**
- Étape 1 — Page principale en page blanche avec fond cyberpunk rose :
    - Image générée par Pauline (ChatGPT) optimisée PNG → JPG q85 (1867 Ko → 195 Ko, -89%) et déposée dans `Code/client/public/backgrounds/main-v2.jpg`.
    - Création de `Code/client/src/pages/HomeV2.tsx` (page minimale, fond plein écran via `bg-cover bg-center`, cancel du `pt-20` du MainLayout pour fond edge-to-edge).
    - Mise à jour de `Code/client/src/App.tsx` : route `/` → `HomeV2`, route `/v1` ajoutée pointant vers l'ancienne `Home` (préservée intacte).
- Brand navbar : « Systema » → « Systema Agency » dans `Code/client/src/components/Navbar.tsx`.
- Aperçu HTML statique pour validation visuelle hors dev server : `Code/client/public/preview-v2.html` (debug local, non destiné à la prod).
- Documentation de réparation locale : `Code/DEV-SETUP.md` (procédure pnpm install après corruption Google Drive, contenu `.env` requis, scripts disponibles).

**Constat technique :**
- Le `node_modules` du projet sur Google Drive est partiellement corrompu (sync Drive incomplet) — packages `@epic-web/invariant`, `esbuild`, `rollup` introuvables au runtime. La validation locale via `pnpm dev` n'a pas pu être faite cette session. Procédure de réparation documentée dans `DEV-SETUP.md`.
- Validation visuelle faite via `preview-v2.html` ouvert en `file://` — Pauline a validé le rendu Étape 1.

**Prochaines étapes (séquentielles) :**
- Étape 2 — Ajout des 5 boutons stylisés à droite (Syncer Gmail, Générer mes tâches, Prompts, Suivis, Supplément). Routes branchées pour Prompts (`/prompt-vault`) et Suivis (`/suivi`), placeholders « À venir » pour les 3 autres.
- Étape 3+ — Implémentation des nouvelles features (Syncer Gmail, Générer mes tâches, Supplément).

**Statut :** Étape 1 terminée — déployée en prod.

**Pendant le déploiement, découvertes critiques :**

1. **Désalignement majeur SCC ↔ GitHub découvert** — ~35 fichiers `Code/` diffèrent entre SCC local (Google Drive) et le repo GitHub. La session 2026-04-24 (« alignement complet ») n'avait synchronisé que la documentation/structure, pas le code. La prod actuelle tournait depuis un build Vercel CLI antérieur, sans miroir GitHub.

2. **Bug bloquant trouvé dans `Home.tsx`** — un `</div>` orphelin à la ligne 361 sans balise ouvrante correspondante. Erreur `BABEL_PARSER_SYNTAX_ERROR: UnwrappedAdjacentJSXElements` qui faisait échouer toute build. Ce bug expliquait pourquoi la prod ne pouvait plus être redéployée depuis le 2026-04-23. Fix : suppression de la ligne 361 (orphan close tag). Build verte ensuite.

**Actions de remédiation :**
- Fix `Home.tsx` (suppression `</div>` orphelin ligne 361).
- Deploy Vercel CLI réussi : `https://systema.enterprises` + alias `https://systema-agency-oaxgnwq0g-paulines-projects-a8216a05.vercel.app` (déploiement `dpl_2uoJiRmg9m4nrLpUJiyF8BAPiV4c`).
- Realign complet SCC `Code/` → `SCC-github-clone/Code/` via robocopy (exclusions : `node_modules`, `dist`, `test-results`, `.vercel`, `.env`, `preview-v2.html`).
- Création `02-PROJECTS/Systema-Agency/NOTES.md` avec la **règle de déploiement** : tout `vercel --prod` doit être suivi immédiatement d'un push GitHub correspondant (cf. NOTES.md pour détails).
- Mise à jour `TODO.md` (étape 2 en cours, étapes 3+ listées, réparation node_modules locale, création .env local).

**Prochain push GitHub :** commit unique « Realign SCC ↔ GitHub + HomeV2 étape 1 + fix Home.tsx ». ✅ Effectué (commit `58e9c18`).

---

**Fin de session 2026-04-24 V2 — plan dicté pour la prochaine session :**

Phase 1 (cleanup avant Phase 2) — ordre strict :
1. Réparer sync appareils/sessions (cassé — symptômes à clarifier en début de prochaine session)
2. Réactiver auth email/password (cassé — symptômes à clarifier)
3. Supprimer boutons « Lune » et « Réglage » obsolètes de la navbar
4. Supprimer lien « Accueil » de la navbar (redondant avec brand « Systema Agency »)

Phase 2 (vrai set-up — uniquement après validation Phase 1) :
- 5a. Notes volantes en widgets glassmorphism déplaçables (priorité haute)
- 5b. Espace d'archivage des notes (long terme)
- 5c. Fonctions email sync / Générer mes tâches / Supplément (bloqué tant que 1-5b pas clean)

Détails complets et critères de validation : `TODO.md`. Intent qualitatif et règles : `NOTES_DE_PAULINE.md`.

---

## 2026-04-25

**Session :** Phase 1 étapes 1 + 2 — réparation auth + sync cloud

**Symptôme rapporté par Pauline :** impossible de se connecter au cloud avec email/mot de passe — donc pas de synchronisation entre appareils.

**Investigation et causes racines :**

1. **Couche 1 — `/api/trpc/*` mort en prod :** la function serverless plantait avec `ERR_MODULE_NOT_FOUND: Cannot find module '/var/task/server/routers'`. Cause : runtime Node ESM strict de Vercel ne résout pas les imports relatifs sans extension `.js` ni les alias TypeScript (`@shared/...`). Le `tsconfig` est en `moduleResolution: "bundler"` — OK en dev, KO en prod sans bundler. Le redéploiement V2 du 24-04 avait réinjecté le code source brut, sans bundle.

2. **Couche 2 — JWT signé avec `appId` vide :** une fois la function réparée, le login retournait 200 mais l'app restait en « Mode local ». Diagnostic via DevTools : cookie posé chez le navigateur, envoyé avec les requêtes suivantes, mais `verifySession` retournait `null`. Le payload du JWT contenait `{"appId":"",...}` — la variable d'env `VITE_APP_ID` n'était pas définie dans Vercel Production (vérifié via `vercel env ls`). Le code `verifySession` rejette tout JWT avec un `appId` vide → chaque nouveau login posait un cookie immédiatement invalide.

   *Note :* sur le cellulaire, l'auth fonctionnait toujours grâce à un vieux cookie d'avant le changement de config (signé avec un `appId` non-vide encore valide pendant 1 an).

**Ce qui a été fait :**

- Imports relatifs patchés dans la chaîne `api/trpc/[trpc].ts` → `server/routers.ts` + `server/db.ts` + `server/_core/{sdk,context,trpc}.ts` (extensions `.js` ajoutées, alias `@shared/const` remplacé par chemins relatifs).
- `api/trpc/[trpc].ts` réécrit en mini-app Express (`app.use("/api/trpc", createExpressMiddleware(...))`) pour fournir `req.body` parsé et `res.cookie/clearCookie` attendus par les routers.
- Deploy `dpl_Ew1MaJ9xGqYd7vbEsMzY9dDR7NwR` puis sync GitHub : commit `2913dd9` poussé sur `main`.
- Variable d'env `VITE_APP_ID="systema-agency"` ajoutée dans Vercel Production via `vercel env add`.
- Redeploy `dpl_oV6TCiVRRcjGt5o6kzgo88fq4wyH`.
- Tests endpoint OK (curl) : `auth.me` 200/null sans cookie, `auth.login` wrong creds 401.
- Validation Pauline : login OK sur ordi + cellulaire, sync 2-sens validée.

**Détour `systema.enterprises` :** premier essai de login fait sur ce custom domain → échec. Décidé en accord avec Pauline (option 3) d'abandonner `systema.enterprises` comme URL d'usage et de standardiser sur `systema-agency.vercel.app` partout. Le custom domain reste configuré chez Vercel mais n'est plus l'URL recommandée.

**Statut couches 1+2 :** Phase 1 étapes 1 et 2 bouclées et validées par Pauline.

**Phase 1 étapes 3 + 4 (suite directe de la même session) :**

- Réécriture de `Code/client/src/components/Navbar.tsx` :
  - Suppression du bouton toggle Lune/Soleil (dark mode) et de tout son state (`darkMode/setDarkMode` via `useSyncedPreferences`).
  - Suppression du bouton Réglage (engrenage) et de tout son state (`isAdminOpen` + import + render de `AdminPanel`).
  - Suppression de l'item « Accueil » de `navLinks`. Le brand « Systema Agency » reste le retour vers `/`.
  - Imports nettoyés : retirés `Moon`, `Sun`, `Settings`, `Home` (lucide-react), `useSyncedPreferences`, `AdminPanel`. `useSyncedPreferences` reste utilisé par MainLayout/useSyncedData donc le hook lui-même est conservé. `AdminPanel.tsx` n'est plus référencé mais le fichier est conservé (pas demandé explicitement de le supprimer).
- Décision routage `/v1` (option a choisie par Pauline) : pas de lien navbar, accès uniquement par URL directe. URL documentée dans `NOTES.md` section « Routes de l'app » pour repère pérenne.
- Deploy Vercel `dpl_mx2uoelpt`. Validation visuelle Pauline : navbar nettoyée, /v1 toujours accessible par URL.

**Statut Phase 1 complète :** ✅ étapes 1, 2, 3, 4 toutes bouclées et validées. Phase 2 (notes volantes draggables, archivage, Gmail/tâches/supplément) reste à attaquer en prochaine session.

---

## 2026-04-26

**Session :** Tâches transverses + fix navbar mobile

**Ce qui a été fait :**

- **Tâche transverse — réparation environnement local :**
  - `node_modules` cassé (12 entrées top-level / 60 attendues, dont `esbuild`, `rollup`, `@epic-web/invariant` manquants). Réparé via `corepack pnpm install` avec Drive en pause — 42.7s.
  - `.env` local créé via `vercel env pull .env --environment=production` (mêmes 5 vars que la prod : `DATABASE_URL`, `JWT_SECRET`, `OWNER_EMAIL`, `OWNER_PASSWORD`, `VITE_APP_ID`). **Conséquence : le dev local pointe sur la même DB Neon que la prod** — toute donnée créée en local va en prod.
  - Validation : `pnpm dev` démarre sur `http://localhost:3000/`, endpoint tRPC `auth.me` répond HTTP 200.

- **Fix navbar mobile (rapporté par Pauline via screenshot) :** en dessous de 768px (mobile portrait + desktop rétréci), les liens « Prompt Vault » et « Suivi » étaient invisibles à cause du `hidden md:flex` sur `Navbar.tsx:28`, et aucune alternative mobile n'existait.
  - Solution choisie par Pauline parmi 3 options : **menu hamburger** (drawer glassmorphism) — choix motivé par sa volonté d'ajouter d'autres onglets à terme.
  - Implémentation : bouton `Menu`/`X` (lucide) visible uniquement < 768px, drawer absolu sous la navbar avec `bg-white/70 backdrop-blur-xl` (opacité bumpée après retour visuel de Pauline — `bg-white/20` initial était illisible sur fond rose). Texte slate-700/900 sur fond clair, white/80 sur fond sombre. Fermeture au clic sur lien et au clic en dehors (handler `mousedown` sur `document`).
  - Bug TS préexistant fixé au passage : `Cloud`/`CloudOff` recevaient `title=` non typé par Lucide — wrappés dans `<span title="...">`.
  - `pnpm check` passe ✅, `pnpm build` passe ✅ (5.51s).

**Déploiement :**
- Commit `4da48fa` poussé sur `main` (clone GitHub).
- Découverte : aucun auto-deploy GitHub → Vercel actif sur ce projet (le seul workflow `ci-pr.yml` est sur `pull_request` uniquement, et son path est désaligné `Projects/` vs `02-PROJECTS/`). Pas un blocage aujourd'hui mais à savoir pour les futures sessions.
- Deploy via `vercel --prod` : `dpl_GCM7FGVYmUFjYMvyxVNtgNW19gHh` (build 23s, total 45s).
- Smoke test prod `https://systema-agency.vercel.app/` → HTTP 200, nouveau bundle servi.

**Statut :** ✅ déployé, GitHub aligné, validé visuellement par Pauline en local avant deploy.

---

## 2026-04-26 (suite — fix auto-deploy GitHub ↔ Vercel)

**Session :** Activation de l'auto-deploy Vercel sur push GitHub

**Constat de départ :** aucun lien entre push sur `main` et déploiement Vercel. À chaque session : `vercel --prod` manuel obligatoire. Le seul workflow (`ci-pr.yml`) avait en plus un path désaligné (`Projects/` au lieu de `02-PROJECTS/`).

**Ce qui a été fait :**
- Connexion native Vercel → GitHub via `vercel git connect https://github.com/paulineduluc07-svg/Systema-Central-Continuum.git` (CLI, sans interaction).
- Config **Root Directory = `02-PROJECTS/Systema-Agency/Code`** côté dashboard Vercel (Pauline). Premier essai foiré : un espace s'était glissé devant `02-PROJECTS` (collé depuis Claude). Repris à la main, OK au 2e save.
- Fix `ci-pr.yml` : tous les paths `Projects/Systema-Agency/...` → `02-PROJECTS/Systema-Agency/...` (push commit `10b10c9`).
- Test : commit `10b10c9` a déclenché un auto-deploy Vercel ✅ (la connexion fonctionne) — mais build en Error car Root Directory pas encore fixé. Une fois la config corrigée, redeploy via CLI = `dpl_lv05zrouf` Ready en 46s.

**Conséquence :**
- À partir de maintenant, **tout push sur `main`** qui touche `02-PROJECTS/Systema-Agency/Code/` déclenche un build + deploy prod automatique.
- Plus besoin de `vercel --prod` manuel à chaque session.
- La règle de NOTES.md « tout vercel --prod doit être suivi d'un push GitHub » devient implicitement satisfaite : la prod = le contenu de `main` sur GitHub.
