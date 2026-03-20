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

  evaluate(input: ToolPolicyInput): ToolPolicyDecision {
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

    if (!input.userGrantedScopes.includes(input.toolName)) {
      return {
        allowed: false,
        requiresConfirmation: false,
        reason: "tool_not_granted_by_user"
      };
    }

    const confirmationRequired = input.isSensitive || this.requireConfirmationByDefault;
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
