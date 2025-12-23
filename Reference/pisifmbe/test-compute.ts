import { db } from "./src/db/index";

(async () => {
  const { findLVMDPs } = await import("./src/lvmdp/LVMDP_2/lvmdp_2.repository");

  // Get shift 1 data
  const rows = await findLVMDPs("2025-12-19", "2025-12-20");

  // Filter for Shift 1 (07:00 - 15:00) on 2025-12-19
  const shift1Start = new Date("2025-12-18T23:00:00Z"); // 07:00 WIB = 23:00 UTC prev day
  const shift1End = new Date("2025-12-19T08:00:00Z"); // 15:00 WIB = 08:00 UTC

  const shift1Rows = rows.filter(
    (r) => r.waktu >= shift1Start && r.waktu < shift1End
  );

  console.log(`Shift 1 rows: ${shift1Rows.length}`);

  if (shift1Rows.length > 0) {
    console.log("First 3 rows:");
    shift1Rows.slice(0, 3).forEach((r, i) => {
      console.log(`  ${i}: R=${r.currentR}, S=${r.currentS}, T=${r.currentT}`);
    });

    // Calculate manually
    let minI = Infinity;
    let maxI = -Infinity;
    for (const r of shift1Rows) {
      const currents = [r.currentR, r.currentS, r.currentT].filter(
        (v) => v > 0
      );
      if (currents.length > 0) {
        minI = Math.min(minI, Math.min(...currents));
        maxI = Math.max(maxI, Math.max(...currents));
      }
    }

    console.log(`\nCalculated min/max: ${minI} / ${maxI}`);
  }

  process.exit(0);
})();
