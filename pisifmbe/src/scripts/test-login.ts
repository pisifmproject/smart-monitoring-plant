// src/scripts/test-login.ts
import { db } from "../db";
import { users } from "../db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function testLogin(username: string, password: string) {
  try {
    console.log(`\n🔐 Testing login: "${username}" / "${password}"\n`);

    // Fetch user
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    const user = result[0];

    if (!user) {
      console.log("❌ User not found in database");
      return;
    }

    console.log(`✅ User found: ${user.name}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Is Active: ${user.isActive}`);
    console.log(`   Password Hash Exists: ${user.passwordHash ? "YES" : "NO"}`);

    if (!user.passwordHash) {
      console.log("\n❌ ERROR: Password hash is missing!");
      return;
    }

    // Test bcrypt
    console.log(`\n🔍 Testing bcrypt.compare()...`);
    const isValid = await bcrypt.compare(password, user.passwordHash);

    console.log(`   Input Password: "${password}"`);
    console.log(`   Password Valid: ${isValid ? "✅ YES" : "❌ NO"}`);

    if (isValid) {
      console.log("\n✅ LOGIN WOULD SUCCEED");
    } else {
      console.log("\n❌ LOGIN WOULD FAIL - PASSWORD INCORRECT");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("        PASSWORD VERIFICATION TEST");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Test with correct passwords from seed-users.ts
  await testLogin("admin", "admifm");
  await testLogin("supervisor", "spvifm");
  await testLogin("operator", "oprifm");
  await testLogin("maintenance", "mtcifm");
  await testLogin("qc", "qcifm");
  await testLogin("management", "mngifm");
  await testLogin("guest", "gsifm");

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Test complete\n");
  process.exit(0);
}

main().catch(console.error);
