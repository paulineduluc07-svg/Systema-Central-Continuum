import { Pool } from "pg";
import { log } from "../shared/logger.js";
import { InMemoryMemoryStore } from "./memoryStore.js";
import { MemoryRecord } from "../shared/types.js";

interface MemoryRow {
  user_id: string;
  role: MemoryRecord["role"];
  content: string;
  created_at: string;
}

export class PersistentMemoryStore extends InMemoryMemoryStore {
  private constructor(private readonly pool: Pool) {
    super();
  }

  static async create(pool: Pool): Promise<PersistentMemoryStore> {
    const store = new PersistentMemoryStore(pool);
    await store.hydrate();
    return store;
  }

  override append(userId: string, role: MemoryRecord["role"], content: string): MemoryRecord {
    const entry = super.append(userId, role, content);

    void this.pool
      .query(
        `
          INSERT INTO kim_memory (user_id, role, content, created_at)
          VALUES ($1, $2, $3, $4::timestamptz)
        `,
        [userId, role, content, entry.timestamp]
      )
      .catch((error: unknown) => {
        const reason = error instanceof Error ? error.message : "unknown_error";
        log("warn", "memory_persist_failed", { reason, userId });
      });

    return entry;
  }

  private async hydrate(): Promise<void> {
    const result = await this.pool.query<MemoryRow>(
      `
        SELECT user_id, role, content, created_at::text
        FROM kim_memory
        ORDER BY created_at ASC
        LIMIT 20000
      `
    );

    for (const row of result.rows) {
      this.addRecord(row.user_id, {
        role: row.role,
        content: row.content,
        timestamp: row.created_at
      });
    }
  }
}