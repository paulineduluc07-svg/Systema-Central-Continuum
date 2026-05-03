// One-shot helper: applies drizzle/0006_floating_notes_kind.sql to the Neon DB.
// Idempotent (CREATE TYPE guarded, ADD COLUMN IF NOT EXISTS, UPDATE matches only legacy rows).
// Usage: node --env-file=.env scripts/apply-floating-notes-kind-migration.mjs
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sqlPath = resolve(__dirname, "..", "drizzle", "0006_floating_notes_kind.sql");
const sql = readFileSync(sqlPath, "utf8");

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL missing — copy .env first.");
  process.exit(1);
}

const client = neon(url);

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
console.log(`Applying ${statements.length} statement(s) from 0006_floating_notes_kind.sql...`);

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
  "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'floating_notes' AND column_name = 'kind'",
);
console.log("\nfloating_notes.kind column:");
for (const row of check) {
  console.log(`  - ${row.column_name} (${row.data_type})`);
}

const counts = await client.query(
  "SELECT kind, COUNT(*)::int AS n FROM floating_notes GROUP BY kind ORDER BY kind",
);
console.log("\nRow counts by kind:");
for (const row of counts) {
  console.log(`  - ${row.kind}: ${row.n}`);
}

console.log("\n✓ Migration applied successfully.");
