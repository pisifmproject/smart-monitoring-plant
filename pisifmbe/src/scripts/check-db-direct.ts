import { db } from "../db/index";
import { users } from "../db/schema";

async function checkDatabase() {
  try {
    console.log("🔍 Connecting to database...\n");

    // Get all users from database
    const allUsers = await db.select().from(users);

    console.log(`📊 Total users in database: ${allUsers.length}\n`);
    console.log("=".repeat(80));

    // Display each user
    allUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. User: ${user.username}`);
      console.log(`   - Name: ${user.name}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - Active: ${user.isActive}`);
      console.log(
        `   - Password Hash: ${user.passwordHash?.substring(0, 20)}...`
      );
      console.log(`   - Plant Access: ${JSON.stringify(user.plantAccess)}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log("\n✅ Database check complete!\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

checkDatabase();
