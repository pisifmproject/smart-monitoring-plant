// src/scripts/testElectricalReportAggregation.ts
import { aggregateAllPanelsForDate } from "../electricalReport/electricalReport.service";

async function test() {
  try {
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    console.log(
      "╔═══════════════════════════════════════════════════════════════╗"
    );
    console.log(
      "║     ELECTRICAL REPORT AGGREGATION TEST                        ║"
    );
    console.log(
      "╚═══════════════════════════════════════════════════════════════╝"
    );
    console.log(`\n[TEST] Aggregating data for: ${dateStr}`);
    console.log(
      "[TEST] This will calculate energy (kWh) using trapezoid integration"
    );
    console.log("[TEST] Processing all 4 LVMDP panels...\n");

    await aggregateAllPanelsForDate(dateStr);

    console.log("\n[TEST] ✓ Aggregation completed successfully!");
    console.log("\n[NEXT STEPS]");
    console.log("  1. Check database: SELECT * FROM daily_electrical_reports;");
    console.log(
      "  2. Test API: GET http://localhost:2000/api/report/electrical/latest"
    );
    console.log(
      "  3. Test daily report: GET http://localhost:2000/api/report/electrical?period=day&date=" +
        dateStr
    );

    process.exit(0);
  } catch (error) {
    console.error("\n[TEST] ✗ Error during aggregation:", error);
    process.exit(1);
  }
}

test();
