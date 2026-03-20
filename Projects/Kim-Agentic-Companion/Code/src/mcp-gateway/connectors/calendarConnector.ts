import { CalendarCreateEventInput, ToolResult } from "../../shared/types.js";
import { McpInvokeResult } from "../types.js";

export interface CalendarTransport {
  createCalendarEvent(input: CalendarCreateEventInput): Promise<McpInvokeResult>;
}

function readString(input: Record<string, unknown>, key: string): string | undefined {
  const value = input[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeCalendarInput(input: Record<string, unknown>): CalendarCreateEventInput | null {
  const title = readString(input, "title");
  const startAt = readString(input, "startAt");

  if (!title || !startAt) {
    return null;
  }

  return {
    title,
    startAt,
    endAt: readString(input, "endAt"),
    timezone: readString(input, "timezone"),
    notes: readString(input, "notes")
  };
}

export class CalendarConnector {
  constructor(private readonly transport: CalendarTransport) {}

  async createEvent(input: Record<string, unknown>): Promise<ToolResult> {
    const normalized = normalizeCalendarInput(input);
    if (!normalized) {
      return {
        name: "calendar.create_event",
        status: "error",
        detail: "invalid_calendar_payload"
      };
    }

    const result = await this.transport.createCalendarEvent(normalized);

    if (!result.success) {
      return {
        name: "calendar.create_event",
        status: "error",
        detail: result.error ?? "calendar_connector_error"
      };
    }

    return {
      name: "calendar.create_event",
      status: "executed",
      detail: "calendar_event_created"
    };
  }
}