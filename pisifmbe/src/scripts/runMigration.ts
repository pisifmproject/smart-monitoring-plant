// src/scripts/runMigration.ts
import { db } from "../db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  try {
    console.log("[MIGRATION] Reading migration file...");

    const migrationPath = path.join(
      __dirname,
      "../../drizzle/0007_add_hourly_report_tables.sql"
    );

    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("[MIGRATION] Executing migration...");
    console.log("------------------------------------");

    await db.execute(sql.raw(migrationSQL));

    console.log("------------------------------------");
    console.log("[MIGRATION] ✓ Migration completed successfully!");
    console.log("[MIGRATION] Created tables:");
    console.log("  - hourly_report_lvmdp_1");
    console.log("  - hourly_report_lvmdp_2");
    console.log("  - hourly_report_lvmdp_3");
    console.log("  - hourly_report_lvmdp_4");
    console.log("[MIGRATION] With indexes for optimal performance");

    process.exit(0);
  } catch (error) {
    console.error("[MIGRATION] ✗ Error:", error);
    process.exit(1);
  }
}

runMigration();
