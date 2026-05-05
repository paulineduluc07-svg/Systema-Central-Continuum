import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

vi.mock("./db", () => ({
  createSuiviEntry: vi.fn().mockResolvedValue({ id: 1 }),
  replaceSuiviEntries: vi.fn().mockResolvedValue(undefined),
  getSuiviEntriesByUser: vi.fn().mockResolvedValue([]),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "password",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("suivi router validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts valid suivi.add payload", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.suivi.add({
      timestamp: "2026-03-31T12:00:00.000Z",
      date: "2026-03-31",
      prise: "12:00",
      dose: 60,
      reasons: ["focus"],
      note: "ok",
    });

    expect(result).toEqual({ id: 1 });
    expect(db.createSuiviEntry).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid suivi.add time format", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.suivi.add({
        timestamp: "2026-03-31T12:00:00.000Z",
        date: "2026-03-31",
        prise: "midi",
        dose: 60,
        reasons: ["focus"],
        note: "invalid",
      }),
    ).rejects.toThrow();

    expect(db.createSuiviEntry).not.toHaveBeenCalled();
  });

  it("rejects suivi.replace payload above entry limit", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const entries = Array.from({ length: 2_001 }, () => ({
      timestamp: "2026-03-31T12:00:00.000Z",
      date: "2026-03-31",
      prise: "12:00",
      dose: 60,
      reasons: ["focus"],
      note: "",
    }));

    await expect(caller.suivi.replace({ entries })).rejects.toThrow();
    expect(db.replaceSuiviEntries).not.toHaveBeenCalled();
  });
});

