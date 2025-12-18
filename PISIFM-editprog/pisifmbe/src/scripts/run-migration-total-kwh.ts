// src/scripts/run-migration-total-kwh.ts
import { db } from "../db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  try {
    console.log("[MIGRATION] Reading migration file...");

    const migrationPath = path.join(
      __dirname,
      "../../drizzle/0011_add_total_kwh_to_daily_reports.sql"
    );

    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("[MIGRATION] Executing migration...");
    console.log("------------------------------------");

    await db.execute(sql.raw(migrationSQL));

    console.log("------------------------------------");
    console.log("[MIGRATION] ✓ Migration completed successfully!");
    console.log("[MIGRATION] Added columns to tables:");
    console.log(
      "  - daily_report_lvmdp_1: shift1_total_kwh, shift2_total_kwh, shift3_total_kwh"
    );
    console.log(
      "  - daily_report_lvmdp_2: shift1_total_kwh, shift2_total_kwh, shift3_total_kwh"
    );
    console.log(
      "  - daily_report_lvmdp_3: shift1_total_kwh, shift2_total_kwh, shift3_total_kwh"
    );
    console.log(
      "  - daily_report_lvmdp_4: shift1_total_kwh, shift2_total_kwh, shift3_total_kwh"
    );

    process.exit(0);
  } catch (error) {
    console.error("[MIGRATION] ✗ Error:", error);
    process.exit(1);
  }
}

runMigration();
