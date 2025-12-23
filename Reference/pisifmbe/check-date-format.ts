import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function checkDates() {
  const result = await db.execute(
    sql`SELECT id, report_date, hour, total_kwh
      FROM hourly_report_lvmdp_1
      ORDER BY hourly_report_lvmdp_1.report_date DESC, hourly_report_lvmdp_1.hour ASC
      LIMIT 30`
  );

  const rows = Array.isArray(result) ? result : (result as any).rows || [];

  console.log("\nHourly Report Records (recent 30):");
  rows.forEach((r: any, i: number) => {
    if (i < 5) {
      console.log(
        `  report_date: ${r.report_date} (type: ${typeof r.report_date}), ` +
          `report_date::text: ${r.report_date}, ` +
          `hour: ${r.hour}, ` +
          `total_kwh: ${r.total_kwh}`
      );
    }
  });

  console.log(`\nTotal records: ${rows.length}`);

  // Now test the query
  console.log("\n=== Testing Query ===");
  const dateStr = "2025-12-22";
  const nextDay = new Date(dateStr);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().slice(0, 10);

  console.log(`Query params: dateStr="${dateStr}", nextDayStr="${nextDayStr}"`);

  const queryResult = await db.execute(
    sql`SELECT id, report_date, hour, total_kwh
      FROM hourly_report_lvmdp_1
      WHERE report_date >= ${dateStr}::date
        AND report_date < ${nextDayStr}::date
      ORDER BY hour`
  );

  const queryRows = Array.isArray(queryResult)
    ? queryResult
    : (queryResult as any).rows || [];
  console.log(`Query result count: ${queryRows.length}`);
  queryRows.forEach((r: any) => {
    console.log(`  Hour ${r.hour}: ${r.total_kwh}`);
  });

  process.exit(0);
}

checkDates().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
