# Frontend Fidelity Direction -- 2026-03-21

## Statut de reference
- Etat reel confirme sur `main`: frontend a la fin de F4 et avant F5.
- La base a conserver existe deja: Next.js 15, React 19, scene Three.js / React Three Fiber, tabs, voice, chat, layout separe du backend.
- Ce document fixe la direction de fidelite a partir de cette base. Il ne demande ni reset, ni changement de moteur 3D.

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
Atteindre un rendu compagnon type Replika-like sans quitter la stack existante:
- avatar principal au format `GLB`
- presence animee credible (idle, listen, think, speak, react)
- materiaux PBR propres et coherents
- post-processing mesure, utile, et non envahissant
- wardrobe par slots
- room decoration pilotable dans la scene
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
3. Introduire les materiaux PBR et un eclairage plus propre sans depasser le budget mobile.
4. Poser le socle wardrobe par slots avant d elargir le catalogue.
5. Poser le socle room decoration avec placement, snap simple et presets.
6. Mesurer la perf mobile pendant l implementation, pas seulement en fin de phase.

## Contraintes de qualite
- Compression des assets 3D obligatoire.
- Budget draw calls et taille textures surveilles.
- Post-processing limite a ce qui sert directement la lisibilite et la presence.
- Les documents du projet doivent toujours distinguer:
  - etat reel sur `main`
  - cible de fidelite
  - prochaine phase executable

## Protocole multi-agent
1. Un agent implemente une phase ou un sous-lot clairement borne.
2. Un second agent verifie le lot avant tout passage a la phase suivante.
3. La verification couvre au minimum:
   - conformite a la direction de ce document
   - absence de regression documentaire
   - preuves de validation technique pertinentes
   - coherence du statut dans `README.md`, `AGENT-INSTRUCTIONS.md`, `Roadmap.md`, `Todo.md` et `Livrables/Frontend-Implementation-Plan.md`
4. Une phase n est marquee complete que quand la verification est faite.
5. Aucun agent ne lance F6 tant que F5 n a pas ete verifie et signe off.

## Documents a garder alignes
- `Projects/Kim-Agentic-Companion/README.md`
- `Projects/Kim-Agentic-Companion/AGENT-INSTRUCTIONS.md`
- `Projects/Kim-Agentic-Companion/Roadmap.md`
- `Projects/Kim-Agentic-Companion/Todo.md`
- `Projects/Kim-Agentic-Companion/Frontend/README.md`
- `Projects/Kim-Agentic-Companion/Frontend/AGENT-INSTRUCTIONS.md`
- `Projects/Kim-Agentic-Companion/Livrables/Frontend-Implementation-Plan.md`

*Valide le 2026-03-21*