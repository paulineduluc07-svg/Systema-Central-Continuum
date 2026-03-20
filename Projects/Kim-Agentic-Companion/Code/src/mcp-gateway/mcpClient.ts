import { CalendarCreateEventInput } from "../shared/types.js";
import { McpInvokeRequest, McpInvokeResult } from "./types.js";

interface HttpResult {
  ok: boolean;
  status: number;
  data?: unknown;
  error?: string;
}

export class McpClient {
  constructor(private readonly baseUrl: string) {}

  async invoke(request: McpInvokeRequest): Promise<McpInvokeResult> {
    if (!this.baseUrl) {
      return {
        success: false,
        error: "mcp_server_not_configured"
      };
    }

    const result = await this.postJson("/invoke", {
      toolName: request.toolName,
      input: request.input
    });

    if (!result.ok) {
      return {
        success: false,
        error: result.error
      };
    }

    return {
      success: true,
      data: result.data
    };
  }

  async createCalendarEvent(input: CalendarCreateEventInput): Promise<McpInvokeResult> {
    if (!this.baseUrl) {
      return {
        success: false,
        error: "mcp_server_not_configured"
      };
    }

    const direct = await this.postJson("/calendar/create-event", input);
    if (direct.ok) {
      return {
        success: true,
        data: direct.data
      };
    }

    if (direct.status === 404) {
      return this.invoke({
        toolName: "calendar.create_event",
        input
      });
    }

    return {
      success: false,
      error: direct.error
    };
  }

  private async postJson(path: string, payload: unknown): Promise<HttpResult> {
    const endpoint = `${this.baseUrl.replace(/\/$/, "")}${path}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const body = await response.text();
      const parsed = body.length > 0 ? this.tryParseJson(body) : undefined;

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: `mcp_http_${response.status}`,
          data: parsed
        };
      }

      return {
        ok: true,
        status: response.status,
        data: parsed
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : "mcp_network_error";
      return {
        ok: false,
        status: 0,
        error: reason
      };
    }
  }

  private tryParseJson(text: string): unknown {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }
}