import "dotenv/config";

import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createSystemaMcpServer, WRITE_TOOL_NAMES } from "./systema-core.js";
import { verifyMcpSecret } from "./auth.js";

// HTTP keeps read-only tools available without a secret for Cowork compatibility.
// DB write tools require x-systema-mcp-secret and fail closed when SYSTEMA_MCP_SECRET is unset.
const writeToolNames = new Set<string>(WRITE_TOOL_NAMES);

function setCorsHeaders(res: express.Response) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id, x-systema-mcp-secret"
  );
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
}

function isWriteToolCall(payload: unknown): boolean {
  if (Array.isArray(payload)) {
    return payload.some(isWriteToolCall);
  }

  if (!payload || typeof payload !== "object") {
    return false;
  }

  const message = payload as { method?: unknown; params?: { name?: unknown } };
  return message.method === "tools/call" && typeof message.params?.name === "string" && writeToolNames.has(message.params.name);
}

function sendMethodNotAllowed(res: express.Response) {
  setCorsHeaders(res);
  res.setHeader("Allow", "POST, OPTIONS");
  res.status(405).json({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed. Use POST for the Streamable HTTP MCP endpoint.",
    },
    id: null,
  });
}

export function createSystemaMcpHttpApp() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));

  app.options("*", (_req, res) => {
    setCorsHeaders(res);
    res.status(204).end();
  });

  app.post("*", async (req, res) => {
    setCorsHeaders(res);

    if (isWriteToolCall(req.body) && !verifyMcpSecret(req)) {
      res.status(401).json({
        jsonrpc: "2.0",
        error: {
          code: -32001,
          message: "Unauthorized Systema MCP write tool call.",
        },
        id: req.body?.id ?? null,
      });
      return;
    }

    const server = createSystemaMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("Error handling Systema MCP HTTP request:", error);

      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error",
          },
          id: null,
        });
      }
    } finally {
      await transport.close();
      await server.close();
    }
  });

  app.get("*", (_req, res) => {
    sendMethodNotAllowed(res);
  });

  app.delete("*", (_req, res) => {
    sendMethodNotAllowed(res);
  });

  return app;
}
