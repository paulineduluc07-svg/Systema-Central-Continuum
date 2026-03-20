export interface ToolPolicyInput {
  toolName: string;
  userGrantedScopes: string[];
  isSensitive: boolean;
}

export interface ToolPolicyDecision {
  allowed: boolean;
  requiresConfirmation: boolean;
  reason: string;
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