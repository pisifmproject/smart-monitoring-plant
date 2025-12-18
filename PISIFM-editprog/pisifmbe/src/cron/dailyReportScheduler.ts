import { saveShiftReport as saveShift1LVMDP1 } from "../lvmdp/LVMDP_1/lvmdp_1.dailyReport.services";
import { saveShiftReport as saveShift1LVMDP2 } from "../lvmdp/LVMDP_2/lvmdp_2.dailyReport.services";
import { saveShiftReport as saveShift1LVMDP3 } from "../lvmdp/LVMDP_3/lvmdp_3.dailyReport.services";
import { saveShiftReport as saveShift1LVMDP4 } from "../lvmdp/LVMDP_4/lvmdp_4.dailyReport.services";
import { generateAndSaveDailyReport as gen1 } from "../lvmdp/LVMDP_1/lvmdp_1.dailyReport.services";
import { generateAndSaveDailyReport as gen2 } from "../lvmdp/LVMDP_2/lvmdp_2.dailyReport.services";
import { generateAndSaveDailyReport as gen3 } from "../lvmdp/LVMDP_3/lvmdp_3.dailyReport.services";
import { generateAndSaveDailyReport as gen4 } from "../lvmdp/LVMDP_4/lvmdp_4.dailyReport.services";

function toYmd(d: Date) {
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
async function saveShiftForAllPanels(shiftNumber: 1 | 2 | 3, dateStr: string) {
  console.log(
    `[REPORT] Saving shift ${shiftNumber} for all panels on ${dateStr}`
  );
  try {
    await Promise.all([
      saveShift1LVMDP1(dateStr, shiftNumber),
      saveShift1LVMDP2(dateStr, shiftNumber),
      saveShift1LVMDP3(dateStr, shiftNumber),
      saveShift1LVMDP4(dateStr, shiftNumber),
    ]);
    console.log(`[REPORT] Done saving shift ${shiftNumber} for ${dateStr}`);
  } catch (err) {
    console.error(
      `[REPORT] Error saving shift ${shiftNumber} for ${dateStr}:`,
      err
    );
  }
}

/**
 * Schedule time for next specific hour and minute
 */
function scheduleAt(hour: number, minute: number, callback: () => void) {
  const now = new Date();
  const next = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0,
    0
  );

  // If time already passed today, schedule for tomorrow
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }

  const ms = next.getTime() - now.getTime();
  console.log(
    `[REPORT] Scheduled at ${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}, first run in ${Math.round(ms / 1000)}s`
  );

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
export function initDailyReportScheduler() {
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
async function generateForDate(dateStr: string) {
  console.log(`[REPORT] Generating daily reports for ${dateStr}`);
  try {
    await Promise.all([
      gen1(dateStr),
      gen2(dateStr),
      gen3(dateStr),
      gen4(dateStr),
    ]);
    console.log(`[REPORT] Done generating reports for ${dateStr}`);
  } catch (err) {
    console.error(`[REPORT] Error generating reports for ${dateStr}:`, err);
  }
}

// Export helper to run immediately for a given date (for manual backfill)
export async function runDailyReportFor(dateStr: string) {
  await generateForDate(dateStr);
}
