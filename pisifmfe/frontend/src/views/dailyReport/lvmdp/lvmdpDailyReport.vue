<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { getDailyReportAll, getDailyHourly } from "@/lib/api";
import {
  Download,
  CalendarSearch,
  HardDriveUpload,
  ClockFading,
  FileChartColumn,
} from "lucide-vue-next";

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

// Debounce timer for date changes
let dateChangeTimer: ReturnType<typeof setTimeout> | null = null;

// Request tracking to prevent race conditions
let currentShiftRequest = 0;
let currentHourlyRequest = 0;

// Download dropdown state
const showDownloadMenu = ref(false);
const handleWindowClick = () => {
  showDownloadMenu.value = false;
};
function toggleDownloadMenu() {
  showDownloadMenu.value = !showDownloadMenu.value;
}

// Local storage cache with TTL
// v11: Add cache expiration to prevent stale data
const cacheKey = (date: string) => `lvmdp_${panelId}_hourly_v11_${date}`;
const CACHE_TTL = 30000; // 30 seconds cache TTL

// Helper to check if cache is still valid
function isCacheValid(cachedData: any): boolean {
  if (!cachedData || !cachedData.timestamp) return false;
  const now = Date.now();
  return now - cachedData.timestamp < CACHE_TTL;
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

// Cache for shift reports to avoid repeated API calls
const shiftReportsCache = new Map<string, any[]>();

// Fetch all daily reports for shift summaries
async function loadShiftReports() {
  loadingShift.value = true;
  errorShift.value = null;

  // Increment request counter to track this specific request
  const requestId = ++currentShiftRequest;
  const targetDate = selectedDate.value;

  try {
    // Check cache first
    const cacheKey = `shift_${panelId}_${targetDate}`;
    if (shiftReportsCache.has(cacheKey)) {
      // Still check if this is the latest request
      if (requestId !== currentShiftRequest) return;
      shiftReports.value = shiftReportsCache.get(cacheKey)!;
      loadingShift.value = false;
      return;
    }

    const data = await getDailyReportAll(panelId);

    // Check if this request is still valid (user hasn't changed date)
    if (
      requestId !== currentShiftRequest ||
      targetDate !== selectedDate.value
    ) {
      return; // Discard stale response
    }
    if (Array.isArray(data)) {
      // Use find instead of filter for single result
      const report = data.find((row) => {
        const rowDate = row.date || row.reportDate;
        return rowDate === targetDate;
      });

      if (report) {
        const result = [
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

        // Final check before updating - prevent race condition
        if (
          requestId !== currentShiftRequest ||
          targetDate !== selectedDate.value
        ) {
          return;
        }

        shiftReports.value = result;
        shiftReportsCache.set(cacheKey, result);
      } else {
        const emptyResult = [
          { shift: 1, totalKwh: 0, avgKwh: 0, iavg: 0, cosPhi: 0 },
          { shift: 2, totalKwh: 0, avgKwh: 0, iavg: 0, cosPhi: 0 },
          { shift: 3, totalKwh: 0, avgKwh: 0, iavg: 0, cosPhi: 0 },
        ];

        // Final check before updating
        if (
          requestId !== currentShiftRequest ||
          targetDate !== selectedDate.value
        ) {
          return;
        }

        shiftReports.value = emptyResult;
        shiftReportsCache.set(cacheKey, emptyResult);
      }
    }
  } catch (err) {
    // Only set error if this is still the current request
    if (
      requestId === currentShiftRequest &&
      targetDate === selectedDate.value
    ) {
      errorShift.value = String(err);
    }
  } finally {
    // Only clear loading if this is still the current request
    if (
      requestId === currentShiftRequest &&
      targetDate === selectedDate.value
    ) {
      loadingShift.value = false;
    }
  }
}

// Fetch and cache hourly reports
async function loadHourlyReports() {
  loadingHourly.value = true;
  errorHourly.value = null;

  // Increment request counter to track this specific request
  const requestId = ++currentHourlyRequest;
  const targetDate = selectedDate.value;

  try {
    // Check cache with TTL validation
    const cached = localStorage.getItem(cacheKey(targetDate));
    if (cached) {
      try {
        const parsedCache = JSON.parse(cached);
        if (isCacheValid(parsedCache)) {
          // Still check if this is the latest request
          if (requestId !== currentHourlyRequest) return;
          hourlyReports.value = parsedCache.data;
          loadingHourly.value = false;
          return;
        } else {
          // Cache expired, remove it
          localStorage.removeItem(cacheKey(targetDate));
        }
      } catch (e) {
        // Invalid cache format, remove it
        localStorage.removeItem(cacheKey(targetDate));
      }
    }

    const data = await getDailyHourly(panelId, targetDate);

    // Check if this request is still valid (user hasn't changed date)
    if (
      requestId !== currentHourlyRequest ||
      targetDate !== selectedDate.value
    ) {
      return; // Discard stale response
    }
    if (Array.isArray(data)) {
      const normalized = data.map((row: any) => ({
        hour: row.hour,
        totalKwh: row.totalKwh ?? row.avg_total_kwh ?? row.total_kwh ?? 0,
        avgKwh: row.avgKwh ?? row.avg_kwh ?? 0,
        cosPhi: row.cosPhi ?? row.avg_cos_phi ?? row.cos_phi ?? 0,
        avgCurrent:
          row.avgCurrent ?? row.avg_avg_current ?? row.avg_current ?? 0,
      }));

      // Final check before updating - prevent race condition
      if (
        requestId !== currentHourlyRequest ||
        targetDate !== selectedDate.value
      ) {
        return;
      }

      hourlyReports.value = normalized;

      // Store in cache with timestamp
      const cacheData = {
        data: normalized,
        timestamp: Date.now(),
      };
      localStorage.setItem(cacheKey(targetDate), JSON.stringify(cacheData));
    }
  } catch (err) {
    // Only set error if this is still the current request
    if (
      requestId === currentHourlyRequest &&
      targetDate === selectedDate.value
    ) {
      errorHourly.value = String(err);
    }
  } finally {
    // Only clear loading if this is still the current request
    if (
      requestId === currentHourlyRequest &&
      targetDate === selectedDate.value
    ) {
      loadingHourly.value = false;
    }
  }
}

// Debounced data loading to prevent rapid API calls
watch(selectedDate, () => {
  if (dateChangeTimer) {
    clearTimeout(dateChangeTimer);
  }

  // Immediately clear old data to prevent showing stale data
  shiftReports.value = [];
  hourlyReports.value = [];
  errorShift.value = null;
  errorHourly.value = null;

  dateChangeTimer = setTimeout(() => {
    loadShiftReports();
    if (activeTab.value === "hourly") {
      loadHourlyReports();
    }
  }, 150); // 150ms debounce
});

// Load hourly data only when tab is switched
watch(activeTab, (newTab) => {
  if (newTab === "hourly" && hourlyReports.value.length === 0) {
    loadHourlyReports();
  }
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
    "LVMDP",
    "Tanggal",
    "Shift",
    "Total kWh",
    "Avg Real Power (kW)",
    "Avg Current (A)",
    "Power Factor",
  ];

  const rows = shiftReports.value.map((row) => [
    `LVMDP ${panelId}`,
    formatDate(selectedDate.value),
    `Shift ${row.shift}`,
    row.totalKwh,
    row.avgKwh,
    row.iavg,
    row.cosPhi,
  ]);

  return [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ].join("\n");
}

function generateHourlyCSV(): string {
  const headers = [
    "LVMDP",
    "Tanggal",
    "Waktu",
    "Total kWh",
    "Avg Real Power (kW)",
    "Power Factor",
    "Avg Current (A)",
  ];

  const rows = hourlyReports.value.map((row) => [
    `LVMDP ${panelId}`,
    formatDate(selectedDate.value),
    formatTime(row.hour),
    row.totalKwh,
    row.avgKwh,
    row.cosPhi,
    row.avgCurrent,
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

  downloadCSV(shiftCSV, `LVMDP${panelId}_ShiftReport_${dateFormatted}.csv`);
  setTimeout(() => {
    downloadCSV(hourlyCSV, `LVMDP${panelId}_HourlyReport_${dateFormatted}.csv`);
  }, 100);
  showDownloadMenu.value = false;
}

async function downloadByMonth() {
  const [year, month] = selectedDate.value.split("-");
  const monthFormatted = `${year}-${month}`;

  try {
    // Fetch all data for the panel
    const allData = await getDailyReportAll(panelId);

    if (!Array.isArray(allData)) {
      console.error("No data available for month export");
      return;
    }

    // Filter data for the selected month
    const monthData = allData.filter((row) => {
      const rowDate = row.date || row.reportDate;
      if (!rowDate) return false;
      return rowDate.startsWith(monthFormatted);
    });

    if (monthData.length === 0) {
      console.warn("No data found for selected month");
      return;
    }

    // Generate shift CSV for entire month
    const shiftHeaders = [
      "LVMDP",
      "Tanggal",
      "Shift",
      "Total kWh",
      "Avg kWh",
      "Avg Current (A)",
      "Power Factor",
    ];

    const shiftRows: any[] = [];
    monthData.forEach((dayReport) => {
      const reportDate = dayReport.date || dayReport.reportDate;
      for (let shiftNum = 1; shiftNum <= 3; shiftNum++) {
        shiftRows.push([
          `LVMDP ${panelId}`,
          reportDate,
          `Shift ${shiftNum}`,
          dayReport[`shift${shiftNum}TotalKwh`] || 0,
          dayReport[`shift${shiftNum}AvgKwh`] || 0,
          dayReport[`shift${shiftNum}AvgCurrent`] || 0,
          dayReport[`shift${shiftNum}CosPhi`] || 0,
        ]);
      }
    });

    const shiftCSV = [
      shiftHeaders.map(escapeCSV).join(","),
      ...shiftRows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    downloadCSV(shiftCSV, `LVMDP${panelId}_ShiftReport_${monthFormatted}.csv`);

    // Fetch hourly data for each day in the month
    const hourlyHeaders = [
      "LVMDP",
      "Tanggal",
      "Waktu",
      "Total kWh",
      "Avg Real Power (kW)",
      "Power Factor",
      "Avg Current (A)",
    ];

    const hourlyRows: any[] = [];
    for (const dayReport of monthData) {
      const reportDate = dayReport.date || dayReport.reportDate;
      try {
        const hourlyData = await getDailyHourly(panelId, reportDate);
        if (Array.isArray(hourlyData)) {
          hourlyData.forEach((hourRow: any) => {
            hourlyRows.push([
              `LVMDP ${panelId}`,
              reportDate,
              formatTime(hourRow.hour),
              hourRow.totalKwh ?? hourRow.avg_total_kwh ?? 0,
              hourRow.avgKwh ?? hourRow.avg_kwh ?? 0,
              hourRow.cosPhi ?? hourRow.avg_cos_phi ?? 0,
              hourRow.avgCurrent ?? hourRow.avg_avg_current ?? 0,
            ]);
          });
        }
      } catch (err) {
        console.warn(`Failed to fetch hourly data for ${reportDate}:`, err);
      }
    }

    const hourlyCSV = [
      hourlyHeaders.map(escapeCSV).join(","),
      ...hourlyRows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    setTimeout(() => {
      downloadCSV(
        hourlyCSV,
        `LVMDP${panelId}_HourlyReport_${monthFormatted}.csv`
      );
    }, 100);
  } catch (err) {
    console.error("Error downloading month data:", err);
  } finally {
    showDownloadMenu.value = false;
  }
}

onMounted(() => {
  loadShiftReports();
  // Only load hourly if tab is active (lazy loading)
  if (activeTab.value === "hourly") {
    loadHourlyReports();
  }
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
            <p class="page-subtitle">LVMDP {{ panelId }}</p>
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
          <div v-else-if="errorShift" class="error">{{ errorShift }}</div>
          <div v-else class="shift-table-wrapper">
            <table class="shift-table">
              <thead>
                <tr>
                  <th>Shift</th>
                  <th>Total kWh</th>
                  <th>Avg Real Power (kW)</th>
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
                  <th>Avg Real Power (kW)</th>
                  <th>Avg Current (A)</th>
                  <th>Power Factor</th>
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
                  <td class="numeric">{{ formatNumber(row.avgCurrent) }}</td>
                  <td class="numeric">{{ formatNumber(row.cosPhi) }}</td>
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

/* Header Controls */
.header-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

/* Date picker group */
.date-picker-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  cursor: pointer;
}

.date-label {
  font-weight: 600;
  font-size: 0.95rem;
}

/* Hanya kotak tanggal yang dibungkus */
.date-input-wrapper {
  padding: 2px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.3);
  border: 1px solid rgba(148, 163, 184, 0.7);
  transition: all 0.2s ease;
}

.date-picker-group:hover .date-input-wrapper {
  background: rgba(15, 23, 42, 0.5);
  border-color: rgba(248, 250, 252, 0.9);
}

.date-input {
  border: none;
  background: transparent;
  color: #f9fafb;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.date-input::-webkit-calendar-picker-indicator {
  filter: brightness(0) invert(1);
  cursor: pointer;
}

.date-input:focus {
  outline: none;
}

.date-display {
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
}

/* Download Menu */
.download-menu {
  position: relative;
  display: flex;
  align-items: center;
}

.download-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.download-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.download-icon-svg {
  width: 18px;
  height: 18px;
}

.download-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  margin-top: 8px;
  min-width: 190px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: none;
  border: none;
  color: #1e293b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.95rem;
}

.dropdown-item:hover {
  background: #f1f5f9;
  color: #0ea5e9;
}

.dropdown-item:first-child {
  border-bottom: 1px solid #e2e8f0;
}

.dropdown-item .icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-svg {
  width: 18px;
  height: 18px;
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

  .header-controls {
    width: 100%;
    justify-content: space-between;
  }

  .date-picker-group {
    flex: 1;
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
