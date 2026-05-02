# Plan — Ajouter les outils d'écriture au MCP Systema-Agency

**Projet** : `02-PROJECTS/Systema-Agency`
**Objectif** : étendre le serveur MCP Systema-Agency pour permettre à un client MCP externe (Cowork) de **créer / modifier / supprimer** des tasks, notes, floating notes et tabs dans la base de données de l'app — sans passer par l'auth cookie tRPC.

---

## Contexte technique (déjà en place, à réutiliser)

**Stack** : Node + Express + TypeScript, Drizzle ORM, Postgres Neon, tRPC, MCP SDK `@modelcontextprotocol/sdk`.

**Fichiers MCP existants** :
- `Code/server/mcp/systema-core.ts` → définition du serveur MCP (resources + tools)
- `Code/server/mcp/http.ts` → transport HTTP Express (endpoint `/api/mcp`)
- `Code/server/mcp/systema.ts` → transport stdio (local)
- `Code/api/mcp.ts` → wrapper Vercel pour exposer l'app HTTP

**État actuel** : 3 outils en lecture seule (`list_project_docs`, `read_project_doc`, `search_project_docs`) qui lisent les fichiers markdown du dossier projet. Aucune interaction avec la DB.

**Couche DB** (`Code/server/db.ts`) — fonctions déjà existantes à réutiliser telles quelles :
- `getDb()` — récupère l'instance Drizzle (Neon)
- `getUserByOpenId(openId)` — résout un user par son openId
- `createTask(...)`, `updateTask(id, userId, data)`, `deleteTask(id, userId)`, `getTasksByUserAndTab(userId, tabId)`, `getAllTasksByUser(userId)`
- `createNote(...)`, `updateNote(...)`, `deleteNote(...)`, `getNotesByUserAndTab(userId, tabId)`, `getAllNotesByUser(userId)`
- (Pour floating notes et custom tabs : vérifier ce qui existe déjà dans `db.ts` ; sinon ajouter les helpers manquants en suivant le même pattern.)

**Schéma Drizzle** (`Code/drizzle/schema.ts`) — tables ciblées :
- `tasks` : `id`, `userId`, `tabId`, `title`, `completed`, `sortOrder`, timestamps
- `notes` : `id`, `userId`, `tabId`, `content`, `sortOrder`, timestamps
- `floatingNotes` : `id`, `userId`, `title`, `body`, `checklist`, `x`, `y`, `w`, `h`, `accent`, `style`, `archived`, `archivedAt`, timestamps
- `customTabs` : `id`, `userId`, `tabId`, `label`, `color`, `icon`, `tabType` (`widgets|whiteboard`), `sortOrder`, timestamps

**Routes tRPC existantes** (`Code/server/routers.ts`) — référence pour les schémas Zod et règles de validation. À reproduire dans le MCP, mais en bypassant le `protectedProcedure` (pas de cookie côté MCP).

---

## Stratégie d'authentification (simple, mono-utilisateur)

L'app est personnelle (un seul user principal : Paw). Le MCP doit pouvoir agir en son nom sans cookie.

**Deux variables d'environnement à ajouter** :
- `SYSTEMA_MCP_USER_OPEN_ID` (obligatoire pour les writes) → l'`openId` de Paw. Le MCP résout son `users.id` via `getUserByOpenId` au démarrage et garde l'ID en cache.
- `SYSTEMA_MCP_SECRET` (obligatoire pour le transport HTTP) → secret partagé. Le client doit envoyer `x-systema-mcp-secret: <SECRET>`. Si le header est absent ou faux côté HTTP, retourner 401 **avant** de monter le serveur MCP. Pour le transport stdio (local), pas de secret requis.

**Comportement** :
- Les outils en lecture existants (`list_project_docs`, etc.) **restent accessibles sans secret** côté HTTP (rétrocompatibilité — Cowork utilise déjà ces tools sans header).
- Les nouveaux outils d'écriture **exigent le secret** côté HTTP.
- Implémentation : middleware Express qui vérifie le header avant `app.post("*", ...)`. Si absent et que le payload contient un appel à un write tool (parsable depuis `req.body.method === "tools/call"` + `params.name` qui matche un write tool), retourner 401.

  Plus simple : exiger le secret pour **tout** appel POST si la variable est définie, sauf si le tool appelé est dans une whitelist read-only. Ou, encore plus simple : un nouveau endpoint `/api/mcp/write` séparé qui requiert le secret, et `/api/mcp` reste read-only. **Au choix de Claude Code** — mais documenter la décision.

---

## Outils MCP à ajouter (spec exacte)

Tous les outils acceptent leurs inputs validés par Zod et retournent à la fois `content` (text JSON) et `structuredContent` (objet typé), comme les outils existants dans `systema-core.ts`.

### Tasks

#### `create_task`
- **input** : `{ tabId: string (1..64), title: string (1..500), sortOrder?: number (>=0) }`
- **comportement** : appelle `db.createTask({ userId, tabId, title, sortOrder: sortOrder ?? 0, completed: false })`
- **output** : `{ task: { id, tabId, title, completed, sortOrder, createdAt, updatedAt } }`

#### `update_task`
- **input** : `{ id: number, title?: string, completed?: boolean, sortOrder?: number }`
- **comportement** : `db.updateTask(id, userId, { title?, completed?, sortOrder? })`. Au moins un champ optionnel doit être fourni (validation Zod `.refine`).
- **output** : `{ success: true }`

#### `complete_task`
- Sucre syntaxique. Input `{ id: number }`, marque `completed: true`. Output `{ success: true }`.

#### `delete_task`
- **input** : `{ id: number }`
- **output** : `{ success: true }`

#### `list_tasks`
- **input** : `{ tabId?: string }` (si absent → `getAllTasksByUser`, sinon `getTasksByUserAndTab`)
- **output** : `{ tasks: Task[] }`

### Notes

#### `create_note`
- **input** : `{ tabId: string (1..64), content: string (max 20_000), sortOrder?: number }`
- **comportement** : `db.createNote({ userId, tabId, content, sortOrder: sortOrder ?? 0 })`
- **output** : `{ note: Note }`

#### `update_note`
- **input** : `{ id: number, content?: string (max 20_000), sortOrder?: number }` — au moins un champ.
- **output** : `{ success: true }`

#### `delete_note` — `{ id: number }` → `{ success: true }`

#### `list_notes` — `{ tabId?: string }` → `{ notes: Note[] }`

### Floating notes

Reprendre les règles de validation déjà définies dans `routers.ts` (`floatingNoteCreateSchema`, `floatingNoteUpdateSchema`). Réutiliser les enums `floatingNoteAccentSchema`, `floatingNoteStyleSchema`.

#### `create_floating_note`
- **input** : matche `floatingNoteCreateSchema` (title?, body?, checklist?, x, y, w, h, accent?, style?)
- **output** : `{ floatingNote: FloatingNoteRow }`

#### `update_floating_note`
- **input** : `{ id: number, ...partial fields }`
- **output** : `{ success: true }`

#### `archive_floating_note` — `{ id: number }` → set `archived: true`, `archivedAt: now()` → `{ success: true }`

#### `list_floating_notes` — `{ includeArchived?: boolean (default false) }` → `{ floatingNotes: FloatingNoteRow[] }`

### Custom tabs

#### `create_tab`
- **input** : `{ tabId: string (1..64), label: string (1..128), color?: string (default "#FF69B4"), icon?: string (default "file"), tabType?: "widgets"|"whiteboard" (default "whiteboard"), sortOrder?: number }`
- **output** : `{ tab: CustomTab }`

#### `list_tabs` — pas d'input → `{ tabs: CustomTab[] }`

#### `update_tab` — `{ tabId: string, label?, color?, icon?, sortOrder? }` → `{ success: true }`

#### `delete_tab` — `{ tabId: string }` → `{ success: true }`

---

## Étapes d'implémentation

1. **Vérifier les helpers DB existants** dans `Code/server/db.ts`. Pour chaque opération listée dans la section "Outils" ci-dessus, confirmer que la fonction existe. Sinon, l'ajouter en suivant exactement le pattern des helpers `task`/`note` (mêmes conventions de nommage, mêmes vérifications `userId`).

2. **Créer un module utilitaire** `Code/server/mcp/auth.ts` :
   - Fonction `resolveMcpUserId()` : lit `SYSTEMA_MCP_USER_OPEN_ID`, appelle `db.getUserByOpenId`, retourne `users.id` (number). Lève une erreur claire si la var n'est pas définie ou si l'user n'existe pas.
   - Cache le résultat en module-level pour éviter une requête DB par appel.
   - Fonction `verifyMcpSecret(req)` pour le HTTP transport.

3. **Étendre `Code/server/mcp/systema-core.ts`** :
   - Importer les helpers DB et `resolveMcpUserId`.
   - Ajouter chaque tool via `server.registerTool(name, { title, description, inputSchema, outputSchema }, handler)`.
   - Chaque handler appelle `await resolveMcpUserId()` au début pour récupérer le userId.
   - Garder les outils existants intacts.

4. **Ajouter le contrôle d'accès HTTP** dans `Code/server/mcp/http.ts` :
   - Middleware qui vérifie le header `x-systema-mcp-secret` contre `SYSTEMA_MCP_SECRET`.
   - Décider de la stratégie (whitelist read-only OU endpoint séparé) — documenter le choix dans un commentaire en tête de fichier.
   - Si le secret n'est pas configuré côté serveur, refuser tous les writes (fail-closed).

5. **Mettre à jour `MCP_VERSION`** dans `systema-core.ts` → `"0.3.0"`.

6. **Tests** (pattern existant : `Code/server/*.test.ts` avec Vitest) :
   - `Code/server/mcp/writes.test.ts` : pour chaque write tool, tester le happy path (insert + read-back) avec un mock DB ou une DB de test. Vérifier que `resolveMcpUserId` est respecté.
   - Tester le rejet 401 sans secret HTTP.
   - Tester le rejet si `SYSTEMA_MCP_USER_OPEN_ID` n'est pas configuré.

7. **Documentation** :
   - Mettre à jour `02-PROJECTS/Systema-Agency/README.md` (section MCP) avec la liste des nouveaux outils et les variables d'env requises.
   - Ajouter une entrée datée dans `WORKLOG.md`.
   - Mettre à jour `TODO.md` si une tâche correspondante y figure.

8. **Variables d'env** :
   - Ajouter `SYSTEMA_MCP_USER_OPEN_ID` et `SYSTEMA_MCP_SECRET` à `.env.example` (avec commentaires).
   - Ajouter à la config Vercel du projet (via `vercel env add` ou dashboard) — **demander à Paw les valeurs** (l'openId de Paw + un secret généré via `openssl rand -hex 32`).

9. **Déploiement** :
   - Run tests localement (`npm test` ou équivalent).
   - Push sur la branche main → Vercel auto-deploy.
   - Vérifier les build logs Vercel.

---

## Critères d'acceptation

- [ ] Tous les nouveaux outils sont listés quand on appelle `tools/list` sur le MCP.
- [ ] Un appel `create_task` via le MCP HTTP avec le bon header secret crée bien une ligne dans la table `tasks` associée à l'user résolu par `SYSTEMA_MCP_USER_OPEN_ID`.
- [ ] Un appel sans header secret est rejeté 401 (pour les writes).
- [ ] Les outils en lecture existants continuent de fonctionner sans secret (rétrocompatibilité Cowork).
- [ ] Les tests passent.
- [ ] Le déploiement Vercel réussit (les Vercel failures récents doivent être réglés ou non aggravés).
- [ ] Le `WORKLOG.md` du projet est mis à jour.

---

## Notes pour l'agent

- Respecter le workflow SCC : début de session → lire `02-PROJECTS/Systema-Agency/README.md`, `WORKLOG.md`, `TODO.md`, `NOTES.md`, `NOTES_DE_PAULINE.md`. Fin de session → mettre à jour les mêmes fichiers.
- Les README SCC sont **lecture seule** — mais le `README.md` du projet Systema-Agency lui-même est éditable (c'est la doc projet, pas un README SCC structurel).
- Sync GitHub à la fin si le projet existe en repo.
- Si une décision technique te bloque (ex : fail-closed vs fail-open sur le secret, stratégie de whitelist), demande à Paw avant d'implémenter — pas de choix silencieux.
# Patch - Accepter le secret MCP en query parameter

**Statut** : done  
**Projet** : `02-PROJECTS/Systema-Agency`  
**Suite de** : `PLAN_CLAUDE_CODE_MCP_WRITE.md`

## Pourquoi

Cowork ne permet pas de configurer des headers HTTP custom sur les MCP connectors. L'auth via header `x-systema-mcp-secret` ne peut donc pas etre utilisee directement depuis Cowork.

Solution court terme : accepter aussi le secret en query parameter dans l'URL.

URL cible cote Cowork :

```text
https://systema-agency.vercel.app/mcp?secret=<SECRET>
```

Le header reste supporte pour les autres clients.

## Attention

Le secret en query parameter peut apparaitre dans les logs serveur et dans l'historique du client. C'est moins propre que le header, mais acceptable temporairement pour une app personnelle. Une migration future vers OAuth reste possible.

## Modification demandee

Fichiers concernes :
- `Code/server/mcp/auth.ts`
- `Code/server/mcp/http.ts`
- `Code/server/mcp/writes.test.ts`
- `Code/server/mcp/systema-core.ts`

Comportement :
- accepter `x-systema-mcp-secret`;
- accepter `?secret=...`;
- refuser les writes sans secret;
- refuser les writes avec mauvais secret;
- garder les tools de lecture accessibles sans secret.

## Validation attendue

- [x] `https://systema-agency.vercel.app/mcp?secret=<bon_secret>` autorise les write tools.
- [x] `https://systema-agency.vercel.app/mcp?secret=mauvais` est rejete 401.
- [x] `https://systema-agency.vercel.app/mcp` sans secret est rejete 401 pour les writes.
- [x] Les outils en lecture restent accessibles sans secret.
- [x] Tests locaux passes.
- [x] Build local passe.

## Resultat

Implemente dans `MCP_VERSION=0.3.1`.
