# AGENT-INSTRUCTIONS — Systema Agency

> Lire avant toute intervention sur ce projet.
> Règles générales : voir `../../AGENTS.md` et `../../Resources/Systeme/Multi-Agent-Collaboration.md`

---

## Contexte du projet

**Systema Agency** — Agence systèmes numériques + PromptVault.
**Stack :** TypeScript + Vite (client) + Vercel Functions (api/) + Neon PostgreSQL
**Repo code :** `github.com/paulineduluc07-svg/systema.agency`
**Local :** `C:\Users\pauli\CODE\systema.agency`
**Déployé :** `systema-agency.vercel.app`

---

## État actuel (2026-03-11)

- Migration Neon PostgreSQL : complète ✅
- API routes Vercel : déployées ✅ (`api/trpc/[trpc].ts` + `api/oauth/callback.ts`)
- Auth OAuth Manus : non configurée → offline mode
- Dashboard redesign : en attente (sticky notes + onglets + avatar Life Command)

---

## Ce dossier contient

- `Notes/` — décisions d'architecture, contexte
- `Prompts/` — prompts IA spécifiques
- `Assets/` — mockups dashboard, références
- `Livrables/` — exports finaux
- `Todo.md` — tâches en cours
- `Roadmap.md` — vision et étapes

---

## Prochaines étapes

1. Implémenter auth (Option A : auto-connexion owner, ou Option B : email/password)
2. Redesign dashboard : sticky notes + onglets Santé/Finance/Carrière/Étude/Maison + avatar

---

*Mis à jour : 2026-03-11*
