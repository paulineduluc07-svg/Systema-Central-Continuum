import { beforeEach, describe, expect, it } from "vitest";
import {
  clearStoredToolPermissions,
  getToolExampleInput,
  getToolPermissionLabel,
  readStoredToolPermissions,
  readToolCommandName,
  resolveToolCommandPermissionRequest,
  writeStoredToolPermissions,
} from "./toolHelpers";

describe("toolHelpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns a readable permission label", () => {
    expect(getToolPermissionLabel("ask")).toBe("Ask first");
    expect(getToolPermissionLabel("always")).toBe("Always allow");
    expect(getToolPermissionLabel("denied")).toBe("Denied");
  });

  it("provides a working default payload for known tools", () => {
    expect(getToolExampleInput({ name: "system.get_time" })).toEqual({
      timezone: "America/Toronto",
    });

    expect(getToolExampleInput({ name: "web.fetch" })).toEqual({
      url: "https://example.com",
    });
  });

  it("parses valid slash-tool commands and ignores malformed ones", () => {
    expect(readToolCommandName('/tool system.get_time {"timezone":"America/Toronto"}')).toBe("system.get_time");
    expect(readToolCommandName('/tool system.get_time "America/Toronto"')).toBeNull();
    expect(readToolCommandName("hello Kim")).toBeNull();
  });

  it("resolves always-allow permissions into chat tool grants", () => {
    expect(
      resolveToolCommandPermissionRequest('/tool system.get_time {"timezone":"America/Toronto"}', {
        "system.get_time": "always",
      })
    ).toEqual({
      grantedTools: ["system.get_time"],
      confirmationProvided: true,
    });
  });

  it("resolves denied permissions into chat tool revocations", () => {
    expect(
      resolveToolCommandPermissionRequest('/tool web.fetch {"url":"https://example.com"}', {
        "web.fetch": "denied",
      })
    ).toEqual({
      revokedTools: ["web.fetch"],
    });
  });

  it("persists and clears stored tool permissions", () => {
    writeStoredToolPermissions({
      "system.get_time": "always",
      "web.fetch": "denied",
    });

    expect(readStoredToolPermissions()).toEqual({
      "system.get_time": "always",
      "web.fetch": "denied",
    });

    clearStoredToolPermissions();
    expect(readStoredToolPermissions()).toEqual({});
  });
});
