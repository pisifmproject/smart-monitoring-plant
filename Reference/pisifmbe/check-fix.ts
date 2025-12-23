import { db } from "./src/db/index";
import { sql } from "drizzle-orm";

(async () => {
  console.log("=== VERIFYING MIN/MAX CURRENT FIX ===\n");

  const result1 = await db.execute(
    sql.raw(`
    SELECT 
      report_date,
      shift1_min_current, shift1_max_current,
      shift2_min_current, shift2_max_current,
      shift3_min_current, shift3_max_current
    FROM daily_report_lvmdp_1
    WHERE report_date = '2025-12-19'
  `)
  );

  console.log("LVMDP 1 Daily Report (2025-12-19):");
  console.log(result1.rows);

  const result2 = await db.execute(
    sql.raw(`
    SELECT 
      report_date,
      shift1_min_current, shift1_max_current
    FROM daily_report_lvmdp_2
    WHERE report_date = '2025-12-19'
  `)
  );

  console.log("\nLVMDP 2 Daily Report (2025-12-19):");
  console.log(result2.rows);

  const result3 = await db.execute(
    sql.raw(`
    SELECT 
      report_date,
      hour,
      min_current, max_current
    FROM hourly_report_lvmdp_1
    WHERE report_date = '2025-12-19' AND hour IN (0, 6, 12, 18)
    ORDER BY hour
  `)
  );

  console.log("\nLVMDP 1 Hourly Report (2025-12-19, hours 0, 6, 12, 18):");
  console.log(result3.rows);

  process.exit(0);
})();
