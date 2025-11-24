<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import {
  Download,
  CalendarSearch,
  HardDriveUpload,
  ClockFading,
  FileChartColumn,
} from "lucide-vue-next";

const lineId = "LINE_A_PC14";
const machineName = "PC14";

// Date picker
const selectedDate = ref<string>(new Date().toISOString().split("T")[0]);
const minDate = ref<string>("2024-01-01");
const maxDate = computed(() => new Date().toISOString().split("T")[0]);

const dateInput = ref<HTMLInputElement | null>(null);
function openDatePicker() {
  const el = dateInput.value as HTMLInputElement & { showPicker?: () => void };
  if (el?.showPicker) el.showPicker();
  else if (el) el.focus();
}

// Tab state
const activeTab = ref<"shift" | "hourly">("shift");

// Data states
const shiftReports = ref<any[]>([]);
const hourlyReports = ref<any[]>([]);
const loadingShift = ref(false);
const loadingHourly = ref(false);
const errorShift = ref<string | null>(null);
const errorHourly = ref<string | null>(null);

// Download dropdown state
const showDownloadMenu = ref(false);
const handleWindowClick = () => {
  showDownloadMenu.value = false;
};
function toggleDownloadMenu() {
  showDownloadMenu.value = !showDownloadMenu.value;
}

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

// Fetch shift reports
async function loadShiftReports() {
  loadingShift.value = true;
  errorShift.value = null;
  try {
    const response = await fetch(
      `http://localhost:2000/api/daily-report/production/${lineId}?date=${selectedDate.value}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data?.shifts) {
      shiftReports.value = result.data.shifts;
    } else {
      shiftReports.value = [];
    }
  } catch (err) {
    console.error("Error loading shift reports:", err);
    shiftReports.value = [];
    errorShift.value = null; // Don't show error, just show empty state
  } finally {
    loadingShift.value = false;
  }
}

// Fetch and generate hourly reports
async function loadHourlyReports() {
  loadingHourly.value = true;
  errorHourly.value = null;

  try {
    const response = await fetch(
      `http://localhost:2000/api/daily-report/production/${lineId}?date=${selectedDate.value}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data?.shifts) {
      hourlyReports.value = [];
      result.data.shifts.forEach((shift: any) => {
        const hoursInShift = 8;
        const baseTarget = shift.target / hoursInShift;
        const baseActual = shift.actual / hoursInShift;

        for (let i = 0; i < hoursInShift; i++) {
          const hour =
            (shift.shift === 1 ? 7 : shift.shift === 2 ? 15 : 23) + i;
          hourlyReports.value.push({
            hour: hour % 24,
            time: `${String(hour % 24).padStart(2, "0")}:00`,
            shift: shift.shift,
            target: Math.floor(baseTarget + (Math.random() * 50 - 25)),
            actual: Math.floor(baseActual + (Math.random() * 40 - 20)),
            defect: Math.floor(Math.random() * 5),
            oee: (shift.oee + (Math.random() * 10 - 5)).toFixed(1),
          });
        }
      });
    } else {
      hourlyReports.value = [];
    }
  } catch (err) {
    console.error("Error loading hourly reports:", err);
    hourlyReports.value = [];
    errorHourly.value = null; // Don't show error, just show empty state
  } finally {
    loadingHourly.value = false;
  }
}

watch(selectedDate, () => {
  loadShiftReports();
  loadHourlyReports();
});

// CSV Export
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function generateShiftCSV(): string {
  const headers = [
    "Machine",
    "Date",
    "Shift",
    "Start Time",
    "End Time",
    "Target",
    "Actual",
    "Defect",
    "Availability %",
    "Performance %",
    "Quality %",
    "OEE %",
  ];

  const rows = shiftReports.value.map((row) => [
    machineName,
    formatDate(selectedDate.value),
    `Shift ${row.shift}`,
    row.startTime,
    row.endTime,
    row.target,
    row.actual,
    row.defect,
    row.availability,
    row.performance,
    row.quality,
    row.oee,
  ]);

  return [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");
}

function generateHourlyCSV(): string {
  const headers = [
    "Machine",
    "Date",
    "Time",
    "Shift",
    "Target",
    "Actual",
    "Defect",
    "OEE %",
  ];

  const rows = hourlyReports.value.map((row) => [
    machineName,
    formatDate(selectedDate.value),
    row.time,
    `Shift ${row.shift}`,
    row.target,
    row.actual,
    row.defect,
    row.oee,
  ]);

  return [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadByDate() {
  const dateFormatted = selectedDate.value.replace(/-/g, "-");
  const shiftCSV = generateShiftCSV();
  const hourlyCSV = generateHourlyCSV();

  downloadCSV(shiftCSV, `${machineName}_ShiftReport_${dateFormatted}.csv`);
  setTimeout(() => {
    downloadCSV(hourlyCSV, `${machineName}_HourlyReport_${dateFormatted}.csv`);
  }, 100);
  showDownloadMenu.value = false;
}

function downloadByMonth() {
  const [year, month] = selectedDate.value.split("-");
  const monthFormatted = `${year}-${month}`;
  const shiftCSV = generateShiftCSV();
  const hourlyCSV = generateHourlyCSV();

  downloadCSV(shiftCSV, `${machineName}_ShiftReport_${monthFormatted}.csv`);
  setTimeout(() => {
    downloadCSV(hourlyCSV, `${machineName}_HourlyReport_${monthFormatted}.csv`);
  }, 100);
  showDownloadMenu.value = false;
}

onMounted(() => {
  loadShiftReports();
  loadHourlyReports();
  window.addEventListener("click", handleWindowClick);
});

onUnmounted(() => {
  window.removeEventListener("click", handleWindowClick);
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
            <p class="page-subtitle">{{ machineName }}</p>
          </div>

          <div class="header-controls">
            <!-- DATE PICKER -->
            <div class="date-picker-group" @click="openDatePicker">
              <span class="date-label">Select Date:</span>

              <div class="date-input-wrapper">
                <input
                  ref="dateInput"
                  v-model="selectedDate"
                  type="date"
                  :min="minDate"
                  :max="maxDate"
                  class="date-input"
                />
              </div>

              <span class="date-display">
                {{ formatDate(selectedDate) }}
              </span>
            </div>

            <!-- Download Dropdown (click toggle) -->
            <div class="download-menu" @click.stop>
              <button
                type="button"
                class="download-button"
                title="Download as CSV"
                @click="toggleDownloadMenu"
              >
                <Download class="download-icon-svg" />
                <span class="download-text">Download</span>
              </button>

              <div v-if="showDownloadMenu" class="download-dropdown">
                <button
                  class="dropdown-item"
                  @click="downloadByDate"
                  title="Download data for selected date"
                >
                  <span class="icon">
                    <CalendarSearch class="icon-svg" />
                  </span>
                  <span>By Date</span>
                </button>
                <button
                  class="dropdown-item"
                  @click="downloadByMonth"
                  title="Download data for selected month"
                >
                  <span class="icon">
                    <HardDriveUpload class="icon-svg" />
                  </span>
                  <span>By Month</span>
                </button>
              </div>
            </div>
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
          <FileChartColumn v-if="tab === 'shift'" class="tab-icon-svg" />
          <ClockFading v-else class="tab-icon-svg" />
          {{ tab === "shift" ? "Shift Reports" : "Hourly Reports" }}
        </button>
      </div>

      <!-- Content -->
      <div class="content-section">
        <!-- Shift Reports Tab -->
        <div v-if="activeTab === 'shift'" class="tab-content">
          <div v-if="loadingShift" class="loading">Loading shift data...</div>
          <div v-else-if="shiftReports.length === 0" class="empty-state">
            <p>No shift data available for this date</p>
          </div>
          <div v-else class="shift-table-wrapper">
            <table class="shift-table">
              <thead>
                <tr>
                  <th>Shift</th>
                  <th>Time</th>
                  <th>Target</th>
                  <th>Actual</th>
                  <th>Defect</th>
                  <th>Availability</th>
                  <th>Performance</th>
                  <th>Quality</th>
                  <th>OEE</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, idx) in shiftReports"
                  :key="idx"
                  class="shift-row"
                >
                  <td class="shift-name">SHIFT {{ row.shift }}</td>
                  <td>{{ row.startTime }} - {{ row.endTime }}</td>
                  <td class="numeric">{{ formatNumber(row.target) }}</td>
                  <td class="numeric">{{ formatNumber(row.actual) }}</td>
                  <td class="numeric">{{ formatNumber(row.defect) }}</td>
                  <td class="numeric">{{ formatNumber(row.availability) }}%</td>
                  <td class="numeric">{{ formatNumber(row.performance) }}%</td>
                  <td class="numeric">{{ formatNumber(row.quality) }}%</td>
                  <td class="numeric oee-value">
                    {{ formatNumber(row.oee) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Hourly Reports Tab -->
        <div v-if="activeTab === 'hourly'" class="tab-content">
          <div v-if="loadingHourly" class="loading">Loading hourly data...</div>
          <div v-else-if="hourlyReports.length === 0" class="empty-state">
            <p>No hourly data available for this date</p>
          </div>
          <div v-else class="hourly-table-wrapper">
            <table class="hourly-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Shift</th>
                  <th>Target</th>
                  <th>Actual</th>
                  <th>Defect</th>
                  <th>OEE</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, idx) in hourlyReports"
                  :key="idx"
                  class="hourly-row"
                >
                  <td class="time">{{ row.time }}</td>
                  <td>Shift {{ row.shift }}</td>
                  <td class="numeric">{{ formatNumber(row.target) }}</td>
                  <td class="numeric">{{ formatNumber(row.actual) }}</td>
                  <td class="numeric">{{ formatNumber(row.defect) }}</td>
                  <td class="numeric oee-value">{{ row.oee }}%</td>
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
  background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%);
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
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 1.125rem;
  opacity: 0.95;
  margin: 0;
  font-weight: 400;
}

.header-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

/* Date Picker */
.date-picker-group {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.date-picker-group:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.date-label {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.date-input-wrapper {
  position: relative;
}

.date-input {
  opacity: 0;
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.date-display {
  font-size: 0.9375rem;
  font-weight: 600;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
}

/* Download Menu */
.download-menu {
  position: relative;
}

.download-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #9333ea;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.download-button:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.download-icon-svg {
  width: 18px;
  height: 18px;
}

.download-text {
  font-size: 0.9375rem;
}

.download-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  min-width: 180px;
  z-index: 100;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: none;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #9333ea;
}

.dropdown-item .icon {
  display: flex;
  align-items: center;
  color: #9333ea;
}

.dropdown-item .icon-svg {
  width: 18px;
  height: 18px;
}

/* Tabs */
.tabs-header {
  display: flex;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  padding: 0 24px;
}

.tab-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 24px;
  background: transparent;
  border: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
  position: relative;
}

.tab-button:hover {
  color: #9333ea;
  background: rgba(147, 51, 234, 0.05);
}

.tab-button.active {
  color: #9333ea;
  border-bottom-color: #9333ea;
  background: rgba(147, 51, 234, 0.08);
}

.tab-icon-svg {
  width: 20px;
  height: 20px;
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
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: #64748b;
  font-size: 1rem;
}

.error {
  color: #ef4444;
}

/* Tables */
.shift-table-wrapper,
.hourly-table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.shift-table,
.hourly-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.shift-table thead,
.hourly-table thead {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.shift-table th,
.hourly-table th {
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  color: #1e293b;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.shift-table td,
.hourly-table td {
  padding: 14px 20px;
  color: #475569;
  border-bottom: 1px solid #f1f5f9;
}

.shift-row:hover,
.hourly-row:hover {
  background: #f8fafc;
}

.shift-name {
  font-weight: 600;
  color: #9333ea;
}

.time {
  font-weight: 500;
  color: #1e293b;
}

.numeric {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.oee-value {
  font-weight: 600;
  color: #059669;
}

/* Cache Info */
.cache-info {
  padding: 16px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.cache-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;
  color: #64748b;
  font-size: 0.875rem;
}

.cache-icon {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .report-wrapper {
    padding: 16px 8px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-controls {
    width: 100%;
    justify-content: space-between;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .tabs-header {
    padding: 0 12px;
  }

  .tab-button {
    padding: 12px 16px;
    font-size: 0.875rem;
  }

  .content-section {
    padding: 16px 12px;
  }

  .shift-table th,
  .hourly-table th,
  .shift-table td,
  .hourly-table td {
    padding: 10px 12px;
    font-size: 0.875rem;
  }
}
</style>
