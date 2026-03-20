import { Pool } from "pg";
import { log } from "../shared/logger.js";
import { SessionRecord } from "../shared/types.js";
import { InMemorySessionStore } from "./sessionStore.js";

interface SessionRow {
  session_id: string;
  user_id: string;
  created_at: string;
}

export class PersistentSessionStore extends InMemorySessionStore {
  private constructor(private readonly pool: Pool) {
    super();
  }

  static async create(pool: Pool): Promise<PersistentSessionStore> {
    const store = new PersistentSessionStore(pool);
    await store.hydrate();
    return store;
  }

  override create(userId: string): SessionRecord {
    const created = super.create(userId);

    void this.pool
      .query(
        `
          INSERT INTO kim_sessions (session_id, user_id, created_at)
          VALUES ($1, $2, $3::timestamptz)
          ON CONFLICT (session_id) DO NOTHING
        `,
        [created.sessionId, created.userId, created.createdAt]
      )
      .catch((error: unknown) => {
        const reason = error instanceof Error ? error.message : "unknown_error";
        log("warn", "session_persist_failed", { reason, userId });
      });

    return created;
  }

  private async hydrate(): Promise<void> {
    const result = await this.pool.query<SessionRow>(
      `
        SELECT session_id, user_id, created_at::text
        FROM kim_sessions
        ORDER BY created_at DESC
        LIMIT 20000
      `
    );

    for (const row of result.rows) {
      this.setSession({
        sessionId: row.session_id,
        userId: row.user_id,
        createdAt: row.created_at
      });
    }
  }
}