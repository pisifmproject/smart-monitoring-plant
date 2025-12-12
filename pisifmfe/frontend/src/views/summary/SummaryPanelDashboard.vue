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
    "POWER DISTRIBUTION DASHBOARD",
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

  // 2. Report Info Bar
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, yPos, pageWidth - margin * 2, 20, 2, 2, "FD");

  const today = new Date();
  const reportDate = today.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  doc.setFontSize(10);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Report Generated:", margin + 5, yPos + 8);
  doc.text("Period:", margin + 5, yPos + 15);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(reportDate, margin + 45, yPos + 8);

  let periodText = "";
  if (type === "day") periodText = "Daily Report";
  else if (type === "week") periodText = "Weekly Report";
  else periodText = "Monthly Report";

  doc.text(periodText, margin + 45, yPos + 15);

  // Right side of info bar (Summary Stats)
  const rightColX = pageWidth / 2 + 10;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("Total Load:", rightColX, yPos + 8);
  doc.text("Status:", rightColX, yPos + 15);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(
    `${summaryData.value.totalKVA.toFixed(2)} kVA`,
    rightColX + 30,
    yPos + 8
  );

  const status =
    summaryData.value.loadPercentage >= 85
      ? "CRITICAL"
      : summaryData.value.loadPercentage >= 70
      ? "WARNING"
      : "NORMAL";
  const statusColor =
    summaryData.value.loadPercentage >= 85
      ? [220, 38, 38]
      : summaryData.value.loadPercentage >= 70
      ? [245, 158, 11]
      : [22, 163, 74];

  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(status, rightColX + 30, yPos + 15);

  yPos += 30;

  // 3. Key Metrics Cards (Visual representation)
  const cardWidth = (pageWidth - margin * 2 - 10) / 3;
  const cardHeight = 25;

  // Card 1: Load
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(margin, yPos, cardWidth, cardHeight, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("Current Load", margin + cardWidth / 2, yPos + 8, {
    align: "center",
  });
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(
    `${summaryData.value.totalKVA.toFixed(2)} kVA`,
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
    `${summaryData.value.loadPercentage.toFixed(1)}%`,
    margin + cardWidth + 5 + cardWidth / 2,
    yPos + 18,
    { align: "center" }
  );

  // Card 3: Capacity
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
    `${summaryData.value.installedCapacity} kVA`,
    margin + (cardWidth + 5) * 2 + cardWidth / 2,
    yPos + 18,
    { align: "center" }
  );

  yPos += cardHeight + 15;

  // 4. Panel Details Table
  doc.setFontSize(12);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text("Panel Distribution Details", margin, yPos);
  doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
  yPos += 8;

  const tableData = summaryData.value.panels.map((panel) => [
    panel.name,
    panel.status === "online" ? "Online" : "Offline",
    `${panel.kva.toFixed(2)}`,
    `${panel.realPower.toFixed(2)}`,
    `${panel.voltage.toFixed(2)}`,
    `${panel.current.toFixed(2)}`,
    panel.cosPhi.toFixed(3),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [
      [
        "Panel Name",
        "Status",
        "Load (kVA)",
        "Power (kW)",
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
      "Smart Monitoring Plant - Power Distribution System",
      margin,
      pageHeight - 10
    );
  }

  doc.save(
    `Power_Distribution_Report_${type}_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  );
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
