# MEMORY.md — Mémoire long terme du SCC

> Mis à jour par les agents via `scc-save`. Jamais effacé — ajout seulement.
> Dernière mise à jour : 2026-03-16

---

## Décisions structurelles

- **2026-03-11** — Migration complète de l'Obsidian vault vers SCC-IPARA (GitHub). Obsidian supprimé comme outil principal.
- **2026-03-11** — Structure IPARA validée comme architecture définitive du SCC.
- **2026-03-16** — 4 skills Claude Code créés : `scc-init`, `scc-save`, `scc-audit`, `scc-status`. Stockés dans `.claude/skills/` (exception ajoutée au `.gitignore`).

---

## État des projets (dernière mise à jour connue)

| Projet | État | Dernière action |
|---|---|---|
| Systema Agency | En cours — auth + dashboard redesign en attente | PromptVault 31 prompts ✅, Neon migration ✅, Vercel déployé ✅ |
| Drawn by Fate | Pas encore démarré — Todo/Roadmap à définir avec Paw | Structure SCC créée |
| Plateforme Restaurant | Pas encore démarré — structure Airtable à définir | Structure SCC créée |

---

## Apprentissages

- **2026-03-16** — Les steps 2 et 3 d'un prompt d'évaluation doivent simuler un agent B indépendant qui lit le travail d'un agent A et l'évalue sans complaisance — pas une auto-critique du même agent.
- **2026-03-16** — `Carte-Globale.md` et `Livrables/` (dans Drawn-by-Fate AGENT-INSTRUCTIONS) sont des stubs/références manquantes à compléter.
- **2026-03-16** — `_CONTEXT.md` dans Areas/Reconstruction contient des liens syntaxe Obsidian `[[...]]` non fonctionnels sur GitHub — à corriger.

---

## Valeurs fondamentales de Paw (à lire avant d'intervenir)

Paw construit une plateforme humain/multi-agents basée sur des valeurs non négociables.
Elle a quitté un emploi en gestion des opérations à cause de comportements toxiques.
Ces valeurs s'appliquent à tous — humains, agents IA, outils.

**Tolérance zéro :** ego, manipulation, flatterie, travail non évalué, loyauté de façade.
**Attendu :** honnêteté radicale, évaluation multi-perspectives, performance réelle, engagement dans la durée.

> Référence complète : `CLAUDE.md` section "Vision long terme" + `AGENTS.md` section "Valeurs fondamentales"
