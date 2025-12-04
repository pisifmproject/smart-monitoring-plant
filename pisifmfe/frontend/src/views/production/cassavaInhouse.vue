<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/stores/auth";
import ReportButton from "@/components/reportButton.vue";

const { canAccessDailyReport } = useAuth();
const machineName = "Cassava Inhouse";

// Mock data - replace with real API
const productionData = ref({
  targetProduction: 5000,
  actualProduction: 4720,
  defectCount: 85,
  oeePercentage: 92,
  availability: 95,
  performance: 94,
  quality: 98,
});

const status = "running";
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
              <h1 class="page-title">{{ machineName }}</h1>
              <p class="page-subtitle">Production Dashboard</p>
            </div>
          </div>
          <div class="header-actions">
            <div class="status-badge" :class="status">
              <span class="status-dot"></span>
              {{ status.toUpperCase() }}
            </div>
            <div v-if="canAccessDailyReport()" class="report-btn-wrapper">
              <ReportButton
                routeName="dailyReportCassavaInhouse"
                :label="`Daily Report`"
              />
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
  background-color: #f8fafc;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: #1e293b;
}

.production-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Header */
.header-section {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 1.5rem 2rem;
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
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
  color: #0f172a;
  margin-bottom: 1.5rem;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-4px);
}

.metric-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  background: #f1f5f9;
}

.metric-card.primary .metric-icon {
  background: #e0e7ff;
  color: #4f46e5;
}
.metric-card.success .metric-icon {
  background: #dcfce7;
  color: #16a34a;
}
.metric-card.danger .metric-icon {
  background: #fee2e2;
  color: #dc2626;
}
.metric-card.info .metric-icon {
  background: #e0f2fe;
  color: #0284c7;
}

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
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
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
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
  stroke: #f1f5f9;
  stroke-width: 2.5;
}

.circle {
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke: #4f46e5;
  animation: progress 1s ease-out forwards;
}

.oee-percentage {
  position: absolute;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}

.oee-label {
  font-weight: 600;
  color: #64748b;
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
