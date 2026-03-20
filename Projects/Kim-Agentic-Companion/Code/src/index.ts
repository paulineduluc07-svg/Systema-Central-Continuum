import { KimAgent } from "./agent-core/kimAgent.js";
import { InMemoryMemoryStore } from "./agent-core/memoryStore.js";
import { InMemorySessionStore } from "./agent-core/sessionStore.js";
import { McpClient } from "./mcp-gateway/mcpClient.js";
import { McpPolicy } from "./mcp-gateway/mcpPolicy.js";
import { startServer } from "./api/server.js";
import { log } from "./shared/logger.js";

const port = Number(process.env.PORT ?? 8080);
const memory = new InMemoryMemoryStore();
const sessions = new InMemorySessionStore();
const mcpPolicy = new McpPolicy({
  allowedToolsCsv: process.env.MCP_ALLOWED_TOOLS,
  requireConfirmationByDefault: process.env.MCP_REQUIRE_CONFIRMATION
});
const mcpClient = new McpClient(process.env.MCP_SERVER_BASE_URL ?? "");
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
  authConfigured: Boolean(process.env.API_AUTH_TOKEN),
  vapiSignatureConfigured: Boolean(process.env.VAPI_WEBHOOK_SECRET)
});