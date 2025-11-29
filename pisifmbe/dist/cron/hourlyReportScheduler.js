"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHourlyForDate = generateHourlyForDate;
exports.initHourlyReportScheduler = initHourlyReportScheduler;
exports.runHourlyReportNow = runHourlyReportNow;
// src/cron/hourlyReportScheduler.ts
const lvmdp_1_hourlyReport_services_1 = require("../lvmdp/LVMDP_1/lvmdp_1.hourlyReport.services");
const lvmdp_2_hourlyReport_services_1 = require("../lvmdp/LVMDP_2/lvmdp_2.hourlyReport.services");
const lvmdp_3_hourlyReport_services_1 = require("../lvmdp/LVMDP_3/lvmdp_3.hourlyReport.services");
const lvmdp_4_hourlyReport_services_1 = require("../lvmdp/LVMDP_4/lvmdp_4.hourlyReport.services");
/**
 * Generate hourly report untuk jam sebelumnya
 * Dipanggil setiap jam (contoh: jam 15:05 generate data jam 14:00-14:59)
 */
async function generateHourlyForPreviousHour() {
    const now = new Date();
    // Get previous hour
    const prevHour = new Date(now);
    prevHour.setHours(prevHour.getHours() - 1);
    const dateStr = prevHour.toISOString().slice(0, 10);
    const hour = prevHour.getHours();
    console.log(`[HOURLY REPORT] Generating reports for ${dateStr} hour ${hour}...`);
    try {
        // Generate untuk semua mesin (parallel untuk speed)
        await Promise.all([
            (0, lvmdp_1_hourlyReport_services_1.generateHourlyReportsFromView)(dateStr),
            (0, lvmdp_2_hourlyReport_services_1.generateHourlyReportsFromView)(dateStr),
            (0, lvmdp_3_hourlyReport_services_1.generateHourlyReportsFromView)(dateStr),
            (0, lvmdp_4_hourlyReport_services_1.generateHourlyReportsFromView)(dateStr),
        ]);
        console.log(`[HOURLY REPORT] Successfully generated for ${dateStr} hour ${hour}`);
    }
    catch (err) {
        console.error(`[HOURLY REPORT] Error generating for ${dateStr} hour ${hour}:`, err);
    }
}
/**
 * Generate hourly report untuk tanggal tertentu (all 24 hours)
 * Untuk backfill atau manual trigger
 */
async function generateHourlyForDate(dateStr) {
    console.log(`[HOURLY REPORT] Generating all hours for ${dateStr}...`);
    try {
        await Promise.all([
            (0, lvmdp_1_hourlyReport_services_1.generateHourlyReportsFromView)(dateStr),
            (0, lvmdp_2_hourlyReport_services_1.generateHourlyReportsFromView)(dateStr),
            (0, lvmdp_3_hourlyReport_services_1.generateHourlyReportsFromView)(dateStr),
            (0, lvmdp_4_hourlyReport_services_1.generateHourlyReportsFromView)(dateStr),
        ]);
        console.log(`[HOURLY REPORT] Successfully generated all hours for ${dateStr}`);
    }
    catch (err) {
        console.error(`[HOURLY REPORT] Error generating for ${dateStr}:`, err);
    }
}
/**
 * OPTIMIZED Scheduler: Berjalan setiap jam di menit ke-5
 * Contoh: 00:05, 01:05, 02:05, dst
 *
 * Kenapa menit ke-5? Biar data jam sebelumnya sudah lengkap masuk ke database
 */
function initHourlyReportScheduler() {
    // Calculate time until next :05 minute
    const now = new Date();
    const nextRun = new Date(now);
    // Set to next :05 minute
    if (now.getMinutes() >= 5) {
        // Next hour at :05
        nextRun.setHours(nextRun.getHours() + 1);
    }
    nextRun.setMinutes(5);
    nextRun.setSeconds(0);
    nextRun.setMilliseconds(0);
    const msUntilNext = nextRun.getTime() - now.getTime();
    console.log(`[HOURLY REPORT] Scheduler initialized. First run in ${Math.round(msUntilNext / 1000)}s at ${nextRun.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`);
    // First run
    setTimeout(() => {
        generateHourlyForPreviousHour();
        // Subsequent runs every hour
        setInterval(() => {
            generateHourlyForPreviousHour();
        }, 60 * 60 * 1000); // Every 1 hour
    }, msUntilNext);
}
/**
 * OPTIONAL: Immediate generation untuk testing
 * Uncomment jika ingin test langsung
 */
async function runHourlyReportNow() {
    await generateHourlyForPreviousHour();
}
