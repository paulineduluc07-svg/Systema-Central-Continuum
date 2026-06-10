# Patch - Accepter le secret MCP en query parameter

**Statut** : done  
**Projet** : `02-PROJECTS/Systema-Agency`  
**Suite de** : `PLAN_CLAUDE_CODE_MCP_WRITE.md`

## Pourquoi

Cowork ne permet pas de configurer des headers HTTP custom sur les MCP connectors. L'auth via header `x-systema-mcp-secret` ne peut donc pas etre utilisee directement depuis Cowork.

Solution court terme : accepter aussi le secret en query parameter dans l'URL.

URL cible cote Cowork :

```text
https://systema-agency.vercel.app/mcp?secret=<SECRET>
```

Le header reste supporte pour les autres clients.

## Attention

Le secret en query parameter peut apparaitre dans les logs serveur et dans l'historique du client. C'est moins propre que le header, mais acceptable temporairement pour une app personnelle. Une migration future vers OAuth reste possible.

## Modification demandee

Fichiers concernes :
- `Code/server/mcp/auth.ts`
- `Code/server/mcp/http.ts`
- `Code/server/mcp/writes.test.ts`
- `Code/server/mcp/systema-core.ts`

Comportement :
- accepter `x-systema-mcp-secret`;
- accepter `?secret=...`;
- refuser les writes sans secret;
- refuser les writes avec mauvais secret;
- garder les tools de lecture accessibles sans secret.

## Validation attendue

- [x] `https://systema-agency.vercel.app/mcp?secret=<bon_secret>` autorise les write tools.
- [x] `https://systema-agency.vercel.app/mcp?secret=mauvais` est rejete 401.
- [x] `https://systema-agency.vercel.app/mcp` sans secret est rejete 401 pour les writes.
- [x] Les outils en lecture restent accessibles sans secret.
- [x] Tests locaux passes.
- [x] Build local passe.

## Resultat

Implemente dans `MCP_VERSION=0.3.1`.
