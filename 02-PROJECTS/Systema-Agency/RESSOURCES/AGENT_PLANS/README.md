# Plans et patchs pour agents

Ce dossier sert a recevoir les plans d'implementation, patchs demandes et consignes techniques destines aux agents.

Utilisation recommandee :
- creer un fichier par plan ou patch;
- garder `NOTES_DE_PAULINE.md` comme espace personnel Pauline uniquement dans Google Drive;
- ne pas mettre de secrets reels dans ces fichiers;
- utiliser un nom clair, par exemple `2026-05-02-mcp-secret-query.md`.

Statut des fichiers :
- `propose` : idee ou patch a verifier;
- `in_progress` : agent en train d'implementer;
- `done` : implemente et valide → deplacer le fichier dans `done/`;
- `cancelled` : abandonne.

## Etat du dossier (rangement 2026-06-10)

- `done/` — plans termines : MCP write tools, secret en query param, affichage customTabs.
- `design_handoff_agenda/` — handoff design de l'agenda (Liquid Week), implemente.
- `design_handoff_floating_notes/` — handoff design des notes volantes, implemente.
  ⚠️ `assets/` est vide alors que `room-bg.png` y est reference 3× dans les HTML :
  les previews HTML s'affichent sans le fond. Sans impact sur l'app (deja implementee).
- `design_handoff_onebrain_v4/` — prototype Dashboard OneBrain. ⚠️ Le HTML reference
  4 scripts absents : prototype casse, garde comme reference visuelle seulement.
