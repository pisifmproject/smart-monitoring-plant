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

/**
 * Aggregate daily data for specific panel and date using trapezoid integration
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
        kw_total,
        kvar_total,
        kva_total,
        i_r, i_s, i_t, i_avg,
        v_rs, v_st, v_tr, v_avg,
        pf_avg,
        freq,
        cos_phi,
        LAG(waktu AT TIME ZONE 'Asia/Jakarta') OVER (ORDER BY waktu) AS prev_time,
        LAG(kw_total) OVER (ORDER BY waktu) AS prev_kw
      FROM ${viewName}
      WHERE DATE(waktu AT TIME ZONE 'Asia/Jakarta') = $1
    ),
    trapezoid_integration AS (
      SELECT
        SUM(
          CASE
            WHEN prev_time IS NOT NULL AND prev_kw IS NOT NULL
            THEN (kw_total + prev_kw) / 2.0 * 
                 EXTRACT(EPOCH FROM (local_time - prev_time)) / 3600.0
            ELSE 0
          END
        ) AS energy_kwh,
        AVG(kva_total) AS avg_load_kva,
        MAX(kva_total) AS peak_demand_kva,
        AVG(v_avg) AS avg_voltage,
        AVG(i_avg) AS avg_current,
        AVG(pf_avg) AS avg_power_factor,
        AVG(freq) AS avg_freq,
        AVG(cos_phi) AS avg_cos_phi,
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
 * Generate daily aggregation for yesterday (to ensure complete 24h data)
 */
async function generateYesterdayReport() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  console.log(`[DAILY-AGGREGATION] Generating report for ${dateStr}...`);

  for (const panel of PANELS) {
    try {
      await aggregateDailyData(panel.panelId, panel.viewName, dateStr);
      console.log(`  ✅ ${panel.panelId}: Aggregated`);
    } catch (err: any) {
      console.error(`  ❌ ${panel.panelId}: Error - ${err.message}`);
    }
  }

  console.log(`[DAILY-AGGREGATION] Completed for ${dateStr}`);
}

/**
 * Schedule function to run at specific hour:minute daily
 */
function scheduleDaily(hour: number, minute: number, callback: () => void) {
  const now = new Date();
  const scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0,
    0
  );

  // If scheduled time has passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const msUntilScheduled = scheduledTime.getTime() - now.getTime();

  console.log(
    `[SCHEDULER] Daily aggregation scheduled at ${hour
      .toString()
      .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  );
  console.log(
    `[SCHEDULER] Next run in ${Math.round(
      msUntilScheduled / 1000 / 60
    )} minutes`
  );

  setTimeout(() => {
    callback();
    // Reschedule for next day (24 hours)
    setInterval(callback, 24 * 60 * 60 * 1000);
  }, msUntilScheduled);
}

/**
 * Initialize daily aggregation scheduler
 * Runs at 00:05 AM every day to aggregate yesterday's complete data
 */
export function initElectricalReportAggregation() {
  console.log(
    "[SCHEDULER] Initializing daily electrical report aggregation..."
  );

  // Schedule daily at 00:05 AM (5 minutes past midnight)
  scheduleDaily(0, 5, generateYesterdayReport);

  console.log("[SCHEDULER] Daily aggregation scheduler initialized");
}

// For manual testing: generate yesterday's report immediately
if (require.main === module) {
  generateYesterdayReport()
    .then(() => {
      console.log("✅ Manual run completed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error:", err);
      process.exit(1);
    });
}
