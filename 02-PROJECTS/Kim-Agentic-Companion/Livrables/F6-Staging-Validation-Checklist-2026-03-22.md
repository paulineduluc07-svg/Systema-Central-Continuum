# F6 Staging Validation Checklist -- 2026-03-22

## Objectif
Valider en environnement reel le scope `F6` avant sign-off final et avant ouverture officielle de `F7`.

## Statut courant
- Un premier passage manuel avec vrai token a deja eu lieu sur `https://kim-frontend-staging.vercel.app`.
- Ce passage n a pas donne de sign-off produit.
- Cette checklist doit maintenant servir de base de retest apres corrections, pas de preuve que `F6` est deja acceptee.

## Prerequis
- Frontend a tester: `https://kim-frontend-staging.vercel.app`
- Backend cible: `https://kim-agentic-companion-staging.vercel.app`
- Token bearer backend disponible dans le projet Vercel `kim-agentic-companion-staging`, variable `API_AUTH_TOKEN`
- Navigateur desktop avec `localStorage` actif

## Ou trouver le token
- Le token n est pas stocke dans le repo.
- Le frontend ne fait que conserver localement le token que l utilisateur colle.
- La valeur reelle attendue par le backend est la variable Vercel `API_AUTH_TOKEN` du projet `kim-agentic-companion-staging`.

## Parcours a valider

### 1. Auth gate
- Ouvrir le frontend sans token preexistant
- Verifier que `AuthGate` bloque l application et affiche le formulaire de connexion
- Entrer un token invalide
- Attendu: erreur visible, pas de session active, pas d acces au chat
- Entrer le vrai token
- Attendu: creation de session et acces a l application

### 2. Session et persistance locale
- Recharger la page apres connexion
- Attendu: le token reste present localement et la session est restauree correctement
- Cliquer `Logout device`
- Attendu: token supprime, permissions outils supprimees, retour au gate

### 3. Chargement des tools
- Aller sur l ecran chat avec le panneau outils
- Attendu: `GET /v1/tools` charge la liste sans erreur `401`
- Attendu: les cartes d outils affichent nom, description, badge permission et exemple JSON

### 4. Permissions outils directes
- Sur un outil non destructif comme `system.get_time`, tester `Allow once`
- Attendu: execution reussie, badge resultat visible, permission non memorisee
- Relancer le meme outil
- Attendu: la modale de confirmation reapparait
- Tester `Always allow`
- Attendu: execution reussie et permission memorisee localement
- Relancer le meme outil
- Attendu: execution directe sans repasser par la modale
- Tester `Deny`
- Attendu: statut bloque et permission memorisee comme refusee

### 5. Cohesion chat `/tool ...`
- Avec un outil marque `always`, envoyer une commande chat `/tool system.get_time {"timezone":"America/Toronto"}`
- Attendu: la commande passe sans friction supplementaire et le resultat outil apparait dans la bulle Kim
- Avec un outil marque `denied`, envoyer une commande chat `/tool web.fetch {"url":"https://example.com"}`
- Attendu: la commande est bloquee et le statut outil reste visible dans le chat

### 6. Settings
- Basculer `Auto-speak Kim replies`
- Attendu: la preference persiste apres reload
- Changer le theme entre `Rose Pulse`, `Aqua Drift`, `Sunset Glow`
- Attendu: le fond / ambience globale change et persiste apres reload
- Verifier le bloc compte
- Attendu: token masque, `userId` present, `sessionId` affiche si cree

### 7. Regression rapide
- Envoyer un message chat normal
- Attendu: la reponse Kim arrive sans casser le log
- Ouvrir `Wardrobe`
- Attendu: pas de regression evidente sur le panneau
- Verifier mobile width rapidement via responsive browser
- Attendu: gate, chat et settings restent utilisables

## Conditions de sign-off F6
- Tous les parcours ci-dessus passent
- Aucun `401` inattendu apres connexion
- Aucun conflit entre permissions du panneau outils et commandes `/tool ...`
- `Logout device` nettoie bien token et permissions
- Aucune regression evidente sur chat, settings ou layout
