import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "pisifmdb",
  password: "Indofood00",
  port: 5432,
});

async function checkTableSchema() {
  const query = `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'daily_electrical_reports'
    ORDER BY ordinal_position
  `;

  const result = await pool.query(query);
  console.log("Columns in daily_electrical_reports table:");
  console.table(result.rows);

  await pool.end();
}

checkTableSchema().catch(console.error);
