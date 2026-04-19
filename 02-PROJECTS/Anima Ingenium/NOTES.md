# NOTES - Anima Ingenium

Ce fichier sert a garder les decisions techniques et les questions ouvertes.

## Decisions Actives (a respecter)
- **Méthode de travail** : Petites passes fermées uniquement (`1 passe - 1 audit - 1 session encadree`).
- **Synchronisation** : Tout changement technique sur le VPS doit être immédiatement documenté ici ou dans `WORKLOG.md`. La documentation SCC doit être le miroir exact du cerveau de Kim.
- **Validation** : Toute vérification runtime suit l'ordre de confiance: test reel, logs, config active, memoire/prompt actifs, doc SCC.
- **Contradictions** : Toute contradiction ouvre une passe diagnostic dediee.
- **Persona** : Persona active unique dans `/root/.hermes/SOUL.md`.
- **Cles API** : Synchronisees depuis `Assets/SECRET.md` sans exposition en clair.
- **Voix** : `tts.provider = edge` (actif), voix gratuite Edge TTS.
- **Mémoire** : provider externe actif `honcho`.

## Etat de Stabilisation Courant
- Passes `PASSE-001` a `PASSE-008` complétées (voir `WORKLOG.md`).
- Serveur synchronisé sur le fuseau horaire de **Montréal** (America/Toronto).
- Bascule sur **Gemini 2.5 Pro** comme moteur principal stable.
- Fallback OpenAI (GPT-4o-mini) opérationnel.
- Connexion Discord rétablie et stabilisée.
- Contradiction Telegram levée, cycle vocal opérationnel (Edge TTS gratuit).
- Durcissement cognitif (Grounding) appliqué via `SOUL.md` V1.3.

## Questions Ouvertes
### Exploitation
- Quelle politique cible pour restart + alertes `hermes-gateway` ?
- Quel niveau minimal de monitoring est obligatoire ?
- Quel SLO cible pour le canal Telegram ?

### Securite
- Frequence de rotation des secrets dans `/root/.hermes` ?
- Regles de permissions a imposer sur les fichiers sensibles ?
- Protocole incident en cas de soupcon de compromission ?

### Gouvernance
- Perimetre exact de l'agent regulateur en v1 ?
- Quelles decisions exigent une validation humaine obligatoire ?
- Quel niveau de journalisation est utile sans surcharge ?
- **Sécurité Google Workspace** : Kim n'a PAS accès aux outils Google Workspace (Drive, Gmail, Calendar, Tasks) tant qu'elle n'est pas jugée 100% stable et fiable. Cette restriction est non négociable pour le moment.
