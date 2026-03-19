import type { NextFunction, Request, Response } from "express";

type RateBucket = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
};

type GlobalRateState = typeof globalThis & {
  __systemaRateBuckets?: Map<string, RateBucket>;
};

const state = globalThis as GlobalRateState;
const buckets = state.__systemaRateBuckets ?? (state.__systemaRateBuckets = new Map<string, RateBucket>());

function nowMs() {
  return Date.now();
}

function pruneExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function getClientIp(req: { headers?: Record<string, unknown>; socket?: { remoteAddress?: string } }) {
  const forwardedFor = req.headers?.["x-forwarded-for"];

  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return String(forwardedFor[0]).split(",")[0].trim();
  }

  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket?.remoteAddress ?? "unknown";
}

export function consumeRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = nowMs();
  pruneExpired(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      resetInMs: windowMs,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(existing.resetAt - now, 0),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(limit - existing.count, 0),
    resetInMs: Math.max(existing.resetAt - now, 0),
  };
}

export function createApiRateLimitMiddleware(options: {
  keyPrefix: string;
  limit: number;
  windowMs: number;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIp(req);
    const result = consumeRateLimit(
      `${options.keyPrefix}:${ip}`,
      options.limit,
      options.windowMs
    );

    res.setHeader("X-RateLimit-Limit", String(options.limit));
    res.setHeader("X-RateLimit-Remaining", String(result.remaining));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(result.resetInMs / 1000)));

    if (!result.allowed) {
      res.status(429).json({
        error: "Too many requests",
        retryAfterSeconds: Math.ceil(result.resetInMs / 1000),
      });
      return;
    }

    next();
  };
}