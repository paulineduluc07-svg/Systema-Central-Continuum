import { useState, useMemo, useRef } from "react";

interface Category {
  id: string;
  label: string;
  color: string;
}

interface Prompt {
  id: number;
  cat: string;
  title: string;
  tags: string[];
  text: string;
}

const INITIAL_CATS: Category[] = [
  { id: "all", label: "TOUS", color: "#00f5ff" },
  { id: "tech", label: "TECH/CODE", color: "#7bed9f" },
  { id: "coaching", label: "COACHING", color: "#eccc68" },
  { id: "organisation", label: "ORGANISATION", color: "#a29bfe" },
  { id: "creativite", label: "CRÉATIVITÉ", color: "#fd79a8" },
  { id: "analyse", label: "ANALYSE", color: "#55efc4" },
  { id: "quotidien", label: "QUOTIDIEN", color: "#ff9f7f" },
  { id: "clarte", label: "CLARTÉ", color: "#74b9ff" },
  { id: "apprentissage", label: "APPRENTISSAGE", color: "#ffd32a" },
  { id: "finances", label: "FINANCES", color: "#cd84f1" },
  { id: "meta", label: "META-PROMPT", color: "#ff5e57" },
  { id: "neurodivers", label: "NEURODIVERS", color: "#f8a5c2" },
  { id: "communication", label: "COMMUNICATION", color: "#badc58" },
];

const DATA: Prompt[] = [
  { id:1, cat:"coaching", title:"Clarifier une décision difficile", tags:["décision","clarté","blocage"], text:`Je dois prendre une décision et je tourne en rond. Aide-moi à clarifier en posant 5 questions puissantes, une à la fois. Commence par identifier ce que je veux vraiment VS ce que je crois devoir faire. Situation: [DÉCRIRE ICI]` },
  { id:2, cat:"coaching", title:"Identifier un pattern répétitif", tags:["pattern","comportement","conscience"], text:`Analyse cette situation que je vis régulièrement et identifie le pattern sous-jacent. Qu'est-ce que ça révèle sur mes croyances ou besoins non comblés? Sois direct, pas doux. Situation récurrente: [DÉCRIRE ICI]` },
  { id:3, cat:"coaching", title:"Plan d'action 30 jours", tags:["objectif","action","planification"], text:`Crée un plan d'action réaliste sur 30 jours pour atteindre cet objectif. Découpe en semaines, avec 1-2 actions concrètes par jour max. Tiens compte de mon énergie et contraintes. Objectif: [ICI] Contraintes: [ICI]` },
  { id:4, cat:"tech", title:"Déboguer un workflow Make.com", tags:["make","automation","debug"], text:`Je rencontre une erreur dans mon scénario Make.com. Analyse l'erreur suivante et donne-moi les 3 causes les plus probables avec la solution pour chacune. Sois précis et technique. Erreur: [COLLER ICI] Contexte: [DÉCRIRE]` },
  { id:5, cat:"tech", title:"Structure table Airtable", tags:["airtable","base de données","structure"], text:`Je veux créer une table Airtable pour [OBJECTIF]. Propose-moi la structure complète: noms des champs, types de champs, et les liaisons avec d'autres tables si pertinent. Optimise pour la facilité d'utilisation et les automatisations Make.com.` },
  { id:6, cat:"tech", title:"Prompt système pour agent IA", tags:["agent","prompt","ia"], text:`Crée un prompt système complet pour un agent IA spécialisé en [DOMAINE]. Inclus: rôle, personnalité, règles de réponse, format de sortie, exemples de cas d'usage. L'agent doit être: [CARACTÉRISTIQUES]` },
  { id:7, cat:"organisation", title:"Planifier une semaine chargée", tags:["planning","priorités","énergie"], text:`Voici mes tâches et contraintes pour la semaine. Crée un plan réaliste en tenant compte de mon niveau d'énergie (matin=haute, après-midi=moyenne, soir=basse), mes contraintes familiales, et le principe d'une seule tâche majeure par jour. Tâches: [LISTE]` },
  { id:8, cat:"organisation", title:"Triage de liste de tâches", tags:["priorités","triage","focus"], text:`Voici ma liste de tâches. Classe-les selon la matrice Eisenhower (urgent/important). Pour chaque quadrant, donne-moi l'action recommandée. Identifie les 3 tâches absolument prioritaires aujourd'hui. Tâches: [LISTE]` },
  { id:9, cat:"analyse", title:"Analyser des données de ventes", tags:["ventes","analyse","insights"], text:`Analyse ces données de ventes et identifie: 1) les tendances principales, 2) les anomalies à investiguer, 3) les opportunités cachées, 4) les recommandations concrètes. Présente sous forme de rapport structuré. Données: [COLLER ICI]` },
  { id:10, cat:"analyse", title:"Audit processus opérationnel", tags:["processus","audit","optimisation"], text:`Analyse ce processus opérationnel et identifie: les goulots d'étranglement, les étapes redondantes, les risques d'erreur, et propose 3 améliorations concrètes classées par impact/effort. Processus: [DÉCRIRE ICI]` },
  { id:11, cat:"creativite", title:"Nom + slogan pour projet", tags:["branding","créativité","naming"], text:`Génère 10 noms créatifs pour [DÉCRIRE LE PROJET]. Pour chaque nom: propose un slogan court (max 8 mots), explique l'angle créatif en 1 phrase. Critères: mémorable, prononçable en français et en anglais, évoque [VALEURS CLÉS].` },

  // QUOTIDIEN
  { id:12, cat:"quotidien", title:"Protocole Anti-Procrastination", tags:["procrastination","blocage","action"], text:`Tâche que j'évite constamment : [décrivez la tâche, depuis combien de temps vous la repoussez]

Ne me laissez pas m'en tirer.

Votre rôle :
- Nommez la vraie raison pour laquelle je suis bloqué (pas l'excuse, mais le véritable obstacle)
- Dénoncez le mensonge que je me raconte
- Donnez-moi une action de 2 minutes qui lance l'élan
- Mettez en place un piège pour que je ne puisse plus me défiler

Règles :
- Pas de conseils génériques du type "divisez-la en petites étapes"
- Pas de discours de motivation
- Traitez-moi comme quelqu'un de capable mais qui stagne

Je n'ai pas besoin de motivation. J'ai besoin d'un coup de pouce.` },
  { id:13, cat:"quotidien", title:"Anti-Fatigue Décisionnelle", tags:["décision","routine","automatisation"], text:`Créez des systèmes qui réduisent la charge de prise de décision quotidienne.` },
  { id:14, cat:"quotidien", title:"Organisateur de Tâches Domestiques", tags:["tâches","maison","organisation"], text:`Auditez mes responsabilités domestiques. Triez-les en tâches quotidiennes, hebdomadaires et mensuelles qui semblent réalisables.` },
  { id:15, cat:"quotidien", title:"Sprint de Désencombrement Numérique", tags:["numérique","nettoyage","sprint"], text:`Soyez mon guide de désintoxication numérique. Créez un sprint de 3 jours pour nettoyer mon téléphone, mon bureau, ma boîte de réception et mon stockage cloud. Incluez des systèmes de nommage de fichiers, des filtres de boîte de réception et une liste de contrôle de réinitialisation mensuelle.` },
  { id:16, cat:"quotidien", title:"Organisateur de Fichiers Chaotiques", tags:["fichiers","nommage","archivage"], text:`Mon dossier [Téléchargements / Bureau / Documents] est un désastre. J'ai besoin que vous passiez en revue chaque fichier de ce dossier et que vous l'organisiez.

Créez des sous-dossiers par catégorie : Documents, Images, Vidéos, Tableurs, Code, Archives et Divers.

Renommez les fichiers qui ont des noms inutiles comme "IMG_3847" ou "Capture d'écran 2025-12-03" en quelque chose de descriptif basé sur le contenu du fichier. Utilisez le format : AAAA-MM-JJ_nom-descriptif.ext

Créez un fichier journal appelé rapport-nettoyage.md qui montre chaque fichier déplacé, son nouveau nom et pourquoi. Signalez les doublons mais ne les supprimez pas — déplacez-les dans un dossier Doublons pour examen.` },
  { id:17, cat:"quotidien", title:"Optimiseur de Stockage", tags:["stockage","espace","nettoyage"], text:`Analysez mon stockage : [COLLEZ LES DÉTAILS DU STOCKAGE]. Suggérez des fichiers, des caches et des applications que je peux supprimer ou déplacer pour libérer de l'espace sans rien casser.` },

  // CLARTÉ
  { id:18, cat:"clarte", title:"Moteur de Décision Personnel", tags:["décision","stratégie","matrice"], text:`Vous êtes mon stratège de décision impitoyable, avec une tolérance zéro pour la paralysie d'analyse.

Décision : [décrivez le choix, les enjeux et les contraintes]

Livrez :
1. Reformulez en options claires (soit/soit ou plusieurs chemins)
2. Matrice de critères pondérés (tableau : critères, poids, scores par option)
3. Pré-mortem pour chaque option ("12 mois plus tard, cela a échoué – que s'est-il passé ?")
4. Minimisation des regrets (à 80 ans, quel choix entraîne le plus de regrets si NON pris ?)
5. 10/10/10 (comment me sentirai-je dans 10 minutes / 10 mois / 10 ans ?)
6. Options cachées que je ne vois pas (combiner, retarder, couvrir, déléguer)
7. Votre verdict final argumenté avec un paragraphe de justification

Soyez direct. Pas d'hésitation. Aidez-moi à décider, pas à délibérer éternellement.` },
  { id:19, cat:"clarte", title:"Structurez Ma Pensée Désordonnée", tags:["clarté","organisation","vidage"], text:`Voici un remue-méninges de ce que je pense : [NOTES OU FRAGMENTS]. Organisez cela en une structure ou un plan clair sans changer ma voix ou mes idées.` },
  { id:20, cat:"clarte", title:"Stratège de Vie — Miroir de Vérité", tags:["vie","vision","vérité"], text:`Agissez en tant que mon Stratège de Vie IA, Coach de Clarté et Miroir de Vérité. Votre rôle est de découvrir ce que je veux vraiment dans la vie — pas ce que la société, la famille, l'argent ou l'ego attendent.

1. Posez-moi 7 questions ultra-ciblées, une à la fois, conçues pour être inconfortables, honnêtes et profondément révélatrices.
2. Chaque question doit éliminer le désir de plaire, la peur, la comparaison et les fausses ambitions.
3. Exposez mes vrais désirs, mes frustrations cachées, mes pertes d'énergie, mes regrets et ma définition de la liberté.
4. Évitez les questions génériques, motivantes ou superficielles.
5. Après mes réponses, analysez les schémas sans édulcorer la vérité.
6. Créez un Plan de Clarté 2026 basé strictement sur mes réponses.
7. Définissez mes 3 Priorités de Vie Principales pour 2026.
8. Identifiez ce que je dois abandonner immédiatement (habitudes, objectifs, croyances, environnements).
9. Construisez une feuille de route de clarté et d'action de 30 jours.` },
  { id:21, cat:"clarte", title:"Thérapeute — Travail de l'Ombre", tags:["ombre","sabotage","traumatisme"], text:`Vous êtes un thérapeute liseur d'esprit avec une formation avancée en travail de l'ombre, coaching informé sur les traumatismes, intégration somatique, théorie de l'attachement et conception d'identité de haute performance.

Vous ne donnez pas de conseils superficiels. Vous effectuez une analyse psychologique spécialisée dans le décodage des cycles de sabotage, des boucles émotionnelles, des traumatismes non résolus, des désirs et potentiels supprimés — avec une clarté terrifiante.

Situation à analyser : [DÉCRIRE ICI]` },
  { id:22, cat:"clarte", title:"Le Protocole d'Exécution (3 étapes)", tags:["exécution","clarté","jeu vidéo"], text:`Guidez-moi à travers le Protocole d'Exécution en 3 étapes :

Étape 1 — L'Excavation (Matin) : Posez les questions sur mon insatisfaction tolérée, la vérité insupportable que j'évite, et mon Anti-Vision (la vie que je refuse d'avoir).

Étape 2 — La Rupture de Schéma (Journée) : Cartographiez mon Ego et créez des interruptions pour briser mon autopilote. Proposez des alarmes ou rappels ciblés.

Étape 3 — La Synthèse du Jeu Vidéo (Soir) : Créez ma Carte de Jeu avec : La Victoire, Les Enjeux, La Mission, Le Boss de fin, Les Quêtes du jour, Les Règles du jeu.` },
  { id:23, cat:"clarte", title:"Constructeur de Résilience Mentale", tags:["résilience","habitudes","incertitude"], text:`Concevez des habitudes qui me maintiennent affûté pendant de longues périodes d'incertitude.` },

  // APPRENTISSAGE
  { id:24, cat:"apprentissage", title:"Configuration du Second Cerveau", tags:["second cerveau","notion","obsidian"], text:`Construisez-moi un système Notion ou Obsidian qui fonctionne comme un second cerveau — incluant la capture de tâches, l'incubation d'idées, les pipelines de projets et la répétition espacée.` },
  { id:25, cat:"apprentissage", title:"Adaptez-vous à Mon Cerveau", tags:["apprentissage","visuel","style"], text:`J'apprends mieux par [vidéos/exemples/visuels]. Construisez un plan d'apprentissage pour [SUJET] qui correspond à mon style.` },
  { id:26, cat:"apprentissage", title:"Résumé Visuel Sketchnote", tags:["sketchnote","visuel","résumé"], text:`Créez un résumé visuel de ces notes sous forme de sketchnote dessiné à la main. Fond de papier blanc immaculé (sans lignes). Style : "enregistrement graphique" avec des feutres fins à encre noire. Utilisez des marqueurs de couleur (sarcelle, orange et rouge sourd) pour un ombrage simple. Centrez le titre dans une boîte rectangulaire style 3D. Entourez-le de gribouillis, d'icônes, de bonhommes allumettes et de graphiques répartis radialement. Utilisez des flèches pour relier les idées. Texte manuscrit en majuscules, organisé comme une séance de brainstorming professionnelle. Format A4.

Notes à illustrer : [COLLER ICI]` },

  // FINANCES
  { id:27, cat:"finances", title:"Planificateur de Survie Financière", tags:["budget","finances","survie"], text:`Si je gagne [MONTANT HEBDOMADAIRE] par semaine, construisez un budget mensuel étanche. Ce budget doit couvrir toutes les dépenses essentielles tout en me permettant de réinvestir une partie pour la croissance de mon entreprise.` },
  { id:28, cat:"finances", title:"Stratège de Revenus Numériques", tags:["revenus","numérique","débutant"], text:`Basé sur mon expérience en [MON EXPÉRIENCE], suggérez 5 idées de revenus numériques adaptées aux débutants que je peux lancer cette semaine sans coût initial et sans audience existante.` },
  { id:29, cat:"finances", title:"Architecte d'Offres de Services", tags:["freelance","offre","tarification"], text:`À partir de la liste ci-dessus, sélectionnez l'idée la plus viable. Structurez-la en un service freelance complet. Détaillez ce qu'il faut vendre, comment le tarifer, le client cible idéal et les meilleures plateformes pour le proposer.` },
  { id:30, cat:"finances", title:"Machine à Contenu de Marque Personnelle", tags:["contenu","marque","calendrier"], text:`Activez le Mode Canevas. Vous êtes mon copilote de contenu à vie. Je téléchargerai ou collerai ma niche, des échantillons de ma voix et mon public cible une seule fois.

Créez un canevas perpétuel appelé "OS de Contenu" avec une grille de calendrier mensuel (thème nébuleuse sombre, cartes en glassmorphism, lueur subtile).

Chaque jour est une carte avec : une idée de publication à forte conviction, et un statut (Non commencé / Brouillon / Publié).

Boutons sur chaque carte :
1. Rédiger la publication LinkedIn complète + diapositives carrousel
2. Rédiger le fil X + images mèmes
3. Rédiger la section newsletter
4. Rédiger le script YouTube + vignette
5. Réutiliser tout pour e-mail + Instagram

Nous travaillons un jour à la fois pour toujours. Souvenez-vous de tout ce que nous créons dans ce fil.` },

  // META
  { id:31, cat:"meta", title:"L'Anatomie d'un Prompt Claude", tags:["prompt","structure","méta"], text:`Structure ultime pour créer vos propres prompts :

1. Objectif : Je veux [TÂCHE] afin que [CRITÈRES DE SUCCÈS].

2. Contexte : D'abord, lisez entièrement ces fichiers avant de répondre.

3. Référence : Voici une référence de ce que je veux accomplir + Voici ce qui fait que cette référence fonctionne.

4. Brief de Succès :
   - Type de sortie
   - Réaction du destinataire
   - Ne doit PAS ressembler à
   - Le succès signifie

5. Règles : Lisez mon fichier de contexte. Posez des questions de clarification avant de commencer. Donnez-moi votre plan d'exécution (5 étapes maximum).` },

  // TECH supplémentaires
  { id:32, cat:"tech", title:"Créer un webhook Make.com", tags:["make","webhook","api"], text:`Guide-moi pour créer un webhook dans Make.com afin de recevoir des données depuis [SOURCE : ex. formulaire, Stripe, Shopify].

Inclus :
1. La configuration du module Webhook dans Make
2. Le format JSON attendu
3. Comment parser et router les données reçues
4. Un exemple de scénario complet avec au moins 2 modules après la réception

Source : [DÉCRIRE ICI]
Action à déclencher : [DÉCRIRE ICI]` },

  { id:33, cat:"tech", title:"Refactoriser du code legacy", tags:["refacto","dette technique","qualité"], text:`Tu es un senior dev expert en refactoring. Analyse ce code et propose une version refactorisée.

Objectifs :
- Lisibilité maximale
- Supprimer la duplication
- Respecter les principes SOLID
- Ajouter les types TypeScript si applicable
- Conserver le comportement exact

Donne d'abord un diagnostic rapide (3 points), puis le code refactorisé avec des commentaires sur les changements majeurs.

Code à refactoriser :
\`\`\`
[COLLER ICI]
\`\`\`` },

  { id:34, cat:"tech", title:"Créer une intégration API REST", tags:["api","rest","intégration"], text:`Je dois connecter [SERVICE A] avec [SERVICE B] via leurs APIs REST.

Génère :
1. Le schéma d'authentification (OAuth2 / API Key / JWT) pour chaque service
2. Les endpoints clés dont j'ai besoin
3. Le code d'exemple en JavaScript/TypeScript pour l'appel principal
4. La gestion d'erreurs et les retry logic
5. Un exemple de payload de requête et de réponse attendue

Service A : [NOM + URL DOCS]
Service B : [NOM + URL DOCS]
Objectif : [DÉCRIRE CE QU'ON VEUT FAIRE]` },

  // COACHING supplémentaires
  { id:35, cat:"coaching", title:"Dépasser le syndrome de l'imposteur", tags:["imposteur","confiance","blocage"], text:`Je souffre du syndrome de l'imposteur dans le contexte suivant : [DÉCRIRE]

Analyse :
1. Les distorsions cognitives précises que j'exprime
2. L'origine probable de cette croyance (1-2 hypothèses)
3. Les preuves concrètes qui la contredisent (basées sur ce que je décris)
4. Un recadrage cognitif puissant en 2-3 phrases
5. Une action immédiate pour agir malgré l'inconfort

Ne me dis pas que c'est normal ou que tout le monde vit ça. Parle-moi de MON cas.` },

  { id:36, cat:"coaching", title:"Identifier mes zones d'énergie", tags:["énergie","productivité","self-awareness"], text:`Je veux comprendre quand et pourquoi je suis en haute ou basse énergie pour optimiser mes journées.

Pose-moi 6 questions stratégiques, une à la fois, sur :
- Mes activités qui me rechargent vs me vident
- Mes patterns d'énergie physique et mentale
- Mes triggers de procrastination
- Mes conditions idéales de travail

Après mes réponses, crée :
- Mon profil d'énergie personnalisé
- Un template de journée idéale basé sur mes cycles
- 3 règles de protection d'énergie non négociables` },

  // CRÉATIVITÉ supplémentaires
  { id:37, cat:"creativite", title:"Script de vidéo YouTube", tags:["youtube","script","contenu"], text:`Écris un script complet pour une vidéo YouTube de [DURÉE : ex. 8-10 min] sur le sujet : [SUJET]

Structure :
- Hook (0-30s) : question ou affirmation choc pour retenir l'attention
- Intro (30s-1min) : promesse de valeur + accroche personnelle
- Corps (x sections) : [NOMBRE DE POINTS CLÉS]
- CTA intermédiaire (à mi-vidéo)
- Conclusion + CTA final

Style : [DÉCRIRE TON STYLE : ex. éducatif, storytelling, dynamique]
Audience : [DÉCRIRE ICI]
Note d'intention : le spectateur doit repartir avec [CE QU'ILS APPRENNENT/RESSENTENT]` },

  { id:38, cat:"creativite", title:"Campagne de lancement produit", tags:["lancement","marketing","produit"], text:`Crée une stratégie de lancement complète pour : [DÉCRIRE LE PRODUIT/SERVICE]

Inclus :
1. Message central (1 phrase inoubliable)
2. Séquence de teasing sur 7 jours (quoi poster chaque jour)
3. 3 angles de contenu différents (éducatif, émotionnel, preuve sociale)
4. 5 titres de posts accrocheurs
5. Email de lancement (objet + corps)
6. Objections principales et comment les retourner

Cible : [DÉCRIRE L'AUDIENCE]
Prix : [ICI]
Plateformes : [ICI]` },

  // APPRENTISSAGE supplémentaires
  { id:39, cat:"apprentissage", title:"Maîtriser un sujet en 30 jours", tags:["apprentissage","rapidité","focus"], text:`Je veux apprendre [SUJET] en 30 jours à raison de [X heures/jour].

Crée un curriculum ultra-structuré :
- Semaine 1 : Fondations (les 20% qui donnent 80% de résultats)
- Semaine 2 : Pratique guidée
- Semaine 3 : Application réelle
- Semaine 4 : Consolidation + combler les lacunes

Pour chaque semaine :
- Ressources spécifiques recommandées (gratuit en priorité)
- Exercices pratiques quotidiens
- Checkpoint d'évaluation

Mon niveau actuel : [DÉBUTANT/INTERMÉDIAIRE]
Objectif concret : [CE QUE JE VEUX POUVOIR FAIRE]` },

  // NEURODIVERS
  { id:40, cat:"neurodivers", title:"Stratégies TDAH — Finir une tâche", tags:["tdah","focus","exécution"], text:`Je suis en mode TDAH et j'arrive pas à finir : [DÉCRIRE LA TÂCHE]

Contexte : [depuis combien de temps, pourquoi c'est bloqué, tentatives déjà faites]

Donne-moi :
1. Un diagnostic de pourquoi mon cerveau bloque sur CETTE tâche spécifiquement
2. Une technique de démarrage en moins de 5 minutes (body doubling, temptation bundling, etc.)
3. Un découpage en micro-tâches de max 10 minutes chacune
4. Comment utiliser ma fenêtre d'hyperfocus si elle arrive
5. Un protocole de récupération si je me disperse

Pas de "sois discipliné". Mon cerveau fonctionne différemment. Aide-moi à travailler AVEC lui.` },

  { id:41, cat:"neurodivers", title:"Gérer la surcharge sensorielle", tags:["surcharge","sensoriel","régulation"], text:`Je suis en surcharge sensorielle / cognitive et j'ai besoin d'aide pour redescendre et récupérer.

Situation actuelle : [DÉCRIRE : lieu, niveau de bruit, ce qui se passe]
Niveau de surcharge (1-10) : [ICI]
Temps disponible pour récupérer : [ICI]

Donne-moi :
1. Un protocole de régulation immédiate adapté à mon temps disponible
2. Des techniques de grounding (5-4-3-2-1, cohérence cardiaque, etc.) adaptées à ma situation
3. Comment communiquer mon besoin aux autres sans me justifier longuement
4. Un plan de récupération pour les prochaines 2 heures
5. Comment éviter que ça se reproduise dans ce contexte` },

  { id:42, cat:"neurodivers", title:"Créer une routine flexible", tags:["routine","flexibilité","régularité"], text:`Mon cerveau résiste aux routines rigides mais j'ai besoin de structure. Aide-moi à créer un système qui fonctionne pour moi.

Mon profil : [TDAH / autisme / hypersensibilité / autre]
Mes contraintes : [horaires fixes, famille, travail]
Ce qui a déjà échoué : [LISTER LES TENTATIVES]
Ce qui fonctionne un peu : [SI QUELQUE CHOSE]

Crée :
1. Une "ancre de journée" (1 seul ritual non négociable de 5 min)
2. Des blocs flexibles (pas d'horaires fixes, mais des séquences logiques)
3. Un système de "menu de tâches" pour les jours dérégulés
4. Des signaux d'environnement pour remplacer les alarmes
5. Un protocole de reset pour les jours où tout s'effondre` },

  { id:43, cat:"neurodivers", title:"Préparer une conversation difficile", tags:["communication","préparation","anxiété"], text:`Je dois avoir une conversation difficile et mon cerveau la rejoue en boucle. Aide-moi à me préparer.

Contexte : [avec qui, sur quoi, pourquoi c'est difficile]
Ma peur principale : [CE QUE JE CRAINS QU'IL SE PASSE]
Mon objectif pour cette conversation : [CE QUE JE VEUX QU'IL SE PASSE]

Donne-moi :
1. Un script d'ouverture en 2-3 phrases (non agressif, direct)
2. Les 3 scénarios possibles et comment y répondre
3. Comment réguler mon état interne si ça monte en tension
4. Une phrase de sortie si j'ai besoin de pause
5. Comment gérer le silence ou les réponses inattendues

Rappel : je traite l'information différemment sous stress. Garde les instructions courtes et concrètes.` },

  // COMMUNICATION
  { id:44, cat:"communication", title:"Rédiger un email professionnel", tags:["email","pro","rédaction"], text:`Rédige un email professionnel pour la situation suivante.

Contexte : [DÉCRIRE LA SITUATION]
Destinataire : [QUI, QUEL RAPPORT HIÉRARCHIQUE]
Objectif de l'email : [CE QUE JE VEUX OBTENIR]
Ton souhaité : [Direct / Diplomatique / Ferme / Chaleureux]

Contraintes :
- Max 150 mots
- Objet accrocheur et clair
- Appel à l'action explicite en dernière ligne
- Aucun remplissage ou formule vide

Propose 2 versions : une formelle et une plus directe.` },

  { id:45, cat:"communication", title:"Convaincre sans manipuler", tags:["persuasion","argumentation","influence"], text:`Je dois convaincre [QUI] de [QUOI] dans le contexte suivant : [DÉCRIRE]

Leur position actuelle : [CE QU'ILS PENSENT MAINTENANT]
Leur objection principale probable : [SI VOUS LE SAVEZ]

Construis un argumentaire éthique basé sur :
1. Leur intérêt réel (pas ce que vous voulez, ce qu'ils gagnent)
2. Les preuves ou données pertinentes
3. Une analogie ou histoire qui parle à leur vécu
4. La réponse à leur objection principale
5. Un appel à l'action soft mais clair

Pas de manipulation. Pas de fausses urgences. Juste un argument solide, honnête et adapté à leur perspective.` },
];

export default function PromptVault() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [favs, setFavs] = useState<number[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [exp, setExp] = useState<number | null>(null);
  const [form, setForm] = useState(false);
  const [list, setList] = useState<Prompt[]>(DATA);
  const [np, setNp] = useState({ title: "", cat: "tech", tags: "", text: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ title: "", cat: "tech", tags: "", text: "" });
  const dragIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);

  // Category management
  const [cats, setCats] = useState<Category[]>(INITIAL_CATS);
  const [brightness, setBrightness] = useState(70);
  const [manageCats, setManageCats] = useState(false);
  const [newCat, setNewCat] = useState({ label: "", color: "#7bed9f" });
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatData, setEditCatData] = useState({ label: "", color: "" });

  const gc = (id: string) => cats.find(c => c.id === id)?.color || "#00f5ff";

  const filtered = useMemo(() => list.filter(p => {
    const mc = cat === "all" || p.cat === cat;
    const ms = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.text.toLowerCase().includes(q.toLowerCase()) || p.tags.some(t => t.includes(q.toLowerCase()));
    return mc && ms;
  }), [list, cat, q]);

  const copy = (id: number, txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const add = () => {
    if (!np.title || !np.text) return;
    setList(l => [...l, { ...np, id: Date.now(), tags: np.tags.split(",").map(t => t.trim()).filter(Boolean) }]);
    setNp({ title: "", cat: cats.filter(c => c.id !== "all")[0]?.id || "tech", tags: "", text: "" });
    setForm(false);
  };

  const del = (id: number) => setList(l => l.filter(p => p.id !== id));

  const startEdit = (p: Prompt) => {
    setEditId(p.id);
    setEditData({ title: p.title, cat: p.cat, tags: p.tags.join(", "), text: p.text });
    setExp(null);
  };

  const saveEdit = (id: number) => {
    setList(l => l.map(p => p.id === id
      ? { ...p, title: editData.title, cat: editData.cat, text: editData.text, tags: editData.tags.split(",").map(t => t.trim()).filter(Boolean) }
      : p
    ));
    setEditId(null);
  };

  const onDragStart = (idx: number) => { dragIdx.current = idx; };
  const onDragOver = (e: React.DragEvent, idx: number) => { e.preventDefault(); dragOverIdx.current = idx; };
  const onDrop = () => {
    const from = dragIdx.current;
    const to = dragOverIdx.current;
    if (from === null || to === null || from === to) return;
    const fromId = filtered[from].id;
    const toId = filtered[to].id;
    setList(prev => {
      const fi = prev.findIndex(p => p.id === fromId);
      const ti = prev.findIndex(p => p.id === toId);
      const next = [...prev];
      const [removed] = next.splice(fi, 1);
      next.splice(ti, 0, removed);
      return next;
    });
    dragIdx.current = null;
    dragOverIdx.current = null;
  };

  // Category management handlers
  const addCat = () => {
    if (!newCat.label.trim()) return;
    const id = newCat.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();
    setCats(prev => [...prev, { id, label: newCat.label.toUpperCase(), color: newCat.color }]);
    setNewCat({ label: "", color: "#7bed9f" });
  };

  const delCat = (id: string) => {
    if (id === "all") return;
    setCats(prev => prev.filter(c => c.id !== id));
    if (cat === id) setCat("all");
  };

  const startEditCat = (c: Category) => {
    setEditCatId(c.id);
    setEditCatData({ label: c.label, color: c.color });
  };

  const saveEditCat = () => {
    if (!editCatId) return;
    setCats(prev => prev.map(c => c.id === editCatId
      ? { ...c, label: editCatData.label.toUpperCase(), color: editCatData.color }
      : c
    ));
    setEditCatId(null);
  };

  // Brightness-aware tab style
  const br = brightness / 100;
  const tabStyle = (active: boolean, color: string): React.CSSProperties => ({
    background: active ? `${color}28` : `rgba(255,255,255,${0.02 + br * 0.07})`,
    border: active ? `1px solid ${color}aa` : `1px solid rgba(255,255,255,${0.06 + br * 0.14})`,
    borderRadius: "10px",
    padding: "7px 14px",
    color: active ? color : `rgba(255,255,255,${0.25 + br * 0.6})`,
    fontSize: "9px",
    letterSpacing: "2px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: active ? 700 : 400,
    transform: active ? "translateY(-2px)" : "translateY(0)",
    boxShadow: active
      ? `0 4px 12px ${color}55, 0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)`
      : "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
    transition: "all 0.15s ease",
  });

  const inp: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "4px", padding: "9px 13px", color: "#e8e8ff", fontSize: "12px",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: "9px",
  };

  const btnSm: React.CSSProperties = {
    background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
    fontSize: "10px", letterSpacing: "1px", padding: "3px 7px", borderRadius: "3px",
  };

  return (
    <div style={{ background: "linear-gradient(160deg,#050510 0%,#0a0a1a 50%,#06060f 100%)", minHeight: "100vh", fontFamily: "'Trebuchet MS',sans-serif", color: "#e0e0ff", position: "relative", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,245,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.03) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "-80px", left: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle,rgba(0,245,255,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-80px", right: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle,rgba(162,155,254,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "28px 16px" }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "6px", color: "#00f5ff", marginBottom: "6px", opacity: 0.8 }}>⬡ SYSTÈME COGNITIF EXTERNE ⬡</div>
          <h1 style={{ fontSize: "clamp(32px,6vw,58px)", fontWeight: 900, letterSpacing: "4px", margin: 0, lineHeight: 1, textTransform: "uppercase" }}>
            <span style={{ color: "#fff" }}>PROMPT </span>
            <span style={{ color: "#00f5ff", textShadow: "0 0 30px #00f5ff,0 0 60px #00f5ff55" }}>VAULT</span>
          </h1>
          <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#a29bfe", marginTop: "7px", opacity: 0.85 }}>BIBLIOTHÈQUE — {list.length} MODULES ACTIFS</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "32px", marginTop: "18px", flexWrap: "wrap" }}>
            {[{ v: list.length, l: "PROMPTS", c: "#00f5ff" }, { v: cats.length - 1, l: "CATÉGORIES", c: "#a29bfe" }, { v: favs.length, l: "FAVORIS", c: "#eccc68" }].map(s => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 900, color: s.c, textShadow: `0 0 20px ${s.c}` }}>{s.v}</div>
                <div style={{ fontSize: "8px", letterSpacing: "3px", color: "#ffffffaa" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH + ACTIONS */}
        <div style={{ display: "flex", gap: "9px", marginBottom: "18px" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="⌕  RECHERCHER..."
            style={{ flex: 1, background: "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.3)", borderRadius: "4px", padding: "12px 16px", color: "#e8e8ff", fontSize: "12px", outline: "none", fontFamily: "inherit" }} />
          <button onClick={() => { setForm(!form); setManageCats(false); }}
            style={{ background: form ? "rgba(0,245,255,0.15)" : "rgba(0,245,255,0.05)", border: "1px solid rgba(0,245,255,0.35)", borderRadius: "10px", padding: "12px 16px", color: "#00f5ff", fontSize: "9px", letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
            {form ? "✕ ANNULER" : "+ NOUVEAU"}
          </button>
          <button onClick={() => { setManageCats(!manageCats); setForm(false); }}
            style={{ background: manageCats ? "rgba(162,155,254,0.15)" : "rgba(162,155,254,0.05)", border: `1px solid rgba(162,155,254,${manageCats ? "0.5" : "0.3"})`, borderRadius: "10px", padding: "12px 16px", color: "#a29bfe", fontSize: "9px", letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
            ⚙ CATÉGORIES
          </button>
        </div>

        {/* NOUVEAU PROMPT FORM */}
        {form && (
          <div style={{ background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.22)", borderRadius: "6px", padding: "18px", marginBottom: "18px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#00f5ff", marginBottom: "13px", opacity: 0.9 }}>⬡ NOUVEAU PROMPT</div>
            <input value={np.title} onChange={e => setNp(p => ({ ...p, title: e.target.value }))} placeholder="TITRE" style={inp} />
            <select value={np.cat} onChange={e => setNp(p => ({ ...p, cat: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
              {cats.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input value={np.tags} onChange={e => setNp(p => ({ ...p, tags: e.target.value }))} placeholder="TAGS (séparés par virgules)" style={inp} />
            <textarea value={np.text} onChange={e => setNp(p => ({ ...p, text: e.target.value }))} placeholder="TEXTE DU PROMPT..." rows={3} style={{ ...inp, resize: "vertical", lineHeight: 1.6 } as React.CSSProperties} />
            <button onClick={add} style={{ background: "rgba(0,245,255,0.12)", border: "1px solid rgba(0,245,255,0.4)", borderRadius: "10px", padding: "8px 18px", color: "#00f5ff", fontSize: "9px", letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: "0 3px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)" }}>
              ⬡ AJOUTER AU VAULT
            </button>
          </div>
        )}

        {/* GESTION DES CATÉGORIES */}
        {manageCats && (
          <div style={{ background: "rgba(162,155,254,0.04)", border: "1px solid rgba(162,155,254,0.22)", borderRadius: "6px", padding: "18px", marginBottom: "18px" }}>
            <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#a29bfe", marginBottom: "16px", opacity: 0.9 }}>⚙ GÉRER LES CATÉGORIES</div>

            {/* Liste des catégories existantes */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
              {cats.filter(c => c.id !== "all").map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", padding: "8px 12px" }}>
                  {editCatId === c.id ? (
                    <>
                      <input
                        type="color"
                        value={editCatData.color}
                        onChange={e => setEditCatData(d => ({ ...d, color: e.target.value }))}
                        style={{ width: "28px", height: "28px", border: "none", borderRadius: "4px", cursor: "pointer", background: "none", padding: 0 }}
                      />
                      <input
                        value={editCatData.label}
                        onChange={e => setEditCatData(d => ({ ...d, label: e.target.value }))}
                        style={{ ...inp, marginBottom: 0, flex: 1, padding: "5px 9px", fontSize: "11px" }}
                        onKeyDown={e => e.key === "Enter" && saveEditCat()}
                        autoFocus
                      />
                      <button onClick={saveEditCat} style={{ ...btnSm, color: "#7bed9f", border: "1px solid rgba(123,237,159,0.4)", background: "rgba(123,237,159,0.1)" }}>✓ OK</button>
                      <button onClick={() => setEditCatId(null)} style={{ ...btnSm, color: "#ffffff88", border: "1px solid rgba(255,255,255,0.15)" }}>✕</button>
                    </>
                  ) : (
                    <>
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: c.color, flexShrink: 0, boxShadow: `0 0 6px ${c.color}88` }} />
                      <span style={{ flex: 1, fontSize: "11px", letterSpacing: "1.5px", color: "#ddd", fontWeight: 600 }}>{c.label}</span>
                      <span style={{ fontSize: "9px", color: "#ffffff44", marginRight: "4px" }}>{list.filter(p => p.cat === c.id).length} prompts</span>
                      <button onClick={() => startEditCat(c)} style={{ ...btnSm, color: "#a29bfe", border: "1px solid rgba(162,155,254,0.3)", background: "rgba(162,155,254,0.08)" }}>✏ ÉDITER</button>
                      <button onClick={() => delCat(c.id)} style={{ ...btnSm, color: "#ff7675", border: "1px solid rgba(255,118,117,0.3)", background: "rgba(255,118,117,0.08)" }}>✕ SUP.</button>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Ajouter une catégorie */}
            <div style={{ borderTop: "1px solid rgba(162,155,254,0.15)", paddingTop: "14px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#a29bfe99", marginBottom: "10px" }}>+ NOUVELLE CATÉGORIE</div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="color"
                  value={newCat.color}
                  onChange={e => setNewCat(n => ({ ...n, color: e.target.value }))}
                  style={{ width: "36px", height: "36px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "6px", cursor: "pointer", background: "rgba(255,255,255,0.05)", padding: "2px", flexShrink: 0 }}
                  title="Choisir une couleur"
                />
                <input
                  value={newCat.label}
                  onChange={e => setNewCat(n => ({ ...n, label: e.target.value }))}
                  placeholder="NOM DE LA CATÉGORIE"
                  style={{ ...inp, marginBottom: 0, flex: 1, padding: "9px 12px" }}
                  onKeyDown={e => e.key === "Enter" && addCat()}
                />
                <button onClick={addCat} style={{ background: "rgba(162,155,254,0.12)", border: "1px solid rgba(162,155,254,0.4)", borderRadius: "8px", padding: "9px 16px", color: "#a29bfe", fontSize: "9px", letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
                  ⬡ CRÉER
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ONGLETS CATÉGORIES + SLIDER LUMINOSITÉ */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {cats.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={tabStyle(cat === c.id, c.color)}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Slider luminosité */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 2px" }}>
            <span style={{ fontSize: "8px", letterSpacing: "2px", color: "#ffffff88", whiteSpace: "nowrap" }}>☀ LUMINOSITÉ</span>
            <div style={{ position: "relative", flex: 1, maxWidth: "220px" }}>
              <input
                type="range"
                min={10}
                max={100}
                value={brightness}
                onChange={e => setBrightness(Number(e.target.value))}
                style={{ width: "100%", cursor: "pointer", accentColor: "#00f5ff", height: "4px" }}
              />
            </div>
            <span style={{ fontSize: "8px", letterSpacing: "1px", color: "#00f5ff99", minWidth: "28px" }}>{brightness}%</span>
          </div>
        </div>

        <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#ffffff77", marginBottom: "16px" }}>▸ {filtered.length} RÉSULTAT{filtered.length !== 1 ? "S" : ""}</div>

        {/* GRILLE DE PROMPTS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: "13px" }}>
          {filtered.map((p, idx) => {
            const c = gc(p.cat), isE = exp === p.id, isF = favs.includes(p.id), isC = copied === p.id, isEditing = editId === p.id;
            // category label (dynamic cats)
            const catLabel = cats.find(x => x.id === p.cat)?.label ?? p.cat.toUpperCase();
            return (
              <div key={p.id}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={e => onDragOver(e, idx)}
                onDrop={onDrop}
                onClick={() => !isEditing && setExp(isE ? null : p.id)}
                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.05),rgba(0,0,0,0.3))", borderRadius: "8px", padding: "17px", cursor: isEditing ? "default" : "pointer", position: "relative", overflow: "hidden", border: `1px solid ${c}44`, boxShadow: `0 0 18px ${c}22` }}>

                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,transparent,${c},transparent)` }} />

                <div onMouseDown={e => e.stopPropagation()} style={{ textAlign: "center", cursor: "grab", fontSize: "10px", color: "#ffffff44", letterSpacing: "3px", marginBottom: "8px", userSelect: "none" }}>⠿ ⠿</div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ fontSize: "8px", letterSpacing: "2px", color: c, fontWeight: 700, background: `${c}20`, padding: "3px 7px", borderRadius: "2px", border: `1px solid ${c}44` }}>
                    {catLabel}
                  </span>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <button onClick={e => { e.stopPropagation(); isEditing ? setEditId(null) : startEdit(p); }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: isEditing ? c : "#ffffffaa", padding: 0 }} title="Modifier">✏</button>
                    <button onClick={e => { e.stopPropagation(); del(p.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#ffffff88", padding: 0 }} title="Supprimer">✕</button>
                    <button onClick={e => { e.stopPropagation(); setFavs(f => f.includes(p.id) ? f.filter(x => x !== p.id) : [...f, p.id]); }}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: isF ? "#eccc68" : "#ffffff66", textShadow: isF ? "0 0 8px #eccc68" : "none", padding: 0 }}>
                      {isF ? "★" : "☆"}
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div onClick={e => e.stopPropagation()} style={{ marginTop: "4px" }}>
                    <input value={editData.title} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))} placeholder="TITRE" style={inp} />
                    <select value={editData.cat} onChange={e => setEditData(d => ({ ...d, cat: e.target.value }))} style={{ ...inp, cursor: "pointer" }}>
                      {cats.filter(c => c.id !== "all").map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    <input value={editData.tags} onChange={e => setEditData(d => ({ ...d, tags: e.target.value }))} placeholder="TAGS (séparés par virgules)" style={inp} />
                    <textarea value={editData.text} onChange={e => setEditData(d => ({ ...d, text: e.target.value }))} rows={4} style={{ ...inp, resize: "vertical", lineHeight: 1.6 } as React.CSSProperties} />
                    <button onClick={() => saveEdit(p.id)} style={{ background: `${c}22`, border: `1px solid ${c}55`, borderRadius: "4px", padding: "6px 14px", color: c, fontSize: "9px", letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                      ✓ SAUVEGARDER
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 700, color: "#ffffff", lineHeight: 1.3 }}>{p.title}</h3>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "9px" }}>
                      {p.tags.map(t => <span key={t} style={{ fontSize: "9px", color: "#ffffffbb", border: "1px solid rgba(255,255,255,0.2)", padding: "2px 7px", borderRadius: "2px", background: "rgba(255,255,255,0.05)" }}>{t}</span>)}
                    </div>
                    <p style={{ fontSize: "12px", color: "#ffffffcc", margin: "0 0 13px", lineHeight: 1.75, whiteSpace: "pre-wrap", display: isE ? "block" : "-webkit-box", WebkitLineClamp: isE ? undefined : 3, WebkitBoxOrient: "vertical" as const, overflow: isE ? "visible" : "hidden" }}>
                      {p.text}
                    </p>
                    <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
                      <button onClick={e => { e.stopPropagation(); copy(p.id, p.text); }}
                        style={{ background: isC ? `${c}30` : `${c}14`, border: `1px solid ${c}${isC ? "77" : "44"}`, borderRadius: "4px", padding: "5px 12px", color: isC ? c : `${c}cc`, fontSize: "9px", letterSpacing: "2px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, boxShadow: isC ? `0 0 10px ${c}44` : "none" }}>
                        {isC ? "✓ COPIÉ" : "⎘ COPIER"}
                      </button>
                      <span style={{ fontSize: "9px", color: `${c}99`, marginLeft: "auto", fontWeight: 600 }}>{isE ? "▲ RÉDUIRE" : "▼ VOIR TOUT"}</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px", color: "#ffffff66" }}>
            <div style={{ fontSize: "32px" }}>⬡</div>
            <div style={{ fontSize: "10px", letterSpacing: "4px", marginTop: "10px" }}>AUCUN RÉSULTAT</div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "40px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: "8px", letterSpacing: "4px", color: "#ffffff55" }}>PROMPT VAULT ⬡ PAW 2026</div>
        </div>
      </div>
    </div>
  );
}
