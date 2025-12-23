import axios from "axios";

async function testAPI() {
  const today = "2025-12-22";
  const panelId = 1;

  const baseURL = "http://localhost:2000";

  console.log(`\nTesting API endpoints...`);
  console.log(`Base URL: ${baseURL}`);

  try {
    console.log(
      `\n=== Testing GET /api/lvmdp${panelId}/daily-report/hourly/${today} ===`
    );
    const response = await axios.get(
      `${baseURL}/api/lvmdp${panelId}/daily-report/hourly/${today}`
    );
    console.log("Response status:", response.status);
    console.log("Response data:", JSON.stringify(response.data, null, 2));
  } catch (err: any) {
    console.error(
      "Error:",
      err.response?.status,
      err.response?.data || err.message
    );
  }

  try {
    console.log(`\n=== Testing GET /api/lvmdp${panelId}/daily-report/all ===`);
    const response = await axios.get(
      `${baseURL}/api/lvmdp${panelId}/daily-report/all`
    );
    console.log("Response status:", response.status);
    console.log(
      "Response data (first 3 records):",
      JSON.stringify(response.data.slice(0, 3), null, 2)
    );
  } catch (err: any) {
    console.error(
      "Error:",
      err.response?.status,
      err.response?.data || err.message
    );
  }

  process.exit(0);
}

testAPI().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
