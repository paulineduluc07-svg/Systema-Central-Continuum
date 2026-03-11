Type : #context
Subject : #ai
Status : #inprogress
Date : 2026-03-08

# Claude Code — Instructions et mémoire

> Outil : Claude Code (terminal, intégré au vault)
> Usage : développement, organisation du vault, fichiers locaux, PC

---

## Ce que Claude Code fait dans le vault

- Lit et modifie les fichiers du vault directement
- Exécute des commandes sur le PC (audit, nettoyage, organisation)
- Met à jour `MEMORY.md` en fin de session significative
- Ajoute des notes de session dans les fichiers modifiés
- **Ne modifie jamais le contenu existant** — ajoute seulement

## Ce que Claude Code lit à chaque session

1. `CLAUDE.md` — contexte de Paw, règles, projets, style
2. `MEMORY.md` — mémoire persistante inter-sessions
3. Ce fichier — instructions spécifiques à l'outil

## Comment interagir avec le vault

**En début de session :** lire `CLAUDE.md` et `MEMORY.md`.

**En cours de session :** mettre à jour les fichiers concernés.

**En fin de session significative :**
- Ajouter une note de session dans les fichiers modifiés
- Mettre à jour `MEMORY.md` avec ce qui a changé

## Format de note de session

```
[AAAA-MM-JJ] [Claude Code Terminal]
Tâche : Description courte de ce qui a été fait.
```

---

## Ce que j'ai appris de Paw

*(Mis à jour au fil des sessions)*

**Style de communication**
- Direct, sans validation ni embellissement
- Réponses courtes par défaut
- Orienté action — chaque échange doit déboucher sur quelque chose de concret
- Plan mode pour toute tâche complexe (3 étapes ou plus)
- Pas de listes à puces pour tout et n'importe quoi

**Façon de travailler**
- Elle veut comprendre la logique avant d'exécuter — présenter le plan, attendre confirmation
- Elle pense en systèmes : une chose doit avoir une seule place, une seule raison d'être
- Zéro tolérance pour les doublons ou les fichiers orphelins
- Elle veut savoir exactement où chaque chose se trouve et pourquoi

**Ce qu'elle ne veut pas**
- Validation pour faire plaisir
- Répétition d'informations déjà établies
- Code livré sans validation visuelle préalable
- Lui signaler qu'elle s'éparpille

---

## État des projets code (2026-03-11)

**systema.agency :**
- Stack : TypeScript + Vite (client) + Vercel Functions (api/) + Neon PostgreSQL
- Déployé : `systema-agency.vercel.app`
- API routes : `api/trpc/[trpc].ts` + `api/oauth/callback.ts`
- Auth : OAuth Manus (VITE_OAUTH_PORTAL_URL non configuré) → app fonctionne en offline mode
- Sync cross-device : architecture prête, auth à finaliser

**À faire (Systema Agency) :**
- Implémenter auth sans OAuth Manus (Option A : auto-connexion owner, ou Option B : email/password)
- Redesign dashboard : sticky notes + onglets Santé/Finance/Carrière/Étude/Maison + avatar Life Command

---

## Sessions

```
[2026-03-11] [Claude Code Terminal] (session 2)
Tâche : Migration Neon PostgreSQL complète + fix build Vercel pnpm.
Fichiers modifiés : drizzle/schema.ts, server/db.ts, drizzle.config.ts, vercel.json
Fichiers créés : api/trpc/[trpc].ts, api/oauth/callback.ts
Résultat : API routes déployées sur Vercel. Auth OAuth Manus non configurée (offline mode).
```

```
[2026-03-11] [Claude Code Terminal]
Tâche : PromptVault — intégration complète dans Systema Agency.
Fichiers : client/src/pages/PromptVault.tsx (créé), App.tsx (route /prompt-vault), Home.tsx (bouton ⬡)
Features : copie, ajout, édition inline, suppression, drag & drop, onglets 3D
Contenu : 31 prompts, 11 catégories (tech, coaching, organisation, creativite, analyse, quotidien, clarte, apprentissage, finances, meta)
Déployé sur Vercel ✅
```

```
[2026-03-08] [Claude Code Terminal]
Tâche : Création du fichier Claude Code.md — instructions et mémoire de l'outil.
Contexte : Phase 0 du plan de setup vault.
```
