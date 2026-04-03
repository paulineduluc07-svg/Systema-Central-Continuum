# Frontend Rebaseline -- 2026-03-22

## Pourquoi ce document existe
La lecture precedente du projet etait trop optimiste par rapport au ressenti produit reel.
Un passage manuel sur `https://kim-frontend-staging.vercel.app` avec un vrai token API a montre que le frontend courant ne peut pas etre considere comme signe.

## Retour produit a retenir
- Le chat semble etre la surface la plus convaincante a ce stade.
- Le reste du frontend demande encore des ajustements importants.
- Auth, tools et settings ne sont pas assez solides pour etre consideres comme termines.
- Le rendu visuel actuel est juge tres loin de la vision cible.
- Ordre de grandeur qualitatif retenu pour la fidelite actuelle: ~10% de la vision.

## Clarification de positionnement
- Kim n est pas une application de compagnie.
- Kim est un AI agent ultra-competent oriente execution et amelioration de performance de vie.
- Replika et des references jeu video servent uniquement a cadrer la qualite visuelle frontend et la 3D.
- Le produit hors frontend immersif doit davantage evoquer une posture type OpenClaw qu une app de compagnie.

## Consequence de statut
- Ne pas considerer `F5` comme atteinte cote produit.
- Ne pas considerer `F6` comme signee cote produit.
- Ne pas ouvrir `F7`.
- Ne pas laisser la doc suggerer que la simple presence de composants vaut sign-off.

## Ce qui semble le plus exploitable aujourd hui
- chat texte
- socle technique backend / frontend
- base de scene et composants existants comme points d appui, pas comme resultat final

## Ce qui doit etre repris avant toute suite
- direction visuelle globale
- presence Kim, scene, desirabilite et credibilite de l avatar
- auth UX
- tools / permissions UX
- settings UX
- cohesion produit globale hors chat

## Priorites de reprise pour demain matin
1. Faire un audit ecran par ecran du frontend actuel contre le positionnement clarifie
2. Lister les ecarts visibles et UX par severite
3. Isoler un premier lot de reprise coeur frontend
4. Decider si la scene actuelle est a iterer ou a reprendre plus franchement
5. Mettre a jour le backlog avant tout nouveau dev significatif

## Rappel de discipline
- Garder la stack actuelle
- Garder le backend stable comme point d appui
- Ne pas lancer de travail `F7` tant que le coeur frontend n est pas juge credible
- Toujours distinguer `code present`, `comportement reel` et `niveau produit percu`
