# Prompt — Analyse de projet en 4 étapes

**But :** Obtenir une analyse complète et honnête d'un projet, évaluée par une perspective indépendante avant livraison.

**Quand l'utiliser :** Audit d'un projet ou du SCC, revue de structure, vérification de cohérence.

**Principe :** Simule une évaluation multi-agents — Agent A produit, Agent B évalue de façon indépendante.

---

## Le prompt

```
Fais-moi une analyse complète de ce projet : sa structure, son but, les technologies utilisées, et les fichiers les plus importants.

Est-ce que le projet est cohérent dans ses conventions (nommage, structure des fichiers, style) ? Y a-t-il des endroits où le style change drastiquement d'un fichier à l'autre ?

En regardant ce projet, qu'est-ce qui semble commencé mais pas terminé ?

Étape 1 : Donne ta première réponse.

Étape 2 : Tu es maintenant un nouvel agent qui arrive froid dans le dossier. Tu lis la réponse de l'Étape 1 sans connaître son auteur. Liste les failles, manques ou imprécisions que tu observes — sans ménagement, sans protéger le travail précédent.

Étape 3 : Pour chaque faille listée à l'Étape 2, vérifie avec les vrais fichiers du projet (lecture indépendante). Confirme ou infirme chaque faille avec des faits concrets.

Étape 4 : Produis une réponse finale corrigée qui intègre les corrections de l'Étape 3. Cette version est la livraison finale.
```

---

## Notes d'usage

- Les Étapes 2 et 3 ne sont PAS une auto-critique — elles simulent un agent indépendant qui évalue sans ego.
- L'agent doit résister à la tentation de défendre sa réponse initiale.
- Si une faille est infirmée par les faits à l'Étape 3, l'indiquer clairement (`Faille non confirmée — raison`).
- La réponse finale (Étape 4) doit être meilleure que l'Étape 1, pas juste reformulée.
