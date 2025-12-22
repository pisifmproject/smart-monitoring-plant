import { db } from "../db/index";
import { users } from "../db/schema";
import bcrypt from "bcryptjs";

async function testPasswords() {
  try {
    console.log("🔐 Testing password hashes from database...\n");

    const allUsers = await db.select().from(users);

    // List of password combinations to test
    const passwordsToTest = [
      { password: "admifm", desc: "seed password" },
      { password: "spvifm", desc: "seed password" },
      { password: "oprifm", desc: "seed password" },
      { password: "mtcifm", desc: "seed password" },
      { password: "qcifm", desc: "seed password" },
      { password: "mngifm", desc: "seed password" },
      { password: "gsifm", desc: "seed password" },
      { password: "pisifm00", desc: "common" },
      { password: "password", desc: "common" },
      { password: "admin", desc: "common" },
      { password: "123456", desc: "common" },
      { password: "admin123", desc: "common" },
    ];

    console.log("Testing common passwords against admin hash:\n");
    console.log("=".repeat(80));

    const adminUser = allUsers.find((u) => u.username === "admin");
    if (!adminUser || !adminUser.passwordHash) {
      console.log("❌ Admin user not found or no password hash");
      process.exit(1);
    }

    for (const pwd of passwordsToTest) {
      const match = await bcrypt.compare(pwd.password, adminUser.passwordHash);
      const status = match ? "✅ MATCH" : "❌ no match";
      console.log(`"${pwd.password}" (${pwd.desc}): ${status}`);
    }

    console.log("\n" + "=".repeat(80));
    console.log("\nNow checking ALL users to find real passwords:\n");

    // Try to find which password matches which user
    for (const user of allUsers) {
      if (!user.passwordHash) continue;

      console.log(`\n${user.username}:`);
      let found = false;

      for (const pwd of passwordsToTest) {
        const match = await bcrypt.compare(pwd.password, user.passwordHash);
        if (match) {
          console.log(`  ✅ PASSWORD FOUND: "${pwd.password}"`);
          found = true;
        }
      }

      if (!found) {
        console.log(`  ❌ Password not in test list. Trying to decrypt...`);
        console.log(`  Hash: ${user.passwordHash.substring(0, 30)}...`);
      }
    }

    console.log("\n" + "=".repeat(80));
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testPasswords();
