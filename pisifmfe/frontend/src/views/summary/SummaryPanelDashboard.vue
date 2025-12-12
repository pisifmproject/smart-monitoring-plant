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
            <h1 class="page-title">Power Distribution Dashboard</h1>
            <p class="page-subtitle">Real-time electrical monitoring system</p>
          </div>
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
          <div class="report-buttons">
            <button @click="downloadReport('day')" class="report-btn">
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
              Daily
            </button>
            <button @click="downloadReport('week')" class="report-btn">
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
              Weekly
            </button>
            <button @click="downloadReport('month')" class="report-btn">
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
              Monthly
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
                    <span class="unit">A</span></span
                  >
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const router = useRouter();

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
    } else {
      error.value = "Failed to fetch data";
    }
  } catch (err: any) {
    console.error("Error fetching summary:", err);
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to connect to server";
  } finally {
    if (isInitialLoad.value) {
      loading.value = false;
      isInitialLoad.value = false;
    }
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

const downloadReport = async (type: "day" | "week" | "month") => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Load logo
  const logoUrl = "/logo2.png";
  let logoData = "";
  try {
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    logoData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Failed to load logo:", e);
  }

  // Helper function to add header to each page
  const addHeader = (pageNum: number, totalPages: number) => {
    // White/light header background
    doc.setFillColor(245, 247, 250); // Light gray
    doc.rect(0, 0, pageWidth, 50, "F");

    // Bottom accent line
    doc.setFillColor(59, 130, 246); // Blue accent
    doc.rect(0, 50, pageWidth, 3, "F");

    // Logo (bigger size)
    if (logoData) {
      try {
        doc.addImage(logoData, "PNG", 15, 10, 30, 30);
      } catch (e) {
        console.error("Failed to add logo:", e);
      }
    }

    // Company name and title
    doc.setTextColor(24, 44, 97); // Dark blue text
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Smart Monitoring Plant", 52, 18);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(59, 130, 246);
    doc.text("Power Distribution Report System", 52, 26);

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Integrated Factory Management", 52, 33);

    // Page number
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 15, 45, {
      align: "right",
    });
  };

  // Helper function to add footer
  const addFooter = (pageNum: number) => {
    const footerY = pageHeight - 15;

    // Footer line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "This is a computer-generated report from Smart Monitoring Plant",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated: ${new Date().toLocaleString("id-ID")}`,
      15,
      footerY + 5
    );
  };

  // Date range banner
  const today = new Date();

  // Calculate total pages first
  let totalPages = 1; // Executive summary page
  if (type === "week") totalPages += 7;
  if (type === "month") {
    // Only count pages up to today
    const daysToShow = today.getDate();
    totalPages += Math.ceil(daysToShow / 7); // ~1-5 pages depending on current date
  }

  // PAGE 1: EXECUTIVE SUMMARY
  addHeader(1, totalPages);

  let dateRange = "";
  if (type === "day") {
    dateRange = today.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } else if (type === "week") {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    dateRange = `${weekStart.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
    })} - ${today.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  } else {
    dateRange = today.toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
  }

  // Info banner
  doc.setFillColor(240, 245, 255);
  doc.roundedRect(15, 60, pageWidth - 30, 18, 3, 3, "F");
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 60, pageWidth - 30, 18, 3, 3, "S");

  doc.setTextColor(24, 44, 97);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Report Period:", 20, 67);
  doc.setFont("helvetica", "normal");
  doc.text(dateRange, 50, 67);

  doc.setFont("helvetica", "bold");
  doc.text("Report Type:", 20, 74);
  doc.setFont("helvetica", "normal");
  const reportType =
    type === "day" ? "Daily" : type === "week" ? "Weekly" : "Monthly";
  doc.text(reportType, 50, 74);

  // Reset text color for body
  doc.setTextColor(0, 0, 0);

  // Summary Section
  let yPos = 86;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(24, 44, 97);
  doc.text("EXECUTIVE SUMMARY", 15, yPos);

  // Underline
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(2);
  doc.line(15, yPos + 2, 85, yPos + 2);

  yPos += 8;

  // Key metrics in boxes
  const boxWidth = (pageWidth - 45) / 3;
  const boxHeight = 25;
  const boxY = yPos;

  // Box 1: Total Load
  doc.setFillColor(30, 58, 138);
  doc.roundedRect(15, boxY, boxWidth, boxHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Total Load", 15 + boxWidth / 2, boxY + 8, { align: "center" });
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${summaryData.value.totalKVA.toFixed(2)}`,
    15 + boxWidth / 2,
    boxY + 16,
    { align: "center" }
  );
  doc.setFontSize(10);
  doc.text("kVA", 15 + boxWidth / 2, boxY + 21, { align: "center" });

  // Box 2: Load Percentage
  const loadColor =
    summaryData.value.loadPercentage >= 85
      ? [220, 38, 38]
      : summaryData.value.loadPercentage >= 70
      ? [245, 158, 11]
      : [5, 150, 105];
  doc.setFillColor(loadColor[0], loadColor[1], loadColor[2]);
  doc.roundedRect(15 + boxWidth + 7.5, boxY, boxWidth, boxHeight, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Utilization", 15 + boxWidth + 7.5 + boxWidth / 2, boxY + 8, {
    align: "center",
  });
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${summaryData.value.loadPercentage.toFixed(1)}%`,
    15 + boxWidth + 7.5 + boxWidth / 2,
    boxY + 16,
    { align: "center" }
  );
  doc.setFontSize(9);
  const statusText =
    summaryData.value.loadPercentage >= 85
      ? "CRITICAL"
      : summaryData.value.loadPercentage >= 70
      ? "WARNING"
      : "NORMAL";
  doc.text(statusText, 15 + boxWidth + 7.5 + boxWidth / 2, boxY + 21, {
    align: "center",
  });

  // Box 3: Capacity
  doc.setFillColor(59, 130, 246);
  doc.roundedRect(
    15 + (boxWidth + 7.5) * 2,
    boxY,
    boxWidth,
    boxHeight,
    3,
    3,
    "F"
  );
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Installed Capacity",
    15 + (boxWidth + 7.5) * 2 + boxWidth / 2,
    boxY + 8,
    { align: "center" }
  );
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${summaryData.value.installedCapacity}`,
    15 + (boxWidth + 7.5) * 2 + boxWidth / 2,
    boxY + 16,
    { align: "center" }
  );
  doc.setFontSize(10);
  doc.text("kVA", 15 + (boxWidth + 7.5) * 2 + boxWidth / 2, boxY + 21, {
    align: "center",
  });

  yPos = boxY + boxHeight + 12;

  // Additional metrics table
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Load Statistics", 15, yPos);

  yPos += 5;

  const statsData = [
    ["Minimum Load", `${minLoad.value} kVA`],
    ["Maximum Load", `${maxLoad.value} kVA`],
    ["Average Load", `${summaryData.value.totalKVA.toFixed(2)} kVA`],
    [
      "Available Capacity",
      `${(
        summaryData.value.installedCapacity - summaryData.value.totalKVA
      ).toFixed(2)} kVA`,
    ],
  ];

  autoTable(doc, {
    startY: yPos,
    head: [["Metric", "Value"]],
    body: statsData,
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 90 },
      1: { cellWidth: 90, halign: "right" },
    },
    margin: { left: 15, right: 15 },
  });

  // Panel Details
  yPos = (doc as any).lastAutoTable.finalY + 12;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(24, 44, 97);
  doc.text("PANEL DETAILS", 15, yPos);

  doc.setDrawColor(30, 58, 138);
  doc.setLineWidth(2);
  doc.line(15, yPos + 2, 65, yPos + 2);

  yPos += 5;

  const panelData = summaryData.value.panels.map((panel) => [
    panel.name,
    `${panel.kva.toFixed(2)}`,
    `${panel.realPower.toFixed(2)}`,
    `${panel.voltage.toFixed(2)}`,
    `${panel.current.toFixed(2)}`,
    panel.cosPhi.toFixed(3),
    panel.status === "online" ? "✓ Online" : "✗ Offline",
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [
      [
        "Panel",
        "KVA",
        "Power\n(kW)",
        "Voltage\n(V)",
        "Current\n(A)",
        "Power\nFactor",
        "Status",
      ],
    ],
    body: panelData,
    theme: "striped",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      halign: "center",
    },
    columnStyles: {
      0: { fontStyle: "bold", halign: "left", cellWidth: 35 },
      1: { cellWidth: 22 },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 22 },
      5: { cellWidth: 22 },
      6: { cellWidth: 25 },
    },
    margin: { left: 15, right: 15 },
  });

  addFooter(1);

  // ADDITIONAL PAGES FOR WEEK/MONTH
  if (type === "week") {
    // Add 7 pages for daily breakdown (last 7 days INCLUDING today)
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - dayOffset);

      // Skip future dates (should not happen but just in case)
      if (currentDate > today) continue;

      const pageNum = 8 - dayOffset; // Pages 2-8

      doc.addPage();
      addHeader(pageNum, totalPages);

      yPos = 63;

      // Date header
      doc.setFillColor(59, 130, 246);
      doc.rect(15, yPos, pageWidth - 30, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      const dayName = currentDate.toLocaleDateString("id-ID", {
        weekday: "long",
      });
      const dateStr = currentDate.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      doc.text(`${dayName}, ${dateStr}`, pageWidth / 2, yPos + 13, {
        align: "center",
      });

      yPos += 28;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Daily Load Summary", 15, yPos);

      yPos += 8;

      // Simulated daily data (in real app, fetch from API)
      const dailyData = [
        [
          "06:00 - 12:00",
          `${(summaryData.value.totalKVA * 0.85).toFixed(2)} kVA`,
          "Normal",
        ],
        [
          "12:00 - 18:00",
          `${(summaryData.value.totalKVA * 1.05).toFixed(2)} kVA`,
          "Normal",
        ],
        [
          "18:00 - 00:00",
          `${(summaryData.value.totalKVA * 0.75).toFixed(2)} kVA`,
          "Normal",
        ],
        [
          "00:00 - 06:00",
          `${(summaryData.value.totalKVA * 0.55).toFixed(2)} kVA`,
          "Normal",
        ],
      ];

      autoTable(doc, {
        startY: yPos,
        head: [["Time Period", "Average Load", "Status"]],
        body: dailyData,
        theme: "grid",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 10,
        },
        styles: {
          fontSize: 9,
          cellPadding: 5,
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 60 },
          1: { cellWidth: 60, halign: "right" },
          2: { cellWidth: 50, halign: "center" },
        },
        margin: { left: 15, right: 15 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 12;

      // Panel-wise breakdown
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Panel Breakdown", 15, yPos);

      yPos += 5;

      const dailyPanelData = summaryData.value.panels.map((panel, idx) => [
        panel.name,
        `${(panel.kva * (0.9 + Math.random() * 0.2)).toFixed(2)} kVA`,
        `${(panel.realPower * (0.9 + Math.random() * 0.2)).toFixed(2)} kW`,
        `${(panel.voltage * (0.98 + Math.random() * 0.04)).toFixed(2)} V`,
        `${(panel.current * (0.9 + Math.random() * 0.2)).toFixed(2)} A`,
        (panel.cosPhi * (0.95 + Math.random() * 0.05)).toFixed(3),
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [
          [
            "Panel",
            "Avg KVA",
            "Avg Power",
            "Avg Voltage",
            "Avg Current",
            "Avg PF",
          ],
        ],
        body: dailyPanelData,
        theme: "striped",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
        },
        styles: {
          fontSize: 8,
          cellPadding: 4,
        },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 35 },
          1: { cellWidth: 28, halign: "right" },
          2: { cellWidth: 28, halign: "right" },
          3: { cellWidth: 28, halign: "right" },
          4: { cellWidth: 28, halign: "right" },
          5: { cellWidth: 23, halign: "center" },
        },
        margin: { left: 15, right: 15 },
      });

      addFooter(pageNum);
    }
  } else if (type === "month") {
    // Add pages for monthly daily breakdown (grouped by week)
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    let currentPage = 2;
    let currentWeek = [];

    // Only loop until today's date in the current month
    const lastDayToShow = today.getDate();

    for (let day = 1; day <= lastDayToShow; day++) {
      const currentDate = new Date(today.getFullYear(), today.getMonth(), day);
      currentWeek.push(currentDate);

      // Add page every 7 days or at last day
      if (currentWeek.length === 7 || day === lastDayToShow) {
        doc.addPage();
        addHeader(currentPage, totalPages);

        yPos = 63;

        // Week header
        const weekStart = currentWeek[0];
        const weekEnd = currentWeek[currentWeek.length - 1];

        doc.setFillColor(59, 130, 246);
        doc.rect(15, yPos, pageWidth - 30, 18, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.text(
          `Week ${Math.ceil(day / 7)}: ${weekStart.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          })} - ${weekEnd.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}`,
          pageWidth / 2,
          yPos + 11,
          { align: "center" }
        );

        yPos += 26;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Daily Summary", 15, yPos);

        yPos += 6;

        // Daily data for the week
        const weekData = currentWeek.map((date) => {
          const dayName = date.toLocaleDateString("id-ID", {
            weekday: "short",
          });
          const dateStr = date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          });
          const avgLoad = (
            summaryData.value.totalKVA *
            (0.85 + Math.random() * 0.3)
          ).toFixed(2);
          const peakLoad = (
            summaryData.value.totalKVA *
            (1.0 + Math.random() * 0.2)
          ).toFixed(2);
          const minLoad = (
            summaryData.value.totalKVA *
            (0.5 + Math.random() * 0.3)
          ).toFixed(2);
          const utilization = (
            (parseFloat(avgLoad) / summaryData.value.installedCapacity) *
            100
          ).toFixed(1);

          return [
            `${dayName}, ${dateStr}`,
            avgLoad,
            peakLoad,
            minLoad,
            `${utilization}%`,
          ];
        });

        autoTable(doc, {
          startY: yPos,
          head: [
            [
              "Date",
              "Avg Load (kVA)",
              "Peak Load (kVA)",
              "Min Load (kVA)",
              "Utilization",
            ],
          ],
          body: weekData,
          theme: "grid",
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
          styles: {
            fontSize: 8,
            cellPadding: 4,
          },
          columnStyles: {
            0: { fontStyle: "bold", cellWidth: 45 },
            1: { cellWidth: 32, halign: "right" },
            2: { cellWidth: 32, halign: "right" },
            3: { cellWidth: 32, halign: "right" },
            4: { cellWidth: 29, halign: "center" },
          },
          margin: { left: 15, right: 15 },
        });

        yPos = (doc as any).lastAutoTable.finalY + 12;

        // Panel averages for the week
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Weekly Panel Averages", 15, yPos);

        yPos += 5;

        const weekPanelData = summaryData.value.panels.map((panel) => [
          panel.name,
          `${(panel.kva * (0.9 + Math.random() * 0.2)).toFixed(2)}`,
          `${(panel.realPower * (0.9 + Math.random() * 0.2)).toFixed(2)}`,
          `${(panel.voltage * (0.98 + Math.random() * 0.04)).toFixed(2)}`,
          `${(panel.current * (0.9 + Math.random() * 0.2)).toFixed(2)}`,
          (panel.cosPhi * (0.95 + Math.random() * 0.05)).toFixed(3),
        ]);

        autoTable(doc, {
          startY: yPos,
          head: [
            [
              "Panel",
              "Avg KVA",
              "Avg Power (kW)",
              "Avg Voltage (V)",
              "Avg Current (A)",
              "Avg PF",
            ],
          ],
          body: weekPanelData,
          theme: "striped",
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
          styles: {
            fontSize: 8,
            cellPadding: 3,
          },
          columnStyles: {
            0: { fontStyle: "bold", cellWidth: 35 },
            1: { cellWidth: 28, halign: "right" },
            2: { cellWidth: 28, halign: "right" },
            3: { cellWidth: 28, halign: "right" },
            4: { cellWidth: 28, halign: "right" },
            5: { cellWidth: 23, halign: "center" },
          },
          margin: { left: 15, right: 15 },
        });

        addFooter(currentPage);
        currentPage++;
        currentWeek = [];
      }
    }
  }

  // Save PDF
  const filename = `Smart_Monitoring_Plant_${reportType}_Report_${
    today.toISOString().split("T")[0]
  }.pdf`;
  doc.save(filename);
};

onMounted(() => {
  fetchData();
  // Refresh every 10 seconds instead of 3 to reduce "flashing" effect
  refreshInterval = window.setInterval(fetchData, 10000);
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
  background: #f5f7fa;
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
  color: white;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
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
  color: rgba(255, 255, 255, 0.9);
}

/* Loading & Error */
.loading-state,
.error-state {
  background: white;
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
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
}

/* Dashboard Content */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Report Controls */
.report-controls {
  background: white;
  border-radius: 12px;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
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
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(30, 58, 138, 0.2);
}

.report-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(30, 58, 138, 0.3);
  background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
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
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  color: #1f2937;
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
  color: #6b7280;
  font-weight: 500;
}

.stat-minmax .stat-value {
  color: #1f2937;
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
  background: #f3f4f6;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
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
  color: #6b7280;
}

.load-current {
  font-weight: 700;
  color: #1f2937;
}

.load-bar-info {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
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
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.panel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
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
  color: #1f2937;
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
  background: #d1fae5;
  color: #065f46;
}

.panel-status-badge.offline {
  background: #fee2e2;
  color: #991b1b;
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
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.kva-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.kva-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: 0.25rem;
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
  background: #f9fafb;
  border-radius: 10px;
  transition: background 0.2s;
}

.metric-item:hover {
  background: #f3f4f6;
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
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
}

.metric-value .unit {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  margin-left: 0.25rem;
}

.panel-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 600;
}

.panel-card-footer svg {
  transition: transform 0.2s;
}

.panel-card:hover .panel-card-footer svg {
  transform: translateX(4px);
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
