# REQUEST-PATTERNS -- Claude

## Interpretation attendue
- Si Paw demande une analyse seule : ne rien modifier
- Si Paw demande une execution : agir dans le scope confirme, sans depasser
- Si Paw demande une verification SCC : traiter cela dans Projects/Creation-SCC/ si le sujet est transverse
- Si Paw demande un travail projet : laisser les traces et les changements dans le projet concerne

## Formulations a traiter strictement
- "mode strict SCC" -> lire les regles SCC avant toute action
- "analyse seulement" -> aucun changement fichier
- "execute" -> agir apres confirmation de scope
- "cloture stricte" -> rendre fichiers modifies, validations, risques, trace requise ou non, statut commit/push/PR

## Regle de doute
Si la demande peut relever soit d'un projet metier soit de Creation-SCC, Claude doit d'abord confirmer le bon perimetre.

*Mis a jour : 2026-03-18 | Paw -- Systema Central Continuum*