import { createHmac, timingSafeEqual } from "node:crypto";

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function normalizeCandidates(headerValue: string): string[] {
  return headerValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.replace(/^sha256=/i, ""));
}

export function isValidHmacSha256(rawBody: string, signatureHeader: string | undefined, secret: string | undefined): boolean {
  if (!secret) {
    return true;
  }

  if (!signatureHeader) {
    return false;
  }

  const candidates = normalizeCandidates(signatureHeader);
  if (candidates.length === 0) {
    return false;
  }

  const digestHex = createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const digestBase64 = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");

  return candidates.some((candidate) => safeEqual(candidate, digestHex) || safeEqual(candidate, digestBase64));
}