async function testLoginAPI() {
  const API_URLS = [
    "http://localhost:2002/api",
    "http://127.0.0.1:2002/api",
    "http://10.125.48.102:2002/api",
  ];

  console.log("🧪 Testing API endpoints...\n");

  for (const API_URL of API_URLS) {
    console.log(`Testing: ${API_URL}`);
    try {
      const res = await fetch(`${API_URL}`);
      const data = await res.text();
      console.log(`✅ WORKING: ${data}\n`);
    } catch (error: any) {
      console.log(`❌ Not reachable: ${error.message}\n`);
    }
  }
}

testLoginAPI();
