import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { createHmac, timingSafeEqual } from "crypto";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

// ── Types ────────────────────────────────────────────────────────────────────

export type SessionPayload = {
  openId: string;
  appId: string;
  name: string;
};

// ── SDK ───────────────────────────────────────────────────────────────────────

class SDKServer {
  // ── Private helpers ────────────────────────────────────────────────────────

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) return new Map<string, string>();
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  private getSessionSecret() {
    return new TextEncoder().encode(ENV.cookieSecret || "fallback-dev-secret");
  }

  private hmac(value: string): Buffer {
    const key = Buffer.from(ENV.cookieSecret || "fallback-dev-secret");
    return createHmac("sha256", key).update(value).digest();
  }

  // ── Credentials verification ───────────────────────────────────────────────

  /**
   * Timing-safe comparison of provided credentials against OWNER_EMAIL / OWNER_PASSWORD env vars.
   * No external dependency — uses Node.js built-in crypto.
   */
  verifyCredentials(email: string, password: string): boolean {
    if (!ENV.ownerEmail || !ENV.ownerPassword) {
      console.error("[Auth] OWNER_EMAIL or OWNER_PASSWORD not configured");
      return false;
    }

    const emailMatch = timingSafeEqual(
      this.hmac(email.toLowerCase().trim()),
      this.hmac(ENV.ownerEmail.toLowerCase().trim())
    );

    const passwordMatch = timingSafeEqual(
      this.hmac(password),
      this.hmac(ENV.ownerPassword)
    );

    return emailMatch && passwordMatch;
  }

  // ── Session management ────────────────────────────────────────────────────

  async createSessionToken(
    openId: string,
    options: { expiresInMs?: number; name?: string } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({
      openId,
      appId: ENV.appId,
      name: options.name ?? "",
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<{ openId: string; appId: string; name: string } | null> {
    if (!cookieValue) return null;

    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { openId, appId, name } = payload as Record<string, unknown>;

      if (
        typeof openId !== "string" || !openId ||
        typeof appId !== "string" || !appId ||
        typeof name !== "string"
      ) {
        return null;
      }

      return { openId, appId, name };
    } catch {
      return null;
    }
  }

  // ── Request authentication ────────────────────────────────────────────────

  async authenticateRequest(req: Request): Promise<User> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw new Error("Invalid session");
    }

    let user = await db.getUserByOpenId(session.openId);

    if (!user) {
      throw new Error("User not found");
    }

    await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
    return user;
  }
}

export const sdk = new SDKServer();
