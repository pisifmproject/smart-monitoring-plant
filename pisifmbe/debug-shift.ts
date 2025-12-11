// Debug shift calculation
import { getShiftAveragesLVMDP1 } from "./src/lvmdp/LVMDP_1/lvmdp_1.services";

async function debugShift() {
  try {
    const today = "2025-12-11";

    console.log("=== Debug Shift Calculation ===\n");

    const shifts = await getShiftAveragesLVMDP1(today);

    console.log("Shift 1:");
    console.log("  totalKwh:", shifts.shift1.totalKwh);
    console.log("  avgKwh:", shifts.shift1.avgKwh);
    console.log("  count:", shifts.shift1.count);

    console.log("\nShift 2:");
    console.log("  totalKwh:", shifts.shift2.totalKwh);
    console.log("  avgKwh:", shifts.shift2.avgKwh);
    console.log("  count:", shifts.shift2.count);

    console.log("\nShift 3:");
    console.log("  totalKwh:", shifts.shift3.totalKwh);
    console.log("  avgKwh:", shifts.shift3.avgKwh);
    console.log("  count:", shifts.shift3.count);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

debugShift();
