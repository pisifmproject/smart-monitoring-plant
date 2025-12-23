import { db } from "./src/db/index";
import { sql } from "drizzle-orm";

(async () => {
  console.log("=== CHECKING ALL LVMDP PANELS ===\n");

  // LVMDP 2
  const r2 = await db.execute(
    sql.raw(`
    SELECT report_date, shift1_min_current, shift1_max_current 
    FROM daily_report_lvmdp_2 
    WHERE report_date = '2025-12-19'
  `)
  );
  console.log("LVMDP 2:");
  console.log(r2.rows);

  // LVMDP 3
  const r3 = await db.execute(
    sql.raw(`
    SELECT report_date, shift1_min_current, shift1_max_current 
    FROM daily_report_lvmdp_3 
    WHERE report_date = '2025-12-19'
  `)
  );
  console.log("\nLVMDP 3:");
  console.log(r3.rows);

  // LVMDP 4
  const r4 = await db.execute(
    sql.raw(`
    SELECT report_date, shift1_min_current, shift1_max_current 
    FROM daily_report_lvmdp_4 
    WHERE report_date = '2025-12-19'
  `)
  );
  console.log("\nLVMDP 4:");
  console.log(r4.rows);

  process.exit(0);
})();
