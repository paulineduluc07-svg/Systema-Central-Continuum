import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type MockUser = {
  id: number;
  openId: string;
};

const now = new Date("2026-05-01T12:00:00.000Z");
const hoisted = vi.hoisted(() => ({
  usersByOpenId: new Map<string, MockUser>([["paw-openid", { id: 7, openId: "paw-openid" }]]),
  taskId: 0,
  noteId: 0,
  floatingNoteId: 0,
  tabId: 0,
}));

vi.mock("../db.js", () => ({
  getUserByOpenId: vi.fn(async (openId: string) => hoisted.usersByOpenId.get(openId)),
  createTask: vi.fn(async (task) => ({
    id: ++hoisted.taskId,
    ...task,
    createdAt: now,
    updatedAt: now,
  })),
  updateTask: vi.fn(async () => undefined),
  deleteTask: vi.fn(async () => undefined),
  getTasksByUserAndTab: vi.fn(async () => []),
  getAllTasksByUser: vi.fn(async () => []),
  createNote: vi.fn(async (note) => ({
    id: ++hoisted.noteId,
    ...note,
    createdAt: now,
    updatedAt: now,
  })),
  updateNote: vi.fn(async () => undefined),
  deleteNote: vi.fn(async () => undefined),
  getNotesByUserAndTab: vi.fn(async () => []),
  getAllNotesByUser: vi.fn(async () => []),
  createFloatingNote: vi.fn(async (note) => ({
    kind: "note",
    ...note,
    id: ++hoisted.floatingNoteId,
    archived: false,
    archivedAt: null,
    createdAt: now,
    updatedAt: now,
  })),
  updateFloatingNote: vi.fn(async () => undefined),
  archiveFloatingNote: vi.fn(async () => undefined),
  listActiveFloatingNotes: vi.fn(async () => []),
  listArchivedFloatingNotes: vi.fn(async () => []),
  createCustomTab: vi.fn(async (tab) => ({
    id: ++hoisted.tabId,
    ...tab,
    createdAt: now,
    updatedAt: now,
  })),
  updateCustomTabByTabId: vi.fn(async () => undefined),
  deleteCustomTabByTabId: vi.fn(async () => undefined),
  getCustomTabsByUser: vi.fn(async () => []),
}));

import * as db from "../db.js";
import { createSystemaMcpHttpApp } from "./http.js";
import { resetMcpUserCacheForTests } from "./auth.js";
import { createSystemaMcpServer, WRITE_TOOL_NAMES } from "./systema-core.js";

async function createMcpClient() {
  const server = createSystemaMcpServer();
  const client = new Client({ name: "systema-test-client", version: "1.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

  await server.connect(serverTransport);
  await client.connect(clientTransport);

  return {
    client,
    close: async () => {
      await client.close();
      await server.close();
    },
  };
}

async function withHttpServer<T>(callback: (baseUrl: string) => Promise<T>) {
  const app = createSystemaMcpHttpApp();
  const server = app.listen(0);

  try {
    await new Promise<void>((resolve) => server.once("listening", resolve));
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Unable to start test server.");
    }

    return await callback(`http://127.0.0.1:${address.port}/mcp`);
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

async function callHttpWrite(baseUrl: string, options?: { headerSecret?: string; querySecret?: string }) {
  const url = options?.querySecret ? `${baseUrl}?secret=${encodeURIComponent(options.querySecret)}` : baseUrl;
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  };
  if (options?.headerSecret) {
    headers["x-systema-mcp-secret"] = options.headerSecret;
  }

  return fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "create_task", arguments: { tabId: "today", title: "HTTP write" } },
    }),
  });
}

describe("Systema MCP write tools", () => {
  beforeEach(() => {
    process.env.SYSTEMA_MCP_USER_OPEN_ID = "paw-openid";
    process.env.SYSTEMA_MCP_SECRET = "test-secret";
    hoisted.taskId = 0;
    hoisted.noteId = 0;
    hoisted.floatingNoteId = 0;
    hoisted.tabId = 0;
    resetMcpUserCacheForTests();
    vi.clearAllMocks();
  });

  afterEach(() => {
    delete process.env.SYSTEMA_MCP_USER_OPEN_ID;
    delete process.env.SYSTEMA_MCP_SECRET;
  });

  it("lists the read and write tool surface", async () => {
    const { client, close } = await createMcpClient();

    try {
      const result = await client.listTools();
      const toolNames = result.tools.map((tool) => tool.name);

      expect(toolNames).toEqual(expect.arrayContaining(["list_project_docs", "read_project_doc", "search_project_docs"]));
      expect(toolNames).toEqual(expect.arrayContaining([...WRITE_TOOL_NAMES, "list_tasks", "list_notes", "list_floating_notes", "list_tabs"]));
    } finally {
      await close();
    }
  });

  it("runs DB writes as the configured MCP user", async () => {
    const { client, close } = await createMcpClient();

    try {
      const createdTask = await client.callTool({
        name: "create_task",
        arguments: { tabId: "today", title: "MCP task" },
      });
      expect(createdTask.structuredContent).toMatchObject({
        task: { id: 1, tabId: "today", title: "MCP task", completed: false },
      });
      expect(db.createTask).toHaveBeenCalledWith(expect.objectContaining({ userId: 7 }));

      await client.callTool({ name: "update_task", arguments: { id: 1, title: "Updated" } });
      await client.callTool({ name: "complete_task", arguments: { id: 1 } });
      await client.callTool({ name: "delete_task", arguments: { id: 1 } });
      expect(db.updateTask).toHaveBeenCalledWith(1, 7, expect.objectContaining({ title: "Updated" }));
      expect(db.updateTask).toHaveBeenCalledWith(1, 7, { completed: true });
      expect(db.deleteTask).toHaveBeenCalledWith(1, 7);

      await client.callTool({ name: "create_note", arguments: { tabId: "today", content: "MCP note" } });
      await client.callTool({ name: "update_note", arguments: { id: 1, content: "Updated note" } });
      await client.callTool({ name: "delete_note", arguments: { id: 1 } });
      expect(db.createNote).toHaveBeenCalledWith(expect.objectContaining({ userId: 7, content: "MCP note" }));
      expect(db.updateNote).toHaveBeenCalledWith(1, 7, expect.objectContaining({ content: "Updated note" }));
      expect(db.deleteNote).toHaveBeenCalledWith(1, 7);

      await client.callTool({
        name: "create_floating_note",
        arguments: { kind: "task", title: "Float", body: "Body", x: 10, y: 20, w: 240, h: 220 },
      });
      await client.callTool({ name: "update_floating_note", arguments: { id: 1, title: "Float updated" } });
      await client.callTool({ name: "archive_floating_note", arguments: { id: 1 } });
      expect(db.createFloatingNote).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 7, kind: "task", title: "Float" }),
      );
      expect(db.updateFloatingNote).toHaveBeenCalledWith(1, 7, expect.objectContaining({ title: "Float updated" }));
      expect(db.archiveFloatingNote).toHaveBeenCalledWith(1, 7);

      await client.callTool({ name: "create_tab", arguments: { tabId: "mcp-tab", label: "MCP" } });
      await client.callTool({ name: "update_tab", arguments: { tabId: "mcp-tab", label: "MCP updated" } });
      await client.callTool({ name: "delete_tab", arguments: { tabId: "mcp-tab" } });
      expect(db.createCustomTab).toHaveBeenCalledWith(expect.objectContaining({ userId: 7, tabId: "mcp-tab" }));
      expect(db.updateCustomTabByTabId).toHaveBeenCalledWith("mcp-tab", 7, expect.objectContaining({ label: "MCP updated" }));
      expect(db.deleteCustomTabByTabId).toHaveBeenCalledWith("mcp-tab", 7);
    } finally {
      await close();
    }
  });

  it("fails closed when the MCP user openId is not configured", async () => {
    delete process.env.SYSTEMA_MCP_USER_OPEN_ID;
    resetMcpUserCacheForTests();
    const { client, close } = await createMcpClient();

    try {
      const result = await client.callTool({
        name: "create_task",
        arguments: { tabId: "today", title: "No user" },
      });

      expect(result.isError).toBe(true);
      expect(result.content[0]).toMatchObject({
        type: "text",
        text: expect.stringContaining("SYSTEMA_MCP_USER_OPEN_ID"),
      });
    } finally {
      await close();
    }
  });

  it("accepts HTTP write calls with the shared secret header", async () => {
    await withHttpServer(async (baseUrl) => {
      const response = await callHttpWrite(baseUrl, { headerSecret: "test-secret" });
      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toMatchObject({
        result: { structuredContent: { task: { tabId: "today", title: "HTTP write" } } },
      });
    });
  });

  it("accepts HTTP write calls with the shared secret query param", async () => {
    await withHttpServer(async (baseUrl) => {
      const response = await callHttpWrite(baseUrl, { querySecret: "test-secret" });
      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toMatchObject({
        result: { structuredContent: { task: { tabId: "today", title: "HTTP write" } } },
      });
    });
  });

  it("rejects HTTP write calls without the shared secret", async () => {
    await withHttpServer(async (baseUrl) => {
      const response = await callHttpWrite(baseUrl);
      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toMatchObject({
        error: { message: "Unauthorized Systema MCP write tool call." },
      });
    });
  });

  it("rejects HTTP write calls with a bad query secret", async () => {
    await withHttpServer(async (baseUrl) => {
      const response = await callHttpWrite(baseUrl, { querySecret: "wrong-secret" });
      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toMatchObject({
        error: { message: "Unauthorized Systema MCP write tool call." },
      });
    });
  });
});
