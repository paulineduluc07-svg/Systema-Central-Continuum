# TODO - Systema-Agency

## En cours
*(rien — étapes 1 et 2 bouclées en session 2026-04-25)*

## À faire — Plan dicté par Pauline (2026-04-24)

### PHASE 1 — Nettoyage avant tout nouveau set-up (ordre strict)

#### Étape 1 — Réparer la synchronisation appareils + sessions ✅ (2026-04-25)
- [x] Cause racine : la même que l'étape 2 (sans login pas de sync, et le login était cassé en prod). Voir détails étape 2.
- [x] Fix
- [x] **Validation Pauline :** sync ordi ↔ cellulaire validée dans les 2 sens (note créée sur un appareil apparaît sur l'autre).

#### Étape 2 — Réactiver l'authentification email + mot de passe ✅ (2026-04-25)
- [x] Cause racine en deux couches :
  1. La function `/api/trpc/[trpc]` plantait au runtime Vercel (`ERR_MODULE_NOT_FOUND`) à cause d'imports relatifs sans extension `.js` et de l'alias `@shared/...` non résolu en Node ESM strict.
  2. Le JWT de session était signé avec `appId: ""` (variable d'env `VITE_APP_ID` absente dans Vercel) — et `verifySession` rejette tout JWT avec `appId` vide. Donc chaque nouveau login posait un cookie immédiatement invalide.
- [x] Fix appliqué :
  1. `.js` ajouté à tous les imports relatifs de la chaîne `api/trpc/[trpc] → server/routers → server/_core/*` ; alias `@shared/const` remplacé par chemins relatifs ; function wrappée dans une mini-app Express pour fournir `req.body` parsé + `res.cookie/clearCookie`. Commit `2913dd9` sur GitHub.
  2. Variable d'env `VITE_APP_ID="systema-agency"` ajoutée dans Vercel Production + redeploy `dpl_oV6TCiVRRcjGt5o6kzgo88fq4wyH`.
- [x] **Validation Pauline :** logout → login avec credentials → accès complet à l'app + sync cloud active sur ordi et cellulaire.

#### Étape 3 — Supprimer les boutons obsolètes de la navbar
- [ ] Retirer le bouton « Lune » (toggle dark mode) — obsolète, ne fonctionne plus
- [ ] Retirer le bouton « Réglage » (gear settings) — obsolète, ne fonctionne plus
- [ ] Nettoyer les imports morts (`Moon`, `Sun`, `Settings` de lucide-react ; hooks/contexts associés si plus rien ne les utilise)
- **Validation Pauline :** navbar plus propre, les deux icônes ne sont plus là, aucune ligne morte

#### Étape 4 — Supprimer le lien « Accueil » de la navbar
- [ ] Retirer l'item « Accueil » de `navLinks` dans `Navbar.tsx` (le brand « Systema Agency » fait déjà le retour `/`)
- [ ] Vérifier qu'il reste : « Systema Agency » (clic = `/`) + « Prompt Vault » + « Suivi »
- [ ] Décision : ajouter ou non un lien discret vers `/v1` (l'ancienne home n'est accessible qu'à l'URL pour l'instant — Pauline à choisir)
- **Validation Pauline :** navbar simple, redondance supprimée

---

### PHASE 2 — Vrai set-up (lance-toi UNIQUEMENT quand Phase 1 est validée par Pauline, sans bug de code)

#### Étape 5a — Notes volantes en widgets déplaçables (priorité haute)
- [ ] Refondre le « Tableau blanc » actuel en widgets de notes draggables
- [ ] Chaque note = widget glassmorphism, déplaçable librement (drag-and-drop), persistance de la position
- [ ] Style cohérent avec le reste de l'app (glassmorphism rose)
- [ ] Sync inter-appareils (dépend de l'étape 1 réparée)
- **Validation Pauline :** créer une note → la déplacer → recharger la page → position conservée ; ouvrir sur un autre appareil → même état
- **Tech notes :** `react-rnd` est déjà dans `package.json` (drag-and-drop resize), à utiliser. `@dnd-kit/*` aussi présent.

#### Étape 5b — Espace d'archivage des notes (long terme)
- [ ] Pouvoir archiver une note (la sortir du tableau actif sans la supprimer)
- [ ] Vue d'archives consultable, possibilité de désarchiver
- **Validation Pauline :** flux archivage/désarchivage fonctionnel

#### Étape 5c — Fonctions email sync + autres (Syncer Gmail, Générer mes tâches, Supplément)
- [ ] **Bloqué tant que Phase 1 et 5a-5b ne sont pas vraiment propres** — règle explicite de Pauline
- [ ] Implémenter Syncer Gmail (intégration Gmail API)
- [ ] Implémenter Générer mes tâches (génération IA de tâches)
- [ ] Implémenter Supplément (suivi de prises, à clarifier vs Suivi médicament)

---

### Tâches techniques transverses (à faire au moment opportun)
- [ ] Réparer `node_modules` local (procédure dans `Code/DEV-SETUP.md`) — pour pouvoir `pnpm dev` localement et tester avant deploy
- [ ] Créer `.env` local à partir de `.env.example` (DATABASE_URL Neon + JWT_SECRET + OWNER_EMAIL/PASSWORD depuis `Assets/SECRETS*.md`)

## Terminé
- [x] Refonte de l'architecture du layout (Header sticky glassmorphism).
- [x] Déplacement de la navigation dans le header.
- [x] Alignement structurel local complet (RESSOURCES, Livrables).
- [x] Analyse et comparaison avec le dépôt GitHub (Local > GitHub).
- [x] Audit et vérification de la cohérence des instructions (Anima/Agency/Standard SCC).
- [x] Synchronisation complète du SCC local vers GitHub (2026-04-19).
- [x] Mise en place de la protection des secrets sur GitHub via `.gitignore`.
- [x] Restructuration IPARA (01-05).
