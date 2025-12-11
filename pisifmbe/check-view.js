// Check view structure
const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "pisifmdb",
  user: "postgres",
  password: "Indofood00",
});

async function checkView() {
  try {
    const query = `
      SELECT 
        column_name, 
        data_type,
        udt_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'v_lvmdp_1'
      ORDER BY ordinal_position
    `;

    const result = await pool.query(query);
    console.log("Columns in v_lvmdp_1:\n");
    result.rows.forEach((row) => {
      console.log(
        `  ${row.column_name.padEnd(20)} ${row.data_type.padEnd(20)} (${
          row.udt_name
        })`
      );
    });

    // Sample data
    console.log("\n\nSample data from v_lvmdp_1:\n");
    const dataQuery = `SELECT * FROM v_lvmdp_1 LIMIT 2`;
    const dataResult = await pool.query(dataQuery);
    console.log(dataResult.rows);

    await pool.end();
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

checkView();
