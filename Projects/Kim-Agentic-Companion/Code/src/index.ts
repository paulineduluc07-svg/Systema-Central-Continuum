import { KimAgent } from "./agent-core/kimAgent.js";
import { InMemoryMemoryStore } from "./agent-core/memoryStore.js";
import { InMemorySessionStore } from "./agent-core/sessionStore.js";
import { PersistentMemoryStore } from "./agent-core/persistentMemoryStore.js";
import { PersistentSessionStore } from "./agent-core/persistentSessionStore.js";
import { McpClient } from "./mcp-gateway/mcpClient.js";
import { McpPolicy } from "./mcp-gateway/mcpPolicy.js";
import { startServer } from "./api/server.js";
import { createPostgresPoolFromEnv, ensureKimSchema } from "./persistence/pg.js";
import { log } from "./shared/logger.js";

async function bootstrap(): Promise<void> {
  const port = Number(process.env.PORT ?? 8080);

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

  const agent = new KimAgent(memory, mcpPolicy, mcpClient);

  startServer({
    port,
    agent,
    sessions,
    authToken: process.env.API_AUTH_TOKEN,
    vapiWebhookSecret: process.env.VAPI_WEBHOOK_SECRET
  });

  log("info", "kim_api_started", {
    port,
    persistenceMode,
    authConfigured: Boolean(process.env.API_AUTH_TOKEN),
    vapiSignatureConfigured: Boolean(process.env.VAPI_WEBHOOK_SECRET),
    mcpServerConfigured: Boolean(process.env.MCP_SERVER_BASE_URL),
    mcpApiKeyConfigured: Boolean(process.env.MCP_API_KEY)
  });
}

void bootstrap();