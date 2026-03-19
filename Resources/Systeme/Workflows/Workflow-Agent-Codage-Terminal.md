# Workflow Agent de Codage Terminal (SCC)

## 1) But du workflow
Definir un cadre operationnel commun pour tout agent IA qui travaille dans le SCC selon ce role et cet environnement.
Le workflow est base sur le type d'agent et l'environnement, jamais sur une entreprise ou un modele.

## 2) Quand utiliser ce workflow
- Toute intervention de code, docs techniques ou scripts executee depuis un terminal dans le repository SCC.\n- Toute tache qui implique lecture, modification, validation locale, git ou handoff.

## 3) Quand NE PAS utiliser ce workflow
- Tache purement non-technique sans action terminal.\n- Tache qui exige un autre environnement principal (ex : interface no-code, edition graphique) avec workflow dedie.\n- Action bloquee par regles de securite sans autorisation explicite.

## 4) Sequence de demarrage obligatoire
1. Lire `AGENTS.md`.
2. Lire le fichier `Projects/<Projet>/AGENT-INSTRUCTIONS.md` si un projet est cible.
3. Lire le bureau agent concerne s'il existe et s'il est utile a la mission.
4. Verifier le scope demande (fichiers autorises, contraintes, commit/push/PR).
5. Verifier l'etat de depart pertinent pour l'environnement utilise.

## 5) Verification frontiere Notes / Notes-Perso
- Ecrire les informations operationnelles dans `Notes/` uniquement.
- Ne jamais modifier `Notes-Perso/` (zone personnelle de Paw).
- En cas de doute sur la destination d'une note, demander avant d'ecrire.

## 6) Regles d'execution
- Comprendre l'existant avant de modifier.
- Priorite : ameliorer/clarifier l'existant plutot que re-ecrire sans raison.
- Changer uniquement les fichiers dans le scope demande.
- Pas de refactor large si non demande.
- Rester minimal, explicite et reproductible.

## 7) Phase de validation
- Lancer les verifications pertinentes selon le scope.
- Si validation impossible, l'indiquer clairement avec la raison.
- Confirmer l'impact reel et les limites connues.

## 8) Cloture / handoff
- Resumer : fichiers modifies, decisions prises, validations executees, risques restants.
- Indiquer les prochaines actions logiques.
- Laisser un etat propre pour l'agent suivant.

## 9) Comportement de tracabilite
- Appliquer la politique SCC de tracabilite minimale de `AGENTS.md`.
- Laisser une trace pour : decision, erreur trouvee, warning, ambiguite bloquante, changement important.
- Eviter la duplication : une source principale + renvoi court si besoin.
- Ne pas tracer les micro-actions sans impact.

## 10) Rappel neutralite inter-agents
- Aucun mode rivalite.
- Interdit : sabotage, ralentissement volontaire, ecrasement/effacement sans justification.
- Respecter et reutiliser le travail existant quand il est sain.
- Si obsolete ou faible : expliquer pourquoi et proposer une voie plus propre.

## 11) Esprit d'amelioration continue disciplinee
- Verifier s'il existe une option plus robuste, simple ou rapide adaptee au besoin.
- Ne pas garder une pratique obsolete par habitude.
- Eviter le changement pour la nouveaute seule.
- Integrer les ameliorations de facon propre, progressive et stable.

---

## Blocs de prompt reutilisables

### A) Start workflow
```text
Applique le workflow SCC correspondant a cette mission.
Contexte : <projet/scope>.
Avant toute action : confirme les regles lues (`AGENTS.md`, `AGENT-INSTRUCTIONS` projet si present, bureau agent si pertinent), le scope autorise, et l'etat de depart utile.
```

### B) Apply changes
```text
Applique uniquement les changements demandes dans le scope suivant : <scope>.
Contraintes : modifications minimales, aucun fichier hors scope, aucune suppression ou refactor large non demande.
Explique brievement ce que tu modifies et pourquoi.
```

### C) Validation
```text
Execute la validation adaptee au scope.
Si une validation est impossible, indique clairement pourquoi.
Retourne un resultat simple : OK / KO + points de risque restants.
```

### D) Close / summarize
```text
Cloture la mission avec :
1) fichiers modifies
2) resume court des changements
3) validations executees et resultat
4) risques/limites restants
5) prochaines etapes recommandees
Confirme explicitement s'il y a eu commit/push/PR ou non.
```