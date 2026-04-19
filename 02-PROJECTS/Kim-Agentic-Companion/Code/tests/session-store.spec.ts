import { describe, expect, it } from "vitest";
import { InMemorySessionStore } from "../src/agent-core/sessionStore.js";

describe("InMemorySessionStore", () => {
  it("creates and retrieves a session", () => {
    const store = new InMemorySessionStore();

    const created = store.create("user_1");
    const read = store.get(created.sessionId);

    expect(created.userId).toBe("user_1");
    expect(read?.sessionId).toBe(created.sessionId);
  });
});