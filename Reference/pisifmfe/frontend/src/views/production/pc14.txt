<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ReportButton from "@/components/reportButton.vue";
import { useAuth } from "@/stores/auth";

const { canAccessDailyReport } = useAuth();
const lineId = "LINE_A_PC14";
const loading = ref(false);
const hasData = ref(false);

const productionData = ref({
  targetProduction: 0,
  actualProduction: 0,
  defectCount: 0,
  oeePercentage: 0,
  availability: 0,
  performance: 0,
  quality: 0,
  kwhMeter: 0,
  powerConsumption: 0,
  voltageInput: 0,
  currentAmpere: 0,
});

const shiftSummary = ref({
  shift1: { target: 0, actual: 0, defect: 0, oee: 0 },
  shift2: { target: 0, actual: 0, defect: 0, oee: 0 },
  shift3: { target: 0, actual: 0, defect: 0, oee: 0 },
});

// Status computed based on data availability
const status = computed(() => (hasData.value ? "running" : "offline"));

// Function to fetch production data from backend
const fetchProductionData = async () => {
  loading.value = true;
  try {
    const timestamp = Date.now();
    const response = await fetch(
      `http://localhost:2000/api/production/${lineId}?_t=${timestamp}`,
      {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      hasData.value = true;
      productionData.value = {
        targetProduction: result.data.targetProduction || 0,
        actualProduction: result.data.actualProduction || 0,
        defectCount: result.data.defectCount || 0,
        oeePercentage: result.data.oeePercentage || 0,
        availability: result.data.availability || 0,
        performance: result.data.performance || 0,
        quality: result.data.quality || 0,
        kwhMeter: result.data.kwhMeter || 0,
        powerConsumption: result.data.powerConsumption || 0,
        voltageInput: result.data.voltageInput || 0,
        currentAmpere: result.data.currentAmpere || 0,
      };

      // If shift summary data exists
      if (result.data.shifts) {
        result.data.shifts.forEach((shift: any) => {
          const shiftKey =
            `shift${shift.shiftNumber}` as keyof typeof shiftSummary.value;
          if (shiftSummary.value[shiftKey]) {
            shiftSummary.value[shiftKey] = {
              target: shift.target || 0,
              actual: shift.actual || 0,
              defect: shift.defect || 0,
              oee: shift.oee || 0,
            };
          }
        });
      }
    } else {
      hasData.value = false;
    }
  } catch (err) {
    // console.error("Error fetching production data:", err);
    hasData.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProductionData();
  // Refresh every 30 seconds
  setInterval(fetchProductionData, 30000);
});
</script>

<template>
  <div class="production-wrapper">
    <div class="production-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-left">
            <div class="icon-circle">
              <span class="icon-text">🏭</span>
            </div>
            <div class="header-text">
              <h1 class="page-title">Production Line PC14</h1>
              <p class="page-subtitle">Potato Chips Production Line</p>
            </div>
          </div>
          <div class="header-actions">
            <div class="status-badge" :class="status">
              <span class="status-dot"></span>
              {{ status.toUpperCase() }}
            </div>
            <div v-if="canAccessDailyReport()" class="report-btn-wrapper">
              <ReportButton routeName="dailyReportPC14" label="Daily Report" />
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="content-wrapper">
        <!-- Main Metrics -->
        <section class="dashboard-section">
          <div class="metrics-grid">
            <div class="metric-card primary">
              <div class="metric-icon">🎯</div>
              <div class="metric-content">
                <span class="metric-label">Target Production</span>
                <span class="metric-value">{{
                  productionData.targetProduction.toLocaleString()
                }}</span>
                <span class="metric-unit">units</span>
              </div>
            </div>
            <div class="metric-card success">
              <div class="metric-icon">📦</div>
              <div class="metric-content">
                <span class="metric-label">Actual Production</span>
                <span class="metric-value">{{
                  productionData.actualProduction.toLocaleString()
                }}</span>
                <span class="metric-unit">units</span>
              </div>
            </div>
            <div class="metric-card danger">
              <div class="metric-icon">⚠️</div>
              <div class="metric-content">
                <span class="metric-label">Defect Count</span>
                <span class="metric-value">{{
                  productionData.defectCount.toLocaleString()
                }}</span>
                <span class="metric-unit">units</span>
              </div>
            </div>
            <div class="metric-card info">
              <div class="metric-icon">📊</div>
              <div class="metric-content">
                <span class="metric-label">OEE</span>
                <span class="metric-value"
                  >{{ productionData.oeePercentage }}%</span
                >
                <span class="metric-unit">Efficiency</span>
              </div>
            </div>
          </div>
        </section>

        <!-- OEE Breakdown -->
        <section class="dashboard-section">
          <h2 class="section-title">OEE Breakdown</h2>
          <div class="oee-grid">
            <div class="oee-card">
              <div
                class="oee-ring"
                :style="{ '--progress': productionData.availability + '%' }"
              >
                <svg viewBox="0 0 36 36" class="circular-chart">
                  <path
                    class="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    class="circle"
                    :stroke-dasharray="`${productionData.availability}, 100`"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div class="oee-percentage">
                  {{ productionData.availability }}%
                </div>
              </div>
              <span class="oee-label">Availability</span>
            </div>
            <div class="oee-card">
              <div
                class="oee-ring"
                :style="{ '--progress': productionData.performance + '%' }"
              >
                <svg viewBox="0 0 36 36" class="circular-chart">
                  <path
                    class="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    class="circle"
                    :stroke-dasharray="`${productionData.performance}, 100`"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div class="oee-percentage">
                  {{ productionData.performance }}%
                </div>
              </div>
              <span class="oee-label">Performance</span>
            </div>
            <div class="oee-card">
              <div
                class="oee-ring"
                :style="{ '--progress': productionData.quality + '%' }"
              >
                <svg viewBox="0 0 36 36" class="circular-chart">
                  <path
                    class="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    class="circle"
                    :stroke-dasharray="`${productionData.quality}, 100`"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div class="oee-percentage">{{ productionData.quality }}%</div>
              </div>
              <span class="oee-label">Quality</span>
            </div>
          </div>
        </section>

        <!-- Power Consumption -->
        <section class="dashboard-section">
          <h2 class="section-title">Power Consumption</h2>
          <div class="power-grid">
            <div class="power-card highlight">
              <div class="power-icon">⚡</div>
              <div class="power-details">
                <span class="power-label">Total Energy</span>
                <span class="power-value">{{
                  productionData.kwhMeter.toLocaleString()
                }}</span>
                <span class="power-unit">kWh</span>
              </div>
            </div>
            <div class="power-card">
              <div class="power-icon">🔌</div>
              <div class="power-details">
                <span class="power-label">Current Power</span>
                <span class="power-value">{{
                  productionData.powerConsumption.toLocaleString()
                }}</span>
                <span class="power-unit">kW</span>
              </div>
            </div>
            <div class="power-card">
              <div class="power-icon">🔋</div>
              <div class="power-details">
                <span class="power-label">Voltage</span>
                <span class="power-value">{{
                  productionData.voltageInput
                }}</span>
                <span class="power-unit">V</span>
              </div>
            </div>
            <div class="power-card">
              <div class="power-icon">〰️</div>
              <div class="power-details">
                <span class="power-label">Current</span>
                <span class="power-value">{{
                  productionData.currentAmpere
                }}</span>
                <span class="power-unit">A</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Shift Summary -->
        <section class="dashboard-section">
          <h2 class="section-title">Shift Summary</h2>
          <div class="shift-summary-grid">
            <div
              v-for="(data, shift) in shiftSummary"
              :key="shift"
              class="shift-summary-card"
            >
              <div class="shift-summary-header">
                <h3>{{ shift.toUpperCase() }}</h3>
              </div>
              <div class="shift-summary-body">
                <div class="summary-row">
                  <span>Target</span>
                  <strong>{{ data.target }}</strong>
                </div>
                <div class="summary-row">
                  <span>Actual</span>
                  <strong>{{ data.actual }}</strong>
                </div>
                <div class="summary-row danger">
                  <span>Defect</span>
                  <strong>{{ data.defect }}</strong>
                </div>
                <div class="summary-row success">
                  <span>OEE</span>
                  <strong>{{ data.oee }}%</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modern Reset & Base */
* {
  box-sizing: border-box;
}

.production-wrapper {
  min-height: 100vh;
  background-color: #0f172a;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: #e2e8f0;
}

.production-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Header */
.header-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 1.5rem 2rem;
  color: white;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
  z-index: 10;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.icon-circle {
  width: 3.5rem;
  height: 3.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
  opacity: 0.9;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.875rem;
  backdrop-filter: blur(4px);
}

.status-badge.running .status-dot {
  background-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3);
}

.status-badge.offline .status-dot {
  background-color: #94a3b8;
}

.status-dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
}

/* Content */
.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}

.dashboard-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 1.5rem;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: #1e293b;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid #334155;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.2s;
}

.metric-card:hover {
  transform: translateY(-4px);
  border-color: #3b82f6;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
}

.metric-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  background: #334155;
}

.metric-card.primary .metric-icon {
  background: rgba(79, 70, 229, 0.2);
  color: #818cf8;
}
.metric-card.success .metric-icon {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}
.metric-card.danger .metric-icon {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}
.metric-card.info .metric-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #94a3b8;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #e2e8f0;
  line-height: 1.2;
}

.metric-unit {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

/* OEE Grid */
.oee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.oee-card {
  background: #1e293b;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid #334155;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.oee-ring {
  width: 120px;
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circular-chart {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  max-height: 100%;
}

.circle-bg {
  fill: none;
  stroke: #334155;
  stroke-width: 2.5;
}

.circle {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke: #3b82f6;
  animation: progress 1s ease-out forwards;
}

.oee-percentage {
  position: absolute;
  font-size: 1.5rem;
  font-weight: 800;
  color: #e2e8f0;
}

.oee-label {
  font-weight: 600;
  color: #94a3b8;
}

/* Power Grid */
.power-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.power-card {
  background: #1e293b;
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid #334155;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.power-card.highlight {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
}

.power-card.highlight .power-label,
.power-card.highlight .power-value,
.power-card.highlight .power-unit {
  color: white;
}

.power-icon {
  font-size: 1.5rem;
}

.power-details {
  display: flex;
  flex-direction: column;
}

.power-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
}

.power-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
}

.power-unit {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Shift Summary */
.shift-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.shift-summary-card {
  background: #1e293b;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #334155;
}

.shift-summary-header {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 1rem;
  border-bottom: 1px solid #334155;
  font-weight: 700;
  color: #f1f5f9;
  text-align: center;
}

.shift-summary-body {
  padding: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #334155;
  font-size: 0.9rem;
}

.summary-row:last-child {
  border-bottom: none;
}

.summary-row.danger strong {
  color: #dc2626;
}
.summary-row.success strong {
  color: #16a34a;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .content-wrapper {
    padding: 1rem;
  }
}
</style>
