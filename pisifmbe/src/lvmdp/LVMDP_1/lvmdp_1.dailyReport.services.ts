// src/lvmdp/LVMDP_1/lvmdp_1_dailyReport.services.ts
import {
  saveDailyReport,
  getDailyReportByDate,
  getDailyReportByMonth,
  getAllDailyReports,
} from "./lvmdp_1.dailyReport.repository";
import {
  getShiftAveragesLVMDP1,
  getHourlyAveragesLVMDP1,
} from "./lvmdp_1.services";
import { getHourlyReportByDate } from "./lvmdp_1.hourlyReport.repository";
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
   OPTIMIZED: Menggunakan hourly_report jika tersedia (super cepat!)
   Fallback: Query langsung ke view jika hourly belum ada
=========================== */

// Shift definitions (FIXED: shift 3 jam 0-6 harus ambil dari BESOK)
const SHIFT_HOURS = {
  shift1: [7, 8, 9, 10, 11, 12, 13, 14], // 07:01-14:30 (jam 7-14)
  shift2: [14, 15, 16, 17, 18, 19, 20, 21], // 14:31-22:00 (jam 14-21)
  shift3_today: [22, 23], // 22:01-23:59 (jam 22-23 hari ini)
  shift3_tomorrow: [0, 1, 2, 3, 4, 5, 6], // 00:00-07:00 (jam 0-6 besok)
} as const;

/**
 * OPTIMIZED: Generate daily report dari hourly_report table
 * Jauh lebih cepat karena data sudah pre-aggregated
 *
 * PENTING: Shift 3 = jam 22-23 hari ini + jam 0-6 besok
 */
async function generateFromHourlyReport(dateStr: string) {
  console.log(`[LVMDP1 Daily] Trying optimized path (from hourly_report)...`);

  // Get hourly data untuk hari ini
  const hourlyToday = await getHourlyReportByDate(dateStr);

  // Get hourly data untuk besok (untuk shift 3)
  const tomorrow = new Date(dateStr);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  const hourlyTomorrow = await getHourlyReportByDate(tomorrowStr);

  if (hourlyToday.length === 0) {
    console.log(
      `[LVMDP1 Daily] No hourly data found, falling back to view query`
    );
    return null;
  }

  // Map hour -> data
  const hourMapToday = new Map(hourlyToday.map((h) => [h.hour, h]));
  const hourMapTomorrow = new Map(hourlyTomorrow.map((h) => [h.hour, h]));

  // Calculate shift averages
  const shifts = {
    shift1: { count: 0, sumKwh: 0, sumCurrent: 0, sumCosPhi: 0 },
    shift2: { count: 0, sumKwh: 0, sumCurrent: 0, sumCosPhi: 0 },
    shift3: { count: 0, sumKwh: 0, sumCurrent: 0, sumCosPhi: 0 },
  };

  // Shift 1 & 2: ambil dari hari ini
  for (const hour of SHIFT_HOURS.shift1) {
    const data = hourMapToday.get(hour);
    if (data && data.count && data.count > 0) {
      shifts.shift1.count += data.count;
      shifts.shift1.sumKwh += (data.avgKwh ?? 0) * data.count;
      shifts.shift1.sumCurrent += (data.avgCurrent ?? 0) * data.count;
      shifts.shift1.sumCosPhi += (data.avgCosPhi ?? 0) * data.count;
    }
  }

  for (const hour of SHIFT_HOURS.shift2) {
    const data = hourMapToday.get(hour);
    if (data && data.count && data.count > 0) {
      shifts.shift2.count += data.count;
      shifts.shift2.sumKwh += (data.avgKwh ?? 0) * data.count;
      shifts.shift2.sumCurrent += (data.avgCurrent ?? 0) * data.count;
      shifts.shift2.sumCosPhi += (data.avgCosPhi ?? 0) * data.count;
    }
  }

  // Shift 3: jam 22-23 dari hari ini + jam 0-6 dari besok
  for (const hour of SHIFT_HOURS.shift3_today) {
    const data = hourMapToday.get(hour);
    if (data && data.count && data.count > 0) {
      shifts.shift3.count += data.count;
      shifts.shift3.sumKwh += (data.avgKwh ?? 0) * data.count;
      shifts.shift3.sumCurrent += (data.avgCurrent ?? 0) * data.count;
      shifts.shift3.sumCosPhi += (data.avgCosPhi ?? 0) * data.count;
    }
  }

  for (const hour of SHIFT_HOURS.shift3_tomorrow) {
    const data = hourMapTomorrow.get(hour);
    if (data && data.count && data.count > 0) {
      shifts.shift3.count += data.count;
      shifts.shift3.sumKwh += (data.avgKwh ?? 0) * data.count;
      shifts.shift3.sumCurrent += (data.avgCurrent ?? 0) * data.count;
      shifts.shift3.sumCosPhi += (data.avgCosPhi ?? 0) * data.count;
    }
  }

  const now = new Date();
  return {
    id: crypto.randomUUID(),
    reportDate: dateStr,

    shift1Count: shifts.shift1.count,
    shift1AvgKwh:
      shifts.shift1.count > 0 ? shifts.shift1.sumKwh / shifts.shift1.count : 0,
    shift1AvgCurrent:
      shifts.shift1.count > 0
        ? shifts.shift1.sumCurrent / shifts.shift1.count
        : 0,
    shift1AvgCosPhi:
      shifts.shift1.count > 0
        ? shifts.shift1.sumCosPhi / shifts.shift1.count
        : 0,

    shift2Count: shifts.shift2.count,
    shift2AvgKwh:
      shifts.shift2.count > 0 ? shifts.shift2.sumKwh / shifts.shift2.count : 0,
    shift2AvgCurrent:
      shifts.shift2.count > 0
        ? shifts.shift2.sumCurrent / shifts.shift2.count
        : 0,
    shift2AvgCosPhi:
      shifts.shift2.count > 0
        ? shifts.shift2.sumCosPhi / shifts.shift2.count
        : 0,

    shift3Count: shifts.shift3.count,
    shift3AvgKwh:
      shifts.shift3.count > 0 ? shifts.shift3.sumKwh / shifts.shift3.count : 0,
    shift3AvgCurrent:
      shifts.shift3.count > 0
        ? shifts.shift3.sumCurrent / shifts.shift3.count
        : 0,
    shift3AvgCosPhi:
      shifts.shift3.count > 0
        ? shifts.shift3.sumCosPhi / shifts.shift3.count
        : 0,

    createdAt: now,
    updatedAt: now,
  };
}

export const generateAndSaveDailyReport = async (dateStr: string) => {
  if (!isValidDateFormat(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }

  const t0 = Date.now();

  // Try optimized path first
  let reportData = await generateFromHourlyReport(dateStr);

  // Fallback to legacy method
  if (!reportData) {
    console.log(`[LVMDP1 Daily] Using legacy method (direct view query)...`);
    const shifts = await getShiftAveragesLVMDP1(dateStr);

    const s1 = shifts.shift1;
    const s2 = shifts.shift2;
    const s3 = shifts.shift3;

    const now = new Date();
    reportData = {
      id: crypto.randomUUID(),
      reportDate: dateStr,

      shift1Count: s1.count,
      shift1AvgKwh: s1.avgKwh,
      shift1AvgCurrent: s1.avgCurrent,
      shift1AvgCosPhi: s1.avgCosPhi,

      shift2Count: s2.count,
      shift2AvgKwh: s2.avgKwh,
      shift2AvgCurrent: s2.avgCurrent,
      shift2AvgCosPhi: s2.avgCosPhi,

      shift3Count: s3.count,
      shift3AvgKwh: s3.avgKwh,
      shift3AvgCurrent: s3.avgCurrent,
      shift3AvgCosPhi: s3.avgCosPhi,

      createdAt: now,
      updatedAt: now,
    };
  }

  const result = await saveDailyReport(reportData);

  const t1 = Date.now();
  console.log(`[LVMDP1 Daily] Generated report for ${dateStr} in ${t1 - t0}ms`);

  return result;
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

export const fetchHourlyAggregates = async (dateStr: string) => {
  // validasi format YYYY-MM-DD biar aman
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }

  return await getHourlyAveragesLVMDP1(dateStr);
};
