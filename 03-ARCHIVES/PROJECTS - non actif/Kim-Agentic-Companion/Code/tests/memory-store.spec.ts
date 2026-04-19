import { describe, expect, it } from "vitest";
import { InMemoryMemoryStore } from "../src/agent-core/memoryStore.js";

describe("InMemoryMemoryStore", () => {
  it("keeps only requested number of recent records", () => {
    const store = new InMemoryMemoryStore();

    store.append("u1", "user", "one");
    store.append("u1", "assistant", "two");
    store.append("u1", "user", "three");

    const recent = store.getRecent("u1", 2);

    expect(recent).toHaveLength(2);
    expect(recent[0]?.content).toBe("two");
    expect(recent[1]?.content).toBe("three");
  });
});