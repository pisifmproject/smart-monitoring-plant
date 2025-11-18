import { db } from "../../db";
import { dailyReportLVMDP1 } from "../../db/schema";
import { gte, lt, and } from "drizzle-orm";

/**
 * Jika reportDate = DATE (tanpa jam) → aman.
 * Kita buat range:
 *   >= 2025-11-14 00:00
 *   <  2025-11-15 00:00
 */
function makeDateRange(date: Date) {
  // return range as YYYY-MM-DD strings because reportDate column for LVMDP1
  // is mapped as PgDateString in Drizzle typings in this project
  const pad = (n: number) => String(n).padStart(2, "0");
  const Y = date.getFullYear();
  const M = pad(date.getMonth() + 1);
  const D = pad(date.getDate());
  const start = `${Y}-${M}-${D}`;

  const next = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1
  );
  const Y2 = next.getFullYear();
  const M2 = pad(next.getMonth() + 1);
  const D2 = pad(next.getDate());
  const end = `${Y2}-${M2}-${D2}`;

  return { start, end };
}

/**
 * Simpan daily report
 */
export const saveDailyReport = async (
  data: typeof dailyReportLVMDP1.$inferInsert
) => {
  return await db
    .insert(dailyReportLVMDP1)
    .values(data)
    .onConflictDoUpdate({
      target: dailyReportLVMDP1.reportDate,
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
 * Ambil report berdasarkan tanggal (tidak peduli jam)
 */
export const getDailyReportByDate = async (date: Date) => {
  if (isNaN(date.getTime())) throw new Error("Invalid date");

  const { start, end } = makeDateRange(date);

  return await db
    .select()
    .from(dailyReportLVMDP1)
    .where(
      and(
        gte(dailyReportLVMDP1.reportDate, start),
        lt(dailyReportLVMDP1.reportDate, end)
      )
    );
};

/**
 * Monthly report
 */
export const getDailyReportByMonth = async (year: number, month: number) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const start = `${year}-${pad(month)}-01`;
  const nextMonth = new Date(year, month, 1);
  const end = `${nextMonth.getFullYear()}-${pad(nextMonth.getMonth() + 1)}-01`;

  return await db
    .select()
    .from(dailyReportLVMDP1)
    .where(
      and(
        gte(dailyReportLVMDP1.reportDate, start),
        lt(dailyReportLVMDP1.reportDate, end)
      )
    )
    .orderBy(dailyReportLVMDP1.reportDate);
};

/**
 * Semua laporan
 */
export const getAllDailyReports = async () => {
  return await db
    .select()
    .from(dailyReportLVMDP1)
    .orderBy(dailyReportLVMDP1.reportDate);
};
