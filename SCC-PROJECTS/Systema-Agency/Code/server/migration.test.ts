import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getAllTasksByUser: vi.fn().mockResolvedValue([]),
  getAllNotesByUser: vi.fn().mockResolvedValue([]),
  createTask: vi.fn().mockResolvedValue({ id: 1 }),
  createNote: vi.fn().mockResolvedValue({ id: 1 }),
  getUserPreferences: vi.fn().mockResolvedValue(null),
  upsertUserPreferences: vi.fn().mockResolvedValue(undefined),
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

describe("migration router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("checks if user has cloud data", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.migration.hasCloudData();

    expect(result).toHaveProperty("hasTasks");
    expect(result).toHaveProperty("hasNotes");
    expect(result).toHaveProperty("hasData");
    expect(result.hasData).toBe(false);
  });

  it("imports tasks in bulk", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.migration.importTasks({
      tasks: [
        { tabId: "missions", title: "Task 1", completed: false, sortOrder: 0 },
        { tabId: "missions", title: "Task 2", completed: true, sortOrder: 1 },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.imported).toBe(2);
  });

  it("imports notes in bulk", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.migration.importNotes({
      notes: [
        { tabId: "missions", content: "Note 1", sortOrder: 0 },
        { tabId: "inventory", content: "Note 2", sortOrder: 0 },
      ],
    });

    expect(result.success).toBe(true);
    expect(result.imported).toBe(2);
  });

  it("imports preferences", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.migration.importPreferences({
      darkMode: true,
      widgetOrder: JSON.stringify({ missions: ["notes", "tasks"] }),
    });

    expect(result.success).toBe(true);
  });
});
