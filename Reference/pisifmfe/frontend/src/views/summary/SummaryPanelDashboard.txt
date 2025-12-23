<template>
  <div class="summary-dashboard">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h1 class="page-title">Electrical Dashboard</h1>
            <p class="page-subtitle">Real-time electrical monitoring system</p>
          </div>
          <button
            class="help-icon-btn"
            @click="showHelpModal = true"
            title="Help & Information"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span class="help-text">Help</span>
          </button>
        </div>
        <div class="header-right">
          <div class="live-badge">
            <span class="pulse-dot" :class="{ active: !loading }"></span>
            <span>{{ loading ? "Connecting" : "Live" }}</span>
          </div>
          <div class="last-update">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{{ formattedLastUpdate }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Connection Warning Banner -->
    <transition name="slide-down">
      <div v-if="showConnectionWarning" class="connection-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
          />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>Data connection issue detected. Values may not be current.</span>
        <button @click="dismissWarning" class="dismiss-btn">×</button>
      </div>
    </transition>

    <!-- Loading State -->
    <div v-if="loading && !error" class="loading-state">
      <div class="spinner"></div>
      <p>Loading electrical data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <svg
        class="error-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h3>Connection Failed</h3>
      <p>{{ error }}</p>
      <button @click="fetchData" class="retry-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        Retry
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="dashboard-content">
      <!-- Report Download Section -->
      <div class="report-controls">
        <div class="report-header">
          <h3>Download Report</h3>
          <div class="report-selector">
            <div class="selector-group">
              <label>Report Type:</label>
              <select v-model="reportType" class="report-type-select">
                <option value="day">By Date</option>
                <option value="month">By Month</option>
              </select>
            </div>

            <div v-if="reportType === 'month'" class="selector-group">
              <label>Date Type:</label>
              <select v-model="dateType" class="report-type-select">
                <option value="nasional">By Nasional</option>
                <option value="indofood">By Indofood</option>
              </select>
            </div>

            <div v-if="reportType === 'day'" class="selector-group">
              <label>Select Date:</label>
              <input
                type="date"
                v-model="selectedDate"
                class="date-picker"
                :max="getTodayDate()"
              />
            </div>

            <div v-else class="selector-group">
              <label>Select Month:</label>
              <input
                type="month"
                v-model="selectedMonth"
                class="month-picker"
                :max="getCurrentMonth()"
              />
              <div
                v-if="reportType === 'month' && selectedMonth"
                class="date-range-info"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {{ displayDateRange }}
              </div>
            </div>

            <button @click="downloadSelectedReport" class="download-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </div>

      <!-- Load Progress Bar -->
      <div class="load-bar-card">
        <div class="load-bar-header">
          <h3>Current Load Distribution</h3>
          <div class="load-stats">
            <div class="stat-minmax">
              <span class="stat-label">Min:</span>
              <span class="stat-value">{{ minLoad }} kVA</span>
            </div>
            <div class="load-percentage" :class="getLoadColorClass">
              {{ summaryData.loadPercentage }}%
            </div>
            <div class="stat-minmax">
              <span class="stat-label">Max:</span>
              <span class="stat-value">{{ maxLoad }} kVA</span>
            </div>
          </div>
        </div>
        <div class="load-bar-container">
          <div class="load-bar-bg">
            <div
              class="load-bar-fill"
              :class="getLoadColorClass"
              :style="{ width: summaryData.loadPercentage + '%' }"
            >
              <div class="load-bar-shimmer"></div>
            </div>
          </div>
          <div class="load-bar-labels">
            <span>0 kVA</span>
            <span class="load-current">{{ summaryData.totalKVA }} kVA</span>
            <span>{{ summaryData.installedCapacity }} kVA</span>
          </div>
        </div>
        <div class="load-bar-info">
          <div class="info-item">
            <span class="info-dot green"></span>
            <span>Normal (0-70%)</span>
          </div>
          <div class="info-item">
            <span class="info-dot amber"></span>
            <span>Warning (70-85%)</span>
          </div>
          <div class="info-item">
            <span class="info-dot red"></span>
            <span>Critical (>85%)</span>
          </div>
        </div>
      </div>

      <!-- Panel Cards Grid -->
      <div class="panels-grid">
        <div
          v-for="panel in summaryData.panels"
          :key="panel.id"
          class="panel-card"
          :class="{ offline: panel.status === 'offline' }"
          @click="navigateToPanel(panel.id)"
        >
          <div class="panel-card-header">
            <div class="panel-title-row">
              <h3 class="panel-title">{{ panel.name }}</h3>
              <span class="panel-status-badge" :class="panel.status">
                <span class="status-dot"></span>
                {{ panel.status === "online" ? "Online" : "Offline" }}
              </span>
            </div>
            <div class="panel-kva-display">
              <span class="kva-number">{{ formatNumber(panel.kva) }}</span>
              <span class="kva-text">kVA</span>
              <span class="kva-percent"
                >({{ ((panel.kva / 5540) * 100).toFixed(1) }}% of 5540
                kVA)</span
              >
            </div>
          </div>

          <div class="panel-card-body">
            <div class="metric-grid">
              <div class="metric-item">
                <div class="metric-icon-sm power">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div class="metric-data">
                  <span class="metric-label">Real Power</span>
                  <span class="metric-value"
                    >{{ formatNumber(panel.realPower) }}
                    <span class="unit">kW</span></span
                  >
                </div>
              </div>

              <div class="metric-item">
                <div class="metric-icon-sm voltage">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                </div>
                <div class="metric-data">
                  <span class="metric-label">Voltage</span>
                  <span class="metric-value"
                    >{{ formatNumber(panel.voltage) }}
                    <span class="unit">V</span></span
                  >
                </div>
              </div>

              <div class="metric-item">
                <div class="metric-icon-sm current">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div class="metric-data">
                  <span class="metric-label">Current</span>
                  <span class="metric-value"
                    >{{ formatNumber(panel.current) }}
                    <span class="unit">A</span>
                    <span class="metric-percent"
                      >({{ ((panel.current / 2500) * 100).toFixed(1) }}% of 2500
                      A)</span
                    >
                  </span>
                </div>
              </div>

              <div class="metric-item">
                <div class="metric-icon-sm pf">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div class="metric-data">
                  <span class="metric-label">Power Factor</span>
                  <span class="metric-value">{{
                    formatNumber(panel.cosPhi)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="panel-card-footer">
            <span class="view-details">View Details</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <HelpModal
      :isOpen="showHelpModal"
      @close="showHelpModal = false"
      title="LVMDP Information"
    >
      <div class="help-content">
        <div class="help-section">
          <h3>LVMDP 1 - Main Production Area</h3>
          <p>
            Low Voltage Main Distribution Panel 1 supplies electrical power to
            the main production hall, including packaging lines, conveyors, and
            quality control stations. This panel handles the primary
            manufacturing operations with a rated capacity of 2500A at 400V.
          </p>
        </div>

        <div class="help-section">
          <h3>LVMDP 2 - Processing & Storage</h3>
          <p>
            LVMDP 2 distributes power to the food processing units, cold storage
            facilities, and material handling equipment. It ensures consistent
            power supply to temperature-critical operations and automated
            storage systems.
          </p>
        </div>

        <div class="help-section">
          <h3>LVMDP 3 - Support Services</h3>
          <p>
            This panel serves the facility's support infrastructure including
            HVAC systems, lighting, office areas, and utility rooms. LVMDP 3
            maintains environmental controls and general facility operations.
          </p>
        </div>

        <div class="help-section">
          <h3>LVMDP 4 - Auxiliary Systems</h3>
          <p>
            LVMDP 4 powers auxiliary equipment such as water treatment, waste
            management systems, and backup facilities. It provides electrical
            distribution for supporting plant operations and emergency systems.
          </p>
        </div>

        <div class="help-section">
          <h3>Key Metrics</h3>
          <ul>
            <li>
              <strong>kVA (Apparent Power):</strong> Total power drawn including
              reactive power
            </li>
            <li>
              <strong>kW (Real Power):</strong> Actual power consumed by
              equipment
            </li>
            <li>
              <strong>Current (A):</strong> Electrical current flow per phase
            </li>
            <li>
              <strong>Power Factor:</strong> Efficiency of power usage (0-1)
            </li>
            <li>
              <strong>Capacity:</strong> Maximum rated capacity is 5540 kVA and
              2500 A per panel
            </li>
          </ul>
        </div>
      </div>
    </HelpModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import HelpModal from "@/components/HelpModal.vue";
import { getIndofoodMonthRange } from "@/utils/indofoodCalendar";
// PROFESSIONAL REPORTING SYSTEM - Import new API client
import { useElectricalReport } from "@/composables/useElectricalReport";
import type { ElectricalReportData } from "@/composables/useElectricalReport";

const router = useRouter();
const {
  fetchDailyReport,
  fetchWeeklyReport,
  fetchMonthlyReport,
  getCurrentMonday,
  getTodayDate,
} = useElectricalReport();

// Report selection state
const reportType = ref<"day" | "month">("day");
const selectedDate = ref(getTodayDate());
const selectedMonth = ref(getCurrentMonth());
const dateType = ref<"nasional" | "indofood">("nasional");

// Helper to get current month in YYYY-MM format
function getCurrentMonth(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function getMonthDateRange(yearMonth: string, type: "nasional" | "indofood") {
  const [year, month] = yearMonth.split("-").map(Number);

  if (type === "nasional") {
    // Calendar month: 1st to last day of month
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    return {
      start: firstDay.toISOString().split("T")[0],
      end: lastDay.toISOString().split("T")[0],
    };
  } else {
    // Indofood: Use actual operational calendar date ranges
    const range = getIndofoodMonthRange(yearMonth);
    if (range) {
      return {
        start: range.start,
        end: range.end,
      };
    }
    // Fallback if calendar data not found
    return {
      start: yearMonth + "-01",
      end: new Date(year, month, 0).toISOString().split("T")[0],
    };
  }
}

/**
 * TODO: Integration Steps for Professional Reporting System
 *
 * Current: Using real-time data from /api/summary/electrical
 * Target: Use historical aggregated data from /api/report/electrical
 *
 * Step 1: Replace fetchData() with:
 *   const { fetchDailyReport, getYesterdayDate } = useElectricalReport();
 *   const report = await fetchDailyReport(getYesterdayDate());
 *
 * Step 2: Map report.summary to summaryData for dashboard display
 * Step 3: Map report.panels to panel cards
 * Step 4: Update PDF download to use report data directly
 *
 * Benefits:
 * - Energy-based metrics (kWh) instead of instantaneous kVA
 * - Peak demand tracking with timestamps
 * - Load factor and utilization calculations
 * - Data quality metrics (completeness %)
 * - Comparison with previous periods
 * - ISO 50001 compliant reporting
 */

interface PanelData {
  id: number;
  name: string;
  realPower: number;
  voltage: number;
  current: number;
  cosPhi: number;
  kva: number;
  status: string;
  waktu: string | null;
}

interface SummaryData {
  totalKVA: number;
  installedCapacity: number;
  loadPercentage: number;
  lastUpdated: string;
  panels: PanelData[];
}

const loading = ref(true);
const error = ref("");
const isInitialLoad = ref(true);
const showHelpModal = ref(false);
const showConnectionWarning = ref(false);
const lastDataUpdateTime = ref<number>(Date.now());
const warningDismissed = ref(false);

const summaryData = ref<SummaryData>({
  totalKVA: 0,
  installedCapacity: 5540,
  loadPercentage: 0,
  lastUpdated: new Date().toISOString(),
  panels: [],
});

// Track min/max load
const loadHistory = ref<number[]>([]);
const minLoad = computed(() => {
  if (loadHistory.value.length === 0)
    return summaryData.value.totalKVA.toFixed(2);
  return Math.min(...loadHistory.value).toFixed(2);
});
const maxLoad = computed(() => {
  if (loadHistory.value.length === 0)
    return summaryData.value.totalKVA.toFixed(2);
  return Math.max(...loadHistory.value).toFixed(2);
});

let refreshInterval: number | null = null;

const formattedLastUpdate = computed(() => {
  if (!summaryData.value.lastUpdated) return "N/A";
  const date = new Date(summaryData.value.lastUpdated);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
  });
});

const getLoadColorClass = computed(() => {
  const percentage = summaryData.value.loadPercentage;
  if (percentage >= 85) return "critical";
  if (percentage >= 70) return "warning";
  return "normal";
});

const fetchData = async () => {
  try {
    // Only show loading spinner on initial load, not on refreshes
    if (isInitialLoad.value) {
      loading.value = true;
    }
    error.value = "";

    const baseURL = window.location.origin.replace(":30", ":2000");
    const response = await axios.get(`${baseURL}/api/summary/electrical`);

    if (response.data.success) {
      summaryData.value = response.data.data;
      // Track load history for min/max
      loadHistory.value.push(summaryData.value.totalKVA);
      // Keep only last 100 readings to avoid memory issues
      if (loadHistory.value.length > 100) {
        loadHistory.value.shift();
      }

      // Update last data time and clear warning if data is fresh
      lastDataUpdateTime.value = Date.now();
      if (!warningDismissed.value) {
        showConnectionWarning.value = false;
      }
    } else {
      error.value = "Failed to fetch data";
    }
  } catch (err: any) {
    console.error("Error fetching summary:", err);
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to connect to server";

    // Show connection warning on error (if not dismissed)
    if (!warningDismissed.value) {
      showConnectionWarning.value = true;
    }
  } finally {
    if (isInitialLoad.value) {
      loading.value = false;
      isInitialLoad.value = false;
    }
  }
};

const dismissWarning = () => {
  showConnectionWarning.value = false;
  warningDismissed.value = true;

  // Reset dismissal after 5 minutes
  setTimeout(() => {
    warningDismissed.value = false;
  }, 5 * 60 * 1000);
};

// Check for stale data frequently
const checkDataFreshness = () => {
  const now = Date.now();
  const timeSinceLastUpdate = now - lastDataUpdateTime.value;

  // If data is older than 10 seconds and not dismissed, show warning
  if (
    timeSinceLastUpdate > 10000 &&
    !warningDismissed.value &&
    !loading.value
  ) {
    showConnectionWarning.value = true;
  }
};

const navigateToPanel = (panelId: number) => {
  router.push(`/app/lvmdp${panelId}`);
};

const formatNumber = (value: number): string => {
  if (!value && value !== 0) return "0.00";
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const displayDateRange = computed(() => {
  if (reportType.value === "month" && selectedMonth.value) {
    const range = getMonthDateRange(selectedMonth.value, dateType.value);
    return `Period: ${formatDateDisplay(range.start)} - ${formatDateDisplay(
      range.end
    )}`;
  }
  return "";
});

function formatDateDisplay(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const downloadSelectedReport = async () => {
  try {
    let reportData: ElectricalReportData | null = null;
    let customDateRange = "";

    if (reportType.value === "day") {
      // Download daily report for selected date
      console.log("[Report] Downloading daily report for:", selectedDate.value);
      reportData = await fetchDailyReport(selectedDate.value);

      // Format single date for daily report
      const date = new Date(selectedDate.value);
      customDateRange = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } else {
      // Download monthly report for selected month
      const [year, month] = selectedMonth.value.split("-").map(Number);
      console.log(
        "[Report] Downloading monthly report for:",
        year,
        month,
        "dateType:",
        dateType.value
      );
      reportData = await fetchMonthlyReport(year, month, dateType.value);

      // Calculate date range based on date type (Nasional/Indofood)
      const range = getMonthDateRange(selectedMonth.value, dateType.value);
      const startDate = new Date(range.start);
      const endDate = new Date(range.end);

      customDateRange = `${startDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })} - ${endDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;
    }

    if (!reportData) {
      alert(
        "No data available for the selected period. Please try another date."
      );
      return;
    }

    // Override the dateRange.formatted with our custom range
    reportData.dateRange.formatted = customDateRange;

    // Generate PDF using aggregated data
    generatePDFReport(reportData, reportType.value);
  } catch (error) {
    console.error("Error generating report:", error);
    alert("Failed to generate report. Please try again.");
  }
};

const downloadReport = async (type: "day" | "week" | "month") => {
  try {
    // Legacy function - kept for compatibility
    let reportData: ElectricalReportData | null = null;

    if (type === "day") {
      reportData = await fetchDailyReport(getTodayDate());
    } else if (type === "week") {
      reportData = await fetchWeeklyReport(getCurrentMonday());
    } else {
      const now = new Date();
      reportData = await fetchMonthlyReport(
        now.getFullYear(),
        now.getMonth() + 1
      );
    }

    if (!reportData) {
      alert("Failed to fetch report data. Please try again.");
      return;
    }

    // Generate PDF
    generatePDFReport(reportData, type);
  } catch (error) {
    console.error("Error generating report:", error);
    alert("Failed to generate report. Please try again.");
  }
};

const generatePDFReport = async (
  reportData: ElectricalReportData,
  type: "day" | "week" | "month"
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Colors
  const primaryColor = [30, 58, 138]; // Dark Blue
  const secondaryColor = [59, 130, 246]; // Blue
  const accentColor = [245, 158, 11]; // Amber/Orange for warnings
  const lightBg = [248, 250, 252]; // Slate 50
  const textColor = [51, 65, 85]; // Slate 700

  // Helper to center text
  const centerText = (
    text: string,
    y: number,
    size: number,
    font: string = "helvetica",
    style: string = "normal",
    color: number[] = textColor
  ) => {
    doc.setFontSize(size);
    doc.setFont(font, style);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, pageWidth / 2, y, { align: "center" });
  };

  // Load logo
  const logoUrl = "/logo2.png";
  let logoData = "";
  let logoRatio = 1;

  try {
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    logoData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    // Get dimensions to maintain aspect ratio
    if (logoData) {
      const img = new Image();
      img.src = logoData;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      logoRatio = img.width / img.height;
    }
  } catch (e) {
    console.error("Failed to load logo:", e);
  }

  let yPos = 15;

  // 1. Header Section
  // Add logo if available
  if (logoData) {
    const maxLogoWidth = 140; //60 //90
    const maxLogoHeight = 60; //30 //40

    let logoWidth = maxLogoWidth;
    let logoHeight = logoWidth / logoRatio;

    if (logoHeight > maxLogoHeight) {
      logoHeight = maxLogoHeight;
      logoWidth = logoHeight * logoRatio;
    }

    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(logoData, "PNG", logoX, yPos, logoWidth, logoHeight);
    yPos += logoHeight + 8;
  } else {
    yPos += 10;
  }

  // Title
  centerText(
    "ELECTRICAL DASHBOARD",
    yPos,
    16,
    "helvetica",
    "bold",
    primaryColor
  );
  yPos += 8;
  centerText(
    "Executive Summary Report",
    yPos,
    12,
    "helvetica",
    "normal",
    secondaryColor
  );
  yPos += 15;

  // 2. Report Info Bar - Redesigned for clarity
  const infoBarHeight = 32;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(
    margin,
    yPos,
    pageWidth - margin * 2,
    infoBarHeight,
    3,
    3,
    "FD"
  );

  const reportDate = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Left Column
  doc.setFontSize(9);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Report Generated:", margin + 5, yPos + 10);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(reportDate, margin + 5, yPos + 16);

  // Period section - separate area
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Period:", margin + 5, yPos + 24);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(reportData.dateRange.formatted, margin + 20, yPos + 24);

  // Right Column - Summary Stats
  const rightColX = pageWidth / 2 + 15;

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Total Energy:", rightColX, yPos + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(
    `${reportData.summary.totalEnergy_kWh.toFixed(2)} kWh`,
    rightColX,
    yPos + 18
  );

  // Status with colored badge
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Status:", rightColX, yPos + 26);

  const utilization = reportData.summary.utilization_percent;
  const status =
    utilization >= 85 ? "CRITICAL" : utilization >= 70 ? "WARNING" : "NORMAL";
  const statusColor =
    utilization >= 85
      ? [220, 38, 38]
      : utilization >= 70
      ? [245, 158, 11]
      : [22, 163, 74];

  doc.setFontSize(9);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont("helvetica", "bold");

  // Draw status badge background
  const statusWidth = doc.getTextWidth(status);
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setDrawColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(rightColX + 18, yPos + 22, statusWidth + 8, 6, 2, 2, "F");

  // Draw status text in white
  doc.setTextColor(255, 255, 255);
  doc.text(status, rightColX + 22, yPos + 26);

  yPos += infoBarHeight + 12;

  // 3. Key Metrics Cards (using aggregated data)
  const cardWidth = (pageWidth - margin * 2 - 10) / 3;
  const cardHeight = 25;

  // Card 1: Average Load
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(margin, yPos, cardWidth, cardHeight, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("Average Load", margin + cardWidth / 2, yPos + 8, {
    align: "center",
  });
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${reportData.summary.averageLoad_kVA.toFixed(2)} kVA`,
    margin + cardWidth / 2,
    yPos + 18,
    { align: "center" }
  );

  // Card 2: Utilization
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(
    margin + cardWidth + 5,
    yPos,
    cardWidth,
    cardHeight,
    2,
    2,
    "F"
  );
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Utilization", margin + cardWidth + 5 + cardWidth / 2, yPos + 8, {
    align: "center",
  });
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${reportData.summary.utilization_percent.toFixed(1)}%`,
    margin + cardWidth + 5 + cardWidth / 2,
    yPos + 18,
    { align: "center" }
  );

  // Card 3: Installed Capacity
  doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.roundedRect(
    margin + (cardWidth + 5) * 2,
    yPos,
    cardWidth,
    cardHeight,
    2,
    2,
    "F"
  );
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Installed Capacity",
    margin + (cardWidth + 5) * 2 + cardWidth / 2,
    yPos + 8,
    { align: "center" }
  );
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${reportData.summary.installedCapacity_kVA.toFixed(0)} kVA`,
    margin + (cardWidth + 5) * 2 + cardWidth / 2,
    yPos + 18,
    { align: "center" }
  );

  yPos += cardHeight + 15;

  // 4. Panel Details Table (using aggregated data)
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Panel Distribution Details", margin, yPos);
  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
  yPos += 8;

  const tableData = reportData.panels.map((panel) => [
    panel.panelName,
    panel.status === "online" ? "Online" : "Offline",
    `${panel.energy_kWh.toFixed(2)}`,
    `${panel.averageLoad_kVA.toFixed(2)}`,
    `${panel.averageVoltage.toFixed(2)}`,
    `${panel.averageCurrent.toFixed(2)}`,
    panel.averagePowerFactor.toFixed(3),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [
      [
        "Panel Name",
        "Status",
        "Energy (kWh)",
        "Avg Load (kVA)",
        "Voltage (V)",
        "Current (A)",
        "PF",
      ],
    ],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: primaryColor as [number, number, number],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    columnStyles: {
      0: { halign: "left", fontStyle: "bold" },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      6: { halign: "center" },
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249],
    },
    didParseCell: function (data) {
      if (data.section === "body" && data.column.index === 1) {
        const status = data.cell.raw;
        if (status === "Online") {
          data.cell.styles.textColor = [22, 163, 74]; // Green
        } else {
          data.cell.styles.textColor = [220, 38, 38]; // Red
        }
      }
    },
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 10,
      { align: "right" }
    );
    doc.text(
      "Smart Monitoring Plant - Electrical System",
      margin,
      pageHeight - 10
    );
  }

  doc.save(
    `Electrical_Dashboard_Report_${type}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  );
};

onMounted(() => {
  fetchData();
  // Refresh every 10 seconds instead of 3 to reduce "flashing" effect
  refreshInterval = window.setInterval(fetchData, 10000);

  // Check data freshness every 5 seconds for quick detection
  const freshnessInterval = window.setInterval(checkDataFreshness, 5000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
/* Base */
.summary-dashboard {
  min-height: calc(100vh - 64px);
  background: #0f172a;
  padding: 1.5rem;
}

/* Header */
.page-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 12px;
  padding: 1.5rem 2rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.header-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0.25rem 0 0 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  backdrop-filter: blur(10px);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #94a3b8;
}

.pulse-dot.active {
  background: #10b981;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

.last-update {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #cbd5e1;
}

/* Loading & Error */
.loading-state,
.error-state {
  background: #1e293b;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid #334155;
  color: #e2e8f0;
}

/* Connection Warning */
.connection-warning {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.15) 0%,
    rgba(217, 119, 6, 0.15) 100%
  );
  border: 1px solid rgba(245, 158, 11, 0.4);
  border-radius: 10px;
  padding: 0.875rem 1.25rem;
  color: #fbbf24;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
}

.connection-warning svg {
  flex-shrink: 0;
  filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.4));
}

.connection-warning span {
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
}

.connection-warning .dismiss-btn {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  transition: all 0.2s;
  padding: 0;
}

.connection-warning .dismiss-btn:hover {
  background: rgba(245, 158, 11, 0.3);
  border-color: #f59e0b;
  transform: scale(1.1);
}

/* Slide Down Animation */
.slide-down-enter-active {
  animation: slideDown 0.3s ease-out;
}

.slide-down-leave-active {
  animation: slideDown 0.3s ease-out reverse;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #334155;
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-icon {
  width: 64px;
  height: 64px;
  color: #ef4444;
  margin: 0 auto 1rem;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
}

.retry-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
}

/* Dashboard Content */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Report Controls */
.report-controls {
  background: #1e293b;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  margin-bottom: 1.5rem;
  border: 1px solid #334155;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.report-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.report-selector {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-end;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selector-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
}

.report-type-select,
.date-picker,
.month-picker {
  padding: 0.625rem 1rem;
  background: #334155;
  color: #f1f5f9;
  border: 1px solid #475569;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 150px;
}

.report-type-select:hover,
.date-picker:hover,
.month-picker:hover {
  border-color: #60a5fa;
  background: #3b4a61;
}

.report-type-select:focus,
.date-picker:focus,
.month-picker:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
  margin-top: auto;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(96, 165, 250, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
}

.download-btn:active {
  transform: translateY(0);
}

.download-btn svg {
  width: 18px;
  height: 18px;
}

.date-range-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #60a5fa;
  font-size: 0.875rem;
  font-weight: 600;
}

.date-range-info svg {
  flex-shrink: 0;
}

.report-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.report-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.report-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(96, 165, 250, 0.4);
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
}

.report-btn:active {
  transform: translateY(0);
}

.report-btn svg {
  width: 18px;
  height: 18px;
}

/* Load Bar Card */
.load-bar-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid #334155;
}

.load-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.load-bar-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.load-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-minmax {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
}

.stat-minmax .stat-label {
  color: #94a3b8;
  font-weight: 500;
}

.stat-minmax .stat-value {
  color: #e2e8f0;
  font-weight: 700;
}

.load-percentage {
  font-size: 2rem;
  font-weight: 700;
}

.load-percentage.normal {
  color: #059669;
}

.load-percentage.warning {
  color: #f59e0b;
}

.load-percentage.critical {
  color: #dc2626;
}

.load-bar-container {
  margin-bottom: 1rem;
}

.load-bar-bg {
  height: 40px;
  background: #0f172a;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid #334155;
}

.load-bar-fill {
  height: 100%;
  border-radius: 20px;
  position: relative;
  transition: width 0.6s ease;
  overflow: hidden;
}

.load-bar-fill.normal {
  background: linear-gradient(90deg, #10b981, #059669);
}

.load-bar-fill.warning {
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
}

.load-bar-fill.critical {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.load-bar-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  to {
    left: 100%;
  }
}

.load-bar-labels {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.load-current {
  font-weight: 700;
  color: #e2e8f0;
}

.load-bar-info {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #334155;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #94a3b8;
}

.info-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.info-dot.green {
  background: #10b981;
}

.info-dot.amber {
  background: #f59e0b;
}

.info-dot.red {
  background: #dc2626;
}

/* Panels Grid */
.panels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.panel-card {
  background: #1e293b;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid #334155;
}

.panel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}

.panel-card.offline {
  opacity: 0.6;
  cursor: not-allowed;
}

.panel-card.offline:hover {
  transform: none;
  border-color: transparent;
}

.panel-card-header {
  background: linear-gradient(135deg, #334155 0%, #475569 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #475569;
}

.panel-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.panel-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.panel-status-badge.online {
  background: #064e3b;
  color: #86efac;
}

.panel-status-badge.offline {
  background: #7f1d1d;
  color: #fecaca;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.panel-kva-display {
  text-align: center;
  padding: 1rem;
  background: #0f172a;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid #334155;
}

.kva-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.kva-text {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: 0.25rem;
}

.kva-percent {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  margin-top: 0.25rem;
}

.panel-card-body {
  padding: 1.5rem;
}

.metric-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #0f172a;
  border-radius: 10px;
  transition: all 0.2s;
  border: 1px solid #334155;
}

.metric-item:hover {
  background: #1e293b;
  border-color: #475569;
}

.metric-icon-sm {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon-sm svg {
  width: 18px;
  height: 18px;
  color: white;
}

.metric-icon-sm.power {
  background: linear-gradient(135deg, #f59e0b, #f97316);
}

.metric-icon-sm.voltage {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
}

.metric-icon-sm.current {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.metric-icon-sm.pf {
  background: linear-gradient(135deg, #10b981, #059669);
}

.metric-data {
  flex: 1;
  min-width: 0;
}

.metric-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #f1f5f9;
}

.metric-value .unit {
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;
  margin-left: 0.25rem;
}

.metric-percent {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
  margin-left: 0.375rem;
}

.panel-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #0f172a;
  border-top: 1px solid #334155;
  color: #60a5fa;
  font-size: 0.875rem;
  font-weight: 600;
}

.panel-card-footer svg {
  transition: transform 0.2s;
}

.panel-card:hover .panel-card-footer svg {
  transform: translateX(4px);
}

.help-icon-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.2) 0%,
    rgba(37, 99, 235, 0.2) 100%
  );
  border: 2px solid #3b82f6;
  border-radius: 10px;
  padding: 0.65rem 1rem;
  cursor: pointer;
  color: #60a5fa;
  transition: all 0.3s ease;
  margin-left: 1rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25),
    0 0 20px rgba(59, 130, 246, 0.15);
  font-weight: 600;
  font-size: 0.9rem;
}

.help-icon-btn svg {
  flex-shrink: 0;
}

.help-text {
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.help-icon-btn:hover {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.3) 0%,
    rgba(37, 99, 235, 0.3) 100%
  );
  border-color: #60a5fa;
  color: #93c5fd;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35),
    0 0 30px rgba(59, 130, 246, 0.2);
}

.help-icon-btn:active {
  transform: translateY(0);
}

.help-content {
  color: #e2e8f0;
}

.help-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #0f172a;
  border-radius: 12px;
  border: 1px solid #334155;
}

.help-section:last-child {
  margin-bottom: 0;
}

.help-section h3 {
  color: #3b82f6;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.help-section p {
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

.help-section ul {
  margin: 0.75rem 0 0 0;
  padding-left: 1.5rem;
  color: #cbd5e1;
}

.help-section li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.help-section strong {
  color: #f1f5f9;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .summary-dashboard {
    padding: 1rem;
  }

  .page-header {
    padding: 1rem 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .load-bar-info {
    flex-direction: column;
    gap: 0.75rem;
  }

  .panels-grid {
    grid-template-columns: 1fr;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }
}
</style>
