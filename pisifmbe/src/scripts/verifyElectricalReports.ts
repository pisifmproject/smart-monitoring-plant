import { db } from "../db";
import { sql } from "drizzle-orm";

async function verifyResults() {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║     VERIFICATION: DATABASE QUERY RESULTS                 ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  try {
    const result = await db.execute(
      sql`SELECT * FROM daily_electrical_reports WHERE report_date = '2025-12-12' ORDER BY panel_id`
    );

    console.log(`[FOUND] ${result.rows.length} reports in database\n`);
    console.log("─".repeat(80));

    let totalEnergy = 0;

    result.rows.forEach((row: any, index) => {
      console.log(`\n${index + 1}. ${row.panel_id}`);
      console.log(`   Date: ${row.report_date}`);
      console.log(`   Energy: ${Number(row.energy_kwh).toLocaleString()} kWh`);
      console.log(`   Avg Load: ${Number(row.avg_load_kw).toFixed(2)} kW`);
      console.log(
        `   Peak Demand: ${Number(row.peak_demand_kw).toFixed(2)} kW at ${
          row.peak_demand_time
        }`
      );
      console.log(
        `   Voltage: ${Number(row.avg_voltage).toFixed(2)}V (${Number(
          row.min_voltage
        ).toFixed(2)} - ${Number(row.max_voltage).toFixed(2)})`
      );
      console.log(
        `   Current: ${Number(row.avg_current).toFixed(2)}A (max: ${Number(
          row.max_current
        ).toFixed(2)}A)`
      );
      console.log(
        `   Power Factor: ${Number(row.avg_power_factor).toFixed(3)}`
      );
      console.log(
        `   Samples: ${row.sample_count} (${Number(
          row.data_completeness_percent
        ).toFixed(2)}% complete)`
      );

      totalEnergy += Number(row.energy_kwh);
    });

    console.log("\n" + "─".repeat(80));
    console.log(
      `\n📊 TOTAL FACILITY ENERGY (2025-12-12): ${totalEnergy.toLocaleString()} kWh\n`
    );

    // Calculate utilization
    const totalCapacity = 4540; // kW (1000+1000+1000+1540)
    const avgTotalLoad = result.rows.reduce(
      (sum: number, row: any) => sum + Number(row.avg_load_kw),
      0
    );
    const utilization = (avgTotalLoad / totalCapacity) * 100;
    console.log(`⚡ Average Facility Load: ${avgTotalLoad.toFixed(2)} kW`);
    console.log(
      `📈 Facility Utilization: ${utilization.toFixed(
        2
      )}% of ${totalCapacity} kW capacity\n`
    );
  } catch (error: any) {
    console.error("✗ Error:", error.message);
  }

  process.exit(0);
}

verifyResults().catch(console.error);
