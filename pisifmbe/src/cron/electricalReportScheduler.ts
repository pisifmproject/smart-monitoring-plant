// src/cron/electricalReportScheduler.ts
import cron, { ScheduledTask } from "node-cron";
import { aggregateAllPanelsForDate } from "../electricalReport/electricalReport.service";

/**
 * Cron job to aggregate daily electrical data
 * Runs every day at 00:05 AM to aggregate previous day's data
 *
 * Cron expression: "5 0 * * *"
 *   - Minute: 5
 *   - Hour: 0 (midnight)
 *   - Day of month: * (every day)
 *   - Month: * (every month)
 *   - Day of week: * (every day of week)
 */

let scheduledTask: ScheduledTask | null = null;

export function initElectricalReportScheduler() {
  // Schedule task for 00:05 AM daily
  scheduledTask = cron.schedule(
    "5 0 * * *",
    async () => {
      try {
        // Get yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split("T")[0];

        console.log(
          `[Electrical Report Scheduler] Starting aggregation for ${dateStr}`
        );

        await aggregateAllPanelsForDate(dateStr);

        console.log(
          `[Electrical Report Scheduler] ✓ Aggregation completed successfully`
        );
      } catch (error) {
        console.error(
          "[Electrical Report Scheduler] ✗ Error during aggregation:",
          error
        );
      }
    },
    {
      timezone: "Asia/Jakarta", // WIB timezone
    }
  );

  console.log(
    "[Electrical Report Scheduler] Initialized - runs daily at 00:05 WIB"
  );
}

export function stopElectricalReportScheduler() {
  if (scheduledTask) {
    scheduledTask.stop();
    console.log("[Electrical Report Scheduler] Stopped");
  }
}

/**
 * Manual trigger for testing or catching up missed days
 * Usage: triggerManualAggregation('2025-12-11')
 */
export async function triggerManualAggregation(date: string): Promise<void> {
  console.log(`[Electrical Report Scheduler] Manual trigger for ${date}`);

  try {
    await aggregateAllPanelsForDate(date);
    console.log(`[Electrical Report Scheduler] ✓ Manual aggregation completed`);
  } catch (error) {
    console.error(
      `[Electrical Report Scheduler] ✗ Manual aggregation failed:`,
      error
    );
    throw error;
  }
}

/**
 * Backfill missing reports for a date range
 * Usage: backfillReports('2025-12-01', '2025-12-10')
 */
export async function backfillReports(
  startDate: string,
  endDate: string
): Promise<void> {
  console.log(
    `[Electrical Report Scheduler] Backfilling reports from ${startDate} to ${endDate}`
  );

  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);

  let successCount = 0;
  let failCount = 0;

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];

    try {
      await aggregateAllPanelsForDate(dateStr);
      successCount++;
      console.log(`  ✓ ${dateStr}`);
    } catch (error) {
      failCount++;
      console.error(`  ✗ ${dateStr}:`, error);
    }

    current.setDate(current.getDate() + 1);
  }

  console.log(
    `[Electrical Report Scheduler] Backfill complete: ${successCount} success, ${failCount} failed`
  );
}
