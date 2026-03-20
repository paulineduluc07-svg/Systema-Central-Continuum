import { createServer, IncomingMessage, Server, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { KimAgent } from "../agent-core/kimAgent.js";
import { InMemorySessionStore } from "../agent-core/sessionStore.js";
import { McpClient } from "../mcp-gateway/mcpClient.js";
import { isBearerAuthorized } from "../shared/auth.js";
import { log } from "../shared/logger.js";
import { isValidHmacSha256 } from "../shared/signature.js";
import { ChatRequest, PermissionGrantState, SessionCreateRequest } from "../shared/types.js";

const MAX_BODY_BYTES = 1024 * 1024;

export interface ServerConfig {
  port: number;
  agent: KimAgent;
  sessions: InMemorySessionStore;
  mcpClient: McpClient;
  authToken?: string;
  vapiWebhookSecret?: string;
}

function json(res: ServerResponse, statusCode: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body).toString()
  });
  res.end(body);
}

async function readRawBody(req: IncomingMessage): Promise<string> {
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
    return "";
  }

  return Buffer.concat(chunks).toString("utf8");
}

function parseJson(raw: string): unknown {
  if (raw.trim().length === 0) {
    return {};
  }

  return JSON.parse(raw) as unknown;
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null;
}

function readString(input: Record<string, unknown>, key: string): string | undefined {
  const value = input[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function readStringArray(input: Record<string, unknown>, key: string): string[] | undefined {
  const value = input[key];
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.filter((item) => typeof item === "string") as string[];
  return items.length > 0 ? items : undefined;
}

function readBoolean(input: Record<string, unknown>, key: string): boolean | undefined {
  const value = input[key];
  return typeof value === "boolean" ? value : undefined;
}

function normalizePermissionSource(value: string | undefined): PermissionGrantState["source"] {
  if (value === "chat" || value === "voice" || value === "admin" || value === "system") {
    return value;
  }

  return "system";
}

function readPermissionGrants(input: Record<string, unknown>): PermissionGrantState[] | undefined {
  const permissionContext = input.permissionContext;
  if (!isRecord(permissionContext)) {
    return undefined;
  }

  const grants = permissionContext.grants;
  if (!Array.isArray(grants)) {
    return undefined;
  }

  const parsed = grants
    .map((item): PermissionGrantState | undefined => {
      if (!isRecord(item)) {
        return undefined;
      }

      const scopes = readStringArray(item, "scopes");
      if (!scopes) {
        return undefined;
      }

      const grantId = readString(item, "grantId") ?? "grant_unspecified";
      const subjectId = readString(item, "subjectId") ?? "subject_unspecified";
      const issuedAt = readString(item, "issuedAt") ?? new Date().toISOString();
      const expiresAt = readString(item, "expiresAt");
      const source = normalizePermissionSource(readString(item, "source"));
      const confirmationRequired = readBoolean(item, "confirmationRequired");

      return {
        grantId,
        subjectId,
        scopes,
        issuedAt,
        expiresAt,
        source,
        confirmationRequired
      };
    })
    .filter((grant): grant is PermissionGrantState => Boolean(grant));

  return parsed.length > 0 ? parsed : undefined;
}

function readRevokedTools(input: Record<string, unknown>): string[] | undefined {
  const direct = readStringArray(input, "revokedTools");
  if (direct) {
    return direct;
  }

  const permissionContext = input.permissionContext;
  if (!isRecord(permissionContext)) {
    return undefined;
  }

  const revokes = permissionContext.revokes;
  if (!Array.isArray(revokes)) {
    return undefined;
  }

  const scopes = revokes
    .map((item) => (isRecord(item) ? readString(item, "scope") : undefined))
    .filter((scope): scope is string => typeof scope === "string" && scope.length > 0);

  return scopes.length > 0 ? scopes : undefined;
}

function readConfirmationProvided(input: Record<string, unknown>): boolean | undefined {
  const direct = readBoolean(input, "confirmationProvided");
  if (direct !== undefined) {
    return direct;
  }

  const permissionContext = input.permissionContext;
  if (!isRecord(permissionContext)) {
    return undefined;
  }

  return readBoolean(permissionContext, "confirmationProvided");
}

function readRequestedTool(input: Record<string, unknown>): ChatRequest["requestedTool"] {
  const rawTool = input.requestedTool;
  if (!isRecord(rawTool)) {
    return undefined;
  }

  const name = readString(rawTool, "name");
  const toolInput = isRecord(rawTool.input) ? rawTool.input : undefined;

  if (!name || !toolInput) {
    return undefined;
  }

  const sensitive = typeof rawTool.sensitive === "boolean" ? rawTool.sensitive : undefined;

  return {
    name,
    input: toolInput,
    sensitive
  };
}

function isSessionCreateRequest(input: unknown): input is SessionCreateRequest {
  if (!isRecord(input)) {
    return false;
  }

  return typeof input.userId === "string" && input.userId.trim().length > 0;
}

function isChatRequest(input: unknown): input is ChatRequest {
  if (!isRecord(input)) {
    return false;
  }

  const messageOk = typeof input.message === "string" && input.message.trim().length > 0;
  const userIdOk = input.userId === undefined || typeof input.userId === "string";
  const sessionIdOk = input.sessionId === undefined || typeof input.sessionId === "string";

  return messageOk && userIdOk && sessionIdOk;
}

function extractWebhookMessage(payload: Record<string, unknown>): string | null {
  const direct = readString(payload, "message");
  if (direct) {
    return direct;
  }

  const transcript = readString(payload, "transcript");
  if (transcript) {
    return transcript;
  }

  const text = readString(payload, "text");
  if (text) {
    return text;
  }

  const nestedMessage = payload.message;
  if (isRecord(nestedMessage)) {
    const nestedText = readString(nestedMessage, "content");
    if (nestedText) {
      return nestedText;
    }
  }

  return null;
}

function extractWebhookIdentity(payload: Record<string, unknown>, sessions: InMemorySessionStore): { userId: string; sessionId?: string } {
  const sessionId = readString(payload, "sessionId");
  if (sessionId) {
    const session = sessions.get(sessionId);
    if (session) {
      return { userId: session.userId, sessionId };
    }
  }

  const userId = readString(payload, "userId");
  if (userId) {
    return { userId, sessionId };
  }

  return { userId: "vapi_guest", sessionId };
}

function ensureAuthorized(req: IncomingMessage, expectedToken: string | undefined): boolean {
  return isBearerAuthorized(req.headers.authorization, expectedToken);
}

export function startServer(config: ServerConfig): Server {
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

    if (req.method === "GET" && req.url === "/v1/mcp/health") {
      if (!ensureAuthorized(req, config.authToken)) {
        json(res, 401, { error: "unauthorized", requestId });
        return;
      }

      const mcp = await config.mcpClient.health();
      if (!mcp.success) {
        json(res, 502, { error: "mcp_unavailable", detail: mcp.error, requestId });
        return;
      }

      json(res, 200, { ok: true, requestId, mcp: mcp.data ?? { ok: true } });
      return;
    }

    if (req.method === "POST" && req.url === "/v1/sessions") {
      if (!ensureAuthorized(req, config.authToken)) {
        json(res, 401, { error: "unauthorized", requestId });
        return;
      }

      try {
        const body = parseJson(await readRawBody(req));

        if (!isSessionCreateRequest(body)) {
          json(res, 400, { error: "invalid_payload", requestId });
          return;
        }

        const session = config.sessions.create(body.userId.trim());
        json(res, 201, { requestId, session });
        return;
      } catch (error) {
        const reason = error instanceof Error ? error.message : "unknown_error";
        log("error", "session_create_failed", { requestId, reason });
        json(res, 500, { error: "internal_error", requestId });
        return;
      }
    }

    if (req.method === "POST" && req.url === "/v1/chat") {
      if (!ensureAuthorized(req, config.authToken)) {
        json(res, 401, { error: "unauthorized", requestId });
        return;
      }

      try {
        const body = parseJson(await readRawBody(req));

        if (!isChatRequest(body)) {
          json(res, 400, { error: "invalid_payload", requestId });
          return;
        }

        const payload = body as unknown as Record<string, unknown>;
        const sessionId = readString(payload, "sessionId");
        const directUserId = readString(payload, "userId");

        let userId = directUserId;
        if (sessionId) {
          const session = config.sessions.get(sessionId);
          if (!session) {
            json(res, 404, { error: "session_not_found", requestId });
            return;
          }

          if (userId && userId !== session.userId) {
            json(res, 403, { error: "session_user_mismatch", requestId });
            return;
          }

          userId = session.userId;
        }

        if (!userId) {
          json(res, 400, { error: "missing_user_or_session", requestId });
          return;
        }

        const message = readString(payload, "message") ?? "";
        const result = await config.agent.respond({
          userId,
          message,
          grantedTools: readStringArray(payload, "grantedTools"),
          permissionGrants: readPermissionGrants(payload),
          revokedTools: readRevokedTools(payload),
          confirmationProvided: readConfirmationProvided(payload),
          requestedTool: readRequestedTool(payload)
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

    if (req.method === "POST" && req.url === "/v1/webhooks/vapi") {
      try {
        const rawBody = await readRawBody(req);
        const signatureHeader =
          (typeof req.headers["x-vapi-signature"] === "string" ? req.headers["x-vapi-signature"] : undefined) ??
          (typeof req.headers["x-signature"] === "string" ? req.headers["x-signature"] : undefined);

        if (!isValidHmacSha256(rawBody, signatureHeader, config.vapiWebhookSecret)) {
          json(res, 401, { error: "invalid_signature", requestId });
          return;
        }

        const body = parseJson(rawBody);
        if (!isRecord(body)) {
          json(res, 400, { error: "invalid_payload", requestId });
          return;
        }

        const message = extractWebhookMessage(body);
        if (!message) {
          json(res, 400, { error: "missing_message", requestId });
          return;
        }

        const identity = extractWebhookIdentity(body, config.sessions);
        const result = await config.agent.respond({
          userId: identity.userId,
          message,
          grantedTools: readStringArray(body, "grantedTools"),
          permissionGrants: readPermissionGrants(body),
          revokedTools: readRevokedTools(body),
          confirmationProvided: readConfirmationProvided(body),
          requestedTool: readRequestedTool(body)
        });

        json(res, 200, {
          requestId,
          ok: true,
          reply: result.reply,
          tool: result.tool,
          sessionId: identity.sessionId
        });
        return;
      } catch (error) {
        const reason = error instanceof Error ? error.message : "unknown_error";
        log("error", "vapi_webhook_failed", { requestId, reason });
        json(res, 500, { error: "internal_error", requestId });
        return;
      }
    }

    json(res, 404, { error: "not_found", requestId });
  });

  server.listen(config.port);
  return server;
}
