import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getDb: vi.fn(),
  getUserByOpenId: vi.fn(),
  upsertUser: vi.fn(),
  getCustomTabsByUser: vi.fn().mockResolvedValue([
    {
      id: 1,
      userId: 1,
      tabId: "custom-123",
      label: "Mon Canvas",
      color: "#FF69B4",
      icon: "pen-tool",
      tabType: "whiteboard",
      sortOrder: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  createCustomTab: vi.fn().mockResolvedValue({
    id: 2,
    userId: 1,
    tabId: "custom-456",
    label: "Nouveau Tab",
    color: "#00FF00",
    icon: "layout",
    tabType: "widgets",
    sortOrder: 1,
  }),
  updateCustomTab: vi.fn().mockResolvedValue(true),
  deleteCustomTab: vi.fn().mockResolvedValue(true),
  getCanvasData: vi.fn().mockResolvedValue(null),
  saveCanvasData: vi.fn().mockResolvedValue(true),
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

describe("customTabs router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists custom tabs for authenticated user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.customTabs.list();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 1,
      tabId: "custom-123",
      label: "Mon Canvas",
      tabType: "whiteboard",
    });
  });

  it("creates a new custom tab", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.customTabs.create({
      tabId: "custom-456",
      label: "Nouveau Tab",
      color: "#00FF00",
      icon: "layout",
      tabType: "widgets",
      sortOrder: 1,
    });

    expect(result).toMatchObject({
      id: 2,
      tabId: "custom-456",
      label: "Nouveau Tab",
    });
  });
});

describe("canvas router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null for non-existent canvas data", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.canvas.get({ tabId: "test-tab" });

    expect(result).toBeNull();
  });

  it("saves canvas data successfully", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.canvas.save({
      tabId: "test-tab",
      data: '{"shapes": []}',
    });

    expect(result).toEqual({ success: true });
  });
});
