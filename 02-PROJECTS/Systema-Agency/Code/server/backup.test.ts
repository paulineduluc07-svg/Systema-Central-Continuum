import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { BACKUP_SCHEMA_VERSION } from "@shared/const";
import * as db from "./db";

vi.mock("./db", () => ({
  getAllTasksByUser: vi.fn().mockResolvedValue([
    { tabId: "tableau-blanc", title: "T1", completed: false, sortOrder: 0 },
  ]),
  getAllNotesByUser: vi.fn().mockResolvedValue([
    { tabId: "tableau-blanc", content: "N1", sortOrder: 0 },
  ]),
  getPromptVaultData: vi.fn().mockResolvedValue({
    data: JSON.stringify({ list: [], cats: [], favs: [], brightness: 70 }),
  }),
  replaceTasksByUser: vi.fn().mockResolvedValue(undefined),
  replaceNotesByUser: vi.fn().mockResolvedValue(undefined),
  upsertPromptVaultData: vi.fn().mockResolvedValue(undefined),
  deletePromptVaultData: vi.fn().mockResolvedValue(undefined),
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

describe("backup router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exports a unified payload", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    const result = await caller.backup.export();

    expect(result.version).toBe(BACKUP_SCHEMA_VERSION);
    expect(result.data.tasks).toHaveLength(1);
    expect(result.data.notes).toHaveLength(1);
    expect(result.data.promptVault).toEqual({ list: [], cats: [], favs: [], brightness: 70 });
  });

  it("imports a unified payload", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    const payload = {
      version: BACKUP_SCHEMA_VERSION,
      data: {
        tasks: [{ tabId: "tableau-blanc", title: "T2", completed: true, sortOrder: 0 }],
        notes: [{ tabId: "tableau-blanc", content: "N2", sortOrder: 0 }],
        promptVault: { list: [], cats: [], favs: [], brightness: 55 },
      },
    };

    const result = await caller.backup.import(payload);
    expect(result).toEqual({ success: true });
    expect(db.replaceTasksByUser).toHaveBeenCalledTimes(1);
    expect(db.replaceNotesByUser).toHaveBeenCalledTimes(1);
    expect(db.upsertPromptVaultData).toHaveBeenCalledTimes(1);
  });

  it("rejects an unsupported backup version", async () => {
    const caller = appRouter.createCaller(createAuthContext());

    await expect(
      caller.backup.import({
        version: BACKUP_SCHEMA_VERSION + 1,
        data: {
          tasks: [],
          notes: [],
          promptVault: null,
        },
      }),
    ).rejects.toMatchObject({
      message: `Version de sauvegarde non supportee (${BACKUP_SCHEMA_VERSION + 1}). Version attendue: ${BACKUP_SCHEMA_VERSION}.`,
    });
  });
});
