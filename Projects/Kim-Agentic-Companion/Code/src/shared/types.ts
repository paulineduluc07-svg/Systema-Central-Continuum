export type MemoryRole = "user" | "assistant";

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
}

export interface ChatRequest {
  userId?: string;
  sessionId?: string;
  message: string;
  grantedTools?: string[];
  requestedTool?: RequestedTool;
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