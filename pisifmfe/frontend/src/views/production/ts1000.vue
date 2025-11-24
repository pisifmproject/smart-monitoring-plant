<script setup lang="ts">
import { ref, onMounted } from "vue";
import ReportButton from "@/components/reportButton.vue";

// Placeholder data - akan diganti dengan real API call nanti
const productionData = ref({
  lineId: "LINE_A_TS1000",
  status: "running",
  targetProduction: 1000,
  actualProduction: 850,
  defectCount: 12,
  oeePercentage: 92.5,
  availability: 95.0,
  performance: 97.5,
  quality: 98.8,
});

const shiftSummary = ref({
  shift1: { target: 1000, actual: 950, defect: 10, oee: 92.5 },
  shift2: { target: 1000, actual: 980, defect: 5, oee: 95.0 },
  shift3: { target: 1000, actual: 920, defect: 15, oee: 89.0 },
});

// Function to fetch production data (placeholder)
const fetchProductionData = async () => {
  // TODO: Implement API call
  console.log("Fetching production data...");
};

onMounted(() => {
  fetchProductionData();
});
</script>

<template>
  <div class="production-wrapper">
    <div class="production-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <div>
            <h1 class="page-title">Production Line</h1>
            <p class="page-subtitle">Line C - TS1000</p>
          </div>
          <div class="status-badge" :class="productionData.status">
            {{ productionData.status.toUpperCase() }}
          </div>
        </div>
      </div>

      <!-- Daily Report Button -->
      <div class="report-button-container">
        <ReportButton
          routeName="dailyReportTS1000"
          label="Daily Report - TS1000"
        />
      </div>

      <!-- Main Metrics -->
      <div class="metrics-section">
        <div class="metric-card">
          <div class="metric-label">Target Production</div>
          <div class="metric-value">{{ productionData.targetProduction }}</div>
          <div class="metric-unit">units</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Actual Production</div>
          <div class="metric-value">{{ productionData.actualProduction }}</div>
          <div class="metric-unit">units</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Defect Count</div>
          <div class="metric-value danger">
            {{ productionData.defectCount }}
          </div>
          <div class="metric-unit">units</div>
        </div>
        <div class="metric-card highlight">
          <div class="metric-label">OEE</div>
          <div class="metric-value">{{ productionData.oeePercentage }}%</div>
          <div class="metric-unit">Overall Equipment Effectiveness</div>
        </div>
      </div>

      <!-- OEE Breakdown -->
      <div class="oee-section">
        <h2 class="section-title">OEE Breakdown</h2>
        <div class="oee-grid">
          <div class="oee-card">
            <div class="oee-label">Availability</div>
            <div class="oee-value">{{ productionData.availability }}%</div>
          </div>
          <div class="oee-card">
            <div class="oee-label">Performance</div>
            <div class="oee-value">{{ productionData.performance }}%</div>
          </div>
          <div class="oee-card">
            <div class="oee-label">Quality</div>
            <div class="oee-value">{{ productionData.quality }}%</div>
          </div>
        </div>
      </div>

      <!-- Shift Summary -->
      <div class="shift-section">
        <h2 class="section-title">Shift Summary</h2>
        <div class="shift-grid">
          <div
            v-for="(data, shift) in shiftSummary"
            :key="shift"
            class="shift-card"
          >
            <div class="shift-header">{{ shift.toUpperCase() }}</div>
            <div class="shift-content">
              <div class="shift-item">
                <span class="shift-label">Target:</span>
                <span class="shift-value">{{ data.target }}</span>
              </div>
              <div class="shift-item">
                <span class="shift-label">Actual:</span>
                <span class="shift-value">{{ data.actual }}</span>
              </div>
              <div class="shift-item">
                <span class="shift-label">Defect:</span>
                <span class="shift-value danger">{{ data.defect }}</span>
              </div>
              <div class="shift-item">
                <span class="shift-label">OEE:</span>
                <span class="shift-value success">{{ data.oee }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Placeholder Note -->
      <div class="note-section">
        <p class="note-text">
          📝 <strong>Note:</strong> Data Dummy Belum connect ke API
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.production-wrapper {
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 24px 16px;
}

.production-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 32px 24px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
}

.status-badge {
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.status-badge.running {
  background: #10b981;
  color: white;
}

.status-badge.idle {
  background: #f59e0b;
  color: white;
}

.status-badge.down {
  background: #ef4444;
  color: white;
}

/* Metrics Section */
.metrics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 32px 24px;
  background: #f8fafc;
}

.metric-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.metric-card.highlight {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.metric-label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  margin-bottom: 12px;
}

.metric-card.highlight .metric-label {
  color: rgba(255, 255, 255, 0.9);
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.metric-card.highlight .metric-value {
  color: white;
}

.metric-value.danger {
  color: #ef4444;
}

.metric-unit {
  font-size: 0.8rem;
  color: #94a3b8;
}

.metric-card.highlight .metric-unit {
  color: rgba(255, 255, 255, 0.8);
}

/* OEE Section */
.oee-section,
.shift-section {
  padding: 32px 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
}

.oee-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.oee-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #0ea5e9;
}

.oee-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.oee-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0c4a6e;
}

/* Shift Section */
.shift-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.shift-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.shift-header {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 16px;
  font-weight: 700;
  text-align: center;
}

.shift-content {
  padding: 20px;
}

.shift-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.shift-item:last-child {
  border-bottom: none;
}

.shift-label {
  font-weight: 600;
  color: #64748b;
}

.shift-value {
  font-weight: 700;
  color: #1e293b;
}

.shift-value.danger {
  color: #ef4444;
}

.shift-value.success {
  color: #10b981;
}

/* Note Section */
.note-section {
  padding: 20px 24px;
  background: #fef3c7;
  border-top: 1px solid #fde68a;
}

.note-text {
  margin: 0;
  font-size: 0.9rem;
  color: #92400e;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .production-wrapper {
    padding: 12px;
  }

  .header-section {
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .metrics-section,
  .oee-section,
  .shift-section {
    padding: 20px 16px;
  }

  .metric-value {
    font-size: 2rem;
  }
}
/* Report Button */
.report-button-container {
  padding: 24px;
  margin: 20px 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
</style>
