import { McpInvokeRequest, McpInvokeResult } from "./types.js";

export class McpClient {
  constructor(private readonly baseUrl: string) {}

  async invoke(request: McpInvokeRequest): Promise<McpInvokeResult> {
    if (!this.baseUrl) {
      return {
        success: false,
        error: "mcp_server_not_configured"
      };
    }

    const endpoint = `${this.baseUrl.replace(/\/$/, "")}/invoke`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          toolName: request.toolName,
          input: request.input
        })
      });

      if (!response.ok) {
        return {
          success: false,
          error: `mcp_http_${response.status}`
        };
      }

      const payload = (await response.json()) as unknown;
      return {
        success: true,
        data: payload
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "mcp_network_error";
      return {
        success: false,
        error: reason
      };
    }
  }
}