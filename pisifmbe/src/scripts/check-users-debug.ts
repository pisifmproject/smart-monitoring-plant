// src/scripts/check-users-debug.ts
import { db } from "../db";
import { users } from "../db/schema";
import bcrypt from "bcryptjs";

const debugUsers = async () => {
  try {
    console.log("🔍 Fetching all users from database...");
    const allUsers = await db.select().from(users);

    console.log(`\n📊 Total users found: ${allUsers.length}\n`);

    if (allUsers.length === 0) {
      console.log("⚠️  No users found in database!");
      return;
    }

    for (const user of allUsers) {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`👤 User ID: ${user.id}`);
      console.log(`📝 Username: ${user.username}`);
      console.log(`👤 Name: ${user.name}`);
      console.log(`🔐 Role: ${user.role}`);
      console.log(`🏭 Plant Access: ${JSON.stringify(user.plant_access)}`);
      console.log(`✅ Is Active: ${user.is_active}`);
      console.log(
        `🔒 Password Hash (first 50 chars): ${String(
          user.password_hash
        ).substring(0, 50)}...`
      );
      console.log(`📅 Created At: ${user.created_at}`);

      // Test bcrypt verification with a test password
      // NOTE: You need to provide the correct plain-text password to test
      console.log(`\n   Testing password verification:...`);
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`\n✅ Debug complete. Check the user details above.\n`);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
  } finally {
    process.exit(0);
  }
};

debugUsers();
