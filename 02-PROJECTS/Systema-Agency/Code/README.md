# Systema Agency

Dashboard personnel minimaliste organise autour de 3 entrees:
- Prompt Vault (`/prompt-vault`)
- Suivi medicament (`/suivi`)
- Tableau blanc (notes synchronisees)

## Stack actuelle

- Frontend: React 19 + Vite + Tailwind v4 + shadcn/ui
- Backend: Node.js + Express + tRPC
- Base de donnees: PostgreSQL (Neon) via Drizzle ORM
- Auth: email/password proprietaire + session JWT cookie (`jose`)
- Deploy: Vercel

## Structure du projet

```text
client/                UI React
server/                routers tRPC + couche data
server/_core/          auth, env, cookies, sdk, trpc
drizzle/               schema + migrations SQL
api/trpc/[trpc].ts     handler Vercel Function
```

## Prerequis

- Node.js 24+
- pnpm 10+

## Onboarding rapide

1. Installer les dependances:
```bash
pnpm install
```

2. Creer le fichier local:
```bash
cp .env.example .env
```

3. Renseigner au minimum dans `.env`:
- `DATABASE_URL`
- `JWT_SECRET`
- `OWNER_EMAIL`
- `OWNER_PASSWORD`

4. Lancer en local:
```bash
pnpm dev
```

## Commandes qualite

```bash
pnpm check       # TypeScript
pnpm test        # Vitest
pnpm build       # build client + bundle serveur
pnpm verify:step # test + build
pnpm verify:full # check + test + build
```

## Serveur MCP local

Systema expose un serveur MCP en TypeScript/Node.js pour donner le contexte projet aux clients MCP.

```bash
pnpm mcp:systema
```

Transports :
- local : `stdio` via `pnpm mcp:systema`
- public HTTPS : Streamable HTTP stateless sur `/mcp` (`/api/mcp` côté Vercel)

Surface actuelle : lecture seule sur les documents projet (`README`, `TODO`, `NOTES`, `NOTES_DE_PAULINE`, `WORKLOG`) + recherche textuelle simple. Les mutations DB ne sont pas exposées dans cette première passe.

## Auth (email/password)

- Login via `auth.login` (tRPC) avec `OWNER_EMAIL` + `OWNER_PASSWORD`.
- Verification dans `server/_core/sdk.ts` via HMAC timing-safe.
- Session JWT dans cookie (`JWT_SECRET`).
- Politique cookie:
  - par defaut `SameSite=Lax`
  - cross-site explicite via `COOKIE_CROSS_SITE=true` (HTTPS uniquement)

## Base de donnees et migration

- Schema Drizzle: `drizzle/schema.ts`
- Migration suivi: `drizzle/0001_suivi_entries.sql`

Appliquer les migrations:
```bash
pnpm drizzle-kit migrate
```

## Deploiement Vercel

Commande de deploy production:
```bash
vercel deploy --prod -y
```

Variables runtime requises sur Vercel:
- `DATABASE_URL`
- `JWT_SECRET`
- `OWNER_EMAIL`
- `OWNER_PASSWORD`

## Notes operationnelles

- Ce projet n'utilise plus OAuth.
- Ce projet n'utilise plus les modules RPG/Tarot/LifeCommand.
- Le projet Kim est separe (`Projects/Kim-Agentic-Companion/`).
