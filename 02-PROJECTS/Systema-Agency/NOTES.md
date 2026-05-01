# NOTES - Systema-Agency

Décisions, repères actifs et règles stables du projet.

---

## État actuel

- Production active : `https://systema-agency.vercel.app`.
- `https://systema.enterprises` existe comme alias Vercel, mais l'URL d'usage recommandée reste `systema-agency.vercel.app`.
- Source SCC active : `C:\Users\pauli\Mon disque\SCC\02-PROJECTS\Systema-Agency`.
- Clone Git/build/test : `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency`.
- Base de données : Neon PostgreSQL, même DB utilisée en prod et en dev local.

---

## Routes actives

| Route | Rôle | Navbar |
|---|---|---|
| `/` | Page principale HomeV2 | Brand `Systema Agency` |
| `/kim` | Conversation avec Kim | Oui |
| `/notes` | Notes volantes (board glassmorphism + tiroir d'archives) | Oui |
| `/prompt-vault` | Bibliothèque de prompts | Oui |
| `/suivi` | Suivi médicament | Oui |
| `/v1` | Ancienne home conservée | Non, URL directe seulement |

---

## Kim dans Systema

Kim est intégrée dans Systema Agency par étapes.

État actuel :
- Kim répond dans `/kim`.
- L'appel OpenAI est fait côté serveur seulement.
- Kim peut ajouter des prompts dans Prompt Vault via `promptVault.addPrompt`.

Limites actuelles :
- Kim ne peut pas encore créer de notes ou tâches.
- Kim ne peut pas encore modifier ni archiver.
- Suppression directe interdite au départ.
- `OPENAI_API_KEY` doit rester côté serveur/Vercel.

Prochaines étapes possibles :
- permettre à Kim de créer des notes/tâches ;
- permettre à Kim de modifier/archiver avec confirmation ;
- garder chaque nouveau pouvoir en passe courte et validée.

---

## Déploiement

Voie nominale :
1. Modifier la source dans `Mon disque\SCC`.
2. Synchroniser vers le clone `SCC-github-clone`.
3. Commit + push sur `main` depuis le clone.
4. Vercel déploie automatiquement.

Règles :
- Regrouper les changements avant push pour éviter des déploiements inutiles.
- Ne pas utiliser `vercel --prod` sauf urgence.
- Si `vercel --prod` est utilisé, pousser ensuite le même état sur GitHub.
- Le projet Vercel utilise le Root Directory `02-PROJECTS/Systema-Agency/Code`.

---

## Auth et variables requises

Variables Vercel Production indispensables :
- `DATABASE_URL`
- `JWT_SECRET`
- `OWNER_EMAIL`
- `OWNER_PASSWORD`
- `VITE_APP_ID`

Variables IA :
- `OPENAI_API_KEY` requis pour Kim.
- `OPENAI_MODEL` optionnel ; le code a un fallback.

Si l'auth recasse, vérifier d'abord que `VITE_APP_ID` existe et vaut `systema-agency`.

---

## Développement local

- Le `.env` local pointe sur les mêmes credentials et la même DB Neon que la prod.
- Ne pas créer de fausses données de test en local sans intention claire.
- Pour les validations fiables, utiliser le clone hors Drive :
  `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency\Code`.
- Le `node_modules` dans Google Drive peut se corrompre ; voir `Code/DEV-SETUP.md` si l'environnement local casse.

---

## Règles techniques stables

- Les API routes Vercel tournent en Node ESM strict.
- Dans la chaîne importée par `api/**/*.ts`, utiliser des imports relatifs explicites avec extension `.js`.
- Éviter les alias TypeScript (`@/...`, `@shared/...`) dans le code serveur appelé directement par Vercel.
- Ne pas réintroduire RPG, tarot, Drawn by Fate ou LifeCommand dans Systema Agency.

---

## Synchronisation SCC / GitHub / Drive

- Les actions réelles doivent laisser une trace courte dans `WORKLOG.md`.
- `TODO.md` suit uniquement les tâches actives, à faire ou terminées.
- `NOTES.md` garde seulement les décisions et repères actifs.
- Les modifications faites depuis WSL/Codex dans `Mon disque` ne déclenchent pas toujours Google Drive.
- Si Drive doit absolument capter une modification, privilégier une action côté Windows : PowerShell, Git Windows, VS Code Windows, Explorateur ou redémarrage Google Drive.

---

## Serveur MCP local

- Serveur MCP TypeScript/Node.js ajouté côté `Code/server/mcp/`.
- SDK utilisé : `@modelcontextprotocol/sdk`.
- Transports :
  - `stdio`, pour usage local par un client MCP qui lance le process ;
  - Streamable HTTP stateless sur `/mcp` pour usage public HTTPS.
- Commande : `pnpm mcp:systema` depuis `Code/`.
- URL publique après déploiement : `https://systema-agency.vercel.app/mcp`.
- Surface actuelle volontairement en lecture seule :
  - ressources `systema://project/readme`, `todo`, `notes`, `notes-de-pauline`, `worklog` ;
  - tools `list_project_docs`, `read_project_doc`, `search_project_docs` ;
  - prompt `systema-session-start`.
- Sur Vercel, le serveur peut relire les docs depuis GitHub raw si les fichiers SCC hors `Code/` ne sont pas disponibles dans la fonction serverless.
- Les mutations DB via MCP sont à traiter dans une passe séparée avec validation explicite.

---

## Priorités produit ouvertes

1. ~~Notes volantes en widgets glassmorphism déplaçables~~ — Passe A desktop livrée 2026-04-29, validation visuelle Pauline confirmée 2026-05-01.
2. Vue mobile masonry + bottom sheet pour `/notes` (Passe B).
3. Kim capable de créer des notes (peut maintenant pointer sur la table `floating_notes`).
4. Images associées aux prompts dans Prompt Vault.
5. Fonctions Gmail / génération de tâches / supplément, seulement quand la base est propre.

---

## Floating Notes — repères techniques

- Source design : `RESSOURCES/design_handoff_floating_notes_unzip/design_handoff_floating_notes/`.
- Table dédiée `floating_notes` (volontairement séparée de `notes` qui sert au widget historique).
- Tweaks fixés (defaults du handoff) : style `neon`, accent `pink`, blur 22, opacity 0.9, grain on, grille on. Aucun panneau utilisateur n'est exposé (le handoff dit explicitement « do NOT ship »). Un panneau pourra être ajouté plus tard si besoin.
- Persistance : optimistic local + debounce 600 ms par note pour les éditions de texte/position. Mutations archive/restore/delete invalidatent les listes.
- Champ `style` par note volontairement nullable (`null` = hérite du global).
- Migration à appliquer côté Neon : `pnpm db:push` (génère + applique). Le SQL `0004_floating_notes.sql` est déjà fourni en backup et est idempotent.
