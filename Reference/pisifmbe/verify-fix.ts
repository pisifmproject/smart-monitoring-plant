import { db } from "./src/db/index";
import { sql } from "drizzle-orm";

(async () => {
  console.log("=== VERIFYING MIN/MAX CURRENT FIX ===\n");

  // Check daily reports for all LVMDP panels
  const tables = [
    "daily_report_lvmdp_1",
    "daily_report_lvmdp_2",
    "daily_report_lvmdp_3",
    "daily_report_lvmdp_4",
  ];

  for (let i = 0; i < tables.length; i++) {
    const result = await db.execute(
      sql.raw(`
      SELECT 
        date,
        shift1_min_current, shift1_max_current,
        shift2_min_current, shift2_max_current,
        shift3_min_current, shift3_max_current
      FROM ${tables[i]}
      WHERE date IN ('2025-12-18', '2025-12-19', '2025-12-20')
      ORDER BY date
      LIMIT 1;
    `)
    );

    console.log(`LVMDP ${i + 1} Daily Report Sample:`);
    console.log(result.rows);
    console.log("");
  }

  // Check hourly reports for LVMDP 1
  const hourlyResult = await db.execute(
    sql.raw(`
    SELECT 
      date,
      hour,
      min_current, max_current
    FROM hourly_report_lvmdp_1
    WHERE date = '2025-12-19' AND hour IN (0, 6, 12, 18)
    ORDER BY hour;
  `)
  );

  console.log("LVMDP 1 Hourly Report (2025-12-19)");
  console.log(hourlyResult.rows);
  console.log("");

  process.exit(0);
})();
