interface HttpResult {
  ok: boolean;
  status: number;
  data?: unknown;
  error?: string;
}

export interface VapiClientConfig {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
}

export interface VapiCallRequest {
  assistantId: string;
  customer: {
    number: string;
    name?: string;
  };
  phoneNumberId?: string;
  metadata?: Record<string, unknown>;
}

export interface VapiCallResult {
  success: boolean;
  data?: unknown;
  error?: string;
  status?: number;
}

export class VapiClient {
  private readonly apiKey?: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(config: VapiClientConfig) {
    this.apiKey = config.apiKey?.trim() || undefined;
    this.baseUrl = (config.baseUrl ?? "https://api.vapi.ai").trim().replace(/\/$/, "");

    const parsedTimeout = Number(config.timeoutMs ?? 10000);
    this.timeoutMs = Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 10000;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async createCall(request: VapiCallRequest): Promise<VapiCallResult> {
    if (!this.apiKey) {
      return {
        success: false,
        error: "vapi_not_configured"
      };
    }

    const result = await this.postJson("/call", request);
    if (!result.ok) {
      return {
        success: false,
        error: result.error,
        status: result.status
      };
    }

    return {
      success: true,
      data: result.data
    };
  }

  private async postJson(path: string, payload: unknown): Promise<HttpResult> {
    const endpoint = `${this.baseUrl}${path}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          authorization: `Bearer ${this.apiKey}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeoutMs)
      });

      const body = await response.text();
      const parsed = body.length > 0 ? this.tryParseJson(body) : undefined;

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: `vapi_http_${response.status}`,
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
          error: "vapi_timeout"
        };
      }

      const reason = error instanceof Error ? error.message : "vapi_network_error";
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
