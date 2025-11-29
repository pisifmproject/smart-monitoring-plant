<!-- frontend\src\views\lvmdp1.vue -->
<script setup lang="ts">
import ShiftCard from "@/components/shiftCard.vue";
import Gauge from "@/components/gaugeSimple.vue";
import StatusBar from "@/components/statusBar.vue";
import ReportButton from "@/components/reportButton.vue";
import { useLvmdpLive } from "@/composables/useLvmdpLive";
import { useShiftAverages } from "@/composables/useShiftAverage";

const { s1, s2, s3 } = useShiftAverages(4);
const { isConnected, power, freq, cosPhi } = useLvmdpLive(4);
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
              <p class="section-subtitle">Today's shift metrics</p>
            </div>
          </div>

          <div class="shift-grid">
            <ShiftCard
              title="SHIFT 1"
              :kw="s1.avgPower"
              :iavg="s1.avgCurrent"
            />
            <ShiftCard
              title="SHIFT 2"
              :kw="s2.avgPower"
              :iavg="s2.avgCurrent"
            />
            <ShiftCard
              title="SHIFT 3"
              :kw="s3.avgPower"
              :iavg="s3.avgCurrent"
            />
          </div>

          <div class="status-wrapper">
            <StatusBar :connected="isConnected" />
          </div>
        </div>

        <!-- Real-Time Metrics Section -->
        <div class="metrics-section">
          <div class="section-header">
            <div class="section-icon">📈</div>
            <div>
              <h2 class="section-title">Real-Time Metrics</h2>
              <p class="section-subtitle">Live monitoring data</p>
            </div>
          </div>

          <div class="gauges-grid">
            <div class="gauge-card">
              <Gauge
                title="Active Power"
                :value="power ?? 0"
                :min="0"
                :max="2000"
                unit="kW"
              />
            </div>
            <div class="gauge-card">
              <Gauge
                title="Frequency"
                :value="freq ?? 0"
                :min="0"
                :max="60"
                unit="Hz"
              />
            </div>
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
  gap: 12px;
  align-items: center;
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
  margin-bottom: 2vh;
  width: 100%;
}

/* Status Wrapper */
.status-wrapper {
  margin-top: 2vh;
}

/* Metrics Section */
.metrics-section {
  margin-bottom: 3vh;
}

/* Gauges Grid */
.gauges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(16px, 2vw, 32px);
  width: 100%;
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

  .header-content {
    gap: 12px;
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
