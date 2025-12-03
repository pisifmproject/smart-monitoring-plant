<!-- frontend\src\views\lvmdp1.vue -->
<script setup lang="ts">
import ShiftCard from "@/components/shiftCard.vue";
import Gauge from "@/components/gaugeSimple.vue";
import ReportButton from "@/components/reportButton.vue";
import { useLvmdpLive } from "@/composables/useLvmdpLive";
import { useShiftAverages } from "@/composables/useShiftAverage";
import { computed } from "vue";

// Today's shift data
const { s1, s2, s3 } = useShiftAverages(4);

// Yesterday's shift data for comparison
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split("T")[0];
const {
  s1: s1Yesterday,
  s2: s2Yesterday,
  s3: s3Yesterday,
} = useShiftAverages(4, yesterdayStr);

// Live data with kVA and kVAR and RST
const {
  isConnected,
  power,
  apparentPower,
  reactivePower,
  freq,
  cosPhi,
  voltage,
  currentR,
  currentS,
  currentT,
  voltageRS,
  voltageST,
  voltageTR,
} = useLvmdpLive(4);

// Calculate kVAR from kVA and kW: kVAR = sqrt(kVA� - kW�)
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
            <div class="icon-circle">⚡</div>
            <div>
              <h1 class="page-title">LVMDP 4</h1>
              <p class="page-subtitle">Low Voltage Main Distribution Panel</p>
            </div>
          </div>
          <div class="header-actions">
            <!-- Connection Indicator -->
            <div class="connection-indicator">
              <div
                :class="[
                  'indicator-light',
                  isConnected ? 'connected' : 'disconnected',
                ]"
                :title="isConnected ? 'Connected' : 'Disconnected'"
              />
            </div>
            <ReportButton :panelId="4" />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="content-wrapper">
        <!-- Shift Performance Section -->
        <div class="performance-section">
          <div class="section-header">
            <div class="section-icon">📊</div>
            <div>
              <h2 class="section-title">Shift Performance</h2>
              <p class="section-subtitle">Comparison performance</p>
            </div>
          </div>

          <div class="shift-grid">
            <!-- Shift 1 -->
            <div class="shift-card-modern">
              <div class="shift-card-header">
                <div class="shift-number">1</div>
                <div class="shift-info">
                  <h3 class="shift-name">SHIFT 1</h3>
                  <span class="shift-hours">07:01 - 14:30</span>
                </div>
              </div>

              <div class="shift-metrics">
                <div class="shift-metric-item today">
                  <span class="metric-period">Today</span>
                  <div class="metric-value-row">
                    <span class="metric-number">{{
                      s1.avgPower.toFixed(1)
                    }}</span>
                    <span class="metric-unit">kW</span>
                  </div>
                  <div class="metric-value-row secondary">
                    <span class="metric-number">{{
                      s1.avgCurrent.toFixed(1)
                    }}</span>
                    <span class="metric-unit">A</span>
                  </div>
                </div>
                <div class="shift-metric-item yesterday">
                  <span class="metric-period">Yesterday</span>
                  <div class="metric-value-row">
                    <span class="metric-number">{{
                      s1Yesterday.avgPower.toFixed(1)
                    }}</span>
                    <span class="metric-unit">kW</span>
                  </div>
                  <div class="metric-value-row secondary">
                    <span class="metric-number">{{
                      s1Yesterday.avgCurrent.toFixed(1)
                    }}</span>
                    <span class="metric-unit">A</span>
                  </div>
                </div>
              </div>

              <div
                class="shift-trend"
                :class="
                  s1.avgPower >= s1Yesterday.avgPower
                    ? 'trend-up'
                    : 'trend-down'
                "
              >
                <svg class="trend-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    v-if="s1.avgPower >= s1Yesterday.avgPower"
                    d="M7 17L12 12L17 7M17 7H13M17 7V11"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    v-else
                    d="M7 7L12 12L17 17M17 17H13M17 17V13"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="trend-value"
                  >{{
                    Math.abs(s1.avgPower - s1Yesterday.avgPower).toFixed(1)
                  }}
                  kW</span
                >
                <span class="trend-percentage"
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

            <!-- Shift 2 -->
            <div class="shift-card-modern">
              <div class="shift-card-header">
                <div class="shift-number">2</div>
                <div class="shift-info">
                  <h3 class="shift-name">SHIFT 2</h3>
                  <span class="shift-hours">14:31 - 22:00</span>
                </div>
              </div>

              <div class="shift-metrics">
                <div class="shift-metric-item today">
                  <span class="metric-period">Today</span>
                  <div class="metric-value-row">
                    <span class="metric-number">{{
                      s2.avgPower.toFixed(1)
                    }}</span>
                    <span class="metric-unit">kW</span>
                  </div>
                  <div class="metric-value-row secondary">
                    <span class="metric-number">{{
                      s2.avgCurrent.toFixed(1)
                    }}</span>
                    <span class="metric-unit">A</span>
                  </div>
                </div>
                <div class="shift-metric-item yesterday">
                  <span class="metric-period">Yesterday</span>
                  <div class="metric-value-row">
                    <span class="metric-number">{{
                      s2Yesterday.avgPower.toFixed(1)
                    }}</span>
                    <span class="metric-unit">kW</span>
                  </div>
                  <div class="metric-value-row secondary">
                    <span class="metric-number">{{
                      s2Yesterday.avgCurrent.toFixed(1)
                    }}</span>
                    <span class="metric-unit">A</span>
                  </div>
                </div>
              </div>

              <div
                class="shift-trend"
                :class="
                  s2.avgPower >= s2Yesterday.avgPower
                    ? 'trend-up'
                    : 'trend-down'
                "
              >
                <svg class="trend-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    v-if="s2.avgPower >= s2Yesterday.avgPower"
                    d="M7 17L12 12L17 7M17 7H13M17 7V11"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    v-else
                    d="M7 7L12 12L17 17M17 17H13M17 17V13"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="trend-value"
                  >{{
                    Math.abs(s2.avgPower - s2Yesterday.avgPower).toFixed(1)
                  }}
                  kW</span
                >
                <span class="trend-percentage"
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

            <!-- Shift 3 -->
            <div class="shift-card-modern">
              <div class="shift-card-header">
                <div class="shift-number">3</div>
                <div class="shift-info">
                  <h3 class="shift-name">SHIFT 3</h3>
                  <span class="shift-hours">22:01 - 07:00</span>
                </div>
              </div>

              <div class="shift-metrics">
                <div class="shift-metric-item today">
                  <span class="metric-period">Today</span>
                  <div class="metric-value-row">
                    <span class="metric-number">{{
                      s3.avgPower.toFixed(1)
                    }}</span>
                    <span class="metric-unit">kW</span>
                  </div>
                  <div class="metric-value-row secondary">
                    <span class="metric-number">{{
                      s3.avgCurrent.toFixed(1)
                    }}</span>
                    <span class="metric-unit">A</span>
                  </div>
                </div>
                <div class="shift-metric-item yesterday">
                  <span class="metric-period">Yesterday</span>
                  <div class="metric-value-row">
                    <span class="metric-number">{{
                      s3Yesterday.avgPower.toFixed(1)
                    }}</span>
                    <span class="metric-unit">kW</span>
                  </div>
                  <div class="metric-value-row secondary">
                    <span class="metric-number">{{
                      s3Yesterday.avgCurrent.toFixed(1)
                    }}</span>
                    <span class="metric-unit">A</span>
                  </div>
                </div>
              </div>

              <div
                class="shift-trend"
                :class="
                  s3.avgPower >= s3Yesterday.avgPower
                    ? 'trend-up'
                    : 'trend-down'
                "
              >
                <svg class="trend-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    v-if="s3.avgPower >= s3Yesterday.avgPower"
                    d="M7 17L12 12L17 7M17 7H13M17 7V11"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    v-else
                    d="M7 7L12 12L17 17M17 17H13M17 17V13"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="trend-value"
                  >{{
                    Math.abs(s3.avgPower - s3Yesterday.avgPower).toFixed(1)
                  }}
                  kW</span
                >
                <span class="trend-percentage"
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

        <!-- Real-Time Metrics Section -->
        <div class="metrics-section">
          <div class="section-header">
            <div class="section-icon">⚡</div>
            <div>
              <h2 class="section-title">Real-Time Metrics</h2>
              <p class="section-subtitle">Live monitoring data</p>
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

          <!-- Frequency Display (Commented - not needed) -->
          <!-- <div class="frequency-display">
            <div class="frequency-card-simple">
              <div class="frequency-icon">?</div>
              <div class="frequency-info">
                <span class="frequency-label">Frequency</span>
                <span class="frequency-value"
                  >{{ (freq ?? 0).toFixed(2) }} Hz</span
                >
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* Main Wrapper - Fullscreen */
.lvmdp-wrapper {
  min-height: 100vh;
  height: 100vh;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  padding: 0;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.lvmdp-container {
  background: #f8fafc;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  padding: clamp(16px, 2vh, 24px) clamp(20px, 2.5vw, 40px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: clamp(12px, 1.5vw, 24px);
}

.icon-circle {
  width: clamp(50px, 4vw, 70px);
  height: clamp(50px, 4vw, 70px);
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(24px, 2vw, 36px);
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: clamp(1.5rem, 2.5vw, 2.5rem);
  font-weight: 800;
  color: white;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: clamp(0.875rem, 1.2vw, 1.125rem);
  color: rgba(255, 255, 255, 0.9);
  margin: 4px 0 0 0;
  font-weight: 500;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* Connection Indicator Light */
.connection-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.indicator-light {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
}

.indicator-light.connected {
  background: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2),
    0 0 20px rgba(16, 185, 129, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.3);
  animation: pulse-green 2s ease-in-out infinite;
}

.indicator-light.disconnected {
  background: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2), 0 0 20px rgba(239, 68, 68, 0.6),
    inset 0 0 8px rgba(255, 255, 255, 0.3);
  animation: pulse-red 2s ease-in-out infinite;
}

@keyframes pulse-green {
  0%,
  100% {
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2),
      0 0 20px rgba(16, 185, 129, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.1),
      0 0 30px rgba(16, 185, 129, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.5);
  }
}

@keyframes pulse-red {
  0%,
  100% {
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.2),
      0 0 20px rgba(239, 68, 68, 0.6), inset 0 0 8px rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.1),
      0 0 30px rgba(239, 68, 68, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.5);
  }
}

/* Content Wrapper */
.content-wrapper {
  padding: clamp(16px, 2vh, 28px) clamp(20px, 2.5vw, 40px);
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
}

/* Performance Section */
.performance-section {
  margin-bottom: 3vh;
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  gap: clamp(12px, 1.5vw, 20px);
  margin-bottom: 2vh;
}

.section-icon {
  font-size: clamp(1.25rem, 2vw, 2rem);
  width: clamp(45px, 3.5vw, 55px);
  height: clamp(45px, 3.5vw, 55px);
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.section-title {
  font-size: clamp(1.25rem, 2vw, 1.875rem);
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.3px;
}

.section-subtitle {
  font-size: clamp(0.875rem, 1.1vw, 1rem);
  color: #64748b;
  margin: 2px 0 0 0;
  font-weight: 500;
}

/* Shift Grid */
.shift-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(16px, 2vw, 28px);
  width: 100%;
}

/* Modern Shift Card */
.shift-card-modern {
  background: white;
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: clamp(24px, 3vw, 36px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 2.5vh, 28px);
  position: relative;
  overflow: hidden;
}

.shift-card-modern::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0ea5e9, #0284c7);
}

.shift-card-modern:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(14, 165, 233, 0.25);
  border-color: #0ea5e9;
}

.shift-card-header {
  display: flex;
  align-items: center;
  gap: clamp(16px, 2vw, 24px);
}

.shift-number {
  width: clamp(48px, 5vw, 64px);
  height: clamp(48px, 5vw, 64px);
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 800;
  color: white;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  flex-shrink: 0;
}

.shift-info {
  flex: 1;
}

.shift-name {
  font-size: clamp(1.25rem, 1.8vw, 1.75rem);
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: 0.3px;
}

.shift-hours {
  font-size: clamp(0.875rem, 1.1vw, 1rem);
  color: #64748b;
  font-weight: 600;
}

.shift-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(16px, 2vw, 24px);
}

.shift-metric-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: clamp(16px, 2vh, 20px);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.shift-metric-item.today {
  border-color: #0ea5e9;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.shift-metric-item.yesterday {
  border-color: #e2e8f0;
}

.metric-period {
  font-size: clamp(0.75rem, 0.9vw, 0.875rem);
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: block;
  margin-bottom: 12px;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.metric-value-row.secondary {
  margin-bottom: 0;
}

.metric-number {
  font-size: clamp(1.75rem, 2.5vw, 2.25rem);
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  letter-spacing: -0.5px;
}

.metric-value-row.secondary .metric-number {
  font-size: clamp(1.125rem, 1.5vw, 1.375rem);
  font-weight: 700;
  color: #64748b;
}

.metric-unit {
  font-size: clamp(0.875rem, 1.1vw, 1.125rem);
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.metric-value-row.secondary .metric-unit {
  font-size: clamp(0.75rem, 0.9vw, 0.875rem);
}

.shift-trend {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: clamp(14px, 2vh, 18px) clamp(18px, 2.5vw, 24px);
  border-radius: 14px;
  font-weight: 700;
  transition: all 0.3s ease;
}

.shift-trend.trend-up {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #15803d;
  border: 2px solid #86efac;
}

.shift-trend.trend-down {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #b91c1c;
  border: 2px solid #fca5a5;
}

.trend-icon {
  width: clamp(24px, 3vw, 32px);
  height: clamp(24px, 3vw, 32px);
  flex-shrink: 0;
}

.trend-value {
  font-size: clamp(1rem, 1.3vw, 1.25rem);
  font-weight: 800;
}

.trend-percentage {
  font-size: clamp(0.875rem, 1.1vw, 1rem);
  opacity: 0.8;
}

/* Metrics Section */
.metrics-section {
  margin-bottom: 3vh;
}

/* Gauges Grid - 5 gauges in a row */
.gauges-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(16px, 2vw, 24px);
  width: 100%;
  margin-bottom: 2vh;
}

.gauge-card {
  background: white;
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-height: clamp(280px, 35vh, 400px);
  padding: clamp(20px, 2.5vw, 40px);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
  min-width: 0;
}

.gauge-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(14, 165, 233, 0.2);
  border-color: #0ea5e9;
}

/* Frequency Display - Compact */
.frequency-display {
  width: 100%;
  margin-bottom: 3vh;
}

.frequency-card-simple {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  border-radius: 16px;
  border: 2px solid #0284c7;
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
  padding: clamp(16px, 2vh, 24px) clamp(24px, 3vw, 48px);
  display: flex;
  align-items: center;
  gap: clamp(16px, 2vw, 32px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.frequency-card-simple:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.4);
}

.frequency-icon {
  font-size: clamp(2rem, 3vw, 3rem);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
}

.frequency-info {
  display: flex;
  align-items: baseline;
  gap: clamp(12px, 1.5vw, 20px);
}

.frequency-label {
  font-size: clamp(1rem, 1.2vw, 1.25rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.frequency-value {
  font-size: clamp(1.75rem, 2.5vw, 2.5rem);
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
}

/* RST Section */
.rst-section {
  margin-bottom: 3vh;
}

.rst-row {
  margin-bottom: 2.5vh;
}

.rst-row-title {
  font-size: clamp(1.125rem, 1.5vw, 1.5rem);
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1.5vh 0;
  padding-left: 4px;
}

.rst-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(16px, 2vw, 28px);
}

.rst-card {
  background: white;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: clamp(20px, 2.5vw, 32px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.rst-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.rst-card.phase-r {
  border-left: 4px solid #ef4444;
}

.rst-card.phase-r:hover {
  border-color: #dc2626;
  box-shadow: 0 12px 32px rgba(239, 68, 68, 0.2);
}

.rst-card.phase-s {
  border-left: 4px solid #eab308;
}

.rst-card.phase-s:hover {
  border-color: #ca8a04;
  box-shadow: 0 12px 32px rgba(234, 179, 8, 0.2);
}

.rst-card.phase-t {
  border-left: 4px solid #3b82f6;
}

.rst-card.phase-t:hover {
  border-color: #2563eb;
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.2);
}

.rst-card.voltage-rs {
  border-left: 4px solid #8b5cf6;
}

.rst-card.voltage-rs:hover {
  border-color: #7c3aed;
  box-shadow: 0 12px 32px rgba(139, 92, 246, 0.2);
}

.rst-card.voltage-st {
  border-left: 4px solid #ec4899;
}

.rst-card.voltage-st:hover {
  border-color: #db2777;
  box-shadow: 0 12px 32px rgba(236, 72, 153, 0.2);
}

.rst-card.voltage-tr {
  border-left: 4px solid #14b8a6;
}

.rst-card.voltage-tr:hover {
  border-color: #0d9488;
  box-shadow: 0 12px 32px rgba(20, 184, 166, 0.2);
}

.rst-card-header {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 8px;
  border-bottom: 2px solid #f1f5f9;
}

.rst-phase-label {
  font-size: clamp(0.875rem, 1.1vw, 1.125rem);
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rst-card-value {
  font-size: clamp(2rem, 3vw, 3rem);
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.rst-card-unit {
  font-size: clamp(1rem, 1.3vw, 1.25rem);
  font-weight: 600;
  color: #64748b;
}

/* Large Desktop */
@media (min-width: 1920px) {
  .gauges-grid {
    gap: 3vw;
  }

  .gauge-card {
    min-height: 38vh;
  }
}

/* Tablet */
@media (max-width: 1280px) {
  .shift-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .gauges-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .rst-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Tablet Portrait */
@media (max-width: 1024px) {
  .shift-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .gauges-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .gauge-card {
    min-height: clamp(260px, 32vh, 350px);
  }

  .rst-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile Landscape */
@media (max-width: 768px) {
  .shift-grid {
    grid-template-columns: 1fr;
    gap: 2vh;
  }

  .gauges-grid {
    grid-template-columns: 1fr;
    gap: 2vh;
  }

  .gauge-card {
    min-height: clamp(240px, 30vh, 300px);
  }

  .rst-cards {
    grid-template-columns: 1fr;
    gap: 2vh;
  }

  .header-content {
    gap: 12px;
  }

  .comparison-row {
    flex-direction: column;
    gap: 12px;
  }

  .vs-divider {
    width: 100%;
    text-align: center;
  }
}

/* Mobile Portrait */
@media (max-width: 480px) {
  .lvmdp-wrapper {
    height: auto;
    min-height: 100vh;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .gauge-card {
    min-height: clamp(220px, 28vh, 280px);
  }

  .shift-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .frequency-info {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}

/* Landscape orientation optimization */
@media (max-height: 600px) and (orientation: landscape) {
  .content-wrapper {
    padding: 1vh 3vw;
  }

  .performance-section,
  .metrics-section {
    margin-bottom: 1.5vh;
  }

  .gauge-card {
    min-height: 40vh;
  }
}
</style>
