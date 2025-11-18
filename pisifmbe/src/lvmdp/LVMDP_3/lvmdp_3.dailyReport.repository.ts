import { db } from "../../db";
import { dailyReportLVMDP3 } from "../../db/schema";
import { eq, gte, lt, and } from "drizzle-orm";

type DailyReportInsert = typeof dailyReportLVMDP3.$inferInsert;

/**
 * Simpan daily report untuk LVMDP 3
 */
export const saveDailyReport = async (data: DailyReportInsert) => {
  return await db
    .insert(dailyReportLVMDP3)
    .values(data)
    .onConflictDoUpdate({
      target: dailyReportLVMDP3.reportDate,
      set: {
        shift1Count: data.shift1Count,
        shift1AvgKwh: data.shift1AvgKwh,
        shift1AvgCurrent: data.shift1AvgCurrent,
        shift2Count: data.shift2Count,
        shift2AvgKwh: data.shift2AvgKwh,
        shift2AvgCurrent: data.shift2AvgCurrent,
        shift3Count: data.shift3Count,
        shift3AvgKwh: data.shift3AvgKwh,
        shift3AvgCurrent: data.shift3AvgCurrent,
        updatedAt: new Date(),
      },
    })
    .returning();
};

/**
 * Ambil daily report untuk satu hari
 */
export const getDailyReportByDate = async (reportDate: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const Y = reportDate.getFullYear();
  const M = pad(reportDate.getMonth() + 1);
  const D = pad(reportDate.getDate());
  const ds = `${Y}-${M}-${D}`;

  return await db
    .select()
    .from(dailyReportLVMDP3)
    .where(eq(dailyReportLVMDP3.reportDate, ds))
    .limit(1);
};

/**
 * Ambil daily report untuk range bulan (monthly report)
 */
export const getDailyReportByMonth = async (year: number, month: number) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const start = `${year}-${pad(month)}-01`;
  const next = new Date(year, month, 1);
  const end = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-01`;

  return await db
    .select()
    .from(dailyReportLVMDP3)
    .where(
      and(
        gte(dailyReportLVMDP3.reportDate, start),
        lt(dailyReportLVMDP3.reportDate, end)
      )
    )
    .orderBy(dailyReportLVMDP3.reportDate);
};

/**
 * Ambil semua daily report
 */
export const getAllDailyReports = async () => {
  return await db
    .select()
    .from(dailyReportLVMDP3)
    .orderBy(dailyReportLVMDP3.reportDate);
};
