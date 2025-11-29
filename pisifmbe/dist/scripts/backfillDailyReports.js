#!/usr/bin/env ts-node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dailyReportScheduler_1 = require("../cron/dailyReportScheduler");
function parseDate(s) {
    const [Y, M, D] = s.split("-").map(Number);
    return new Date(Y, M - 1, D);
}
function toYmd(d) {
    const Y = d.getFullYear();
    const M = String(d.getMonth() + 1).padStart(2, "0");
    const D = String(d.getDate()).padStart(2, "0");
    return `${Y}-${M}-${D}`;
}
async function main() {
    const [, , startArg, endArg] = process.argv;
    if (!startArg) {
        console.error("Usage: npx ts-node src/scripts/backfillDailyReports.ts <start-YYYY-MM-DD> [end-YYYY-MM-DD]");
        process.exit(1);
    }
    const start = parseDate(startArg);
    const end = endArg ? parseDate(endArg) : start;
    let cur = new Date(start);
    while (cur <= end) {
        const ds = toYmd(cur);
        console.log(`Backfilling reports for ${ds}`);
        // eslint-disable-next-line no-await-in-loop
        await (0, dailyReportScheduler_1.runDailyReportFor)(ds);
        cur.setDate(cur.getDate() + 1);
    }
    console.log("Backfill complete");
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
