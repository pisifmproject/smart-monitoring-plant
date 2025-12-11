// Script untuk regenerate hourly report hari ini
// Mengatasi masalah min_current dan max_current yang tidak tersimpan

const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "pisifmdb",
  user: "postgres",
  password: "Indofood00",
});

async function regenerateToday() {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];
    console.log(`Regenerating hourly reports for: ${today}\n`);

    // Import the generate functions
    const path = require("path");
    const tsNode = require("ts-node");

    // Register ts-node
    tsNode.register({
      project: path.join(__dirname, "tsconfig.json"),
      transpileOnly: true,
    });

    const {
      generateHourlyReportsFromView: gen1,
    } = require("./src/lvmdp/LVMDP_1/lvmdp_1.hourlyReport.services");
    const {
      generateHourlyReportsFromView: gen2,
    } = require("./src/lvmdp/LVMDP_2/lvmdp_2.hourlyReport.services");
    const {
      generateHourlyReportsFromView: gen3,
    } = require("./src/lvmdp/LVMDP_3/lvmdp_3.hourlyReport.services");
    const {
      generateHourlyReportsFromView: gen4,
    } = require("./src/lvmdp/LVMDP_4/lvmdp_4.hourlyReport.services");

    console.log("Generating reports for all 4 LVMDP panels...\n");

    // Generate untuk semua mesin
    await Promise.all([gen1(today), gen2(today), gen3(today), gen4(today)]);

    console.log("\n✅ Successfully regenerated all hourly reports!");

    // Verify data
    console.log("\n🔍 Verifying data...\n");

    const verifyQuery = `
      SELECT 
        report_date,
        hour,
        avg_current,
        min_current,
        max_current
      FROM hourly_report_lvmdp_1
      WHERE report_date = $1
        AND min_current > 0
      ORDER BY hour DESC
      LIMIT 5
    `;

    const result = await pool.query(verifyQuery, [today]);

    if (result.rows.length > 0) {
      console.log("✅ Data verification passed! Sample records:");
      result.rows.forEach((row) => {
        console.log(
          `  Hour ${row.hour}: Avg=${row.avg_current.toFixed(
            2
          )}A, Min=${row.min_current.toFixed(
            2
          )}A, Max=${row.max_current.toFixed(2)}A`
        );
      });
    } else {
      console.log("⚠️  No records with min_current > 0 found yet.");
      console.log(
        "   This might be normal if there's no data for today or if all currents are 0."
      );
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err);
    process.exit(1);
  }
}

regenerateToday();
