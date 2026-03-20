import { CalendarCreateEventInput } from "../shared/types.js";
import { McpInvokeRequest, McpInvokeResult } from "./types.js";

interface HttpResult {
  ok: boolean;
  status: number;
  data?: unknown;
  error?: string;
}

export interface McpClientConfig {
  baseUrl: string;
  apiKey?: string;
  timeoutMs?: number;
}

export class McpClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeoutMs: number;

  constructor(config: McpClientConfig) {
    this.baseUrl = config.baseUrl.trim();
    this.apiKey = config.apiKey?.trim() || undefined;

    const parsedTimeout = Number(config.timeoutMs ?? 8000);
    this.timeoutMs = Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 8000;
  }

  async health(): Promise<McpInvokeResult> {
    if (!this.baseUrl) {
      return {
        success: false,
        error: "mcp_server_not_configured"
      };
    }

    const result = await this.getJson("/health");
    if (!result.ok) {
      return {
        success: false,
        error: result.error
      };
    }

    return {
      success: true,
      data: result.data ?? { ok: true }
    };
  }

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

  private async getJson(path: string): Promise<HttpResult> {
    const endpoint = `${this.baseUrl.replace(/\/$/, "")}${path}`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: this.buildHeaders(),
        signal: AbortSignal.timeout(this.timeoutMs)
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
      if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
        return {
          ok: false,
          status: 0,
          error: "mcp_timeout"
        };
      }

      const reason = error instanceof Error ? error.message : "mcp_network_error";
      return {
        ok: false,
        status: 0,
        error: reason
      };
    }
  }

  private async postJson(path: string, payload: unknown): Promise<HttpResult> {
    const endpoint = `${this.baseUrl.replace(/\/$/, "")}${path}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: this.buildHeaders(),
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeoutMs)
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
      if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
        return {
          ok: false,
          status: 0,
          error: "mcp_timeout"
        };
      }

      const reason = error instanceof Error ? error.message : "mcp_network_error";
      return {
        ok: false,
        status: 0,
        error: reason
      };
    }
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "content-type": "application/json"
    };

    if (this.apiKey) {
      headers.authorization = `Bearer ${this.apiKey}`;
      headers["x-api-key"] = this.apiKey;
    }

    return headers;
  }

  private tryParseJson(text: string): unknown {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }
}