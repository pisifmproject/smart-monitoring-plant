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

/**
 * Schedule daily job to run at 00:05 local time and generate report for yesterday.
 */
export function initDailyReportScheduler() {
  // compute ms until next 00:05
  const now = new Date();
  const next = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    5,
    0,
    0
  );
  const ms = next.getTime() - now.getTime();

  console.log(
    `[REPORT] Daily report scheduler inited, first run in ${Math.round(
      ms / 1000
    )}s`
  );

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
export async function runDailyReportFor(dateStr: string) {
  await generateForDate(dateStr);
}
