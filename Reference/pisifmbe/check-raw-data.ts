import { db } from "./src/db/index";
import { sql } from "drizzle-orm";

(async () => {
  // Check raw data from view
  const result = await db.execute(
    sql.raw(`
    SELECT 
      current_r, current_s, current_t, avg_current, real_power
    FROM v_lvmdp_2 
    WHERE DATE(waktu AT TIME ZONE 'Asia/Jakarta') = '2025-12-19'
    LIMIT 5
  `)
  );

  console.log("Sample raw data from v_lvmdp_2 (2025-12-19):");
  console.log(result.rows);

  process.exit(0);
})();
