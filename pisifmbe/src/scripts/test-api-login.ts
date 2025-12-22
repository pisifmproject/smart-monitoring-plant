import axios from "axios";

async function testLoginAPI() {
  const API_URL = "http://10.125.48.102:2002/api";

  console.log("🧪 Testing API connectivity...\n");
  console.log(`API URL: ${API_URL}\n`);

  try {
    // Test 1: Check if API is reachable
    console.log("1️⃣  Testing GET /api...");
    const pingRes = await axios.get(`${API_URL}`);
    console.log(`✅ API is reachable: ${pingRes.data}\n`);
  } catch (error: any) {
    console.log(`❌ API not reachable`);
    console.log(`   Error: ${error.message}\n`);
  }

  try {
    // Test 2: Try login with admin/admifm
    console.log("2️⃣  Testing POST /auth/login with admin/admifm...");
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: "admin",
      password: "admifm",
    });

    console.log(`✅ Login response received:`);
    console.log(`   Status: ${loginRes.status}`);
    console.log(`   Success: ${loginRes.data?.success}`);
    console.log(`   Message: ${loginRes.data?.message}`);
    console.log(`   User: ${loginRes.data?.user?.username}`);
    console.log(
      `   Token: ${
        loginRes.data?.token ? "✅ Token received" : "❌ No token"
      }\n`
    );
  } catch (error: any) {
    console.log(`❌ Login failed`);
    console.log(`   Status: ${error.response?.status}`);
    console.log(
      `   Response: ${JSON.stringify(error.response?.data, null, 2)}`
    );
    console.log(`   Error: ${error.message}\n`);
  }

  try {
    // Test 3: Invalid credentials
    console.log("3️⃣  Testing POST /auth/login with invalid credentials...");
    const invalidRes = await axios.post(`${API_URL}/auth/login`, {
      username: "wronguser",
      password: "wrongpass",
    });

    console.log(`Response: ${JSON.stringify(invalidRes.data, null, 2)}\n`);
  } catch (error: any) {
    console.log(`❌ Expected rejection`);
    console.log(`   Status: ${error.response?.status}`);
    console.log(`   Message: ${error.response?.data?.message}\n`);
  }
}

testLoginAPI();
