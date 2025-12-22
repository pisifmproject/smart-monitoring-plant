import { sql } from "drizzle-orm";
import { db } from "../db/index";

async function queryPasswords() {
  try {
    console.log("Querying users table...\n");

    const result = await db.execute(
      sql`SELECT id, username, name, password_hash FROM "users" LIMIT 10`
    );

    console.log("Database result:");
    console.log(result.rows);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

queryPasswords();
