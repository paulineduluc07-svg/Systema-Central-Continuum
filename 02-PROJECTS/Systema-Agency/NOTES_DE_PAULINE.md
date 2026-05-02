# Patch — Accepter le secret MCP en query parameter

**Projet** : `02-PROJECTS/Systema-Agency`
**Suite de** : `PLAN_CLAUDE_CODE_MCP_WRITE.md` (déjà implémenté)

## Pourquoi

Cowork (le client MCP utilisé par Paw) **ne permet pas de configurer des headers HTTP custom** sur les MCP connectors. L'auth via header `x-systema-mcp-secret` qu'on a mis en place ne peut pas être utilisée. Résultat : tous les appels aux outils d'écriture sont bloqués 401, et Cowork affiche "This connector requires authentication".

**Solution court terme** : aussi accepter le secret en **query parameter** dans l'URL. Pauline configurera l'URL du connecteur comme `https://systema-agency.vercel.app/mcp?secret=<SECRET>` au lieu d'ajouter un header.

**À noter** : le secret se retrouvera dans les logs serveur (Vercel) et dans l'historique de la fenêtre Cowork. C'est moins propre que le header, mais acceptable pour une app perso. Une migration future vers OAuth 2.0 (Option C dans la discussion) reste possible.

## Modification à faire

**Fichier** : `Code/server/mcp/http.ts` (et tout autre endroit où le secret est vérifié — probablement un middleware Express).

**Comportement actuel** : le serveur lit `req.headers["x-systema-mcp-secret"]` et compare à `process.env.SYSTEMA_MCP_SECRET`.

**Comportement à ajouter** : aussi accepter `req.query.secret` (string). Si **l'un OU l'autre** matche `SYSTEMA_MCP_SECRET`, la requête est autorisée. Le header reste supporté (rétrocompatibilité).

### Snippet de référence (à adapter)

```ts
function getProvidedSecret(req: express.Request): string | undefined {
  const headerSecret = req.headers["x-systema-mcp-secret"];
  if (typeof headerSecret === "string" && headerSecret.length > 0) {
    return headerSecret;
  }

  const querySecret = req.query.secret;
  if (typeof querySecret === "string" && querySecret.length > 0) {
    return querySecret;
  }

  return undefined;
}

function verifyMcpSecret(req: express.Request): boolean {
  const expected = process.env.SYSTEMA_MCP_SECRET;
  if (!expected) {
    // Fail-closed : si la var d'env n'est pas configurée côté serveur, refuser tout.
    return false;
  }

  const provided = getProvidedSecret(req);
  if (!provided) return false;

  // Comparaison à temps constant pour éviter le timing attack
  if (provided.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < provided.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
```

Adapter selon comment l'auth est actuellement structurée dans `http.ts`.

## Tests à mettre à jour

Dans le fichier de tests existants (probablement `Code/server/mcp/writes.test.ts` ou équivalent) :

1. Garder le test existant qui valide l'auth via header.
2. **Ajouter** un test qui valide l'auth via `?secret=...` en query.
3. **Ajouter** un test qui valide qu'une requête **sans** secret (ni header ni query) est rejetée 401.
4. **Ajouter** un test qui valide qu'un faux secret en query est rejeté 401.

## Documentation

- `02-PROJECTS/Systema-Agency/README.md` : section MCP — documenter les deux modes d'auth (header OU query param), avec exemple d'URL pour la query param.
- `WORKLOG.md` : entrée datée résumant le patch.
- Bump `MCP_VERSION` dans `systema-core.ts` → `"0.3.1"`.

## Critères d'acceptation

- [ ] L'URL `https://systema-agency.vercel.app/mcp?secret=<bon_secret>` autorise les write tools (200 OK sur `tools/call`).
- [ ] L'URL `https://systema-agency.vercel.app/mcp?secret=mauvais` est rejetée 401.
- [ ] L'URL `https://systema-agency.vercel.app/mcp` (sans secret) est rejetée 401 sur les writes.
- [ ] Les outils en lecture (`list_project_docs`, `read_project_doc`, `search_project_docs`) restent accessibles sans secret (rétrocompatibilité Cowork existante).
- [ ] Les tests passent.
- [ ] Le déploiement Vercel réussit.
- [ ] `WORKLOG.md` mis à jour.

## Notes

- Pas besoin de toucher à `systema-core.ts` ni aux outils eux-mêmes. C'est juste la couche transport HTTP qui change.
- Pas besoin de changer les variables d'env Vercel — `SYSTEMA_MCP_SECRET` est déjà là.
- Une fois déployé, Pauline mettra à jour l'URL du connecteur Systema-Agency dans Cowork (de `https://systema-agency.vercel.app/mcp` vers `...?secret=<valeur>`).