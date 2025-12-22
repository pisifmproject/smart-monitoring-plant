async function testRelativePathAPI() {
  const API_URL = "/api";
  const fullUrl = new URL(API_URL + "/auth/login", window.location.origin).href;

  console.log("API_URL:", API_URL);
  console.log("Full URL:", fullUrl);
  console.log("Current Origin:", window.location.origin);
  console.log("");

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admifm" }),
    });

    console.log("Response received");
    console.log("Status:", response.status);

    const data = await response.json();
    console.log("Response body:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call it
testRelativePathAPI();
