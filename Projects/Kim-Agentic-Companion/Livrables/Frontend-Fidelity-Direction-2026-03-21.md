# Frontend Fidelity Direction -- 2026-03-21

## Statut de reference initial (2026-03-21)
- A la date de redaction de ce document, le frontend etait a la fin de F4 et avant F5.
- La base a conserver existe deja: Next.js 15, React 19, scene Three.js / React Three Fiber, tabs, voice, chat, layout separe du backend.
- Ce document fixe la direction de fidelite a partir de cette base. Il ne demande ni reset, ni changement de moteur 3D.

## Note de rebaseline (2026-03-22)
- Un passage manuel plus recent sur `https://kim-frontend-staging.vercel.app` avec un vrai token API a montre que cette direction n est pas encore atteinte cote produit.
- Le rendu courant est juge tres loin de la vision cible, a environ 10% de la fidelite attendue.
- La presence de composants, tabs ou scene en code ne doit pas etre interpretee comme preuve d atteinte de `F5`.
- Ce document reste une direction cible, pas un constat de succes.

## Clarification de positionnement (2026-03-22 matin)
- Kim n est pas une application de compagnie.
- Kim est un AI agent ultra-competent oriente execution, aide sur fichiers, dossiers, sites et workflows.
- Replika n est ici qu une reference de qualite visuelle frontend, de presence et de finition.
- Des references jeu video peuvent egalement servir pour cadrer la qualite 3D, les materiaux, l animation et la mise en scene.
- Le backend / la posture produit doivent rester plus proches d un produit type OpenClaw que d une app de compagnie.

## Stack validee
- Next.js 15
- React 19
- Three.js
- React Three Fiber
- `@react-three/drei`

## Stack explicitement refusee
- Babylon.js
- Unity WebGL

## Cible produit
Atteindre un frontend d AI agent premium sans quitter la stack existante:
- avatar principal au format `GLB`
- presence animee credible (idle, listen, think, speak, react)
- materiaux PBR propres et coherents
- post-processing mesure, utile, et non envahissant
- interface et scene coherentes avec un produit execution-first
- signaux visuels de competence, clarte et controle
- performance mobile tenue comme contrainte produit, pas comme optimisation finale

## Principes de mise en oeuvre
1. Partir du `Frontend/` actuel et faire evoluer la scene F4, pas reconstruire ailleurs.
2. Garder un pipeline assets simple: `GLB` compresse, textures maitrisees, clips d animation reutilisables.
3. Ne pas surcharger la scene: chaque effet visuel doit justifier son cout GPU.
4. Preserver un fallback degrade si WebGL ou les assets 3D ne passent pas.
5. Eviter toute dependance qui duplique ce que Three.js, React Three Fiber et Drei couvrent deja.

## Priorites F5
1. Remplacer la presence 2.5D actuelle par un pipeline avatar `GLB` chargeable dans la scene existante.
2. Definir un set minimal d etats d animation: idle, greet, listen, speak, react.
3. Introduire les materiaux PBR, l eclairage et la mise en scene necessaires pour une perception premium et competente sans depasser le budget mobile.
4. Aligner la scene, l avatar et la UI avec le positionnement AI agent plutot qu avec un imaginaire relationnel.
5. Garder les options cosmetiques type wardrobe / room decoration comme secondaires tant que la presence coeur n est pas convaincante.
6. Mesurer la perf mobile pendant l implementation, pas seulement en fin de phase.

## Contraintes de qualite
- Compression des assets 3D obligatoire.
- Budget draw calls et taille textures surveilles.
- Post-processing limite a ce qui sert directement la lisibilite et la presence.
- Eviter les codes visuels qui suggerent une app de compagnie si cela brouille le positionnement produit.
- Les documents du projet doivent toujours distinguer:
  - etat reel sur `main`
  - cible de fidelite
  - prochaine phase executable
  - niveau produit percu apres validation reelle

## Protocole multi-agent
1. Un agent implemente une phase ou un sous-lot clairement borne.
2. Un second agent verifie le lot avant tout passage a la phase suivante.
3. La verification couvre au minimum:
   - conformite a la direction de ce document
   - absence de regression documentaire
   - preuves de validation technique pertinentes
   - coherence du statut dans `README.md`, `AGENT-INSTRUCTIONS.md`, `Roadmap.md`, `Todo.md` et `Livrables/Frontend-Implementation-Plan.md`
4. Une phase n est marquee complete que quand la verification est faite.
5. Aucune phase suivante n est ouverte officiellement tant que le sign-off precedent n a pas ete documente.

## Documents a garder alignes
- `Projects/Kim-Agentic-Companion/README.md`
- `Projects/Kim-Agentic-Companion/AGENT-INSTRUCTIONS.md`
- `Projects/Kim-Agentic-Companion/Roadmap.md`
- `Projects/Kim-Agentic-Companion/Todo.md`
- `Projects/Kim-Agentic-Companion/Frontend/README.md`
- `Projects/Kim-Agentic-Companion/Frontend/AGENT-INSTRUCTIONS.md`
- `Projects/Kim-Agentic-Companion/Livrables/Frontend-Implementation-Plan.md`

*Valide le 2026-03-21*
