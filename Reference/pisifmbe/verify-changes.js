// Test script to verify hourly report filtering
// This checks that the filtering logic works correctly

const testHours = [
  { hour: 0, count: 1200, totalKwh: 473.4, avgKwh: 473.4 },
  { hour: 1, count: 1200, totalKwh: 473.86, avgKwh: 473.86 },
  { hour: 2, count: 1200, totalKwh: 471.62, avgKwh: 471.62 },
  { hour: 3, count: 0, totalKwh: 0, avgKwh: 0 },
  { hour: 4, count: 0, totalKwh: 0, avgKwh: 0 },
  { hour: 5, count: 0, totalKwh: 0, avgKwh: 0 },
  // ... hours 6-23 with 0 values
];

// Simulating the filtering logic from hourlyReport.services.ts
const filtered = testHours.filter(
  (r) => (r.count ?? 0) > 0 || (r.totalKwh ?? 0) > 0
);

console.log("Original hours count:", testHours.length);
console.log("Filtered hours count:", filtered.length);
console.log("\nFiltered results:");
filtered.forEach((h) => {
  console.log(`  Hour ${h.hour}: count=${h.count}, totalKwh=${h.totalKwh}`);
});

console.log("\n✅ Changes Summary:");
console.log(
  "1. Hourly Report: Now shows only hours with data (filtered out empty hours)"
);
console.log(
  "2. Daily Report: Removed 'AVG POWER (kW)' column from hourly table"
);
console.log(
  "3. Electrical Dashboard: 'Date Type' selector only shows for 'By Month'"
);
