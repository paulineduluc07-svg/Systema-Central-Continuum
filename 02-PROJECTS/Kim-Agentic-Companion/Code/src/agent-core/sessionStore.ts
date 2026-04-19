import { randomUUID } from "node:crypto";
import { SessionRecord } from "../shared/types.js";

export class InMemorySessionStore {
  protected readonly bySessionId = new Map<string, SessionRecord>();

  protected setSession(record: SessionRecord): void {
    this.bySessionId.set(record.sessionId, record);
  }

  create(userId: string): SessionRecord {
    const record: SessionRecord = {
      sessionId: randomUUID(),
      userId,
      createdAt: new Date().toISOString()
    };

    this.setSession(record);
    return record;
  }

  get(sessionId: string): SessionRecord | undefined {
    return this.bySessionId.get(sessionId);
  }
}