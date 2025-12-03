<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/stores/auth";
import ReportButton from "@/components/reportButton.vue";

const { canAccessDailyReport } = useAuth();
const machineName = "Packing Pouch (Promina Puff)";

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
</script>

<template>
  <div class="production-wrapper">
    <div class="production-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-left">
            <div class="icon-circle">🏭</div>
            <div>
              <h1 class="page-title">{{ machineName }}</h1>
              <p class="page-subtitle">Production Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Report Button (User only) -->
      <div v-if="canAccessDailyReport()" class="report-button-container">
        <ReportButton
          routeName="dailyReportPackingPouch"
          :label="`Daily Report - ${machineName}`"
        />
      </div>

      <!-- Main Metrics -->
      <div class="metrics-section">
        <div class="metric-card">
          <div class="metric-label">Target Production</div>
          <div class="metric-value">
            {{ productionData.targetProduction.toLocaleString() }}
          </div>
          <div class="metric-unit">units</div>
        </div>

        <div class="metric-card highlight">
          <div class="metric-label">Actual Production</div>
          <div class="metric-value">
            {{ productionData.actualProduction.toLocaleString() }}
          </div>
          <div class="metric-unit">units</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">Defect Count</div>
          <div class="metric-value">
            {{ productionData.defectCount.toLocaleString() }}
          </div>
          <div class="metric-unit">units</div>
        </div>

        <div class="metric-card oee">
          <div class="metric-label">OEE</div>
          <div class="metric-value">{{ productionData.oeePercentage }}%</div>
          <div class="metric-unit">overall</div>
        </div>
      </div>

      <!-- OEE Components -->
      <div class="oee-section">
        <div class="oee-card">
          <div class="oee-header">
            <span class="oee-label">Availability</span>
            <span class="oee-value">{{ productionData.availability }}%</span>
          </div>
          <div class="oee-bar">
            <div
              class="oee-fill availability"
              :style="{ width: productionData.availability + '%' }"
            ></div>
          </div>
        </div>

        <div class="oee-card">
          <div class="oee-header">
            <span class="oee-label">Performance</span>
            <span class="oee-value">{{ productionData.performance }}%</span>
          </div>
          <div class="oee-bar">
            <div
              class="oee-fill performance"
              :style="{ width: productionData.performance + '%' }"
            ></div>
          </div>
        </div>

        <div class="oee-card">
          <div class="oee-header">
            <span class="oee-label">Quality</span>
            <span class="oee-value">{{ productionData.quality }}%</span>
          </div>
          <div class="oee-bar">
            <div
              class="oee-fill quality"
              :style="{ width: productionData.quality + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.production-wrapper {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

.production-container {
  width: 100%;
  background: #f8fafc;
  min-height: 100vh;
}

.header-section {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 32px 48px;
  border-bottom: 3px solid #0ea5e9;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.3);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  margin: 4px 0 0 0;
}

.report-button-container {
  padding: 24px 48px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.metrics-section {
  padding: 48px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.metric-card {
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
}

.metric-card.highlight {
  background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
  color: white;
}

.metric-card.oee {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.metric-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 12px;
}

.metric-card.highlight .metric-label,
.metric-card.oee .metric-label {
  color: rgba(255, 255, 255, 0.9);
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
  margin-bottom: 8px;
}

.metric-card.highlight .metric-value,
.metric-card.oee .metric-value {
  color: white;
}

.metric-unit {
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: 500;
}

.metric-card.highlight .metric-unit,
.metric-card.oee .metric-unit {
  color: rgba(255, 255, 255, 0.8);
}

.oee-section {
  padding: 0 48px 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.oee-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.oee-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.oee-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.oee-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0ea5e9;
}

.oee-bar {
  height: 12px;
  background: #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
}

.oee-fill {
  height: 100%;
  border-radius: 20px;
  transition: width 0.5s ease;
}

.oee-fill.availability {
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.oee-fill.performance {
  background: linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%);
}

.oee-fill.quality {
  background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
}
</style>
