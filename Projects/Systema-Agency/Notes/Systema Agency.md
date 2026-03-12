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
- Stack : React 19 + Tailwind + shadcn/ui + Framer Motion
- Tout le code est dans SCC-IPARA/Projects/Systema-Agency/Code/
- Live : https://systema-agency.vercel.app

## Design retenu : Cozy Gaming UI / Kawaii Tech
- Boutons avec volume, ombres portées, effet d'enfoncement au clic
- Navigation par onglets (Missions, Resources, House, Map)
- Palette Candy & Pastel : Rose bonbon, Jaune or, Cyan
- Édition directe — tout texte modifiable au clic
- Police : Fredoka One / Nunito (titres), Quicksand (corps)

## Ce qui marche (v actuelle)
- [x] Dashboard avec avatar RPG
- [x] Widgets draggables/resizables
- [x] Systeme de tabs
- [x] Tasks, Notes, Sticky notes, Whiteboard
- [x] Dark/Light mode, Export PDF, Mode offline
- [x] Auth + base de données cloud

## Bugs connus
| Bug | Fichier | Priorité |
|---|---|---|
| URL hardcodée forge.butterfly-effect.dev | Map.tsx:92 | Moyenne |
| Canvas vide (outils tldraw non chargés) | — | Haute |
| CSS @import order warning | index.css | Basse |

## Prochaines étapes
- Fix Map.tsx:92
- Fix canvas tldraw vide
- Widgets déplaçables librement
- Sticky notes volantes
- Widgets personnalisés par onglet
- Avatar lumineux et déplaçable
- Tester export PDF
- Configurer domaine custom

## Notes de session
[2026-03-08] Transfert complet depuis backup SCC.

*Mis à jour : 2026-03-11 | Paw — Systema Central Continuum*
