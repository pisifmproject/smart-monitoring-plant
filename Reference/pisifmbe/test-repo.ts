import { db } from "./src/db/index";

(async () => {
  // Get raw repository data
  const { findLVMDPs } = await import("./src/lvmdp/LVMDP_2/lvmdp_2.repository");

  const rows = await findLVMDPs("2025-12-19", "2025-12-20");

  console.log(`Total rows: ${rows.length}`);
  if (rows.length > 0) {
    console.log("First row:", rows[0]);
    console.log("\nPhase currents check:");
    const firstFiveRows = rows.slice(0, 5);
    firstFiveRows.forEach((r, i) => {
      console.log(
        `  Row ${i}: R=${r.currentR}, S=${r.currentS}, T=${r.currentT}, avg=${r.avgCurrent}`
      );
    });
  }

  process.exit(0);
})();
