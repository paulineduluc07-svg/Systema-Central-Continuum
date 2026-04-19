import { Pool } from "pg";

export async function createPostgresPoolFromEnv(): Promise<Pool | null> {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    return null;
  }

  const disableSsl = process.env.PGSSL_DISABLE === "true";
  const pool = new Pool({
    connectionString,
    ssl: disableSsl ? undefined : { rejectUnauthorized: false }
  });

  await pool.query("SELECT 1");
  return pool;
}

export async function ensureKimSchema(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS kim_sessions (
      session_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_kim_sessions_user_created_at
    ON kim_sessions (user_id, created_at DESC);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS kim_memory (
      id BIGSERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_kim_memory_user_created_at
    ON kim_memory (user_id, created_at DESC);
  `);
}