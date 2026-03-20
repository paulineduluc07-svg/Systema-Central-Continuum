import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { KimAgent } from "../agent-core/kimAgent.js";
import { ChatRequest } from "../shared/types.js";
import { log } from "../shared/logger.js";

const MAX_BODY_BYTES = 1024 * 1024;

export interface ServerConfig {
  port: number;
  agent: KimAgent;
}

function json(res: ServerResponse, statusCode: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body).toString()
  });
  res.end(body);
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let total = 0;

  for await (const chunk of req) {
    const asBuffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += asBuffer.length;

    if (total > MAX_BODY_BYTES) {
      throw new Error("payload_too_large");
    }

    chunks.push(asBuffer);
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(raw);
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null;
}

function isChatRequest(input: unknown): input is ChatRequest {
  if (!isRecord(input)) {
    return false;
  }

  return typeof input.userId === "string" && typeof input.message === "string";
}

export function startServer(config: ServerConfig): void {
  const server = createServer(async (req, res) => {
    const requestId = randomUUID();

    if (!req.url || !req.method) {
      json(res, 400, { error: "invalid_request", requestId });
      return;
    }

    if (req.method === "GET" && req.url === "/health") {
      json(res, 200, { ok: true, service: "kim-agentic-api", requestId });
      return;
    }

    if (req.method === "POST" && req.url === "/v1/chat") {
      try {
        const body = await readJsonBody(req);

        if (!isChatRequest(body)) {
          json(res, 400, { error: "invalid_payload", requestId });
          return;
        }

        const result = await config.agent.respond({
          userId: body.userId,
          message: body.message,
          grantedTools: body.grantedTools,
          requestedTool: body.requestedTool
        });

        json(res, 200, {
          requestId,
          reply: result.reply,
          tool: result.tool
        });
        return;
      } catch (error) {
        const reason = error instanceof Error ? error.message : "unknown_error";
        log("error", "chat_request_failed", { requestId, reason });
        json(res, 500, { error: "internal_error", requestId });
        return;
      }
    }

    json(res, 404, { error: "not_found", requestId });
  });

  server.listen(config.port);
}