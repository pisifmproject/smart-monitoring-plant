import { loginUser } from "../auth/auth.service";

async function testAuth() {
  console.log("=== TESTING AUTH SERVICE ===\n");

  console.log("Test 1: admin / admifm");
  const result1 = await loginUser("admin", "admifm");
  console.log("Result:", JSON.stringify(result1, null, 2));
  console.log("");

  console.log("Test 2: supervisor / spvifm");
  const result2 = await loginUser("supervisor", "spvifm");
  console.log("Result:", JSON.stringify(result2, null, 2));
  console.log("");

  console.log("Test 3: invalid / invalid");
  const result3 = await loginUser("invalid", "invalid");
  console.log("Result:", JSON.stringify(result3, null, 2));

  process.exit(0);
}

testAuth().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
