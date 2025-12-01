"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDailyReportScheduler = initDailyReportScheduler;
exports.runDailyReportFor = runDailyReportFor;
const lvmdp_1_dailyReport_services_1 = require("../lvmdp/LVMDP_1/lvmdp_1.dailyReport.services");
const lvmdp_2_dailyReport_services_1 = require("../lvmdp/LVMDP_2/lvmdp_2.dailyReport.services");
const lvmdp_3_dailyReport_services_1 = require("../lvmdp/LVMDP_3/lvmdp_3.dailyReport.services");
const lvmdp_4_dailyReport_services_1 = require("../lvmdp/LVMDP_4/lvmdp_4.dailyReport.services");
const lvmdp_1_dailyReport_services_2 = require("../lvmdp/LVMDP_1/lvmdp_1.dailyReport.services");
const lvmdp_2_dailyReport_services_2 = require("../lvmdp/LVMDP_2/lvmdp_2.dailyReport.services");
const lvmdp_3_dailyReport_services_2 = require("../lvmdp/LVMDP_3/lvmdp_3.dailyReport.services");
const lvmdp_4_dailyReport_services_2 = require("../lvmdp/LVMDP_4/lvmdp_4.dailyReport.services");
function toYmd(d) {
    const Y = d.getFullYear();
    const M = String(d.getMonth() + 1).padStart(2, "0");
    const D = String(d.getDate()).padStart(2, "0");
    return `${Y}-${M}-${D}`;
}
/**
 * Save specific shift for all LVMDPs
 * Shift 1: saved at 14:30 (shift ends at 14:30)
 * Shift 2: saved at 22:00 (shift ends at 22:00)
 * Shift 3: saved at 07:00 next day (shift ends at 07:00)
 */
async function saveShiftForAllPanels(shiftNumber, dateStr) {
    console.log(`[REPORT] Saving shift ${shiftNumber} for all panels on ${dateStr}`);
    try {
        await Promise.all([
            (0, lvmdp_1_dailyReport_services_1.saveShiftReport)(dateStr, shiftNumber),
            (0, lvmdp_2_dailyReport_services_1.saveShiftReport)(dateStr, shiftNumber),
            (0, lvmdp_3_dailyReport_services_1.saveShiftReport)(dateStr, shiftNumber),
            (0, lvmdp_4_dailyReport_services_1.saveShiftReport)(dateStr, shiftNumber),
        ]);
        console.log(`[REPORT] Done saving shift ${shiftNumber} for ${dateStr}`);
    }
    catch (err) {
        console.error(`[REPORT] Error saving shift ${shiftNumber} for ${dateStr}:`, err);
    }
}
/**
 * Schedule time for next specific hour and minute
 */
function scheduleAt(hour, minute, callback) {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
    // If time already passed today, schedule for tomorrow
    if (next <= now) {
        next.setDate(next.getDate() + 1);
    }
    const ms = next.getTime() - now.getTime();
    console.log(`[REPORT] Scheduled at ${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}, first run in ${Math.round(ms / 1000)}s`);
    setTimeout(() => {
        callback();
        // Repeat every 24 hours
        setInterval(callback, 24 * 60 * 60 * 1000);
    }, ms);
}
/**
 * NEW: Schedule daily report save per shift
 * - Shift 1 saved at 14:30 (after shift 1 ends)
 * - Shift 2 saved at 22:00 (after shift 2 ends)
 * - Shift 3 saved at 07:00 (after shift 3 ends)
 */
function initDailyReportScheduler() {
    console.log("[REPORT] Initializing per-shift schedulers...");
    // Shift 1: Save at 14:30
    scheduleAt(14, 30, () => {
        const today = toYmd(new Date());
        saveShiftForAllPanels(1, today);
    });
    // Shift 2: Save at 22:00
    scheduleAt(22, 0, () => {
        const today = toYmd(new Date());
        saveShiftForAllPanels(2, today);
    });
    // Shift 3: Save at 07:00 (for YESTERDAY, because shift 3 crosses midnight)
    scheduleAt(7, 0, () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = toYmd(yesterday);
        saveShiftForAllPanels(3, dateStr);
    });
    console.log("[REPORT] Per-shift schedulers initialized");
}
// Legacy: Generate complete report for a date (used for backfill)
async function generateForDate(dateStr) {
    console.log(`[REPORT] Generating daily reports for ${dateStr}`);
    try {
        await Promise.all([
            (0, lvmdp_1_dailyReport_services_2.generateAndSaveDailyReport)(dateStr),
            (0, lvmdp_2_dailyReport_services_2.generateAndSaveDailyReport)(dateStr),
            (0, lvmdp_3_dailyReport_services_2.generateAndSaveDailyReport)(dateStr),
            (0, lvmdp_4_dailyReport_services_2.generateAndSaveDailyReport)(dateStr),
        ]);
        console.log(`[REPORT] Done generating reports for ${dateStr}`);
    }
    catch (err) {
        console.error(`[REPORT] Error generating reports for ${dateStr}:`, err);
    }
}
// Export helper to run immediately for a given date (for manual backfill)
async function runDailyReportFor(dateStr) {
    await generateForDate(dateStr);
}
