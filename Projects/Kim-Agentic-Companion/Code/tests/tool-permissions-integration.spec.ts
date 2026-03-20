import { request as httpRequest, Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { KimAgent } from "../src/agent-core/kimAgent.js";
import { InMemoryMemoryStore } from "../src/agent-core/memoryStore.js";
import { InMemorySessionStore } from "../src/agent-core/sessionStore.js";
import { startServer } from "../src/api/server.js";
import { McpClient } from "../src/mcp-gateway/mcpClient.js";
import { McpPolicy } from "../src/mcp-gateway/mcpPolicy.js";

const originalFetch = globalThis.fetch;

function sendJson(port: number, path: string, method: string, body: string, headers?: Record<string, string>): Promise<{ statusCode: number; body: unknown }> {
  return new Promise((resolve, reject) => {
    const req = httpRequest(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method,
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(body).toString(),
          ...(headers ?? {})
        }
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        res.on("end", () => {
          const raw = Buffer.concat(chunks).toString("utf8");
          const parsed = raw.length > 0 ? JSON.parse(raw) : {};
          resolve({ statusCode: res.statusCode ?? 0, body: parsed });
        });
      }
    );

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("Tool permissions integration", () => {
  it("returns chat reply without tool for nominal chat request", async () => {
    const mcpFetch = vi.fn(async (_url: unknown, _init?: RequestInit) => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    });

    globalThis.fetch = mcpFetch as unknown as typeof fetch;

    const mcpClient = new McpClient({
      baseUrl: "https://mcp.staging.example.com",
      apiKey: "mcp_key_test",
      timeoutMs: 5000
    });

    const server = startServer({
      port: 0,
      agent: new KimAgent(
        new InMemoryMemoryStore(),
        new McpPolicy({
          allowedToolsCsv: "calendar.create_event",
          requireConfirmationByDefault: "false"
        }),
        mcpClient
      ),
      sessions: new InMemorySessionStore(),
      mcpClient
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      await closeServer(server);
      throw new Error("failed_to_bind_test_server");
    }

    const response = await sendJson(address.port, "/v1/chat", "POST", JSON.stringify({
      userId: "user_chat_1",
      message: "bonjour kim"
    }));

    expect(response.statusCode).toBe(200);
    const parsed = response.body as { reply?: string; tool?: unknown };
    expect(typeof parsed.reply).toBe("string");
    expect(parsed.tool).toBeUndefined();
    expect(mcpFetch).toHaveBeenCalledTimes(0);

    await closeServer(server);
  });

  it("blocks tool when user grant is missing", async () => {
    const mcpFetch = vi.fn(async (_url: unknown, _init?: RequestInit) => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    });

    globalThis.fetch = mcpFetch as unknown as typeof fetch;

    const mcpClient = new McpClient({
      baseUrl: "https://mcp.staging.example.com",
      apiKey: "mcp_key_test",
      timeoutMs: 5000
    });

    const server = startServer({
      port: 0,
      agent: new KimAgent(
        new InMemoryMemoryStore(),
        new McpPolicy({
          allowedToolsCsv: "calendar.create_event",
          requireConfirmationByDefault: "false"
        }),
        mcpClient
      ),
      sessions: new InMemorySessionStore(),
      mcpClient
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      await closeServer(server);
      throw new Error("failed_to_bind_test_server");
    }

    const response = await sendJson(address.port, "/v1/chat", "POST", JSON.stringify({
      userId: "user_chat_2",
      message: "cree evenement",
      requestedTool: {
        name: "calendar.create_event",
        input: {
          title: "Call",
          startAt: "2026-03-21T10:00:00Z"
        },
        sensitive: false
      }
    }));

    expect(response.statusCode).toBe(200);
    const parsed = response.body as { tool?: { status?: string; detail?: string } };
    expect(parsed.tool?.status).toBe("blocked");
    expect(parsed.tool?.detail).toBe("tool_not_granted_by_user");
    expect(mcpFetch).toHaveBeenCalledTimes(0);

    await closeServer(server);
  });

  it("blocks tool when revoked scope is provided in chat payload", async () => {
    const mcpFetch = vi.fn(async (_url: unknown, _init?: RequestInit) => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    });

    globalThis.fetch = mcpFetch as unknown as typeof fetch;

    const mcpClient = new McpClient({
      baseUrl: "https://mcp.staging.example.com",
      apiKey: "mcp_key_test",
      timeoutMs: 5000
    });

    const server = startServer({
      port: 0,
      agent: new KimAgent(
        new InMemoryMemoryStore(),
        new McpPolicy({
          allowedToolsCsv: "calendar.create_event",
          requireConfirmationByDefault: "false"
        }),
        mcpClient
      ),
      sessions: new InMemorySessionStore(),
      mcpClient
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      await closeServer(server);
      throw new Error("failed_to_bind_test_server");
    }

    const response = await sendJson(address.port, "/v1/chat", "POST", JSON.stringify({
      userId: "user_chat_3",
      message: "cree evenement",
      grantedTools: ["calendar.create_event"],
      revokedTools: ["calendar.create_event"],
      requestedTool: {
        name: "calendar.create_event",
        input: {
          title: "Call",
          startAt: "2026-03-21T10:00:00Z"
        },
        sensitive: false
      }
    }));

    expect(response.statusCode).toBe(200);
    const parsed = response.body as { tool?: { status?: string; detail?: string } };
    expect(parsed.tool?.status).toBe("blocked");
    expect(parsed.tool?.detail).toBe("tool_scope_revoked");
    expect(mcpFetch).toHaveBeenCalledTimes(0);

    await closeServer(server);
  });
});
