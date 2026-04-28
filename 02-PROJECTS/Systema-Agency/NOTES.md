# NOTES - Systema-Agency

Décisions, repères actifs, règles de travail spécifiques au projet.

---

## Routes de l'app (2026-04-25)

Pages accessibles dans l'app :

| Route | Page | Lien dans la navbar ? |
|---|---|---|
| `/` | **HomeV2** — page principale (page blanche, fond cyberpunk rose) | Oui (clic sur le brand « Systema Agency ») |
| `/prompt-vault` | Prompt Vault — bibliothèque de prompts | Oui |
| `/suivi` | Suivi médicament | Oui |
| `/v1` | **Ancienne home** (Home.tsx, préservée intacte) | ❌ **Non, accès uniquement par URL directe** |

**Pour accéder à l'ancienne home :** taper directement `https://systema-agency.vercel.app/v1` dans la barre d'adresse.

---

## Règle de déploiement (révisée 2026-04-26)

**Voie nominale : push sur `main` (clone GitHub) → auto-deploy Vercel.** Activé le 2026-04-26 via `vercel git connect` + Root Directory `02-PROJECTS/Systema-Agency/Code` configuré côté dashboard Vercel. Plus besoin de `vercel --prod` manuel.

**Workflow standard :**
1. Modifier le code dans `Mon disque\SCC\02-PROJECTS\Systema-Agency\Code\`.
2. Synchroniser les fichiers modifiés vers `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency\Code\`.
3. Commit + push depuis le clone.
4. Vercel pickup automatiquement et déploie. Vérifier `vercel list` pour le statut.

**Voie de secours `vercel --prod` :** reste utilisable pour un déploiement urgent sans passer par GitHub. Dans ce cas (exception), la règle historique s'applique encore : push GitHub immédiatement après pour ne pas laisser de désalignement.

**Pourquoi cette règle existe :** la session 2026-04-24 V2 a découvert un désalignement majeur (~35 fichiers `Code/`) entre SCC local et GitHub, causé par des `vercel --prod` répétés sans push derrière. Avec l'auto-deploy actif, la prod = le contenu de `main` par construction — le risque disparaît tant qu'on passe par la voie nominale.

---

## Architecture du déploiement (rappel)

- **Source de vérité :** `C:\Users\pauli\Mon disque\SCC\02-PROJECTS\Systema-Agency\Code\` (Google Drive)
- **Mirror Git :** `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency\Code\` (clone GitHub local, hors Drive)
- **Vercel project :** `systema-agency` (`prj_MItem6qcJ1qyPagYOXvl1zocFnVo`), team `wakH3yBoFVvsfciHWEVnr3YQ`
- **Deploy command :** `vercel --prod` depuis `Code/` (utilise `.vercel/project.json` pour identifier le projet)
- **Build sur Vercel :** `pnpm install` + `pnpm run build:client`, output `dist/public`
- **URL prod :** `https://systema-agency.vercel.app` + alias `https://systema.enterprises`

---

## Variables d'env requises pour l'auth (2026-04-25)

Le serveur signe les sessions JWT avec un payload `{ openId, appId, name, exp }`. La fonction `verifySession` (`server/_core/sdk.ts`) **rejette** tout JWT dont `appId` est vide. Donc **les 5 variables suivantes doivent être définies dans Vercel Production** sinon l'auth casse silencieusement :

- `OWNER_EMAIL`
- `OWNER_PASSWORD`
- `JWT_SECRET`
- `DATABASE_URL`
- `VITE_APP_ID` ← oublié historiquement, ajouté en 2026-04-25 (`systema-agency`). Sans cette variable, chaque login pose un cookie qui sera rejeté à la requête suivante.

À vérifier en début de session si l'auth recasse : `vercel env ls production` doit lister les 5.

---

## Imports relatifs en prod Vercel (2026-04-25)

Vercel exécute les API routes (`api/**/*.ts`) en **Node ESM strict**. Sans bundler, ce runtime n'accepte ni les imports relatifs sans extension `.js`, ni les alias TypeScript (`@shared/...`, `@/...`).

**Règle :** dans tous les fichiers de la chaîne d'imports d'`api/**/*.ts` (donc `api/*` + tout `server/*` qu'ils tirent + `shared/*`), les imports relatifs doivent finir par `.js` et les alias `@shared/...` / `@/...` doivent être remplacés par des chemins relatifs.

Le `tsconfig.json` est en `moduleResolution: "bundler"`, ce qui marche en dev (vite/tsx résolvent) mais casse en prod sans bundler. Si on veut un jour récupérer les alias, il faudra ajouter un step esbuild dans le `buildCommand` Vercel qui bundle les API routes.

---

## Limitation locale connue

Le `node_modules/` du projet sur Google Drive est sujet à corruption partielle (sync Drive incomplet) — packages comme `@epic-web/invariant`, `esbuild`, `rollup` peuvent être manquants au runtime.

**Conséquence :** `pnpm dev` local échoue par moments, ce qui bloque les tests visuels avant deploy.

**Workaround :** `vercel --prod` ne dépend pas du `node_modules` local (Vercel fait sa propre install dans le cloud), donc le deploy reste fonctionnel.

**Solution permanente documentée dans `Code/DEV-SETUP.md`.**

**Décision pratique 2026-04-27 :** pour les validations techniques fiables (`pnpm check`, `pnpm build`), utiliser en priorité le clone hors Drive :
`C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency\Code`.

Raison : `node_modules` dans Google Drive se corrompt ou devient incomplet trop facilement, surtout pour les dépendances natives optionnelles comme Rollup/esbuild. Le dossier Google Drive reste la source de travail/documentation SCC, mais le clone GitHub est l'environnement de build/test le plus stable.

---

## `.env` local = vars de prod (2026-04-26)

Le `.env` local de `Code/.env` a été créé via `vercel env pull --environment=production`. Conséquence importante :

**Le dev local utilise les mêmes credentials et la même DB Neon que la prod.** Toute donnée créée/modifiée en `pnpm dev` (notes, prompts, prises de médicament, sessions) **va en prod**.

C'est volontaire — Pauline travaille avec la même base partout — mais à garder en tête : ne pas créer de données de test en local. Si on veut un jour une DB de dev séparée, il faudra créer une nouvelle base Neon et mettre son URL uniquement dans `.env` local.

---

## Navbar responsive (2026-04-26)

`Navbar.tsx` a un comportement responsive :
- **≥ 768px (md)** : liens nav inline à côté du brand.
- **< 768px** : un bouton hamburger (`Menu`/`X` lucide) ouvre un drawer glassmorphism positionné en absolu sous la navbar. Fond `bg-white/70 backdrop-blur-xl` (testé visuellement : `bg-white/20` initial illisible sur fond rose). Fermeture au clic sur un lien et au clic en dehors (handler `mousedown` sur `document` via `useEffect` conditionnel).

Pour ajouter un nouvel onglet : ajouter une entrée à `navLinks` (ligne 14) — il apparaît automatiquement dans les deux modes.

---

## Kim intégrée dans Systema (2026-04-27)

Décision : intégrer Kim comme agente active dans `Systema Agency`, mais par petites passes fermées.

Architecture réelle actuelle :
1. Page `/kim` pour discuter avec Kim.
2. Serveur tRPC comme couche de sécurité.
3. OpenAI appelé côté serveur seulement.
4. `OPENAI_API_KEY` configurée en Vercel Production.
5. Kim répond en prod.
6. Kim peut déjà ajouter des prompts dans Prompt Vault via un outil serveur `promptVault.addPrompt`.

Ce qui est en place :
- route `/kim` ajoutée ;
- lien « Kim » ajouté dans la navbar ;
- endpoint protégé `ai.chat` ajouté ;
- `server/ai/kim.ts` ajouté ;
- appel OpenAI côté serveur seulement ;
- création de prompt dans Prompt Vault avec titre, contenu, catégorie et tags ;
- confirmation affichée dans `/kim` après ajout ;
- cache client Prompt Vault invalidé après action Kim.

Règles actives :
- aucune clé OpenAI dans le navigateur ;
- `OPENAI_API_KEY` doit rester configurée côté serveur/Vercel ;
- Kim ne peut pas encore créer de notes ou tâches ;
- Kim ne peut pas encore modifier ni archiver ;
- suppression directe interdite au départ.

Point à corriger côté UI :
- le texte visible dans `/kim` dit encore « Passe 1 : conversation active seulement », ce qui n'est plus exact depuis l'ajout de `promptVault.addPrompt`.

---

## Règle de synchronisation documentaire (2026-04-27)

Chaque passe ou action réelle doit laisser une trace dans les dossiers actifs, sinon on perd du temps à revérifier l'état réel.

Règle obligatoire en fin de passe :
1. Mettre à jour `TODO.md` si une tâche change d'état.
2. Mettre à jour `NOTES.md` si une décision, règle, limite ou vérité active change.
3. Mettre à jour `WORKLOG.md` si une action réelle a été faite.
4. Synchroniser `C:\Users\pauli\Mon disque\SCC` avec `C:\Users\pauli\SCC-github-clone`.
5. Vérifier que la prod, le repo et la documentation ne racontent pas trois histoires différentes.
