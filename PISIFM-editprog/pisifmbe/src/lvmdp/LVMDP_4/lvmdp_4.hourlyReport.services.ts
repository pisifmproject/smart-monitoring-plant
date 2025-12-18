// src/lvmdp/LVMDP_4/lvmdp_4.hourlyReport.services.ts
import {
  batchSaveHourlyReports,
  getHourlyReportByDate,
  getHourlyReportByRange,
  getHourlyReportByDateHour,
} from "./lvmdp_4.hourlyReport.repository";
import { db } from "../../db";
import { sql } from "drizzle-orm";
import crypto from "crypto";

/* ===========================
   OPTIMIZED: Direct DB Aggregation
   Query langsung ke view dengan GROUP BY hour
   Jauh lebih cepat daripada fetch semua lalu aggregate di memory
=========================== */

/**
 * Generate hourly aggregates langsung dari database
 * Menggunakan SQL GROUP BY untuk performa optimal
 */
export const generateHourlyReportsFromView = async (dateStr: string) => {
  console.log(`[LVMDP4 Hourly] Generating hourly reports for ${dateStr}...`);
  const t0 = Date.now();

  // Query dengan agregasi di database - SUPER CEPAT!
  // totalKwh = SUM(real_power) × (3/3600) karena sampling rate 3 detik
  const query = sql`
    SELECT 
      DATE(waktu AT TIME ZONE 'Asia/Jakarta') as report_date,
      EXTRACT(HOUR FROM waktu AT TIME ZONE 'Asia/Jakarta')::integer as hour,
      COUNT(*)::integer as count,
      (SUM(real_power::double precision) * (3.0 / 3600.0))::double precision as total_kwh,
      AVG(real_power::double precision)::double precision as avg_kwh,
      AVG(avg_current::double precision)::double precision as avg_current,
      MIN(avg_current::double precision)::double precision as min_current,
      MAX(avg_current::double precision)::double precision as max_current,
      AVG(cos_phi::double precision)::double precision as avg_cos_phi
    FROM public.v_lvmdp_4
    WHERE waktu >= ${dateStr}::date 
      AND waktu < (${dateStr}::date + interval '1 day')
    GROUP BY report_date, hour
    ORDER BY hour
  `;

  const result = await db.execute(query);
  const rows = Array.isArray(result) ? result : (result as any).rows || [];

  const t1 = Date.now();
  console.log(
    `[LVMDP4 Hourly] DB aggregation: ${t1 - t0}ms, ${rows.length} hours`
  );

  // Convert to insert format
  const now = new Date();
  const hourlyData = rows.map((row: any) => ({
    id: crypto.randomUUID(),
    reportDate: dateStr,
    hour: Number(row.hour),
    count: Number(row.count) || 0,
    totalKwh: Number(row.total_kwh) || 0,
    avgKwh: Number(row.avg_kwh) || 0,
    avgCurrent: Number(row.avg_current) || 0,
    minCurrent: Number(row.min_current) || 0,
    maxCurrent: Number(row.max_current) || 0,
    avgCosPhi: Number(row.avg_cos_phi) || 0,
    createdAt: now,
    updatedAt: now,
  }));

  // Batch save
  if (hourlyData.length > 0) {
    const t2 = Date.now();
    await batchSaveHourlyReports(hourlyData);
    const t3 = Date.now();
    console.log(
      `[LVMDP4 Hourly] Saved ${hourlyData.length} records in ${t3 - t2}ms`
    );
  }

  const totalTime = Date.now() - t0;
  console.log(`[LVMDP4 Hourly] Total time: ${totalTime}ms`);

  return hourlyData;
};

/**
 * Generate single hour report (untuk realtime/incremental updates)
 */
export const generateSingleHourReport = async (
  dateStr: string,
  hour: number
) => {
  const query = sql`
    SELECT 
      COUNT(*)::integer as count,
      (SUM(real_power::double precision) * (3.0 / 3600.0))::double precision as total_kwh,
      AVG(real_power::double precision)::double precision as avg_kwh,
      AVG(avg_current::double precision)::double precision as avg_current,
      MIN(avg_current::double precision)::double precision as min_current,
      MAX(avg_current::double precision)::double precision as max_current,
      AVG(cos_phi::double precision)::double precision as avg_cos_phi
    FROM public.v_lvmdp_4
    WHERE DATE(waktu AT TIME ZONE 'Asia/Jakarta') = ${dateStr}::date
      AND EXTRACT(HOUR FROM waktu AT TIME ZONE 'Asia/Jakarta')::integer = ${hour}
  `;

  const result = await db.execute(query);
  const rows = Array.isArray(result) ? result : (result as any).rows || [];
  const row = rows[0];

  if (!row || Number(row.count) === 0) {
    return null;
  }

  const now = new Date();
  return {
    id: crypto.randomUUID(),
    reportDate: dateStr,
    hour,
    count: Number(row.count) || 0,
    totalKwh: Number(row.total_kwh) || 0,
    avgKwh: Number(row.avg_kwh) || 0,
    avgCurrent: Number(row.avg_current) || 0,
    minCurrent: Number(row.min_current) || 0,
    maxCurrent: Number(row.max_current) || 0,
    avgCosPhi: Number(row.avg_cos_phi) || 0,
    createdAt: now,
    updatedAt: now,
  };
};

/* ===========================
   FETCH functions - SUPER FAST!
   Data sudah pre-aggregated, query < 10ms
=========================== */

/**
 * Fetch hourly data for a specific date
 * FAST: hanya query tabel kecil (24 rows max per hari)
 */
export const fetchHourlyReportByDate = async (dateStr: string) => {
  const result = await getHourlyReportByDate(dateStr);

  // Ensure all 24 hours are present (fill missing with zeros)
  const hourMap = new Map(result.map((r) => [r.hour, r]));
  const complete = [];

  for (let h = 0; h < 24; h++) {
    if (hourMap.has(h)) {
      complete.push(hourMap.get(h)!);
    } else {
      complete.push({
        id: "",
        reportDate: dateStr,
        hour: h,
        count: 0,
        totalKwh: 0,
        avgKwh: 0,
        avgCurrent: 0,
        avgCosPhi: 0,
        createdAt: null,
        updatedAt: null,
      });
    }
  }

  return complete;
};

/**
 * Fetch hourly data for date range
 */
export const fetchHourlyReportByRange = async (
  startDate: string,
  endDate: string
) => {
  return await getHourlyReportByRange(startDate, endDate);
};

/**
 * Fetch specific hour
 */
export const fetchHourlyReportByDateHour = async (
  dateStr: string,
  hour: number
) => {
  return await getHourlyReportByDateHour(dateStr, hour);
};
