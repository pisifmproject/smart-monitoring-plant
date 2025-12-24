<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Zap, Activity, TrendingUp } from "lucide-vue-next";

const route = useRoute();
const plantId = computed(() => (route.params.plantId as string) || "CIKUPA");
const isCikupa = computed(() => plantId.value?.toUpperCase() === "CIKUPA");

const displayPlantName = computed(() => {
  const plantNames: Record<string, string> = {
    CIKUPA: "Plant Cikupa",
    SEMARANG: "Plant Semarang",
    AGRO: "Plant Agro",
  };

  return plantNames[plantId.value?.toUpperCase()] || `Plant ${plantId.value}`;
});

const formatNumber = (value: number, decimals = 2) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

const basePanels = [
  {
    title: "Main Panel 1",
    totalKwh: 10357.89,
    activeEnergy: 10357.89,
    pf: 0.88,
    reactive: 3858.58,
    status: "Normal",
  },
  {
    title: "Main Panel 2",
    totalKwh: 10249.08,
    activeEnergy: 10249.08,
    pf: 0.87,
    reactive: 3895.84,
    status: "Normal",
  },
  {
    title: "Main Panel 3",
    totalKwh: 10467.19,
    activeEnergy: 10467.19,
    pf: 0.86,
    reactive: 3845.36,
    status: "Normal",
  },
  {
    title: "Main Panel 4",
    totalKwh: 10679.78,
    activeEnergy: 10679.78,
    pf: 0.84,
    reactive: 4001.09,
    status: "Normal",
  },
];

const createDummyPanels = (seed: number) =>
  basePanels.map((panel, index) => {
    const variance = ((seed + index * 5) % 14) / 100;
    return {
      ...panel,
      totalKwh: panel.totalKwh * (1 + variance * 0.4),
      activeEnergy: panel.activeEnergy * (1 + variance * 0.4),
      pf: Math.min(0.97, panel.pf + variance * 0.1 - 0.02),
      reactive: panel.reactive * (1 + variance * 0.35),
    };
  });

const getDummyTrend = (seed: number) => {
  const base = [320, 300, 280, 310, 330, 340, 345, 335];
  return base.map((value, index) => value + ((seed + index * 3) % 25) - 12);
};

const plantData = computed(() => {
  if (isCikupa.value) {
    return {
      plantTitle: "Power Monitoring System",
      site: "BDC 1",
      capacity: 514.8,
      loadPercent: 33.46,
      currentLoad: 1853.9,
      summaryCards: [
        { label: "Load", value: 51.1, unit: "%", accent: "#22c55e" },
        { label: "PF (cos φ)", value: 0.87, unit: "cos φ", accent: "#14b8a6" },
        { label: "Real Power (P)", value: 1853.9, unit: "kW", accent: "#38bdf8" },
        { label: "Reactive Power (Q)", value: 671.8, unit: "kVar", accent: "#fbbf24" },
      ],
      energyTrend: [320, 300, 280, 310, 330, 340, 345, 335],
      panels: basePanels,
    };
  }

  const seed =
    plantId.value
      .toUpperCase()
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0) || 42;

  const capacity = 480 + (seed % 70);
  const loadPercent = 30 + ((seed % 30) * 1.2);
  const currentLoad = capacity * (loadPercent / 100) * 1.4;

  return {
    plantTitle: "Power Monitoring System",
    site: `Facility ${plantId.value}`,
    capacity,
    loadPercent,
    currentLoad,
    summaryCards: [
      { label: "Load", value: loadPercent, unit: "%", accent: "#22c55e" },
      {
        label: "PF (cos φ)",
        value: 0.8 + (seed % 8) * 0.02,
        unit: "cos φ",
        accent: "#14b8a6",
      },
      {
        label: "Real Power (P)",
        value: currentLoad,
        unit: "kW",
        accent: "#38bdf8",
      },
      {
        label: "Reactive Power (Q)",
        value: capacity * 0.8 * (loadPercent / 100),
        unit: "kVar",
        accent: "#fbbf24",
      },
    ],
    energyTrend: getDummyTrend(seed),
    panels: createDummyPanels(seed),
  };
});

const chartWidth = 320;
const chartHeight = 140;

const energyTrendPoints = computed(() => {
  const values = plantData.value.energyTrend;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * chartWidth;
      const y = chartHeight - ((value - min) / range) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");
});

const energyTrendArea = computed(
  () => `${energyTrendPoints.value} ${chartWidth},${chartHeight} 0,${chartHeight}`
);
</script>

<template>
  <div class="electrical-dashboard">
    <div class="page-header">
      <div class="header-left">
        <div class="breadcrumb">Smart Monitoring / Electrical</div>
        <div class="title-row">
          <div class="title-block">
            <p class="subtitle">{{ plantData.plantTitle }}</p>
            <div class="title-main">
              <span class="title-icon"><Zap :size="20" /></span>
              <span class="plant-name">{{ displayPlantName }}</span>
            </div>
            <p class="site-label">{{ plantData.site }}</p>
          </div>
          <div class="status-chip" :class="{ realtime: isCikupa }">
            <span class="pulse"></span>
            {{ isCikupa ? "Real Time" : "Dummy Data" }}
          </div>
        </div>
        <div class="capacity-card">
          <div class="capacity-text">
            <p class="label">Plant Capacity Utilization</p>
            <div class="capacity-values">
              <div>
                <div class="value">
                  {{ formatNumber(plantData.currentLoad, 1) }}
                  <span class="unit">KVA</span>
                </div>
                <p class="subtext">Current Load</p>
              </div>
              <div class="capacity-chip">
                Capacity {{ formatNumber(plantData.capacity, 1) }} KVA
              </div>
              <div class="value muted">
                {{ formatNumber(plantData.loadPercent, 2) }}<span class="unit">%</span>
              </div>
            </div>
            <div class="progress">
              <div
                class="progress-fill"
                :style="{ width: `${Math.min(plantData.loadPercent, 100)}%` }"
              >
                <span class="progress-glow"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="header-right">
        <div class="avatar">
          <Zap :size="24" />
        </div>
      </div>
    </div>

    <div class="metrics-row">
      <div
        v-for="card in plantData.summaryCards"
        :key="card.label"
        class="metric-card"
      >
        <div class="metric-icon" :style="{ color: card.accent }">
          <Activity v-if="card.label === 'Load'" :size="18" />
          <TrendingUp v-else-if="card.label.includes('PF')" :size="18" />
          <Zap v-else :size="18" />
        </div>
        <div class="metric-info">
          <p class="metric-label">{{ card.label }}</p>
          <p class="metric-value">
            {{ formatNumber(card.value, card.unit === '%' ? 1 : 2) }}
            <span class="metric-unit">{{ card.unit }}</span>
          </p>
        </div>
      </div>

      <div class="trend-card">
        <div class="trend-header">
          <div>
            <p class="metric-label">Energy Trend (Day)</p>
            <p class="trend-value">Last 8 weeks</p>
          </div>
          <div class="legend">
            <span class="dot"></span>
            <span>Energy</span>
          </div>
        </div>
        <div class="chart-wrapper">
          <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#c084fc" stop-opacity="0.45" />
                <stop offset="100%" stop-color="#6366f1" stop-opacity="0.1" />
              </linearGradient>
            </defs>
            <polyline
              :points="energyTrendArea"
              class="area"
              fill="url(#areaFill)"
              stroke="none"
            />
            <polyline
              :points="energyTrendPoints"
              class="line"
              fill="none"
              stroke="#a855f7"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <g v-for="(point, idx) in plantData.energyTrend" :key="idx">
              <circle
                class="marker"
                :cx="(idx / (plantData.energyTrend.length - 1)) * chartWidth"
                :cy="
                  chartHeight -
                  ((point - Math.min(...plantData.energyTrend)) /
                    (Math.max(...plantData.energyTrend) - Math.min(...plantData.energyTrend) || 1)) *
                    chartHeight
                "
                r="4"
              />
            </g>
          </svg>
        </div>
        <div class="trend-scale">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>

    <div class="panels-section">
      <div class="section-header">
        <div>
          <p class="label">Distribution Panels</p>
          <h2>Panel Summaries</h2>
        </div>
        <div class="section-subtext">Auto updated every 30 mins</div>
      </div>
      <div class="panels-grid">
        <div v-for="panel in plantData.panels" :key="panel.title" class="panel-card">
          <div class="panel-top">
            <div>
              <p class="panel-label">{{ panel.title }}</p>
              <p class="panel-status">{{ panel.status }}</p>
            </div>
            <div class="panel-icon"><Zap :size="18" /></div>
          </div>
          <div class="panel-metrics">
            <div class="metric-col">
              <p class="metric-label">Total KWh</p>
              <p class="panel-value">{{ formatNumber(panel.totalKwh, 2) }}</p>
            </div>
            <div class="metric-col">
              <p class="metric-label">Active Energy</p>
              <p class="panel-value">{{ formatNumber(panel.activeEnergy, 2) }}</p>
            </div>
            <div class="metric-col">
              <p class="metric-label">PF</p>
              <p class="panel-value">{{ formatNumber(panel.pf, 2) }}</p>
            </div>
            <div class="metric-col">
              <p class="metric-label">Reactive Energy</p>
              <p class="panel-value">{{ formatNumber(panel.reactive, 2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.electrical-dashboard {
  min-height: 100vh;
  padding: 32px 28px 40px;
  background: radial-gradient(80% 80% at 20% 20%, rgba(79, 70, 229, 0.1), transparent 45%),
    radial-gradient(70% 70% at 80% 10%, rgba(16, 185, 129, 0.05), transparent 40%),
    linear-gradient(135deg, #0f172a 0%, #0b1120 60%, #0b1223 100%);
  color: #e2e8f0;
}

.page-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: start;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breadcrumb {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
}

.title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.subtitle {
  margin: 0;
  color: #a5b4fc;
  font-size: 14px;
  letter-spacing: 0.02em;
}

.title-main {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.05));
  border-radius: 12px;
  color: #60a5fa;
}

.plant-name {
  letter-spacing: -0.02em;
}

.site-label {
  margin: 0;
  color: #94a3b8;
  font-size: 14px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.1);
  background: rgba(255, 255, 255, 0.04);
  color: #cbd5e1;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.status-chip.realtime {
  border-color: rgba(34, 197, 94, 0.2);
  color: #a7f3d0;
}

.pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(145deg, #fbbf24, #f97316);
  box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.8);
  animation: pulse 2s infinite;
}

.header-right .avatar {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.2), rgba(148, 163, 184, 0.1));
  color: #60a5fa;
  border: 1px solid rgba(226, 232, 240, 0.08);
}

.capacity-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(15, 23, 42, 0.5));
  border: 1px solid rgba(226, 232, 240, 0.08);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.capacity-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 13px;
  color: #cbd5e1;
  margin: 0;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.capacity-values {
  display: grid;
  grid-template-columns: repeat(3, auto);
  align-items: center;
  gap: 18px;
}

.value {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #fff;
  letter-spacing: -0.02em;
}

.value .unit {
  margin-left: 6px;
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
}

.value.muted {
  font-size: 22px;
  color: #cbd5e1;
}

.subtext {
  margin: 2px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.capacity-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.1);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.2);
  font-weight: 600;
  letter-spacing: 0.01em;
}

.progress {
  position: relative;
  width: 100%;
  height: 14px;
  background: rgba(226, 232, 240, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin-top: 6px;
}

.progress-fill {
  position: relative;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #22c55e, #10b981 40%, #3b82f6 100%);
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.4);
  transition: width 0.5s ease;
}

.progress-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2), transparent 40%);
}

.metrics-row {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) 1.1fr;
  gap: 16px;
  align-items: stretch;
}

.metric-card {
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.6));
  border: 1px solid rgba(226, 232, 240, 0.08);
  border-radius: 14px;
  padding: 14px 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.metric-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  display: grid;
  place-items: center;
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  margin: 0;
  color: #94a3b8;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.metric-value {
  margin: 0;
  font-size: 22px;
  color: #e5e7eb;
  font-weight: 700;
}

.metric-unit {
  margin-left: 6px;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

.trend-card {
  padding: 14px 16px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.6));
  border: 1px solid rgba(226, 232, 240, 0.1);
  border-radius: 14px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.trend-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.trend-value {
  margin: 0;
  color: #cbd5e1;
  font-size: 13px;
}

.legend {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.06);
  padding: 6px 10px;
  border-radius: 10px;
  color: #cbd5e1;
  font-weight: 600;
}

.legend .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(145deg, #a855f7, #6366f1);
  box-shadow: 0 0 10px rgba(99, 102, 241, 0.6);
}

.chart-wrapper {
  width: 100%;
  height: 160px;
}

svg {
  width: 100%;
  height: 100%;
}

.area {
  filter: drop-shadow(0 10px 25px rgba(99, 102, 241, 0.3));
}

.line {
  filter: drop-shadow(0 10px 20px rgba(99, 102, 241, 0.3));
}

.marker {
  fill: #a855f7;
  stroke: rgba(255, 255, 255, 0.4);
  stroke-width: 2;
}

.trend-scale {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
}

.panels-section {
  margin-top: 26px;
  background: rgba(15, 23, 42, 0.45);
  border: 1px solid rgba(226, 232, 240, 0.06);
  border-radius: 18px;
  padding: 18px 16px 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-header h2 {
  margin: 2px 0 0;
  font-size: 20px;
  color: #fff;
}

.section-subtext {
  color: #94a3b8;
  font-size: 13px;
}

.panels-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.panel-card {
  background: linear-gradient(160deg, rgba(30, 41, 59, 0.75), rgba(15, 23, 42, 0.8));
  border: 1px solid rgba(226, 232, 240, 0.08);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.02);
}

.panel-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-label {
  margin: 0;
  color: #cbd5e1;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.panel-status {
  margin: 0;
  color: #22c55e;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.panel-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.15);
  display: grid;
  place-items: center;
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.panel-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.metric-col {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.06);
  border-radius: 10px;
  padding: 10px 12px;
}

.panel-value {
  margin: 2px 0 0;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 12px rgba(251, 191, 36, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(251, 191, 36, 0);
  }
}

@media (max-width: 1200px) {
  .metrics-row {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }

  .title-main {
    font-size: 20px;
  }
}

@media (max-width: 768px) {
  .electrical-dashboard {
    padding: 20px 16px 32px;
  }

  .page-header {
    grid-template-columns: 1fr;
  }

  .title-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .capacity-values {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }

  .metrics-row {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .panels-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}
</style>
