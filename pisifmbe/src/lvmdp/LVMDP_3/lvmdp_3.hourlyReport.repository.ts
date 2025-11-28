// src/lvmdp/LVMDP_3/lvmdp_3.hourlyReport.repository.ts
import { db } from "../../db";
import { hourlyReportLVMDP3 } from "../../db/schema";
import { gte, lt, and, eq } from "drizzle-orm";

/**
 * OPTIMIZED: Batch insert hourly records
 * Insert multiple hours at once untuk performa lebih baik
 */
export const batchSaveHourlyReports = async (
  data: Array<typeof hourlyReportLVMDP3.$inferInsert>
) => {
  if (data.length === 0) return [];

  // Use upsert (insert with conflict handling) untuk safety
  const results = [];
  for (const record of data) {
    const result = await db
      .insert(hourlyReportLVMDP3)
      .values(record)
      .onConflictDoUpdate({
        target: [hourlyReportLVMDP3.reportDate, hourlyReportLVMDP3.hour],
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
  data: typeof hourlyReportLVMDP3.$inferInsert
) => {
  return await db
    .insert(hourlyReportLVMDP3)
    .values(data)
    .onConflictDoUpdate({
      target: [hourlyReportLVMDP3.reportDate, hourlyReportLVMDP3.hour],
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
    .from(hourlyReportLVMDP3)
    .where(
      and(
        gte(hourlyReportLVMDP3.reportDate, dateStr),
        lt(hourlyReportLVMDP3.reportDate, nextDayStr)
      )
    )
    .orderBy(hourlyReportLVMDP3.hour);
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
    .from(hourlyReportLVMDP3)
    .where(
      and(
        gte(hourlyReportLVMDP3.reportDate, startDate),
        lt(hourlyReportLVMDP3.reportDate, nextDayStr)
      )
    )
    .orderBy(hourlyReportLVMDP3.reportDate, hourlyReportLVMDP3.hour);
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
    .from(hourlyReportLVMDP3)
    .where(
      and(
        eq(hourlyReportLVMDP3.reportDate, dateStr),
        eq(hourlyReportLVMDP3.hour, hour)
      )
    );
};

/**
 * Delete old records (untuk maintenance)
 * Misalnya hapus data > 6 bulan untuk hemat storage
 */
export const deleteOldHourlyReports = async (beforeDate: string) => {
  return await db
    .delete(hourlyReportLVMDP3)
    .where(lt(hourlyReportLVMDP3.reportDate, beforeDate));
};
