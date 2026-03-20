export type PermissionSource = "chat" | "voice" | "admin" | "system";

export type PermissionDecisionReason =
  | "allowed"
  | "confirmation_required"
  | "tool_not_in_server_allowlist"
  | "tool_not_granted_by_user"
  | "tool_scope_revoked"
  | "tool_grant_expired"
  | "policy_error";

export interface ToolPermissionGrant {
  grantId: string;
  subjectId: string;
  scopes: string[];
  issuedAt: string;
  expiresAt?: string;
  source: PermissionSource;
  confirmationRequired?: boolean;
}

export interface ToolPermissionRevoke {
  revokeId: string;
  subjectId: string;
  scope: string;
  revokedAt: string;
  reason?: string;
}

export interface ToolPolicyInput {
  toolName: string;
  userGrantedScopes: string[];
  revokedScopes?: string[];
  isSensitive: boolean;
  confirmationProvided?: boolean;
  nowIso?: string;
}

export interface ToolPolicyDecision {
  allowed: boolean;
  requiresConfirmation: boolean;
  reason: PermissionDecisionReason;
}

export interface McpInvokeRequest {
  toolName: string;
  input: Record<string, unknown>;
}

export interface McpInvokeResult {
  success: boolean;
  data?: unknown;
  error?: string;
}
