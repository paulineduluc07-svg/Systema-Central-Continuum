import "dotenv/config";

import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createSystemaMcpServer } from "./systema-core.js";

function setCorsHeaders(res: express.Response) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, MCP-Protocol-Version, Mcp-Session-Id"
  );
  res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
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
