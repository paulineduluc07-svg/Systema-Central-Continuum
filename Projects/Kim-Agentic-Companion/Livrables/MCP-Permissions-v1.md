# MCP Permissions v1 -- Kim Agentic Companion

Date: 2026-03-20
Status: Draft ready for implementation
Owner lane: agent-a

## Objective
Define enforceable permission rules for MCP actions with explicit user control and safe defaults.

## Terms
- Scope: connector.action format, example calendar.create_event
- Grant: explicit user approval for one or more scopes
- Revoke: explicit removal of previously granted scope
- TTL: expiration time of grant
- Sensitive scope: action that always requires confirmation

## Permission Model
Grant object fields:
- grant_id
- subject_id
- scopes as array of connector.action
- issued_at
- expires_at
- source as chat or voice or admin
- confirmation_required boolean

Revoke object fields:
- revoke_id
- subject_id
- scope
- revoked_at
- reason

## Grant Rules
- No implicit grant
- Grant must specify exact scope list
- Grant may include TTL, default short TTL in MVP
- Grant can be single use or reusable until expiry
- Grant creation must be audit logged

## Revoke Rules
- Revoke takes effect immediately
- Revoke wins over active grant if conflict exists
- Revoke event must be audit logged
- Revoke does not delete historical action logs

## Sensitive Actions
Sensitive scopes require explicit confirmation each time even when grant exists.
Initial sensitive examples:
- calendar.delete_event
- calendar.update_event

## Decision Flow
Given tool request with scope S:
1. Validate request payload and signature context when applicable
2. Check if scope S is allowlisted
3. Check active revoke for scope S
4. Check active grant for scope S
5. Check grant expiry
6. If scope is sensitive, require explicit confirmation token
7. Return decision allow or deny with reason code

## Deny Reason Codes
- DENY_SCOPE_NOT_ALLOWLISTED
- DENY_SCOPE_NOT_GRANTED
- DENY_SCOPE_REVOKED
- DENY_GRANT_EXPIRED
- DENY_CONFIRMATION_REQUIRED
- DENY_POLICY_ERROR

## API Behavior Contract
On deny:
- Return stable machine readable reason code
- Return short user facing explanation
- Do not execute external MCP action

On allow:
- Execute action with bounded timeout
- Log scope, decision, connector, and outcome

## Audit Requirements
Each permission decision record should include:
- timestamp
- session_id if available
- subject_id
- scope
- decision allow or deny
- reason_code
- tool_request_id when available

## Security Requirements
- Secrets only from environment variables
- No action without explicit consent path
- Signature validation for webhook entrypoint when secret configured
- Policy must fail closed on internal error

## Test Matrix Minimum
- allow with valid grant and active TTL
- deny when no grant
- deny when revoked
- deny when expired
- deny when sensitive without confirmation
- allow when sensitive with confirmation

## Out of Scope for v1
- cross tenant delegation
- policy UI management console
- long term role based access control

## Change Control
Any new connector or action scope must add:
- scope definition
- decision tests
- audit assertions
