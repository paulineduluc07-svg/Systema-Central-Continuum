import { afterEach, describe, expect, it, vi } from "vitest";
import { McpClient } from "../src/mcp-gateway/mcpClient.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("McpClient", () => {
  it("returns configuration error when base URL is missing", async () => {
    const client = new McpClient({ baseUrl: "" });

    const result = await client.invoke({
      toolName: "calendar.create_event",
      input: {}
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("mcp_server_not_configured");
  });

  it("sends auth headers when apiKey is configured", async () => {
    const fetchMock = vi.fn(async (_url: unknown, init?: RequestInit) => {
      const headers = (init?.headers ?? {}) as Record<string, string>;
      expect(headers.authorization).toBe("Bearer key_123");
      expect(headers["x-api-key"]).toBe("key_123");

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    });

    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const client = new McpClient({
      baseUrl: "https://mcp.example.com",
      apiKey: "key_123",
      timeoutMs: 5000
    });

    const result = await client.invoke({
      toolName: "calendar.create_event",
      input: { title: "Call" }
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
  });
});