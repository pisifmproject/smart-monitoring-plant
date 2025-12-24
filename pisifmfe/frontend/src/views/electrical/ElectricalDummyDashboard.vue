<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Zap, Activity, TrendingUp, AlertCircle } from "lucide-vue-next";

const route = useRoute();
const plantId = computed(() => route.params.plantId as string);
const plantName = computed(() => {
  const names: Record<string, string> = {
    CIKOKOL: "Plant Cikokol",
    SEMARANG: "Plant Semarang",
    AGRO: "Plant Agro",
  };
  return names[plantId.value?.toUpperCase()] || plantId.value;
});

const formatNumber = (num: number, decimals = 0) => {
  const maxDecimals = Math.min(decimals, 2);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: maxDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(num);
};

// Generate dummy panel data
const generateDummyPanels = () => {
  return [
    {
      name: "Panel 1",
      voltage: 385 + Math.random() * 10,
      current: 120 + Math.random() * 20,
      power: 78 + Math.random() * 15,
      totalKwh: 2800 + Math.random() * 400,
      status: "ONLINE",
    },
    {
      name: "Panel 2",
      voltage: 380 + Math.random() * 10,
      current: 110 + Math.random() * 20,
      power: 72 + Math.random() * 15,
      totalKwh: 2600 + Math.random() * 400,
      status: "ONLINE",
    },
    {
      name: "Panel 3",
      voltage: 390 + Math.random() * 10,
      current: 130 + Math.random() * 20,
      power: 85 + Math.random() * 15,
      totalKwh: 3100 + Math.random() * 400,
      status: "ONLINE",
    },
    {
      name: "Panel 4",
      voltage: 383 + Math.random() * 10,
      current: 115 + Math.random() * 20,
      power: 75 + Math.random() * 15,
      totalKwh: 2700 + Math.random() * 400,
      status: "ONLINE",
    },
  ];
};

const panels = ref(generateDummyPanels());
const loading = ref(false);

const summaryMetrics = computed(() => {
  const totalPower = panels.value.reduce((sum, p) => sum + p.power, 0);
  const totalEnergy = panels.value.reduce((sum, p) => sum + p.totalKwh, 0);
  const avgVoltage =
    panels.value.reduce((sum, p) => sum + p.voltage, 0) / panels.value.length;
  const totalCurrent = panels.value.reduce((sum, p) => sum + p.current, 0);

  return {
    totalPower,
    totalEnergy,
    avgVoltage,
    totalCurrent,
    loadPercentage: (totalPower / 500) * 100, // Assuming 500kW capacity
  };
});

onMounted(() => {
  // Refresh data every 30 seconds
  const interval = setInterval(() => {
    panels.value = generateDummyPanels();
  }, 30000);

  return () => clearInterval(interval);
});
</script>

<template>
  <div class="electrical-dashboard">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <Zap :size="32" />
        </div>
        <div class="header-text">
          <h1 class="page-title">Electrical Monitoring</h1>
          <p class="page-subtitle">
            {{ plantName }} • Distribution Panel Status
          </p>
        </div>
      </div>
      <div class="header-right">
        <div class="live-badge">
          <span class="pulse-dot"></span>
          <span>Simulation</span>
        </div>
      </div>
    </div>

    <!-- Summary Metrics -->
    <div class="metrics-container">
      <div class="metric-card total-power">
        <div class="metric-header">
          <span class="metric-label">Total Power</span>
          <div
            class="metric-icon"
            style="background: rgba(59, 130, 246, 0.1); color: #3b82f6"
          >
            <Zap :size="20" />
          </div>
        </div>
        <div class="metric-value">
          <span class="value">{{
            formatNumber(summaryMetrics.totalPower, 2)
          }}</span>
          <span class="unit">kW</span>
        </div>
      </div>

      <div class="metric-card total-energy">
        <div class="metric-header">
          <span class="metric-label">Total Energy</span>
          <div
            class="metric-icon"
            style="background: rgba(34, 197, 94, 0.1); color: #22c55e"
          >
            <Activity :size="20" />
          </div>
        </div>
        <div class="metric-value">
          <span class="value">{{
            formatNumber(summaryMetrics.totalEnergy, 2)
          }}</span>
          <span class="unit">kWh</span>
        </div>
      </div>

      <div class="metric-card avg-voltage">
        <div class="metric-header">
          <span class="metric-label">Avg Voltage</span>
          <div
            class="metric-icon"
            style="background: rgba(234, 179, 8, 0.1); color: #eab308"
          >
            <TrendingUp :size="20" />
          </div>
        </div>
        <div class="metric-value">
          <span class="value">{{
            formatNumber(summaryMetrics.avgVoltage, 2)
          }}</span>
          <span class="unit">V</span>
        </div>
      </div>

      <div class="metric-card load-factor">
        <div class="metric-header">
          <span class="metric-label">Load Factor</span>
          <div
            class="metric-icon"
            style="background: rgba(168, 85, 247, 0.1); color: #a855f7"
          >
            <Activity :size="20" />
          </div>
        </div>
        <div class="metric-value">
          <span class="value">{{
            formatNumber(summaryMetrics.loadPercentage, 2)
          }}</span>
          <span class="unit">%</span>
        </div>
      </div>
    </div>

    <!-- Distribution Panels Section -->
    <div class="panels-section">
      <h2 class="section-title">Distribution Panels</h2>
      <div class="panels-grid">
        <div v-for="panel in panels" :key="panel.name" class="panel-card">
          <div class="panel-header">
            <h3>{{ panel.name }}</h3>
            <span class="status-badge online">{{ panel.status }}</span>
          </div>

          <div class="panel-metrics">
            <div class="panel-metric">
              <span class="metric-label">Voltage</span>
              <span class="metric-value"
                >{{ formatNumber(panel.voltage, 2) }} V</span
              >
            </div>
            <div class="panel-metric">
              <span class="metric-label">Current</span>
              <span class="metric-value"
                >{{ formatNumber(panel.current, 2) }} A</span
              >
            </div>
            <div class="panel-metric">
              <span class="metric-label">Power</span>
              <span class="metric-value"
                >{{ formatNumber(panel.power, 2) }} kW</span
              >
            </div>
            <div class="panel-metric">
              <span class="metric-label">Energy</span>
              <span class="metric-value"
                >{{ formatNumber(panel.totalKwh, 2) }} kWh</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.electrical-dashboard {
  padding: 32px;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

/* PAGE HEADER */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.1);
  flex-wrap: wrap;
  gap: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
  border: 1px solid rgba(226, 232, 240, 0.1);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #fbbf24;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* METRICS CONTAINER */
.metrics-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.metric-card {
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.8),
    rgba(30, 41, 59, 0.8)
  );
  border: 1px solid rgba(226, 232, 240, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.metric-card:hover {
  border-color: rgba(226, 232, 240, 0.2);
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.9),
    rgba(30, 41, 59, 0.9)
  );
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.metric-label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-value {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.metric-value .value {
  font-size: 28px;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
}

.metric-value .unit {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

/* PANELS SECTION */
.panels-section {
  margin-top: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
  text-transform: capitalize;
}

.panels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.panel-card {
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.7),
    rgba(30, 41, 59, 0.7)
  );
  border: 1px solid rgba(226, 232, 240, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.panel-card:hover {
  border-color: rgba(59, 130, 246, 0.3);
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.85),
    rgba(30, 41, 59, 0.85)
  );
  transform: translateY(-4px);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.1);
}

.panel-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-badge.online {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.panel-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.panel-metric {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
}

.panel-metric .metric-label {
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.panel-metric .metric-value {
  font-size: 14px;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
}

/* RESPONSIVE */
@media (max-width: 1280px) {
  .electrical-dashboard {
    padding: 24px;
    max-width: 1200px;
  }

  .page-title {
    font-size: 24px;
  }

  .metrics-container {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .panels-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .electrical-dashboard {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 20px;
  }

  .page-subtitle {
    font-size: 12px;
  }

  .metrics-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .metric-value .value {
    font-size: 20px;
  }

  .panels-grid {
    grid-template-columns: 1fr;
  }

  .panel-metrics {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}

@media (min-width: 1920px) {
  .electrical-dashboard {
    max-width: 1600px;
    padding: 40px;
  }

  .metrics-container {
    grid-template-columns: repeat(4, 1fr);
  }

  .panels-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
