"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDailyReports = exports.getDailyReportByMonth = exports.getDailyReportByDate = exports.saveDailyReport = void 0;
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
    // return range as YYYY-MM-DD strings because reportDate column for LVMDP2
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
        .insert(schema_1.dailyReportLVMDP2)
        .values(data)
        .onConflictDoUpdate({
        target: schema_1.dailyReportLVMDP2.reportDate,
        set: {
            shift1Count: data.shift1Count,
            shift1TotalKwh: data.shift1TotalKwh,
            shift1AvgKwh: data.shift1AvgKwh,
            shift1AvgCurrent: data.shift1AvgCurrent,
            shift1AvgCosPhi: data.shift1AvgCosPhi,
            shift1MinCurrent: data.shift1MinCurrent,
            shift1MaxCurrent: data.shift1MaxCurrent,
            shift2Count: data.shift2Count,
            shift2TotalKwh: data.shift2TotalKwh,
            shift2AvgKwh: data.shift2AvgKwh,
            shift2AvgCurrent: data.shift2AvgCurrent,
            shift2AvgCosPhi: data.shift2AvgCosPhi,
            shift2MinCurrent: data.shift2MinCurrent,
            shift2MaxCurrent: data.shift2MaxCurrent,
            shift3Count: data.shift3Count,
            shift3TotalKwh: data.shift3TotalKwh,
            shift3AvgKwh: data.shift3AvgKwh,
            shift3AvgCurrent: data.shift3AvgCurrent,
            shift3AvgCosPhi: data.shift3AvgCosPhi,
            shift3MinCurrent: data.shift3MinCurrent,
            shift3MaxCurrent: data.shift3MaxCurrent,
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
        .from(schema_1.dailyReportLVMDP2)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.dailyReportLVMDP2.reportDate, start), (0, drizzle_orm_1.lt)(schema_1.dailyReportLVMDP2.reportDate, end)));
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
        .from(schema_1.dailyReportLVMDP2)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.dailyReportLVMDP2.reportDate, start), (0, drizzle_orm_1.lt)(schema_1.dailyReportLVMDP2.reportDate, end)))
        .orderBy(schema_1.dailyReportLVMDP2.reportDate);
};
exports.getDailyReportByMonth = getDailyReportByMonth;
/**
 * Semua laporan
 */
const getAllDailyReports = async () => {
    return await db_1.db
        .select()
        .from(schema_1.dailyReportLVMDP2)
        .orderBy(schema_1.dailyReportLVMDP2.reportDate);
};
exports.getAllDailyReports = getAllDailyReports;
