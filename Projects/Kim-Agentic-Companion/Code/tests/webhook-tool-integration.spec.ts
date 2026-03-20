import { createHmac } from "node:crypto";
import { request as httpRequest, Server } from "node:http";
import { afterEach, describe, expect, it, vi } from "vitest";
import { KimAgent } from "../src/agent-core/kimAgent.js";
import { InMemoryMemoryStore } from "../src/agent-core/memoryStore.js";
import { InMemorySessionStore } from "../src/agent-core/sessionStore.js";
import { startServer } from "../src/api/server.js";
import { McpClient } from "../src/mcp-gateway/mcpClient.js";
import { McpPolicy } from "../src/mcp-gateway/mcpPolicy.js";

const originalFetch = globalThis.fetch;

function sendJson(port: number, path: string, method: string, body: string, headers: Record<string, string>): Promise<{ statusCode: number; body: unknown }> {
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
          ...headers
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

describe("Vapi webhook integration", () => {
  it("executes calendar tool when webhook is signed and payload includes requestedTool", async () => {
    const mcpFetch = vi.fn(async (_url: unknown, _init?: RequestInit) => {
      return new Response(JSON.stringify({ eventId: "evt_1" }), {
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

    const agent = new KimAgent(
      new InMemoryMemoryStore(),
      new McpPolicy({
        allowedToolsCsv: "calendar.create_event",
        requireConfirmationByDefault: "false"
      }),
      mcpClient
    );

    const secret = "webhook_secret_test";
    const server = startServer({
      port: 0,
      agent,
      sessions: new InMemorySessionStore(),
      mcpClient,
      vapiWebhookSecret: secret
    });

    const address = server.address();
    if (!address || typeof address === "string") {
      await closeServer(server);
      throw new Error("failed_to_bind_test_server");
    }

    const payload = {
      userId: "user_webhook_1",
      message: "cree un evenement calendrier",
      grantedTools: ["calendar.create_event"],
      requestedTool: {
        name: "calendar.create_event",
        input: {
          title: "Call",
          startAt: "2026-03-21T10:00:00Z"
        },
        sensitive: false
      }
    };

    const raw = JSON.stringify(payload);
    const signature = createHmac("sha256", secret).update(raw, "utf8").digest("hex");

    const response = await sendJson(address.port, "/v1/webhooks/vapi", "POST", raw, {
      "x-vapi-signature": signature
    });

    expect(response.statusCode).toBe(200);

    const parsed = response.body as { tool?: { status?: string; name?: string } };
    expect(parsed.tool?.name).toBe("calendar.create_event");
    expect(parsed.tool?.status).toBe("executed");
    expect(mcpFetch).toHaveBeenCalledTimes(1);

    await closeServer(server);
  });
});