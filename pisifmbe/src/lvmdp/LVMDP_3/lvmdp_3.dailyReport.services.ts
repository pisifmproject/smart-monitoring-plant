// src/lvmdp/LVMDP_3/lvmdp_3_dailyReport.services.ts
import {
  saveDailyReport,
  getDailyReportByDate,
  getDailyReportByMonth,
  getAllDailyReports,
} from "./lvmdp_3.dailyReport.repository";
import {
  getShiftAveragesLVMDP3,
  getHourlyAveragesLVMDP3,
} from "./lvmdp_3.services";
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
   Generate & SAVE daily report per shift
=========================== */

/**
 * Save single shift data to daily report
 * @param dateStr Date for the report (YYYY-MM-DD)
 * @param shiftNumber Which shift to save (1, 2, or 3)
 */
export const saveShiftReport = async (
  dateStr: string,
  shiftNumber: 1 | 2 | 3
) => {
  if (!isValidDateFormat(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }

  console.log(`[LVMDP3] Saving shift ${shiftNumber} for ${dateStr}`);

  // Get shift data
  const shifts = await getShiftAveragesLVMDP3(dateStr);
  const shiftData = shifts[`shift${shiftNumber}` as keyof typeof shifts];

  // Check if report exists
  const reportDate = makeUtcDateFromYmd(dateStr);
  const existing = await getDailyReportByDate(reportDate);

  const now = new Date();

  if (existing.length > 0) {
    // Update existing report
    const updateData: any = {
      [`shift${shiftNumber}Count`]: shiftData.count,
      [`shift${shiftNumber}AvgKwh`]: shiftData.avgKwh,
      [`shift${shiftNumber}AvgCurrent`]: shiftData.avgCurrent,
      [`shift${shiftNumber}AvgCosPhi`]: shiftData.avgCosPhi,
      updatedAt: now,
    };

    return await saveDailyReport({
      ...existing[0],
      ...updateData,
    });
  } else {
    // Create new report with only this shift filled
    const reportData: any = {
      id: crypto.randomUUID(),
      reportDate: dateStr,
      createdAt: now,
      updatedAt: now,
    };

    // Initialize all shifts to 0
    for (let i = 1; i <= 3; i++) {
      reportData[`shift${i}Count`] = 0;
      reportData[`shift${i}AvgKwh`] = 0;
      reportData[`shift${i}AvgCurrent`] = 0;
      reportData[`shift${i}AvgCosPhi`] = 0;
    }

    // Fill only the requested shift
    reportData[`shift${shiftNumber}Count`] = shiftData.count;
    reportData[`shift${shiftNumber}AvgKwh`] = shiftData.avgKwh;
    reportData[`shift${shiftNumber}AvgCurrent`] = shiftData.avgCurrent;
    reportData[`shift${shiftNumber}AvgCosPhi`] = shiftData.avgCosPhi;

    return await saveDailyReport(reportData);
  }
};

/**
 * Legacy function: Generate complete daily report (all shifts)
 * Still used for manual backfill
 */
export const generateAndSaveDailyReport = async (dateStr: string) => {
  if (!isValidDateFormat(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }

  // 💡 gunakan perhitungan yang SAMA EXACT-nya dengan endpoint /shift-avg
  const shifts = await getShiftAveragesLVMDP3(dateStr);

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

export const fetchHourlyAggregates = async (dateStr: string) => {
  // validasi format YYYY-MM-DD biar aman
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }

  return await getHourlyAveragesLVMDP3(dateStr);
};
