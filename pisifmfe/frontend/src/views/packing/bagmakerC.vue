<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ReportButton from "@/components/reportButton.vue";

const lineId = "LINE_C_BAGMAKER";
const loading = ref(false);
const hasData = ref(false);

const bagmakerData = ref({
  targetBags: 0,
  actualBags: 0,
  defectBags: 0,
  efficiency: 0,
  speedRpm: 0,
});

const shiftSummary = ref({
  shift1: { target: 0, actual: 0, defect: 0, efficiency: 0 },
  shift2: { target: 0, actual: 0, defect: 0, efficiency: 0 },
  shift3: { target: 0, actual: 0, defect: 0, efficiency: 0 },
});

// Status computed berdasarkan ada tidaknya data
const status = computed(() => (hasData.value ? "running" : "offline"));

// Function to fetch bagmaker data from backend
const fetchBagMakerData = async () => {
  loading.value = true;
  try {
    const response = await fetch(
      `http://localhost:2000/api/packing/bagmaker/${lineId}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.data) {
      hasData.value = true;
      bagmakerData.value = {
        targetBags: result.data.targetBags || 0,
        actualBags: result.data.actualBags || 0,
        defectBags: result.data.defectBags || 0,
        efficiency: result.data.efficiency || 0,
        speedRpm: result.data.speedRpm || 0,
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
              defect: shift.defect || 0,
              efficiency: shift.efficiency || 0,
            };
          }
        });
      }
    } else {
      hasData.value = false;
    }
  } catch (err) {
    console.error("Error fetching bagmaker data:", err);
    hasData.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBagMakerData();
  // Refresh every 30 seconds
  setInterval(fetchBagMakerData, 30000);
});
</script>

<template>
  <div class="bagmaker-wrapper">
    <div class="bagmaker-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <div>
            <h1 class="page-title">BagMaker</h1>
            <p class="page-subtitle">Packing Line C</p>
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
          routeName="dailyReportBagmakerC"
          label="Daily Report - BagMaker C"
        />
      </div>

      <!-- Main Metrics -->
      <div class="metrics-section">
        <div class="metric-card">
          <div class="metric-label">Target Bags</div>
          <div class="metric-value">{{ bagmakerData.targetBags }}</div>
          <div class="metric-unit">bags</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Actual Bags</div>
          <div class="metric-value">{{ bagmakerData.actualBags }}</div>
          <div class="metric-unit">bags</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Defect Bags</div>
          <div class="metric-value danger">{{ bagmakerData.defectBags }}</div>
          <div class="metric-unit">bags</div>
        </div>
        <div class="metric-card highlight">
          <div class="metric-label">Efficiency</div>
          <div class="metric-value">{{ bagmakerData.efficiency }}%</div>
          <div class="metric-unit">Performance</div>
        </div>
      </div>

      <!-- Speed Section -->
      <div class="speed-section">
        <h2 class="section-title">Machine Speed</h2>
        <div class="speed-display">
          <div class="speed-value">{{ bagmakerData.speedRpm }}</div>
          <div class="speed-unit">RPM</div>
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
                <span class="shift-label">Efficiency:</span>
                <span class="shift-value success">{{ data.efficiency }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Connection Status Note -->
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
.bagmaker-wrapper {
  width: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 24px 16px;
}

.bagmaker-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  animation: pulse 2s ease-in-out infinite;
}

.status-badge.offline {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
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
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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

/* Speed Section */
.speed-section {
  padding: 32px 24px;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  text-align: center;
}

.speed-display {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  border: 3px solid #8b5cf6;
}

.speed-value {
  font-size: 4rem;
  font-weight: 700;
  color: #7c3aed;
  line-height: 1;
}

.speed-unit {
  font-size: 1.5rem;
  font-weight: 600;
  color: #6d28d9;
  margin-top: 8px;
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
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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
  .bagmaker-wrapper {
    padding: 12px;
  }

  .header-section {
    padding: 20px 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .metrics-section,
  .speed-section,
  .shift-section {
    padding: 20px 16px;
  }

  .metric-value {
    font-size: 2rem;
  }

  .speed-value {
    font-size: 3rem;
  }
}
</style>
