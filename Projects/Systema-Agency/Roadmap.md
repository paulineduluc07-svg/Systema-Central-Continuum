# Roadmap -- Systema Agency

> Vision et etapes du projet.

---

## Vision
Dashboard de vie personnel organise par domaines : Sante, Finance, Carriere, Etude, Maison, Ressources IA.
Interface sobre et fonctionnelle. Notes syncees entre appareils via auth OAuth + Neon PostgreSQL.
Stack : TypeScript + React 19 + Vite + Tailwind v4 + tRPC + Drizzle ORM + Neon PostgreSQL + Vercel.

---

## Phase 0 -- Fondations (complete)
- [x] PromptVault en place
- [x] Migration Neon PostgreSQL complete
- [x] Deploiement Vercel actif
- [x] Migration GitHub -> SCC validee
- [x] Vague 1 securite (2026-03-19)
- [x] Refonte architecture frontend (2026-03-20)
  - Suppression de tout ce qui est RPG, Tarot, VisionBoard, LifeCommand
  - Nouveau dashboard : 6 onglets fixes + sticky notes par onglet
  - Backend allege : routers tarot et ai retires

## Phase 1 -- Sync et Auth (en cours)
- [ ] Configurer VITE_OAUTH_PORTAL_URL en prod (Vercel env vars)
- [ ] Valider le flux OAuth complet en prod
- [ ] Verifier les Vercel Functions /api/trpc/ et /api/oauth/callback
- [ ] Suivi medicament : migration localStorage -> DB (table suivi_entries + route tRPC)

## Phase 2 -- Stabilisation UX
- [ ] Completer .env.example avec toutes les variables
- [ ] Ajouter foreign keys dans schema Drizzle
- [ ] Tester sync cross-appareils (notes par onglet, suivi medicament)
- [ ] Polir l'interface Home (labels onglets avec accents : Sante -> Santé, etc.)

## Phase 3 -- Extension (future)
- [ ] Integrer Kim (compagnon IA) quand Kim MVP est stable
  - Kim est un projet separe : `Projects/Kim-Agentic-Companion/`
  - Ne pas implanter de chat IA dans Systema Agency avant que Kim soit pret
- [ ] Onglet Taches par domaine de vie (si besoin confirme)
- [ ] Export PDF fonctionnel avec donnees DB (pas localStorage)

---

*Mis a jour : 2026-03-20*
