import { generateHourlyForDate } from "./src/cron/hourlyReportScheduler";

async function generateTodayReports() {
  const today = "2025-12-22";

  console.log(`\nGenerating hourly reports for ${today}...`);
  try {
    await generateHourlyForDate(today);
    console.log(`✅ Successfully generated hourly reports for ${today}`);
  } catch (err) {
    console.error(`❌ Error generating hourly reports:`, err);
  }

  // Now generate daily reports
  const { generateAndSaveDailyReport } = await import(
    "./src/lvmdp/LVMDP_1/lvmdp_1.dailyReport.services"
  );

  console.log(`\nGenerating daily reports for ${today}...`);
  try {
    await generateAndSaveDailyReport(today);
    console.log(`✅ Successfully generated daily report for ${today}`);
  } catch (err) {
    console.error(`❌ Error generating daily report:`, err);
  }

  process.exit(0);
}

generateTodayReports().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
