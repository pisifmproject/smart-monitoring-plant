// src/electricalReport/electricalReport.repository.ts
import { db } from "../db";
import { dailyElectricalReports } from "../db/schema";
import { sql, eq, and, gte, lte, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Repository for electrical reporting system
 * Handles raw data aggregation and pre-aggregated report storage
 */

interface RawElectricalData {
  real_power: number;
  voltage: number;
  current: number;
  cos_phi: number;
  waktu: Date;
}

interface DailyReportData {
  panelId: string;
  reportDate: string;
  energyKwh: number;
  avgLoadKw: number;
  peakDemandKw: number;
  peakDemandTime: Date | null;
  avgVoltage: number;
  minVoltage: number;
  maxVoltage: number;
  avgCurrent: number;
  maxCurrent: number;
  avgPowerFactor: number;
  sampleCount: number;
  dataCompletenessPercent: number;
}

/**
 * Aggregate raw LVMDP data into daily report using trapezoid integration
 * @param panelId - Panel identifier (LVMDP_1, LVMDP_2, etc.)
 * @param viewName - Database view name (v_lvmdp_1, etc.)
 * @param reportDate - Date to aggregate (YYYY-MM-DD)
 */
export async function aggregateDailyData(
  panelId: string,
  viewName: string,
  reportDate: string
): Promise<DailyReportData | null> {
  try {
    const result = await db.execute(sql`
      WITH time_bounds AS (
        SELECT 
          DATE_TRUNC('day', ${reportDate}::timestamp) AS start_time,
          DATE_TRUNC('day', ${reportDate}::timestamp) + INTERVAL '1 day' - INTERVAL '1 second' AS end_time
      ),
      ordered_data AS (
        SELECT 
          real_power::numeric AS real_power,
          avg_line_line::numeric AS voltage,
          avg_current::numeric AS current,
          cos_phi::numeric AS cos_phi,
          waktu,
          LAG(real_power::numeric) OVER (ORDER BY waktu) AS prev_power,
          LAG(waktu) OVER (ORDER BY waktu) AS prev_time
        FROM ${sql.identifier(viewName)}
        CROSS JOIN time_bounds
        WHERE waktu >= time_bounds.start_time 
          AND waktu <= time_bounds.end_time
          AND real_power IS NOT NULL AND real_power != ''
          AND avg_line_line IS NOT NULL AND avg_line_line != ''
          AND avg_current IS NOT NULL AND avg_current != ''
          AND cos_phi IS NOT NULL AND cos_phi != ''
        ORDER BY waktu
      ),
      energy_calc AS (
        SELECT 
          -- Trapezoid integration for energy
          SUM(
            CASE 
              WHEN prev_power IS NOT NULL AND prev_time IS NOT NULL THEN
                ((real_power + prev_power) / 2.0) * 
                (EXTRACT(EPOCH FROM (waktu - prev_time)) / 3600.0)
              ELSE 0
            END
          ) AS total_energy_kwh,
          
          -- Power metrics
          AVG(real_power) AS avg_load_kw,
          MAX(real_power) AS peak_demand_kw,
          
          -- Voltage quality
          AVG(voltage) AS avg_voltage,
          MIN(voltage) AS min_voltage,
          MAX(voltage) AS max_voltage,
          
          -- Current
          AVG(current) AS avg_current,
          MAX(current) AS max_current,
          
          -- Weighted power factor: sum(pf * kW) / sum(kW)
          SUM(cos_phi * real_power) / NULLIF(SUM(real_power), 0) AS avg_power_factor,
          
          -- Data quality
          COUNT(*) AS sample_count
        FROM ordered_data
      ),
      peak_time AS (
        SELECT waktu AS peak_demand_time
        FROM ordered_data
        ORDER BY real_power DESC
        LIMIT 1
      ),
      expected_samples AS (
        SELECT 
          -- Assuming 5-second sampling: 86400 / 5 = 17280 samples per day
          17280 AS expected_count
      )
      SELECT 
        e.total_energy_kwh,
        e.avg_load_kw,
        e.peak_demand_kw,
        p.peak_demand_time,
        e.avg_voltage,
        e.min_voltage,
        e.max_voltage,
        e.avg_current,
        e.max_current,
        e.avg_power_factor,
        e.sample_count,
        (e.sample_count::float / es.expected_count * 100) AS data_completeness_percent
      FROM energy_calc e
      CROSS JOIN peak_time p
      CROSS JOIN expected_samples es
    `);

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0] as any;

    // Convert peak_demand_time to proper Date object if exists
    let peakDemandTime: Date | null = null;
    if (row.peak_demand_time) {
      peakDemandTime =
        row.peak_demand_time instanceof Date
          ? row.peak_demand_time
          : new Date(row.peak_demand_time);
    }

    return {
      panelId,
      reportDate,
      energyKwh: Number(row.total_energy_kwh) || 0,
      avgLoadKw: Number(row.avg_load_kw) || 0,
      peakDemandKw: Number(row.peak_demand_kw) || 0,
      peakDemandTime,
      avgVoltage: Number(row.avg_voltage) || 0,
      minVoltage: Number(row.min_voltage) || 0,
      maxVoltage: Number(row.max_voltage) || 0,
      avgCurrent: Number(row.avg_current) || 0,
      maxCurrent: Number(row.max_current) || 0,
      avgPowerFactor: Number(row.avg_power_factor) || 0,
      sampleCount: Number(row.sample_count) || 0,
      dataCompletenessPercent: Number(row.data_completeness_percent) || 0,
    };
  } catch (error) {
    console.error(`Error aggregating daily data for ${panelId}:`, error);
    return null;
  }
}

/**
 * Save aggregated daily report to database
 */
export async function saveDailyReport(data: DailyReportData): Promise<void> {
  await db
    .insert(dailyElectricalReports)
    .values({
      id: nanoid(),
      panelId: data.panelId,
      reportDate: data.reportDate,
      energyKwh: data.energyKwh,
      avgLoadKw: data.avgLoadKw,
      peakDemandKw: data.peakDemandKw,
      peakDemandTime: data.peakDemandTime,
      avgVoltage: data.avgVoltage,
      minVoltage: data.minVoltage,
      maxVoltage: data.maxVoltage,
      avgCurrent: data.avgCurrent,
      maxCurrent: data.maxCurrent,
      avgPowerFactor: data.avgPowerFactor,
      sampleCount: data.sampleCount,
      dataCompletenessPercent: data.dataCompletenessPercent,
    })
    .onConflictDoUpdate({
      target: [
        dailyElectricalReports.panelId,
        dailyElectricalReports.reportDate,
      ],
      set: {
        energyKwh: data.energyKwh,
        avgLoadKw: data.avgLoadKw,
        peakDemandKw: data.peakDemandKw,
        peakDemandTime: data.peakDemandTime,
        avgVoltage: data.avgVoltage,
        minVoltage: data.minVoltage,
        maxVoltage: data.maxVoltage,
        avgCurrent: data.avgCurrent,
        maxCurrent: data.maxCurrent,
        avgPowerFactor: data.avgPowerFactor,
        sampleCount: data.sampleCount,
        dataCompletenessPercent: data.dataCompletenessPercent,
        updatedAt: sql`now()`,
      },
    });
}

/**
 * Get daily reports for a specific date range
 */
export async function getDailyReports(
  startDate: string,
  endDate: string
): Promise<DailyReportData[]> {
  const results = await db
    .select()
    .from(dailyElectricalReports)
    .where(
      and(
        gte(dailyElectricalReports.reportDate, startDate),
        lte(dailyElectricalReports.reportDate, endDate)
      )
    )
    .orderBy(dailyElectricalReports.reportDate, dailyElectricalReports.panelId);

  return results.map((row) => ({
    panelId: row.panelId,
    reportDate: row.reportDate,
    energyKwh: row.energyKwh,
    avgLoadKw: row.avgLoadKw,
    peakDemandKw: row.peakDemandKw,
    peakDemandTime: row.peakDemandTime,
    avgVoltage: row.avgVoltage,
    minVoltage: row.minVoltage,
    maxVoltage: row.maxVoltage,
    avgCurrent: row.avgCurrent,
    maxCurrent: row.maxCurrent,
    avgPowerFactor: row.avgPowerFactor,
    sampleCount: row.sampleCount,
    dataCompletenessPercent: row.dataCompletenessPercent,
  }));
}

/**
 * Get latest report for a specific panel
 */
export async function getLatestReport(
  panelId: string
): Promise<DailyReportData | null> {
  const results = await db
    .select()
    .from(dailyElectricalReports)
    .where(eq(dailyElectricalReports.panelId, panelId))
    .orderBy(desc(dailyElectricalReports.reportDate))
    .limit(1);

  if (results.length === 0) return null;

  const row = results[0];
  return {
    panelId: row.panelId,
    reportDate: row.reportDate,
    energyKwh: row.energyKwh,
    avgLoadKw: row.avgLoadKw,
    peakDemandKw: row.peakDemandKw,
    peakDemandTime: row.peakDemandTime,
    avgVoltage: row.avgVoltage,
    minVoltage: row.minVoltage,
    maxVoltage: row.maxVoltage,
    avgCurrent: row.avgCurrent,
    maxCurrent: row.maxCurrent,
    avgPowerFactor: row.avgPowerFactor,
    sampleCount: row.sampleCount,
    dataCompletenessPercent: row.dataCompletenessPercent,
  };
}

/**
 * Check if report exists for a specific date and panel
 */
export async function reportExists(
  panelId: string,
  reportDate: string
): Promise<boolean> {
  const results = await db
    .select({ count: sql`count(*)` })
    .from(dailyElectricalReports)
    .where(
      and(
        eq(dailyElectricalReports.panelId, panelId),
        eq(dailyElectricalReports.reportDate, reportDate)
      )
    );

  return Number(results[0]?.count) > 0;
}
