import { describe, expect, it } from "vitest";
import { CalendarConnector, CalendarTransport } from "../src/mcp-gateway/connectors/calendarConnector.js";

class FakeCalendarTransport implements CalendarTransport {
  public called = false;

  async createCalendarEvent(): Promise<{ success: boolean; error?: string }> {
    this.called = true;
    return { success: true };
  }
}

describe("CalendarConnector", () => {
  it("rejects invalid payload", async () => {
    const connector = new CalendarConnector(new FakeCalendarTransport());

    const result = await connector.createEvent({
      title: "Call"
    });

    expect(result.status).toBe("error");
    expect(result.detail).toBe("invalid_calendar_payload");
  });

  it("calls transport when payload is valid", async () => {
    const transport = new FakeCalendarTransport();
    const connector = new CalendarConnector(transport);

    const result = await connector.createEvent({
      title: "Call",
      startAt: "2026-03-21T10:00:00Z"
    });

    expect(transport.called).toBe(true);
    expect(result.status).toBe("executed");
  });
});