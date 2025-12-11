// Quick script to check hourly report data in database
require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkData() {
  try {
    console.log("Checking hourly report data...\n");

    // Check latest hourly reports
    const result = await pool.query(`
      SELECT 
        report_date,
        hour,
        avg_current,
        min_current,
        max_current,
        count
      FROM hourly_report_lvmdp_1
      ORDER BY report_date DESC, hour DESC
      LIMIT 10
    `);

    console.log("Latest 10 hourly records from hourly_report_lvmdp_1:");
    console.log("====================================================");
    result.rows.forEach((row) => {
      console.log(`Date: ${row.report_date}, Hour: ${row.hour}`);
      console.log(`  Avg Current: ${row.avg_current}`);
      console.log(`  Min Current: ${row.min_current}`);
      console.log(`  Max Current: ${row.max_current}`);
      console.log(`  Count: ${row.count}`);
      console.log("---");
    });

    // Check if any records have non-zero min/max
    const hasData = await pool.query(`
      SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN min_current > 0 THEN 1 END) as records_with_min,
        COUNT(CASE WHEN max_current > 0 THEN 1 END) as records_with_max
      FROM hourly_report_lvmdp_1
      WHERE report_date = (SELECT MAX(report_date) FROM hourly_report_lvmdp_1)
    `);

    console.log("\nSummary for latest date:");
    console.log("========================");
    console.log(`Total records: ${hasData.rows[0].total_records}`);
    console.log(
      `Records with min_current > 0: ${hasData.rows[0].records_with_min}`
    );
    console.log(
      `Records with max_current > 0: ${hasData.rows[0].records_with_max}`
    );
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await pool.end();
  }
}

checkData();
