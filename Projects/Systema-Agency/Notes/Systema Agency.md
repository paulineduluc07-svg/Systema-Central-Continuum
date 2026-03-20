Type : #context
Subject : #business
Status : #inprogress
Date : 2026-03-20

# PROJET -- Systema Agency

## Ligne d'arrivee
Dashboard de vie personnel, sobre et fonctionnel, synchronise entre appareils.

## C'est quoi
Application web organisee en 6 onglets fixes (Sante, Finance, Carriere, Etude, Maison, Ressources IA).
Chaque onglet = sticky notes syncees. Sante = + raccourci Suivi medicament. Ressources IA = Prompt Vault.
Pas de RPG, pas d'avatar, pas de tarot. Interface minimaliste orientee utilite reelle.

## Infos techniques
- Stack : React 19 + Tailwind v4 + shadcn/ui + tRPC + Drizzle ORM + Neon PostgreSQL + Vercel
- Code : `Projects/Systema-Agency/Code/`
- Live : `https://systema-agency.vercel.app`
- Auth : OAuth via SDK forge (VITE_OAUTH_PORTAL_URL requis en prod)
- Sync : localStorage si non connecte, Neon PostgreSQL si connecte

## Architecture frontend actuelle
```
pages/
  Home.tsx        -- 6 onglets + notes par onglet (nouveau, 2026-03-20)
  Suivi.tsx       -- suivi medicament (localStorage pour l instant)
  PromptVault.tsx -- bibliotheque prompts (statique)
hooks/
  useSyncedData.ts -- gere notes/tasks/prefs : DB si auth, localStorage sinon
```

## Schema DB (Neon PostgreSQL)
Tables actives : users, tasks, notes, user_preferences, custom_tabs, canvas_data
A creer : suivi_entries (pour sync Suivi medicament)

## Problemes connus et priorites
| Probleme | Priorite | Action |
|---|---|---|
| VITE_OAUTH_PORTAL_URL non configure Vercel | Haute | Configurer dans Vercel env vars |
| Suivi.tsx utilise localStorage uniquement | Haute | Ajouter table suivi_entries + route tRPC |
| .env.example incomplet | Moyenne | Ajouter toutes les variables |
| Foreign keys absentes en DB | Basse | Ajouter dans schema.ts |

## Ce qui a ete supprime (ne pas reimplanter)
- Drawn by Fate / Tarot (toutes les pages et composants)
- VisionBoard, DraggableGrid, DraggableWidget
- LifeCommandChat (le module chat IA s'appellera Kim, c'est un projet separe)
- Map, Whiteboard, GameTabs, AIChatBox, ManusDialog, QuickActions
- Widgets RPG : Avatar, Calendar, StatsGraph
- Hooks : useLifeCommandItems, useSpeechToText, useInfiniteCanvas, useComposition
- Doublons : components/PromptVault.tsx, components/prompt-vault.jsx
- Routers backend : tarot, ai (LifeCommand)

## Kim et Systema Agency
Kim est un projet separe (`Projects/Kim-Agentic-Companion/`), en cours de construction.
Ne pas toucher Kim. Ne pas l'integrer dans Systema Agency avant que son MVP soit stable.
Quand Kim sera pret, l'integration dans Systema Agency sera une decision consciente et explicite.

## Notes de session
[2026-03-08] Transfert complet depuis backup SCC.
[2026-03-17] Validation import GitHub -> SCC.
[2026-03-18] Audit documentaire SCC : remise a niveau du contexte et des priorites.
[2026-03-19] Vague 1 securite : retrait fallback mot de passe, retrait gate global, protection endpoints ai, rate-limit /api.
[2026-03-20] Audit complet du projet. Decision de refonte : retirer tout ce qui est RPG/Tarot/LifeCommand.
[2026-03-20] Refonte frontend executee :
  - 31 fichiers supprimes (drawn-by-fate, vision-board, widgets RPG, hooks inutilises, doublons)
  - Nouveau Home.tsx : 6 onglets fixes + sticky notes syncees par onglet
  - App.tsx nettoye, server/routers.ts allege
  - Documentation SCC mise a jour : AGENT-INSTRUCTIONS, Todo, Roadmap, Notes

*Mis a jour : 2026-03-20 | Claude (session refonte) -- Systema Central Continuum*
