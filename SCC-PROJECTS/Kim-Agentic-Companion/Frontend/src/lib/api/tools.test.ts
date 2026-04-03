import { describe, expect, it } from "vitest";
import { parseToolsResponse } from "./tools";

describe("parseToolsResponse", () => {
  it("prefers MCP tools when available", () => {
    const parsed = parseToolsResponse({
      ok: true,
      tools: {
        allowedTools: ["calendar.create_event"],
        mcpTools: [{ name: "calendar.create_event", description: "Create event" }],
      },
    });

    expect(parsed.tools).toEqual([{ name: "calendar.create_event", description: "Create event" }]);
    expect(parsed.error).toBeNull();
  });

  it("falls back to allowed tools when MCP tools are unavailable", () => {
    const parsed = parseToolsResponse({
      ok: true,
      tools: {
        allowedTools: ["calendar.create_event", "web.fetch"],
        mcpTools: [],
        mcpToolsError: "mcp unavailable",
      },
    });

    expect(parsed.tools).toEqual([
      { name: "calendar.create_event", description: "Allowed by policy" },
      { name: "web.fetch", description: "Allowed by policy" },
    ]);
    expect(parsed.error).toBe("mcp unavailable");
  });
});
