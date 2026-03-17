# systemaagency.md — Systema Agency

Notes du projet pour l'AI et le développeur.

---

## CONSIGNE SAVE CODE
Quand Pauli dit **"SAVE CODE"**, mettre à jour ce fichier avec :
- Ce qui a été fait durant la session (détaillé)
- Où on en est rendu dans le processus
- Les tâches complétées (cocher les items)
- Les bugs trouvés/corrigés
- Les leçons apprises
- Les prochaines étapes clairement listées

**Objectif : la prochaine personne qui ouvre ce fichier doit pouvoir continuer immédiatement sans poser de questions.**

---

## C'EST QUOI CE PROJET

Application de productivité pour neurodivergents.
Style : Cozy Gaming UI / Kawaii Tech — couleurs vives, boutons 3D, interface style RPG.
GitHub : https://github.com/paulineduluc07-svg/systema.agency
Live : https://systema-agency.vercel.app
Local : http://localhost:3000

---

## STRUCTURE

Projet **full-stack** — tous les dossiers sont légitimes.

```
client/src/       → frontend React (code actif)
server/           → backend Node.js + Express + tRPC
shared/           → types partagés front/back
drizzle/          → migrations base de données MySQL
```

```
client/src/
  App.tsx              → routeur principal
  pages/               → pages de l'app
  components/
    ui/                → composants shadcn/ui
    widgets/           → widgets du dashboard
    vision-board/      → vision board
  hooks/               → hooks React custom
  contexts/            → contextes (Theme, Config)
  data/                → données statiques
```

---

## TECH

- React 19 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Wouter 3.7.1 (routing, patché)
- tldraw (whiteboard)
- tRPC + Express (backend)
- Drizzle ORM + MySQL (base de données)
- Mode offline : localStorage
- `@` = alias vers `client/src/`

---

## CE QUI MARCHE

- [x] Dashboard avec avatar RPG
- [x] Widgets draggables/resizables
- [x] Système de tabs (Missions, Resources, House, Map)
- [x] Tasks, Notes, Sticky notes
- [x] Whiteboard (tldraw)
- [x] Dark/Light mode
- [x] Export PDF
- [x] Mode offline (localStorage)
- [x] Prompt Vault — 45 prompts, 13 catégories, gestion dynamique des cats, slider luminosité

## CE QUI MANQUE / INCOMPLET

- [ ] Calendar widget (skeleton seulement)
- [ ] Stats widget (skeleton seulement)
- [ ] Cloud sync (données perdues si changement de navigateur)
- [ ] Auth utilisateur (pas de compte)

---

## TÂCHES À FAIRE

- [ ] Fix URL hardcodée dans Map.tsx (~ligne 92) → remplacer forge.butterfly-effect.dev
- [ ] Corriger le canvas vide (outils tldraw non chargés)
- [ ] Supprimer la bulle de conversation de l'avatar
- [ ] Avatar lumineux en mode nuit
- [ ] Avatar déplaçable sur l'écran
- [ ] Supprimer widgets vides Calendar + Stats (ou les implémenter)

---

## BUGS CONNUS

| Fichier | Bug | Priorité |
|---------|-----|----------|
| Map.tsx:~92 | URL hardcodée forge.butterfly-effect.dev | Moyenne |
| index.css | CSS @import order warning | Basse |

---

## LEÇONS APPRISES

- wouter nécessite un patch (patches/wouter@3.7.1.patch) — ne pas supprimer ce dossier
- cross-env nécessaire pour NODE_ENV sur Windows
- Les dépendances (vite, etc.) peuvent manquer après un clone propre → toujours lancer `pnpm install` avant `pnpm dev` ou `pnpm build`
- Après un push sur une branche feature, merger dans `main` pour que Vercel redéploie automatiquement

---

## COMMANDES UTILES

```bash
# Lancer en local
cd "C:\Users\pauli\systema.agency"
pnpm dev
# → ouvre http://localhost:3000

# Déployer
git add -A && git commit -m "message" && git push
# → Vercel redéploie automatiquement

# Base de données
pnpm db:push
```

---

## TASK MANAGEMENT (règles de travail)

- **Plan First** : Écrire le plan ici avec des items cochables avant de commencer
- **Verify Plan** : Confirmer le plan avec Pauli avant d'implémenter
- **Track Progress** : Cocher les items au fur et à mesure
- **Explain Changes** : Résumé de haut niveau à chaque étape
- **Document Results** : Ajouter une section review après chaque tâche complétée
- **Capture Lessons** : Mettre à jour "Leçons apprises" après chaque correction

---

## HISTORIQUE DES SESSIONS

### 2026-01-17
- Setup environnement (pnpm, dépendances)
- Fix bugs (wouter patch, cross-env Windows, crash OAuth)
- Init git + push GitHub
- Déploiement Vercel sur https://systema-agency.vercel.app

### 2026-03-07
- Audit et nettoyage du projet
- Suppression drawn-by-fate-standalone/ (doublon)
- Suppression PROGRESS.md, todo.md, ideas.md (consolidés ici)
- Création de ce fichier systemaagency.md
- **Prochaines étapes** : voir section TÂCHES À FAIRE

### 2026-03-13
**Branche : `claude/add-systema-prompt-elements-Y4beK`**

#### Ce qui a été fait

**Prompt Vault — `client/src/pages/PromptVault.tsx`**

1. **+14 nouveaux prompts** (31 → 45 au total)
   - TECH : Webhook Make.com, Refactoring legacy, Intégration API REST
   - COACHING : Syndrome de l'imposteur, Zones d'énergie
   - CRÉATIVITÉ : Script YouTube, Campagne de lancement produit
   - APPRENTISSAGE : Maîtriser un sujet en 30 jours
   - NEURODIVERS (nouvelle cat.) : TDAH finir une tâche, Surcharge sensorielle, Routine flexible, Conversation difficile
   - COMMUNICATION (nouvelle cat.) : Email professionnel, Convaincre sans manipuler

2. **+2 nouvelles catégories** : NEURODIVERS (rose #f8a5c2) + COMMUNICATION (vert #badc58)

3. **Gestion dynamique des catégories** (bouton ⚙ CATÉGORIES)
   - Panneau collapsible avec liste des catégories + nb de prompts par cat
   - Renommer une catégorie + changer sa couleur (color picker HTML natif)
   - Supprimer une catégorie (reset filtre sur "TOUS" automatique)
   - Créer une nouvelle catégorie (label + color picker + touche Entrée)
   - TOUS est protégé (non supprimable)

4. **Slider de luminosité** sous les onglets catégorie
   - Plage 10%-100%, valeur affichée en temps réel
   - Contrôle l'opacité du texte + bordure + fond des onglets inactifs
   - Les onglets actifs restent toujours nets

5. **Lisibilité des textes améliorée**
   - Texte prompt : `#ffffff50` → `#ffffffcc`
   - Tags : `#ffffff33` → `#ffffffbb` + fond semi-transparent
   - Boutons icônes (✏ ✕ ☆) : beaucoup plus visibles
   - Compteur résultats, footer, drag handle : tous renforcés

#### État actuel
- Tout est pushé sur la branche feature
- Build Vercel validé (`pnpm build` passe sans erreur)
- **À faire pour déployer** : merger `claude/add-systema-prompt-elements-Y4beK` → `main`

#### Note importante
Les catégories et prompts ajoutés en cours de session sont **en mémoire (état React)** — ils sont réinitialisés au rechargement. Pour persister les données utilisateur, il faudra brancher sur localStorage ou la base de données.
