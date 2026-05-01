# TODO - Systema-Agency

## En cours

### Kim intégrée dans Systema — état réel vérifié
- [x] Ajouter une page `/kim` dans l'app.
- [x] Ajouter le lien « Kim » dans la navbar desktop + mobile.
- [x] Brancher un endpoint tRPC protégé `ai.chat`.
- [x] Appeler OpenAI côté serveur uniquement via `OPENAI_API_KEY`.
- [x] Garder Kim en conversation seulement pendant la première passe.
- [x] Validation TypeScript : `pnpm check` OK.
- [x] Ajouter `OPENAI_API_KEY` dans Vercel Production.
- [x] Tester visuellement `/kim` en prod.
- [x] Tester un échange réel avec Kim — confirmé par Pauline, Kim répond.
- [x] Déployer/synchroniser GitHub.
- [x] Permettre à Kim d'ajouter des prompts dans Prompt Vault.
- [x] Mettre à jour le texte visible de `/kim`, qui disait encore « Passe 1 : conversation active seulement » alors que Kim peut déjà ajouter des prompts. (2026-04-28)

### Règle anti-désalignement — active immédiatement
- À chaque passe/action réelle : mettre à jour `TODO.md`, `NOTES.md` et `WORKLOG.md` dans le dossier projet concerné.
- À chaque passe/action réelle : synchroniser SCC local (`Mon disque\SCC`) et clone GitHub (`SCC-github-clone`) avant de clôturer.
- À chaque passe/action réelle : vérifier que la prod, le repo et la documentation décrivent le même état.
- Si Google Drive doit capter une modification dans `Mon disque`, privilégier une synchronisation côté Windows plutôt qu'une écriture WSL directe.

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

#### Étape 3 — Supprimer les boutons obsolètes de la navbar ✅ (2026-04-25)
- [x] Bouton « Lune » (toggle dark mode) retiré de `Navbar.tsx`
- [x] Bouton « Réglage » (gear settings) retiré de `Navbar.tsx`
- [x] Imports morts nettoyés dans `Navbar.tsx` : `Moon`, `Sun`, `Settings`, `Home` (lucide-react), `useSyncedPreferences`, `AdminPanel`, state `isAdminOpen`. `useSyncedPreferences` reste utilisé ailleurs (MainLayout, useSyncedData) donc le hook lui-même est conservé.
- [x] **Validation Pauline :** navbar nettoyée, les deux icônes parties, aucune ligne morte côté Navbar.

#### Étape 4 — Supprimer le lien « Accueil » de la navbar ✅ (2026-04-25)
- [x] Item « Accueil » retiré de `navLinks` dans `Navbar.tsx`. Reste : « Systema Agency » (brand → `/`) + « Prompt Vault » + « Suivi ».
- [x] Décision /v1 (option a) : aucun lien dans la navbar, accès uniquement via URL directe `https://systema-agency.vercel.app/v1`. URL documentée dans `NOTES.md` section « Routes de l'app » pour repère facile.
- [x] **Validation Pauline :** navbar simple, redondance supprimée.

---

### PHASE 2 — Vrai set-up (lance-toi UNIQUEMENT quand Phase 1 est validée par Pauline, sans bug de code)

#### Étape 5a — Notes volantes en widgets déplaçables (priorité haute)
- [x] Implémentation Passe A — desktop (2026-04-29) :
  - Nouvelle table `floating_notes` (Drizzle + migration `0004_floating_notes.sql`)
  - Router tRPC `floatingNotes` (listActive/listArchived/create/update/archive/restore/delete)
  - Page `/notes` (`pages/FloatingNotes.tsx`) avec board free-form, FAB, drawer Tiroir
  - Trois styles glass (neon/frost/holo) + 5 accents (pink/violet/lavender/cyan/mint), grain, grille
  - Persistance optimistic + debounce 600 ms par note
  - Lien « Notes » ajouté dans la navbar (icône StickyNote)
- [x] Migration `floating_notes` appliquée sur Neon via `scripts/apply-floating-notes-migration.mjs` (2026-04-29).
- [x] `pnpm check` + `pnpm build` validés depuis le clone.
- [x] Smoke tests endpoints OK en local et en prod (auth.me 200, floatingNotes.listActive 401 protégé).
- [x] Commit `7d3aa26` poussé sur `main`, auto-deploy Vercel passé. Page accessible : `https://systema-agency.vercel.app/notes`.
- [x] **Validation visuelle Pauline :** confirmée par Pauline le 2026-05-01 sur `https://systema-agency.vercel.app/notes`.
- [x] Scénarios de validation couverts :
  - Créer (bouton + en bas à droite + double-clic sur le tableau)
  - Déplacer (attraper la barre du haut de la note)
  - Redimensionner (coin bas-droit avec les 3 traits)
  - Éditer titre / texte / cocher des cases / ajouter une tâche
  - Archiver (bouton archive dans la barre du haut)
  - Ouvrir le tiroir (bouton « Tiroir » en haut à droite), restaurer, supprimer définitivement
  - **Test sync :** créer → recharger la page → la note doit être à la même place ; ouvrir sur un autre appareil → même état
- [ ] Passe B — vue mobile masonry + bottom sheet (à planifier après validation A).
- **Tech notes :** `react-rnd` non utilisé finalement (les pointer events natifs collent au design handoff) ; le drawer reste simple sans `vaul` pour cette passe.

#### Étape 5b — Espace d'archivage des notes (long terme)
- [ ] Pouvoir archiver une note (la sortir du tableau actif sans la supprimer)
- [ ] Vue d'archives consultable, possibilité de désarchiver
- **Validation Pauline :** flux archivage/désarchivage fonctionnel

#### Étape 5c — Fonctions email sync + autres (Syncer Gmail, Générer mes tâches, Supplément)
- [ ] **Bloqué tant que Phase 1 et 5a-5b ne sont pas vraiment propres** — règle explicite de Pauline
- [ ] Implémenter Syncer Gmail (intégration Gmail API)
- [ ] Implémenter Générer mes tâches (génération IA de tâches)
- [ ] Implémenter Supplément (suivi de prises, à clarifier vs Suivi médicament)

#### Étape 5d — Kim agente active dans Systema
- [x] Passe 1 : conversation dans `/kim`.
- [x] Passe 1b : permettre à Kim de créer des prompts dans Prompt Vault.
- [ ] Passe 2 : permettre à Kim de créer des notes/tâches.
- [ ] Passe 3 : permettre à Kim de modifier/archiver avec confirmation.
- [ ] Suppression directe interdite au départ.

---

### Tâches techniques transverses (à faire au moment opportun)
- [x] Réparer `node_modules` local (`corepack pnpm install` avec Drive en pause — 42.7s) — fait 2026-04-26
- [x] Créer `.env` local — fait 2026-04-26 via `vercel env pull .env --environment=production` (mêmes 5 vars que la prod)
- [x] Créer un serveur MCP TypeScript/Node.js pour exposer le contexte Systema aux clients MCP — fait 2026-05-01 (`pnpm mcp:systema`, SDK `@modelcontextprotocol/sdk`, endpoint public `/mcp`).
- [x] Corriger le modal de connexion non cliquable quand il est rendu dans la navbar `pointer-events-none` — fait 2026-05-01.
- [x] Débloquer le build Vercel après un marqueur texte accidentel dans `FloatingNotes.tsx` — fait 2026-05-01.

## Terminé
- [x] Navbar responsive — menu hamburger glassmorphism en mobile (< 768px), desktop inchangé. (2026-04-26)
- [x] Refonte de l'architecture du layout (Header sticky glassmorphism).
- [x] Déplacement de la navigation dans le header.
- [x] Alignement structurel local complet (RESSOURCES, Livrables).
- [x] Analyse et comparaison avec le dépôt GitHub (Local > GitHub).
- [x] Audit et vérification de la cohérence des instructions (Anima/Agency/Standard SCC).
- [x] Synchronisation complète du SCC local vers GitHub (2026-04-19).
- [x] Mise en place de la protection des secrets sur GitHub via `.gitignore`.
- [x] Restructuration IPARA (01-05).
