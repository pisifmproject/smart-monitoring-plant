import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pisifmdb",
  password: "Indofood00",
  port: 5432,
});

async function checkViewColumns() {
  const query = `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_name = 'v_lvmdp_1'
    ORDER BY ordinal_position
  `;

  const result = await pool.query(query);
  console.log("Columns in v_lvmdp_1:");
  console.table(result.rows);

  // Also show sample data
  const sampleQuery = `SELECT * FROM v_lvmdp_1 LIMIT 1`;
  const sample = await pool.query(sampleQuery);
  console.log("\nSample row:");
  console.log(sample.rows[0]);

  await pool.end();
}

checkViewColumns().catch(console.error);
