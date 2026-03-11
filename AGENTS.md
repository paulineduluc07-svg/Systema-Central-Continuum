# AGENTS.md — SCC-IPARA

> Règles de collaboration pour tous les agents IA travaillant dans ce repo.
> Toujours lire ce fichier avant toute intervention.

---

## Règles fondamentales

Voir → `Resources/Systeme/Multi-Agent-Collaboration.md`

---

## Agents autorisés

| Agent | Outil | Rôle |
|---|---|---|
| Claude Code | Terminal | Développement, organisation, fichiers locaux |
| Claude Projects | Browser | Projets spécifiques, contexte long |
| Claude Cowork | Browser | Sessions de travail collaboratives |
| ChatGPT | Browser | Tâches ponctuelles |
| Gemini | Browser | Recherche, vérification |
| Grok | Browser | Recherche alternative |
| Perplexity | Browser | Recherche web |

---

## Protocole d'intervention

1. Lire `AGENTS.md` (ce fichier)
2. Lire `Resources/Systeme/Multi-Agent-Collaboration.md`
3. Lire le `AGENT-INSTRUCTIONS.md` du projet concerné
4. Identifier le contexte actuel via `Resources/Systeme/Carte-Globale.md`
5. Travailler — commits clairs — jamais écraser sans validation

---

## Format commit

```
[Agent] [Projet] : Description courte

Exemples :
[Claude Code] [Systema-Agency] : Fix migration Neon + Vercel build
[Claude Code] [SCC-IPARA] : Migration initiale + règles multi-agents
```

---

## Ce que AUCUN agent ne fait sans validation de Paw

- Supprimer des fichiers
- Modifier du contenu existant (ajouter = OK, modifier = non)
- Appliquer une correction détectée automatiquement
- Pousser sur une branche autre que main sans accord

---

*Mis à jour : 2026-03-11*
