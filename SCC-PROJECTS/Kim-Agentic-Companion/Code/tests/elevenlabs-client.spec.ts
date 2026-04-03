import { afterEach, describe, expect, it, vi } from "vitest";
import { ElevenLabsClient } from "../src/integrations/elevenLabsClient.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("ElevenLabsClient", () => {
  it("returns not configured without api key", async () => {
    const client = new ElevenLabsClient({});
    const result = await client.synthesize({
      text: "bonjour",
      voiceId: "voice_1"
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("elevenlabs_not_configured");
  });

  it("returns base64 audio when synthesis succeeds", async () => {
    const fetchMock = vi.fn(async (_url: unknown, _init?: RequestInit) => {
      const payload = Buffer.from("audio-bytes", "utf8");
      return new Response(payload, {
        status: 200,
        headers: { "content-type": "audio/mpeg" }
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const client = new ElevenLabsClient({
      apiKey: "eleven_key_test",
      defaultVoiceId: "voice_default",
      timeoutMs: 5000
    });

    const result = await client.synthesize({
      text: "bonjour depuis kim"
    });

    expect(result.success).toBe(true);
    expect(result.data?.audioBase64).toBe(Buffer.from("audio-bytes", "utf8").toString("base64"));
    expect(result.data?.voiceId).toBe("voice_default");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
