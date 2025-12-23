import { db } from "./src/db/index";
import { sql } from "drizzle-orm";

(async () => {
  console.log("=== FINAL VERIFICATION - ALL LVMDP PANELS ===\n");

  for (let i = 1; i <= 4; i++) {
    const result = await db.execute(
      sql.raw(`
      SELECT 
        report_date,
        shift1_min_current, shift1_max_current,
        shift2_min_current, shift2_max_current,
        shift3_min_current, shift3_max_current
      FROM daily_report_lvmdp_${i}
      WHERE report_date = '2025-12-19'
    `)
    );

    if (result.rows.length > 0) {
      const r = result.rows[0];
      console.log(`LVMDP ${i} (2025-12-19):`);
      console.log(
        `  Shift 1: min=${r.shift1_min_current}, max=${r.shift1_max_current}`
      );
      console.log(
        `  Shift 2: min=${r.shift2_min_current}, max=${r.shift2_max_current}`
      );
      console.log(
        `  Shift 3: min=${r.shift3_min_current}, max=${r.shift3_max_current}`
      );
    }
    console.log("");
  }

  process.exit(0);
})();
