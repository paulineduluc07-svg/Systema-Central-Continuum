# Patch — Afficher les customTabs dans la navigation principale

**Projet** : `02-PROJECTS/Systema-Agency`
**Suite de** : `PLAN_CLAUDE_CODE_MCP_WRITE.md` + `PATCH_CLAUDE_CODE_MCP_QUERY_SECRET.md` (déjà implémentés et déployés)

## Pourquoi

Le MCP write fonctionne bien et écrit dans la bonne base utilisateur (validé via une floating note qui apparaît correctement). Mais les `customTabs` créés via MCP **ne sont visibles nulle part dans l'UI**, parce que le frontend n'a actuellement aucun composant qui rend les onglets custom dans la navigation. Le `AdminPanel.tsx` existe mais n'est pas monté dans la nav principale.

Conséquence : les `tasks` et `notes` créés avec un `tabId` custom (ex. `"test-cowork"`) sont invisibles aussi, parce qu'aucune section de l'UI ne consulte ce tabId.

**Objectif** : faire en sorte que chaque `customTab` apparaisse comme une section navigable dans la barre de nav principale, avec une page dédiée qui affiche ses tâches et notes.

## Contexte technique (déjà en place)

**Routing** (`Code/client/src/App.tsx`) — utilise `wouter`. Routes actuelles :
- `/` → `HomeV2`
- `/v1` → `Home` (legacy)
- `/suivi` → `SuiviPage`
- `/prompt-vault` → `PromptVault`
- `/kim` → `Kim`
- `/notes` → `FloatingNotes` (board des sticky)

**Navigation** : `Code/client/src/components/Navbar.tsx` — c'est ce composant qui affiche la liste des sections (Kim, Notes, Prompt Vault, Suivi). À étendre pour rendre dynamiquement la liste des customTabs.

**Données déjà disponibles côté tRPC** :
- `trpc.customTabs.list.useQuery()` — retourne tous les customTabs de l'utilisateur (utilisé dans `AdminPanel.tsx` ligne ~36)
- `trpc.tasks.list.useQuery({ tabId })` — tâches d'un onglet
- `trpc.notes.list.useQuery({ tabId })` — notes d'un onglet
- Mutations `tasks.create/update/delete`, `notes.create/update/delete`, `customTabs.create/update/delete`

**Schéma `customTabs`** (rappel) :
- `id`, `userId`, `tabId` (varchar 64, identifiant logique), `label`, `color` (#hex), `icon` (string nom d'icône), `tabType` (`widgets`|`whiteboard`), `sortOrder`, timestamps

## Modifications à faire

### 1. Nouvelle route dynamique `/tab/:tabId`

Dans `Code/client/src/App.tsx`, ajouter avant le fallback 404 :

```tsx
<Route path={"/tab/:tabId"} component={CustomTabPage} />
```

### 2. Nouvelle page `Code/client/src/pages/CustomTabPage.tsx`

Cette page :
- Récupère le paramètre `:tabId` via `wouter` (`useParams`).
- Charge les métadonnées du tab via `trpc.customTabs.list.useQuery()` puis filtre par `tabId`. Si le tab n'existe pas → afficher un état vide ("Onglet introuvable").
- Affiche en haut le header de l'onglet : icône + label + couleur de fond/accent.
- Si `tabType === "widgets"` → afficher deux colonnes/sections :
  - **Tâches** : liste des tasks via `trpc.tasks.list.useQuery({ tabId })`. Chaque tâche est cliquable pour toggle `completed`. Bouton "Ajouter une tâche" → `trpc.tasks.create.useMutation`.
  - **Notes** : liste des notes via `trpc.notes.list.useQuery({ tabId })`. Bouton "Ajouter une note" → `trpc.notes.create.useMutation`. Notes éditables inline.
- Si `tabType === "whiteboard"` → afficher un canvas (réutiliser le composant whiteboard existant si présent, sinon afficher un placeholder "Whiteboard non disponible — bientôt").
- Réutiliser le style glassmorphisme rose/mauve du reste de l'app (police Pacifico pour les titres comme dans `systemaagency.md`).

**Note** : ne pas réinventer la roue. Si des composants de liste de tasks/notes existent déjà (ex. dans `widgets/NotesWidget.tsx`, `widgets/TasksWidget.tsx`), les réutiliser.

### 3. Étendre `Code/client/src/components/Navbar.tsx`

Charger la liste des customTabs et les rendre **dynamiquement** dans la nav, après les 4 sections built-in (ou au-dessus, à toi de juger l'UX).

Pseudo-code :

```tsx
const { data: customTabs } = trpc.customTabs.list.useQuery();

// Dans le rendu de la nav, après les sections built-in :
{customTabs?.map(tab => (
  <NavItem
    key={tab.id}
    href={`/tab/${tab.tabId}`}
    label={tab.label}
    icon={tab.icon}      // utiliser un mapping nom→composant lucide-react
    color={tab.color}    // appliquer comme accent/bordure
  />
))}
```

**Mapping icône → composant** : utiliser `lucide-react` (déjà installé). Helper `iconNameToComponent(name: string): LucideIcon` avec un fallback `File` si l'icône n'est pas reconnue. Couvrir au minimum : `file`, `sparkles`, `book`, `activity`, `list`, `note`, `folder`, `star`, `heart`, `zap`.

### 4. (Optionnel mais propre) Page d'admin pour gérer les customTabs

Si `AdminPanel.tsx` n'est monté nulle part, soit l'exposer via une route `/admin` accessible depuis un menu/profil, soit ajouter un bouton "+" dans la nav qui ouvre un modal de création de tab. À toi de juger ce qui est minimal pour cette passe.

### 5. Tests

- Test unitaire pour `CustomTabPage` : rendu avec tab existant (vérifie label/tasks/notes), rendu avec tabId inexistant (état vide).
- Test pour le mapping icône → composant.
- Test e2e si possible : créer un tab, naviguer vers `/tab/:tabId`, vérifier le header.

### 6. Documentation

- `WORKLOG.md` : entrée datée résumant le patch.
- `README.md` : mentionner la nouvelle route `/tab/:tabId` et le rendu dynamique des customTabs dans la nav.
- Si Navbar.tsx a son propre commentaire d'en-tête, le mettre à jour.

## Critères d'acceptation

- [ ] L'onglet `Test Cowork` (déjà créé en DB via MCP) apparaît dans la nav après le déploiement.
- [ ] Cliquer dessus mène à `/tab/test-cowork` qui affiche : header avec label/icône/couleur + 2 tâches + 1 note (déjà créées en DB).
- [ ] Une nouvelle tâche/note créée depuis l'UI dans cet onglet est persistée et réapparaît au refresh.
- [ ] Une nouvelle tâche créée via MCP (`create_task` avec `tabId="test-cowork"`) apparaît dans l'UI sans intervention manuelle (au prochain `refetch` ou polling — pas besoin de WebSocket/realtime).
- [ ] Aucune régression sur les 4 sections built-in.
- [ ] Le déploiement Vercel réussit.
- [ ] Les tests passent.

## Hors scope (à ne pas faire dans cette passe)

- Drag-and-drop pour réordonner les tabs.
- Realtime WebSocket pour les updates en direct (un `refetch` au focus de la fenêtre suffit).
- Édition du label/couleur/icône du tab depuis la page (peut rester dans AdminPanel).
- Suppression de tab depuis la nav.
- Whiteboard rendering complet si `tabType="whiteboard"` — placeholder OK.

## Notes 

- Respecter le workflow SCC (lire README/WORKLOG/TODO/NOTES en début de session, mettre à jour en fin).
- Si une décision UX ambigüe se présente (position des customTabs dans la nav, design du header de tab), trancher dans le bon sens et noter dans WORKLOG. Ne pas bloquer sur des micro-décisions.
- Sync GitHub à la fin.
- Une fois déployé, prévenir Pauline → elle re-testera via Cowork pour valider que le nouvel onglet apparaît.