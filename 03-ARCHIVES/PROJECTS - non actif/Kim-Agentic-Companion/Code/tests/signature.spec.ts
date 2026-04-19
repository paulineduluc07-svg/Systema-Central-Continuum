import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { isValidHmacSha256 } from "../src/shared/signature.js";

describe("isValidHmacSha256", () => {
  it("accepts valid hex signature", () => {
    const body = JSON.stringify({ hello: "world" });
    const secret = "secret_123";
    const signature = createHmac("sha256", secret).update(body, "utf8").digest("hex");

    const ok = isValidHmacSha256(body, signature, secret);
    expect(ok).toBe(true);
  });

  it("rejects invalid signature", () => {
    const body = JSON.stringify({ hello: "world" });
    const ok = isValidHmacSha256(body, "bad-signature", "secret_123");
    expect(ok).toBe(false);
  });
});