Type : #context
Subject : #business
Status : #inprogress
Date : 2026-03-18

# PROJET -- Systema Agency

## Ligne d'arrivee
App de productivite operationnelle live, testee et stable.

## C'est quoi
Dashboard RPG de productivite pour neurodivergents.
Interface "Cozy Gaming UI" tactile, coloree et organisee par onglets.

## Infos techniques
- Stack : React 19 + Tailwind + shadcn/ui + Framer Motion
- Tout le code est dans `Projects/Systema-Agency/Code/`
- Live : `https://systema-agency.vercel.app`

## Etat actuel
- Import GitHub -> SCC valide : 173/173 fichiers, 0 mismatch SHA
- Ancien repo archive en lecture seule jusqu'a suppression validee
- Dashboard avec avatar RPG, widgets et tabs deja presents
- Auth et certains points d'UX restent a finaliser

## Bugs connus
| Bug | Fichier | Priorite |
|---|---|---|
| URL hardcodee `forge.butterfly-effect.dev` | `Map.tsx` | Moyenne |
| Canvas vide (outils tldraw non charges) | a confirmer | Haute |
| Warning CSS `@import` order | `index.css` | Basse |

## Prochaines etapes
- Implementer auth
- Corriger `Map.tsx`
- Corriger le canvas vide
- Reprendre le redesign dashboard
- Integrer l'avatar Life Command et clarifier le suivi pilule

## Notes de session
[2026-03-08] Transfert complet depuis backup SCC.
[2026-03-17] Validation import GitHub -> SCC.
[2026-03-18] Audit documentaire SCC : remise a niveau du contexte et des priorites du projet.
[2026-03-19] Vague 1 securite: retrait fallback mot de passe client, retrait gate global, protection des endpoints ai.chat/categorize, rate-limit ajoute sur /api.


*Mis a jour : 2026-03-19 | Paw -- Systema Central Continuum*