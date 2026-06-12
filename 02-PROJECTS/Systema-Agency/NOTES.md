# NOTES — Systema-Agency
> Décisions ouvertes et repères actifs. Source de vérité pour les agents.

---

Repères stables et décisions actives. Garder ce fichier court.

---

## Etat actuel

- Production : `https://systema-agency.vercel.app`.
- **Page d'accueil `/` = Home Dollhouse Y2K depuis 2026-06-10** (portée du handoff `design_handoff_home_dollhouse`, composants `client/src/components/home/`). Agenda panorama + objectifs = vraies données (`lib/agendaWeek.ts`, partagé avec `/agenda`), post-it = tâches tab `home-priorites`, courrier 💌 = note la plus récente du tab `home-courrier`, briefing du jour au centre (`OracleBriefing`).
- **Dashboard cosmos sur `/cosmos` depuis 2026-06-10** (porte de L'Ecosysteme holistique en React/TS ; son briefing vit maintenant sur la Home). Cerveaux dans `client/src/lib/cosmos/*.ts`, composants `client/src/components/cosmos/`. Cycle persiste via colonne `cycle_jour1` sur `user_preferences`. Date vivante via `hooks/useAujourdhui.ts`. Carnet : `CARNET-REACT.md`.
- Alias existant : `https://systema.enterprises`; URL d'usage recommandee : `systema-agency.vercel.app`.
- Source SCC : `C:\Users\pauli\Mon disque\SCC\02-PROJECTS\Systema-Agency`.
- Clone Git/build/test : `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency`.
- **Code source = clone UNIQUEMENT** (plus de copie `Code/` dans le Drive depuis 2026-06-09). Règle : **docs = Drive, code = clone**. Dev/build/test → toujours depuis le clone.
- Base de donnees : Neon PostgreSQL partagee entre prod et dev local.
- Plans/patchs agents : `RESSOURCES/AGENT_PLANS/`.
- **Canal Pauline ↔ agent = conversationnel** (décision 2026-06-10) : `NOTES_DE_PAULINE.md` et
  `BRIEF_IA.md` supprimés — paw ne les utilisait pas, elle parle directement à l'agent
  (Claude + mémoire Airtable). Codex/Gemini abandonnés pour le dev.

---

## Routes

| Route | Role | Navbar |
|---|---|---|
| `/` | Home Dollhouse Y2K (panorama agenda, objectifs, post-it, briefing, courrier, jouets) | Oui (Accueil) |
| `/cosmos` | Dashboard cosmos « meteo cosmique & biologique » (8 cartes reelles) | Oui (✨) |
| `/notes` | Notes volantes | Oui |
| `/agenda` | Agenda hebdomadaire Liquid Week | Oui |
| `/prompt-vault` | Bibliotheque de prompts | Oui |
| `/tab/:tabId` | Onglet custom tasks/notes | Oui dynamique |
| `/mcp` | Serveur MCP docs + writes proteges | Non |

_(Pages legacy `/v1` et `/v2` supprimées le 2026-06-10 ; leurs URLs redirigent vers `/`.)_

---

## Auth

Variables Vercel indispensables :
- `DATABASE_URL`
- `JWT_SECRET`
- `OWNER_EMAIL`
- `OWNER_PASSWORD`
- `VITE_APP_ID=systema-agency`

Repères de panne :
- Si login OK mais session invalide : verifier `VITE_APP_ID`.
- Si le modal s'ouvre mais les champs ne prennent pas le focus : verifier que l'overlay de `LoginModal.tsx` garde `pointer-events-auto`.

---

## Home Dollhouse Y2K (`/`, depuis 2026-06-10)

- Composants : `client/src/components/home/` ; styles scopés `.home-root` (`home.css`).
- **Navigation de semaine** (2026-06-12) : flèches ‹ › + label dans la barre de titre du panorama,
  bouton « aujourd'hui » hors semaine courante — même pattern d'état `weekStart` que `Agenda.tsx`.
- **Données réelles** : panorama + objectifs lisent/écrivent la MÊME semaine que `/agenda`
  (`lib/agendaWeek.ts` — même clé localStorage, même tRPC `agenda.get/save`).
  Post-it = `useSyncedTasks("home-priorites")`. Courrier 💌 = note la plus récente de
  `useSyncedNotes("home-courrier")` — **l'agent quotidien Gmail écrira là via MCP `create_note`**.
- **Déco assumée** (pas de backend) : flip phone, papillons, tamagotchi, music player (playlist SoundHelix).
- Écriture agents MCP : `add_agenda_event`, `remove_agenda_event`, `set_agenda_goals`,
  `create_task` (tab `home-priorites`), `create_note` (tab `home-courrier`).

### Historique home (sections closes)

- Anciennes home V4 (`/v2`), page d'origine (`/v1`) et backend `home_data` supprimés le 2026-06-10 (matin) ; `/v1`/`/v2` redirigent vers `/` depuis le soir même.
- La table `home_data` existe encore dans Neon (code n'y touche plus) — `DROP TABLE` manuel optionnel.

---

## Prompt Vault — images (live depuis 2026-06-12)

- Images stockées sur **Vercel Blob** (`@vercel/blob`), URLs référencées dans le champ `images` de chaque prompt du snapshot JSON. Jamais de base64 dans le snapshot (la sauvegarde auto renvoie tout le blob à chaque modif).
- API : tRPC `vaultImages.upload` / `vaultImages.remove` (auth requise). Fail-closed si `BLOB_READ_WRITE_TOKEN` absent. Max 3 Mo, types jpeg/png/webp/gif, chemin `prompt-vault/<userId>/`.
- Client : redimensionnement 1280px max → WebP AVANT upload (GIF non touchés pour garder l'animation). Vignettes visibles seulement — l'upload exige d'être connectée (pas de fallback localStorage pour les images).
- Blob store créé dans Vercel le 2026-06-12 ; accès **public assumé** (URLs imprévisibles, pas de listing — même modèle que l'URL MCP publique). Ne pas uploader d'image contenant une info sensible.

---

## Notes volantes

- Page active : `/notes`.
- Table DB : `floating_notes` avec colonne `kind` (`note` | `task`, default `note`).
- Deux types de pastilles, choisis via le FAB qui se deplie :
  - `note` : titre + zone texte libre. Accent par defaut : lavender.
  - `task` : titre + checklist + bouton `+ tâche`. Accent par defaut : pink.
- Toggle de `kind` exposé en API (`floatingNotes.update`/MCP `update_floating_note`) mais pas dans l'UI; un changement manuel reste possible via MCP si besoin.
- Scrollbar interne cachee (CSS injecte dans la page `/notes`, classe `floating-note-scroll`).
- Tailles de police et padding s'adaptent a la largeur (180-360px).
- Passe A desktop validee.
- Passe B mobile a faire.
- Les notes doivent rester recuperables meme si une position/interaction les coince.

Incident a conserver :
- 2026-05-01 : un marqueur texte accidentel laisse dans `FloatingNotes.tsx` par Gemini a casse le build Vercel. Correction poussee dans `b8214fc`.

---

## Agenda

- Page active : `/agenda`.
- Table DB : `agenda_week_data`.
- Donnees persistees par `weekStart` ISO (`YYYY-MM-DD`, lundi de la semaine).
- Fallback local : `localStorage` par semaine si non authentifie.
- Surface actuelle : evenements editables, ajout evenement, objectifs cochables, habitudes 3 etats, accents cyclables.
- Desktop-first selon le handoff `RESSOURCES/AGENT_PLANS/design_handoff_agenda/`.
- Suites possibles : detail/suppression evenement, mobile, backup global.

---

## MCP

- Serveur MCP local/public ajoute dans `Code/server/mcp/`.
- Commande locale : `pnpm mcp:systema`.
- Endpoint public : `https://systema-agency.vercel.app/mcp`.
- Surface lecture : docs projet + outils de recherche/lecture sans secret.
- Surface write active en prod : tasks, notes, notes volantes et custom tabs.
- Writes HTTP proteges par `x-systema-mcp-secret` ou `?secret=...`; fail-closed si `SYSTEMA_MCP_SECRET` absent.
- Variables requises pour activer les writes : `SYSTEMA_MCP_USER_OPEN_ID`, `SYSTEMA_MCP_SECRET`.
- Validation prod 2026-05-02 : write sans secret rejete 401; `create_task` + `delete_task` avec secret OK.
- Patch Cowork 2026-05-02 : query param supporte car Cowork ne permet pas les headers custom.
- README garde intact; details operationnels suivis ici/TODO/WORKLOG.

---

## Deploiement et sync

Voie nominale :
1. Modifier la source utile.
2. Tester depuis le clone hors Drive.
3. Commit + push sur `main`.
4. Vercel deploy automatiquement.
5. Recopier/synchroniser vers `Mon disque\SCC`.

Notes :
- Ne pas utiliser `vercel --prod` sauf urgence.
- Les modifications faites depuis WSL dans `Mon disque` ne sont pas toujours vues par Google Drive.
- Pour forcer Drive, privilegier une action cote Windows : PowerShell, Git Windows, VS Code Windows, Explorateur ou redemarrage Drive.

---

## Migrations DB

- Migrations Drizzle dans `Code/drizzle/NNNN_*.sql`; helper one-shot dans `Code/scripts/apply-*.mjs`.
- Commande nominale (depuis le clone) : `node --env-file=.env scripts/apply-<nom>-migration.mjs`.
- Resolution 2026-05-07 : le blocage Node 24 venait d'un `node_modules` installe depuis WSL dans le clone. PowerShell ne resolvait pas les liens pnpm WSL (`ERR_MODULE_NOT_FOUND` sur `@neondatabase/serverless`). Fix applique : supprimer `node_modules` depuis WSL, puis reinstaller depuis PowerShell avec `corepack pnpm install --frozen-lockfile`.
- Validation 2026-05-07 depuis PowerShell : `node -e "import('@neondatabase/serverless')"` OK, `node --env-file=.env scripts/apply-home-data-migration.mjs` OK, `pnpm check` OK, `pnpm test` OK, `pnpm build` OK.
- `pnpm@10.4.1` est installe cote utilisateur dans `C:\Users\pauli\AppData\Local\pnpm`; ce dossier est dans le PATH utilisateur. Les shims `pnpm.ps1`/`pnpx.ps1` ont ete retires pour que PowerShell utilise `pnpm.cmd` sans changer l'execution policy.
- Si `pnpm` n'est pas reconnu dans un terminal deja ouvert, fermer puis rouvrir PowerShell. Fallback toujours valide : `corepack pnpm <commande>`.

---

## Interdits produit

- Ne pas reintroduire RPG, Drawn by Fate ou LifeCommand dans Systema Agency.
- Ne pas exposer les secrets.
- Ne pas transformer les docs en journal verbeux : Git garde l'historique detaille.
