// Generate report for today manually
import {
  aggregateDailyData,
  saveDailyReport,
} from "./src/electricalReport/electricalReport.repository";

const PANEL_CONFIGS = [
  { panelId: "LVMDP_1", viewName: "v_lvmdp_1" },
  { panelId: "LVMDP_2", viewName: "v_lvmdp_2" },
  { panelId: "LVMDP_3", viewName: "v_lvmdp_3" },
  { panelId: "LVMDP_4", viewName: "v_lvmdp_4" },
];

async function generateTodayReport() {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0];

  console.log(`Generating reports for ${dateStr}...`);

  for (const config of PANEL_CONFIGS) {
    try {
      console.log(`Processing ${config.panelId}...`);
      const report = await aggregateDailyData(
        config.panelId,
        config.viewName,
        dateStr
      );

      if (report) {
        await saveDailyReport(report);
        console.log(`✓ ${config.panelId}: ${report.energyKwh.toFixed(2)} kWh`);
      } else {
        console.log(`✗ ${config.panelId}: No data`);
      }
    } catch (error: any) {
      console.error(`Error processing ${config.panelId}:`, error.message);
    }
  }

  console.log("Done!");
  process.exit(0);
}

generateTodayReport();
