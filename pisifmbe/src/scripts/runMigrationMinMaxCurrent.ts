// src/scripts/runMigrationMinMaxCurrent.ts
import { db } from "../db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  try {
    console.log("[MIGRATION] Reading migration file...");

    const migrationPath = path.join(
      __dirname,
      "../../drizzle/0009_add_minmax_current_to_daily_reports.sql"
    );

    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("[MIGRATION] Executing migration...");
    console.log("------------------------------------");

    await db.execute(sql.raw(migrationSQL));

    console.log("------------------------------------");
    console.log("[MIGRATION] ✓ Migration completed successfully!");
    console.log("[MIGRATION] Added columns to tables:");
    console.log("  - daily_report_lvmdp_1");
    console.log("  - daily_report_lvmdp_2");
    console.log("  - daily_report_lvmdp_3");
    console.log("  - daily_report_lvmdp_4");
    console.log("[MIGRATION] Added columns:");
    console.log("  - shift1_min_current, shift1_max_current");
    console.log("  - shift2_min_current, shift2_max_current");
    console.log("  - shift3_min_current, shift3_max_current");

    process.exit(0);
  } catch (error) {
    console.error("[MIGRATION] ✗ Error:", error);
    process.exit(1);
  }
}

runMigration();
