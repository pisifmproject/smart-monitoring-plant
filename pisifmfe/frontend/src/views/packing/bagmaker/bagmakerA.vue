<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ReportButton from "@/components/reportButton.vue";

const lineId = "LINE_A_BAGMAKER";
const loading = ref(false);
const hasData = ref(false);

const bagmakerData = ref({
  targetBags: 0,
  actualBags: 0,
  goodBags: 0,
  notGoodBags: 0,
  totalEfficiency: 0,
  efficiencyWeigher: 0,
  efficiencyBagMaker: 0,
  metalDetect: 0,
  printerError: 0,
  productInSeal: 0,
  spliceDetect: 0,
  actualSpeed: 0,
  wastedFilmPercentage: 0,
});

const shiftSummary = ref({
  shift1: { target: 0, actual: 0, defect: 0, efficiency: 0 },
  shift2: { target: 0, actual: 0, defect: 0, efficiency: 0 },
  shift3: { target: 0, actual: 0, defect: 0, efficiency: 0 },
});

const status = computed(() => (hasData.value ? "running" : "offline"));

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
        goodBags: result.data.goodBags || 0,
        notGoodBags: result.data.notGoodBags || 0,
        totalEfficiency: result.data.totalEfficiency || 0,
        efficiencyWeigher: result.data.efficiencyWeigher || 0,
        efficiencyBagMaker: result.data.efficiencyBagMaker || 0,
        metalDetect: result.data.metalDetect || 0,
        printerError: result.data.printerError || 0,
        productInSeal: result.data.productInSeal || 0,
        spliceDetect: result.data.spliceDetect || 0,
        actualSpeed: result.data.actualSpeed || 0,
        wastedFilmPercentage: result.data.wastedFilmPercentage || 0,
      };

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
    // console.error("Error fetching bagmaker data:", err);
    hasData.value = false;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBagMakerData();
  setInterval(fetchBagMakerData, 30000);
});
</script>

<template>
  <div class="bagmaker-wrapper">
    <div class="bagmaker-container">
      <!-- Header with Gradient -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-left">
            <div class="icon-circle">📦</div>
            <div>
              <h1 class="page-title">BagMaker Production</h1>
              <p class="page-subtitle">Line A • Real-time Monitoring</p>
            </div>
          </div>
          <div class="status-badge" :class="status">
            <span class="status-dot"></span>
            {{ status.toUpperCase() }}
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- Report Button -->
        <div class="report-section">
          <ReportButton
            routeName="dailyReportBagmakerA"
            label="View Daily Report"
          />
        </div>

        <!-- Key Metrics Dashboard -->
        <div class="metrics-dashboard">
          <h2 class="section-heading">
            <span class="heading-icon">📈</span>
            Production Overview
          </h2>
          <div class="metrics-grid-2x2">
            <div class="metric-card-large primary">
              <div class="card-header">
                <div class="metric-icon-large">🎯</div>
                <div class="metric-label">Target Production</div>
              </div>
              <div class="card-body">
                <div class="metric-value-large">
                  {{ bagmakerData.targetBags.toLocaleString() }}
                </div>
                <div class="metric-unit-large">bags</div>
              </div>
            </div>

            <div class="metric-card-large success">
              <div class="card-header">
                <div class="metric-icon-large">✓</div>
                <div class="metric-label">Actual Production</div>
              </div>
              <div class="card-body">
                <div class="metric-value-large">
                  {{ bagmakerData.actualBags.toLocaleString() }}
                </div>
                <div class="metric-unit-large">bags produced</div>
              </div>
            </div>

            <div class="metric-card-large accent">
              <div class="card-header">
                <div class="metric-icon-large">⚡</div>
                <div class="metric-label">Total Efficiency</div>
              </div>
              <div class="card-body">
                <div class="metric-value-large">
                  {{ bagmakerData.totalEfficiency }}%
                </div>
                <div class="metric-progress-large">
                  <div
                    class="progress-fill-large"
                    :style="{ width: bagmakerData.totalEfficiency + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <div class="metric-card-large info">
              <div class="card-header">
                <div class="metric-icon-large">🚀</div>
                <div class="metric-label">Current Speed</div>
              </div>
              <div class="card-body">
                <div class="metric-value-large">
                  {{ bagmakerData.actualSpeed }}
                </div>
                <div class="metric-unit-large">bags per minute</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Efficiency Analysis -->
        <div class="efficiency-dashboard">
          <h2 class="section-heading">
            <span class="heading-icon">⚙️</span>
            Efficiency Analysis
          </h2>
          <div class="efficiency-cards">
            <div class="efficiency-item">
              <div class="efficiency-label">
                <span class="label-icon">⚖️</span>
                <span>Weigher Efficiency</span>
              </div>
              <div class="efficiency-display">
                <div class="efficiency-number">
                  {{ bagmakerData.efficiencyWeigher }}%
                </div>
                <div class="efficiency-bar-container">
                  <div
                    class="efficiency-bar weigher-bar"
                    :style="{ width: bagmakerData.efficiencyWeigher + '%' }"
                  >
                    <span class="bar-label"
                      >{{ bagmakerData.efficiencyWeigher }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="efficiency-item">
              <div class="efficiency-label">
                <span class="label-icon">📦</span>
                <span>BagMaker Efficiency</span>
              </div>
              <div class="efficiency-display">
                <div class="efficiency-number">
                  {{ bagmakerData.efficiencyBagMaker }}%
                </div>
                <div class="efficiency-bar-container">
                  <div
                    class="efficiency-bar bagmaker-bar"
                    :style="{ width: bagmakerData.efficiencyBagMaker + '%' }"
                  >
                    <span class="bar-label"
                      >{{ bagmakerData.efficiencyBagMaker }}%</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quality Control Panel -->
        <div class="quality-dashboard">
          <h2 class="section-heading">
            <span class="heading-icon">🎯</span>
            Quality Control & Detection
          </h2>

          <!-- Good vs Bad Bags -->
          <div class="quality-summary">
            <div class="quality-stat good-stat">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">
                  {{ bagmakerData.goodBags.toLocaleString() }}
                </div>
                <div class="stat-label">Good Bags</div>
                <div class="stat-percentage success">
                  {{
                    bagmakerData.goodBags + bagmakerData.notGoodBags > 0
                      ? (
                          (bagmakerData.goodBags /
                            (bagmakerData.goodBags +
                              bagmakerData.notGoodBags)) *
                          100
                        ).toFixed(1)
                      : 0
                  }}%
                </div>
              </div>
            </div>

            <div class="quality-stat bad-stat">
              <div class="stat-icon">❌</div>
              <div class="stat-content">
                <div class="stat-value">
                  {{ bagmakerData.notGoodBags.toLocaleString() }}
                </div>
                <div class="stat-label">Rejected Bags</div>
                <div class="stat-percentage danger">
                  {{
                    bagmakerData.goodBags + bagmakerData.notGoodBags > 0
                      ? (
                          (bagmakerData.notGoodBags /
                            (bagmakerData.goodBags +
                              bagmakerData.notGoodBags)) *
                          100
                        ).toFixed(1)
                      : 0
                  }}%
                </div>
              </div>
            </div>
          </div>

          <!-- Detection Systems -->
          <div class="detection-grid">
            <div class="detection-card">
              <div class="detection-icon">🔍</div>
              <div class="detection-label">Metal Detector</div>
              <div class="detection-value">{{ bagmakerData.metalDetect }}</div>
              <div class="detection-status">detections</div>
            </div>

            <div class="detection-card">
              <div class="detection-icon">🖨️</div>
              <div class="detection-label">Printer Errors</div>
              <div class="detection-value">{{ bagmakerData.printerError }}</div>
              <div class="detection-status">errors</div>
            </div>

            <div class="detection-card">
              <div class="detection-icon">🔒</div>
              <div class="detection-label">Seal Issues</div>
              <div class="detection-value">
                {{ bagmakerData.productInSeal }}
              </div>
              <div class="detection-status">incidents</div>
            </div>

            <div class="detection-card">
              <div class="detection-icon">🔗</div>
              <div class="detection-label">Splice Detected</div>
              <div class="detection-value">{{ bagmakerData.spliceDetect }}</div>
              <div class="detection-status">splices</div>
            </div>
          </div>
        </div>

        <!-- Waste Management -->
        <div class="waste-dashboard">
          <h2 class="section-heading">
            <span class="heading-icon">♻️</span>
            Waste Management
          </h2>
          <div class="waste-monitor">
            <div class="waste-header">
              <div class="waste-icon-large">🗑️</div>
              <div class="waste-info">
                <div class="waste-title">Film Waste Percentage</div>
                <div class="waste-percentage">
                  {{ bagmakerData.wastedFilmPercentage }}%
                </div>
              </div>
              <div
                class="waste-badge"
                :class="{
                  excellent: bagmakerData.wastedFilmPercentage < 2,
                  acceptable:
                    bagmakerData.wastedFilmPercentage >= 2 &&
                    bagmakerData.wastedFilmPercentage < 5,
                  high: bagmakerData.wastedFilmPercentage >= 5,
                }"
              >
                <span v-if="bagmakerData.wastedFilmPercentage < 2"
                  >✓ Excellent</span
                >
                <span v-else-if="bagmakerData.wastedFilmPercentage < 5"
                  >⚠ Acceptable</span
                >
                <span v-else>✕ High</span>
              </div>
            </div>
            <div class="waste-bar-wrapper">
              <div
                class="waste-bar-fill"
                :class="{
                  'fill-excellent': bagmakerData.wastedFilmPercentage < 2,
                  'fill-acceptable':
                    bagmakerData.wastedFilmPercentage >= 2 &&
                    bagmakerData.wastedFilmPercentage < 5,
                  'fill-high': bagmakerData.wastedFilmPercentage >= 5,
                }"
                :style="{
                  width:
                    Math.max(
                      Math.min(bagmakerData.wastedFilmPercentage, 100),
                      2
                    ) + '%',
                }"
              ></div>
              <div
                class="waste-marker"
                :class="{
                  'marker-excellent': bagmakerData.wastedFilmPercentage < 2,
                  'marker-acceptable':
                    bagmakerData.wastedFilmPercentage >= 2 &&
                    bagmakerData.wastedFilmPercentage < 5,
                  'marker-high': bagmakerData.wastedFilmPercentage >= 5,
                }"
                :style="{
                  left: Math.min(bagmakerData.wastedFilmPercentage, 100) + '%',
                }"
              >
                <span class="marker-value"
                  >{{ bagmakerData.wastedFilmPercentage.toFixed(1) }}%</span
                >
              </div>
            </div>
            <div class="waste-indicators">
              <span class="indicator excellent">0-2%</span>
              <span class="indicator acceptable">2-5%</span>
              <span class="indicator high">5%+</span>
            </div>
          </div>
        </div>

        <!-- Shift Performance -->
        <div class="shift-dashboard">
          <h2 class="section-heading">
            <span class="heading-icon">🕐</span>
            Shift Performance
          </h2>
          <div class="shift-cards">
            <div
              v-for="(data, shift, index) in shiftSummary"
              :key="shift"
              class="shift-item"
            >
              <div class="shift-badge">SHIFT {{ index + 1 }}</div>
              <div class="shift-metrics">
                <div class="shift-row">
                  <span class="shift-key">Target</span>
                  <span class="shift-val">{{
                    data.target.toLocaleString()
                  }}</span>
                </div>
                <div class="shift-row">
                  <span class="shift-key">Actual</span>
                  <span class="shift-val primary">{{
                    data.actual.toLocaleString()
                  }}</span>
                </div>
                <div class="shift-row">
                  <span class="shift-key">Defect</span>
                  <span class="shift-val danger">{{ data.defect }}</span>
                </div>
                <div class="shift-row">
                  <span class="shift-key">Efficiency</span>
                  <span class="shift-val success">{{ data.efficiency }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Connection Status -->
        <div class="status-footer">
          <div v-if="loading" class="status-message loading">
            <span class="spinner"></span>
            Loading data...
          </div>
          <div v-else-if="!hasData" class="status-message waiting">
            <span class="icon">📡</span>
            Waiting for data from API
          </div>
          <div v-else class="status-message connected">
            <span class="icon">✅</span>
            Connected to API • Auto-refresh: 30s
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.bagmaker-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

.bagmaker-container {
  max-width: 1600px;
  margin: 0 auto;
  background: #f8f9fc;
  width: 100%;
  overflow-x: hidden;
}

/* Header */
.header-section {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  padding: 32px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-circle {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 4px 0 0 0;
  font-weight: 500;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.status-badge.running {
  background: rgba(16, 185, 129, 0.95);
  color: white;
  animation: pulse-status 2s ease-in-out infinite;
}

.status-badge.offline {
  background: rgba(148, 163, 184, 0.95);
  color: white;
}

@keyframes pulse-status {
  0%,
  100% {
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.6);
  }
}

/* Content Wrapper */
.content-wrapper {
  padding: 32px 40px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* Report Section */
.report-section {
  margin-bottom: 32px;
}

/* Section Heading */
.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 3px solid #e2e8f0;
}

.heading-icon {
  font-size: 1.75rem;
}

/* Metrics Dashboard */
.metrics-dashboard {
  margin-bottom: 40px;
}

.metrics-grid-2x2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
}

.metric-card-large {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  box-sizing: border-box;
  min-width: 0;
  min-height: 120px;
  display: flex;
  flex-direction: column;
}

.metric-card-large:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}

.metric-card-large.primary {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
}

.metric-card-large.success {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.metric-card-large.accent {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.metric-card-large.info {
  border-color: #06b6d4;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.metric-icon-large {
  font-size: 2.125rem;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value-large {
  font-size: 2.125rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 5px;
}

.metric-unit-large {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 600;
}

.metric-progress-large {
  margin-top: 10px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill-large {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

/* Efficiency Dashboard */
.efficiency-dashboard {
  margin-bottom: 40px;
}

.efficiency-cards {
  display: grid;
  gap: 24px;
}

.efficiency-item {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.efficiency-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 16px;
}

.label-icon {
  font-size: 1.25rem;
}

.efficiency-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.efficiency-number {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1e293b;
  min-width: 110px;
}

.efficiency-bar-container {
  flex: 1;
  height: 32px;
  background: #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.efficiency-bar {
  height: 100%;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.weigher-bar {
  background: linear-gradient(90deg, #06b6d4 0%, #0891b2 100%);
}

.bagmaker-bar {
  background: linear-gradient(90deg, #8b5cf6 0%, #6d28d9 100%);
}

.bar-label {
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

/* Quality Dashboard */
.quality-dashboard {
  margin-bottom: 40px;
}

.quality-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
  width: 100%;
}

.quality-stat {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-left: 5px solid;
  box-sizing: border-box;
  min-width: 0;
}

.good-stat {
  border-left-color: #10b981;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.bad-stat {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, #ffffff 0%, #fef2f2 100%);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 6px;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
}

.stat-percentage {
  font-size: 1.0625rem;
  font-weight: 700;
}

.stat-percentage.success {
  color: #10b981;
}

.stat-percentage.danger {
  color: #ef4444;
}

/* Detection Grid */
.detection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
}

.detection-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
  min-width: 0;
  transition: all 0.3s ease;
  border: 2px solid #f1f5f9;
}

.detection-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #e2e8f0;
}

.detection-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.detection-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 10px;
}

.detection-value {
  font-size: 1.875rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
}

.detection-status {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Waste Dashboard */
.waste-dashboard {
  margin-bottom: 40px;
}

.waste-monitor {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.waste-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.waste-icon-large {
  font-size: 3rem;
  opacity: 0.9;
}

.waste-info {
  flex: 1;
  min-width: 180px;
}

.waste-title {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 6px;
}

.waste-percentage {
  font-size: 2.75rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.waste-badge {
  padding: 10px 20px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.8125rem;
  white-space: nowrap;
}

.waste-badge.excellent {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.waste-badge.acceptable {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.waste-badge.high {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.waste-bar-wrapper {
  height: 28px;
  background: linear-gradient(
    90deg,
    #10b981 0%,
    #10b981 2%,
    #f59e0b 2%,
    #f59e0b 5%,
    #ef4444 5%,
    #ef4444 100%
  );
  border-radius: 14px;
  overflow: visible;
  margin-bottom: 32px;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.waste-bar-fill {
  height: 100%;
  border-radius: 16px;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  opacity: 0.3;
}

.waste-bar-fill.fill-excellent {
  background: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
}

.waste-bar-fill.fill-acceptable {
  background: #f59e0b;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
}

.waste-bar-fill.fill-high {
  background: #ef4444;
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
}

.waste-marker {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.waste-marker::before {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.waste-marker.marker-excellent::before {
  background: #10b981;
  border: 2.5px solid white;
}

.waste-marker.marker-acceptable::before {
  background: #f59e0b;
  border: 2.5px solid white;
}

.waste-marker.marker-high::before {
  background: #ef4444;
  border: 2.5px solid white;
}

.marker-value {
  position: absolute;
  top: -32px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.marker-excellent .marker-value {
  background: #10b981;
  color: white;
}

.marker-acceptable .marker-value {
  background: #f59e0b;
  color: white;
}

.marker-high .marker-value {
  background: #ef4444;
  color: white;
}

.waste-indicators {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 600;
}

.indicator.excellent {
  color: #10b981;
}

.indicator.acceptable {
  color: #f59e0b;
}

.indicator.high {
  color: #ef4444;
}

/* Shift Dashboard */
.shift-dashboard {
  margin-bottom: 40px;
}

.shift-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.shift-item {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.shift-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.shift-badge {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  color: white;
  padding: 16px 24px;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.5px;
  text-align: center;
}

.shift-metrics {
  padding: 24px;
}

.shift-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.shift-row:last-child {
  border-bottom: none;
}

.shift-key {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #64748b;
}

.shift-val {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.shift-val.primary {
  color: #8b5cf6;
}

.shift-val.danger {
  color: #ef4444;
}

.shift-val.success {
  color: #10b981;
}

/* Status Footer */
.status-footer {
  margin-top: 40px;
  padding: 20px 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.status-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
}

.status-message.loading {
  color: #64748b;
}

.status-message.waiting {
  color: #f59e0b;
}

.status-message.connected {
  color: #10b981;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top-color: #64748b;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 24px 24px;
  }

  .header-section {
    padding: 24px 24px;
  }

  .metrics-grid-2x2 {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .metric-value-large {
    font-size: 3rem;
  }

  .metric-icon-large {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px 12px;
  }

  .header-section {
    padding: 20px 12px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .icon-circle {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .section-heading {
    font-size: 1.25rem;
  }

  .metrics-grid-2x2 {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .quality-summary {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .metric-card-large {
    padding: 16px;
    min-height: 110px;
  }

  .metric-value-large {
    font-size: 1.75rem;
  }

  .metric-icon-large {
    font-size: 1.75rem;
  }

  .efficiency-display {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .efficiency-number {
    min-width: auto;
  }

  .efficiency-bar-container {
    width: 100%;
    height: 28px;
  }

  .bar-label {
    font-size: 0.75rem;
    padding-right: 12px;
  }

  .waste-header {
    flex-direction: column;
    text-align: center;
  }

  .detection-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .detection-card {
    padding: 16px;
  }

  .quality-stat {
    padding: 20px;
  }

  .shift-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 12px 8px;
  }

  .header-section {
    padding: 16px 8px;
  }

  .metric-card-large {
    padding: 16px;
  }

  .detection-grid {
    grid-template-columns: 1fr;
  }

  .waste-monitor {
    padding: 20px;
  }

  .efficiency-item {
    padding: 16px;
  }
}
</style>
