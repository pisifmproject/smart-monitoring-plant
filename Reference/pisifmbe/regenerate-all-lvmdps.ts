// Regenerate all LVMDPs today's report
import { saveShiftReport as saveShiftLVMDP1 } from "./src/lvmdp/LVMDP_1/lvmdp_1.dailyReport.services";
import { saveShiftReport as saveShiftLVMDP2 } from "./src/lvmdp/LVMDP_2/lvmdp_2.dailyReport.services";
import { saveShiftReport as saveShiftLVMDP3 } from "./src/lvmdp/LVMDP_3/lvmdp_3.dailyReport.services";
import { saveShiftReport as saveShiftLVMDP4 } from "./src/lvmdp/LVMDP_4/lvmdp_4.dailyReport.services";
import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function regenerateAllLVMDPs() {
  try {
    const today = "2025-12-19";

    console.log("=== Regenerating All LVMDPs ===\n");
    console.log("Date:", today);

    // Delete existing data for all LVMDPs
    console.log("\n1. Deleting existing data...");
    await db.execute(
      sql`DELETE FROM daily_report_lvmdp_1 WHERE report_date = ${today}`
    );
    await db.execute(
      sql`DELETE FROM daily_report_lvmdp_2 WHERE report_date = ${today}`
    );
    await db.execute(
      sql`DELETE FROM daily_report_lvmdp_3 WHERE report_date = ${today}`
    );
    await db.execute(
      sql`DELETE FROM daily_report_lvmdp_4 WHERE report_date = ${today}`
    );
    console.log("✓ Deleted all");

    // Regenerate Shift 1 for all
    console.log("\n2. Regenerating Shift 1 for all LVMDPs...");
    await Promise.all([
      saveShiftLVMDP1(today, 1),
      saveShiftLVMDP2(today, 1),
      saveShiftLVMDP3(today, 1),
      saveShiftLVMDP4(today, 1),
    ]);
    console.log("✓ Shift 1 saved for all");

    // Regenerate Shift 2 for all
    console.log("\n3. Regenerating Shift 2 for all LVMDPs...");
    await Promise.all([
      saveShiftLVMDP1(today, 2),
      saveShiftLVMDP2(today, 2),
      saveShiftLVMDP3(today, 2),
      saveShiftLVMDP4(today, 2),
    ]);
    console.log("✓ Shift 2 saved for all");

    // Check results
    console.log("\n4. Checking LVMDP 1 result...");
    const result1 = await db.execute(
      sql`SELECT 
        shift1_total_kwh, shift1_avg_kwh, shift1_count,
        shift2_total_kwh, shift2_avg_kwh, shift2_count
      FROM daily_report_lvmdp_1 
      WHERE report_date = ${today}`
    );
    console.log(JSON.stringify(result1.rows[0], null, 2));

    console.log("\n✅ All done! Refresh the frontend to see new data.");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

regenerateAllLVMDPs();
