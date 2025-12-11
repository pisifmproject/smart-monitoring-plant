"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHourlyReportByDateHour = exports.fetchHourlyReportByRange = exports.fetchHourlyReportByDate = exports.generateSingleHourReport = exports.generateHourlyReportsFromView = void 0;
// src/lvmdp/LVMDP_2/lvmdp_2.hourlyReport.services.ts
const lvmdp_2_hourlyReport_repository_1 = require("./lvmdp_2.hourlyReport.repository");
const db_1 = require("../../db");
const drizzle_orm_1 = require("drizzle-orm");
const crypto_1 = __importDefault(require("crypto"));
/* ===========================
   OPTIMIZED: Direct DB Aggregation
   Query langsung ke view dengan GROUP BY hour
   Jauh lebih cepat daripada fetch semua lalu aggregate di memory
=========================== */
/**
 * Generate hourly aggregates langsung dari database
 * Menggunakan SQL GROUP BY untuk performa optimal
 */
const generateHourlyReportsFromView = async (dateStr) => {
    console.log(`[LVMDP2 Hourly] Generating hourly reports for ${dateStr}...`);
    const t0 = Date.now();
    // Query dengan agregasi di database - SUPER CEPAT!
    // totalKwh = SUM(real_power) × (3/3600) karena sampling rate 3 detik
    const query = (0, drizzle_orm_1.sql) `
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
    FROM public.v_lvmdp_2
    WHERE waktu >= ${dateStr}::date 
      AND waktu < (${dateStr}::date + interval '1 day')
    GROUP BY report_date, hour
    ORDER BY hour
  `;
    const result = await db_1.db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    const t1 = Date.now();
    console.log(`[LVMDP2 Hourly] DB aggregation: ${t1 - t0}ms, ${rows.length} hours`);
    // Convert to insert format
    const now = new Date();
    const hourlyData = rows.map((row) => ({
        id: crypto_1.default.randomUUID(),
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
        await (0, lvmdp_2_hourlyReport_repository_1.batchSaveHourlyReports)(hourlyData);
        const t3 = Date.now();
        console.log(`[LVMDP2 Hourly] Saved ${hourlyData.length} records in ${t3 - t2}ms`);
    }
    const totalTime = Date.now() - t0;
    console.log(`[LVMDP2 Hourly] Total time: ${totalTime}ms`);
    return hourlyData;
};
exports.generateHourlyReportsFromView = generateHourlyReportsFromView;
/**
 * Generate single hour report (untuk realtime/incremental updates)
 */
const generateSingleHourReport = async (dateStr, hour) => {
    const query = (0, drizzle_orm_1.sql) `
    SELECT 
      COUNT(*)::integer as count,
      (SUM(real_power::double precision) * (3.0 / 3600.0))::double precision as total_kwh,
      AVG(real_power::double precision)::double precision as avg_kwh,
      AVG(avg_current::double precision)::double precision as avg_current,
      MIN(avg_current::double precision)::double precision as min_current,
      MAX(avg_current::double precision)::double precision as max_current,
      AVG(cos_phi::double precision)::double precision as avg_cos_phi
    FROM public.v_lvmdp_2
    WHERE DATE(waktu AT TIME ZONE 'Asia/Jakarta') = ${dateStr}::date
      AND EXTRACT(HOUR FROM waktu AT TIME ZONE 'Asia/Jakarta')::integer = ${hour}
  `;
    const result = await db_1.db.execute(query);
    const rows = Array.isArray(result) ? result : result.rows || [];
    const row = rows[0];
    if (!row || Number(row.count) === 0) {
        return null;
    }
    const now = new Date();
    return {
        id: crypto_1.default.randomUUID(),
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
exports.generateSingleHourReport = generateSingleHourReport;
/* ===========================
   FETCH functions - SUPER FAST!
   Data sudah pre-aggregated, query < 10ms
=========================== */
/**
 * Fetch hourly data for a specific date
 * FAST: hanya query tabel kecil (24 rows max per hari)
 */
const fetchHourlyReportByDate = async (dateStr) => {
    const result = await (0, lvmdp_2_hourlyReport_repository_1.getHourlyReportByDate)(dateStr);
    // Ensure all 24 hours are present (fill missing with zeros)
    const hourMap = new Map(result.map((r) => [r.hour, r]));
    const complete = [];
    for (let h = 0; h < 24; h++) {
        if (hourMap.has(h)) {
            complete.push(hourMap.get(h));
        }
        else {
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
exports.fetchHourlyReportByDate = fetchHourlyReportByDate;
/**
 * Fetch hourly data for date range
 */
const fetchHourlyReportByRange = async (startDate, endDate) => {
    return await (0, lvmdp_2_hourlyReport_repository_1.getHourlyReportByRange)(startDate, endDate);
};
exports.fetchHourlyReportByRange = fetchHourlyReportByRange;
/**
 * Fetch specific hour
 */
const fetchHourlyReportByDateHour = async (dateStr, hour) => {
    return await (0, lvmdp_2_hourlyReport_repository_1.getHourlyReportByDateHour)(dateStr, hour);
};
exports.fetchHourlyReportByDateHour = fetchHourlyReportByDateHour;
