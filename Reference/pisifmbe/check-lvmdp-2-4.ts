import { db } from "./src/db";
import {
  dailyReportLVMDP2,
  dailyReportLVMDP3,
  dailyReportLVMDP4,
  hourlyReportLVMDP2,
  hourlyReportLVMDP3,
  hourlyReportLVMDP4,
} from "./src/db/schema";
import { sql } from "drizzle-orm";

async function checkAllLVMDP() {
  const today = "2025-12-22";
  const lvmdps = [
    {
      name: "LVMDP 2",
      dailyTable: dailyReportLVMDP2,
      hourlyTable: hourlyReportLVMDP2,
    },
    {
      name: "LVMDP 3",
      dailyTable: dailyReportLVMDP3,
      hourlyTable: hourlyReportLVMDP3,
    },
    {
      name: "LVMDP 4",
      dailyTable: dailyReportLVMDP4,
      hourlyTable: hourlyReportLVMDP4,
    },
  ];

  for (const lvmdp of lvmdps) {
    console.log(`\n════════════════════════════════════════════`);
    console.log(`  ${lvmdp.name}`);
    console.log(`════════════════════════════════════════════`);

    // Check daily report
    const dailyData = await db
      .select()
      .from(lvmdp.dailyTable)
      .where(sql`${lvmdp.dailyTable.reportDate} = ${today}::date`);

    console.log(`\n📋 Daily Report:`);
    if (dailyData.length > 0) {
      const dr = dailyData[0] as any;
      console.log(`   ✅ Found 1 record`);
      console.log(`   Shift 1: ${(dr.shift1TotalKwh ?? 0).toFixed(2)} kWh`);
      console.log(`   Shift 2: ${(dr.shift2TotalKwh ?? 0).toFixed(2)} kWh`);
      console.log(`   Shift 3: ${(dr.shift3TotalKwh ?? 0).toFixed(2)} kWh`);
    } else {
      console.log(`   ❌ No daily report found for today`);
    }

    // Check hourly report
    const hourlyData = await db
      .select()
      .from(lvmdp.hourlyTable)
      .where(sql`DATE(${lvmdp.hourlyTable.reportDate}) = ${today}::date`)
      .orderBy(lvmdp.hourlyTable.hour);

    console.log(`\n📊 Hourly Report:`);
    if (hourlyData.length > 0) {
      console.log(`   ✅ Found ${hourlyData.length} records`);
      hourlyData.slice(0, 3).forEach((r: any) => {
        console.log(
          `   Hour ${String(r.hour).padStart(2, "0")}: ${(
            r.totalKwh ?? 0
          ).toFixed(2)} kWh`
        );
      });
    } else {
      console.log(`   ❌ No hourly reports found for today`);
    }
  }

  console.log(`\n════════════════════════════════════════════\n`);
  process.exit(0);
}

checkAllLVMDP().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
