<script setup lang="ts">
import ShiftCard from "@/components/shiftCard.vue";
import Gauge from "@/components/gaugeSimple.vue";
import ReportButton from "@/components/reportButton.vue";
import { useLvmdpLive } from "@/composables/useLvmdpLive";
import { useShiftAverages } from "@/composables/useShiftAverage";
import { computed, ref, onMounted, onUnmounted } from "vue";

// Today's shift data
const { s1, s2, s3 } = useShiftAverages(2);

// Yesterday's shift data for comparison
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split("T")[0];
const {
  s1: s1Yesterday,
  s2: s2Yesterday,
  s3: s3Yesterday,
} = useShiftAverages(2, yesterdayStr);

// Live data with kVA and kVAR
const { isConnected, power, apparentPower, cosPhi, voltage, avgCurrent } =
  useLvmdpLive(2);

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

// Shift status logic
const currentTime = ref(new Date());
let timeInterval: number | null = null;

onMounted(() => {
  timeInterval = window.setInterval(() => {
    currentTime.value = new Date();
  }, 60000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});

type ShiftStatus = "completed" | "active" | "upcoming";

function getShiftStatus(shiftNumber: 1 | 2 | 3): ShiftStatus {
  const now = currentTime.value;
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const shift1Start = 7 * 60 + 1;
  const shift1End = 14 * 60 + 30;
  const shift2Start = 14 * 60 + 31;
  const shift2End = 22 * 60;
  const shift3Start = 22 * 60 + 1;
  const shift3End = 7 * 60;

  if (shiftNumber === 1) {
    if (totalMinutes >= shift1Start && totalMinutes <= shift1End) {
      return "active";
    } else if (totalMinutes < shift1Start) {
      return "upcoming";
    } else {
      return "completed";
    }
  } else if (shiftNumber === 2) {
    if (totalMinutes >= shift2Start && totalMinutes <= shift2End) {
      return "active";
    } else if (totalMinutes < shift2Start) {
      return "upcoming";
    } else {
      return "completed";
    }
  } else {
    // Shift 3 crosses midnight (22:01 - 07:00)
    if (totalMinutes >= shift3Start || totalMinutes <= shift3End) {
      return "active";
    } else if (totalMinutes > shift3End && totalMinutes < shift3Start) {
      return "upcoming";
    } else {
      return "upcoming"; // This shouldn't happen, but default to upcoming
    }
  }
}

const shift1Status = computed(() => getShiftStatus(1));
const shift2Status = computed(() => getShiftStatus(2));
const shift3Status = computed(() => getShiftStatus(3));

function getStatusLabel(status: ShiftStatus): string {
  const labels = {
    completed: "Completed",
    active: "Active",
    upcoming: "Upcoming",
  };
  return labels[status];
}

function getStatusClass(status: ShiftStatus): string {
  return `status-${status}`;
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
              <h1 class="page-title">LVMDP 2</h1>
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
            <ReportButton :panelId="2" />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-wrapper">
        <!-- Real-Time Metrics Section -->
        <section class="dashboard-section">
          <div class="section-header">
            <div class="section-title-wrapper">
              <h2 class="section-title">Real-Time Monitoring</h2>
              <p class="section-subtitle">Live electrical parameters</p>
            </div>
          </div>

          <div class="gauges-grid">
            <!-- Current -->
            <div class="gauge-card">
              <Gauge
                title="Current"
                :value="avgCurrent ?? 0"
                :min="0"
                :max="2500"
                unit="A"
                subtitle="of 2500 A"
              />
            </div>

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
                :max="5440"
                unit="kVA"
                subtitle="of 5440 kVA"
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

        <!-- Shift Performance Section -->
        <section class="dashboard-section">
          <div class="section-header">
            <div class="section-title-wrapper">
              <h2 class="section-title">Shift Performance</h2>
              <p class="section-subtitle">
                Daily electrical consumption comparison
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
                <div class="shift-status" :class="getStatusClass(shift1Status)">
                  {{ getStatusLabel(shift1Status) }}
                </div>
              </div>

              <div class="shift-body">
                <div class="metrics-row">
                  <div class="metric-column">
                    <span class="metric-label">Today</span>
                    <div class="metric-primary">
                      <span class="value-large">{{
                        s1.avgPower.toFixed(1)
                      }}</span>
                      <span class="unit">kW</span>
                    </div>
                    <div class="metric-secondary">
                      <span class="value"
                        >{{ s1.avgCurrent.toFixed(1) }} A</span
                      >
                      <span class="comparison"
                        >({{ ((s1.avgCurrent / 2500) * 100).toFixed(1) }}% of
                        2500 A)</span
                      >
                    </div>
                  </div>

                  <div class="metric-divider-vertical"></div>

                  <div class="metric-column">
                    <span class="metric-label">Yesterday</span>
                    <div class="metric-primary muted">
                      <span class="value-large">{{
                        s1Yesterday.avgPower.toFixed(1)
                      }}</span>
                      <span class="unit">kW</span>
                    </div>
                    <div class="metric-secondary muted">
                      <span class="value"
                        >{{ s1Yesterday.avgCurrent.toFixed(1) }} A</span
                      >
                      <span class="comparison"
                        >({{
                          ((s1Yesterday.avgCurrent / 2500) * 100).toFixed(1)
                        }}% of 2500 A)</span
                      >
                    </div>
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
                <div class="shift-status" :class="getStatusClass(shift2Status)">
                  {{ getStatusLabel(shift2Status) }}
                </div>
              </div>

              <div class="shift-body">
                <div class="metrics-row">
                  <div class="metric-column">
                    <span class="metric-label">Today</span>
                    <div class="metric-primary">
                      <span class="value-large">{{
                        s2.avgPower.toFixed(1)
                      }}</span>
                      <span class="unit">kW</span>
                    </div>
                    <div class="metric-secondary">
                      <span class="value"
                        >{{ s2.avgCurrent.toFixed(1) }} A</span
                      >
                      <span class="comparison"
                        >({{ ((s2.avgCurrent / 2500) * 100).toFixed(1) }}% of
                        2500 A)</span
                      >
                    </div>
                  </div>

                  <div class="metric-divider-vertical"></div>

                  <div class="metric-column">
                    <span class="metric-label">Yesterday</span>
                    <div class="metric-primary muted">
                      <span class="value-large">{{
                        s2Yesterday.avgPower.toFixed(1)
                      }}</span>
                      <span class="unit">kW</span>
                    </div>
                    <div class="metric-secondary muted">
                      <span class="value"
                        >{{ s2Yesterday.avgCurrent.toFixed(1) }} A</span
                      >
                      <span class="comparison"
                        >({{
                          ((s2Yesterday.avgCurrent / 2500) * 100).toFixed(1)
                        }}% of 2500 A)</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Current Load Section -->
              <div class="current-section">
                <div class="current-header">
                  <span class="section-title">Current Load</span>
                  <span class="load-value"
                    >{{ ((s2.avgCurrent / 2500) * 100).toFixed(1) }}%</span
                  >
                </div>

                <div class="load-bar-container">
                  <div
                    class="load-bar"
                    :style="{
                      width: `${Math.min((s2.avgCurrent / 2500) * 100, 100)}%`,
                    }"
                    :class="getLoadClass(s2.avgCurrent / 2500)"
                  ></div>
                </div>

                <div class="current-details">
                  <div class="current-stat">
                    <span class="stat-label">Average</span>
                    <span class="stat-value"
                      >{{ s2.avgCurrent.toFixed(1) }} A</span
                    >
                  </div>
                  <div class="current-stat">
                    <span class="stat-label">Min</span>
                    <span class="stat-value"
                      >{{ s2.minCurrent.toFixed(1) }} A</span
                    >
                  </div>
                  <div class="current-stat">
                    <span class="stat-label">Max</span>
                    <span class="stat-value"
                      >{{ s2.maxCurrent.toFixed(1) }} A</span
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
                <div class="shift-status" :class="getStatusClass(shift3Status)">
                  {{ getStatusLabel(shift3Status) }}
                </div>
              </div>

              <div class="shift-body">
                <div class="metrics-row">
                  <div class="metric-column">
                    <span class="metric-label">Today</span>
                    <div class="metric-primary">
                      <span class="value-large">{{
                        s3.avgPower.toFixed(1)
                      }}</span>
                      <span class="unit">kW</span>
                    </div>
                    <div class="metric-secondary">
                      <span class="value"
                        >{{ s3.avgCurrent.toFixed(1) }} A</span
                      >
                      <span class="comparison"
                        >({{ ((s3.avgCurrent / 2500) * 100).toFixed(1) }}% of
                        2500 A)</span
                      >
                    </div>
                  </div>

                  <div class="metric-divider-vertical"></div>

                  <div class="metric-column">
                    <span class="metric-label">Yesterday</span>
                    <div class="metric-primary muted">
                      <span class="value-large">{{
                        s3Yesterday.avgPower.toFixed(1)
                      }}</span>
                      <span class="unit">kW</span>
                    </div>
                    <div class="metric-secondary muted">
                      <span class="value"
                        >{{ s3Yesterday.avgCurrent.toFixed(1) }} A</span
                      >
                      <span class="comparison"
                        >({{
                          ((s3Yesterday.avgCurrent / 2500) * 100).toFixed(1)
                        }}% of 2500 A)</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Current Load Section -->
              <div class="current-section">
                <div class="current-header">
                  <span class="section-title">Current Load</span>
                  <span class="load-value"
                    >{{ ((s3.avgCurrent / 2500) * 100).toFixed(1) }}%</span
                  >
                </div>

                <div class="load-bar-container">
                  <div
                    class="load-bar"
                    :style="{
                      width: `${Math.min((s3.avgCurrent / 2500) * 100, 100)}%`,
                    }"
                    :class="getLoadClass(s3.avgCurrent / 2500)"
                  ></div>
                </div>

                <div class="current-details">
                  <div class="current-stat">
                    <span class="stat-label">Average</span>
                    <span class="stat-value"
                      >{{ s3.avgCurrent.toFixed(1) }} A</span
                    >
                  </div>
                  <div class="current-stat">
                    <span class="stat-label">Min</span>
                    <span class="stat-value"
                      >{{ s3.minCurrent.toFixed(1) }} A</span
                    >
                  </div>
                  <div class="current-stat">
                    <span class="stat-label">Max</span>
                    <span class="stat-value"
                      >{{ s3.maxCurrent.toFixed(1) }} A</span
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
  background-color: #0f172a;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  color: #e2e8f0;
}

.lvmdp-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Header Styling */
.header-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 1.5rem 2rem;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
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
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 1.5rem;
}

@media (min-width: 1400px) {
  .shift-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1399px) {
  .shift-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
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
  position: relative;
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

.shift-details {
  flex: 1;
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

/* Shift Status Indicator */
.shift-status {
  padding: 0.375rem 0.875rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.shift-status.status-completed {
  background-color: #334155;
  color: #94a3b8;
}

.shift-status.status-active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  animation: pulse-status 2s infinite;
  box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
}

.shift-status.status-upcoming {
  background-color: #fbbf24;
  color: #78350f;
}

@keyframes pulse-status {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

.shift-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.metrics-row {
  display: flex;
  align-items: stretch;
  gap: 1.5rem;
}

.metric-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metric-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-primary {
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
}

.metric-primary.muted {
  opacity: 0.7;
}

.value-large {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
}

.metric-primary .unit {
  font-size: 1rem;
  font-weight: 600;
  color: #64748b;
}

.metric-secondary {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-secondary.muted {
  opacity: 0.7;
}

.metric-secondary .value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
}

.metric-secondary .comparison {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
}

.metric-divider-vertical {
  width: 1px;
  background: linear-gradient(to bottom, transparent, #334155, transparent);
  flex-shrink: 0;
}

.metric-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.current-percent {
  font-size: 0.7rem;
  color: #475569;
  font-weight: 500;
  margin-left: 0.375rem;
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1rem;
}

@media (min-width: 1200px) {
  .gauges-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .gauges-grid {
    grid-template-columns: repeat(3, 1fr);
  }
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
  display: flex;
  justify-content: space-around;
  gap: 16px;
  padding: 0.5rem 0;
}

.current-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
}
</style>
