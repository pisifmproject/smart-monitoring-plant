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
    <div class="dashboard-header">
      <div class="header-left">
        <div class="header-icon">
          <Zap :size="32" />
        </div>
        <div>
          <h1 class="page-title">{{ plantName }} - Electrical Monitoring</h1>
          <p class="page-subtitle">Simulated electrical monitoring system</p>
        </div>
      </div>
      <div class="header-right">
        <div class="live-badge">
          <span class="pulse-dot"></span>
          <span>Simulation</span>
        </div>
      </div>
    </div>

    <!-- Alert Notice -->
    <div class="alert-notice">
      <AlertCircle :size="20" />
      <div>
        <strong>Simulation Mode</strong>
        <p>
          This plant uses simulated data. Real-time monitoring is only available
          for Plant Cikupa.
        </p>
      </div>
    </div>

    <!-- Summary Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div
          class="metric-icon"
          style="background: rgba(59, 130, 246, 0.1); color: #3b82f6"
        >
          <Zap :size="24" />
        </div>
        <div class="metric-content">
          <div class="metric-label">Total Power</div>
          <div class="metric-value">
            {{ formatNumber(summaryMetrics.totalPower, 2) }}
            <span class="unit">kW</span>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div
          class="metric-icon"
          style="background: rgba(34, 197, 94, 0.1); color: #22c55e"
        >
          <Activity :size="24" />
        </div>
        <div class="metric-content">
          <div class="metric-label">Total Energy</div>
          <div class="metric-value">
            {{ formatNumber(summaryMetrics.totalEnergy, 2) }}
            <span class="unit">kWh</span>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div
          class="metric-icon"
          style="background: rgba(234, 179, 8, 0.1); color: #eab308"
        >
          <TrendingUp :size="24" />
        </div>
        <div class="metric-content">
          <div class="metric-label">Avg Voltage</div>
          <div class="metric-value">
            {{ formatNumber(summaryMetrics.avgVoltage, 2) }}
            <span class="unit">V</span>
          </div>
        </div>
      </div>

      <div class="metric-card">
        <div
          class="metric-icon"
          style="background: rgba(168, 85, 247, 0.1); color: #a855f7"
        >
          <Activity :size="24" />
        </div>
        <div class="metric-content">
          <div class="metric-label">Load Factor</div>
          <div class="metric-value">
            {{ formatNumber(summaryMetrics.loadPercentage, 2) }}
            <span class="unit">%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel Grid -->
    <div class="section-header">
      <h2>Distribution Panels</h2>
    </div>

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
</template>

<style scoped>
.electrical-dashboard {
  padding: 32px;
  min-height: 100vh;
  max-width: 1600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

@media (max-width: 1280px) {
  .electrical-dashboard {
    padding: 24px;
    max-width: 1200px;
  }
}

@media (min-width: 1920px) {
  .electrical-dashboard {
    max-width: 1800px;
    padding: 40px;
  }
}

.dashboard-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 4px 0 0 0;
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
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
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

.alert-notice {
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: start;
  gap: 12px;
  color: #fbbf24;
}

.alert-notice strong {
  display: block;
  margin-bottom: 4px;
  color: #fbbf24;
}

.alert-notice p {
  margin: 0;
  font-size: 0.875rem;
  color: #cbd5e1;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.metric-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 0.875rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.unit {
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
}

.section-header {
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.panels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.panel-card {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.panel-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #334155;
}

.panel-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.online {
  background: rgba(34, 197, 94, 0.1);
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
}

.panel-metric .metric-label {
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
}

.panel-metric .metric-value {
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

@media (max-width: 768px) {
  .electrical-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    padding: 16px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .panels-grid {
    grid-template-columns: 1fr;
  }
}
</style>
