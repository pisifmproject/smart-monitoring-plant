import { db } from "../db/index";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function debugLogin() {
  try {
    console.log("=== DATABASE PASSWORD DEBUG ===\n");

    // Get admin user
    const admin = await db
      .select()
      .from(users)
      .where(eq(users.username, "admin"));

    if (!admin || admin.length === 0) {
      console.log("❌ Admin user not found!");
      process.exit(1);
    }

    const adminUser = admin[0];
    console.log("Admin User Found:");
    console.log("- Username:", adminUser.username);
    console.log("- Name:", adminUser.name);
    console.log("- Role:", adminUser.role);
    console.log("- Active:", adminUser.isActive);
    console.log("- Password Hash:", adminUser.passwordHash);
    console.log("");

    // Test passwords
    const passwordsToTest = [
      "admifm",
      "admin123",
      "password",
      "admin",
      "pisifm00",
      "",
    ];

    console.log("Testing passwords:");
    for (const pwd of passwordsToTest) {
      if (!adminUser.passwordHash) {
        console.log(`"${pwd}": ❌ NO HASH IN DATABASE`);
        continue;
      }

      const match = await bcrypt.compare(pwd, adminUser.passwordHash);
      console.log(`"${pwd}": ${match ? "✅ MATCH" : "❌ no match"}`);
    }

    console.log("\n=== Testing Supervisor ===\n");

    const supervisor = await db
      .select()
      .from(users)
      .where(eq(users.username, "supervisor"));
    if (supervisor && supervisor.length > 0) {
      const supUser = supervisor[0];
      console.log("Supervisor User Found:");
      console.log("- Username:", supUser.username);
      console.log("- Password Hash:", supUser.passwordHash);
      console.log("");

      const testPwds = ["spvifm", "supervisor123", "password"];
      for (const pwd of testPwds) {
        if (!supUser.passwordHash) {
          console.log(`"${pwd}": ❌ NO HASH IN DATABASE`);
          continue;
        }
        const match = await bcrypt.compare(pwd, supUser.passwordHash);
        console.log(`"${pwd}": ${match ? "✅ MATCH" : "❌ no match"}`);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

debugLogin();
