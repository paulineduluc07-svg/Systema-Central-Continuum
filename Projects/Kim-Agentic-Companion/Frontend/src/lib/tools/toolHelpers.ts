import type { McpTool } from "@/lib/api/types";

export type ToolPermissionMode = "ask" | "always" | "denied";

const TOOL_PERMISSION_STORAGE_KEY = "kim_tool_permissions";

export function readStoredToolPermissions(): Record<string, ToolPermissionMode> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(TOOL_PERMISSION_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, ToolPermissionMode] =>
        entry[1] === "ask" || entry[1] === "always" || entry[1] === "denied"
      )
    );
  } catch {
    return {};
  }
}

export function writeStoredToolPermissions(next: Record<string, ToolPermissionMode>): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(TOOL_PERMISSION_STORAGE_KEY, JSON.stringify(next));
}

export function getToolPermissionLabel(mode: ToolPermissionMode): string {
  if (mode === "always") {
    return "Always allow";
  }

  if (mode === "denied") {
    return "Denied";
  }

  return "Ask first";
}

export function getToolExampleInput(tool: McpTool): Record<string, unknown> {
  if (tool.name === "calendar.create_event") {
    return {
      title: "Focus session",
      startAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      timezone: "America/Toronto",
      notes: "Created from Kim tools panel",
    };
  }

  if (tool.name === "system.get_time") {
    return {
      timezone: "America/Toronto",
    };
  }

  if (tool.name === "web.fetch") {
    return {
      url: "https://example.com",
    };
  }

  return {};
}

export function formatToolOutput(output: unknown): string {
  if (output === undefined) {
    return "";
  }

  try {
    return JSON.stringify(output, null, 2);
  } catch {
    return String(output);
  }
}
