// src/cron/hourlyReportScheduler.ts
import { generateHourlyReportsFromView as gen1 } from "../lvmdp/LVMDP_1/lvmdp_1.hourlyReport.services";
import { generateHourlyReportsFromView as gen2 } from "../lvmdp/LVMDP_2/lvmdp_2.hourlyReport.services";
import { generateHourlyReportsFromView as gen3 } from "../lvmdp/LVMDP_3/lvmdp_3.hourlyReport.services";
import { generateHourlyReportsFromView as gen4 } from "../lvmdp/LVMDP_4/lvmdp_4.hourlyReport.services";

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

  console.log(
    `[HOURLY REPORT] Generating reports for ${dateStr} hour ${hour}...`
  );

  try {
    // Generate untuk semua mesin (parallel untuk speed)
    await Promise.all([
      gen1(dateStr),
      gen2(dateStr),
      gen3(dateStr),
      gen4(dateStr),
    ]);

    console.log(
      `[HOURLY REPORT] Successfully generated for ${dateStr} hour ${hour}`
    );
  } catch (err) {
    console.error(
      `[HOURLY REPORT] Error generating for ${dateStr} hour ${hour}:`,
      err
    );
  }
}

/**
 * Generate hourly report untuk tanggal tertentu (all 24 hours)
 * Untuk backfill atau manual trigger
 */
export async function generateHourlyForDate(dateStr: string) {
  console.log(`[HOURLY REPORT] Generating all hours for ${dateStr}...`);

  try {
    await Promise.all([
      gen1(dateStr),
      gen2(dateStr),
      gen3(dateStr),
      gen4(dateStr),
    ]);

    console.log(
      `[HOURLY REPORT] Successfully generated all hours for ${dateStr}`
    );
  } catch (err) {
    console.error(`[HOURLY REPORT] Error generating for ${dateStr}:`, err);
  }
}

/**
 * OPTIMIZED Scheduler: Berjalan setiap jam di menit ke-5
 * Contoh: 00:05, 01:05, 02:05, dst
 *
 * Kenapa menit ke-5? Biar data jam sebelumnya sudah lengkap masuk ke database
 */
export function initHourlyReportScheduler() {
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

  console.log(
    `[HOURLY REPORT] Scheduler initialized. First run in ${Math.round(
      msUntilNext / 1000
    )}s at ${nextRun.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}`
  );

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
export async function runHourlyReportNow() {
  await generateHourlyForPreviousHour();
}
