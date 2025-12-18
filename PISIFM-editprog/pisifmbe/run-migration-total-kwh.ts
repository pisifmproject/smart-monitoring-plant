// Run migration to add total_kwh columns to daily report tables
import { db } from "./src/db/index";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  console.log("🚀 Running migration: Add total_kwh columns...");

  try {
    // Read the SQL migration file
    const migrationPath = path.join(
      __dirname,
      "drizzle",
      "0011_add_total_kwh_to_daily_reports.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const statement of statements) {
      console.log(`\nExecuting: ${statement.substring(0, 80)}...`);
      await db.execute(sql.raw(statement));
      console.log("✓ Success");
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigration();
