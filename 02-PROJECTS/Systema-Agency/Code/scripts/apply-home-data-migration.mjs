// One-shot helper: applies drizzle/0007_home_data.sql to the Neon DB.
// Idempotent (CREATE TABLE IF NOT EXISTS).
// Usage: node --env-file=.env scripts/apply-home-data-migration.mjs
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sqlPath = resolve(__dirname, "..", "drizzle", "0007_home_data.sql");
const sql = readFileSync(sqlPath, "utf8");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing — copy .env first.");
  process.exit(1);
}

const client = neon(url);

const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0)
  .map((s) => s + ";");

console.log(`Applying ${statements.length} statement(s) from 0007_home_data.sql...`);

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  const preview = stmt.split("\n")[0].slice(0, 80);
  console.log(`[${i + 1}/${statements.length}] ${preview}${preview.length === 80 ? "…" : ""}`);
  try {
    await client.query(stmt);
  } catch (err) {
    console.error(`  ✗ Failed:`, err.message);
    process.exit(1);
  }
}

const check = await client.query(
  "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'home_data' ORDER BY ordinal_position",
);
console.log("\nhome_data columns:");
for (const row of check) {
  console.log(`  - ${row.column_name} (${row.data_type})`);
}

console.log("\n✓ Migration applied successfully.");
