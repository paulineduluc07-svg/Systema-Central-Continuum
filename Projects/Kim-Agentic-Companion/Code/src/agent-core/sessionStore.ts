import { randomUUID } from "node:crypto";
import { SessionRecord } from "../shared/types.js";

export class InMemorySessionStore {
  private readonly bySessionId = new Map<string, SessionRecord>();

  create(userId: string): SessionRecord {
    const record: SessionRecord = {
      sessionId: randomUUID(),
      userId,
      createdAt: new Date().toISOString()
    };

    this.bySessionId.set(record.sessionId, record);
    return record;
  }

  get(sessionId: string): SessionRecord | undefined {
    return this.bySessionId.get(sessionId);
  }
}