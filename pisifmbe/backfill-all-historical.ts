import { db } from "./src/db/index";
import { sql } from "drizzle-orm";
import pg from "pg";

const { Pool } = pg;

// Connection using credentials
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
  capacityKva: number;
}

const PANELS: PanelConfig[] = [
  { panelId: "LVMDP_1", viewName: "v_lvmdp_1", capacityKva: 1000 },
  { panelId: "LVMDP_2", viewName: "v_lvmdp_2", capacityKva: 1000 },
  { panelId: "LVMDP_3", viewName: "v_lvmdp_3", capacityKva: 2000 },
  { panelId: "LVMDP_4", viewName: "v_lvmdp_4", capacityKva: 1540 },
];

/**
 * Get all distinct dates from a view
 */
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

/**
 * Aggregate daily data for specific panel and date
 */
async function aggregateDailyData(
  panelId: string,
  viewName: string,
  reportDate: string
): Promise<void> {
  const query = `
    WITH hourly_data AS (
      SELECT
        waktu AT TIME ZONE 'Asia/Jakarta' AS local_time,
        real_power::numeric AS kw_total,
        avg_line_line::numeric AS v_avg,
        avg_current::numeric AS i_avg,
        current_r::numeric AS i_r,
        current_s::numeric AS i_s,
        current_t::numeric AS i_t,
        cos_phi::numeric AS power_factor,
        freq::numeric AS frequency,
        LAG(waktu AT TIME ZONE 'Asia/Jakarta') OVER (ORDER BY waktu) AS prev_time,
        LAG(real_power::numeric) OVER (ORDER BY waktu) AS prev_kw
      FROM ${viewName}
      WHERE DATE(waktu AT TIME ZONE 'Asia/Jakarta') = $1
        AND real_power IS NOT NULL AND real_power != ''
        AND avg_line_line IS NOT NULL AND avg_line_line != ''
        AND avg_current IS NOT NULL AND avg_current != ''
    ),
    trapezoid_integration AS (
      SELECT
        -- Energy calculation using trapezoid rule: Area = (y1 + y2) * (t2 - t1) / 2
        SUM(
          CASE
            WHEN prev_time IS NOT NULL AND prev_kw IS NOT NULL
            THEN (kw_total + prev_kw) / 2.0 * 
                 EXTRACT(EPOCH FROM (local_time - prev_time)) / 3600.0
            ELSE 0
          END
        ) AS energy_kwh,
        AVG(kw_total) AS avg_load_kva,
        MAX(kw_total) AS peak_demand_kva,
        AVG(v_avg) AS avg_voltage,
        AVG(i_avg) AS avg_current,
        AVG(power_factor) AS avg_power_factor,
        AVG(frequency) AS avg_freq,
        AVG(power_factor) AS avg_cos_phi,
        MIN(i_r) AS min_current_r,
        MAX(i_r) AS max_current_r,
        MIN(i_s) AS min_current_s,
        MAX(i_s) AS max_current_s,
        MIN(i_t) AS min_current_t,
        MAX(i_t) AS max_current_t,
        COUNT(*) AS data_points
      FROM hourly_data
    )
    INSERT INTO daily_electrical_reports (
      report_date, panel_id, 
      energy_kwh, avg_load_kva, peak_demand_kva,
      avg_voltage, avg_current, avg_power_factor, avg_frequency, avg_cos_phi,
      min_current_r, max_current_r,
      min_current_s, max_current_s,
      min_current_t, max_current_t,
      data_points, created_at, updated_at
    )
    SELECT
      $1::date, $2,
      COALESCE(energy_kwh, 0),
      COALESCE(avg_load_kva, 0),
      COALESCE(peak_demand_kva, 0),
      COALESCE(avg_voltage, 0),
      COALESCE(avg_current, 0),
      COALESCE(avg_power_factor, 0),
      COALESCE(avg_freq, 0),
      COALESCE(avg_cos_phi, 0),
      COALESCE(min_current_r, 0),
      COALESCE(max_current_r, 0),
      COALESCE(min_current_s, 0),
      COALESCE(max_current_s, 0),
      COALESCE(min_current_t, 0),
      COALESCE(max_current_t, 0),
      data_points,
      NOW(), NOW()
    FROM trapezoid_integration
    ON CONFLICT (report_date, panel_id) 
    DO UPDATE SET
      energy_kwh = EXCLUDED.energy_kwh,
      avg_load_kva = EXCLUDED.avg_load_kva,
      peak_demand_kva = EXCLUDED.peak_demand_kva,
      avg_voltage = EXCLUDED.avg_voltage,
      avg_current = EXCLUDED.avg_current,
      avg_power_factor = EXCLUDED.avg_power_factor,
      avg_frequency = EXCLUDED.avg_frequency,
      avg_cos_phi = EXCLUDED.avg_cos_phi,
      min_current_r = EXCLUDED.min_current_r,
      max_current_r = EXCLUDED.max_current_r,
      min_current_s = EXCLUDED.min_current_s,
      max_current_s = EXCLUDED.max_current_s,
      min_current_t = EXCLUDED.min_current_t,
      max_current_t = EXCLUDED.max_current_t,
      data_points = EXCLUDED.data_points,
      updated_at = NOW()
  `;

  await pool.query(query, [reportDate, panelId]);
}

/**
 * Backfill all historical data from all LVMDP views
 */
async function backfillAllHistoricalData() {
  console.log("🔄 Starting backfill of all historical data...\n");

  for (const panel of PANELS) {
    console.log(`📊 Processing ${panel.panelId} (${panel.viewName})...`);

    // Get all available dates from this view
    const dates = await getAvailableDatesFromView(panel.viewName);
    console.log(`   Found ${dates.length} dates with data`);

    if (dates.length === 0) {
      console.log(`   ⚠️  No data found in ${panel.viewName}\n`);
      continue;
    }

    // Aggregate data for each date
    let successCount = 0;
    let errorCount = 0;

    for (const date of dates) {
      try {
        await aggregateDailyData(panel.panelId, panel.viewName, date);
        successCount++;
        process.stdout.write(
          `\r   Progress: ${successCount}/${dates.length} dates processed`
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
      SUM(energy_kwh) as total_energy_kwh
    FROM daily_electrical_reports
    GROUP BY panel_id
    ORDER BY panel_id
  `;

  const summary = await pool.query(summaryQuery);
  console.log("📈 Summary of daily_electrical_reports table:");
  console.table(summary.rows);
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
