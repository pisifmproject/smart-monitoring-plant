// src/scripts/list-users.ts
import { db } from "../db";
import { users } from "../db/schema";

async function listUsers() {
  try {
    console.log("\n🔍 Fetching all users from database...\n");
    const allUsers = await db.select().from(users);

    console.log(`📊 Total users found: ${allUsers.length}\n`);

    if (allUsers.length === 0) {
      console.log("⚠️  No users found in database!\n");
      return;
    }

    allUsers.forEach((user, idx) => {
      console.log(`${idx + 1}. Username: "${user.username}"`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Plants: ${user.plantAccess?.join(", ") || "none"}`);
      console.log(
        `   Password Hash: ${user.passwordHash ? "✅ SET" : "❌ MISSING"}`
      );
      console.log("");
    });

    console.log("✅ Done\n");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

listUsers();
