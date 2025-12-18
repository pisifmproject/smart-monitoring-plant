import {
  aggregateDailyData,
  saveDailyReport,
} from "./src/electricalReport/electricalReport.repository";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pisifmdb",
  password: "Indofood00",
  port: 5432,
});

interface PanelConfig {
  panelId: string;
  viewName: string;
}

const PANELS: PanelConfig[] = [
  { panelId: "LVMDP_1", viewName: "v_lvmdp_1" },
  { panelId: "LVMDP_2", viewName: "v_lvmdp_2" },
  { panelId: "LVMDP_3", viewName: "v_lvmdp_3" },
  { panelId: "LVMDP_4", viewName: "v_lvmdp_4" },
];

async function getAvailableDatesFromView(viewName: string): Promise<string[]> {
  const query = `
    SELECT DISTINCT DATE(waktu AT TIME ZONE 'Asia/Jakarta') as date
    FROM ${viewName}
    WHERE waktu IS NOT NULL
    ORDER BY date DESC
  `;

  const result = await pool.query(query);
  return result.rows.map((r) => r.date.toISOString().split("T")[0]);
}

async function backfillAllHistoricalData() {
  console.log("🔄 Starting backfill of all historical data...\n");

  for (const panel of PANELS) {
    console.log(`📊 Processing ${panel.panelId} (${panel.viewName})...`);

    const dates = await getAvailableDatesFromView(panel.viewName);
    console.log(`   Found ${dates.length} dates with data`);

    if (dates.length === 0) {
      console.log(`   ⚠️  No data found in ${panel.viewName}\n`);
      continue;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const date of dates) {
      try {
        // Use existing repository function (already handles correct column names)
        const aggregatedData = await aggregateDailyData(
          panel.panelId,
          panel.viewName,
          date
        );

        if (aggregatedData) {
          await saveDailyReport(aggregatedData);
          successCount++;
        } else {
          errorCount++;
        }

        process.stdout.write(
          `\r   Progress: ${successCount + errorCount}/${
            dates.length
          } dates processed`
        );
      } catch (err: any) {
        errorCount++;
        console.error(`\n   ❌ Error processing ${date}:`, err.message);
      }
    }

    console.log(
      `\n   ✅ Completed ${panel.panelId}: ${successCount} success, ${errorCount} errors\n`
    );
  }

  console.log("✨ Backfill completed!\n");

  // Show summary
  const summaryQuery = `
    SELECT 
      panel_id,
      COUNT(*) as total_reports,
      MIN(report_date) as earliest_date,
      MAX(report_date) as latest_date,
      ROUND(SUM(energy_kwh)::numeric, 2) as total_energy_kwh
    FROM daily_electrical_reports
    GROUP BY panel_id
    ORDER BY panel_id
  `;

  const summary = await pool.query(summaryQuery);
  console.log("📈 Summary of daily_electrical_reports table:");
  console.table(summary.rows);

  await pool.end();
}

// Run backfill
backfillAllHistoricalData()
  .then(() => {
    console.log("✅ Done!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Fatal error:", err);
    process.exit(1);
  });
