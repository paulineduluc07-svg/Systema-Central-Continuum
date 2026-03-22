import { describe, expect, it } from "vitest";
import { getToolExampleInput, getToolPermissionLabel } from "./toolHelpers";

describe("toolHelpers", () => {
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
});
