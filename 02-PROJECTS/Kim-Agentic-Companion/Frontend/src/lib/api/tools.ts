import type { McpTool, ToolsResponse } from "./types";

export interface ParsedToolsResult {
  tools: McpTool[];
  error: string | null;
}

export function parseToolsResponse(response: ToolsResponse): ParsedToolsResult {
  const payload = response.tools;
  const mcpTools = Array.isArray(payload?.mcpTools) ? payload.mcpTools : [];
  const allowedTools = Array.isArray(payload?.allowedTools) ? payload.allowedTools : [];

  if (mcpTools.length > 0) {
    return {
      tools: mcpTools,
      error: payload?.mcpToolsError ?? null,
    };
  }

  return {
    tools: allowedTools.map((name) => ({
      name,
      description: "Allowed by policy",
    })),
    error: payload?.mcpToolsError ?? null,
  };
}
