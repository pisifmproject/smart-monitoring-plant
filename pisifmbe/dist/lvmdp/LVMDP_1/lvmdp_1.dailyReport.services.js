"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveCurrentShiftReport = exports.fetchHourlyAggregates = exports.fetchAllDailyReports = exports.fetchMonthlyReport = exports.fetchDailyReport = exports.generateAndSaveDailyReport = exports.saveShiftReport = void 0;
exports.getCurrentShift = getCurrentShift;
// src/lvmdp/LVMDP_1/lvmdp_1_dailyReport.services.ts
const lvmdp_1_dailyReport_repository_1 = require("./lvmdp_1.dailyReport.repository");
const lvmdp_1_services_1 = require("./lvmdp_1.services");
const crypto_1 = __importDefault(require("crypto"));
/* ===========================
   Helper: validasi tanggal
=========================== */
function isValidDateFormat(dateStr) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr))
        return false;
    const [Y, M, D] = dateStr.split("-").map(Number);
    return (!isNaN(Y) &&
        !isNaN(M) &&
        !isNaN(D) &&
        M >= 1 &&
        M <= 12 &&
        D >= 1 &&
        D <= 31);
}
/** Bikin Date UTC dari string 'YYYY-MM-DD'
 *  Supaya nggak mundur 1 hari waktu disimpan ke kolom DATE di Postgres
 */
function makeUtcDateFromYmd(dateStr) {
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
const saveShiftReport = async (dateStr, shiftNumber) => {
    if (!isValidDateFormat(dateStr)) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }
    console.log(`[LVMDP1] Saving shift ${shiftNumber} for ${dateStr}`);
    // Get shift data
    const shifts = await (0, lvmdp_1_services_1.getShiftAveragesLVMDP1)(dateStr);
    const shiftData = shifts[`shift${shiftNumber}`];
    // Check if report exists
    const reportDate = makeUtcDateFromYmd(dateStr);
    const existing = await (0, lvmdp_1_dailyReport_repository_1.getDailyReportByDate)(reportDate);
    const now = new Date();
    if (existing.length > 0) {
        // Update existing report
        const updateData = {
            [`shift${shiftNumber}Count`]: shiftData.count,
            [`shift${shiftNumber}AvgKwh`]: shiftData.avgKwh,
            [`shift${shiftNumber}AvgCurrent`]: shiftData.avgCurrent,
            [`shift${shiftNumber}AvgCosPhi`]: shiftData.avgCosPhi,
            updatedAt: now,
        };
        return await (0, lvmdp_1_dailyReport_repository_1.saveDailyReport)({
            ...existing[0],
            ...updateData,
        });
    }
    else {
        // Create new report with only this shift filled
        const reportData = {
            id: crypto_1.default.randomUUID(),
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
        return await (0, lvmdp_1_dailyReport_repository_1.saveDailyReport)(reportData);
    }
};
exports.saveShiftReport = saveShiftReport;
/**
 * Legacy function: Generate complete daily report (all shifts)
 * Still used for manual backfill
 */
const generateAndSaveDailyReport = async (dateStr) => {
    if (!isValidDateFormat(dateStr)) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }
    // 💡 gunakan perhitungan yang SAMA EXACT-nya dengan endpoint /shift-avg
    const shifts = await (0, lvmdp_1_services_1.getShiftAveragesLVMDP1)(dateStr);
    const s1 = shifts.shift1;
    const s2 = shifts.shift2;
    const s3 = shifts.shift3;
    // Use string 'YYYY-MM-DD' for reportDate when inserting (Drizzle/date column)
    const reportDate = dateStr;
    const now = new Date();
    const reportData = {
        id: crypto_1.default.randomUUID(),
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
    return await (0, lvmdp_1_dailyReport_repository_1.saveDailyReport)(reportData);
};
exports.generateAndSaveDailyReport = generateAndSaveDailyReport;
/* ===========================
   FETCH fungsi: by day / month / all
=========================== */
const fetchDailyReport = async (dateStr) => {
    if (!isValidDateFormat(dateStr)) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }
    // Pakai helper yang sama → match dengan yang disimpan
    const reportDate = makeUtcDateFromYmd(dateStr);
    return await (0, lvmdp_1_dailyReport_repository_1.getDailyReportByDate)(reportDate);
};
exports.fetchDailyReport = fetchDailyReport;
const fetchMonthlyReport = async (year, month) => {
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12 || year < 1900) {
        throw new Error(`Invalid year or month. Year: ${year}, Month: ${month}`);
    }
    return await (0, lvmdp_1_dailyReport_repository_1.getDailyReportByMonth)(year, month);
};
exports.fetchMonthlyReport = fetchMonthlyReport;
const fetchAllDailyReports = async () => {
    return await (0, lvmdp_1_dailyReport_repository_1.getAllDailyReports)();
};
exports.fetchAllDailyReports = fetchAllDailyReports;
const fetchHourlyAggregates = async (dateStr) => {
    // validasi format YYYY-MM-DD biar aman
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }
    return await (0, lvmdp_1_services_1.getHourlyAveragesLVMDP1)(dateStr);
};
exports.fetchHourlyAggregates = fetchHourlyAggregates;
/**
 * Get current shift number based on current time
 * Shift 1: 07:01-14:30 (7:01 AM - 2:30 PM)
 * Shift 2: 14:31-22:00 (2:31 PM - 10:00 PM)
 * Shift 3: 22:01-07:00 (10:01 PM - 7:00 AM next day)
 */
function getCurrentShift() {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeInMinutes = hour * 60 + minute;
    // Shift 1: 07:01-14:30 (421 minutes - 870 minutes)
    if (timeInMinutes >= 421 && timeInMinutes <= 870) {
        return {
            shift: 1,
            date: toYmd(now),
        };
    }
    // Shift 2: 14:31-22:00 (871 minutes - 1320 minutes)
    if (timeInMinutes >= 871 && timeInMinutes <= 1320) {
        return {
            shift: 2,
            date: toYmd(now),
        };
    }
    // Shift 3: 22:01-07:00 (1321+ minutes or 0-420 minutes)
    // If time is 22:01-23:59, it's shift 3 of today
    // If time is 00:00-07:00, it's shift 3 of yesterday
    if (timeInMinutes >= 1321) {
        return {
            shift: 3,
            date: toYmd(now), // Today
        };
    }
    // 00:00-07:00 is shift 3 of yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return {
        shift: 3,
        date: toYmd(yesterday),
    };
}
function toYmd(d) {
    const Y = d.getFullYear();
    const M = String(d.getMonth() + 1).padStart(2, "0");
    const D = String(d.getDate()).padStart(2, "0");
    return `${Y}-${M}-${D}`;
}
/**
 * Save current shift report (real-time)
 * Useful for:
 * - Viewing current shift data before shift ends
 * - Manual generation if scheduler fails
 * - Testing and debugging
 */
const saveCurrentShiftReport = async () => {
    const { shift, date } = getCurrentShift();
    console.log(`[LVMDP1] Saving current shift ${shift} for ${date}`);
    return await (0, exports.saveShiftReport)(date, shift);
};
exports.saveCurrentShiftReport = saveCurrentShiftReport;
