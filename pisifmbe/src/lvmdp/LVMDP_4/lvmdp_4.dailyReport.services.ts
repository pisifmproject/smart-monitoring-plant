import { findLVMDPs } from "./lvmdp_4.repository";
import {
  saveDailyReport,
  getDailyReportByDate,
  getDailyReportByMonth,
  getAllDailyReports,
} from "./lvmdp_4.dailyReport.repository";
import crypto from "crypto";

/* ===========================
   SHIFT AVERAGES
   Shift 1 : 07:01 → 14:30
   Shift 2 : 14:31 → 22:00
   Shift 3 : 22:01 → 07:00 (+1 hari)
=========================== */

const SHIFT = [
  { key: "shift1", start: "07:01", end: "14:30" },
  { key: "shift2", start: "14:31", end: "22:00" },
  { key: "shift3", start: "22:01", end: "07:00" },
] as const;

type ShiftAvg = {
  count: number;
  avgKwh: number;
  avgCurrent: number;
};

/** bikin Date dari 'YYYY-MM-DD' + 'HH:mm' (interpret sebagai UTC) */
function at(dateStr: string, hhmm: string) {
  const [Y, M, D] = dateStr.split("-").map(Number);
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(Y, M - 1, D, h, m, 0, 0));
}

/** range waktu satu shift; kalau end <= start → tambahkan 1 hari (shift 3) */
function makeRange(dateStr: string, startHHMM: string, endHHMM: string) {
  const start = at(dateStr, startHHMM);
  let end = at(dateStr, endHHMM);
  if (end <= start) end.setDate(end.getDate() + 1);
  return { start, end };
}

/** rata-rata total_kwh dan avg_current dari kumpulan baris */
function computeAverages(rows: Array<any>): ShiftAvg {
  let sumKwh = 0;
  let sumI = 0;
  let n = 0;

  for (const r of rows) {
    const kwh = Number(r.totalKwh) || 0;
    const I = Number(r.avgCurrent) || 0;
    sumKwh += kwh;
    sumI += I;
    n++;
  }

  return {
    count: n,
    avgKwh: n ? sumKwh / n : 0,
    avgCurrent: n ? sumI / n : 0,
  };
}

/**
 * Generate & save daily report untuk hari tertentu
 * @param dateStr 'YYYY-MM-DD'
 */
export const generateAndSaveDailyReport = async (dateStr: string) => {
  const allRows = await findLVMDPs();

  const inRange = (d: Date, start: Date, end: Date) => d >= start && d < end;

  const shiftAverages: Record<string, ShiftAvg> = {};

  for (const s of SHIFT) {
    const { start, end } = makeRange(dateStr, s.start, s.end);

    const rows = allRows.filter((r) => {
      const t: Date = r.waktu instanceof Date ? r.waktu : new Date(r.waktu);
      return inRange(t, start, end);
    });

    shiftAverages[s.key] = computeAverages(rows);
  }

  // Use string 'YYYY-MM-DD' for reportDate when inserting
  const reportDate = dateStr;

  const reportData = {
    id: crypto.randomUUID(),
    reportDate,
    shift1Count: shiftAverages.shift1.count,
    shift1AvgKwh: shiftAverages.shift1.avgKwh,
    shift1AvgCurrent: shiftAverages.shift1.avgCurrent,
    shift2Count: shiftAverages.shift2.count,
    shift2AvgKwh: shiftAverages.shift2.avgKwh,
    shift2AvgCurrent: shiftAverages.shift2.avgCurrent,
    shift3Count: shiftAverages.shift3.count,
    shift3AvgKwh: shiftAverages.shift3.avgKwh,
    shift3AvgCurrent: shiftAverages.shift3.avgCurrent,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return await saveDailyReport(reportData);
};

/**
 * Fetch daily report untuk satu hari
 */
export const fetchDailyReport = async (dateStr: string) => {
  const [Y, M, D] = dateStr.split("-").map(Number);
  const reportDate = new Date(Y, M - 1, D);

  return await getDailyReportByDate(reportDate);
};

/**
 * Fetch monthly report (semua daily report dalam satu bulan)
 */
export const fetchMonthlyReport = async (year: number, month: number) => {
  return await getDailyReportByMonth(year, month);
};

/**
 * Fetch semua daily report
 */
export const fetchAllDailyReports = async () => {
  return await getAllDailyReports();
};
