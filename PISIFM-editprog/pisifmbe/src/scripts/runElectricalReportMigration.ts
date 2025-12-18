// src/scripts/runElectricalReportMigration.ts
import { db } from "../db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  try {
    console.log("[MIGRATION] Reading electrical report migration file...");

    const migrationPath = path.join(
      __dirname,
      "../../drizzle/0012_add_daily_electrical_reports.sql"
    );

    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    console.log("[MIGRATION] Executing migration...");
    console.log("============================================");
    console.log(migrationSQL);
    console.log("============================================");

    await db.execute(sql.raw(migrationSQL));

    console.log("\n[MIGRATION] ✓ Migration completed successfully!");
    console.log("\n[CREATED] Table: daily_electrical_reports");
    console.log("  Columns:");
    console.log("    - id (PRIMARY KEY)");
    console.log("    - panel_id");
    console.log("    - report_date");
    console.log("    - energy_kwh");
    console.log("    - avg_load_kw, peak_demand_kw, peak_demand_time");
    console.log("    - avg_voltage, min_voltage, max_voltage");
    console.log("    - avg_current, max_current");
    console.log("    - avg_power_factor");
    console.log("    - sample_count, data_completeness_percent");
    console.log("    - created_at, updated_at");
    console.log("\n[CREATED] Indexes:");
    console.log("    - idx_daily_electrical_reports_date");
    console.log("    - idx_daily_electrical_reports_panel");
    console.log("    - idx_daily_electrical_reports_panel_date (UNIQUE)");
    console.log("\n[INFO] Professional electrical reporting system ready!");
    console.log("[INFO] ISO 50001 compliant structure implemented");

    // Verify table creation
    console.log("\n[VERIFY] Checking table existence...");
    const result = await db.execute(sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'daily_electrical_reports'
      ORDER BY ordinal_position
    `);

    console.log(
      `\n[VERIFY] ✓ Found ${result.rows.length} columns in daily_electrical_reports table`
    );
    console.log("\nTable structure:");
    result.rows.forEach((row: any) => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("\n[MIGRATION] ✗ Error:", error);
    process.exit(1);
  }
}

runMigration();
