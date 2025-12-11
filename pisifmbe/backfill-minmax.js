// Script untuk regenerate historical data dengan min/max current
// Dipakai untuk backfill data lama yang belum punya min/max

const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "pisifmdb",
  user: "postgres",
  password: "Indofood00",
});

async function backfillMinMax() {
  try {
    console.log("🔄 Starting backfill of min/max current data...\n");

    // Register ts-node
    const path = require("path");
    const tsNode = require("ts-node");

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

    // Get list of dates that have data but min_current = 0
    const datesQuery = `
      SELECT DISTINCT report_date 
      FROM hourly_report_lvmdp_1
      WHERE min_current = 0 
        AND avg_current > 0
      ORDER BY report_date DESC
      LIMIT 30
    `;

    const datesResult = await pool.query(datesQuery);
    const dates = datesResult.rows.map((r) => r.report_date);

    if (dates.length === 0) {
      console.log("✅ No dates need backfilling. All data is up to date!");
      await pool.end();
      process.exit(0);
    }

    console.log(`Found ${dates.length} dates needing backfill:\n`);
    dates.forEach((d, i) => {
      console.log(`  ${i + 1}. ${d}`);
    });

    console.log("\n📊 Starting regeneration...\n");

    let completed = 0;
    for (const dateStr of dates) {
      try {
        console.log(
          `[${completed + 1}/${dates.length}] Processing ${dateStr}...`
        );

        await Promise.all([
          gen1(dateStr),
          gen2(dateStr),
          gen3(dateStr),
          gen4(dateStr),
        ]);

        completed++;
        console.log(`  ✅ Completed ${dateStr}\n`);
      } catch (err) {
        console.error(`  ❌ Error processing ${dateStr}:`, err.message);
      }
    }

    console.log(
      `\n✅ Backfill complete! Processed ${completed}/${dates.length} dates.\n`
    );

    // Verify
    console.log("🔍 Final verification...\n");
    const verifyQuery = `
      SELECT 
        COUNT(*) as total_records,
        COUNT(*) FILTER (WHERE min_current > 0) as records_with_min,
        COUNT(*) FILTER (WHERE min_current = 0 AND avg_current > 0) as records_missing_min
      FROM hourly_report_lvmdp_1
    `;

    const verify = await pool.query(verifyQuery);
    const stats = verify.rows[0];

    console.log("Database statistics:");
    console.log(`  Total records: ${stats.total_records}`);
    console.log(`  Records with min/max: ${stats.records_with_min}`);
    console.log(`  Records missing min/max: ${stats.records_missing_min}`);

    if (Number(stats.records_missing_min) === 0) {
      console.log("\n✅ All records now have min/max current data!");
    } else {
      console.log(
        `\n⚠️  Still ${stats.records_missing_min} records without min/max.`
      );
      console.log("   These may be dates without actual current data.");
    }

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Fatal error:", err.message);
    console.error(err);
    await pool.end();
    process.exit(1);
  }
}

backfillMinMax();
