async function testBackendResponse() {
  const API_URL = "http://10.125.48.102:2002/api";

  console.log("=== TESTING BACKEND RESPONSE FORMAT ===\n");

  try {
    console.log("📡 Test 1: Valid credentials (admin/admifm)");
    const res1 = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admifm" }),
    });

    console.log("Status:", res1.status);
    const data1 = await res1.json();
    console.log("Raw Response:", JSON.stringify(data1, null, 2));
    console.log("Keys in response:", Object.keys(data1));
    console.log("");

    console.log("📡 Test 2: Invalid credentials");
    const res2 = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "invalid", password: "invalid" }),
    });

    console.log("Status:", res2.status);
    const data2 = await res2.json();
    console.log("Raw Response:", JSON.stringify(data2, null, 2));
    console.log("Keys in response:", Object.keys(data2));
    console.log("");

    console.log("📡 Test 3: No body");
    const res3 = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "", password: "" }),
    });

    console.log("Status:", res3.status);
    const data3 = await res3.json();
    console.log("Raw Response:", JSON.stringify(data3, null, 2));
  } catch (error: any) {
    console.error("ERROR:", error.message);
  }
}

testBackendResponse();
