import type { IncomingMessage, ServerResponse } from "node:http";
import { KimAgent } from "../src/agent-core/kimAgent.js";
import { InMemoryMemoryStore } from "../src/agent-core/memoryStore.js";
import { InMemorySessionStore } from "../src/agent-core/sessionStore.js";
import { PersistentMemoryStore } from "../src/agent-core/persistentMemoryStore.js";
import { PersistentSessionStore } from "../src/agent-core/persistentSessionStore.js";
import { handleRequest, RequestHandlerConfig } from "../src/api/server.js";
import { McpClient } from "../src/mcp-gateway/mcpClient.js";
import { McpPolicy } from "../src/mcp-gateway/mcpPolicy.js";
import { ElevenLabsClient } from "../src/integrations/elevenLabsClient.js";
import { VapiClient } from "../src/integrations/vapiClient.js";
import { createPostgresPoolFromEnv, ensureKimSchema } from "../src/persistence/pg.js";
import { log } from "../src/shared/logger.js";

let runtimePromise: Promise<RequestHandlerConfig> | null = null;

async function buildRuntime(): Promise<RequestHandlerConfig> {
  let memory = new InMemoryMemoryStore();
  let sessions = new InMemorySessionStore();
  let persistenceMode: "memory" | "postgres_mirror" = "memory";

  try {
    const pool = await createPostgresPoolFromEnv();
    if (pool) {
      await ensureKimSchema(pool);
      memory = await PersistentMemoryStore.create(pool);
      sessions = await PersistentSessionStore.create(pool);
      persistenceMode = "postgres_mirror";
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown_error";
    log("warn", "postgres_init_failed_fallback_memory", { reason });
  }

  const mcpPolicy = new McpPolicy({
    allowedToolsCsv: process.env.MCP_ALLOWED_TOOLS,
    requireConfirmationByDefault: process.env.MCP_REQUIRE_CONFIRMATION
  });

  const mcpClient = new McpClient({
    baseUrl: process.env.MCP_SERVER_BASE_URL ?? "",
    apiKey: process.env.MCP_API_KEY,
    timeoutMs: Number(process.env.MCP_TIMEOUT_MS ?? 8000)
  });

  const vapiClient = new VapiClient({
    apiKey: process.env.VAPI_API_KEY,
    baseUrl: process.env.VAPI_BASE_URL,
    timeoutMs: Number(process.env.VAPI_TIMEOUT_MS ?? 10000)
  });

  const elevenLabsClient = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY ?? process.env.ELEVEN_LABS_API_KEY,
    baseUrl: process.env.ELEVENLABS_BASE_URL,
    timeoutMs: Number(process.env.ELEVENLABS_TIMEOUT_MS ?? 15000),
    defaultVoiceId: process.env.ELEVENLABS_VOICE_ID ?? process.env.ELEVEN_LABS_VOICE_ID,
    defaultModelId: process.env.ELEVENLABS_MODEL_ID ?? process.env.ELEVEN_LABS_MODEL_ID
  });

  const agent = new KimAgent(memory, mcpPolicy, mcpClient);

  log("info", "kim_serverless_runtime_ready", {
    persistenceMode,
    authConfigured: Boolean(process.env.API_AUTH_TOKEN),
    vapiSignatureConfigured: Boolean(process.env.VAPI_WEBHOOK_SECRET),
    vapiApiConfigured: Boolean(process.env.VAPI_API_KEY),
    mcpServerConfigured: Boolean(process.env.MCP_SERVER_BASE_URL),
    mcpApiKeyConfigured: Boolean(process.env.MCP_API_KEY),
    elevenLabsConfigured: Boolean(process.env.ELEVENLABS_API_KEY ?? process.env.ELEVEN_LABS_API_KEY)
  });

  return {
    agent,
    sessions,
    mcpClient,
    vapiClient,
    elevenLabsClient,
    authToken: process.env.API_AUTH_TOKEN,
    vapiWebhookSecret: process.env.VAPI_WEBHOOK_SECRET
  };
}

async function getRuntime(): Promise<RequestHandlerConfig> {
  if (!runtimePromise) {
    runtimePromise = buildRuntime();
  }

  return runtimePromise;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const runtime = await getRuntime();
  await handleRequest(req, res, runtime);
}
