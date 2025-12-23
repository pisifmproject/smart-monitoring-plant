import "dotenv/config";
console.log("DEBUG DATABASE_URL:", process.env.DATABASE_URL);
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false }, // kalau perlu (mis. cloud DB)
});

export const db = drizzle(pool);
