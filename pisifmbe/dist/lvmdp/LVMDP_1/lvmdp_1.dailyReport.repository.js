"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHourlyAggregatesForDate = exports.getAllDailyReports = exports.getDailyReportByMonth = exports.getDailyReportByDate = exports.saveDailyReport = void 0;
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * Jika reportDate = DATE (tanpa jam) → aman.
 * Kita buat range:
 *   >= 2025-11-14 00:00
 *   <  2025-11-15 00:00
 */
function makeDateRange(date) {
    // return range as YYYY-MM-DD strings because reportDate column for LVMDP1
    // is mapped as PgDateString in Drizzle typings in this project
    const pad = (n) => String(n).padStart(2, "0");
    const Y = date.getFullYear();
    const M = pad(date.getMonth() + 1);
    const D = pad(date.getDate());
    const start = `${Y}-${M}-${D}`;
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    const Y2 = next.getFullYear();
    const M2 = pad(next.getMonth() + 1);
    const D2 = pad(next.getDate());
    const end = `${Y2}-${M2}-${D2}`;
    return { start, end };
}
/**
 * Simpan daily report
 */
const saveDailyReport = async (data) => {
    return await db_1.db
        .insert(schema_1.dailyReportLVMDP1)
        .values(data)
        .onConflictDoUpdate({
        target: schema_1.dailyReportLVMDP1.reportDate,
        set: {
            shift1Count: data.shift1Count,
            shift1AvgKwh: data.shift1AvgKwh,
            shift1AvgCurrent: data.shift1AvgCurrent,
            shift1AvgCosPhi: data.shift1AvgCosPhi,
            shift2Count: data.shift2Count,
            shift2AvgKwh: data.shift2AvgKwh,
            shift2AvgCurrent: data.shift2AvgCurrent,
            shift2AvgCosPhi: data.shift2AvgCosPhi,
            shift3Count: data.shift3Count,
            shift3AvgKwh: data.shift3AvgKwh,
            shift3AvgCurrent: data.shift3AvgCurrent,
            shift3AvgCosPhi: data.shift3AvgCosPhi,
            updatedAt: new Date(),
        },
    })
        .returning();
};
exports.saveDailyReport = saveDailyReport;
/**
 * Ambil report berdasarkan tanggal (tidak peduli jam)
 */
const getDailyReportByDate = async (date) => {
    if (isNaN(date.getTime()))
        throw new Error("Invalid date");
    const { start, end } = makeDateRange(date);
    return await db_1.db
        .select()
        .from(schema_1.dailyReportLVMDP1)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.dailyReportLVMDP1.reportDate, start), (0, drizzle_orm_1.lt)(schema_1.dailyReportLVMDP1.reportDate, end)));
};
exports.getDailyReportByDate = getDailyReportByDate;
/**
 * Monthly report
 */
const getDailyReportByMonth = async (year, month) => {
    const pad = (n) => String(n).padStart(2, "0");
    const start = `${year}-${pad(month)}-01`;
    const nextMonth = new Date(year, month, 1);
    const end = `${nextMonth.getFullYear()}-${pad(nextMonth.getMonth() + 1)}-01`;
    return await db_1.db
        .select()
        .from(schema_1.dailyReportLVMDP1)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.dailyReportLVMDP1.reportDate, start), (0, drizzle_orm_1.lt)(schema_1.dailyReportLVMDP1.reportDate, end)))
        .orderBy(schema_1.dailyReportLVMDP1.reportDate);
};
exports.getDailyReportByMonth = getDailyReportByMonth;
/**
 * Semua laporan
 */
const getAllDailyReports = async () => {
    return await db_1.db
        .select()
        .from(schema_1.dailyReportLVMDP1)
        .orderBy(schema_1.dailyReportLVMDP1.reportDate);
};
exports.getAllDailyReports = getAllDailyReports;
/**
 * Ambil hourly aggregates untuk satu hari
 * Group by jam, hitung rata-rata totalKwh, cosPhi, avgCurrent
 */
// export const getHourlyAggregatesForDate = async (dateStr: string) => {
//   const { db: dbInstance } = require("../../db");
//   const { sql } = require("drizzle-orm");
//   // Query: GROUP BY hour, hitung aggregate
//   const result = await dbInstance.execute(
//     sql`
//       SELECT
//         DATE_TRUNC('hour', waktu AT TIME ZONE 'Asia/Jakarta') AS hour,
//         AVG(total_kwh)::float AS total_kwh,
//         AVG(cos_phi) AS cos_phi,
//         AVG(avg_current) AS avg_current
//       FROM public.v_lvmdp_1
//       WHERE DATE(waktu AT TIME ZONE 'Asia/Jakarta') = ${dateStr}
//       GROUP BY DATE_TRUNC('hour', waktu AT TIME ZONE 'Asia/Jakarta')
//       ORDER BY hour ASC
//     `
//   );
//   return result.rows || [];
// };
// export const getHourlyAggregatesForDate = async (dateStr: string) => {
//   // dateStr format 'YYYY-MM-DD'
//   const result = await db.execute(
//     sql`
//       SELECT
//         DATE_TRUNC('hour', waktu AT TIME ZONE 'Asia/Jakarta') AS hour,
//         AVG(total_kwh)::float      AS avg_total_kwh,
//         AVG(cos_phi)::float        AS avg_cos_phi,
//         AVG(avg_current)::float    AS avg_avg_current
//       FROM public.v_lvmdp_1
//       WHERE DATE(waktu AT TIME ZONE 'Asia/Jakarta') = ${dateStr}
//       GROUP BY DATE_TRUNC('hour', waktu AT TIME ZONE 'Asia/Jakarta')
//       ORDER BY hour ASC
//     `
//   );
//   // hasil: array of { hour, avg_total_kwh, avg_cos_phi, avg_avg_current }
//   return result.rows as Array<{
//     hour: string;           // timestamp
//     avg_total_kwh: number;  // ratusan koma sekian
//     avg_cos_phi: number;
//     avg_avg_current: number;
//   }>;
// };
const getHourlyAggregatesForDate = async (dateStr) => {
    // Pakai cara lama yang sudah pasti cocok dengan konfigurasi db-mu
    const { db: dbInstance } = require("../../db");
    const { sql } = require("drizzle-orm");
    const result = await dbInstance.execute(sql `
      SELECT
        DATE_TRUNC('hour', waktu AT TIME ZONE 'Asia/Jakarta') AS hour,
        AVG(total_kwh)::float AS total_kwh,
        AVG(cos_phi)::float     AS cos_phi,
        AVG(avg_current)::float AS avg_current
      FROM public.v_lvmdp_1
      WHERE DATE(waktu AT TIME ZONE 'Asia/Jakarta') = ${dateStr}
      GROUP BY DATE_TRUNC('hour', waktu AT TIME ZONE 'Asia/Jakarta')
      ORDER BY hour ASC
    `);
    // hasil: [{ hour, total_kwh, cos_phi, avg_current }, ...]
    return result.rows || [];
};
exports.getHourlyAggregatesForDate = getHourlyAggregatesForDate;
