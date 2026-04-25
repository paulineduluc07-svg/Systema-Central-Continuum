# NOTES - Systema-Agency

Décisions, repères actifs, règles de travail spécifiques au projet.

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

## Limitation locale connue

Le `node_modules/` du projet sur Google Drive est sujet à corruption partielle (sync Drive incomplet) — packages comme `@epic-web/invariant`, `esbuild`, `rollup` peuvent être manquants au runtime.

**Conséquence :** `pnpm dev` local échoue par moments, ce qui bloque les tests visuels avant deploy.

**Workaround :** `vercel --prod` ne dépend pas du `node_modules` local (Vercel fait sa propre install dans le cloud), donc le deploy reste fonctionnel.

**Solution permanente documentée dans `Code/DEV-SETUP.md`.**
