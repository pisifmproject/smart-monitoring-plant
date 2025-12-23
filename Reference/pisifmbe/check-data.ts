import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function checkDatabase() {
  console.log("=== Checking Database ===\n");

  // Check daily report
  console.log("1. Daily Report LVMDP 2 (2025-12-19):");
  const dailyReport = await db.execute(
    sql`SELECT 
        report_date,
        shift1_min_current,
        shift1_max_current,
        shift1_avg_current,
        shift2_min_current,
        shift2_max_current,
        shift2_avg_current,
        shift3_min_current,
        shift3_max_current,
        shift3_avg_current
      FROM daily_report_lvmdp_2 
      WHERE report_date = '2025-12-19'`
  );
  console.log(JSON.stringify(dailyReport, null, 2));

  // Check hourly report
  console.log("\n2. Hourly Report LVMDP 2 (2025-12-19):");
  const hourlyReport = await db.execute(
    sql`SELECT 
        report_date,
        hour,
        min_current,
        max_current,
        avg_current
      FROM hourly_report_lvmdp_2 
      WHERE report_date = '2025-12-19'
      ORDER BY hour
      LIMIT 5`
  );
  console.log(JSON.stringify(hourlyReport, null, 2));

  // Check raw data from view
  console.log("\n3. Raw Data from v_lvmdp_2 (sample):");
  const rawData = await db.execute(
    sql`SELECT 
        waktu,
        current_r,
        current_s,
        current_t,
        avg_current
      FROM v_lvmdp_2
      WHERE DATE(waktu) = '2025-12-19'
      LIMIT 5`
  );
  console.log(JSON.stringify(rawData, null, 2));

  process.exit(0);
}

checkDatabase().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
