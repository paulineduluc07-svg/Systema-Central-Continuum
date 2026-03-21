# Todo -- Systema Agency

> Taches actives. Mise a jour a chaque session.

---

## Completes
- [x] Migration code vers `Projects/Systema-Agency/Code/` validee (SHA match)
- [x] Ancien repo `systema.agency` archive en lecture seule
- [x] Vague 1 securite (2026-03-19)
- [x] Refonte architecture frontend (2026-03-20)
- [x] Auth email/password implementee (2026-03-20)
  - [x] sdk.ts : retrait Manus OAuth, ajout verifyCredentials() crypto Node.js natif
  - [x] env.ts : ajout OWNER_EMAIL + OWNER_PASSWORD
  - [x] routers.ts : ajout auth.login(email, password)
  - [x] useAuth.ts : ajout login(email, password)
  - [x] Home.tsx : modal de connexion email/password
  - [x] api/oauth/callback.ts : vide (plus utilise)
- [x] Suivi medicament : sync DB (2026-03-21)
  - [x] drizzle/schema.ts : ajout table `suivi_entries`
  - [x] drizzle/0001_suivi_entries.sql : migration SQL
  - [x] server/db.ts : ajout getSuiviEntriesByUser, createSuiviEntry, replaceSuiviEntries
  - [x] server/routers.ts : ajout router `suivi.list / suivi.add / suivi.replace`
  - [x] client/src/pages/Suivi.tsx : sync tRPC quand authentifie, localStorage fallback sinon

## A faire maintenant -- Configurer les variables Vercel et appliquer la migration

Les variables Vercel sont necessaires pour que l'auth et le suivi fonctionnent en prod :

```
DATABASE_URL=      postgresql://... (deja configure normalement)
JWT_SECRET=        une chaine aleatoire longue (ex: openssl rand -hex 32)
OWNER_EMAIL=       ton adresse email
OWNER_PASSWORD=    le mot de passe que tu veux utiliser pour te connecter
```

Vercel > Project Settings > Environment Variables

**Puis appliquer la migration SQL** (une seule fois) dans ton dashboard Neon ou via :
```
pnpm drizzle-kit push
```
(ou copier-coller le contenu de `drizzle/0001_suivi_entries.sql` dans le SQL editor de Neon)

## Priorite moyenne

- [ ] **Completer .env.example**
  - Ajouter : OWNER_EMAIL, OWNER_PASSWORD
  - Retirer : VITE_OAUTH_PORTAL_URL, OAUTH_SERVER_URL, BUILT_IN_FORGE_API_*,
    OPENAI_API_KEY, AIRTABLE_* (plus utilises)

- [ ] **Nettoyer les imports inutilises dans le code**
  - Verifier : server/_core/oauth.ts (plus appele nulle part -- peut etre supprime)
  - Verifier : server/_core/llm.ts, imageGeneration.ts, voiceTranscription.ts (probablement inutilises)
  - Verifier : server/_core/map.ts, dataApi.ts, notification.ts

- [ ] **Ajouter foreign keys dans le schema Drizzle**

## Priorite basse

- [ ] Decider la suppression definitive de l'ancien repo

## En attente

- [ ] Integrer Kim quand Kim MVP est stable (projet separe)

---

*Mis a jour : 2026-03-21*
