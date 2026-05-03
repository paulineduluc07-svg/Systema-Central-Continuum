import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

vi.mock("./db", () => ({
  getAgendaWeekData: vi.fn().mockResolvedValue(null),
  upsertAgendaWeekData: vi.fn().mockResolvedValue(undefined),
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

describe("agenda router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no agenda week exists", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    const result = await caller.agenda.get({ weekStart: "2026-09-01" });

    expect(result).toBeNull();
    expect(db.getAgendaWeekData).toHaveBeenCalledWith(1, "2026-09-01");
  });

  it("saves a valid agenda week payload", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const data = JSON.stringify({ weekLabel: "1er - 7 sept.", events: {} });

    const result = await caller.agenda.save({ weekStart: "2026-09-01", data });

    expect(result).toEqual({ success: true });
    expect(db.upsertAgendaWeekData).toHaveBeenCalledWith(1, "2026-09-01", data);
  });

  it("rejects invalid week dates and invalid JSON", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    await expect(caller.agenda.get({ weekStart: "2026/09/01" })).rejects.toThrow();
    await expect(caller.agenda.save({ weekStart: "2026-09-01", data: "nope" })).rejects.toThrow();
    expect(db.upsertAgendaWeekData).not.toHaveBeenCalled();
  });
});
