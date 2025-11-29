"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDailyReportScheduler = initDailyReportScheduler;
exports.runDailyReportFor = runDailyReportFor;
const lvmdp_1_dailyReport_services_1 = require("../lvmdp/LVMDP_1/lvmdp_1.dailyReport.services");
const lvmdp_2_dailyReport_services_1 = require("../lvmdp/LVMDP_2/lvmdp_2.dailyReport.services");
const lvmdp_3_dailyReport_services_1 = require("../lvmdp/LVMDP_3/lvmdp_3.dailyReport.services");
const lvmdp_4_dailyReport_services_1 = require("../lvmdp/LVMDP_4/lvmdp_4.dailyReport.services");
function toYmd(d) {
    const Y = d.getFullYear();
    const M = String(d.getMonth() + 1).padStart(2, "0");
    const D = String(d.getDate()).padStart(2, "0");
    return `${Y}-${M}-${D}`;
}
async function generateForDate(dateStr) {
    console.log(`[REPORT] Generating daily reports for ${dateStr}`);
    try {
        await Promise.all([
            (0, lvmdp_1_dailyReport_services_1.generateAndSaveDailyReport)(dateStr),
            (0, lvmdp_2_dailyReport_services_1.generateAndSaveDailyReport)(dateStr),
            (0, lvmdp_3_dailyReport_services_1.generateAndSaveDailyReport)(dateStr),
            (0, lvmdp_4_dailyReport_services_1.generateAndSaveDailyReport)(dateStr),
        ]);
        console.log(`[REPORT] Done generating reports for ${dateStr}`);
    }
    catch (err) {
        console.error(`[REPORT] Error generating reports for ${dateStr}:`, err);
    }
}
/**
 * Schedule daily job to run at 00:05 local time and generate report for yesterday.
 */
function initDailyReportScheduler() {
    // compute ms until next 00:05
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 5, 0, 0);
    const ms = next.getTime() - now.getTime();
    console.log(`[REPORT] Daily report scheduler inited, first run in ${Math.round(ms / 1000)}s`);
    setTimeout(() => {
        // first run: generate for yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        generateForDate(toYmd(yesterday));
        // subsequent runs every 24h
        setInterval(() => {
            const y = new Date();
            y.setDate(y.getDate() - 1);
            generateForDate(toYmd(y));
        }, 24 * 60 * 60 * 1000);
    }, ms);
}
// also export helper to run immediately for a given date
async function runDailyReportFor(dateStr) {
    await generateForDate(dateStr);
}
