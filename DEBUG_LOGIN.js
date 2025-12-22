// File ini untuk dijalankan di browser console untuk debug login
async function testLoginDirectly() {
  const API_URL = "http://10.125.48.102:2002/api";

  console.log("=== DIRECT LOGIN TEST ===");
  console.log("API URL:", API_URL);
  console.log("");

  try {
    console.log("📡 Sending POST to /auth/login...");
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admifm" }),
    });

    console.log("✅ Response received!");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Headers:", response.headers);

    const data = await response.json();
    console.log("");
    console.log("Response Body:", data);
    console.log("");
    console.log("success:", data.success);
    console.log("message:", data.message);
    console.log("user:", data.user);
    console.log("token:", data.token ? "✅ Token present" : "❌ No token");
  } catch (error) {
    console.error("❌ ERROR:", error);
    console.error("Message:", error.message);
  }
}

// Run it
testLoginDirectly();
