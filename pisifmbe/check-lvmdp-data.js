// Check LVMDP data count
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    const tables = ["v_lvmdp_1", "v_lvmdp_2", "v_lvmdp_3", "v_lvmdp_4"];

    console.log("Checking LVMDP data count (last 7 days):\n");

    for (const table of tables) {
      const query = `SELECT COUNT(*) as count FROM public.${table} WHERE waktu >= CURRENT_DATE - interval '7 days'`;
      const result = await pool.query(query);
      console.log(`${table}: ${result.rows[0].count} records`);
    }

    console.log("\nChecking today data count:\n");

    for (const table of tables) {
      const query = `SELECT COUNT(*) as count FROM public.${table} WHERE waktu >= CURRENT_DATE`;
      const result = await pool.query(query);
      console.log(`${table}: ${result.rows[0].count} records today`);
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
})();
