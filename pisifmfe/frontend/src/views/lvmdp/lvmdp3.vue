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
                    kW</span
                  >
                  <span class="trend-percent"
                    >({{
                      (
                        (Math.abs(s1.avgPower - s1Yesterday.avgPower) /
                          (s1Yesterday.avgPower || 1)) *
                        100
                      ).toFixed(1)
                    }}%)</span
                  >
                </div>
              </div>
            </div>

            <!-- Shift 2 -->
            <div class="shift-card">
              <div class="shift-header">
                <div class="shift-badge">2</div>
                <div class="shift-details">
                  <h3>Afternoon Shift</h3>
                  <span>14:31 - 22:00</span>
                </div>
              </div>

              <div class="shift-body">
                <div class="metric-group">
                  <span class="metric-label">Today</span>
                  <div class="metric-values">
                    <span class="value-primary"
                      >{{ s2.avgPower.toFixed(1) }} <small>kW</small></span
                    >
                    <span class="value-secondary"
                      >{{ s2.avgCurrent.toFixed(1) }} A</span
                    >
                  </div>
                </div>

                <div class="metric-divider"></div>

                <div class="metric-group">
                  <span class="metric-label">Yesterday</span>
                  <div class="metric-values">
                    <span class="value-primary muted"
                      >{{ s2Yesterday.avgPower.toFixed(1) }}
                      <small>kW</small></span
                    >
                    <span class="value-secondary muted"
                      >{{ s2Yesterday.avgCurrent.toFixed(1) }} A</span
                    >
                  </div>
                </div>
              </div>

              <div class="shift-footer">
                <div
                  class="trend-indicator"
                  :class="s2.avgPower >= s2Yesterday.avgPower ? 'up' : 'down'"
                >
                  <span class="trend-icon">{{
                    s2.avgPower >= s2Yesterday.avgPower ? "▲" : "▼"
                  }}</span>
                  <span class="trend-diff"
                    >{{
                      Math.abs(s2.avgPower - s2Yesterday.avgPower).toFixed(1)
                    }}
                    kW</span
                  >
                  <span class="trend-percent"
                    >({{
                      (
                        (Math.abs(s2.avgPower - s2Yesterday.avgPower) /
                          (s2Yesterday.avgPower || 1)) *
                        100
                      ).toFixed(1)
                    }}%)</span
                  >
                </div>
              </div>
            </div>

            <!-- Shift 3 -->
            <div class="shift-card">
              <div class="shift-header">
                <div class="shift-badge">3</div>
                <div class="shift-details">
                  <h3>Night Shift</h3>
                  <span>22:01 - 07:00</span>
                </div>
              </div>

              <div class="shift-body">
                <div class="metric-group">
                  <span class="metric-label">Today</span>
                  <div class="metric-values">
                    <span class="value-primary"
                      >{{ s3.avgPower.toFixed(1) }} <small>kW</small></span
                    >
                    <span class="value-secondary"
                      >{{ s3.avgCurrent.toFixed(1) }} A</span
                    >
                  </div>
                </div>

                <div class="metric-divider"></div>

                <div class="metric-group">
                  <span class="metric-label">Yesterday</span>
                  <div class="metric-values">
                    <span class="value-primary muted"
                      >{{ s3Yesterday.avgPower.toFixed(1) }}
                      <small>kW</small></span
                    >
                    <span class="value-secondary muted"
                      >{{ s3Yesterday.avgCurrent.toFixed(1) }} A</span
                    >
                  </div>
                </div>
              </div>

              <div class="shift-footer">
                <div
                  class="trend-indicator"
                  :class="s3.avgPower >= s3Yesterday.avgPower ? 'up' : 'down'"
                >
                  <span class="trend-icon">{{
                    s3.avgPower >= s3Yesterday.avgPower ? "▲" : "▼"
                  }}</span>
                  <span class="trend-diff"
                    >{{
                      Math.abs(s3.avgPower - s3Yesterday.avgPower).toFixed(1)
                    }}
                    kW</span
                  >
                  <span class="trend-percent"
                    >({{
                      (
                        (Math.abs(s3.avgPower - s3Yesterday.avgPower) /
                          (s3Yesterday.avgPower || 1)) *
                        100
                      ).toFixed(1)
                    }}%)</span
                  >
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Real-Time Metrics Section -->
        <section class="dashboard-section">
          <div class="section-header">
            <div class="section-title-wrapper">
              <h2 class="section-title">Real-Time Monitoring</h2>
              <p class="section-subtitle">Live electrical parameters</p>
            </div>
          </div>

          <div class="gauges-grid">
            <!-- Active Power (kW) -->
            <div class="gauge-card">
              <Gauge
                title="Active Power"
                :value="power ?? 0"
                :min="0"
                :max="2000"
                unit="kW"
              />
            </div>

            <!-- Voltage Average -->
            <div class="gauge-card">
              <Gauge
                title="Voltage"
                :value="voltage ?? 0"
                :min="0"
                :max="500"
                unit="V"
              />
            </div>

            <!-- Apparent Power (kVA) -->
            <div class="gauge-card">
              <Gauge
                title="Apparent Power"
                :value="apparentPower ?? 0"
                :min="0"
                :max="2000"
                unit="kVA"
              />
            </div>

            <!-- Reactive Power (kVAR) -->
            <div class="gauge-card">
              <Gauge
                title="Reactive Power"
                :value="reactiveCalc"
                :min="0"
                :max="2000"
                unit="kVAR"
              />
            </div>

            <!-- Power Factor -->
            <div class="gauge-card">
              <Gauge
                title="Power Factor"
                :value="cosPhi ?? 0"
                :min="0"
                :max="1"
                unit=""
              />
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

.lvmdp-wrapper {
  min-height: 100vh;
  background-color: #f1f5f9;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: #1e293b;
}

.lvmdp-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Header Styling */
.header-section {
  background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%);
  padding: 1.5rem 2rem;
  color: white;
  box-shadow: 0 4px 20px rgba(2, 132, 199, 0.15);
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
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.icon-text {
  font-size: 1.75rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
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

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.status-dot {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background-color: #ef4444;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.3);
}

.connection-status.connected .status-dot {
  background-color: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

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
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
}

.section-subtitle {
  color: #64748b;
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
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.shift-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08),
    0 4px 6px -2px rgba(0, 0, 0, 0.04);
  border-color: #bae6fd;
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
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  box-shadow: 0 4px 6px rgba(14, 165, 233, 0.2);
}

.shift-details h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.shift-details span {
  font-size: 0.875rem;
  color: #64748b;
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
  color: #64748b;
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
  color: #0f172a;
  line-height: 0.5;
}

.value-primary small {
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
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
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 240px;
  transition: transform 0.2s;
}

.gauge-card:hover {
  transform: translateY(-4px);
  border-color: #bae6fd;
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
</style>
