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

  it("blocks tool scope when revoked", () => {
    const policy = new McpPolicy({
      allowedToolsCsv: "calendar.create_event"
    });

    const decision = policy.evaluate({
      toolName: "calendar.create_event",
      userGrantedScopes: ["calendar.create_event"],
      revokedScopes: ["calendar.create_event"],
      isSensitive: false
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("tool_scope_revoked");
  });

  it("blocks tool not granted by user", () => {
    const policy = new McpPolicy({
      allowedToolsCsv: "calendar.create_event"
    });

    const decision = policy.evaluate({
      toolName: "calendar.create_event",
      userGrantedScopes: [],
      isSensitive: false
    });

    expect(decision.allowed).toBe(false);
    expect(decision.reason).toBe("tool_not_granted_by_user");
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
    expect(decision.reason).toBe("confirmation_required");
  });

  it("allows non sensitive tool without confirmation when default disabled", () => {
    const policy = new McpPolicy({
      allowedToolsCsv: "calendar.create_event",
      requireConfirmationByDefault: "false"
    });

    const decision = policy.evaluate({
      toolName: "calendar.create_event",
      userGrantedScopes: ["calendar.create_event"],
      isSensitive: false
    });

    expect(decision.allowed).toBe(true);
    expect(decision.requiresConfirmation).toBe(false);
    expect(decision.reason).toBe("allowed");
  });

  it("allows confirmed sensitive action", () => {
    const policy = new McpPolicy({
      allowedToolsCsv: "calendar.create_event",
      requireConfirmationByDefault: "false"
    });

    const decision = policy.evaluate({
      toolName: "calendar.create_event",
      userGrantedScopes: ["calendar.create_event"],
      isSensitive: true,
      confirmationProvided: true
    });

    expect(decision.allowed).toBe(true);
    expect(decision.requiresConfirmation).toBe(false);
    expect(decision.reason).toBe("allowed");
  });
});
