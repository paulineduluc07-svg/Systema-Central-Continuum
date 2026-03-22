# MVP Readiness Checklist -- Kim

Date: 2026-03-20
Status: Draft v1
Owner lane: agent-a

## Go No-Go Rule
- GO only if all P0 items below are checked
- NO-GO if any critical security or stability check is unchecked

## Security (P0)
- [ ] MCP allowlist configured via `MCP_ALLOWED_TOOLS`
- [ ] Tool actions require explicit grant path
- [ ] Revoked scopes are enforced
- [ ] Sensitive actions require confirmation
- [ ] API bearer auth configured for protected routes when required
- [ ] Vapi webhook signature validation configured
- [ ] Secrets are environment variables only

## Quality and Tests (P0)
- [ ] Unit tests for policy, memory, session, client pass
- [ ] Integration tests cover webhook signed path
- [ ] Integration tests cover chat nominal path
- [ ] Integration tests cover tool denied path
- [ ] Integration tests cover confirmation required path
- [ ] Integration tests cover confirmed sensitive execution path

## Observability (P1)
- [ ] Structured logs for request id and decision reason
- [ ] Tool execution outcome logging present
- [ ] Error paths include stable error code
- [ ] Basic health endpoints monitored (`/health`, `/v1/mcp/health`)

## Staging Readiness (P1)
- [ ] Staging env vars populated (`MCP_SERVER_BASE_URL`, `MCP_API_KEY`, auth secrets)
- [ ] Staging MCP health check passes
- [ ] Webhook signature secret validated in staging
- [ ] Postgres connectivity verified if `DATABASE_URL` enabled

## Rollback Plan (P1)
- [ ] Last known good commit tagged
- [ ] Rollback command path documented
- [ ] Recovery owner identified
- [ ] Post-rollback smoke checks defined

## Known Issues
- Consent expiry is currently represented by revoke path in integration scenarios
- Explicit expiry timestamp enforcement in integration path can be expanded in next iteration

## Release Decision
- Decision: [ ] GO  [ ] NO-GO
- Decision Date:
- Approver:
- Notes:
