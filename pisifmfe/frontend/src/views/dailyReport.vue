<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { getDailyReportAll, getDailyHourly } from "@/lib/api";

const route = useRoute();
const panelId = (parseInt(String(route.query.panel || 1)) || 1) as
  | 1
  | 2
  | 3
  | 4;

// Date picker
const selectedDate = ref<string>(new Date().toISOString().split("T")[0]);
const minDate = ref<string>("2024-01-01");
const maxDate = computed(() => new Date().toISOString().split("T")[0]);

// Tab state
const activeTab = ref<"shift" | "hourly">("shift");

// Data states
const shiftReports = ref<any[]>([]);
const hourlyReports = ref<any[]>([]);
const loadingShift = ref(false);
const loadingHourly = ref(false);
const errorShift = ref<string | null>(null);
const errorHourly = ref<string | null>(null);

// Local storage cache - v4: updated hourly calculation to use raw data
const cacheKey = (date: string) => `lvmdp_${panelId}_hourly_v4_${date}`;

const numberFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatNumber(v: any) {
  if (v === null || v === undefined || v === "-") return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return "-";
  return numberFormatter.format(n);
}

function formatTime(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Fetch all daily reports for shift summaries
async function loadShiftReports() {
  loadingShift.value = true;
  errorShift.value = null;
  try {
    const data = await getDailyReportAll(panelId);
    if (Array.isArray(data)) {
      const filtered = data.filter((row) => {
        const rowDate = row.date || row.reportDate;
        return rowDate === selectedDate.value;
      });

      if (filtered.length > 0) {
        const report = filtered[0];
        // Map database structure to shift array
        shiftReports.value = [
          {
            shift: 1,
            totalKwh: report.shift1TotalKwh || 0,
            avgKwh: report.shift1AvgKwh || 0,
            iavg: report.shift1AvgCurrent || 0,
            cosPhi: report.shift1CosPhi || 0,
          },
          {
            shift: 2,
            totalKwh: report.shift2TotalKwh || 0,
            avgKwh: report.shift2AvgKwh || 0,
            iavg: report.shift2AvgCurrent || 0,
            cosPhi: report.shift2CosPhi || 0,
          },
          {
            shift: 3,
            totalKwh: report.shift3TotalKwh || 0,
            avgKwh: report.shift3AvgKwh || 0,
            iavg: report.shift3AvgCurrent || 0,
            cosPhi: report.shift3CosPhi || 0,
          },
        ];
      } else {
        shiftReports.value = [
          { shift: 1, totalKwh: 0, avgKwh: 0, iavg: 0, cosPhi: 0 },
          { shift: 2, totalKwh: 0, avgKwh: 0, iavg: 0, cosPhi: 0 },
          { shift: 3, totalKwh: 0, avgKwh: 0, iavg: 0, cosPhi: 0 },
        ];
      }
    }
  } catch (err) {
    errorShift.value = String(err);
  } finally {
    loadingShift.value = false;
  }
}

// Fetch and cache hourly reports
async function loadHourlyReports() {
  loadingHourly.value = true;
  errorHourly.value = null;

  try {
    // Check local storage cache first
    const cached = localStorage.getItem(cacheKey(selectedDate.value));
    if (cached) {
      hourlyReports.value = JSON.parse(cached);
      return;
    }

    // Fetch from API
    const data = await getDailyHourly(panelId, selectedDate.value);
    if (Array.isArray(data)) {
      const normalized = data.map((row: any) => ({
        hour: row.hour,
        totalKwh: row.totalKwh ?? row.avg_total_kwh ?? row.total_kwh ?? 0,
        avgKwh: row.avgKwh ?? row.avg_kwh ?? 0,
        cosPhi: row.cosPhi ?? row.avg_cos_phi ?? row.cos_phi ?? 0,
        avgCurrent:
          row.avgCurrent ?? row.avg_avg_current ?? row.avg_current ?? 0,
      }));

      hourlyReports.value = normalized;

      // Save to local storage
      localStorage.setItem(
        cacheKey(selectedDate.value),
        JSON.stringify(normalized)
      );
    }
  } catch (err) {
    errorHourly.value = String(err);
  } finally {
    loadingHourly.value = false;
  }
}

// Load data when date changes
watch(selectedDate, () => {
  loadShiftReports();
  loadHourlyReports();
});

onMounted(() => {
  loadShiftReports();
  loadHourlyReports();
});
</script>

<template>
  <div class="report-wrapper">
    <div class="report-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <div>
            <h1 class="page-title">Daily Report</h1>
            <p class="page-subtitle">LVMDP {{ panelId }}</p>
          </div>
          <div class="date-picker-group">
            <label class="date-label">Select Date:</label>
            <input
              v-model="selectedDate"
              type="date"
              :min="minDate"
              :max="maxDate"
              class="date-input"
            />
            <span class="date-display">{{ formatDate(selectedDate) }}</span>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs-header">
        <button
          v-for="tab in ['shift', 'hourly']"
          :key="tab"
          :class="['tab-button', { active: activeTab === tab }]"
          @click="activeTab = tab as any"
        >
          <span v-if="tab === 'shift'" class="tab-icon">📊</span>
          <span v-else class="tab-icon">⏰</span>
          {{ tab === "shift" ? "Shift Reports" : "Hourly Reports" }}
        </button>
      </div>

      <!-- Content -->
      <div class="content-section">
        <!-- Shift Reports Tab -->
        <div v-if="activeTab === 'shift'" class="tab-content">
          <div v-if="loadingShift" class="loading">Loading shift data...</div>
          <div v-else-if="errorShift" class="error">{{ errorShift }}</div>
          <div v-else class="shift-table-wrapper">
            <table class="shift-table">
              <thead>
                <tr>
                  <th>Shift</th>
                  <th>Total kWh</th>
                  <th>Avg kWh</th>
                  <th>Avg Current (A)</th>
                  <th>Power Factor</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, idx) in shiftReports"
                  :key="idx"
                  class="shift-row"
                >
                  <td class="shift-name">SHIFT {{ row.shift }}</td>
                  <td class="numeric">{{ formatNumber(row.totalKwh) }}</td>
                  <td class="numeric">{{ formatNumber(row.avgKwh) }}</td>
                  <td class="numeric">{{ formatNumber(row.iavg) }}</td>
                  <td class="numeric">{{ formatNumber(row.cosPhi) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Hourly Reports Tab -->
        <div v-if="activeTab === 'hourly'" class="tab-content">
          <div v-if="loadingHourly" class="loading">Loading hourly data...</div>
          <div v-else-if="errorHourly" class="error">{{ errorHourly }}</div>
          <div v-else class="hourly-table-wrapper">
            <div v-if="hourlyReports.length === 0" class="empty-state">
              <p>No hourly data available for this date</p>
            </div>
            <table v-else class="hourly-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Total kWh</th>
                  <th>Avg kWh</th>
                  <th>Power Factor</th>
                  <th>Avg Current (A)</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, idx) in hourlyReports"
                  :key="idx"
                  class="hourly-row"
                >
                  <td class="time">{{ formatTime(row.hour) }}</td>
                  <td class="numeric">{{ formatNumber(row.totalKwh) }}</td>
                  <td class="numeric">{{ formatNumber(row.avgKwh) }}</td>
                  <td class="numeric">{{ formatNumber(row.cosPhi) }}</td>
                  <td class="numeric">{{ formatNumber(row.avgCurrent) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Cache Info -->
      <div class="cache-info">
        <p class="cache-text">
          <span class="cache-icon">💾</span>
          Data is automatically loaded
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-wrapper {
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 24px 16px;
}

.report-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  padding: 32px 24px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

.date-picker-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.date-label {
  font-weight: 600;
  font-size: 0.95rem;
}

.date-input {
  padding: 10px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: brightness(0) invert(1);
  cursor: pointer;
}

.date-input:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.date-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  border-color: white;
}

.date-display {
  font-size: 0.9rem;
  opacity: 0.85;
  font-weight: 500;
}

/* Tabs */
.tabs-header {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  background: #f8fafc;
}

.tab-button {
  flex: 1;
  padding: 16px 24px;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
}

.tab-button:hover {
  color: #0ea5e9;
  background: rgba(14, 165, 233, 0.05);
}

.tab-button.active {
  color: #0ea5e9;
}

.tab-button.active::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, #0ea5e9, #06b6d4);
}

.tab-icon {
  font-size: 1.2rem;
}

/* Content Section */
.content-section {
  padding: 32px 24px;
  min-height: 400px;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading & Error States */
.loading,
.error {
  text-align: center;
  padding: 40px 24px;
  font-size: 1rem;
  color: #64748b;
}

.error {
  color: #dc2626;
  background: #fee2e2;
  border-radius: 12px;
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 24px;
  color: #94a3b8;
  font-size: 1.05rem;
}

/* Tables */
.shift-table-wrapper,
.hourly-table-wrapper {
  overflow-x: auto;
}

.shift-table,
.hourly-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.shift-table thead,
.hourly-table thead {
  background: linear-gradient(to right, #f0f9ff, #ecf0f1);
  border-bottom: 2px solid #e2e8f0;
}

.shift-table th,
.hourly-table th {
  padding: 16px;
  text-align: center;
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.shift-row,
.hourly-row {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.shift-row:hover,
.hourly-row:hover {
  background: #f8fafc;
  transform: scale(1.01);
}

.shift-table td,
.hourly-table td {
  padding: 14px 16px;
  color: #1e293b;
  font-size: 0.95rem;
  text-align: center;
}

.numeric {
  text-align: center;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: #0ea5e9;
}

.shift-name,
.time {
  font-weight: 600;
  color: #1e293b;
}

/* Cache Info */
.cache-info {
  padding: 12px 24px;
  background: #eff6ff;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.cache-text {
  margin: 0;
  font-size: 0.85rem;
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.cache-icon {
  font-size: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .report-wrapper {
    padding: 12px;
  }

  .header-section {
    padding: 20px 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .date-picker-group {
    width: 100%;
  }

  .date-input {
    flex: 1;
    min-width: 180px;
  }

  .content-section {
    padding: 20px 16px;
  }

  .shift-table,
  .hourly-table {
    font-size: 0.85rem;
  }

  .shift-table th,
  .hourly-table th {
    padding: 12px 8px;
    font-size: 0.8rem;
  }

  .shift-table td,
  .hourly-table td {
    padding: 10px 8px;
  }

  .tabs-header {
    overflow-x: auto;
  }

  .tab-button {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
  }

  .date-display {
    display: none;
  }

  .numeric {
    font-size: 0.85rem;
  }
}
</style>
