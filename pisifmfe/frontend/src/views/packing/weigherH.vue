<script setup lang="ts">
import { ref, onMounted } from "vue";
import ReportButton from "@/components/reportButton.vue";

// Placeholder data - akan diganti dengan real API call nanti
const weigherData = ref({
  lineId: "LINE_H_WEIGHER",
  status: "running",
  targetPacks: 5000,
  actualPacks: 4750,
  rejectCount: 45,
  avgWeight: 1.02,
  minWeight: 0.98,
  maxWeight: 1.05,
  efficiency: 95.0,
});

const shiftSummary = ref({
  shift1: { target: 5000, actual: 4800, reject: 50, efficiency: 96.0 },
  shift2: { target: 5000, actual: 4900, reject: 40, efficiency: 98.0 },
  shift3: { target: 5000, actual: 4700, reject: 60, efficiency: 94.0 },
});

// Function to fetch weigher data (placeholder)
const fetchWeigherData = async () => {
  // TODO: Implement API call
  console.log("Fetching weigher data...");
};

onMounted(() => {
  fetchWeigherData();
});
</script>

<template>
  <div class="weigher-wrapper">
    <div class="weigher-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <div>
            <h1 class="page-title"> Weigher</h1>
            <p class="page-subtitle">Packing Line H</p>
          </div>
          <div class="header-actions">
            <div class="status-badge" :class="weigherData.status">
              {{ weigherData.status.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Report Button -->
      <div class="report-button-container">
        <ReportButton routeName="dailyReportWeigherH" label="Daily Report - Weigher H" />
      </div>

      <!-- Main Metrics -->
      <div class="metrics-section">
        <div class="metric-card">
          <div class="metric-label">Target Packs</div>
          <div class="metric-value">{{ weigherData.targetPacks }}</div>
          <div class="metric-unit">packs</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Actual Packs</div>
          <div class="metric-value">{{ weigherData.actualPacks }}</div>
          <div class="metric-unit">packs</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Reject Count</div>
          <div class="metric-value danger">{{ weigherData.rejectCount }}</div>
          <div class="metric-unit">packs</div>
        </div>
        <div class="metric-card highlight">
          <div class="metric-label">Efficiency</div>
          <div class="metric-value">{{ weigherData.efficiency }}%</div>
          <div class="metric-unit">Performance</div>
        </div>
      </div>

      <!-- Weight Metrics -->
      <div class="weight-section">
        <h2 class="section-title">Weight Metrics</h2>
        <div class="weight-grid">
          <div class="weight-card">
            <div class="weight-label">Average Weight</div>
            <div class="weight-value">{{ weigherData.avgWeight }} kg</div>
          </div>
          <div class="weight-card">
            <div class="weight-label">Minimum Weight</div>
            <div class="weight-value">{{ weigherData.minWeight }} kg</div>
          </div>
          <div class="weight-card">
            <div class="weight-label">Maximum Weight</div>
            <div class="weight-value">{{ weigherData.maxWeight }} kg</div>
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
                <span class="shift-label">Reject:</span>
                <span class="shift-value danger">{{ data.reject }}</span>
              </div>
              <div class="shift-item">
                <span class="shift-label">Efficiency:</span>
                <span class="shift-value success">{{ data.efficiency }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Placeholder Note -->
      <div class="note-section">
        <p class="note-text">
          ðŸ“ <strong>Note:</strong> This is a template page. Connect to real API
          endpoints to display live weigher data.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weigher-wrapper {
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 24px 16px;
}

.weigher-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
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

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
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

/* Report Button */
.report-button-container { padding: 24px; margin: 20px 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }

/* Metrics Section */
.metrics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 32px 24px;
}

.metric-card {
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.metric-card.highlight {
  background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
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

/* Weight Section */
.weight-section {
  padding: 32px 24px;
  background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
}

.weight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.weight-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #06b6d4;
}

.weight-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0369a1;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.weight-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0c4a6e;
}

/* Shift Section */
.shift-section {
  padding: 32px 24px;
}

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
  background: linear-gradient(135deg, #06b6d4 0%, #0284c7 100%);
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
  .weigher-wrapper {
    padding: 12px;
  }

  .header-section {
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .metrics-section,
  .weight-section,
  .shift-section {
    padding: 20px 16px;
  }

  .metric-value {
    font-size: 2rem;
  }
}
</style>


