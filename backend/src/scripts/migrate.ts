import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  console.log('Starting migration...');
  console.log('Database URL:', process.env.DATABASE_URL); // Be careful logging credentials in prod

  try {
    const client = await pool.connect();
    try {
      const sqlPath = path.resolve(__dirname, '../schema.sql');
      const sql = fs.readFileSync(sqlPath, 'utf8');

      console.log('Executing schema.sql...');
      await client.query(sql);
      console.log('Migration completed successfully.');

      // Seed some initial data if tables are empty
      // Check if plants exist
      const plantCheck = await client.query('SELECT count(*) FROM plants');
      if (parseInt(plantCheck.rows[0].count) === 0) {
          console.log('Seeding initial data...');

          // Users
          await client.query(`
            INSERT INTO users (username, password_hash, full_name, email, role) VALUES
            ('admin', 'admin', 'Administrator', 'admin@example.com', 'ADMIN'),
            ('operator', 'operator', 'Operator 1', 'op1@example.com', 'OPERATOR');
          `);

          // Plants
          await client.query(`
            INSERT INTO plants (code, name, location) VALUES
            ('P01', 'Plant Jakarta', 'Jakarta'),
            ('P02', 'Plant Surabaya', 'Surabaya');
          `);

          // Machines (Plant 1)
          await client.query(`
            INSERT INTO machines (plant_id, code, name, type, status, line_group) VALUES
            (1, 'M01', 'Filling Machine 1', 'FILLER', 'RUNNING', 'Line 1'),
            (1, 'M02', 'Packing Machine 1', 'PACKER', 'STOPPED', 'Line 1'),
            (1, 'M03', 'Palletizer 1', 'PALLETIZER', 'RUNNING', 'Line 1');
          `);

           // Machines (Plant 2)
           await client.query(`
            INSERT INTO machines (plant_id, code, name, type, status, line_group) VALUES
            (2, 'M04', 'Filling Machine 2', 'FILLER', 'RUNNING', 'Line 2');
          `);

          // LVMDP Panels
          await client.query(`
            INSERT INTO lvmdp_panels (plant_id, code, name, status) VALUES
            (1, 'LVMDP-01', 'Main Panel P1', 'ACTIVE'),
            (2, 'LVMDP-02', 'Main Panel P2', 'ACTIVE');
          `);

          // Packing Configs
           await client.query(`
            INSERT INTO packing_configs (plant_id, machine_id, code, name, unit, target_per_hour) VALUES
            (1, 1, 'PC01', 'Bottle 600ml', 'bottles', 5000),
            (2, 4, 'PC02', 'Bottle 1500ml', 'bottles', 2000);
          `);

          // Visibility Items (Sample)
          await client.query(`
            INSERT INTO visibility_data_items (key, label, category, group_name) VALUES
            ('kpi_oee', 'OEE', 'GLOBAL_DASHBOARD', 'KPI'),
            ('kpi_production', 'Total Production', 'GLOBAL_DASHBOARD', 'KPI');
          `);

          console.log('Seeding completed.');
      }

    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
