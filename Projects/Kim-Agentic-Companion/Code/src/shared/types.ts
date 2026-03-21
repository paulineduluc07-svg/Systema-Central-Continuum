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

export interface CalendarCreateEventInput {
  title: string;
  startAt: string;
  endAt?: string;
  timezone?: string;
  notes?: string;
}
