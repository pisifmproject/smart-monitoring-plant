// src/lvmdp/LVMDP_4/lvmdp_4.hourlyReport.repository.ts
import { db } from "../../db";
import { hourlyReportLVMDP4 } from "../../db/schema";
import { gte, lt, and, eq } from "drizzle-orm";

/**
 * OPTIMIZED: Batch insert hourly records
 * Insert multiple hours at once untuk performa lebih baik
 */
export const batchSaveHourlyReports = async (
  data: Array<typeof hourlyReportLVMDP4.$inferInsert>
) => {
  if (data.length === 0) return [];

  // Use upsert (insert with conflict handling) untuk safety
  const results = [];
  for (const record of data) {
    const result = await db
      .insert(hourlyReportLVMDP4)
      .values(record)
      .onConflictDoUpdate({
        target: [hourlyReportLVMDP4.reportDate, hourlyReportLVMDP4.hour],
        set: {
          count: record.count,
          totalKwh: record.totalKwh,
          avgKwh: record.avgKwh,
          avgCurrent: record.avgCurrent,
          avgCosPhi: record.avgCosPhi,
          updatedAt: new Date(),
        },
      })
      .returning();
    results.push(result[0]);
  }

  return results;
};

/**
 * Save single hourly report
 */
export const saveHourlyReport = async (
  data: typeof hourlyReportLVMDP4.$inferInsert
) => {
  return await db
    .insert(hourlyReportLVMDP4)
    .values(data)
    .onConflictDoUpdate({
      target: [hourlyReportLVMDP4.reportDate, hourlyReportLVMDP4.hour],
      set: {
        count: data.count,
        totalKwh: data.totalKwh,
        avgKwh: data.avgKwh,
        avgCurrent: data.avgCurrent,
        avgCosPhi: data.avgCosPhi,
        updatedAt: new Date(),
      },
    })
    .returning();
};

/**
 * OPTIMIZED: Get hourly data for specific date
 * Super cepat karena pakai index (report_date, hour)
 */
export const getHourlyReportByDate = async (dateStr: string) => {
  const nextDay = new Date(dateStr);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().slice(0, 10);

  return await db
    .select()
    .from(hourlyReportLVMDP4)
    .where(
      and(
        gte(hourlyReportLVMDP4.reportDate, dateStr),
        lt(hourlyReportLVMDP4.reportDate, nextDayStr)
      )
    )
    .orderBy(hourlyReportLVMDP4.hour);
};

/**
 * OPTIMIZED: Get hourly data for date range
 * Untuk monthly atau weekly reports
 */
export const getHourlyReportByRange = async (
  startDate: string,
  endDate: string
) => {
  const nextDay = new Date(endDate);
  nextDay.setDate(nextDay.getDate() + 1);
  const nextDayStr = nextDay.toISOString().slice(0, 10);

  return await db
    .select()
    .from(hourlyReportLVMDP4)
    .where(
      and(
        gte(hourlyReportLVMDP4.reportDate, startDate),
        lt(hourlyReportLVMDP4.reportDate, nextDayStr)
      )
    )
    .orderBy(hourlyReportLVMDP4.reportDate, hourlyReportLVMDP4.hour);
};

/**
 * Get specific hour data
 */
export const getHourlyReportByDateHour = async (
  dateStr: string,
  hour: number
) => {
  return await db
    .select()
    .from(hourlyReportLVMDP4)
    .where(
      and(
        eq(hourlyReportLVMDP4.reportDate, dateStr),
        eq(hourlyReportLVMDP4.hour, hour)
      )
    );
};

/**
 * Delete old records (untuk maintenance)
 * Misalnya hapus data > 6 bulan untuk hemat storage
 */
export const deleteOldHourlyReports = async (beforeDate: string) => {
  return await db
    .delete(hourlyReportLVMDP4)
    .where(lt(hourlyReportLVMDP4.reportDate, beforeDate));
};
