import { ToolPolicyDecision, ToolPolicyInput } from "./types.js";

export interface McpPolicyConfig {
  allowedToolsCsv?: string;
  requireConfirmationByDefault?: string;
}

export class McpPolicy {
  private readonly allowedTools: Set<string>;
  private readonly requireConfirmationByDefault: boolean;

  constructor(config: McpPolicyConfig) {
    this.allowedTools = new Set(
      (config.allowedToolsCsv ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    );

    this.requireConfirmationByDefault = (config.requireConfirmationByDefault ?? "true") !== "false";
  }

  private isGrantActive(expiresAt: string | undefined, nowMs: number): boolean {
    if (!expiresAt) {
      return true;
    }

    const expiresMs = Date.parse(expiresAt);
    if (Number.isNaN(expiresMs)) {
      return false;
    }

    return expiresMs > nowMs;
  }

  evaluate(input: ToolPolicyInput): ToolPolicyDecision {
    const nowMs = input.nowIso ? Date.parse(input.nowIso) : Date.now();
    const normalizedNowMs = Number.isNaN(nowMs) ? Date.now() : nowMs;

    if (!this.allowedTools.has(input.toolName)) {
      return {
        allowed: false,
        requiresConfirmation: false,
        reason: "tool_not_in_server_allowlist"
      };
    }

    if ((input.revokedScopes ?? []).includes(input.toolName)) {
      return {
        allowed: false,
        requiresConfirmation: false,
        reason: "tool_scope_revoked"
      };
    }

    const matchingGrants = (input.permissionGrants ?? []).filter((grant) => grant.scopes.includes(input.toolName));
    const hasScopeFromSimpleGrant = input.userGrantedScopes.includes(input.toolName);

    if (matchingGrants.length === 0 && !hasScopeFromSimpleGrant) {
      return {
        allowed: false,
        requiresConfirmation: false,
        reason: "tool_not_granted_by_user"
      };
    }

    if (matchingGrants.length > 0) {
      const hasActiveGrant = matchingGrants.some((grant) => this.isGrantActive(grant.expiresAt, normalizedNowMs));
      if (!hasActiveGrant) {
        return {
          allowed: false,
          requiresConfirmation: false,
          reason: "tool_grant_expired"
        };
      }
    }

    const confirmationRequiredFromGrant = matchingGrants.some((grant) => grant.confirmationRequired);
    const confirmationRequired = input.isSensitive || this.requireConfirmationByDefault || confirmationRequiredFromGrant;
    if (confirmationRequired && !input.confirmationProvided) {
      return {
        allowed: true,
        requiresConfirmation: true,
        reason: "confirmation_required"
      };
    }

    return {
      allowed: true,
      requiresConfirmation: false,
      reason: "allowed"
    };
  }
}
