import { createServer, IncomingMessage, Server, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { KimAgent } from "../agent-core/kimAgent.js";
import { InMemorySessionStore } from "../agent-core/sessionStore.js";
import { ElevenLabsClient, ElevenLabsSynthesisRequest } from "../integrations/elevenLabsClient.js";
import { VapiCallRequest, VapiClient } from "../integrations/vapiClient.js";
import { McpClient } from "../mcp-gateway/mcpClient.js";
import { McpPolicy } from "../mcp-gateway/mcpPolicy.js";
import { isBearerAuthorized } from "../shared/auth.js";
import { log } from "../shared/logger.js";
import { isValidHmacSha256 } from "../shared/signature.js";
import { ChatRequest, PermissionGrantState, SessionCreateRequest } from "../shared/types.js";

const MAX_BODY_BYTES = 1024 * 1024;
const DEFAULT_AVATAR_PNG = (() => {
  try {
    return readFileSync(new URL("../../assets/kim-avatar.png", import.meta.url));
  } catch {
    return null;
  }
})();

export interface ServerConfig {
  port: number;
  agent: KimAgent;
  sessions: InMemorySessionStore;
  mcpClient: McpClient;
  mcpPolicy?: McpPolicy;
  vapiClient?: VapiClient;
  elevenLabsClient?: ElevenLabsClient;
  authToken?: string;
  vapiWebhookSecret?: string;
}

export interface RequestHandlerConfig {
  agent: KimAgent;
  sessions: InMemorySessionStore;
  mcpClient: McpClient;
  mcpPolicy?: McpPolicy;
  vapiClient?: VapiClient;
  elevenLabsClient?: ElevenLabsClient;
  authToken?: string;
  vapiWebhookSecret?: string;
}

const DEFAULT_CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "https://kim-frontend-staging.vercel.app"];
const DEFAULT_CORS_ALLOWED_HEADERS = "authorization, content-type";
const DEFAULT_CORS_ALLOWED_METHODS = "GET, POST, OPTIONS";

function parseCsvList(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

function resolveAllowedCorsOrigins(raw: string | undefined): string[] {
  return Array.from(new Set([...DEFAULT_CORS_ALLOWED_ORIGINS, ...parseCsvList(raw)]));
}

function readOrigin(req: IncomingMessage): string | undefined {
  const header = req.headers.origin;
  if (typeof header !== "string") {
    return undefined;
  }

  const origin = header.trim();
  return origin.length > 0 ? origin : undefined;
}

function setHeaderIfMissing(res: ServerResponse, key: string, value: string): void {
  if (!res.hasHeader(key)) {
    res.setHeader(key, value);
  }
}

function appendVary(res: ServerResponse, value: string): void {
  const existing = res.getHeader("vary");
  const currentValues =
    typeof existing === "string"
      ? existing.split(",").map((part) => part.trim()).filter((part) => part.length > 0)
      : Array.isArray(existing)
        ? existing.flatMap((part) => String(part).split(",").map((item) => item.trim())).filter((part) => part.length > 0)
        : [];

  if (!currentValues.some((part) => part.toLowerCase() === value.toLowerCase())) {
    currentValues.push(value);
  }

  if (currentValues.length > 0) {
    res.setHeader("vary", currentValues.join(", "));
  }
}

function applyCorsHeaders(req: IncomingMessage, res: ServerResponse, config: RequestHandlerConfig): string | undefined {
  appendVary(res, "Origin");

  const origin = readOrigin(req);
  if (!origin) {
    return undefined;
  }

  const allowedOrigins = resolveAllowedCorsOrigins(process.env.CORS_ALLOWED_ORIGINS);
  if (!allowedOrigins.includes(origin)) {
    return undefined;
  }

  const requestedHeaders =
    typeof req.headers["access-control-request-headers"] === "string"
      ? req.headers["access-control-request-headers"]
      : DEFAULT_CORS_ALLOWED_HEADERS;

  res.setHeader("access-control-allow-origin", origin);
  res.setHeader("access-control-allow-methods", DEFAULT_CORS_ALLOWED_METHODS);
  res.setHeader("access-control-allow-headers", requestedHeaders);
  res.setHeader("access-control-max-age", "86400");
  appendVary(res, "Access-Control-Request-Headers");
  return origin;
}

function json(res: ServerResponse, statusCode: number, payload: unknown): void {
  const body = JSON.stringify(payload);
  setHeaderIfMissing(res, "content-type", "application/json; charset=utf-8");
  setHeaderIfMissing(res, "content-length", Buffer.byteLength(body).toString());
  res.writeHead(statusCode);
  res.end(body);
}

function html(res: ServerResponse, statusCode: number, markup: string): void {
  setHeaderIfMissing(res, "content-type", "text/html; charset=utf-8");
  setHeaderIfMissing(res, "content-length", Buffer.byteLength(markup).toString());
  res.writeHead(statusCode);
  res.end(markup);
}

function png(res: ServerResponse, statusCode: number, data: Buffer): void {
  setHeaderIfMissing(res, "content-type", "image/png");
  setHeaderIfMissing(res, "cache-control", "public, max-age=3600");
  setHeaderIfMissing(res, "content-length", data.byteLength.toString());
  res.writeHead(statusCode);
  res.end(data);
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

function resolveAppName(raw: string | undefined): string {
  const fallback = "Kim";
  if (!raw) {
    return fallback;
  }

  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeForInlineScript(value: string): string {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");
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

function readVapiCallRequest(input: Record<string, unknown>): VapiCallRequest | null {
  const assistantId = readString(input, "assistantId");
  const customer = input.customer;

  if (!assistantId || !isRecord(customer)) {
    return null;
  }

  const number = readString(customer, "number");
  if (!number) {
    return null;
  }

  const name = readString(customer, "name");
  const phoneNumberId = readString(input, "phoneNumberId");
  const metadata = isRecord(input.metadata) ? input.metadata : undefined;

  return {
    assistantId,
    customer: {
      number,
      name
    },
    phoneNumberId,
    metadata
  };
}

function readSynthesisRequest(input: Record<string, unknown>): ElevenLabsSynthesisRequest | null {
  const text = readString(input, "text");
  if (!text) {
    return null;
  }

  const voiceId = readString(input, "voiceId");
  const modelId = readString(input, "modelId");
  const outputFormat = readString(input, "outputFormat");

  return {
    text,
    voiceId,
    modelId,
    outputFormat
  };
}

function readToolInvokeRequest(input: Record<string, unknown>): { toolName: string; toolInput: Record<string, unknown>; sensitive: boolean } | null {
  const toolName = readString(input, "toolName");
  if (!toolName) {
    return null;
  }

  const toolInput = isRecord(input.input) ? input.input : null;
  if (!toolInput) {
    return null;
  }

  return {
    toolName,
    toolInput,
    sensitive: readBoolean(input, "sensitive") ?? false
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

export async function handleRequest(req: IncomingMessage, res: ServerResponse, config: RequestHandlerConfig): Promise<void> {
  const requestId = randomUUID();
  const allowedOrigin = applyCorsHeaders(req, res, config);

  if (req.method === "OPTIONS") {
    if (readOrigin(req) && !allowedOrigin) {
      json(res, 403, { error: "origin_not_allowed", requestId });
      return;
    }

    res.writeHead(204);
    res.end();
    return;
  }

  if (!req.url || !req.method) {
    json(res, 400, { error: "invalid_request", requestId });
    return;
  }

  if (req.method === "GET" && req.url === "/assets/kim-avatar.png") {
    if (!DEFAULT_AVATAR_PNG) {
      json(res, 404, { error: "avatar_not_found", requestId });
      return;
    }

    png(res, 200, DEFAULT_AVATAR_PNG);
    return;
  }

  if (req.method === "GET" && (req.url === "/" || req.url.startsWith("/?"))) {
    const appName = resolveAppName(process.env.APP_NAME);
    const appTitle = `${appName} Companion`;
    const appInitial = (appName[0] ?? "K").toUpperCase();
    const escapedAppName = escapeHtml(appName);
    const escapedAppTitle = escapeHtml(appTitle);
    const escapedAppInitial = escapeHtml(appInitial);
    const appNameScriptLiteral = escapeForInlineScript(appName);

    html(
      res,
      200,
      `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapedAppTitle}</title>
  <style>
    :root {
      --bg-1: #050714;
      --bg-2: #13182f;
      --ink: #f4f3ff;
      --muted: #a8aed3;
      --glass: rgba(33, 38, 78, 0.52);
      --glass-edge: rgba(183, 194, 255, 0.22);
      --accent: #ff5f7c;
      --accent-2: #68fff0;
    }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      min-height: 100%;
      color: var(--ink);
      background: radial-gradient(circle at 20% 20%, #3a2c63 0, rgba(58, 44, 99, 0) 35%),
        radial-gradient(circle at 80% 15%, #723f7e 0, rgba(114, 63, 126, 0) 33%),
        linear-gradient(160deg, var(--bg-1), var(--bg-2));
      font-family: "Segoe UI", "Trebuchet MS", sans-serif;
      overflow-x: hidden;
    }
    .cosmos {
      position: fixed;
      inset: 0;
      background-image:
        radial-gradient(2px 2px at 15% 25%, rgba(255, 255, 255, 0.5), transparent 80%),
        radial-gradient(1.5px 1.5px at 75% 14%, rgba(114, 255, 245, 0.5), transparent 80%),
        radial-gradient(1.5px 1.5px at 30% 80%, rgba(255, 114, 159, 0.45), transparent 80%),
        radial-gradient(2px 2px at 64% 70%, rgba(255, 255, 255, 0.34), transparent 80%);
      animation: drift 28s linear infinite;
      pointer-events: none;
    }
    .app-shell {
      position: relative;
      z-index: 2;
      max-width: 1280px;
      margin: 0 auto;
      padding: 16px;
    }
    .glass {
      backdrop-filter: blur(14px);
      background: var(--glass);
      border: 1px solid var(--glass-edge);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    }
    .top-nav {
      border-radius: 20px;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      font-weight: 700;
    }
    .brand-dot {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: inline-grid;
      place-items: center;
      background: linear-gradient(140deg, var(--accent), #ff9f74);
      color: #170f1f;
      font-weight: 800;
    }
    .tabs { display: flex; gap: 8px; flex-wrap: wrap; }
    .tab {
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      border: 0;
      color: #dde2ff;
      font-weight: 600;
    }
    .tab.active {
      color: #fff;
      background: linear-gradient(145deg, rgba(255, 95, 124, 0.34), rgba(104, 255, 240, 0.27));
    }
    .room {
      margin-top: 14px;
      display: grid;
      grid-template-columns: 1fr 1.35fr 0.9fr;
      gap: 14px;
      min-height: calc(100vh - 130px);
    }
    .stage {
      border-radius: 24px;
      min-height: 620px;
      position: relative;
      overflow: hidden;
      padding: 14px;
      display: grid;
      place-items: center;
    }
    .avatar-figure {
      width: min(95%, 430px);
      height: min(96%, 620px);
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    .avatar-img {
      position: relative;
      z-index: 2;
      width: 100%;
      max-height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 24px 44px rgba(0, 0, 0, 0.55));
    }
    .orb {
      width: min(90%, 420px);
      aspect-ratio: 1;
      border-radius: 50%;
      position: relative;
      z-index: 1;
      background:
        radial-gradient(circle at 30% 24%, rgba(250, 245, 255, 0.9) 0 6%, rgba(250, 245, 255, 0) 35%),
        radial-gradient(circle at 40% 35%, #ffb4cd 0 18%, rgba(255, 180, 205, 0) 60%),
        radial-gradient(circle at 65% 65%, #6ed8ff 0 20%, rgba(110, 216, 255, 0) 64%),
        linear-gradient(160deg, #2f2a66, #121533);
      box-shadow: 0 34px 80px rgba(0, 0, 0, 0.55), inset 0 0 40px rgba(255, 255, 255, 0.12);
      animation: pulse 6s ease-in-out infinite;
      position: absolute;
      top: 6%;
      left: 5%;
      right: 5%;
      margin: 0 auto;
    }
    .orb::before {
      content: "";
      position: absolute;
      inset: -8%;
      border-radius: 50%;
      border: 1px solid rgba(255, 187, 219, 0.35);
      animation: spin 24s linear infinite;
    }
    .orb-label {
      position: absolute;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: rgba(6, 8, 20, 0.42);
      border: 1px solid rgba(187, 196, 255, 0.26);
      border-radius: 14px;
      padding: 10px;
      font-size: 14px;
      color: #d6dcff;
    }
    .panel {
      border-radius: 24px;
      padding: 18px;
      display: grid;
      grid-template-rows: auto 1fr auto;
      gap: 12px;
    }
    .panel h1 { margin: 0; font-size: clamp(1.3rem, 2.2vw, 2rem); }
    .sub { margin: 6px 0 0; color: var(--muted); }
    .auth-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-top: 8px; }
    .auth-row input {
      border-radius: 10px;
      border: 1px solid rgba(188, 196, 250, 0.32);
      background: rgba(11, 14, 34, 0.55);
      color: #fff;
      padding: 9px 10px;
    }
    .auth-row button {
      border: 0;
      border-radius: 10px;
      padding: 0 12px;
      font-weight: 700;
      background: linear-gradient(135deg, #68fff0, #8eb3ff);
      color: #10142a;
    }
    .auth-status {
      margin-top: 8px;
      color: #cfe5ff;
      font-size: 13px;
      min-height: 18px;
    }
    .log {
      border-radius: 16px;
      background: rgba(7, 10, 24, 0.45);
      border: 1px solid rgba(179, 188, 251, 0.2);
      padding: 12px;
      min-height: 250px;
      overflow-y: auto;
    }
    .bubble {
      border-radius: 14px;
      padding: 10px 12px;
      margin: 0 0 10px;
      max-width: 86%;
      line-height: 1.35;
    }
    .kim { background: rgba(111, 130, 240, 0.33); border: 1px solid rgba(146, 161, 252, 0.36); }
    .you { margin-left: auto; background: rgba(255, 113, 149, 0.28); border: 1px solid rgba(255, 154, 182, 0.45); }
    .chat-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
    .chat-row input {
      border-radius: 12px;
      border: 1px solid rgba(188, 196, 250, 0.32);
      background: rgba(11, 14, 34, 0.55);
      color: #fff;
      padding: 10px 12px;
    }
    .chat-row button {
      border: 0;
      border-radius: 12px;
      padding: 0 16px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--accent), #ff9f74);
      color: #1b1020;
    }
    .stack { display: grid; gap: 12px; }
    .card { border-radius: 18px; padding: 14px; }
    .card h2 { margin: 0 0 10px; font-size: 1.02rem; }
    .card ul { margin: 0; padding-left: 20px; color: var(--muted); }
    .card li { margin: 8px 0; }
    .footer { margin-top: 10px; text-align: right; color: #cad1ff; font-size: 13px; }
    @keyframes drift { 0% { transform: translateY(0); } 50% { transform: translateY(-14px); } 100% { transform: translateY(0); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 34px 80px rgba(0, 0, 0, 0.55), inset 0 0 40px rgba(255, 255, 255, 0.12); }
      50% { transform: scale(1.02); box-shadow: 0 40px 90px rgba(0, 0, 0, 0.6), inset 0 0 56px rgba(255, 255, 255, 0.2); }
      100% { transform: scale(1); box-shadow: 0 34px 80px rgba(0, 0, 0, 0.55), inset 0 0 40px rgba(255, 255, 255, 0.12); }
    }
    @media (max-width: 1140px) {
      .room { grid-template-columns: 1fr; min-height: auto; }
      .stage { min-height: 440px; }
      .footer { text-align: left; margin-bottom: 14px; }
    }
  </style>
</head>
<body>
  <div class="cosmos" aria-hidden="true"></div>
  <main class="app-shell">
    <header class="top-nav glass">
      <div class="brand"><span class="brand-dot">${escapedAppInitial}</span>${escapedAppName}</div>
      <nav class="tabs" aria-label="Primary tabs">
        <button class="tab active">Chat</button>
        <button class="tab">Activities</button>
        <button class="tab">Memory</button>
        <button class="tab">Diary</button>
        <button class="tab">Profile</button>
        <button class="tab">Room</button>
      </nav>
    </header>

    <section class="room">
      <article class="stage glass">
        <div class="avatar-figure">
          <div class="orb"></div>
          <img class="avatar-img" src="/assets/kim-avatar.png" alt="${escapedAppName} default avatar in pink suit" />
          <div class="orb-label">
            ${escapedAppName} default avatar loaded from your reference image (pink suit).
          </div>
        </div>
      </article>

      <article class="panel glass">
        <header>
          <h1>${escapedAppName} Orbital Home</h1>
          <p class="sub">Live chat, phone bridge, memory vault, and skill evolution from one interface.</p>
          <div class="auth-row">
            <input id="apiToken" type="password" placeholder="API token (Bearer)..." />
            <button id="connectBtn" type="button">Connect</button>
          </div>
          <div id="authStatus" class="auth-status">Enter your API token to enable real chat + tools.</div>
          <div id="toolInline" class="auth-status">Tools: not connected</div>
        </header>
        <div id="log" class="log" role="log" aria-live="polite">
          <div class="bubble kim">${escapedAppName}: Ready. Tell me what to improve first for your perfect assistant.</div>
        </div>
        <form id="chat" class="chat-row" autocomplete="off">
          <input id="msg" type="text" maxlength="600" placeholder="Write to ${escapedAppName}..." />
          <button type="submit">Send</button>
        </form>
      </article>

      <aside class="stack">
        <section class="card glass">
          <h2>Channels</h2>
          <ul>
            <li>Live chat: ready</li>
            <li>Phone call: Vapi ready</li>
            <li>Voice output: ElevenLabs ready</li>
          </ul>
        </section>
        <section class="card glass">
          <h2>Memory & Files</h2>
          <ul>
            <li>Persistent memory database connected</li>
            <li>Session continuity enabled</li>
            <li>Internal tools available via MCP</li>
          </ul>
        </section>
        <section class="card glass">
          <h2>System Reach</h2>
          <ul>
            <li>Desktop actions through MCP gateway</li>
            <li>Mobile workflows through voice/chat channels</li>
            <li>Skills can be expanded over time</li>
          </ul>
        </section>
      </aside>
    </section>

    <div class="footer">requestId: ${requestId} · API online on /health</div>
  </main>
  <script>
    const chat = document.getElementById("chat");
    const msg = document.getElementById("msg");
    const log = document.getElementById("log");
    const apiTokenInput = document.getElementById("apiToken");
    const connectBtn = document.getElementById("connectBtn");
    const authStatus = document.getElementById("authStatus");
    const toolInline = document.getElementById("toolInline");
    const assistantName = ${appNameScriptLiteral};

    const state = {
      token: "",
      userId: "",
      sessionId: null
    };

    function randomId() {
      return Math.random().toString(36).slice(2, 10);
    }

    function appendBubble(kind, text) {
      const bubble = document.createElement("div");
      bubble.className = "bubble " + (kind === "you" ? "you" : "kim");
      bubble.textContent = (kind === "you" ? "You: " : assistantName + ": ") + text;
      log.appendChild(bubble);
      log.scrollTop = log.scrollHeight;
    }

    function setStatus(text, isError) {
      authStatus.textContent = text;
      authStatus.style.color = isError ? "#ffb6c6" : "#cfe5ff";
    }

    function authHeaders() {
      if (!state.token) {
        return null;
      }

      return {
        "content-type": "application/json",
        authorization: "Bearer " + state.token
      };
    }

    async function loadTools() {
      const headers = authHeaders();
      if (!headers) {
        toolInline.textContent = "Tools: not connected";
        return;
      }

      try {
        const res = await fetch("/v1/tools", {
          method: "GET",
          headers: {
            authorization: headers.authorization
          }
        });

        if (!res.ok) {
          toolInline.textContent = "Tools: unavailable (" + res.status + ")";
          return;
        }

        const payload = await res.json();
        const tools = (payload && payload.tools && Array.isArray(payload.tools.mcpTools)) ? payload.tools.mcpTools : [];
        const names = tools.map((item) => item && item.name).filter(Boolean);
        toolInline.textContent = "Tools: " + (names.length > 0 ? names.join(", ") : "none");
      } catch {
        toolInline.textContent = "Tools: unavailable";
      }
    }

    async function ensureSession() {
      if (state.sessionId) {
        return true;
      }

      const headers = authHeaders();
      if (!headers) {
        setStatus("Enter API token first.", true);
        return false;
      }

      const res = await fetch("/v1/sessions", {
        method: "POST",
        headers,
        body: JSON.stringify({
          userId: state.userId
        })
      });

      if (!res.ok) {
        const raw = await res.text();
        setStatus("Session failed (" + res.status + "). " + raw.slice(0, 120), true);
        return false;
      }

      const payload = await res.json();
      state.sessionId = payload && payload.session ? payload.session.sessionId : null;
      if (!state.sessionId) {
        setStatus("Session failed: missing sessionId", true);
        return false;
      }

      setStatus("Connected. Session ready.", false);
      return true;
    }

    async function connect() {
      const token = apiTokenInput.value.trim();
      state.token = token;
      state.sessionId = null;

      if (!token) {
        localStorage.removeItem("kim_api_token");
        setStatus("Token removed. Enter one to reconnect.", false);
        toolInline.textContent = "Tools: not connected";
        return;
      }

      localStorage.setItem("kim_api_token", token);
      const ok = await ensureSession();
      await loadTools();

      if (!ok) {
        return;
      }

      try {
        const healthRes = await fetch("/v1/integrations/health", {
          method: "GET",
          headers: {
            authorization: "Bearer " + state.token
          }
        });
        if (!healthRes.ok) {
          return;
        }
        const health = await healthRes.json();
        const integrations = health && health.integrations ? health.integrations : {};
        const statusText =
          "Connected. openai=" + Boolean(integrations.openAiConfigured) +
          ", vapi=" + Boolean(integrations.vapiConfigured) +
          ", eleven=" + Boolean(integrations.elevenLabsConfigured);
        setStatus(statusText, false);
      } catch {
        // ignore non-critical health check errors
      }
    }

    chat.addEventListener("submit", async (event) => {
      event.preventDefault();
      const text = msg.value.trim();
      if (!text) return;

      appendBubble("you", text);
      msg.value = "";

      const canContinue = await ensureSession();
      if (!canContinue) {
        appendBubble("kim", "I need your API token to use real chat.");
        return;
      }

      const headers = authHeaders();
      try {
        const res = await fetch("/v1/chat", {
          method: "POST",
          headers,
          body: JSON.stringify({
            sessionId: state.sessionId,
            message: text
          })
        });

        if (!res.ok) {
          const raw = await res.text();
          appendBubble("kim", "Chat failed (" + res.status + "): " + raw.slice(0, 140));
          return;
        }

        const payload = await res.json();
        appendBubble("kim", payload.reply || "No reply.");

        if (payload.tool && payload.tool.name) {
          const detail = payload.tool.detail ? " (" + payload.tool.detail + ")" : "";
          appendBubble("kim", "Tool " + payload.tool.name + ": " + payload.tool.status + detail);
        }
      } catch {
        appendBubble("kim", "Network error while contacting API.");
      }
    });

    connectBtn.addEventListener("click", () => {
      void connect();
    });

    (function bootstrap() {
      const existingUser = localStorage.getItem("kim_user_id");
      state.userId = existingUser && existingUser.trim().length > 0 ? existingUser : "web_" + randomId();
      localStorage.setItem("kim_user_id", state.userId);

      const token = localStorage.getItem("kim_api_token");
      if (token && token.trim().length > 0) {
        state.token = token.trim();
        apiTokenInput.value = state.token;
        void connect();
      }
    })();
  </script>
</body>
</html>`
    );
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

  if (req.method === "GET" && req.url === "/v1/integrations/health") {
    if (!ensureAuthorized(req, config.authToken)) {
      json(res, 401, { error: "unauthorized", requestId });
      return;
    }

    json(res, 200, {
      ok: true,
      requestId,
      integrations: {
        vapiConfigured: Boolean(config.vapiClient?.isConfigured()),
        elevenLabsConfigured: Boolean(config.elevenLabsClient?.isConfigured()),
        openAiConfigured: Boolean(process.env.OPENAI_API_KEY?.trim())
      }
    });
    return;
  }

  if (req.method === "GET" && req.url === "/v1/tools") {
    if (!ensureAuthorized(req, config.authToken)) {
      json(res, 401, { error: "unauthorized", requestId });
      return;
    }

    const mcpTools = await config.mcpClient.listTools();
    const allowedTools = config.mcpPolicy?.getAllowedTools() ?? [];

    json(res, 200, {
      ok: true,
      requestId,
      tools: {
        allowedTools,
        mcpTools: mcpTools.tools ?? [],
        mcpToolsError: mcpTools.success ? undefined : mcpTools.error
      }
    });
    return;
  }

  if (req.method === "POST" && req.url === "/v1/tools/invoke") {
    if (!ensureAuthorized(req, config.authToken)) {
      json(res, 401, { error: "unauthorized", requestId });
      return;
    }

    try {
      const body = parseJson(await readRawBody(req));
      if (!isRecord(body)) {
        json(res, 400, { error: "invalid_payload", requestId });
        return;
      }

      const payload = readToolInvokeRequest(body);
      if (!payload) {
        json(res, 400, { error: "invalid_tool_payload", requestId });
        return;
      }

      const result = await config.agent.executeTool({
        requestedTool: {
          name: payload.toolName,
          input: payload.toolInput,
          sensitive: payload.sensitive
        },
        grantedTools: readStringArray(body, "grantedTools"),
        permissionGrants: readPermissionGrants(body),
        revokedTools: readRevokedTools(body),
        confirmationProvided: readConfirmationProvided(body)
      });

      json(res, 200, {
        ok: true,
        requestId,
        tool: result
      });
      return;
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown_error";
      log("error", "tool_invoke_request_failed", { requestId, reason });
      json(res, 500, { error: "internal_error", requestId });
      return;
    }
  }

  if (req.method === "POST" && req.url === "/v1/vapi/calls") {
    if (!ensureAuthorized(req, config.authToken)) {
      json(res, 401, { error: "unauthorized", requestId });
      return;
    }

    if (!config.vapiClient || !config.vapiClient.isConfigured()) {
      json(res, 503, { error: "vapi_not_configured", requestId });
      return;
    }

    try {
      const body = parseJson(await readRawBody(req));
      if (!isRecord(body)) {
        json(res, 400, { error: "invalid_payload", requestId });
        return;
      }

      const payload = readVapiCallRequest(body);
      if (!payload) {
        json(res, 400, { error: "invalid_vapi_call_payload", requestId });
        return;
      }

      const result = await config.vapiClient.createCall(payload);
      if (!result.success) {
        json(res, 502, { error: "vapi_call_failed", detail: result.error, requestId, status: result.status });
        return;
      }

      json(res, 200, { ok: true, requestId, provider: "vapi", call: result.data });
      return;
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown_error";
      log("error", "vapi_call_proxy_failed", { requestId, reason });
      json(res, 500, { error: "internal_error", requestId });
      return;
    }
  }

  if (req.method === "POST" && req.url === "/v1/voice/synthesize") {
    if (!ensureAuthorized(req, config.authToken)) {
      json(res, 401, { error: "unauthorized", requestId });
      return;
    }

    if (!config.elevenLabsClient || !config.elevenLabsClient.isConfigured()) {
      json(res, 503, { error: "elevenlabs_not_configured", requestId });
      return;
    }

    try {
      const body = parseJson(await readRawBody(req));
      if (!isRecord(body)) {
        json(res, 400, { error: "invalid_payload", requestId });
        return;
      }

      const payload = readSynthesisRequest(body);
      if (!payload) {
        json(res, 400, { error: "invalid_synthesis_payload", requestId });
        return;
      }

      const result = await config.elevenLabsClient.synthesize(payload);
      if (!result.success || !result.data) {
        json(res, 502, { error: "synthesis_failed", detail: result.error, requestId, status: result.status });
        return;
      }

      json(res, 200, {
        ok: true,
        requestId,
        provider: "elevenlabs",
        audioBase64: result.data.audioBase64,
        mimeType: result.data.mimeType,
        voiceId: result.data.voiceId,
        modelId: result.data.modelId
      });
      return;
    } catch (error) {
      const reason = error instanceof Error ? error.message : "unknown_error";
      log("error", "voice_synthesis_failed", { requestId, reason });
      json(res, 500, { error: "internal_error", requestId });
      return;
    }
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
}

export function startServer(config: ServerConfig): Server {
  const server = createServer((req, res) => {
    void handleRequest(req, res, config);
  });

  server.listen(config.port);
  return server;
}
