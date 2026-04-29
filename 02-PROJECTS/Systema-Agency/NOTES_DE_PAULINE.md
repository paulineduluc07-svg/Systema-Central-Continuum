### \# Notes de vision de pauline — Fonctionnalités à développer

### 

### \## Règle générale pour les agents

### 

### Ce fichier sert à documenter des idées, intentions et directions produit.

### 

### Ne pas modifier, supprimer, déplacer ou réorganiser du code uniquement à partir de ces notes sans validation claire.

### 

### Avant toute modification importante :

### 1\. Lire le contexte existant du projet.

### 2\. Identifier les fichiers concernés.

### 3\. Proposer un plan court.

### 4\. Attendre une validation si le changement touche l’architecture, les données ou l’interface principale.

### 

### \---

### 

### \# 1. Vision — Notes volantes

### 

### \## Objectif

### 

### Créer un système de notes volantes dans l’application.

### 

### Ces notes doivent fonctionner comme des petits widgets libres que l’utilisateur peut placer sur un tableau blanc.

### 

### L’idée est de permettre une prise de notes rapide, visuelle et flexible, sans imposer une structure rigide.

### 

### \## Comportement souhaité

### 

### Les notes volantes doivent :

### 

### \- apparaître sur le tableau blanc principal ;

### \- être déplaçables librement en drag-and-drop ;

### \- pouvoir être placées où je veux sur l’écran ;

### \- rester visibles comme des widgets ;

### \- avoir un style cohérent avec le reste de l’application ;

### \- utiliser un effet glassmorphism ;

### \- être simples, légères et rapides à utiliser.

### 

### \## Style visuel

### 

### Le style doit être :

### 

### \- glassmorphism ;

### \- semi-transparent ;

### \- doux visuellement ;

### \- cohérent avec le design général de l’app ;

### \- moderne, propre et pas trop chargé.

### 

### \## Vision long terme

### 

### À long terme, je veux aussi avoir un espace de rangement pour les notes.

### 

### Cet espace servirait à :

### 

### \- ranger les notes en trop ;

### \- archiver les notes que je ne veux plus voir sur le tableau blanc ;

### \- garder les anciennes notes accessibles sans encombrer l’écran principal.

### 

### \## Important

### 

### Ne pas construire tout le système d’archive immédiatement si ce n’est pas nécessaire.

### 

### Pour une première version, prioriser :

### 

### 1\. affichage des notes sur le tableau blanc ;

### 2\. déplacement libre des notes ;

### 3\. style visuel glassmorphism ;

### 4\. structure prête à évoluer vers un système d’archivage plus tard.











### 

### \---

### 

### \# 2. Modification souhaitée — Prompt Vault

### 

### \## Objectif

### 

### Améliorer le Prompt Vault pour permettre d’associer une image à un prompt.

### 

### Certains prompts servent à générer des designs, des images ou des visuels. Dans ces cas-là, je veux pouvoir voir le résultat visuel directement dans le Prompt Vault.

### 

### \## Fonctionnalité souhaitée

### 

### Ajouter une option pour joindre ou afficher une image liée à un prompt.

### 

### Chaque prompt pourrait éventuellement avoir :

### 

### \- un titre ;

### \- le texte du prompt ;

### \- une catégorie ou un tag ;

### \- une image associée ;

### \- un aperçu visuel sur la page principale.

### 

### \## Page principale du Prompt Vault

### 

### Sur la page principale, là où tous les prompts sont affichés, je veux pouvoir voir l’image associée au prompt si elle existe.

### 

### Comportement souhaité :

### 

### \- si un prompt a une image, afficher un aperçu de l’image directement dans la carte du prompt ;

### \- si un prompt n’a pas d’image, afficher seulement le texte ou un placeholder discret ;

### \- l’image ne doit pas prendre toute la place ;

### \- le visuel doit rester propre et lisible ;

### \- l’image doit aider à reconnaître rapidement le prompt.

### 

### \## Cas d’usage

### 

### Exemples :

### 

### \- prompt pour générer un dashboard ;

### \- prompt pour créer un design glassmorphism ;

### \- prompt pour une image de branding ;

### \- prompt pour une interface UI ;

### \- prompt pour une image esthétique ou créative.

### 

### Dans ces cas-là, voir l’image directement aide à retrouver le bon prompt plus vite.





### 

































































