// Check daily report data in database
import { db } from "./src/db";
import { sql } from "drizzle-orm";

async function checkDailyReport() {
  try {
    console.log("=== Checking Daily Report Data ===\n");

    // Check today's data
    const today = "2025-12-11";
    const result = await db.execute(
      sql`SELECT 
        report_date,
        shift1_avg_kwh, shift1_total_kwh, shift1_count,
        shift2_avg_kwh, shift2_total_kwh, shift2_count,
        shift3_avg_kwh, shift3_total_kwh, shift3_count
      FROM daily_report_lvmdp_1 
      WHERE report_date = ${today} 
      LIMIT 1`
    );

    if (result.rows.length > 0) {
      console.log("Database Record:");
      console.log(JSON.stringify(result.rows[0], null, 2));
    } else {
      console.log("No data found for", today);
    }

    console.log("\n=== Checking Raw Data Sample ===\n");

    // Check raw data count for Shift 1 (07:00-14:30)
    const shift1Start = `${today} 07:00:00`;
    const shift1End = `${today} 14:30:00`;

    const rawData = await db.execute(
      sql`SELECT 
        COUNT(*) as total_count,
        SUM(real_power) as sum_real_power,
        AVG(real_power) as avg_real_power,
        MIN(waktu) as first_time,
        MAX(waktu) as last_time
      FROM v_lvmdp_1 
      WHERE waktu >= ${shift1Start}::timestamp 
        AND waktu < ${shift1End}::timestamp`
    );

    console.log("Shift 1 Raw Data (07:00-14:30):");
    console.log(JSON.stringify(rawData.rows[0], null, 2));

    // Calculate what totalKwh should be
    const row = rawData.rows[0] as any;
    const totalKwh = Number(row.sum_real_power) * (3 / 3600);
    console.log("\nCalculated totalKwh = sum_real_power × (3/3600)");
    console.log(`= ${row.sum_real_power} × 0.000833`);
    console.log(`= ${totalKwh.toFixed(2)} kWh`);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkDailyReport();
