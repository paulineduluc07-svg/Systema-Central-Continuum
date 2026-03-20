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
  userId: string;
  message: string;
  grantedTools?: string[];
  requestedTool?: RequestedTool;
}