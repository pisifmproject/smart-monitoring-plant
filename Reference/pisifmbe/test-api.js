async function testAPI() {
  const today = "2025-12-22";
  const panelId = 2;

  const baseURL = "http://localhost:2000";

  console.log(`\nTesting API endpoints...`);
  console.log(`Base URL: ${baseURL}`);

  try {
    console.log(
      `\n=== Testing GET /api/lvmdp${panelId}/daily-report/hourly/${today} ===`
    );
    const response = await fetch(
      `${baseURL}/api/lvmdp${panelId}/daily-report/hourly/${today}`
    );
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
  }

  try {
    console.log(`\n=== Testing GET /api/lvmdp${panelId}/daily-report/all ===`);
    const response = await fetch(
      `${baseURL}/api/lvmdp${panelId}/daily-report/all`
    );
    console.log("Response status:", response.status);
    const data = await response.json();
    const isArray = Array.isArray(data);
    const records = isArray ? data : Array.isArray(data.data) ? data.data : [];
    console.log(
      "Response data (first 3 records):",
      JSON.stringify(records.slice(0, 3), null, 2)
    );
  } catch (err) {
    console.error("Error:", err.message);
  }

  process.exit(0);
}

testAPI().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
