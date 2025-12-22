async function testLoginAPI() {
  const API_URL = "http://10.125.48.102:2002/api";

  console.log("🧪 Testing API connectivity...\n");
  console.log(`API URL: ${API_URL}\n`);

  try {
    // Test 1: Check if API is reachable
    console.log("1️⃣  Testing GET /api...");
    const pingRes = await fetch(`${API_URL}`);
    const pingData = await pingRes.text();
    console.log(`✅ API is reachable: ${pingData}\n`);
  } catch (error: any) {
    console.log(`❌ API not reachable`);
    console.log(`   Error: ${error.message}\n`);
  }

  try {
    // Test 2: Try login with admin/admifm
    console.log("2️⃣  Testing POST /auth/login with admin/admifm...");
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "admin", password: "admifm" }),
    });

    const loginData = await loginRes.json();

    console.log(`✅ Login response received:`);
    console.log(`   Status: ${loginRes.status}`);
    console.log(`   Success: ${loginData?.success}`);
    console.log(`   Message: ${loginData?.message}`);
    console.log(`   User: ${loginData?.user?.username}`);
    console.log(
      `   Token: ${loginData?.token ? "✅ Token received" : "❌ No token"}\n`
    );
  } catch (error: any) {
    console.log(`❌ Login failed`);
    console.log(`   Error: ${error.message}\n`);
  }

  try {
    // Test 3: Invalid credentials
    console.log("3️⃣  Testing POST /auth/login with invalid credentials...");
    const invalidRes = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "wronguser", password: "wrongpass" }),
    });

    const invalidData = await invalidRes.json();
    console.log(`Response: ${JSON.stringify(invalidData, null, 2)}\n`);
  } catch (error: any) {
    console.log(`❌ Expected rejection`);
    console.log(`   Error: ${error.message}\n`);
  }
}

testLoginAPI();
