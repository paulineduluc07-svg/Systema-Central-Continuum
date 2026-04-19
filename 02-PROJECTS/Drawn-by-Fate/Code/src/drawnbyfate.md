# drawnbyfate.md — Drawn by Fate

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

Application de tirage de cartes de tarot.
Style : sombre, mystique, rouge et noir, aesthetic gothique.
GitHub : https://github.com/paulineduluc07-svg/drawn-by-fate

---

## STRUCTURE

Le code actif est dans `src/` UNIQUEMENT.
(`client/` et `drawn-by-fate-standalone/` supprimés le 2026-03-07 — c'étaient des doublons)

```
src/
  App.tsx              → routeur principal (wouter)
  pages/
    Landing.tsx        → page d'accueil / formulaire de question
    Reading.tsx        → page de tirage des cartes
    Book.tsx           → le livre
    Guide.tsx          → guide des cartes
    MonTirage.tsx      → historique des tirages
  components/
    FateLayout.tsx     → layout principal + nav + étoiles décoratives
    TarotCardSVG.tsx   → composants des cartes (CardBack, CardFace, FlippableCard)
  data/
    tarotCards.ts      → données des 78 cartes de tarot
  main.tsx             → point d'entrée
```

---

## TECH

- React + TypeScript + Vite
- Framer Motion (animations)
- Wouter (routing)
- `@` = alias vers `src/`

---

## TÂCHES À FAIRE

- [ ] (à compléter au fil des sessions)

---

## BUGS CORRIGÉS

| Date | Fichier | Bug | Fix |
|------|---------|-----|-----|
| 2026-03-06 | TarotCardSVG.tsx | CardFace taille fixe 120x196 même avec size="sm" → débordait sur le texte | CardFace accepte maintenant un prop `size` comme CardBack |
| 2026-03-07 | TarotCardSVG.tsx | Bug présent dans 3 copies du fichier (client/, standalone/, src/) | Fix appliqué aux 3, puis doublons supprimés |

---

## LEÇONS APPRISES

- Ce projet avait 3 copies du même fichier dans 3 dossiers différents. Toujours vérifier combien de copies d'un fichier existent avant de le modifier.
- `FlippableCard` passe `size` à `CardBack` mais oubliait de le passer à `CardFace` — toujours vérifier tous les sous-composants quand on ajoute un prop.

---

## NOTES IMPORTANTES

- `FlippableCard` accepte `size="sm"`, `"md"`, `"lg"` — toujours passer size à `CardFace` ET `CardBack`
- Le style global est défini dans `FateLayout.tsx` (fond #050505, couleur principale #CC0000)

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

### 2026-03-06 / 2026-03-07
- Fix bug CardFace débordait sur le texte (size prop manquant)
- Découverte : 3 copies du fichier TarotCardSVG.tsx dans le projet
- Suppression des dossiers client/ et drawn-by-fate-standalone/ (doublons)
- Nettoyage complet : suppression de server/, shared/, drizzle/, fichiers systema.agency mal placés
- README.md corrigé (pointait vers systema.agency par erreur)
- Création de ce fichier drawnbyfate.md
- Projet propre et organisé ✅
- **Prochaines étapes** : voir section TÂCHES À FAIRE
