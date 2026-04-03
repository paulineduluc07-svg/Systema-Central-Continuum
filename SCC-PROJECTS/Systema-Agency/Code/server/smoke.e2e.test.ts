import { COOKIE_NAME } from "@shared/const";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

type MockUser = {
  id: number;
  openId: string;
  email: string | null;
  name: string | null;
  loginMethod: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
};

type MockNote = {
  id: number;
  userId: number;
  tabId: string;
  content: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

type MockSuiviEntry = {
  id: number;
  userId: number;
  timestamp: Date;
  date: string;
  prise: string;
  dose: number;
  reasons: string;
  note: string;
  createdAt: Date;
};

const hoisted = vi.hoisted(() => ({
  usersByOpenId: new Map<string, MockUser>(),
  notesStore: [] as MockNote[],
  suiviStore: [] as MockSuiviEntry[],
  sdkVerifyCredentials: vi.fn(),
  sdkCreateSessionToken: vi.fn(),
}));

vi.mock("./_core/env", () => ({
  ENV: {
    appId: "systema-agency",
    cookieSecret: "test-secret",
    databaseUrl: "",
    ownerEmail: "owner@example.com",
    ownerPassword: "owner-password",
    isProduction: false,
  },
}));

vi.mock("./_core/sdk", () => ({
  sdk: {
    verifyCredentials: hoisted.sdkVerifyCredentials,
    createSessionToken: hoisted.sdkCreateSessionToken,
  },
}));

vi.mock("./db", () => ({
  getUserByOpenId: vi.fn(async (openId: string) => hoisted.usersByOpenId.get(openId)),
  upsertUser: vi.fn(async (input: { openId: string; email?: string; loginMethod?: string; name?: string; lastSignedIn?: Date }) => {
    const existing = hoisted.usersByOpenId.get(input.openId);
    if (existing) {
      const updated: MockUser = {
        ...existing,
        email: input.email ?? existing.email,
        loginMethod: input.loginMethod ?? existing.loginMethod,
        name: input.name ?? existing.name,
        updatedAt: new Date(),
        lastSignedIn: input.lastSignedIn ?? new Date(),
      };
      hoisted.usersByOpenId.set(input.openId, updated);
      return;
    }

    hoisted.usersByOpenId.set(input.openId, {
      id: 1,
      openId: input.openId,
      email: input.email ?? null,
      name: input.name ?? null,
      loginMethod: input.loginMethod ?? null,
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: input.lastSignedIn ?? new Date(),
    });
  }),
  createNote: vi.fn(async (note: Omit<MockNote, "id" | "createdAt" | "updatedAt">) => {
    const created: MockNote = {
      ...note,
      id: hoisted.notesStore.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    hoisted.notesStore.push(created);
    return created;
  }),
  getNotesByUserAndTab: vi.fn(async (userId: number, tabId: string) => {
    return hoisted.notesStore
      .filter((note) => note.userId === userId && note.tabId === tabId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }),
  createSuiviEntry: vi.fn(async (entry: Omit<MockSuiviEntry, "id" | "createdAt">) => {
    const created: MockSuiviEntry = {
      ...entry,
      id: hoisted.suiviStore.length + 1,
      createdAt: new Date(),
    };
    hoisted.suiviStore.push(created);
    return created;
  }),
  getSuiviEntriesByUser: vi.fn(async (userId: number) => {
    return hoisted.suiviStore
      .filter((entry) => entry.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }),
}));

import { appRouter } from "./routers";

function createPublicContext(cookieSpy: ReturnType<typeof vi.fn>): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: cookieSpy,
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAuthenticatedContext(user: MockUser): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
      cookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("smoke e2e flow", () => {
  beforeEach(() => {
    hoisted.usersByOpenId.clear();
    hoisted.notesStore.length = 0;
    hoisted.suiviStore.length = 0;
    vi.clearAllMocks();
    hoisted.sdkVerifyCredentials.mockReturnValue(true);
    hoisted.sdkCreateSessionToken.mockResolvedValue("session-token");
  });

  it("runs login -> notes -> suivi happy path", async () => {
    const cookieSpy = vi.fn();
    const publicCaller = appRouter.createCaller(createPublicContext(cookieSpy));

    const login = await publicCaller.auth.login({
      email: "owner@example.com",
      password: "owner-password",
    });

    expect(login.success).toBe(true);
    expect(hoisted.sdkVerifyCredentials).toHaveBeenCalledWith("owner@example.com", "owner-password");
    expect(hoisted.sdkCreateSessionToken).toHaveBeenCalled();
    expect(cookieSpy).toHaveBeenCalledWith(
      COOKIE_NAME,
      "session-token",
      expect.objectContaining({ httpOnly: true }),
    );

    const user = hoisted.usersByOpenId.get("owner@example.com");
    expect(user).toBeDefined();

    const authedCaller = appRouter.createCaller(createAuthenticatedContext(user!));

    const createdNote = await authedCaller.notes.create({
      tabId: "tableau-blanc",
      content: "Smoke note",
      sortOrder: 0,
    });
    expect(createdNote.content).toBe("Smoke note");

    const notes = await authedCaller.notes.list({ tabId: "tableau-blanc" });
    expect(notes).toHaveLength(1);
    expect(notes[0].content).toBe("Smoke note");

    const timestamp = new Date("2026-03-31T12:00:00.000Z").toISOString();
    const suiviAdd = await authedCaller.suivi.add({
      timestamp,
      date: "2026-03-31",
      prise: "12:00",
      dose: 18,
      reasons: ["focus"],
      note: "smoke",
    });
    expect(suiviAdd.id).toBe(1);

    const suivi = await authedCaller.suivi.list();
    expect(suivi).toHaveLength(1);
    expect(suivi[0]).toMatchObject({
      id: 1,
      date: "2026-03-31",
      prise: "12:00",
      dose: 18,
      reasons: ["focus"],
      note: "smoke",
    });
  });
});
