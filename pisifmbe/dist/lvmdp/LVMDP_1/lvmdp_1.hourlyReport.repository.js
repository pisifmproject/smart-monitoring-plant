"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOldHourlyReports = exports.getHourlyReportByDateHour = exports.getHourlyReportByRange = exports.getHourlyReportByDate = exports.saveHourlyReport = exports.batchSaveHourlyReports = void 0;
// src/lvmdp/LVMDP_1/lvmdp_1.hourlyReport.repository.ts
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
/**
 * OPTIMIZED: Batch insert hourly records
 * Insert multiple hours at once untuk performa lebih baik
 */
const batchSaveHourlyReports = async (data) => {
    if (data.length === 0)
        return [];
    // Use upsert (insert with conflict handling) untuk safety
    const results = [];
    for (const record of data) {
        const result = await db_1.db
            .insert(schema_1.hourlyReportLVMDP1)
            .values(record)
            .onConflictDoUpdate({
            target: [schema_1.hourlyReportLVMDP1.reportDate, schema_1.hourlyReportLVMDP1.hour],
            set: {
                count: record.count,
                totalKwh: record.totalKwh,
                avgKwh: record.avgKwh,
                avgCurrent: record.avgCurrent,
                minCurrent: record.minCurrent,
                maxCurrent: record.maxCurrent,
                avgCosPhi: record.avgCosPhi,
                updatedAt: new Date(),
            },
        })
            .returning();
        results.push(result[0]);
    }
    return results;
};
exports.batchSaveHourlyReports = batchSaveHourlyReports;
/**
 * Save single hourly report
 */
const saveHourlyReport = async (data) => {
    return await db_1.db
        .insert(schema_1.hourlyReportLVMDP1)
        .values(data)
        .onConflictDoUpdate({
        target: [schema_1.hourlyReportLVMDP1.reportDate, schema_1.hourlyReportLVMDP1.hour],
        set: {
            count: data.count,
            totalKwh: data.totalKwh,
            avgKwh: data.avgKwh,
            avgCurrent: data.avgCurrent,
            minCurrent: data.minCurrent,
            maxCurrent: data.maxCurrent,
            avgCosPhi: data.avgCosPhi,
            updatedAt: new Date(),
        },
    })
        .returning();
};
exports.saveHourlyReport = saveHourlyReport;
/**
 * OPTIMIZED: Get hourly data for specific date
 * Super cepat karena pakai index (report_date, hour)
 */
const getHourlyReportByDate = async (dateStr) => {
    const nextDay = new Date(dateStr);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().slice(0, 10);
    return await db_1.db
        .select()
        .from(schema_1.hourlyReportLVMDP1)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.hourlyReportLVMDP1.reportDate, dateStr), (0, drizzle_orm_1.lt)(schema_1.hourlyReportLVMDP1.reportDate, nextDayStr)))
        .orderBy(schema_1.hourlyReportLVMDP1.hour);
};
exports.getHourlyReportByDate = getHourlyReportByDate;
/**
 * OPTIMIZED: Get hourly data for date range
 * Untuk monthly atau weekly reports
 */
const getHourlyReportByRange = async (startDate, endDate) => {
    const nextDay = new Date(endDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().slice(0, 10);
    return await db_1.db
        .select()
        .from(schema_1.hourlyReportLVMDP1)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.gte)(schema_1.hourlyReportLVMDP1.reportDate, startDate), (0, drizzle_orm_1.lt)(schema_1.hourlyReportLVMDP1.reportDate, nextDayStr)))
        .orderBy(schema_1.hourlyReportLVMDP1.reportDate, schema_1.hourlyReportLVMDP1.hour);
};
exports.getHourlyReportByRange = getHourlyReportByRange;
/**
 * Get specific hour data
 */
const getHourlyReportByDateHour = async (dateStr, hour) => {
    return await db_1.db
        .select()
        .from(schema_1.hourlyReportLVMDP1)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.hourlyReportLVMDP1.reportDate, dateStr), (0, drizzle_orm_1.eq)(schema_1.hourlyReportLVMDP1.hour, hour)));
};
exports.getHourlyReportByDateHour = getHourlyReportByDateHour;
/**
 * Delete old records (untuk maintenance)
 * Misalnya hapus data > 6 bulan untuk hemat storage
 */
const deleteOldHourlyReports = async (beforeDate) => {
    return await db_1.db
        .delete(schema_1.hourlyReportLVMDP1)
        .where((0, drizzle_orm_1.lt)(schema_1.hourlyReportLVMDP1.reportDate, beforeDate));
};
exports.deleteOldHourlyReports = deleteOldHourlyReports;
