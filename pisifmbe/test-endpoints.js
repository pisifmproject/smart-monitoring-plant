// Test backend endpoints
const axios = require("axios");

const BASE_URL = "http://localhost:2000/api";

async function testEndpoints() {
  console.log("=== Testing Backend Endpoints ===\n");

  for (let panelId = 1; panelId <= 4; panelId++) {
    try {
      console.log(`\n--- Testing LVMDP ${panelId} ---`);

      // Test /latest endpoint
      try {
        const latestRes = await axios.get(`${BASE_URL}/lvmdp${panelId}/latest`);
        console.log(`✓ /lvmdp${panelId}/latest - OK`);
        console.log(`  Power: ${latestRes.data.totalKwh?.toFixed(2)} kWh`);
      } catch (err) {
        console.log(`✗ /lvmdp${panelId}/latest - ${err.message}`);
      }

      // Test /hmi endpoint
      try {
        const hmiRes = await axios.get(`${BASE_URL}/lvmdp${panelId}/hmi`);
        console.log(`✓ /lvmdp${panelId}/hmi - OK`);
        console.log(`  Current R: ${hmiRes.data.currentR?.toFixed(2)} A`);
        console.log(`  Current S: ${hmiRes.data.currentS?.toFixed(2)} A`);
        console.log(`  Current T: ${hmiRes.data.currentT?.toFixed(2)} A`);
        console.log(`  Voltage R-S: ${hmiRes.data.voltageRS?.toFixed(2)} V`);
      } catch (err) {
        console.log(
          `✗ /lvmdp${panelId}/hmi - ${err.response?.status || err.message}`
        );
      }
    } catch (error) {
      console.log(`✗ LVMDP ${panelId} - ${error.message}`);
    }
  }
}

testEndpoints()
  .then(() => {
    console.log("\n=== Test Complete ===");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
