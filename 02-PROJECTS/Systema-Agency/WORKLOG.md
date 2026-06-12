# WORKLOG — Systema-Agency
> Journal de bord session par session. Format : Date → Action → Impact → Prochaine étape.

---

Journal court. Garder seulement les faits utiles a la reprise.
(Élagué le 2026-06-10 — le détail complet des vieilles sessions vit dans l'historique git de ce fichier.)

---

## 2026-06-12 - Images dans le Prompt Vault LIVRÉES 🖼 (session cloud) + agent courrier décidé

- **Décision agent courrier** : paw crée un schedule Cowork (Gmail déjà connecté, MCP `?secret=` déjà patché pour Cowork) — prompt fourni, rien à coder côté repo.
- **Feature images Prompt Vault** codée après maquette HTML validée par paw : champ `images: string[]` par prompt (URLs dans le snapshot JSON existant — PAS de base64 dans le blob, ça aurait alourdi chaque sauvegarde auto), stockage **Vercel Blob** (`@vercel/blob` ajouté).
- Serveur : routeur tRPC `vaultImages` (`upload` + `remove`, protectedProcedure, fail-closed si `BLOB_READ_WRITE_TOKEN` absent, max 3 Mo, chemin `prompt-vault/<userId>/`, remove refuse les URLs hors préfixe). 5 tests ajoutés (`server/vaultImages.test.ts`).
- Client (`PromptVault.tsx`) : dropzone drag & drop dans les formulaires nouveau/édition (redimensionnement canvas 1280px → WebP avant upload, GIF passés tels quels), vignettes 64px sur les cartes (max 4 + tuile « +N »), lightbox plein écran avec navigation ‹ › et clavier, nettoyage des blobs orphelins (annulation de formulaire, retrait d'image, suppression de prompt).
- `pnpm verify:full` vert (tsc + 32 tests + build). Session cloud Claude : travail sur branche `claude/dev-session-startup-ykz37y`, **PR #23 mergée en squash sur main (`5fbf1f6`) sur feu vert de paw**, CI verte sur main.
- **Blob store créé par paw dans Vercel** (accès public assumé — même modèle que l'URL MCP : URLs imprévisibles, write/delete derrière l'auth).
- **Incident post-merge (RÉSOLU)** : premier test d'upload silencieusement raté → cause : store créé mais token absent des env vars. Deux correctifs : (1) les erreurs d'upload s'affichent maintenant sous la dropzone (PR #24, avant elles étaient avalées en silence) ; (2) « Connect Project » du store n'a injecté que `BLOB_STORE_ID` + `BLOB_WEBHOOK_PUBLIC_KEY` — **`BLOB_READ_WRITE_TOKEN` ajouté À LA MAIN par paw** + redeploy. **Upload testé et validé en prod par paw.** Leçons : vérifier les env vars après un Connect Project ; jamais de catch silencieux sur une action utilisateur.

Prochaine étape : paw crée le schedule Cowork de l'agent courrier (prompt déjà fourni) — le widget 💌 de la Home attend.

---

## 2026-06-10 (3ᵉ session) - Home Dollhouse Y2K livrée + fix date Cosmos

- **Fix bug rapporté par paw** : `new Date()` figé au montage de `Cosmos.tsx` — page ouverte passé minuit = cartes sur la veille. Hook `useAujourdhui` (vérif chaque minute + retour d'onglet), extrait ensuite dans `hooks/useAujourdhui.ts` (partagé Cosmos + Home).
- **Carte Tarot du jour** : construite (tirage déterministe seedé par la date) puis **retirée à la demande de paw** (Cosmos jugé surchargé) — commits `ef5727b` + revert `15ee20b`, code récupérable dans l'historique.
- **Nouvelle page d'accueil `/` = Dollhouse Y2K** (commit `bcbb22f`) : portée du handoff `RESSOURCES/AGENT_PLANS/design_handoff_home_dollhouse` (export AI Studio). Agenda panorama + objectifs branchés aux VRAIES données (`lib/agendaWeek.ts` extrait de `Agenda.tsx`, partagé entre les 2 pages), post-it « priorités célestes » = tâches tab `home-priorites`. Jouets déco : flip phone, tamagotchi, music player, papillons. Restes de boutique du template jetés.
- **Home v2** (commit `61a2fb5`) : bandeau métrique du bas supprimé ; **Briefing du jour déménagé du Cosmos au centre de la Home** (`OracleBriefing`, `BriefingCard` supprimé) ; écriture depuis le panorama (＋ événement par jour, × retrait, titres objectifs éditables, ajout d'items) ; fenêtre « new message » = **courrier** : affiche la note la plus récente du tab `home-courrier` (l'agent quotidien écrira via `create_note` MCP existant).
- **Navbar 5 pastilles** : Accueil → `/` (le href `/v2` fossile causait un 404 à chaque clic — réparé), ✨ Cosmos → `/cosmos`, Notes, Agenda, Vault. `/v1` et `/v2` redirigent vers `/`.
- 4 commits poussés (`ef5727b`, `15ee20b`, `bcbb22f`, `61a2fb5`), CI verte, vérifié tsc + 26 tests + build à chaque étape.

Prochaine étape : **agent courrier quotidien** (lit Gmail → dépose le résumé dans `home-courrier`) + **images dans le Prompt Vault**.

---

## 2026-06-10 (2ᵉ session) - Les 3 dernières décisions tranchées → AUDIT JUIN CLOS

- **CI activée pour vrai** (commit `779e64b`) : `ci-pr.yml` déplacé de `Code/.github/` vers `.github/workflows/` racine, déclencheur `push` sur main ajouté (paw pushe sans PR — l'ancien trigger PR-only n'aurait jamais tourné), Node 20→24. **Premier run de l'histoire du repo : vert en 42 s** ; verte sur les 3 pushes de la session.
- **Page legacy `/v1` `Home.tsx` supprimée** (commit `c6b5b23`, **−1203 lignes**) : la toute première page du projet. Avec elle : `GlobalBackupPanel` (UI export/import, que sur /v1), `useDataMigration` (migration localStorage→DB finie), test e2e du panneau. Tes données et pages vivantes intactes.
- **3 backends orphelins retirés** (commit `4f37b79`, **−737 lignes**) : `home_data` (4 tools MCP `get/set_home_*`, router tRPC `home`, helpers db, table drizzle, migration 0007 + script), `backup` (router export/import + schemas + const + helpers + test), `migration` (router + test + mocks e2e). Tests 33→26 (les 7 retirés testaient les routers morts). tsc/tests/build verts à chaque étape, CI verte derrière.
- ⚠️ Reste : table `home_data` encore dans Neon (le code n'y touche plus) — `DROP TABLE home_data;` manuel optionnel (option A).

Statut : **audit juin 2026 terminé à 100%** (hors décisions mineures volontairement laissées : BRIEF_IA versionné ou non, items 🔵). Prochaine étape : mise à jour finale de STACK.md (faite dans la foulée) ; ensuite, place aux features.

---

## 2026-06-10 - Réparations P4 fin + P5 + ménage final (audit terminé)

- **P4 fin** : page legacy `HomeV2.tsx` (`/v2`) supprimée (commit `c77cd30`) ; 9 branches mortes supprimées après vérification (`cleanup/dead-code` était 100% redondante avec P3) — il ne reste que `main`.
- **Audit de revérification complet** : tout le travail P1-P4 confirmé sain. 1 raté trouvé et corrigé : `Code/README.md` jamais nettoyé par P2 (Suivi encore listé en feature) → réécrit (commit `0d7958d`). Drift doc `/v2`/« 10 cartes » corrigé (NOTES/TODO, Drive + clone).
- **P5 — DB (option A actée)** : pas de migrations automatiques. `schema.ts` = source de vérité, changements = SQL manuel volontaire. `db-push.yml` + script `db:push` supprimés, `relations.ts` supprimé, `0001_suivi_entries.sql` archivée (commit `b88db68`). Découverte : les workflows GitHub étaient dans `Code/.github/` (pas la racine) → la CI `ci-pr.yml` n'a JAMAIS tourné.
- **Ménage G4-G7** : `.env.example` purgé (OpenAI + VITE_APP_PASSWORD morts), DEV-SETUP corrigé (port 3000, chemin clone), i18n FR (NotFound/ErrorBoundary/`lang="fr"`), imports `db.ts` consolidés, patch wouter mort supprimé (`__WOUTER_ROUTES__` utilisé nulle part), READMEs créés (RESSOURCES/Livrables/Assets), AGENT_PLANS rangé (`done/` + handoff aplati), WORKLOG élagué. Vérifié : `SECRETS.md` jamais commité ni dans l'historique.
- ⚠️ À trancher : `home_data` (news/raccourcis/projets MCP) n'a plus d'UI depuis la suppression de HomeV2 ; sort de `/v1` (`Home.tsx`) ; CI réelle ou pas.

Statut : **audit juin 2026 réparé à ~95%**. Décisions restantes dans `AUDIT/AUDIT JUIN 2026/CORRECTIONS_A_FAIRE.md`.

---

## 2026-06-09 - Réparations audit P1→P4 (purge Drive, doc, code mort, GitHub)

- **P1** : copie `Code/` périmée + `node_modules` purgés du Drive (un `pnpm dev` tournait depuis le Drive — arrêté). Règle actée : **docs = Drive, code = clone**.
- **P2** : doc nettoyée côté Drive (Kim/Suivi sortis, vraies features) dans README/NOTES/TODO/BRIEF_IA.
- **P3** : code mort supprimé, **−3219 lignes** (cluster RPG/vision-board, restes Kim, backend orphelin, PasswordGate). tsc/build/33 tests verts. Commit `fb26a6e`.
- **P4 (gros du chantier)** : 4 carnets d'audit consolidés en liste maître `CORRECTIONS_A_FAIRE.md` ; docs propagées Drive→clone ; notes perso Anima protégées (`.gitignore` global `**/NOTES_DE_PAULINE.md` + untrack) ; `.gitattributes` eol=lf ; config OpenAI morte retirée d'`env.ts`. **6 commits poussés sur main** (`046e014..f18c993`). Décision : repo reste PUBLIC.

---

## 2026-06-06 - Dashboard cosmos en page d'accueil + déploiement

- Dashboard « météo cosmique & biologique » (ex-Flask Python) porté en React/TS comme page d'accueil `/` — 9 cartes validées chiffre/chiffre vs le Python, look « Sanctuary » néo-brutaliste (`cosmos.css` scopé). `astronomy-engine` remplace skyfield (précision au degré sans fichier NASA de 17 Mo).
- Cycle persisté via colonne `cycle_jour1` ajoutée À LA MAIN sur Neon — pas de `drizzle migrate` sur la DB partagée dev/prod.
- Commits `86427a9` + `b2d9382` (PR #20 : retrait refs Kim/Suivi). **Confirmé LIVE en prod par Pauline le 2026-06-07.**

---

## Mai 2026 — condensé (détail : historique git de ce fichier)

- **2026-05-07** : barre rose unifiée (navbar pilule CSS + fond séparés, commit `79680e3`) ; cartes home agrandies (`8c1d27c`) ; background global ; **fix pnpm/Node 24 Windows** (node_modules WSL → réinstall PowerShell, règle : tout depuis le clone).
- **2026-05-04** : home dashboard dynamique livré (PR `e4782c5`) — table `home_data` + tools MCP set_home_news/projects/shortcuts + refonte HomeV2.
- **2026-05-03** : home V4 (`75dd45d`) ; notes volantes split note/tâche (`237bdea`) ; **Agenda Liquid Week livré** (`7a49b4e`, table `agenda_week_data`).
- **2026-05-02** : customTabs visibles dans la nav (`/tab/:tabId`) ; **MCP writes livrés en prod** (auth secret fail-closed, header + `?secret=` query param pour Cowork, 20 tools, commit `0a000dd`).
- **2026-05-01** : login réparé en prod (`7d5a33e`) ; notes volantes stabilisées ; serveur MCP Systema créé (lecture docs projet).

---

## Avril 2026 — condensé

- **2026-04-29** : notes volantes Passe A (table `floating_notes`, page `/notes`).
- **2026-04-27/28** : Kim ajouté dans Systema (`/kim`, OpenAI) — retiré depuis, vit dans le projet séparé Anima Ingenium. Règle sync : build/test/Git depuis `SCC-github-clone`, jamais le Drive.
- **2026-04-25** : auth + sync restaurées en prod (`VITE_APP_ID`, imports ESM Vercel).
