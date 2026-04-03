import { afterEach, describe, expect, it, vi } from "vitest";
import { VapiClient } from "../src/integrations/vapiClient.js";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

describe("VapiClient", () => {
  it("returns not configured without api key", async () => {
    const client = new VapiClient({});
    const result = await client.createCall({
      assistantId: "assistant_1",
      customer: { number: "+15145550123" }
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("vapi_not_configured");
  });

  it("creates call when api request succeeds", async () => {
    const fetchMock = vi.fn(async (_url: unknown, _init?: RequestInit) => {
      return new Response(JSON.stringify({ id: "call_1", status: "queued" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const client = new VapiClient({
      apiKey: "vapi_key_test",
      baseUrl: "https://api.vapi.ai",
      timeoutMs: 5000
    });

    const result = await client.createCall({
      assistantId: "assistant_1",
      customer: { number: "+15145550123" }
    });

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ id: "call_1", status: "queued" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
