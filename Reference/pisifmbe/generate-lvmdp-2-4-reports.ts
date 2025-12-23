import { generateAndSaveDailyReport as gen2 } from "./src/lvmdp/LVMDP_2/lvmdp_2.dailyReport.services";
import { generateAndSaveDailyReport as gen3 } from "./src/lvmdp/LVMDP_3/lvmdp_3.dailyReport.services";
import { generateAndSaveDailyReport as gen4 } from "./src/lvmdp/LVMDP_4/lvmdp_4.dailyReport.services";

async function generateMissingReports() {
  const today = "2025-12-22";

  console.log(`\n🔧 Generating missing daily reports for ${today}...\n`);

  try {
    console.log("Generating LVMDP 2 daily report...");
    await gen2(today);
    console.log("✅ LVMDP 2 - Done");
  } catch (err) {
    console.error("❌ LVMDP 2 - Error:", err);
  }

  try {
    console.log("Generating LVMDP 3 daily report...");
    await gen3(today);
    console.log("✅ LVMDP 3 - Done");
  } catch (err) {
    console.error("❌ LVMDP 3 - Error:", err);
  }

  try {
    console.log("Generating LVMDP 4 daily report...");
    await gen4(today);
    console.log("✅ LVMDP 4 - Done");
  } catch (err) {
    console.error("❌ LVMDP 4 - Error:", err);
  }

  console.log("\n✅ All daily reports generated!\n");
  process.exit(0);
}

generateMissingReports().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
