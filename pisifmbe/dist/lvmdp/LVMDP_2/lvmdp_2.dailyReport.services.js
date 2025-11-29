"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHourlyAggregates = exports.fetchAllDailyReports = exports.fetchMonthlyReport = exports.fetchDailyReport = exports.generateAndSaveDailyReport = void 0;
// src/lvmdp/LVMDP_2/lvmdp_2_dailyReport.services.ts
const lvmdp_2_dailyReport_repository_1 = require("./lvmdp_2.dailyReport.repository");
const lvmdp_2_services_1 = require("./lvmdp_2.services");
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
   Generate & SAVE daily report
   (pakai logika yang sama dengan /shift-avg)
=========================== */
const generateAndSaveDailyReport = async (dateStr) => {
    if (!isValidDateFormat(dateStr)) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }
    // 💡 gunakan perhitungan yang SAMA EXACT-nya dengan endpoint /shift-avg
    const shifts = await (0, lvmdp_2_services_1.getShiftAveragesLVMDP2)(dateStr);
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
    return await (0, lvmdp_2_dailyReport_repository_1.saveDailyReport)(reportData);
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
    return await (0, lvmdp_2_dailyReport_repository_1.getDailyReportByDate)(reportDate);
};
exports.fetchDailyReport = fetchDailyReport;
const fetchMonthlyReport = async (year, month) => {
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12 || year < 1900) {
        throw new Error(`Invalid year or month. Year: ${year}, Month: ${month}`);
    }
    return await (0, lvmdp_2_dailyReport_repository_1.getDailyReportByMonth)(year, month);
};
exports.fetchMonthlyReport = fetchMonthlyReport;
const fetchAllDailyReports = async () => {
    return await (0, lvmdp_2_dailyReport_repository_1.getAllDailyReports)();
};
exports.fetchAllDailyReports = fetchAllDailyReports;
const fetchHourlyAggregates = async (dateStr) => {
    // validasi format YYYY-MM-DD biar aman
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) {
        throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
    }
    return await (0, lvmdp_2_services_1.getHourlyAveragesLVMDP2)(dateStr);
};
exports.fetchHourlyAggregates = fetchHourlyAggregates;
