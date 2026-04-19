import { config } from "@/lib/config";
import { getToken } from "@/lib/auth/token";
import type {
  ChatRequest,
  ChatResponse,
  SessionCreateRequest,
  SessionRecord,
  ToolsResponse,
  ToolInvokeRequest,
  ToolInvokeResponse,
  HealthResponse,
  VoiceSynthesisRequest,
  VoiceSynthesisResponse,
} from "./types";

class KimApiClient {
  private get baseUrl(): string {
    return config.apiUrl;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status}: ${text}`);
    }
    return res.json() as Promise<T>;
  }

  health(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  createSession(req: SessionCreateRequest): Promise<SessionRecord> {
    return this.request<SessionRecord>("/v1/sessions", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  chat(req: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>("/v1/chat", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  getTools(): Promise<ToolsResponse> {
    return this.request<ToolsResponse>("/v1/tools");
  }

  invokeToolDirect(req: ToolInvokeRequest): Promise<ToolInvokeResponse> {
    return this.request<ToolInvokeResponse>("/v1/tools/invoke", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }

  synthesizeVoice(req: VoiceSynthesisRequest): Promise<VoiceSynthesisResponse> {
    return this.request<VoiceSynthesisResponse>("/v1/voice/synthesize", {
      method: "POST",
      body: JSON.stringify(req),
    });
  }
}

export const kimApi = new KimApiClient();
