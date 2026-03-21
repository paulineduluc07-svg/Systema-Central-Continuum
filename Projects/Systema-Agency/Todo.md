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

## A faire maintenant -- Configurer les variables Vercel

L'auth est implementee. Pour qu'elle fonctionne en prod, configurer ces variables dans Vercel :

```
DATABASE_URL=      postgresql://... (deja configure normalement)
JWT_SECRET=        une chaine aleatoire longue (ex: openssl rand -hex 32)
OWNER_EMAIL=       ton adresse email
OWNER_PASSWORD=    le mot de passe que tu veux utiliser pour te connecter
```

Vercel > Project Settings > Environment Variables

Une fois configure, deployer. La connexion fonctionnera.

## Priorite haute (apres connexion validee)

- [ ] **Suivi medicament : sync DB**
  - Actuellement : localStorage uniquement (STORAGE_KEY = "suivi_paw_v1")
  - A faire : ajouter table `suivi_entries` dans drizzle/schema.ts
  - Champs : id, userId, timestamp, prise (string), dose (int), reasons (text/JSON), note (text)
  - Ajouter migration SQL dans drizzle/migrations/
  - Ajouter route tRPC `suivi.*` dans routers.ts
  - Modifier Suivi.tsx pour utiliser la DB

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

*Mis a jour : 2026-03-20*
