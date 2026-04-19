# F7 Preparation Plan -- 2026-03-22

## Positionnement
Ce document prepare `F7` sans la marquer ouverte officiellement.
Le prerequis n est plus seulement le sign-off staging de `F6`: le frontend coeur doit d abord etre recale cote produit.
Au 2026-03-22, `F7` reste bloquee.

## Objectif F7
Rendre le frontend installable comme web app, puis preparer l emballage mobile `Capacitor` iOS et Android.

## Preparation deja engagee
- Manifest web app ajoute via `Frontend/src/app/manifest.ts`
- Metadata / viewport PWA de base ajoutes dans `Frontend/src/app/layout.tsx`
- Base visuelle existante compatible avec une experience installable fullscreen

## Lot technique propose

### Lot A -- PWA shell
- Ajouter vraies icones PWA dediees (`192x192`, `512x512`, apple touch icon)
- Completer metadata SEO / install
- Choisir la strategie offline minimale
- Sortie attendue: app installable sans warning majeur

### Lot B -- Offline et caching
- Definir les ressources shell a precacher
- Laisser les appels API en network-first
- Garder la scene 3D et les assets lourds hors cache agressif initial
- Sortie attendue: shell UI charge meme en connectivite degradee

### Lot C -- Capacitor bootstrap
- Ajouter `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/android`
- Initialiser `capacitor.config`
- Definir le chemin de build web embarque
- Sortie attendue: projets natifs generables sans dette structurelle

### Lot D -- Mobile hardening
- Safe area insets iOS
- Ajustements viewport / clavier / scroll
- Verification du layout tabs, gate, settings et chat en small screens
- Sortie attendue: UI utilisable sans collision avec notch / home indicator

## Risques a surveiller
- Service worker qui cache trop agressivement l API
- Taille des assets 3D dans une logique installable / mobile
- Conflits entre fullscreen mobile et scene 3D
- Complexite du packaging iOS/Android avant stabilisation offline

## Ordre recommande apres sign-off F6
1. Finaliser les icones PWA reelles
2. Ajouter le service worker et la strategie de cache minimale
3. Revalider le build Vercel
4. Initialiser Capacitor
5. Traiter safe area et UX mobile
6. Lancer premiers builds iOS / Android
