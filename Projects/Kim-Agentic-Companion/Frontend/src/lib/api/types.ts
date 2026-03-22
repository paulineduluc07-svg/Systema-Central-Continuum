// Mirror of Code/src/shared/types.ts — keep in sync manually

export type MemoryRole = "user" | "assistant";
export type PermissionSource = "chat" | "voice" | "admin" | "system";

export interface MemoryRecord {
  role: MemoryRole;
  content: string;
  timestamp: string;
}

export interface RequestedTool {
  name: string;
  input: Record<string, unknown>;
  sensitive?: boolean;
}

export interface ToolResult {
  name: string;
  status: "blocked" | "needs_confirmation" | "executed" | "error";
  detail: string;
  output?: unknown;
}

export interface PermissionGrantState {
  grantId: string;
  subjectId: string;
  scopes: string[];
  issuedAt: string;
  expiresAt?: string;
  source: PermissionSource;
  confirmationRequired?: boolean;
}

export interface PermissionRevokeState {
  revokeId: string;
  subjectId: string;
  scope: string;
  revokedAt: string;
  reason?: string;
}

export interface PermissionContext {
  grants?: PermissionGrantState[];
  revokes?: PermissionRevokeState[];
  confirmationProvided?: boolean;
}

export interface ChatRequest {
  userId?: string;
  sessionId?: string;
  message: string;
  grantedTools?: string[];
  requestedTool?: RequestedTool;
  permissionContext?: PermissionContext;
}

export interface SessionRecord {
  sessionId: string;
  userId: string;
  createdAt: string;
}

export interface SessionCreateRequest {
  userId: string;
}

// Frontend-only response types

export interface ChatResponse {
  reply: string;
  tool?: ToolResult;
  sessionId?: string;
}

export interface McpTool {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
}

export interface ToolsPayload {
  allowedTools?: string[];
  mcpTools?: McpTool[];
  mcpToolsError?: string;
}

export interface ToolsResponse {
  ok?: boolean;
  requestId?: string;
  tools: ToolsPayload;
}

export interface ToolInvokeRequest {
  toolName: string;
  input: Record<string, unknown>;
  sensitive?: boolean;
  grantedTools?: string[];
  confirmationProvided?: boolean;
}

export interface ToolInvokeResponse {
  ok?: boolean;
  requestId?: string;
  tool: ToolResult;
}

export interface HealthResponse {
  status: string;
  uptime?: number;
}

export interface VoiceSynthesisRequest {
  text: string;
  voiceId?: string;
  modelId?: string;
  outputFormat?: string;
}

export interface VoiceSynthesisResponse {
  audioBase64: string;
  mimeType?: string;
}
