// run-migration.ts - Run SQL migration directly
import { sql } from "drizzle-orm";
import { db } from "./src/db";
import fs from "fs";
import path from "path";

async function runMigration() {
  try {
    console.log("🔧 Running migration: 0013_add_users_table.sql");

    const migrationPath = path.join(
      __dirname,
      "drizzle",
      "0013_add_users_table.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    // Split by semicolon and run each statement
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 60)}...`);
      await db.execute(sql.raw(statement));
    }

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

runMigration();
