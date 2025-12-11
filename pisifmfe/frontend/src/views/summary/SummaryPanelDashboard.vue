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
      <!-- Load Progress Bar -->
      <div class="load-bar-card">
        <div class="load-bar-header">
          <h3>Current Load Distribution</h3>
          <div class="load-percentage" :class="getLoadColorClass">
            {{ summaryData.loadPercentage }}%
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
}

.load-bar-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
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
