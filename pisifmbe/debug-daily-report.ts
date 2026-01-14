// Debug script to test API response
import "dotenv/config";
import { db } from "./src/db";
import { dailyReportLVMDP1 } from "./src/db/schema";
import { desc } from "drizzle-orm";

async function main() {
  console.log("\n=== Testing Daily Report All ===\n");

  // Simulate what getAllDailyReports returns
  const allReports = await db
    .select()
    .from(dailyReportLVMDP1)
    .orderBy(desc(dailyReportLVMDP1.reportDate))
    .limit(30);

  console.log(`Total reports fetched: ${allReports.length}`);
  console.log("\nFirst 5 reports (newest):");

  allReports.slice(0, 5).forEach((r) => {
    console.log(`\nDate: ${r.reportDate}`);
    console.log(
      `  shift1TotalKwh: ${r.shift1TotalKwh} (type: ${typeof r.shift1TotalKwh})`
    );
    console.log(
      `  shift1AvgCurrent: ${
        r.shift1AvgCurrent
      } (type: ${typeof r.shift1AvgCurrent})`
    );
    console.log(
      `  shift2TotalKwh: ${r.shift2TotalKwh} (type: ${typeof r.shift2TotalKwh})`
    );
    console.log(
      `  shift3TotalKwh: ${r.shift3TotalKwh} (type: ${typeof r.shift3TotalKwh})`
    );
  });

  // Now simulate the API transformation
  console.log("\n=== After API Transformation ===\n");

  const formatted = allReports.slice(0, 5).map((r: any) => ({
    reportDate: r.reportDate,
    date: r.reportDate,
    shift1TotalKwh: r.shift1TotalKwh || 0,
    shift1AvgCurrent: r.shift1AvgCurrent || 0,
    shift2TotalKwh: r.shift2TotalKwh || 0,
    shift3TotalKwh: r.shift3TotalKwh || 0,
  }));

  formatted.forEach((r) => {
    console.log(`Date: ${r.date}`);
    console.log(
      `  shift1TotalKwh: ${r.shift1TotalKwh} (type: ${typeof r.shift1TotalKwh})`
    );
    console.log(
      `  Total = ${r.shift1TotalKwh + r.shift2TotalKwh + r.shift3TotalKwh}`
    );
  });

  process.exit(0);
}

main().catch(console.error);
