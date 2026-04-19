interface HttpResult {
  ok: boolean;
  status: number;
  audioBase64?: string;
  mimeType?: string;
  error?: string;
}

export interface ElevenLabsClientConfig {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
  defaultVoiceId?: string;
  defaultModelId?: string;
}

export interface ElevenLabsSynthesisRequest {
  text: string;
  voiceId?: string;
  modelId?: string;
  outputFormat?: string;
}

export interface ElevenLabsSynthesisResult {
  success: boolean;
  error?: string;
  status?: number;
  data?: {
    audioBase64: string;
    mimeType: string;
    voiceId: string;
    modelId?: string;
  };
}

export class ElevenLabsClient {
  private readonly apiKey?: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly defaultVoiceId?: string;
  private readonly defaultModelId?: string;

  constructor(config: ElevenLabsClientConfig) {
    this.apiKey = config.apiKey?.trim() || undefined;
    this.baseUrl = (config.baseUrl ?? "https://api.elevenlabs.io").trim().replace(/\/$/, "");

    const parsedTimeout = Number(config.timeoutMs ?? 15000);
    this.timeoutMs = Number.isFinite(parsedTimeout) && parsedTimeout > 0 ? parsedTimeout : 15000;

    this.defaultVoiceId = config.defaultVoiceId?.trim() || undefined;
    this.defaultModelId = config.defaultModelId?.trim() || undefined;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async synthesize(request: ElevenLabsSynthesisRequest): Promise<ElevenLabsSynthesisResult> {
    if (!this.apiKey) {
      return {
        success: false,
        error: "elevenlabs_not_configured"
      };
    }

    const text = request.text.trim();
    if (text.length === 0) {
      return {
        success: false,
        error: "invalid_text"
      };
    }

    const voiceId = request.voiceId?.trim() || this.defaultVoiceId;
    if (!voiceId) {
      return {
        success: false,
        error: "missing_voice_id"
      };
    }

    const modelId = request.modelId?.trim() || this.defaultModelId;
    const outputFormat = request.outputFormat?.trim() || "mp3_44100_128";

    const result = await this.postAudio(voiceId, {
      text,
      model_id: modelId,
      output_format: outputFormat
    });

    if (!result.ok || !result.audioBase64 || !result.mimeType) {
      return {
        success: false,
        error: result.error,
        status: result.status
      };
    }

    return {
      success: true,
      data: {
        audioBase64: result.audioBase64,
        mimeType: result.mimeType,
        voiceId,
        modelId
      }
    };
  }

  private async postAudio(
    voiceId: string,
    payload: { text: string; model_id?: string; output_format: string }
  ): Promise<HttpResult> {
    const query = new URLSearchParams({ output_format: payload.output_format }).toString();
    const endpoint = `${this.baseUrl}/v1/text-to-speech/${encodeURIComponent(voiceId)}?${query}`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "xi-api-key": this.apiKey!,
          "content-type": "application/json",
          accept: "audio/mpeg"
        },
        body: JSON.stringify({
          text: payload.text,
          model_id: payload.model_id
        }),
        signal: AbortSignal.timeout(this.timeoutMs)
      });

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          error: `elevenlabs_http_${response.status}`
        };
      }

      const mimeType = response.headers.get("content-type") ?? "audio/mpeg";
      const audio = Buffer.from(await response.arrayBuffer()).toString("base64");

      return {
        ok: true,
        status: response.status,
        audioBase64: audio,
        mimeType
      };
    } catch (error) {
      if (error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError")) {
        return {
          ok: false,
          status: 0,
          error: "elevenlabs_timeout"
        };
      }

      const reason = error instanceof Error ? error.message : "elevenlabs_network_error";
      return {
        ok: false,
        status: 0,
        error: reason
      };
    }
  }
}
