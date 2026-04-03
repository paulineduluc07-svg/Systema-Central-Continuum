import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getTasksByUserAndTab: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, tabId: "missions", title: "Test Task", completed: false, sortOrder: 0 },
  ]),
  getAllTasksByUser: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, tabId: "missions", title: "Test Task", completed: false, sortOrder: 0 },
  ]),
  createTask: vi.fn().mockResolvedValue({ id: 1, userId: 1, tabId: "missions", title: "New Task", completed: false, sortOrder: 0 }),
  updateTask: vi.fn().mockResolvedValue(undefined),
  deleteTask: vi.fn().mockResolvedValue(undefined),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
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

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("tasks router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists tasks for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tasks.list({ tabId: "missions" });

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Test Task");
  });

  it("creates a task for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tasks.create({
      tabId: "missions",
      title: "New Task",
    });

    expect(result.title).toBe("New Task");
  });

  it("updates a task for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tasks.update({
      id: 1,
      completed: true,
    });

    expect(result.success).toBe(true);
  });

  it("deletes a task for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tasks.delete({ id: 1 });

    expect(result.success).toBe(true);
  });

  it("rejects unauthenticated access to tasks.list", async () => {
    const ctx = createUnauthContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.tasks.list({ tabId: "missions" })).rejects.toThrow();
  });
});
