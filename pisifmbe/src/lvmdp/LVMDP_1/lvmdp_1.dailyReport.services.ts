// src/lvmdp/LVMDP_1/lvmdp_1_dailyReport.services.ts
import {
  saveDailyReport,
  getDailyReportByDate,
  getDailyReportByMonth,
  getAllDailyReports,
  getHourlyAggregatesForDate,
} from "./lvmdp_1.dailyReport.repository";
import { getShiftAveragesLVMDP1 } from "./lvmdp_1.services";
import crypto from "crypto";

/* ===========================
   Helper: validasi tanggal
=========================== */

function isValidDateFormat(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const [Y, M, D] = dateStr.split("-").map(Number);
  return (
    !isNaN(Y) &&
    !isNaN(M) &&
    !isNaN(D) &&
    M >= 1 &&
    M <= 12 &&
    D >= 1 &&
    D <= 31
  );
}

/** Bikin Date UTC dari string 'YYYY-MM-DD'
 *  Supaya nggak mundur 1 hari waktu disimpan ke kolom DATE di Postgres
 */
function makeUtcDateFromYmd(dateStr: string): Date {
  const [Y, M, D] = dateStr.split("-").map(Number);
  // UTC midnight → 00:00:00Z
  return new Date(Date.UTC(Y, M - 1, D));
}

/* ===========================
   Generate & SAVE daily report
   (pakai logika yang sama dengan /shift-avg)
=========================== */

export const generateAndSaveDailyReport = async (dateStr: string) => {
  if (!isValidDateFormat(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }

  // 💡 gunakan perhitungan yang SAMA EXACT-nya dengan endpoint /shift-avg
  const shifts = await getShiftAveragesLVMDP1(dateStr);

  const s1 = shifts.shift1;
  const s2 = shifts.shift2;
  const s3 = shifts.shift3;

  // Use string 'YYYY-MM-DD' for reportDate when inserting (Drizzle/date column)
  const reportDate = dateStr;
  const now = new Date();

  const reportData = {
    id: crypto.randomUUID(),
    reportDate,

    shift1Count: s1.count,
    shift1AvgKwh: s1.avgKwh,
    shift1AvgCurrent: s1.avgCurrent,

    shift2Count: s2.count,
    shift2AvgKwh: s2.avgKwh,
    shift2AvgCurrent: s2.avgCurrent,

    shift3Count: s3.count,
    shift3AvgKwh: s3.avgKwh,
    shift3AvgCurrent: s3.avgCurrent,

    createdAt: now,
    updatedAt: now,
  };

  return await saveDailyReport(reportData);
};

/* ===========================
   FETCH fungsi: by day / month / all
=========================== */

export const fetchDailyReport = async (dateStr: string) => {
  if (!isValidDateFormat(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }

  // Pakai helper yang sama → match dengan yang disimpan
  const reportDate = makeUtcDateFromYmd(dateStr);
  return await getDailyReportByDate(reportDate);
};

export const fetchMonthlyReport = async (year: number, month: number) => {
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12 || year < 1900) {
    throw new Error(`Invalid year or month. Year: ${year}, Month: ${month}`);
  }
  return await getDailyReportByMonth(year, month);
};

export const fetchAllDailyReports = async () => {
  return await getAllDailyReports();
};

// export const fetchHourlyAggregates = async (dateStr: string) => {
//   if (!isValidDateFormat(dateStr)) {
//     throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
//   }
//   const { getHourlyAggregatesForDate } = await import(
//     "./lvmdp_1.dailyReport.repository"
//   );
//   return await getHourlyAggregatesForDate(dateStr);
// };

export const fetchHourlyAggregates = async (dateStr: string) => {
  // validasi format YYYY-MM-DD biar aman
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }

  return await getHourlyAggregatesForDate(dateStr);
};