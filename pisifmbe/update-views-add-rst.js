require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function updateViews() {
  try {
    console.log("=== Updating v_lvmdp views to include RST data ===\n");

    // Drop and recreate v_lvmdp_1 to include RST columns and real_power
    await pool.query("DROP VIEW IF EXISTS v_lvmdp_1 CASCADE");
    const sql1 = `
      CREATE VIEW v_lvmdp_1 AS
      SELECT 
        h.datetimefield AS waktu,
        h.lvmdp_energy_lvmdp1 AS total_kwh,
        h.lvmdp__total_lvmdp1 AS real_power,
        h.lvmdp_cos_phi_lvmdp1 AS cos_phi,
        h.lvmdp_hz_lvmdp1 AS freq,
        h.lvmdp_l_l_avg_lvmdp1 AS avg_line_line,
        h.lvmdp_l_n_avg_lvmdp1 AS avg_line_neut,
        h.lvmdp_avg_ampere_lvmdp1 AS avg_current,
        h.lvmdp_r_lvmdp1 AS current_r,
        h.lvmdp_s_lvmdp1 AS current_s,
        h.lvmdp_t_lvmdp1 AS current_t,
        h.lvmdp_r_s_lvmdp1 AS voltage_rs,
        h.lvmdp_s_t_lvmdp1 AS voltage_st,
        h.lvmdp_t_r_lvmdp1 AS voltage_tr
      FROM lvmdp_hmi h
      ORDER BY h.datetimefield DESC;
    `;

    await pool.query(sql1);
    console.log("✓ v_lvmdp_1 updated");

    // Drop and recreate v_lvmdp_2
    await pool.query("DROP VIEW IF EXISTS v_lvmdp_2 CASCADE");
    const sql2 = `
      CREATE VIEW v_lvmdp_2 AS
      SELECT 
        h.datetimefield AS waktu,
        h.lvmdp_energy_lvmdp2 AS total_kwh,
        h.lvmdp__total_lvmdp2 AS real_power,
        h.lvmdp_cos_phi_lvmdp2 AS cos_phi,
        h.lvmdp_hz_lvmdp2 AS freq,
        h.lvmdp_l_l_avg_lvmdp2 AS avg_line_line,
        h.lvmdp_l_n_avg_lvmdp2 AS avg_line_neut,
        h.lvmdp_avg_ampere_lvmdp2 AS avg_current,
        h.lvmdp_r_lvmdp2 AS current_r,
        h.lvmdp_s_lvmdp2 AS current_s,
        h.lvmdp_t_lvmdp2 AS current_t,
        h.lvmdp_r_s_lvmdp2 AS voltage_rs,
        h.lvmdp_s_t_lvmdp2 AS voltage_st,
        h.lvmdp_t_r_lvmdp2 AS voltage_tr
      FROM lvmdp_hmi h
      ORDER BY h.datetimefield DESC;
    `;

    await pool.query(sql2);
    console.log("✓ v_lvmdp_2 updated");

    // Drop and recreate v_lvmdp_3
    await pool.query("DROP VIEW IF EXISTS v_lvmdp_3 CASCADE");
    const sql3 = `
      CREATE VIEW v_lvmdp_3 AS
      SELECT 
        h.datetimefield AS waktu,
        h.lvmdp_energy_lvmdp3 AS total_kwh,
        h.lvmdp__total_lvmdp3 AS real_power,
        h.lvmdp_cos_phi_lvmdp3 AS cos_phi,
        h.lvmdp_hz_lvmdp3 AS freq,
        h.lvmdp_l_l_avg_lvmdp3 AS avg_line_line,
        h.lvmdp_l_n_avg_lvmdp3 AS avg_line_neut,
        h.lvmdp_avg_ampere_lvmdp3 AS avg_current,
        h.lvmdp_r_lvmdp3 AS current_r,
        h.lvmdp_s_lvmdp3 AS current_s,
        h.lvmdp_t_lvmdp3 AS current_t,
        h.lvmdp_r_s_lvmdp3 AS voltage_rs,
        h.lvmdp_s_t_lvmdp3 AS voltage_st,
        h.lvmdp_t_r_lvmdp3 AS voltage_tr
      FROM lvmdp_hmi h
      ORDER BY h.datetimefield DESC;
    `;

    await pool.query(sql3);
    console.log("✓ v_lvmdp_3 updated");

    // Drop and recreate v_lvmdp_4
    await pool.query("DROP VIEW IF EXISTS v_lvmdp_4 CASCADE");
    const sql4 = `
      CREATE VIEW v_lvmdp_4 AS
      SELECT 
        h.datetimefield AS waktu,
        h.lvmdp_energy_lvmdp4 AS total_kwh,
        h.lvmdp__total_lvmdp4 AS real_power,
        h.lvmdp_cos_phi_lvmdp4 AS cos_phi,
        h.lvmdp_hz_lvmdp4 AS freq,
        h.lvmdp_l_l_avg_lvmdp4 AS avg_line_line,
        h.lvmdp_l_n_avg_lvmdp4 AS avg_line_neut,
        h.lvmdp_avg_ampere_lvmdp4 AS avg_current,
        h.lvmdp_r_lvmdp4 AS current_r,
        h.lvmdp_s_lvmdp4 AS current_s,
        h.lvmdp_t_lvmdp4 AS current_t,
        h.lvmdp_r_s_lvmdp4 AS voltage_rs,
        h.lvmdp_s_t_lvmdp4 AS voltage_st,
        h.lvmdp_t_r_lvmdp4 AS voltage_tr
      FROM lvmdp_hmi h
      ORDER BY h.datetimefield DESC;
    `;

    await pool.query(sql4);
    console.log("✓ v_lvmdp_4 updated");

    // Test the updated view
    console.log("\n=== Testing updated view ===");
    const testResult = await pool.query("SELECT * FROM v_lvmdp_1 LIMIT 1");
    console.log("Columns:", Object.keys(testResult.rows[0]));
    console.log("\nSample data:");
    console.log(`  Real Power: ${testResult.rows[0].real_power} kW`);
    console.log(`  Total kWh: ${testResult.rows[0].total_kwh} kWh`);
    console.log(`  Current R: ${testResult.rows[0].current_r} A`);
    console.log(`  Current S: ${testResult.rows[0].current_s} A`);
    console.log(`  Current T: ${testResult.rows[0].current_t} A`);
    console.log(`  Voltage R-S: ${testResult.rows[0].voltage_rs} V`);
    console.log(`  Voltage S-T: ${testResult.rows[0].voltage_st} V`);
    console.log(`  Voltage T-R: ${testResult.rows[0].voltage_tr} V`);

    console.log("\n✅ All views updated successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await pool.end();
  }
}

updateViews();
