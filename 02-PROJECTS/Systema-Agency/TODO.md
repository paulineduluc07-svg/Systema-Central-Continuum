# TODO — Systema-Agency
> Prochaines actions et backlog actif. Mettre à jour à chaque session.

---

Suivi court des prochaines actions. Les details historiques vivent dans Git.

---

## Regles actives

- A chaque action reelle : garder `TODO.md`, `NOTES.md` et `WORKLOG.md` courts et alignes.
- Synchroniser `Mon disque\SCC` et `SCC-github-clone` avant de cloturer.
- Utiliser le clone `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency` pour build/test/Git.
- Ne pas ajouter de nouvelle grosse fonctionnalite tant que la base courante n'est pas propre.

---

## Chantier réparations (audit complet — 4 carnets)

Réparations exécutées par priorité (détail : `CORRECTIONS_A_FAIRE.md`, `AUDIT_CODE.md`, `AUDIT_CLONE.md`, `AUDIT_AGENT_PLANS.md`).

- [x] **P1** — Purger la copie `Code/` périmée + `node_modules` du Drive. Règle : docs = Drive, code = clone. (2026-06-09)
- [x] **P2** — Nettoyer la doc (Kim/Suivi sortis, vraies features) dans README/NOTES/TODO/BRIEF_IA **côté Drive**. (2026-06-09)
- [x] **P3** — Supprimer le code mort (RPG/vision-board + restes Kim + backend orphelin), −3219 lignes, tests verts. Commit local `fb26a6e`. (2026-06-09)
- [x] **P4 — GitHub** : docs propagées Drive→clone, push `main`, repo resté PUBLIC (décision), HomeV2 `/v2` supprimée, 9 branches mortes supprimées (il ne reste que `main`), `.gitignore` global notes perso. (2026-06-09 → 2026-06-10)
- [x] **P5 — Migrations + workflow DB** : option A actée — pas de migrations automatiques (`schema.ts` = source de vérité + SQL manuel). `db-push.yml` + script `db:push` supprimés, `relations.ts` supprimé, migration orpheline archivée. Commit `b88db68`. (2026-06-10)
- [ ] (Reporté — décision 2026-06-10 : URL MCP publique gardée telle quelle) Fuite lecture MCP.
- [ ] **Reste du ménage** (détail : `CORRECTIONS_A_FAIRE.md` G4-G7) : page `/v1` à clarifier, `.env.example` OpenAI, CI `ci-pr.yml` jamais exécutée (mauvais emplacement), docs racine, rangement AGENT_PLANS.

---

## Etat valide

- Prod active : `https://systema-agency.vercel.app`.
- Auth email/mot de passe fonctionnelle.
- Sync cloud fonctionnelle apres login.
- Notes volantes desktop `/notes` livrees, corrigees et validees visuellement.
- Agenda hebdomadaire `/agenda` livre : evenements, objectifs et habitudes persistants par semaine.
- Serveur MCP Systema expose `/mcp`; lecture sans secret, writes prod valides avec secret.
- CustomTabs visibles dans la nav via `/tab/:tabId`; widgets tasks/notes fonctionnels.
- Notes volantes : deux types `note` / `task` choisis au FAB; pastille rend uniquement le contenu pertinent (texte libre OU checklist).
- _(Historique — cette home V4 vivait sur `/v2`, supplantée par le Cosmos ; page supprimée le 2026-06-10)_ Home `/` remplacee par le dashboard V4 modifie : navbar home retiree, logo agrandi, pastilles holo utilisees comme navigation interne, raccourcis reserves aux sites web, news allongees, projets allonges, agenda/stat/greeting/search retires.
- Home dashboard dynamique livre (PR `e4782c5`) : raccourcis editables, meteo reelle, news/projets via MCP, persistes dans la table `home_data`.
- Home background 05-06 applique globalement : image immersive commune, home alignee sur le modele Pauline avec 3 panneaux glassmorphism et decorations PNG.
- **Page d'accueil `/` = dashboard cosmos « meteo cosmique & biologique »** (9 cartes reelles React/TS, validees vs Python). Deploye et live le 2026-06-06 (commits `86427a9`, `b2d9382`).

---

## Priorite immediate (avant toute nouvelle feature)

- [x] **Reparer la dependance `@neondatabase/serverless` non resolue par Node 24 + pnpm**. Cause confirmee : `node_modules` du clone avait ete installe depuis WSL, donc les liens pnpm etaient lisibles par WSL mais pas par PowerShell. Correction : suppression du `node_modules` WSL, reinstall depuis PowerShell via `corepack pnpm install --frozen-lockfile`. Validation PowerShell : import Neon OK et `node --env-file=.env scripts/apply-home-data-migration.mjs` OK.
- [x] Exposer `pnpm` cote Windows : `pnpm@10.4.1` installe dans `C:\Users\pauli\AppData\Local\pnpm`, chemin ajoute au PATH utilisateur, shims `.ps1` retires pour laisser PowerShell utiliser `pnpm.cmd` sans modifier l'execution policy.
- [x] Documenter dans `NOTES.md` la marche a suivre pour les migrations DB futures.

---

## Prochaines passes

### Dashboard cosmos (page d'accueil `/`)

- [x] Porter les 10 cartes Flask en React/TS, validees chiffre/chiffre vs Python. — 2026-06-06
- [x] Remplacer skyfield par `astronomy-engine`, look Sanctuary, deploiement Vercel. — 2026-06-06
- [ ] Cartes encore toc a rendre reelles (optionnel) : 🐣 tamagotchi, 🌟 oracle, 🔮 tarot.
- [ ] Quand les regles de Paw arrivent : cliquer « mes regles ont commence aujourd'hui » sur la carte Cycle (ancre `cycle_jour1`).

### Home dashboard

- [x] Implementer la V4 modifiee selon les annotations de Pauline.
- [x] Passer les pastilles holo en boutons vers les pages Systema et reserver les raccourcis aux sites web.
- [x] Raccourcis editables, meteo reelle, news/projets dynamiques via MCP livres (table `home_data` migree).
- [x] Appliquer le background global `background-05-06.png` et reproduire la structure du modele `homepage` : barre haute, bulles nav, 3 panneaux, decorations.
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

### MCP Systema

- [x] Ajouter `SYSTEMA_MCP_USER_OPEN_ID` dans Vercel.
- [x] Generer et ajouter `SYSTEMA_MCP_SECRET` dans Vercel.
- [x] Tester `tools/list` et un write HTTP avec header secret apres deploy.
- [x] Configurer l'agent MCP externe avec l'URL `https://systema-agency.vercel.app/mcp?secret=<secret>`.

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
- pnpm/Node 24 2026-05-04 : `ERR_MODULE_NOT_FOUND` sur `@neondatabase/serverless` quand `node_modules` était installé depuis WSL. **✅ RÉSOLU 2026-05-07** : réinstall depuis PowerShell via `corepack pnpm install --frozen-lockfile` (détails dans « Priorite immediate »).