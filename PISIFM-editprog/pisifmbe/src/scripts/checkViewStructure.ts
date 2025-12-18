import { db } from "../db";
import { sql } from "drizzle-orm";

async function checkViews() {
  console.log("\n╔══════════════════════════════════════════════════════════╗");
  console.log("║     CHECK LVMDP VIEW STRUCTURE                           ║");
  console.log("╚══════════════════════════════════════════════════════════╝\n");

  for (let i = 1; i <= 4; i++) {
    const viewName = `v_lvmdp_${i}`;
    console.log(`\n[VIEW] ${viewName}`);
    console.log("─".repeat(60));

    try {
      // Get column names and types
      const columns = await db.execute(
        sql.raw(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = '${viewName}'
        ORDER BY ordinal_position
      `)
      );

      console.log("Columns:");
      columns.rows.forEach((col: any) => {
        console.log(`  - ${col.column_name} (${col.data_type})`);
      });

      // Get sample data
      const sample = await db.execute(
        sql.raw(`SELECT * FROM "${viewName}" LIMIT 1`)
      );

      if (sample.rows.length > 0) {
        console.log("\nSample data columns:");
        Object.keys(sample.rows[0]).forEach((key) => {
          console.log(`  - ${key}: ${typeof sample.rows[0][key]}`);
        });
      } else {
        console.log("\n✗ No data in view");
      }
    } catch (error: any) {
      console.error(`✗ Error: ${error.message}`);
    }
  }

  process.exit(0);
}

checkViews().catch(console.error);
