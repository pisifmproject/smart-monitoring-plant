import { db } from "./src/db/index";
import { sql } from "drizzle-orm";

(async () => {
  console.log("=== CHECKING HOURLY REPORTS ===\n");

  for (let i = 2; i <= 4; i++) {
    const result = await db.execute(
      sql.raw(`
      SELECT hour, min_current, max_current 
      FROM hourly_report_lvmdp_${i} 
      WHERE report_date = '2025-12-19' AND hour IN (0, 6, 12)
      ORDER BY hour
    `)
    );
    console.log(`LVMDP ${i} Hourly (2025-12-19):`);
    console.log(result.rows);
    console.log("");
  }

  process.exit(0);
})();
