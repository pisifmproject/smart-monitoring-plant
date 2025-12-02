require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testHMI() {
  try {
    console.log("=== Testing HMI Data Direct from Database ===\n");

    // Get latest data from lvmdp_hmi for all panels
    const query = `
      SELECT 
        datetimefield,
        lvmdp_r_lvmdp1, lvmdp_s_lvmdp1, lvmdp_t_lvmdp1,
        lvmdp_r_s_lvmdp1, lvmdp_s_t_lvmdp1, lvmdp_t_r_lvmdp1,
        lvmdp_r_lvmdp2, lvmdp_s_lvmdp2, lvmdp_t_lvmdp2,
        lvmdp_r_s_lvmdp2, lvmdp_s_t_lvmdp2, lvmdp_t_r_lvmdp2,
        lvmdp_r_lvmdp3, lvmdp_s_lvmdp3, lvmdp_t_lvmdp3,
        lvmdp_r_s_lvmdp3, lvmdp_s_t_lvmdp3, lvmdp_t_r_lvmdp3,
        lvmdp_r_lvmdp4, lvmdp_s_lvmdp4, lvmdp_t_lvmdp4,
        lvmdp_r_s_lvmdp4, lvmdp_s_t_lvmdp4, lvmdp_t_r_lvmdp4
      FROM lvmdp_hmi 
      ORDER BY datetimefield DESC 
      LIMIT 1
    `;

    const result = await pool.query(query);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      console.log("Latest data timestamp:", row.datetimefield);
      console.log("\nLVMDP 1:");
      console.log("  Current R:", row.lvmdp_r_lvmdp1, "A");
      console.log("  Current S:", row.lvmdp_s_lvmdp1, "A");
      console.log("  Current T:", row.lvmdp_t_lvmdp1, "A");
      console.log("  Voltage R-S:", row.lvmdp_r_s_lvmdp1, "V");
      console.log("  Voltage S-T:", row.lvmdp_s_t_lvmdp1, "V");
      console.log("  Voltage T-R:", row.lvmdp_t_r_lvmdp1, "V");

      console.log("\nLVMDP 2:");
      console.log("  Current R:", row.lvmdp_r_lvmdp2, "A");
      console.log("  Current S:", row.lvmdp_s_lvmdp2, "A");
      console.log("  Current T:", row.lvmdp_t_lvmdp2, "A");
      console.log("  Voltage R-S:", row.lvmdp_r_s_lvmdp2, "V");
      console.log("  Voltage S-T:", row.lvmdp_s_t_lvmdp2, "V");
      console.log("  Voltage T-R:", row.lvmdp_t_r_lvmdp2, "V");

      console.log("\nLVMDP 3:");
      console.log("  Current R:", row.lvmdp_r_lvmdp3, "A");
      console.log("  Current S:", row.lvmdp_s_lvmdp3, "A");
      console.log("  Current T:", row.lvmdp_t_lvmdp3, "A");
      console.log("  Voltage R-S:", row.lvmdp_r_s_lvmdp3, "V");
      console.log("  Voltage S-T:", row.lvmdp_s_t_lvmdp3, "V");
      console.log("  Voltage T-R:", row.lvmdp_t_r_lvmdp3, "V");

      console.log("\nLVMDP 4:");
      console.log("  Current R:", row.lvmdp_r_lvmdp4, "A");
      console.log("  Current S:", row.lvmdp_s_lvmdp4, "A");
      console.log("  Current T:", row.lvmdp_t_lvmdp4, "A");
      console.log("  Voltage R-S:", row.lvmdp_r_s_lvmdp4, "V");
      console.log("  Voltage S-T:", row.lvmdp_s_t_lvmdp4, "V");
      console.log("  Voltage T-R:", row.lvmdp_t_r_lvmdp4, "V");
    } else {
      console.log("No data found in lvmdp_hmi table");
    }
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await pool.end();
  }
}

testHMI();
