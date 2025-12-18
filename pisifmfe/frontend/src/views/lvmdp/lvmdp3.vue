<script setup lang="ts">
import ShiftCard from "@/components/shiftCard.vue";
import Gauge from "@/components/gaugeSimple.vue";
import ReportButton from "@/components/reportButton.vue";
import { useLvmdpLive } from "@/composables/useLvmdpLive";
import { useShiftAverages } from "@/composables/useShiftAverage";
import { computed } from "vue";

// Today's shift data
const { s1, s2, s3 } = useShiftAverages(3);

// Yesterday's shift data for comparison
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split("T")[0];
const {
  s1: s1Yesterday,
  s2: s2Yesterday,
  s3: s3Yesterday,
} = useShiftAverages(3, yesterdayStr);

// Live data with kVA and kVAR
const { isConnected, power, apparentPower, cosPhi, voltage } = useLvmdpLive(3);

// Calculate kVAR from kVA and kW: kVAR = sqrt(kVA² - kW²)
const reactiveCalc = computed(() => {
  const kva = apparentPower.value ?? 0;
  const kw = power.value ?? 0;
  if (kva === 0 || kw === 0) return 0;
  const kvar = Math.sqrt(Math.max(0, kva * kva - kw * kw));
  return kvar;
});

// Get color class based on load percentage
function getLoadClass(loadRatio: number): string {
  const percentage = loadRatio * 100;
  if (percentage >= 90) return "load-critical";
  if (percentage >= 75) return "load-high";
  if (percentage >= 50) return "load-medium";
  return "load-normal";
}
</script>

<template>
  <div class="lvmdp-wrapper">
    <div class="lvmdp-container">
      <!-- Header Section -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-left">
            <div class="icon-circle">
              <span class="icon-text">⚡</span>
            </div>
            <div class="header-text">
              <h1 class="page-title">LVMDP 3</h1>
              <p class="page-subtitle">Low Voltage Main Distribution Panel</p>
            </div>
          </div>
          <div class="header-actions">
            <!-- Connection Indicator -->
            <div class="connection-status" :class="{ connected: isConnected }">
              <div class="status-dot"></div>
              <span class="status-text">{{
                isConnected ? "LIVE" : "OFFLINE"
              }}</span>
            </div>
            <ReportButton :panelId="3" />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-wrapper">
        <!-- Shift Performance Section -->
        <section class="dashboard-section">
          <div class="section-header">
            <div class="section-title-wrapper">
              <h2 class="section-title">Shift Performance</h2>
              <p class="section-subtitle">
                Daily energy consumption comparison
              </p>
            </div>
          </div>

          <div class="shift-grid">
            <!-- Shift 1 -->
            <div class="shift-card">
              <div class="shift-header">
                <div class="shift-badge">1</div>
                <div class="shift-details">
                  <h3>Morning Shift</h3>
                  <span>07:01 - 14:30</span>
                </div>
              </div>

              <div class="shift-body">
                <div class="metric-group">
                  <span class="metric-label">Today</span>
                  <div class="metric-values">
                    <span class="value-primary"
                      >{{ s1.avgPower.toFixed(1) }} <small>kW</small></span
                    >
                    <span class="value-secondary"
                      >{{ s1.avgCurrent.toFixed(1) }} A</span
                    >
                  </div>
                </div>

                <div class="metric-divider"></div>

                <div class="metric-group">
                  <span class="metric-label">Yesterday</span>
                  <div class="metric-values">
                    <span class="value-primary muted"
                      >{{ s1Yesterday.avgPower.toFixed(1) }}
                      <small>kW</small></span
                    >
                    <span class="value-secondary muted"
                      >{{ s1Yesterday.avgCurrent.toFixed(1) }} A</span
                    >
                  </div>
                </div>
              </div>

              <!-- Current Load Section -->
              <div class="current-section">
                <div class="current-header">
                  <span class="section-title">Current Load</span>
                  <span class="load-value"
                    >{{ ((s1.avgCurrent / 2500) * 100).toFixed(1) }}%</span
                  >
                </div>

                <div class="load-bar-container">
                  <div
                    class="load-bar"
                    :style="{
                      width: `${Math.min((s1.avgCurrent / 2500) * 100, 100)}%`,
                    }"
                    :class="getLoadClass(s1.avgCurrent / 2500)"
                  ></div>
                </div>

                <div class="current-details">
                  <div class="current-stat">
                    <span class="stat-label">Average</span>
                    <span class="stat-value"
                      >{{ s1.avgCurrent.toFixed(1) }} A</span
                    >
                  </div>
                  <div class="current-stat">
                    <span class="stat-label">Min</span>
                    <span class="stat-value"
                      >{{ s1.minCurrent.toFixed(1) }} A</span
                    >
                  </div>
                  <div class="current-stat">
                    <span class="stat-label">Max</span>
                    <span class="stat-value"
                      >{{ s1.maxCurrent.toFixed(1) }} A</span
                    >
                  </div>
                  <div class="current-stat">
                    <span class="stat-label">Capacity</span>
                    <span class="stat-value">2500 A</span>
                  </div>
                </div>
              </div>

              <div class="shift-footer">
                <div
                  class="trend-indicator"
                  :class="s1.avgPower >= s1Yesterday.avgPower ? 'up' : 'down'"
                >
                  <span class="trend-icon">{{
                    s1.avgPower >= s1Yesterday.avgPower ? "▲" : "▼"
                  }}</span>
                  <span class="trend-diff"
                    >{{
                      Math.abs(s1.avgPower - s1Yesterday.avgPower).toFixed(1)
                    }}
                    kW</span>
                  <span class="trend-percent">
                    ({{
                      (
                        (Math.abs(s1.avgPower - s1Yesterday.avgPower) /
                          (s1Yesterday.avgPower || 1)) *
                        100
                      ).toFixed(1)
                    }}%)
                  </span>
                </div>
              </div> <!-- close shift-footer -->
            </div> <!-- close shift-card -->
          </div> <!-- close shift-grid -->
        </section> <!-- close dashboard-section -->
      </div> <!-- close content-wrapper -->
    </div> <!-- close lvmdp-container -->
  </div> <!-- close lvmdp-wrapper -->
</template>

<style>
/* Content Area */
.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}

.dashboard-section {
  margin-bottom: 2rem;
}

.section-header {
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 750;
  color: #f1f5f9;
  margin: 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  color: #94a3b8;
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
}

/* Shift Cards */
.shift-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.shift-card {
  background: #1e293b;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid #334155;
  transition: transform 0.2s, box-shadow 0.2s;
}

.shift-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}

.shift-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.shift-badge {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.shift-details h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #f1f5f9;
}

.shift-details span {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
}

.shift-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metric-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-values {
  text-align: right;
}

.value-primary {
  display: block;
  font-size: 1.65rem;
  font-weight: 700;
  color: #e2e8f0;
  line-height: 0.5;
}

.value-primary small {
  font-size: 0.875rem;
  font-weight: 500;
  color: #94a3b8;
}

.value-secondary {
  display: block;
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
  font-weight: 500;
}

.value-primary.muted,
.value-secondary.muted {
  opacity: 0.7;
}

.metric-divider {
  height: 1px;
  background-color: #f1f5f9;
}

.shift-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: #f8fafc;
}

.trend-indicator.up {
  background-color: #ecfdf5;
  color: #059669;
}

.trend-indicator.down {
  background-color: #fef2f2;
  color: #dc2626;
}

.trend-icon {
  font-size: 0.75rem;
}

/* Gauges Grid */
.gauges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.gauge-card {
  background: #1e293b;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border: 1px solid #334155;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
  transition: transform 0.2s;
}

.gauge-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header-section {
    padding: 1rem;
  }

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

  .shift-grid {
    grid-template-columns: 1fr;
  }

  .gauges-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

/* Current Load Section */
.current-section {
  background: #1e293b;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #334155;
  margin-top: 16px;
}

.current-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.load-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #60a5fa;
}

.load-bar-container {
  height: 12px;
  background: #0f172a;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
  border: 1px solid #334155;
}

.load-bar {
  height: 100%;
  border-radius: 6px;
  transition: width 0.6s ease, background-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.load-bar::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.load-bar.load-normal {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.load-bar.load-medium {
  background: linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%);
}

.load-bar.load-high {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

.load-bar.load-critical {
  background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
}

.current-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.current-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e2e8f0;
}
</style>
