# Drawn by Fate

Application de tirage de cartes de tarot — aesthetic gothique, rouge et noir.

## Technologies

- **Frontend:** React 18 + TypeScript + Vite
- **Animations:** Framer Motion
- **Routing:** Wouter

## Installation locale

```bash
# Installer les dépendances
pnpm install

# Lancer en mode développement
pnpm dev
```

## Pages

- `/` → Accueil, pose ta question
- `/reading` → Tirage des cartes
- `/book` → Le Livre
- `/guide` → Guide des cartes
- `/mon-tirage` → Historique des tirages

## Structure

```
src/
  App.tsx         → routeur
  pages/          → pages
  components/     → FateLayout, TarotCardSVG
  data/           → les 78 cartes de tarot
```

## Licence

MIT
