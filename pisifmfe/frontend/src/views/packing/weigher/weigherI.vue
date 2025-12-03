<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ReportButton from "@/components/reportButton.vue";

const lineId = "LINE_I_WEIGHER";
const loading = ref(false);
const hasData = ref(false);

const weigherData = ref({
  targetPacks: 0,
  actualPacks: 0,
  rejectCount: 0,
  avgWeight: 0,
  minWeight: 0,
  maxWeight: 0,
  efficiency: 0,
});

const shiftSummary = ref({
  shift1: { target: 0, actual: 0, reject: 0, efficiency: 0 },
  shift2: { target: 0, actual: 0, reject: 0, efficiency: 0 },
  shift3: { target: 0, actual: 0, reject: 0, efficiency: 0 },
});

// Status computed berdasarkan ada tidaknya data
const status = computed(() => (hasData.value ? "running" : "offline"));

// Function to fetch weigher data from backend
const fetchWeigherData = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `http://localhost:2000/api/packing/weigher/${lineId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      hasData.value = true;
      weigherData.value = {
        targetPacks: result.data.targetPacks || 0,
        actualPacks: result.data.actualPacks || 0,
        rejectCount: result.data.rejectCount || 0,
        avgWeight: result.data.avgWeight || 0,
        minWeight: result.data.minWeight || 0,
        maxWeight: result.data.maxWeight || 0,
        efficiency: result.data.efficiency || 0,
      };

      // Jika ada data shift summary dari backend
      if (result.data.shifts) {
        result.data.shifts.forEach((shift: any) => {
          const shiftKey =
            `shift${shift.shiftNumber}` as keyof typeof shiftSummary.value;
          if (shiftSummary.value[shiftKey]) {
            shiftSummary.value[shiftKey] = {
              target: shift.target || 0,
              actual: shift.actual || 0,
              reject: shift.reject || 0,
              efficiency: shift.efficiency || 0,
            };
          }
        });
      }
    } else {
      hasData.value = false;
    }
  } catch (err) {
    // console.error("Error fetching weigher data:", err);
    hasData.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchWeigherData();
  // Refresh every 30 seconds
  setInterval(fetchWeigherData, 30000);
});
</script>

<template>
  <div class="weigher-wrapper">
    <div class="weigher-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <div>
            <h1 class="page-title">Weigher</h1>
            <p class="page-subtitle">Packing Line I</p>
          </div>
          <div class="header-actions">
            <div class="status-badge" :class="status">
              {{ status.toUpperCase() }}
            </div>
          </div>
        </div>
      </div>

      <!-- Daily Report Button -->
      <div class="report-button-container">
        <ReportButton
          routeName="dailyReportWeigherI"
          label="Daily Report - Weigher I"
        />
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

      <!-- Status Note -->
      <div class="note-section">
        <p class="note-text">
          <span v-if="loading">⏳ Loading data...</span>
          <span v-else-if="!hasData"
            >📝 <strong>Note:</strong> Waiting for data from API</span
          >
          <span v-else>✅ Connected to API</span>
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
  border-radius: 24px;
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.status-badge.running {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

.status-badge.offline {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  color: white;
}

.status-badge.idle {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.status-badge.down {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
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
