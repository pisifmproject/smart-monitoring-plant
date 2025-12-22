// Paste ini di browser console untuk test auth.ts langsung
async function testAuthDirect() {
  console.log("=== TESTING AUTH STORE DIRECTLY ===\n");

  // Import auth store
  const { useAuth } = await import("/src/stores/auth.ts");
  const auth = useAuth();

  console.log("Auth store imported:", auth);
  console.log("Login function type:", typeof auth.login);
  console.log("");

  try {
    console.log("Calling auth.login('admin', 'admifm')...");
    const result = await auth.login("admin", "admifm");

    console.log("Result:", result);
    console.log("Result type:", typeof result);
    console.log("Result.success:", result?.success);
    console.log("Result.message:", result?.message);
  } catch (error) {
    console.error("Error:", error);
  }
}

testAuthDirect();
