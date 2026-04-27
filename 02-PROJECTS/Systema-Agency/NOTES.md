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

## Règle de déploiement (2026-04-24)

**Tout déploiement Vercel CLI (`vercel --prod`) doit être suivi immédiatement d'un push GitHub correspondant.**

**Pourquoi :** la session 2026-04-24 V2 a découvert un désalignement majeur (~35 fichiers Code/) entre SCC local et GitHub. La cause : les sessions précédentes utilisaient `vercel --prod` pour déployer en prod sans synchroniser GitHub derrière. Résultat : prod fonctionnait correctement (déployée depuis local) mais GitHub était figé sur du vieux code, rendant tout futur clone/CI/redéploiement Git-based impossible.

**Comment l'appliquer :**
- Après tout `vercel --prod` réussi → faire immédiatement la synchronisation `SCC → SCC-github-clone` sur les fichiers `Code/` modifiés, puis commit + push.
- En fin de session : vérifier `git status` du clone, ne jamais laisser de divergence non commitée.
- Avant tout deploy : `git status` du clone doit être clean ; si non, sync d'abord.

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
