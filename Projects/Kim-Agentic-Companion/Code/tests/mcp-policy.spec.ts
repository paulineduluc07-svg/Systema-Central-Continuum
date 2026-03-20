import { describe, expect, it } from "vitest";
import { McpPolicy } from "../src/mcp-gateway/mcpPolicy.js";

describe("McpPolicy", () => {
  it("blocks tool outside allowlist", () => {
    const policy = new McpPolicy({
      allowedToolsCsv: "calendar.create_event"
    });

    const decision = policy.evaluate({
      toolName: "notes.create",
      userGrantedScopes: ["notes.create"],
      isSensitive: false
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("tool_not_in_server_allowlist");
  });

  it("requires confirmation by default", () => {
    const policy = new McpPolicy({
      allowedToolsCsv: "calendar.create_event",
      requireConfirmationByDefault: "true"
    });

    const decision = policy.evaluate({
      toolName: "calendar.create_event",
      userGrantedScopes: ["calendar.create_event"],
      isSensitive: false
    });

    expect(decision.allowed).toBe(true);
    expect(decision.requiresConfirmation).toBe(true);
  });
});