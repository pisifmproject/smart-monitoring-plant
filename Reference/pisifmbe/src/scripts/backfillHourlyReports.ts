#!/usr/bin/env ts-node
// src/scripts/backfillHourlyReports.ts
import { generateHourlyForDate } from "../cron/hourlyReportScheduler";

function parseDate(s: string) {
  const [Y, M, D] = s.split("-").map(Number);
  return new Date(Y, M - 1, D);
}

function toYmd(d: Date) {
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, "0");
  const D = String(d.getDate()).padStart(2, "0");
  return `${Y}-${M}-${D}`;
}

async function main() {
  const [, , startArg, endArg] = process.argv;

  if (!startArg) {
    console.error(
      "Usage: npx ts-node src/scripts/backfillHourlyReports.ts <start-YYYY-MM-DD> [end-YYYY-MM-DD]"
    );
    console.error("\nExample:");
    console.error(
      "  npx ts-node src/scripts/backfillHourlyReports.ts 2025-11-01 2025-11-27"
    );
    process.exit(1);
  }

  const start = parseDate(startArg);
  const end = endArg ? parseDate(endArg) : start;

  console.log(
    `[BACKFILL HOURLY] Starting backfill from ${startArg} to ${toYmd(end)}`
  );
  console.log(
    `[BACKFILL HOURLY] This will generate hourly data for LVMDP 1-4\n`
  );

  let cur = new Date(start);
  let count = 0;

  while (cur <= end) {
    const ds = toYmd(cur);
    count++;

    console.log(`[${count}] Backfilling hourly reports for ${ds}...`);
    const t0 = Date.now();

    // eslint-disable-next-line no-await-in-loop
    await generateHourlyForDate(ds);

    const t1 = Date.now();
    console.log(`    ✓ Completed in ${t1 - t0}ms\n`);

    cur.setDate(cur.getDate() + 1);
  }

  console.log(
    `[BACKFILL HOURLY] ✓ Backfill complete! Processed ${count} days.`
  );
}

main().catch((e) => {
  console.error("[BACKFILL HOURLY] ✗ Error:", e);
  process.exit(1);
});
