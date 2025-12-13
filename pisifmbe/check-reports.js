const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "pisifmdb",
  user: "postgres",
  password: "Indofood00",
});

async function checkReports() {
  try {
    const result = await pool.query(`
      SELECT report_date, panel_id, energy_kwh 
      FROM daily_electrical_reports 
      WHERE report_date >= '2025-12-12' 
      ORDER BY report_date DESC 
      LIMIT 20
    `);

    console.log(`Found ${result.rows.length} records:`);
    result.rows.forEach((row) => {
      console.log(
        `Date: ${row.report_date}, Panel: ${row.panel_id}, Energy: ${row.energy_kwh} kWh`
      );
    });

    // Check if 2025-12-13 exists
    const today = await pool.query(`
      SELECT COUNT(*) as count 
      FROM daily_electrical_reports 
      WHERE report_date = '2025-12-13'
    `);

    console.log(`\nReports for 2025-12-13: ${today.rows[0].count} panels`);
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await pool.end();
  }
}

checkReports();
