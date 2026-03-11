Type : #context
Subject : #business
Status : #inprogress
Date : 2026-03-08

# PROJET — Systema Agency

## Ligne d'arrivée

App de productivité opérationnelle — live, testée, bugs critiques corrigés.

## C'est quoi

Dashboard RPG de productivité pour neurodivergents.
Interface "Cozy Gaming UI" — tactile, colorée, organisée par onglets comme un menu de jeu.

## Infos techniques

- **Stack :** React 19 + Tailwind + shadcn/ui + Framer Motion
- **Live :** https://systema-agency.vercel.app
- **Dev local :** `pnpm dev` → http://localhost:3000

## Design retenu : Cozy Gaming UI / Kawaii Tech

- Boutons avec volume, ombres portées, effet d'enfoncement au clic
- Navigation par onglets (Missions, Resources, House, Map)
- Palette Candy & Pastel : Rose bonbon, Jaune or, Cyan
- Édition directe — tout texte modifiable au clic
- Police : Fredoka One / Nunito (titres), Quicksand (corps)

## Ce qui marche (v actuelle)

- [x] Dashboard avec avatar RPG
- [x] Widgets draggables/resizables
- [x] Systeme de tabs (Missions, Resources, House, Map)
- [x] Tasks : ajouter, cocher, supprimer
- [x] Notes : ajouter, éditer, supprimer
- [x] Sticky notes draggables
- [x] Whiteboard (tldraw)
- [x] Dark/Light mode
- [x] Export PDF
- [x] Mode offline (localStorage)
- [x] Auth + base de données cloud
- [x] Migration auto données locales → cloud à la première connexion

## Bugs connus

| Bug | Fichier | Priorité |
|---|---|---|
| URL hardcodée forge.butterfly-effect.dev | Map.tsx:92 | Moyenne |
| Canvas vide (outils tldraw non chargés) | — | Haute |
| CSS @import order warning | index.css | Basse |

## Prochaines étapes

- [ ] Fix Map.tsx:92 URL hardcodée
- [ ] Fix canvas tldraw vide
- [ ] Widgets déplaçables librement (pas seulement en haut)
- [ ] Sticky notes volantes
- [ ] Widgets personnalisés par onglet
- [ ] Supprimer bulle de conversation avatar
- [ ] Avatar lumineux en mode nuit
- [ ] Avatar déplaçable sur l'écran
- [ ] Supprimer Calendar + Stats widgets vides
- [ ] Tester export PDF
- [ ] Configurer domaine custom (systema.agency)

## Notes de session

```
[2026-03-08] [Claude Code Terminal]
Tâche : Transfert complet depuis PROGRESS.md, ideas.md, todo.md du backup SCC.
Info : Ces fichiers étaient mal placés dans le dossier drawn-by-fate (erreur de session précédente). Contenu = Systema Agency.
Branche claude/book-idea-website-ZVkWZ fusionnée dans main ✅
```
