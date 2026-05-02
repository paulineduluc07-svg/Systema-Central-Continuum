# TODO - Systema-Agency

Suivi court des prochaines actions. Les details historiques vivent dans Git.

---

## Regles actives

- A chaque action reelle : garder `TODO.md`, `NOTES.md` et `WORKLOG.md` courts et alignes.
- Synchroniser `Mon disque\SCC` et `SCC-github-clone` avant de cloturer.
- Utiliser le clone `C:\Users\pauli\SCC-github-clone\02-PROJECTS\Systema-Agency` pour build/test/Git.
- Ne pas ajouter de nouvelle grosse fonctionnalite tant que la base courante n'est pas propre.

---

## Etat valide

- Prod active : `https://systema-agency.vercel.app`.
- Auth email/mot de passe fonctionnelle.
- Sync cloud fonctionnelle apres login.
- Kim repond dans `/kim` et peut ajouter des prompts dans Prompt Vault.
- Notes volantes desktop `/notes` livrees, corrigees et validees visuellement.
- Serveur MCP Systema expose `/mcp`; lecture sans secret, writes prod valides avec secret.

---

## Prochaines passes

### Notes volantes

- [ ] Passe B : vue mobile masonry + bottom sheet pour `/notes`.
- [ ] Revalider le flux mobile : creer, editer, archiver, restaurer, supprimer.
- [ ] Garder le bouton/flux de recuperation des notes coincées tant que le drag mobile n'est pas parfaitement valide.

### Kim dans Systema

- [ ] Passe 2 : connecter Cowork/Kim aux tools MCP write de Systema.
- [ ] Passe 3 : permettre a Kim de modifier/archiver avec confirmation.
- [ ] Garder la suppression directe interdite au depart.

### MCP Systema

- [x] Ajouter `SYSTEMA_MCP_USER_OPEN_ID` dans Vercel.
- [x] Generer et ajouter `SYSTEMA_MCP_SECRET` dans Vercel.
- [x] Tester `tools/list` et un write HTTP avec header secret apres deploy.
- [ ] Configurer Cowork/Kim avec l'URL `https://systema-agency.vercel.app/mcp?secret=<secret>`.

### Prompt Vault

- [ ] Ajouter les images associees aux prompts.

### Plus tard

- [ ] Syncer Gmail.
- [ ] Generer mes taches.
- [ ] Clarifier/implementer Supplement.

---

## Incidents a garder en tete

- Auth 2026-04-25 : verifier d'abord `VITE_APP_ID=systema-agency` si la session recasse.
- Modal login 2026-05-01 : `LoginModal` doit rester en `pointer-events-auto`, car il est rendu dans la navbar.
- Incident Gemini 2026-05-01 : un marqueur texte `=====` laisse dans `FloatingNotes.tsx` a casse le build Vercel; corrige par `b8214fc`.
