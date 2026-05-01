# DEV-SETUP — Faire tourner Systema Agency en local

Ce document explique tout ce qui est nécessaire pour démarrer le serveur de développement
local depuis le dossier `Code/`. Sert de référence pour réparer une install cassée.

---

## 1. Pré-requis système

| Outil | Version | Vérification |
|---|---|---|
| Node.js | ≥ 22 (testé avec 24.14.1) | `node -v` |
| pnpm | ≥ 10.4 | `pnpm -v` ou installation via `corepack enable && corepack prepare pnpm@10.4.1 --activate` |
| Git | n'importe quelle récente | `git --version` |

Si `pnpm` n'est pas global, le projet le contient en devDependency : on peut donc lancer
les scripts via `corepack pnpm <script>` ou via le binaire local
`./node_modules/.bin/pnpm.cmd` (Windows) après une première install.

---

## 2. Réparer un `node_modules` cassé

### Symptômes observés (2026-04-24)
Le projet est stocké sur Google Drive (`C:\Users\pauli\Mon disque\SCC\…`).
Le sync Drive a partiellement copié `node_modules/.pnpm/`, ce qui produit des erreurs
au démarrage du serveur :

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@epic-web/invariant' …
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'esbuild' …
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'rollup' …
```

### Procédure de réparation

1. **Mettre Google Drive en pause** (clic droit sur l'icône Drive → « Suspendre la
   synchronisation ») pendant toute la durée de l'install pour éviter que Drive ne
   réécrive les fichiers pendant que pnpm les pose.

2. **Supprimer le `node_modules` cassé** :
   ```powershell
   cd "C:\Users\pauli\Mon disque\SCC\02-PROJECTS\Systema-Agency\Code"
   Remove-Item -Recurse -Force .\node_modules
   ```

3. **Réinstaller proprement** :
   ```powershell
   pnpm install
   # ou si pnpm n'est pas global :
   corepack pnpm install
   ```
   Compter 5 à 10 minutes (Drive accélère après pause, mais reste lent).

4. **Reprendre la sync Google Drive** une fois l'install terminée.

### Alternative : travailler depuis le clone hors Drive
Le repo GitHub local `C:\Users\pauli\SCC-github-clone\` est hors Google Drive.
On peut y faire `pnpm install` une fois (rapide), puis basculer le travail là-bas
si Drive cause trop de problèmes. Le coût : il faut synchroniser manuellement les
changements vers la SCC source (`Mon disque\SCC\`) en fin de session.

---

## 3. Variables d'environnement (`.env`)

Le fichier `.env` n'est **pas dans le repo** (gitignored). Pour démarrer le dev
server local, créer un fichier `Code/.env` à partir de `.env.example`.

### Variables minimales requises

| Variable | Source | Notes |
|---|---|---|
| `DATABASE_URL` | Console Neon → projet Systema-Agency → Connection string | Inclure `?sslmode=require` |
| `JWT_SECRET` | Générer une chaîne aléatoire longue | `node -e "console.log(crypto.randomBytes(64).toString('hex'))"` |
| `OWNER_EMAIL` | Email Pauline (login owner) | Le même qu'en prod si tu veux la même DB |
| `OWNER_PASSWORD` | Mot de passe owner | Idem |
| `VITE_APP_ID` | `systema-agency` | Constant |

### Variables optionnelles
Voir `.env.example` pour la liste complète (cookies cross-site, login URL, analytics,
error sink). Pas nécessaires pour un dev local basique.

### Où trouver les secrets de prod
Dans `02-PROJECTS/Systema-Agency/Assets/SECRETS*.md` (gitignored, ne jamais commiter).

---

## 4. Lancer le serveur de développement

Une fois `node_modules` propre et `.env` rempli :

```powershell
cd "C:\Users\pauli\Mon disque\SCC\02-PROJECTS\Systema-Agency\Code"
pnpm dev
```

Sortie attendue : Vite démarre, le serveur Express écoute (port 5000 par défaut, ou
celui défini dans `PORT`). Ouvrir `http://localhost:5000/` dans le navigateur.

### Scripts disponibles (rappel)

| Script | Usage |
|---|---|
| `pnpm dev` | Serveur Express + Vite hot reload |
| `pnpm check` | Type-check TypeScript (`tsc --noEmit`) |
| `pnpm test` | Tests unitaires (vitest) |
| `pnpm test:e2e` | Tests Playwright (e2e) |
| `pnpm build` | Build prod (client + server) |
| `pnpm mcp:systema` | Serveur MCP local Systema Agency en transport `stdio` |
| `pnpm verify:step` | `pnpm test && pnpm build` (cycle de validation rapide) |
| `pnpm verify:full` | `pnpm check && pnpm test && pnpm build` (avant push) |

---

## 4.1 Endpoint MCP public

En dev local, le serveur Express expose aussi l'endpoint MCP Streamable HTTP sur :

```text
http://localhost:3000/mcp
```

En production Vercel, l'URL publique attendue est :

```text
https://systema-agency.vercel.app/mcp
```

La surface MCP reste en lecture seule dans cette passe.

---

## 5. Aperçu visuel sans dev server

Si on veut juste **voir le rendu visuel** d'une page sans démarrer Vite/Express
(par exemple quand `node_modules` est cassé), on peut créer une page HTML statique
dans `client/public/preview-*.html` qui mime la page React en HTML+CSS pur, et
l'ouvrir directement dans le navigateur via `file://`.

C'est ce qui a été fait pour valider visuellement HomeV2 le 2026-04-24 — voir
`client/public/preview-v2.html` (ne pas push vers prod, fichier de debug local).

---

## 6. Déploiement (rappel)

Le déploiement Vercel est **automatique sur push vers `main`** (GitHub Actions →
Vercel). Pas besoin de commande locale, pas besoin de dev server local pour pusher.

URL prod : `https://systema-agency.vercel.app` (et alias `systema.enterprises`).

---

*Dernière mise à jour : 2026-04-24*
