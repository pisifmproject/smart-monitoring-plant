// seed-users.ts - Seed initial users from ref_truth
import { db } from "./src/db";
import { users } from "./src/db/schema";
import bcrypt from "bcryptjs";

interface UserSeed {
  username: string;
  password: string;
  name: string;
  role: string;
  plantAccess: string[];
}

// Users from ref_truth/services/auth.ts
const INITIAL_USERS: UserSeed[] = [
  {
    username: "admin",
    password: "admifm",
    name: "System Administrator",
    role: "Administrator",
    plantAccess: ["CIKOKOL", "SEMARANG", "CIKUPA", "AGRO"],
  },
  {
    username: "supervisor",
    password: "spvifm",
    name: "Supervisor Cikupa",
    role: "Supervisor",
    plantAccess: ["CIKUPA"],
  },
  {
    username: "operator",
    password: "oprifm",
    name: "Operator Cikokol",
    role: "Operator",
    plantAccess: ["CIKOKOL"],
  },
  {
    username: "maintenance",
    password: "mtcifm",
    name: "Maintenance Team",
    role: "Maintenance",
    plantAccess: ["CIKOKOL", "SEMARANG", "CIKUPA", "AGRO"],
  },
  {
    username: "qc",
    password: "qcifm",
    name: "Quality Control",
    role: "Quality Control",
    plantAccess: ["CIKOKOL", "SEMARANG", "CIKUPA", "AGRO"],
  },
  {
    username: "management",
    password: "mngifm",
    name: "Pak Bos",
    role: "Management",
    plantAccess: ["CIKOKOL", "SEMARANG", "CIKUPA", "AGRO"],
  },
  {
    username: "guest",
    password: "gsifm",
    name: "Guest",
    role: "Viewer",
    plantAccess: ["CIKOKOL", "SEMARANG", "CIKUPA", "AGRO"],
  },
];

async function seedUsers() {
  try {
    console.log("🌱 Starting user seed...");

    // Hash passwords and insert users
    const saltRounds = 10;

    for (const user of INITIAL_USERS) {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

      await db
        .insert(users)
        .values({
          username: user.username,
          passwordHash: hashedPassword,
          name: user.name,
          role: user.role,
          plantAccess: user.plantAccess,
          isActive: true,
        })
        .onConflictDoNothing(); // Skip if user already exists

      console.log(`✓ Created user: ${user.username} (${user.role})`);
    }

    console.log("✅ User seed completed successfully!");
    console.log(`📊 Total users seeded: ${INITIAL_USERS.length}`);
    console.log("\n📝 User credentials:");
    INITIAL_USERS.forEach((user) => {
      console.log(`   ${user.username}: ${user.password}`);
    });
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seedUsers();
