# NOTES - Systema-Agency

Repères stables et décisions actives. Garder ce fichier court.

---

## Etat actuel

- Production : `https://systema-agency.vercel.app`.
- Alias existant : `https://systema.enterprises`; URL d'usage recommandee : `systema-agency.vercel.app`.
- Source SCC : `C:\Users\pauli\Mon disque\SCC\02-PROJECTS\Systema-Agency`.
- Clone Git/build/test : `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency`.
- Base de donnees : Neon PostgreSQL partagee entre prod et dev local.

---

## Routes

| Route | Role | Navbar |
|---|---|---|
| `/` | HomeV2 | Brand |
| `/kim` | Kim | Oui |
| `/notes` | Notes volantes | Oui |
| `/prompt-vault` | Bibliotheque de prompts | Oui |
| `/suivi` | Suivi medicament | Oui |
| `/v1` | Ancienne home | Non |
| `/mcp` | Serveur MCP lecture seule | Non |

---

## Auth

Variables Vercel indispensables :
- `DATABASE_URL`
- `JWT_SECRET`
- `OWNER_EMAIL`
- `OWNER_PASSWORD`
- `VITE_APP_ID=systema-agency`

Variables IA :
- `OPENAI_API_KEY`
- `OPENAI_MODEL` optionnel

Repères de panne :
- Si login OK mais session invalide : verifier `VITE_APP_ID`.
- Si le modal s'ouvre mais les champs ne prennent pas le focus : verifier que l'overlay de `LoginModal.tsx` garde `pointer-events-auto`.

---

## Kim

Etat actuel :
- Kim repond dans `/kim`.
- L'appel OpenAI reste cote serveur.
- Kim peut ajouter des prompts dans Prompt Vault.

Limites actives :
- Kim ne peut pas encore creer de notes/taches.
- Kim ne peut pas encore modifier ni archiver.
- Suppression directe interdite au depart.

---

## Notes volantes

- Page active : `/notes`.
- Table DB : `floating_notes`.
- Passe A desktop validee.
- Passe B mobile a faire.
- Les notes doivent rester recuperables meme si une position/interaction les coince.

Incident a conserver :
- 2026-05-01 : un marqueur texte accidentel laisse dans `FloatingNotes.tsx` par Gemini a casse le build Vercel. Correction poussee dans `b8214fc`.

---

## MCP

- Serveur MCP local/public ajoute dans `Code/server/mcp/`.
- Commande locale : `pnpm mcp:systema`.
- Endpoint public : `https://systema-agency.vercel.app/mcp`.
- Surface lecture : docs projet + outils de recherche/lecture sans secret.
- Surface write active en prod : tasks, notes, notes volantes et custom tabs.
- Writes HTTP proteges par `x-systema-mcp-secret`; fail-closed si `SYSTEMA_MCP_SECRET` absent.
- Variables requises pour activer les writes : `SYSTEMA_MCP_USER_OPEN_ID`, `SYSTEMA_MCP_SECRET`.
- Validation prod 2026-05-02 : write sans secret rejete 401; `create_task` + `delete_task` avec secret OK.
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

## Interdits produit

- Ne pas reintroduire RPG, tarot, Drawn by Fate ou LifeCommand dans Systema Agency.
- Ne pas exposer les secrets.
- Ne pas transformer les docs en journal verbeux : Git garde l'historique detaille.
