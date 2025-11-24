<!-- frontend\src\views\lvmdp1.vue -->
<script setup lang="ts">
import ShiftCard from "@/components/shiftCard.vue";
import Gauge from "@/components/gaugeSimple.vue";
import StatusBar from "@/components/statusBar.vue";
import DailyReportTable from "@/components/dailyReportTable.vue";
import ReportButton from "@/components/reportButton.vue";
import { useLvmdpLive } from "@/composables/useLvmdpLive";
import { useShiftAverages } from "@/composables/useShiftAverage";

const { s1, s2, s3 } = useShiftAverages(3);
const { isConnected, power, freq, cosPhi } = useLvmdpLive(3);
</script>

<template>
  <div class="wrap">
    <div class="inner">
      <!-- Report Button -->
      <div class="report-button-container">
        <ReportButton :panelId="3" />
      </div>

      <!-- Shift Performance Section -->
      <div class="section-header">
        <h2 class="section-title">Shift Performance</h2>
        <p class="section-subtitle">Today's shift metrics</p>
      </div>

      <!-- SHIFT cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <ShiftCard title="SHIFT 1" :kw="s1.avgKwh" :iavg="s1.avgCurrent" />
        <ShiftCard title="SHIFT 2" :kw="s2.avgKwh" :iavg="s2.avgCurrent" />
        <ShiftCard title="SHIFT 3" :kw="s3.avgKwh" :iavg="s3.avgCurrent" />
      </div>

      <div class="status-section">
        <StatusBar :connected="isConnected" />
      </div>

      <div class="divider"></div>

      <!-- Real-Time Metrics Section -->
      <div class="section-header">
        <h2 class="section-title">Real-Time Metrics</h2>
        <p class="section-subtitle">Live monitoring data</p>
      </div>

      <!-- Gauges -->
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

      <!-- Daily Reports Table -->
      <!-- <DailyReportTable :panelId="3" /> -->
    </div>
  </div>
</template>

<style scoped>
.wrap {
  width: 100%;
  max-width: 1400px;
  padding: 24px 16px;
  background: #f8fafc;
  min-height: 100vh;
  margin: 0 auto;
}

.inner {
  max-width: 1280px;
  margin: 0 auto;
}

/* Section Headers */
.section-header {
  margin-bottom: 24px;
  padding: 0 4px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0ea5e9;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.section-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* Divider */
.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin: 32px 0;
}

/* Status Section */
.status-section {
  margin-bottom: 8px;
}

/* Gauges Grid */
.gauges-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}

.gauge-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-height: 280px;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.gauge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

/* Tablet: 2 kolom */
@media (min-width: 768px) {
  .gauges-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .section-title {
    font-size: 1.75rem;
  }
}

/* Report Button Container */
.report-button-container {
  margin-bottom: 24px;
  display: flex;
  justify-content: flex-start;
  gap: 12px;
}

/* Desktop: 3 kolom */
@media (min-width: 1024px) {
  .gauges-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Mobile optimization */
@media (max-width: 640px) {
  .wrap {
    padding: 16px;
  }

  .inner {
    max-width: 100%;
  }

  .section-header {
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .section-subtitle {
    font-size: 0.8125rem;
  }

  .divider {
    margin: 24px 0;
  }

  .gauge-card {
    min-height: 240px;
    padding: 12px;
  }
}
</style>
