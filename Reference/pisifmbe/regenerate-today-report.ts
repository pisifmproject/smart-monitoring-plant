// Regenerate today's report with new calculation
import { saveShiftReport } from "./src/lvmdp/LVMDP_1/lvmdp_1.dailyReport.services";
import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function regenerateToday() {
  try {
    const today = "2025-12-19";

    console.log("=== Regenerating Today's Report ===\n");
    console.log("Date:", today);

    // Delete existing data
    console.log("\n1. Deleting existing data...");
    await db.execute(
      sql`DELETE FROM daily_report_lvmdp_1 WHERE report_date = ${today}`
    );
    console.log("✓ Deleted");

    // Regenerate Shift 1
    console.log("\n2. Regenerating Shift 1 (07:00-14:30)...");
    await saveShiftReport(today, 1);
    console.log("✓ Shift 1 saved");

    // Regenerate Shift 2
    console.log("\n3. Regenerating Shift 2 (14:30-22:00)...");
    await saveShiftReport(today, 2);
    console.log("✓ Shift 2 saved");

    // Check result
    console.log("\n4. Checking result...");
    const result = await db.execute(
      sql`SELECT 
        shift1_total_kwh, shift1_avg_kwh, shift1_count,
        shift2_total_kwh, shift2_avg_kwh, shift2_count
      FROM daily_report_lvmdp_1 
      WHERE report_date = ${today}`
    );

    console.log("\n=== New Data ===");
    console.log(JSON.stringify(result.rows[0], null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

regenerateToday();
