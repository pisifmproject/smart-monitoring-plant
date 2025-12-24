<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Zap,
  Droplets,
  Flame,
  Wind,
  Box,
  Activity,
  TrendingUp,
  Gauge,
  Cloud,
  Leaf,
  ArrowLeft,
} from "lucide-vue-next";
import axios from "axios";

const API_URL = "http://localhost:2000/api";

const route = useRoute();
const router = useRouter();
const plantId = computed(() => route.params.plantId as string);
const plantName = computed(() => {
  const names: Record<string, string> = {
    CIKOKOL: "Cikokol",
    SEMARANG: "Semarang",
    CIKUPA: "Cikupa",
    AGRO: "Agro",
  };
  return names[plantId.value?.toUpperCase()] || plantId.value;
});

// ISO 50001 Metrics
const isoMetrics = ref({
  sec: 0,
  secBaseline: 245.0,
  co2Emissions: 0,
  totalEnergyKWh: 0,
  totalProductionKg: 0,
});

// Utility consumptions
const utilityData = ref({
  electricity: {
    consumption: 0,
    unit: "kWh",
    icon: Zap,
    route: "electrical/panels",
  },
  steam: { consumption: 0, unit: "ton", icon: Flame, route: "utilities/steam" },
  water: {
    consumption: 0,
    unit: "m³",
    icon: Droplets,
    route: "utilities/water",
  },
  compressedAir: {
    consumption: 0,
    unit: "m³",
    icon: Wind,
    route: "utilities/compressed-air",
  },
  nitrogen: {
    consumption: 0,
    unit: "m³",
    icon: Box,
    route: "utilities/nitrogen",
  },
  naturalGas: {
    consumption: 0,
    unit: "m³",
    icon: Flame,
    route: "utilities/natural-gas",
  },
});

const loading = ref(true);

// Fetch data from backend
const fetchUtilityData = async () => {
  try {
    const isCikupa = plantId.value?.toUpperCase() === "CIKUPA";

    if (isCikupa) {
      // Real data for Cikupa from backend
      const response = await axios.get(
        `${API_URL}/dashboard/plant/${plantId.value}`
      );

      const data = response.data;

      // Calculate total electricity from LVMDP panels
      const lvmdpPanels = data.lvmdpPanels || [];
      const totalKwh = lvmdpPanels.reduce(
        (sum: number, panel: any) => sum + (parseFloat(panel.totalKwh) || 0),
        0
      );

      utilityData.value.electricity.consumption = totalKwh;

      // Get other utilities from response (if available)
      utilityData.value.steam.consumption =
        data.steamConsumption || 1500 + Math.random() * 500;
      utilityData.value.water.consumption =
        data.waterConsumption || 15000 + Math.random() * 5000;
      utilityData.value.compressedAir.consumption =
        data.airConsumption || 8500 + Math.random() * 1500;
      utilityData.value.nitrogen.consumption =
        data.nitrogenConsumption || 3500 + Math.random() * 1500;
      utilityData.value.naturalGas.consumption =
        data.gasConsumption || 4500 + Math.random() * 2500;

      // Calculate ISO metrics
      const totalProduction = data.totalOutput || 15600;
      const secKwhPerKg = totalProduction > 0 ? totalKwh / totalProduction : 0;
      const secKwhPerTon = secKwhPerKg * 1000;

      isoMetrics.value = {
        sec: secKwhPerTon,
        secBaseline: 245.0,
        co2Emissions: totalKwh * 0.85,
        totalEnergyKWh: totalKwh,
        totalProductionKg: totalProduction,
      };
    } else {
      // Dummy data for other plants
      const totalKwh = 11600 + Math.random() * 2000;
      utilityData.value.electricity.consumption = totalKwh;
      utilityData.value.steam.consumption = 1500 + Math.random() * 500;
      utilityData.value.water.consumption = 15000 + Math.random() * 5000;
      utilityData.value.compressedAir.consumption = 8500 + Math.random() * 1500;
      utilityData.value.nitrogen.consumption = 3500 + Math.random() * 1500;
      utilityData.value.naturalGas.consumption = 4500 + Math.random() * 2500;

      const totalProduction = 12000 + Math.random() * 3000;
      const secKwhPerKg = totalProduction > 0 ? totalKwh / totalProduction : 0;
      const secKwhPerTon = secKwhPerKg * 1000;

      isoMetrics.value = {
        sec: secKwhPerTon,
        secBaseline: 245.0,
        co2Emissions: totalKwh * 0.85,
        totalEnergyKWh: totalKwh,
        totalProductionKg: totalProduction,
      };
    }
  } catch (error) {
    console.error("Error fetching utility data:", error);
    // Fallback to dummy data
    const totalKwh = 11600 + Math.random() * 2000;
    utilityData.value.electricity.consumption = totalKwh;
    utilityData.value.steam.consumption = 1500 + Math.random() * 500;
    utilityData.value.water.consumption = 15000 + Math.random() * 5000;
    utilityData.value.compressedAir.consumption = 8500 + Math.random() * 1500;
    utilityData.value.nitrogen.consumption = 3500 + Math.random() * 1500;
    utilityData.value.naturalGas.consumption = 4500 + Math.random() * 2500;

    isoMetrics.value = {
      sec: 235.5 + Math.random() * 20,
      secBaseline: 245.0,
      co2Emissions: totalKwh * 0.85,
      totalEnergyKWh: totalKwh,
      totalProductionKg: 15000,
    };
  } finally {
    loading.value = false;
  }
};

const formatNumber = (num: number, decimals = 0) => {
  const maxDecimals = Math.min(decimals, 2);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: maxDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(num);
};

const secPerTon = computed(() => isoMetrics.value.sec);
const secBaselinePerTon = computed(() => isoMetrics.value.secBaseline);
const isEfficient = computed(() => secPerTon.value <= secBaselinePerTon.value);

const navigateToUtility = (utilityRoute: string) => {
  router.push(`/app/plant/${plantId.value}/${utilityRoute}`);
};

onMounted(() => {
  fetchUtilityData();
});
</script>

<template>
  <div class="utility-dashboard">
    <!-- Header -->
    <div class="page-header">
      <div class="header-back">
        <button @click="router.push(`/app/plant/${plantId}`)" class="back-btn">
          <ArrowLeft :size="24" />
        </button>
      </div>
      <div class="header-content">
        <h1 class="page-title">Utilities & Energy Efficiency</h1>
        <p class="page-subtitle">{{ plantName }} • Resource Consumption</p>
      </div>
    </div>

    <!-- Top Metrics Row -->
    <div class="metrics-row">
      <!-- Specific Energy Consumption -->
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-text">
            <p class="metric-label">EFFICIENCY METRIC</p>
            <p class="metric-title">Specific Energy Cons.</p>
          </div>
          <div
            class="metric-icon"
            style="background: rgba(59, 130, 246, 0.1); color: #3b82f6"
          >
            <Gauge :size="20" />
          </div>
        </div>
        <div class="metric-display">
          <span class="metric-value">{{ formatNumber(secPerTon, 2) }}</span>
          <span class="metric-unit">kWh/ton</span>
        </div>
        <div class="metric-info">
          <span class="baseline"
            >Baseline: {{ formatNumber(secBaselinePerTon, 2) }} kWh/ton</span
          >
          <span
            :class="['efficiency-badge', isEfficient ? 'efficient' : 'warning']"
          >
            {{ isEfficient ? "✓ Efficient" : "⚠ Over" }}
          </span>
        </div>
      </div>

      <!-- Carbon Footprint -->
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-text">
            <p class="metric-label">ENVIRONMENT</p>
            <p class="metric-title">Carbon Footprint</p>
          </div>
          <div
            class="metric-icon"
            style="background: rgba(34, 197, 94, 0.1); color: #22c55e"
          >
            <Cloud :size="20" />
          </div>
        </div>
        <div class="metric-display">
          <span class="metric-value">{{
            formatNumber(isoMetrics.co2Emissions / 1000, 2)
          }}</span>
          <span class="metric-unit">Ton CO₂e</span>
        </div>
        <div class="metric-info">
          <span class="factor">Factor: 0.85 kg/kWh</span>
          <span class="trend">↓ 2.4%</span>
        </div>
      </div>

      <!-- Total Energy -->
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-text">
            <p class="metric-label">CONSUMPTION</p>
            <p class="metric-title">Total Energy</p>
          </div>
          <div
            class="metric-icon"
            style="background: rgba(234, 179, 8, 0.1); color: #eab308"
          >
            <Zap :size="20" />
          </div>
        </div>
        <div class="metric-display">
          <span class="metric-value">{{
            formatNumber(isoMetrics.totalEnergyKWh)
          }}</span>
          <span class="metric-unit">kWh</span>
        </div>
        <div class="metric-info">
          <span class="production">Vs Production: 15,600 kg</span>
        </div>
      </div>
    </div>

    <!-- Main Grid: Chart + Breakdown -->
    <div class="main-grid">
      <!-- Chart Section -->
      <div class="chart-section">
        <div class="chart-card">
          <h2 class="chart-title">Energy Efficiency Trend (SEC) vs Baseline</h2>
          <div class="chart-placeholder">
            <p>Chart visualization placeholder</p>
          </div>
        </div>
      </div>

      <!-- Utility Breakdown -->
      <div class="breakdown-section">
        <div class="breakdown-card">
          <h2 class="breakdown-title">Utility Breakdown</h2>
          <div class="breakdown-list">
            <!-- Electricity -->
            <div
              @click="navigateToUtility(utilityData.electricity.route)"
              class="breakdown-item"
            >
              <div class="item-left">
                <Zap :size="18" class="item-icon electricity" />
                <span class="item-name">Electricity</span>
              </div>
              <div class="item-right">
                <span class="item-value">{{
                  formatNumber(utilityData.electricity.consumption)
                }}</span>
                <span class="item-unit">kWh</span>
              </div>
            </div>

            <!-- Steam -->
            <div
              @click="navigateToUtility(utilityData.steam.route)"
              class="breakdown-item"
            >
              <div class="item-left">
                <Flame :size="18" class="item-icon steam" />
                <span class="item-name">Steam</span>
              </div>
              <div class="item-right">
                <span class="item-value">{{
                  formatNumber(utilityData.steam.consumption)
                }}</span>
                <span class="item-unit">ton</span>
              </div>
            </div>

            <!-- Water -->
            <div
              @click="navigateToUtility(utilityData.water.route)"
              class="breakdown-item"
            >
              <div class="item-left">
                <Droplets :size="18" class="item-icon water" />
                <span class="item-name">Water</span>
              </div>
              <div class="item-right">
                <span class="item-value">{{
                  formatNumber(utilityData.water.consumption)
                }}</span>
                <span class="item-unit">m³</span>
              </div>
            </div>

            <!-- Compressed Air -->
            <div
              @click="navigateToUtility(utilityData.compressedAir.route)"
              class="breakdown-item"
            >
              <div class="item-left">
                <Wind :size="18" class="item-icon air" />
                <span class="item-name">Compressed Air</span>
              </div>
              <div class="item-right">
                <span class="item-value">{{
                  formatNumber(utilityData.compressedAir.consumption)
                }}</span>
                <span class="item-unit">m³</span>
              </div>
            </div>

            <!-- Nitrogen -->
            <div
              @click="navigateToUtility(utilityData.nitrogen.route)"
              class="breakdown-item"
            >
              <div class="item-left">
                <Box :size="18" class="item-icon nitrogen" />
                <span class="item-name">Nitrogen</span>
              </div>
              <div class="item-right">
                <span class="item-value">{{
                  formatNumber(utilityData.nitrogen.consumption)
                }}</span>
                <span class="item-unit">m³</span>
              </div>
            </div>

            <!-- Natural Gas -->
            <div
              @click="navigateToUtility(utilityData.naturalGas.route)"
              class="breakdown-item"
            >
              <div class="item-left">
                <Flame :size="18" class="item-icon gas" />
                <span class="item-name">Natural Gas</span>
              </div>
              <div class="item-right">
                <span class="item-value">{{
                  formatNumber(utilityData.naturalGas.consumption)
                }}</span>
                <span class="item-unit">m³</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.utility-dashboard {
  padding: 32px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

/* HEADER */
.page-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.1);
}

.header-back {
  flex-shrink: 0;
}

.back-btn {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(226, 232, 240, 0.1);
  background: rgba(226, 232, 240, 0.05);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: rgba(14, 165, 233, 0.1);
  border-color: rgba(14, 165, 233, 0.3);
  color: #0ea5e9;
}

.header-content {
  flex: 1;
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
  margin: 4px 0 0 0;
}

/* METRICS ROW */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  align-items: flex-start;
  margin-bottom: 12px;
}

.metric-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-display {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 12px;
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
}

.metric-unit {
  font-size: 12px;
  color: #94a3b8;
}

.metric-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid rgba(226, 232, 240, 0.05);
  font-size: 12px;
  color: #94a3b8;
}

.efficiency-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 10px;
}

.efficiency-badge.efficient {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.efficiency-badge.warning {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.trend {
  color: #22c55e;
  font-weight: 700;
}

/* MAIN GRID */
.main-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
}

.chart-section,
.breakdown-section {
  min-height: 400px;
}

.chart-card,
.breakdown-card {
  padding: 24px;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.8),
    rgba(30, 41, 59, 0.8)
  );
  border: 1px solid rgba(226, 232, 240, 0.1);
  border-radius: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title,
.breakdown-title {
  font-size: 16px;
  font-weight: 700;
  color: white;
  margin: 0 0 16px 0;
}

.chart-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  border: 1px dashed rgba(226, 232, 240, 0.2);
  border-radius: 8px;
  min-height: 300px;
}

/* BREAKDOWN LIST */
.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breakdown-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.breakdown-item:hover {
  background: rgba(14, 165, 233, 0.1);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.item-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.item-icon.electricity {
  color: #fbbf24;
}
.item-icon.steam {
  color: #f97316;
}
.item-icon.water {
  color: #06b6d4;
}
.item-icon.air {
  color: #0ea5e9;
}
.item-icon.nitrogen {
  color: #6366f1;
}
.item-icon.gas {
  color: #f59e0b;
}

.item-name {
  font-size: 13px;
  font-weight: 600;
  color: #cbd5e1;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.item-value {
  font-size: 14px;
  font-weight: 700;
  color: white;
  font-variant-numeric: tabular-nums;
}

.item-unit {
  font-size: 11px;
  color: #64748b;
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .utility-dashboard {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
  }

  .page-title {
    font-size: 20px;
  }

  .metrics-row {
    grid-template-columns: 1fr;
  }
}
</style>
