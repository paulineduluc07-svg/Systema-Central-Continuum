# Roadmap -- Systema Agency

> Vision et etapes du projet.

---

## Vision
Dashboard de vie personnel organise par domaines : Sante, Finance, Carriere, Etude, Maison, Ressources IA.
Interface sobre et fonctionnelle. Notes syncees entre appareils via auth email/password + Neon PostgreSQL.
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

## Phase 1 -- Sync et Auth (complete en code, en attente de deploiement)
- [x] Auth email/password implementee (2026-03-20)
  - Remplacement de l'OAuth Manus par auth auto-contenue
  - verifyCredentials() via HMAC + timingSafeEqual (crypto Node.js natif, zero dep)
  - Variables : OWNER_EMAIL, OWNER_PASSWORD, JWT_SECRET
- [x] Suivi medicament : sync DB implementee (2026-03-21)
  - Table suivi_entries dans schema + migration SQL
  - Router tRPC suivi.list / suivi.add / suivi.replace
  - Suivi.tsx : DB si auth, localStorage fallback sinon
- [ ] **Configurer variables Vercel** (bloque le deploiement)
- [ ] **Appliquer migration SQL** dans Neon (`drizzle/0001_suivi_entries.sql`)
- [ ] **Deployer et valider** en prod

## Phase 2 -- Stabilisation UX
- [ ] Completer .env.example avec toutes les variables actuelles
- [ ] Nettoyer fichiers server inutilises (oauth.ts, llm.ts, etc.)
- [ ] Ajouter foreign keys dans schema Drizzle
- [ ] Tester sync cross-appareils (notes par onglet, suivi medicament)

## Phase 3 -- Extension (future)
- [ ] Integrer Kim (compagnon IA) quand Kim MVP est stable
  - Kim est un projet separe : `Projects/Kim-Agentic-Companion/`
  - Ne pas implanter de chat IA dans Systema Agency avant que Kim soit pret
- [ ] Export PDF avec donnees DB

---

*Mis a jour : 2026-03-21*
