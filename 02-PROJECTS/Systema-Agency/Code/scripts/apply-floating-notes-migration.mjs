// One-shot helper: applies drizzle/0004_floating_notes.sql to the Neon DB.
// Idempotent (CREATE ... IF NOT EXISTS, DO $$ blocks). Safe to re-run.
// Usage: node scripts/apply-floating-notes-migration.mjs
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sqlPath = resolve(__dirname, "..", "drizzle", "0004_floating_notes.sql");
const sql = readFileSync(sqlPath, "utf8");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing — copy .env first.");
  process.exit(1);
}

const client = neon(url);

// Split on semicolons that aren't inside DO $$ ... END $$ blocks.
// Simple state machine: toggle a flag when we see "DO $$" / "END $$".
function splitStatements(input) {
  const out = [];
  let buf = "";
  let inDollar = false;
  const lines = input.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!inDollar && /^DO\s+\$\$/i.test(trimmed)) inDollar = true;
    buf += line + "\n";
    if (inDollar && /END\s+\$\$\s*;?\s*$/i.test(trimmed)) {
      inDollar = false;
      out.push(buf.trim());
      buf = "";
      continue;
    }
    if (!inDollar && trimmed.endsWith(";")) {
      out.push(buf.trim());
      buf = "";
    }
  }
  if (buf.trim()) out.push(buf.trim());
  return out.filter((s) => s.length > 0);
}

const statements = splitStatements(sql);
console.log(`Applying ${statements.length} statement(s) from 0004_floating_notes.sql...`);

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const preview = stmt.split("\n")[0].slice(0, 80);
  console.log(`[${i + 1}/${statements.length}] ${preview}${preview.length === 80 ? "…" : ""}`);
  try {
    // neon() returns a tagged template; for raw SQL use the .query() method
    await client.query(stmt);
  } catch (err) {
    console.error(`  ✗ Failed:`, err.message);
    process.exit(1);
  }
}

// Verify the table now exists
const check = await client.query(
  "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'floating_notes' ORDER BY ordinal_position",
);
console.log("\nfloating_notes columns:");
for (const row of check) {
  console.log(`  - ${row.column_name} (${row.data_type})`);
}
console.log("\n✓ Migration applied successfully.");
