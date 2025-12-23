/**
 * SCHEDULER DOCUMENTATION - Daily Reports Auto-Generation
 * =========================================================
 * 
 * Purpose:
 * - Automatically generate daily reports for all LVMDP panels (1-4)
 * - Shift reports are saved after each shift ends
 * - Complete daily reports are generated at 23:00 daily
 * 
 * Timing:
 * ------
 * 07:00 - Shift 3 report (saved for YESTERDAY since shift 3 spans midnight)
 * 14:30 - Shift 1 report (saved for TODAY)
 * 22:00 - Shift 2 report (saved for TODAY)
 * 23:00 - Complete daily report (all 3 shifts combined) for TODAY
 * 
 * Files Involved:
 * ---------------
 * 1. src/cron/dailyReportScheduler.ts
 *    - Main scheduler initialization
 *    - Defines timing and actions for each shift
 * 
 * 2. src/lvmdp/LVMDP_*/lvmdp_*.dailyReport.services.ts
 *    - generateAndSaveDailyReport(dateStr)
 *      Generates complete daily report with all 3 shifts
 *    - saveShiftReport(dateStr, shiftNumber)
 *      Generates and saves individual shift data
 * 
 * 3. src/cron/hourlyReportScheduler.ts
 *    - Generates hourly reports at :05 minutes every hour
 * 
 * Data Flow:
 * ----------
 * Raw Data (v_lvmdp_*)
 *     ↓
 * Hourly Reports (hourly_report_lvmdp_*)
 *     ↓
 * Shift Reports (saved to daily_report_lvmdp_* incrementally)
 *     ↓
 * Daily Reports (daily_report_lvmdp_* - complete record with all shifts)
 * 
 * Important Notes:
 * ----------------
 * - All 4 LVMDP panels (1, 2, 3, 4) are handled in parallel for speed
 * - If schedule fails, data can be manually regenerated using:
 *   POST /api/lvmdp{id}/daily-report/generate?date=YYYY-MM-DD
 * - Shift reports update incrementally through the day
 * - Final complete report is generated at 23:00 with all shift data
 */

export const SCHEDULER_CONFIG = {
  shift1End: { hour: 14, minute: 30 },
  shift2End: { hour: 22, minute: 0 },
  shift3End: { hour: 7, minute: 0 }, // Next day
  dailyReportTime: { hour: 23, minute: 0 },
  hourlyReportInterval: "every hour at :05 minutes",
};
