import "dotenv/config";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createSystemaMcpServer } from "./systema-core.js";

async function main() {
  const server = createSystemaMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
