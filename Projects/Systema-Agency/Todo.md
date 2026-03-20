# Todo -- Systema Agency

> Taches actives. Mise a jour a chaque session.

---

## Completes
- [x] Migration code vers `Projects/Systema-Agency/Code/` validee (SHA match)
- [x] Ancien repo `systema.agency` archive en lecture seule
- [x] Vague 1 securite : retrait fallback mot de passe client, retrait gate global, protection endpoints ai, rate-limit /api
- [x] Refonte architecture frontend (2026-03-20)
  - [x] Suppression Drawn by Fate (7 fichiers pages + composants)
  - [x] Suppression VisionBoard (6 fichiers)
  - [x] Suppression LifeCommandChat, Map, Whiteboard, GameTabs, DraggableGrid/Widget
  - [x] Suppression doublons PromptVault (composants/), prompt-vault.jsx
  - [x] Suppression widgets RPG (Avatar, Calendar, StatsGraph)
  - [x] Suppression hooks inutilises (useLifeCommandItems, useSpeechToText, useInfiniteCanvas, useComposition)
  - [x] Nouveau Home.tsx : 6 onglets fixes + sticky notes syncees par onglet
  - [x] App.tsx nettoye (routes drawn-by-fate retirees)
  - [x] server/routers.ts allege (tarot + ai retires)

## En cours / Priorite haute

- [ ] **Auth : configurer VITE_OAUTH_PORTAL_URL dans les variables Vercel**
  - Sans ca, aucun utilisateur ne peut se connecter en prod
  - Fichier concerne : variables d'environnement Vercel (interface Vercel)
  - Valeur attendue : URL du portail OAuth (forge.butterfly-effect.dev ou equivalent)
  - Aussi verifier : VITE_APP_ID, JWT_SECRET, DATABASE_URL, OWNER_OPEN_ID

- [ ] **Suivi medicament : sync DB**
  - Actuellement : localStorage uniquement (STORAGE_KEY = "suivi_paw_v1")
  - A faire : ajouter table `suivi_entries` dans le schema Drizzle
  - Champs : id, userId, timestamp, prise, dose, reasons (JSON), note
  - Ajouter route tRPC `suivi.*` dans routers.ts
  - Mettre a jour Suivi.tsx pour utiliser useSyncedSuivi() similaire a useSyncedNotes

## Priorite moyenne

- [ ] **Completer .env.example**
  - Variables manquantes : VITE_OAUTH_PORTAL_URL, BUILT_IN_FORGE_API_KEY, BUILT_IN_FORGE_API_URL, OPENAI_API_KEY, OPENAI_API_URL, OPENAI_MODEL, AIRTABLE_API_KEY, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME

- [ ] **Ajouter foreign keys dans le schema Drizzle**
  - userId dans tasks, notes, user_preferences, custom_tabs, canvas_data
  - Comportement : CASCADE on delete

- [ ] **Verifier que les Vercel Functions (api/trpc/, api/oauth/) sont bien connectees**
  - Le build Vercel ne construit que le client
  - Confirmer que les routes /api/* repondent bien en prod

## Priorite basse

- [ ] Decider la suppression definitive de l'ancien repo apres stabilisation

## En attente (post-auth)

- [ ] Integrer Kim dans Systema Agency (quand Kim MVP sera stable -- voir `Projects/Kim-Agentic-Companion/`)

---

*Mis a jour : 2026-03-20*
