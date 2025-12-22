// Save this sebagai check-login-response.js di browser console
// Paste di browser console and run

async function testFrontendLogin() {
  console.log("=== TESTING FRONTEND LOGIN CALL ===\n");

  const API_URL = "/api"; // Same as in env

  console.log("API URL:", API_URL);
  console.log("Full URL:", new URL(API_URL, window.location.origin).href);
  console.log("");

  try {
    console.log("Calling login endpoint...");
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admifm" }),
    });

    console.log("✅ Response received!");
    console.log("Status:", response.status);
    console.log("Status Text:", response.statusText);
    console.log("Headers:", {
      "content-type": response.headers.get("content-type"),
      "access-control-allow-origin": response.headers.get(
        "access-control-allow-origin"
      ),
    });

    const data = await response.json();
    console.log("");
    console.log("Response Body:", data);
    console.log("");
    console.log("success:", data.success);
    console.log("message:", data.message);
    console.log("user:", data.user);
    console.log(
      "token:",
      data.token ? `Present (${data.token.substring(0, 20)}...)` : "Not present"
    );
  } catch (error) {
    console.error("❌ ERROR:", error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Run it
testFrontendLogin();
