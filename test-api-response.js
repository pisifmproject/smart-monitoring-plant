// Test API response format
async function testAPIResponse() {
  console.log("=== TESTING API RESPONSE ===\n");

  const API_URL = "/api";
  const fullURL = new URL(API_URL + "/auth/login", window.location.origin).href;

  console.log("API_URL from env:", API_URL);
  console.log("Full URL:", fullURL);
  console.log("Current Origin:", window.location.origin);
  console.log("");

  try {
    console.log("Making fetch request...");
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admifm" }),
    });

    console.log("Fetch succeeded");
    console.log("Status:", response.status);
    console.log("StatusText:", response.statusText);
    console.log("OK:", response.ok);
    console.log("Headers:");
    console.log("  Content-Type:", response.headers.get("content-type"));
    console.log(
      "  Access-Control-Allow-Origin:",
      response.headers.get("access-control-allow-origin")
    );

    const data = await response.json();
    console.log("");
    console.log("Response body:", data);
    console.log("Type:", typeof data);
    console.log("Keys:", Object.keys(data));
  } catch (error) {
    console.error("Fetch failed:", error);
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
  }
}

testAPIResponse();
