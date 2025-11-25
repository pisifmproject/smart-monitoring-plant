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
            <ShiftCard title="SHIFT 1" :kw="s1.avgKwh" :iavg="s1.avgCurrent" />
            <ShiftCard title="SHIFT 2" :kw="s2.avgKwh" :iavg="s2.avgCurrent" />
            <ShiftCard title="SHIFT 3" :kw="s3.avgKwh" :iavg="s3.avgCurrent" />
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

/* Main Wrapper */
.lvmdp-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

.lvmdp-container {
  max-width: 1600px;
  margin: 0 auto;
  background: #f8fafc;
  width: 100%;
  overflow-x: hidden;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  padding: 28px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  box-sizing: border-box;
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
  gap: 16px;
}

.icon-circle {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 0.875rem;
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
  padding: 28px 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* Performance Section */
.performance-section {
  margin-bottom: 32px;
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.section-title {
  font-size: 1.375rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.3px;
}

.section-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  margin: 2px 0 0 0;
  font-weight: 500;
}

/* Shift Grid */
.shift-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
}

/* Status Wrapper */
.status-wrapper {
  margin-top: 16px;
}

/* Metrics Section */
.metrics-section {
  margin-bottom: 32px;
}

/* Gauges Grid */
.gauges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
}

.gauge-card {
  background: white;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-height: 260px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
  min-width: 0;
}

.gauge-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.15);
  border-color: #0ea5e9;
}

/* Tablet */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 24px;
  }

  .header-section {
    padding: 24px;
  }

  .shift-grid {
    grid-template-columns: 1fr;
  }

  .gauges-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px 12px;
  }

  .header-section {
    padding: 20px 12px;
  }

  .header-left {
    gap: 12px;
  }

  .icon-circle {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.8125rem;
  }

  .section-icon {
    width: 36px;
    height: 36px;
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .section-subtitle {
    font-size: 0.75rem;
  }

  .shift-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .gauges-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .gauge-card {
    min-height: 240px;
    padding: 16px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .content-wrapper {
    padding: 12px 8px;
  }

  .header-section {
    padding: 16px 8px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .gauge-card {
    min-height: 220px;
  }
}
</style>
