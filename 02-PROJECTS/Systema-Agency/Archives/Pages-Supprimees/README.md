# Pages supprimées — Systema Agency

Archivées le 2026-05-05 à la demande de Pauline.

## Fichiers archivés

| Fichier | Origine | Description |
|---|---|---|
| `client/Kim.tsx` | `client/src/pages/Kim.tsx` | Page chat IA Kim |
| `client/Suivi.tsx` | `client/src/pages/Suivi.tsx` | Page suivi de médication |
| `server/kim-ai.ts` | `server/ai/kim.ts` | Logique backend de l'IA Kim |
| `server/suivi.test.ts` | `server/suivi.test.ts` | Tests unitaires Suivi |

## Ce qui a été retiré du code actif

- Routes `/kim` et `/suivi` dans App.tsx
- Liens de navigation dans Navbar.tsx et HomeV2.tsx
- Routers tRPC `ai` et `suivi` dans routers.ts
- Outils MCP `list_suivi` et `add_suivi_entry`
- Toutes les références dans les fichiers de tests

## Ce qui est conservé (infrastructure DB)

- Table `suiviEntries` dans drizzle/schema.ts (données préservées)
- Fonctions DB dans server/db.ts (dormantes)
