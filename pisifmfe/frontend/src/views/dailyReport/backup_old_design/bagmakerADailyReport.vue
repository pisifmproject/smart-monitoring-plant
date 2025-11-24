<script setup lang="ts">
import { ref, onMounted } from "vue";

const lineId = "LINE_A_BAGMAKER";
const lineName = "Line A BagMaker";

const selectedDate = ref(new Date().toISOString().split("T")[0]);
const reportData = ref<any>(null);
const loading = ref(false);

const fetchDailyReport = async () => {
  loading.value = true;
  try {
    console.log("Fetching report for:", lineId, selectedDate.value);
    const response = await fetch(
      `http://localhost:2000/api/daily-report/bagmaker/${lineId}?date=${selectedDate.value}`
    );
    const result = await response.json();
    console.log("API Response:", result);

    if (result.success && result.data) {
      reportData.value = result.data;
      console.log("Report data set:", reportData.value);
    } else {
      console.error("No data in response:", result);
    }
  } catch (error) {
    console.error("Error fetching daily report:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDailyReport();
});
</script>

<template>
  <div class="daily-report-wrapper">
    <div class="daily-report-container">
      <!-- Header -->
      <div class="header-section">
        <div>
          <h1 class="page-title"> Daily Report - {{ lineName }}</h1>
          <p class="page-subtitle">Packing BagMaker Report</p>
        </div>
        <div class="date-selector">
          <label for="report-date">Report Date:</label>
          <input
            type="date"
            id="report-date"
            v-model="selectedDate"
            @change="fetchDailyReport"
            class="date-input"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading report data...</p>
      </div>

      <!-- Report Content -->
      <div v-else-if="reportData" class="report-content">
        <!-- Summary Cards -->
        <div class="summary-section">
          <div class="summary-card">
            <div class="summary-label">Total Target Bags</div>
            <div class="summary-value">
              {{ reportData.summary.totalTargetBags }}
            </div>
            <div class="summary-unit">bags</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total Actual Bags</div>
            <div class="summary-value">
              {{ reportData.summary.totalActualBags }}
            </div>
            <div class="summary-unit">bags</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total Rejects</div>
            <div class="summary-value danger">
              {{ reportData.summary.totalRejects }}
            </div>
            <div class="summary-unit">bags</div>
          </div>
          <div class="summary-card highlight">
            <div class="summary-label">Average Efficiency</div>
            <div class="summary-value">
              {{ reportData.summary.avgEfficiency.toFixed(1) }}%
            </div>
            <div class="summary-unit">Overall</div>
          </div>
        </div>

        <!-- Shift Details Table -->
        <div class="table-section">
          <h2 class="section-title">Shift Performance Details</h2>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Shift</th>
                  <th>Time</th>
                  <th>Target Bags</th>
                  <th>Actual Bags</th>
                  <th>Achievement %</th>
                  <th>Rejects</th>
                  <th>Avg Speed (bags/min)</th>
                  <th>Max Speed (bags/min)</th>
                  <th>Efficiency</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="shift in reportData.shifts" :key="shift.shift">
                  <td class="shift-cell">Shift {{ shift.shift }}</td>
                  <td>{{ shift.startTime }} - {{ shift.endTime }}</td>
                  <td>{{ shift.targetBags }}</td>
                  <td>{{ shift.actualBags }}</td>
                  <td
                    :class="
                      getAchievementClass(shift.actualBags, shift.targetBags)
                    "
                  >
                    {{
                      ((shift.actualBags / shift.targetBags) * 100).toFixed(1)
                    }}%
                  </td>
                  <td class="reject-cell">{{ shift.rejectCount }}</td>
                  <td>{{ shift.avgSpeed }}</td>
                  <td>{{ shift.maxSpeed }}</td>
                  <td
                    class="efficiency-cell"
                    :class="getEfficiencyClass(shift.efficiency)"
                  >
                    {{ shift.efficiency.toFixed(1) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Speed Analysis -->
        <div class="breakdown-section">
          <h2 class="section-title">Speed Analysis by Shift</h2>
          <div class="breakdown-grid">
            <div
              v-for="shift in reportData.shifts"
              :key="shift.shift"
              class="breakdown-card"
            >
              <h3>Shift {{ shift.shift }}</h3>
              <div class="breakdown-metrics">
                <div class="breakdown-item">
                  <span class="breakdown-label">Avg Speed:</span>
                  <span class="breakdown-value"
                    >{{ shift.avgSpeed }} bags/min</span
                  >
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">Max Speed:</span>
                  <span class="breakdown-value"
                    >{{ shift.maxSpeed }} bags/min</span
                  >
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">Target Bags:</span>
                  <span class="breakdown-value">{{ shift.targetBags }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">Actual Bags:</span>
                  <span class="breakdown-value">{{ shift.actualBags }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">Rejects:</span>
                  <span class="breakdown-value">{{ shift.rejectCount }}</span>
                </div>
                <div class="breakdown-item highlight">
                  <span class="breakdown-label">Efficiency:</span>
                  <span class="breakdown-value"
                    >{{ shift.efficiency.toFixed(1) }}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <div v-else class="no-data-state">
        <p>No data available for the selected date.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    getAchievementClass(actual: number, target: number) {
      const percentage = (actual / target) * 100;
      if (percentage >= 95) return "achievement-excellent";
      if (percentage >= 85) return "achievement-good";
      return "achievement-poor";
    },
    getEfficiencyClass(efficiency: number) {
      if (efficiency >= 95) return "efficiency-excellent";
      if (efficiency >= 85) return "efficiency-good";
      return "efficiency-poor";
    },
  },
};
</script>

<style scoped>
.daily-report-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
  padding: 20px;
}

.daily-report-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header */
.header-section {
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
  color: white;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 12px;
}

.date-selector label {
  font-weight: 500;
}

.date-input {
  padding: 8px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

.date-input:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Loading State */
.loading-state {
  padding: 60px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #9333ea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Summary Section */
.summary-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 32px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.summary-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.summary-card.highlight {
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
  color: white;
}

.summary-label {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 12px;
}

.summary-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.summary-value.danger {
  color: #ef4444;
}

.summary-card.highlight .summary-value,
.summary-card.highlight .summary-label,
.summary-card.highlight .summary-unit {
  color: white;
}

.summary-unit {
  font-size: 0.85rem;
  opacity: 0.6;
}

/* Table Section */
.table-section {
  padding: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1e293b;
}

.table-container {
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table thead {
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
  color: white;
}

.data-table th {
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s ease;
}

.data-table tbody tr:hover {
  background-color: #f8fafc;
}

.data-table td {
  padding: 16px;
  font-size: 0.95rem;
}

.shift-cell {
  font-weight: 600;
  color: #9333ea;
}

.reject-cell {
  color: #ef4444;
  font-weight: 600;
}

.efficiency-cell {
  font-weight: 700;
  font-size: 1.1rem;
}

.achievement-excellent {
  color: #10b981;
  font-weight: 600;
}

.achievement-good {
  color: #f59e0b;
  font-weight: 600;
}

.achievement-poor {
  color: #ef4444;
  font-weight: 600;
}

.efficiency-excellent {
  color: #10b981;
}

.efficiency-good {
  color: #f59e0b;
}

.efficiency-poor {
  color: #ef4444;
}

/* Breakdown Section */
.breakdown-section {
  padding: 32px;
  background: #f8fafc;
}

.breakdown-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.breakdown-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.breakdown-card h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #9333ea;
}

.breakdown-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.breakdown-item.highlight {
  background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%);
  color: white;
}

.breakdown-label {
  font-weight: 600;
  font-size: 0.95rem;
}

.breakdown-value {
  font-size: 1.1rem;
  font-weight: 700;
}

/* No Data State */
.no-data-state {
  padding: 60px;
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
}
</style>

