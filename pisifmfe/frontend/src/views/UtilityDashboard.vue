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
    <!-- Header with Back Button -->
    <div class="mb-8 flex items-center gap-4">
      <button
        @click="router.push(`/app/plant/${plantId}`)"
        class="p-2 rounded-full transition-all text-slate-400 hover:text-white hover:scale-110 duration-200 flex-shrink-0"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <div class="p-2 bg-emerald-500/10 rounded-lg">
        <Leaf class="text-emerald-400" :size="28" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-white">
          Utilities & Energy Efficiency
        </h1>
        <p class="text-slate-400 text-sm font-medium">
          {{ plantName }} • Resource Consumption
        </p>
      </div>
    </div>

    <!-- ISO 50001 KPI Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
      <!-- SEC Metric -->
      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p
              class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"
            >
              Specific Energy Consumption
            </p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-blue-400 font-mono">{{
                formatNumber(secPerTon, 2)
              }}</span>
              <span class="text-xs text-slate-400">kWh/ton</span>
            </div>
          </div>
          <div class="p-2 bg-blue-500/10 rounded-lg">
            <Gauge class="text-blue-400" :size="24" />
          </div>
        </div>
        <div
          class="pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs"
        >
          <span class="text-slate-400">
            Baseline: {{ formatNumber(secBaselinePerTon, 2) }} kWh/ton
          </span>
          <span
            :class="[
              'font-bold px-2 py-1 rounded',
              isEfficient
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-rose-500/10 text-rose-400',
            ]"
          >
            {{ isEfficient ? "✓ Efficient" : "⚠ Over" }}
          </span>
        </div>
      </div>

      <!-- Total Energy -->
      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p
              class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"
            >
              Total Energy Consumption
            </p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-yellow-400 font-mono">{{
                formatNumber(isoMetrics.totalEnergyKWh)
              }}</span>
              <span class="text-xs text-slate-400">kWh</span>
            </div>
          </div>
          <div class="p-2 bg-yellow-500/10 rounded-lg">
            <Zap class="text-yellow-400" :size="24" />
          </div>
        </div>
        <div class="pt-3 border-t border-slate-700/50 text-xs text-slate-400">
          Production: {{ formatNumber(isoMetrics.totalProductionKg) }} kg
        </div>
      </div>

      <!-- Carbon Footprint -->
      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p
              class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"
            >
              Carbon Footprint
            </p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold text-emerald-400 font-mono">{{
                formatNumber(isoMetrics.co2Emissions / 1000, 2)
              }}</span>
              <span class="text-xs text-slate-400">Ton CO2e</span>
            </div>
          </div>
          <div class="p-2 bg-emerald-500/10 rounded-lg">
            <Cloud class="text-emerald-400" :size="24" />
          </div>
        </div>
        <div
          class="pt-3 border-t border-slate-700/50 flex items-center gap-1 text-xs"
        >
          <TrendingUp class="text-emerald-400" :size="14" />
          <span class="text-emerald-400 font-semibold">-2.3%</span>
          <span class="text-slate-400">vs last period</span>
        </div>
      </div>
    </div>

    <!-- Utility Consumption Cards (Clickable) -->
    <div>
      <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Activity :size="20" class="text-blue-400" />
        Utility Consumption Overview
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <!-- Electricity Card -->
        <div
          @click="navigateToUtility(utilityData.electricity.route)"
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 hover:border-yellow-500/50 transition-all cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-3">
            <component
              :is="utilityData.electricity.icon"
              :size="24"
              class="text-yellow-400 group-hover:scale-110 transition-transform"
            />
          </div>
          <div class="text-xs text-slate-400 mb-1">Electricity</div>
          <div class="text-lg font-bold text-white">
            {{ formatNumber(utilityData.electricity.consumption) }}
          </div>
          <div class="text-xs text-slate-500">
            {{ utilityData.electricity.unit }}
          </div>
        </div>

        <!-- Steam Card -->
        <div
          @click="navigateToUtility(utilityData.steam.route)"
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 hover:border-orange-500/50 transition-all cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-3">
            <component
              :is="utilityData.steam.icon"
              :size="24"
              class="text-orange-400 group-hover:scale-110 transition-transform"
            />
          </div>
          <div class="text-xs text-slate-400 mb-1">Steam</div>
          <div class="text-lg font-bold text-white">
            {{ formatNumber(utilityData.steam.consumption) }}
          </div>
          <div class="text-xs text-slate-500">{{ utilityData.steam.unit }}</div>
        </div>

        <!-- Water Card -->
        <div
          @click="navigateToUtility(utilityData.water.route)"
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-3">
            <component
              :is="utilityData.water.icon"
              :size="24"
              class="text-cyan-400 group-hover:scale-110 transition-transform"
            />
          </div>
          <div class="text-xs text-slate-400 mb-1">Water</div>
          <div class="text-lg font-bold text-white">
            {{ formatNumber(utilityData.water.consumption) }}
          </div>
          <div class="text-xs text-slate-500">{{ utilityData.water.unit }}</div>
        </div>

        <!-- Compressed Air Card -->
        <div
          @click="navigateToUtility(utilityData.compressedAir.route)"
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 hover:border-sky-500/50 transition-all cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-3">
            <component
              :is="utilityData.compressedAir.icon"
              :size="24"
              class="text-sky-400 group-hover:scale-110 transition-transform"
            />
          </div>
          <div class="text-xs text-slate-400 mb-1">Compressed Air</div>
          <div class="text-lg font-bold text-white">
            {{ formatNumber(utilityData.compressedAir.consumption) }}
          </div>
          <div class="text-xs text-slate-500">
            {{ utilityData.compressedAir.unit }}
          </div>
        </div>

        <!-- Nitrogen Card -->
        <div
          @click="navigateToUtility(utilityData.nitrogen.route)"
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-3">
            <component
              :is="utilityData.nitrogen.icon"
              :size="24"
              class="text-indigo-400 group-hover:scale-110 transition-transform"
            />
          </div>
          <div class="text-xs text-slate-400 mb-1">Nitrogen</div>
          <div class="text-lg font-bold text-white">
            {{ formatNumber(utilityData.nitrogen.consumption) }}
          </div>
          <div class="text-xs text-slate-500">
            {{ utilityData.nitrogen.unit }}
          </div>
        </div>

        <!-- Natural Gas Card -->
        <div
          @click="navigateToUtility(utilityData.naturalGas.route)"
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-4 hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div class="flex justify-between items-start mb-3">
            <component
              :is="utilityData.naturalGas.icon"
              :size="24"
              class="text-amber-400 group-hover:scale-110 transition-transform"
            />
          </div>
          <div class="text-xs text-slate-400 mb-1">Natural Gas</div>
          <div class="text-lg font-bold text-white">
            {{ formatNumber(utilityData.naturalGas.consumption) }}
          </div>
          <div class="text-xs text-slate-500">
            {{ utilityData.naturalGas.unit }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.utility-dashboard {
  padding: 32px;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

@media (max-width: 1280px) {
  .utility-dashboard {
    padding: 24px;
    max-width: 1200px;
  }
}

@media (max-width: 768px) {
  .utility-dashboard {
    padding: 16px;
  }
}

@media (min-width: 1920px) {
  .utility-dashboard {
    max-width: 1800px;
    padding: 40px;
  }
}
</style>
