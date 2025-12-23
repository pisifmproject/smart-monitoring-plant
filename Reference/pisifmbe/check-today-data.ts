import { db } from "./src/db";
import { hourlyReportLVMDP1, dailyReportLVMDP1 } from "./src/db/schema";
import { sql } from "drizzle-orm";

async function checkData() {
  const today = "2025-12-22";
  const yesterday = "2025-12-21";

  console.log("\n=== Checking Hourly Reports ===");
  console.log(`Today (${today}):`);

  const hourlyToday = await db
    .select()
    .from(hourlyReportLVMDP1)
    .where(sql`DATE(${hourlyReportLVMDP1.reportDate}) = ${today}::date`)
    .orderBy(hourlyReportLVMDP1.hour);

  console.log(`Found ${hourlyToday.length} hourly records for today`);
  if (hourlyToday.length > 0) {
    console.log("Sample records:");
    hourlyToday.slice(0, 3).forEach((r) => {
      console.log(
        `  Hour ${r.hour}: count=${r.count}, totalKwh=${r.totalKwh}, avgCurrent=${r.avgCurrent}`
      );
    });
  }

  console.log(`\nYesterday (${yesterday}):`);
  const hourlyYesterday = await db
    .select()
    .from(hourlyReportLVMDP1)
    .where(sql`DATE(${hourlyReportLVMDP1.reportDate}) = ${yesterday}::date`)
    .orderBy(hourlyReportLVMDP1.hour);

  console.log(`Found ${hourlyYesterday.length} hourly records for yesterday`);
  if (hourlyYesterday.length > 0) {
    console.log("Sample records:");
    hourlyYesterday.slice(0, 3).forEach((r) => {
      console.log(
        `  Hour ${r.hour}: count=${r.count}, totalKwh=${r.totalKwh}, avgCurrent=${r.avgCurrent}`
      );
    });
  }

  console.log("\n=== Checking Daily Reports ===");
  const dailyToday = await db
    .select()
    .from(dailyReportLVMDP1)
    .where(sql`${dailyReportLVMDP1.reportDate} = ${today}::date`);

  console.log(`Found ${dailyToday.length} daily records for today`);
  if (dailyToday.length > 0) {
    console.log("Daily report for today:", dailyToday[0]);
  }

  const dailyYesterday = await db
    .select()
    .from(dailyReportLVMDP1)
    .where(sql`${dailyReportLVMDP1.reportDate} = ${yesterday}::date`);

  console.log(`Found ${dailyYesterday.length} daily records for yesterday`);
  if (dailyYesterday.length > 0) {
    console.log("Daily report for yesterday:", dailyYesterday[0]);
  }

  // Check raw data
  console.log("\n=== Checking Raw Data in View ===");
  const rawDataToday = await db.execute(
    sql`SELECT COUNT(*) as count, 
            DATE(waktu AT TIME ZONE 'Asia/Jakarta') as report_date
      FROM public.v_lvmdp_1 
      WHERE DATE(waktu AT TIME ZONE 'Asia/Jakarta') = ${today}::date
      GROUP BY report_date`
  );

  console.log(
    `Raw data rows for today: ${
      Array.isArray(rawDataToday)
        ? rawDataToday.length
        : (rawDataToday as any).rows?.length || 0
    }`
  );
  const rows = Array.isArray(rawDataToday)
    ? rawDataToday
    : (rawDataToday as any).rows || [];
  rows.forEach((r: any) => console.log(`  ${r.report_date}: ${r.count} rows`));

  const rawDataYesterday = await db.execute(
    sql`SELECT COUNT(*) as count, 
            DATE(waktu AT TIME ZONE 'Asia/Jakarta') as report_date
      FROM public.v_lvmdp_1 
      WHERE DATE(waktu AT TIME ZONE 'Asia/Jakarta') = ${yesterday}::date
      GROUP BY report_date`
  );

  console.log(
    `Raw data rows for yesterday: ${
      Array.isArray(rawDataYesterday)
        ? rawDataYesterday.length
        : (rawDataYesterday as any).rows?.length || 0
    }`
  );
  const rowsYesterday = Array.isArray(rawDataYesterday)
    ? rawDataYesterday
    : (rawDataYesterday as any).rows || [];
  rowsYesterday.forEach((r: any) =>
    console.log(`  ${r.report_date}: ${r.count} rows`)
  );

  process.exit(0);
}

checkData().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
