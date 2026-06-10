# Pages supprimées — Systema Agency

Archivées le 2026-05-05 à la demande de Pauline.

## Fichiers archivés

| Fichier | Origine | Description |
|---|---|---|
| `client/Kim.tsx` | `client/src/pages/Kim.tsx` | Page chat IA Kim |
| `client/Suivi.tsx` | `client/src/pages/Suivi.tsx` | Page suivi de médication |
| `server/kim-ai.ts` | `server/ai/kim.ts` | Logique backend de l'IA Kim |
| `server/suivi.test.ts` | `server/suivi.test.ts` | Tests unitaires Suivi |
| `drizzle/0001_suivi_entries.sql` | `Code/drizzle/0001_suivi_entries.sql` | Migration SQL de la table `suivi_entries` (archivée 2026-06-10 — table absente de `schema.ts`) |

## Ce qui a été retiré du code actif

- Routes `/kim` et `/suivi` dans App.tsx
- Liens de navigation dans Navbar.tsx et HomeV2.tsx
- Routers tRPC `ai` et `suivi` dans routers.ts
- Outils MCP `list_suivi` et `add_suivi_entry`
- Toutes les références dans les fichiers de tests

## Infrastructure DB

- ~~Table `suiviEntries` dans drizzle/schema.ts~~ — retirée de `schema.ts`/`db.ts` depuis.
  La table `suivi_entries` peut encore exister côté Neon (données préservées en DB), mais le code n'y touche plus.
