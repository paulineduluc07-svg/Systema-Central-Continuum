# Workflow - Systema Agency

Ce fichier definit notre facon de travailler, une tache a la fois.

## Cycle obligatoire (1 tache = 1 boucle complete)
1. Selectionner une tache unique dans `Todo.md` et la passer en `IN PROGRESS`.
2. Implementer uniquement cette tache (scope court, pas de melange).
3. Verifier la qualite localement:
   - `pnpm verify:step` (obligatoire)
   - `pnpm check` (objectif strict; voir dette actuelle ci-dessous)
4. Si propre, commit + push.
5. Mettre a jour les fichiers de suivi:
   - `Todo.md` (fait / en cours)
   - `Roadmap.md` (etat de phase)
   - `SESSION-LOG.md` (trace de la session)
   - `Notes/Systema Agency.md` (decision importante)

## Definition of Done (DoD)
- Fonctionnellement termine pour la tache cible.
- `pnpm verify:step` vert.
- Aucun nouveau warning/erreur critique introduit.
- Documentation de progression mise a jour.
- Commit pousse sur `main` (ou branche validee).

## Dette qualite connue (a resorber)
- `pnpm check` echoue actuellement sur des erreurs historiques (env backend, imports orphelins, typing UI).
- Regle temporaire: aucune nouvelle erreur TypeScript ne doit etre ajoutee.
- Priorite: traiter cette dette en taches dediees jusqu'a retour a zero.

## Convention de commits
- Format: `[Agent] [Systema-Agency] : description courte`
- Exemple: `[Codex] [Systema-Agency] : setup workflow et journal de session`
