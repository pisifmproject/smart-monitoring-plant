import { db } from "./src/db/index";
import {
  dailyReportLVMDP1,
  dailyReportLVMDP2,
  dailyReportLVMDP3,
  dailyReportLVMDP4,
} from "./src/db/schema";
import { sql } from "drizzle-orm";
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
  tableName: string;
  viewName: string;
}

const PANELS: PanelConfig[] = [
  {
    panelId: "LVMDP_1",
    tableName: "daily_report_lvmdp_1",
    viewName: "v_lvmdp_1",
  },
  {
    panelId: "LVMDP_2",
    tableName: "daily_report_lvmdp_2",
    viewName: "v_lvmdp_2",
  },
  {
    panelId: "LVMDP_3",
    tableName: "daily_report_lvmdp_3",
    viewName: "v_lvmdp_3",
  },
  {
    panelId: "LVMDP_4",
    tableName: "daily_report_lvmdp_4",
    viewName: "v_lvmdp_4",
  },
];

/**
 * Shift 3 = 22:00 - 05:59 (next day)
 * Calculate shift 3 data for a specific date
 */
async function calculateShift3Data(
  viewName: string,
  reportDate: string
): Promise<{
  shift3Count: number;
  shift3TotalKwh: number;
  shift3AvgKwh: number;
  shift3AvgCurrent: number;
  shift3MinCurrent: number;
  shift3MaxCurrent: number;
  shift3AvgCosPhi: number;
}> {
  // Shift 3: 22:00 (hari ini) - 05:59 (hari besok)
  const startDate = new Date(reportDate);
  const endDate = new Date(reportDate);
  endDate.setDate(endDate.getDate() + 1);

  const startISO = startDate.toISOString();
  const endISO = endDate.toISOString();

  const query = `
    SELECT
      COUNT(*) as count,
      SUM(CAST(real_power AS NUMERIC) * 3 / 3600) as total_kwh,
      AVG(CAST(real_power AS NUMERIC)) as avg_real_power,
      AVG(CAST(avg_current AS NUMERIC)) as avg_current,
      MIN(CAST(avg_current AS NUMERIC)) as min_current,
      MAX(CAST(avg_current AS NUMERIC)) as max_current,
      AVG(CAST(cos_phi AS NUMERIC)) as avg_cos_phi
    FROM ${viewName}
    WHERE 
      waktu AT TIME ZONE 'Asia/Jakarta' >= '${reportDate} 22:00:00'::timestamp
      AND waktu AT TIME ZONE 'Asia/Jakarta' < '${reportDate}'::date + interval '1 day' + interval '6 hours'
      AND real_power IS NOT NULL
      AND avg_current IS NOT NULL
  `;

  const result = await pool.query(query);
  const row = result.rows[0];

  return {
    shift3Count: parseInt(row.count) || 0,
    shift3TotalKwh: parseFloat(row.total_kwh) || 0,
    shift3AvgKwh: parseFloat(row.avg_real_power)
      ? (parseFloat(row.avg_real_power) * 3) / 3600
      : 0,
    shift3AvgCurrent: parseFloat(row.avg_current) || 0,
    shift3MinCurrent: parseFloat(row.min_current) || 0,
    shift3MaxCurrent: parseFloat(row.max_current) || 0,
    shift3AvgCosPhi: parseFloat(row.avg_cos_phi) || 0,
  };
}

/**
 * Get all available dates from a view
 */
async function getAvailableDates(viewName: string): Promise<string[]> {
  const query = `
    SELECT DISTINCT DATE(waktu AT TIME ZONE 'Asia/Jakarta') as date
    FROM ${viewName}
    WHERE waktu IS NOT NULL
    ORDER BY date ASC
  `;

  const result = await pool.query(query);
  return result.rows.map((r) => r.date.toISOString().split("T")[0]);
}

/**
 * Regenerate shift 3 for all dates in a panel
 */
async function regenerateShift3ForPanel(panel: PanelConfig): Promise<void> {
  console.log(`\n📊 Processing ${panel.panelId}...`);

  try {
    // Get all available dates
    const dates = await getAvailableDates(panel.viewName);
    console.log(`Found ${dates.length} dates to process`);

    let processedCount = 0;
    let errorCount = 0;

    for (const date of dates) {
      try {
        // Calculate shift 3
        const shift3Data = await calculateShift3Data(panel.viewName, date);

        // Update database
        await pool.query(
          `
          UPDATE ${panel.tableName}
          SET
            shift3_count = $1,
            shift3_total_kwh = $2,
            shift3_avg_kwh = $3,
            shift3_avg_current = $4,
            shift3_min_current = $5,
            shift3_max_current = $6,
            shift3_avg_cos_phi = $7,
            updated_at = NOW()
          WHERE report_date = $8
          `,
          [
            shift3Data.shift3Count,
            shift3Data.shift3TotalKwh,
            shift3Data.shift3AvgKwh,
            shift3Data.shift3AvgCurrent,
            shift3Data.shift3MinCurrent,
            shift3Data.shift3MaxCurrent,
            shift3Data.shift3AvgCosPhi,
            date,
          ]
        );

        processedCount++;
        if (processedCount % 10 === 0) {
          console.log(`  ✓ Processed ${processedCount}/${dates.length} dates`);
        }
      } catch (err: any) {
        console.error(
          `  ✗ Error processing date ${date}:`,
          err?.message || err
        );
        errorCount++;
      }
    }

    console.log(
      `✅ ${panel.panelId} completed: ${processedCount} success, ${errorCount} errors`
    );
  } catch (err: any) {
    console.error(`❌ Error processing ${panel.panelId}:`, err?.message || err);
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log("🔄 Starting Shift 3 Regeneration...\n");

  try {
    for (const panel of PANELS) {
      await regenerateShift3ForPanel(panel);
    }

    console.log("\n✨ All Shift 3 data regenerated successfully!");
  } catch (err: any) {
    console.error("❌ Fatal error:", err?.message || err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

main();
