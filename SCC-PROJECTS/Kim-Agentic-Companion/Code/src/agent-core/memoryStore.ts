import { MemoryRecord } from "../shared/types.js";

export class InMemoryMemoryStore {
  protected readonly recordsByUser = new Map<string, MemoryRecord[]>();

  protected addRecord(userId: string, record: MemoryRecord): void {
    const existing = this.recordsByUser.get(userId) ?? [];
    existing.push(record);
    this.recordsByUser.set(userId, existing);
  }

  append(userId: string, role: MemoryRecord["role"], content: string): MemoryRecord {
    const entry: MemoryRecord = {
      role,
      content,
      timestamp: new Date().toISOString()
    };

    this.addRecord(userId, entry);
    return entry;
  }

  getRecent(userId: string, limit = 8): MemoryRecord[] {
    const existing = this.recordsByUser.get(userId) ?? [];
    return existing.slice(-Math.max(limit, 1));
  }

  summarize(userId: string, limit = 8): string {
    const lines = this.getRecent(userId, limit).map((item) => `${item.role}: ${item.content}`);
    return lines.join("\n");
  }
}