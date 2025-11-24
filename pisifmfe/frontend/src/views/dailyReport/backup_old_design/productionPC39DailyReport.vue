<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const lineId = "LINE_A_PC39";
const machineName = "PC39";

const selectedDate = ref(new Date().toISOString().split("T")[0]);
const maxDate = computed(() => new Date().toISOString().split("T")[0]);
const activeTab = ref<"shift" | "hourly">("shift");
const reportData = ref<any>(null);
const hourlyData = ref<any[]>([]);
const loading = ref(false);
const loadingHourly = ref(false);

const fetchDailyReport = async () => {
  loading.value = true;
  try {
    console.log("Fetching report for:", lineId, selectedDate.value);
    const response = await fetch(
      `http://localhost:2000/api/daily-report/production/${lineId}?date=${selectedDate.value}`
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

const fetchHourlyReport = async () => {
  loadingHourly.value = true;
  try {
    // Generate hourly mock data from shift data
    if (reportData.value?.shifts) {
      hourlyData.value = [];
      reportData.value.shifts.forEach((shift: any) => {
        const hoursInShift = 8;
        const baseTarget = shift.target / hoursInShift;
        const baseActual = shift.actual / hoursInShift;

        for (let i = 0; i < hoursInShift; i++) {
          const hour =
            (shift.shift === 1 ? 7 : shift.shift === 2 ? 15 : 23) + i;
          hourlyData.value.push({
            hour: hour % 24,
            time: `${String(hour % 24).padStart(2, "0")}:00`,
            shift: shift.shift,
            target: Math.floor(baseTarget + (Math.random() * 50 - 25)),
            actual: Math.floor(baseActual + (Math.random() * 40 - 20)),
            defect: Math.floor(Math.random() * 5),
            efficiency: (85 + Math.random() * 15).toFixed(1),
          });
        }
      });
    }
  } catch (error) {
    console.error("Error generating hourly report:", error);
  } finally {
    loadingHourly.value = false;
  }
};

const loadData = async () => {
  await fetchDailyReport();
  if (activeTab.value === "hourly") {
    await fetchHourlyReport();
  }
};

const switchTab = async (tab: "shift" | "hourly") => {
  activeTab.value = tab;
  if (tab === "hourly" && hourlyData.value.length === 0) {
    await fetchHourlyReport();
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="daily-report-wrapper">
    <div class="daily-report-container">
      <!-- Header -->
      <div class="header-section">
        <div>
          <h1 class="page-title">📊 Daily Report - {{ machineName }}</h1>
          <p class="page-subtitle">Production Line Report</p>
        </div>
        <div class="date-selector">
          <label for="report-date">Report Date:</label>
          <input
            type="date"
            id="report-date"
            v-model="selectedDate"
            :max="maxDate"
            @change="loadData"
            class="date-input"
          />
        </div>
      </div>

      <!-- Tab Selector -->
      <div class="tab-selector">
        <button
          :class="['tab-button', { active: activeTab === 'shift' }]"
          @click="switchTab('shift')"
        >
          📋 Shift Report
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'hourly' }]"
          @click="switchTab('hourly')"
        >
          🕐 Hourly Report
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading report data...</p>
      </div>

      <!-- Shift Report Content -->
      <div
        v-else-if="reportData && activeTab === 'shift'"
        class="report-content"
      >
        <!-- Summary Cards -->
        <div class="summary-section">
          <div class="summary-card">
            <div class="summary-label">Total Target</div>
            <div class="summary-value">
              {{ reportData.summary.totalTarget }}
            </div>
            <div class="summary-unit">units</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total Actual</div>
            <div class="summary-value">
              {{ reportData.summary.totalActual }}
            </div>
            <div class="summary-unit">units</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total Defects</div>
            <div class="summary-value danger">
              {{ reportData.summary.totalDefect }}
            </div>
            <div class="summary-unit">units</div>
          </div>
          <div class="summary-card highlight">
            <div class="summary-label">Average OEE</div>
            <div class="summary-value">
              {{ reportData.summary.avgOee.toFixed(2) }}%
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
                  <th>Target</th>
                  <th>Actual</th>
                  <th>Achievement %</th>
                  <th>Defects</th>
                  <th>Availability</th>
                  <th>Performance</th>
                  <th>Quality</th>
                  <th>OEE</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="shift in reportData.shifts" :key="shift.shift">
                  <td class="shift-cell">Shift {{ shift.shift }}</td>
                  <td>{{ shift.startTime }} - {{ shift.endTime }}</td>
                  <td>{{ shift.target }}</td>
                  <td>{{ shift.actual }}</td>
                  <td :class="getAchievementClass(shift.actual, shift.target)">
                    {{ ((shift.actual / shift.target) * 100).toFixed(1) }}%
                  </td>
                  <td class="defect-cell">{{ shift.defect }}</td>
                  <td>{{ shift.availability.toFixed(1) }}%</td>
                  <td>{{ shift.performance.toFixed(1) }}%</td>
                  <td>{{ shift.quality.toFixed(1) }}%</td>
                  <td class="oee-cell" :class="getOeeClass(shift.oee)">
                    {{ shift.oee.toFixed(1) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- OEE Breakdown -->
        <div class="breakdown-section">
          <h2 class="section-title">OEE Component Analysis</h2>
          <div class="breakdown-grid">
            <div
              v-for="shift in reportData.shifts"
              :key="shift.shift"
              class="breakdown-card"
            >
              <h3>Shift {{ shift.shift }}</h3>
              <div class="breakdown-metrics">
                <div class="breakdown-item">
                  <span class="breakdown-label">Availability:</span>
                  <span class="breakdown-value"
                    >{{ shift.availability.toFixed(1) }}%</span
                  >
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">Performance:</span>
                  <span class="breakdown-value"
                    >{{ shift.performance.toFixed(1) }}%</span
                  >
                </div>
                <div class="breakdown-item">
                  <span class="breakdown-label">Quality:</span>
                  <span class="breakdown-value"
                    >{{ shift.quality.toFixed(1) }}%</span
                  >
                </div>
                <div class="breakdown-item highlight">
                  <span class="breakdown-label">OEE:</span>
                  <span class="breakdown-value"
                    >{{ shift.oee.toFixed(1) }}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hourly Report Content -->
      <div v-else-if="activeTab === 'hourly'" class="report-content">
        <div v-if="loadingHourly" class="loading-state">
          <div class="spinner"></div>
          <p>Loading hourly data...</p>
        </div>
        <div v-else-if="hourlyData.length > 0" class="table-section">
          <h2 class="section-title">Hourly Production Data</h2>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Hour</th>
                  <th>Shift</th>
                  <th>Target</th>
                  <th>Actual</th>
                  <th>Achievement %</th>
                  <th>Defects</th>
                  <th>Efficiency</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(hour, index) in hourlyData" :key="index">
                  <td class="shift-cell">{{ hour.time }}</td>
                  <td>Shift {{ hour.shift }}</td>
                  <td>{{ hour.target }}</td>
                  <td>{{ hour.actual }}</td>
                  <td :class="getAchievementClass(hour.actual, hour.target)">
                    {{ ((hour.actual / hour.target) * 100).toFixed(1) }}%
                  </td>
                  <td class="defect-cell">{{ hour.defect }}</td>
                  <td>{{ hour.efficiency }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-else class="no-data-state">
          <p>No hourly data available.</p>
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
    getOeeClass(oee: number) {
      if (oee >= 85) return "oee-excellent";
      if (oee >= 75) return "oee-good";
      return "oee-poor";
    },
  },
};
</script>

<style scoped>
.daily-report-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

/* Tab Selector */
.tab-selector {
  display: flex;
  gap: 12px;
  padding: 20px 32px;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.tab-button {
  padding: 12px 24px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-button:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.tab-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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
  border-top: 4px solid #667eea;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  color: #667eea;
}

.defect-cell {
  color: #ef4444;
  font-weight: 600;
}

.oee-cell {
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

.oee-excellent {
  color: #10b981;
}

.oee-good {
  color: #f59e0b;
}

.oee-poor {
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
  color: #667eea;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
