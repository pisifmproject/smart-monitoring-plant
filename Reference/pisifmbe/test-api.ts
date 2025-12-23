// Test script to fetch and display API response
(async () => {
  const response = await fetch(
    "http://localhost:2000/api/lvmdp/1/daily-report/2025-12-20"
  );
  const result = await response.json();
  console.log("API Response:");
  console.log(JSON.stringify(result, null, 2));
})();
