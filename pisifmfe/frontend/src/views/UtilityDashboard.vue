<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  Zap,
  Activity,
  TrendingUp,
  AlertCircle,
  Gauge,
  Cloud,
  Factory,
  TrendingDown,
  Leaf,
} from "lucide-vue-next";
import axios from "axios";

const API_URL = "http://localhost:2000/api";

const route = useRoute();
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

// Data from backend
const lvmdpPanels = ref<any[]>([]);
const isoMetrics = ref({
  sec: 0,
  secBaseline: 0,
  co2Emissions: 0,
  totalEnergyKWh: 0,
  totalProductionKg: 0,
});

const loading = ref(true);

// Fetch LVMDP panels data
const fetchLVMDPData = async () => {
  try {
    const isCikupa = plantId.value?.toUpperCase() === "CIKUPA";

    if (isCikupa) {
      // Real data for Cikupa
      const response = await axios.get(
        `${API_URL}/dashboard/plant/${plantId.value}`
      );

      // Extract LVMDP panels from response
      const panels = response.data.lvmdpPanels || [];

      // Transform panel data if needed
      lvmdpPanels.value = panels.map((panel: any) => ({
        panelName: panel.panelName || panel.name || "Unknown",
        voltage: parseFloat(panel.voltage) || 0,
        current: parseFloat(panel.current) || 0,
        power: parseFloat(panel.power) || 0,
        totalKwh: parseFloat(panel.totalKwh) || 0,
      }));

      // Calculate ISO metrics from real data
      const totalKwh = lvmdpPanels.value.reduce(
        (sum, panel) => sum + (panel.totalKwh || 0),
        0
      );
      const totalProduction = 15600; // kg per day (example)
      const secKwhPerKg = totalProduction > 0 ? totalKwh / totalProduction : 0;
      const secKwhPerTon = secKwhPerKg * 1000;

      isoMetrics.value = {
        sec: secKwhPerTon,
        secBaseline: 245.0, // Baseline target
        co2Emissions: totalKwh * 0.85, // 0.85 kg CO2 per kWh
        totalEnergyKWh: totalKwh,
        totalProductionKg: totalProduction,
      };
    } else {
      // Dummy data for other plants
      lvmdpPanels.value = generateDummyPanels();
      isoMetrics.value = generateDummyISOMetrics();
    }
  } catch (error) {
    console.error("Error fetching LVMDP data:", error);
    lvmdpPanels.value = generateDummyPanels();
    isoMetrics.value = generateDummyISOMetrics();
  } finally {
    loading.value = false;
  }
};

const generateDummyPanels = () => {
  return [
    {
      panelName: "LVMDP 1",
      voltage: 385 + Math.random() * 10,
      current: 120 + Math.random() * 20,
      power: 78 + Math.random() * 15,
      totalKwh: 2800 + Math.random() * 400,
    },
    {
      panelName: "LVMDP 2",
      voltage: 380 + Math.random() * 10,
      current: 110 + Math.random() * 20,
      power: 72 + Math.random() * 15,
      totalKwh: 2600 + Math.random() * 400,
    },
    {
      panelName: "LVMDP 3",
      voltage: 390 + Math.random() * 10,
      current: 130 + Math.random() * 20,
      power: 85 + Math.random() * 15,
      totalKwh: 3100 + Math.random() * 400,
    },
    {
      panelName: "LVMDP 4",
      voltage: 383 + Math.random() * 10,
      current: 115 + Math.random() * 20,
      power: 75 + Math.random() * 15,
      totalKwh: 2700 + Math.random() * 400,
    },
  ];
};

const generateDummyISOMetrics = () => {
  const totalKwh = 11200 + Math.random() * 1000;
  const totalProduction = 18000 + Math.random() * 2000;
  const secKwhPerKg = totalKwh / totalProduction;
  const secKwhPerTon = secKwhPerKg * 1000;

  return {
    sec: secKwhPerTon,
    secBaseline: 245.0,
    co2Emissions: totalKwh * 0.85,
    totalEnergyKWh: totalKwh,
    totalProductionKg: totalProduction,
  };
};

const formatNumber = (num: number, decimals = 0) => {
  const maxDecimals = Math.min(decimals, 2); // Global rule: max 2 decimals
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: maxDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(num);
};

const secPerTon = computed(() => isoMetrics.value.sec);
const secBaselinePerTon = computed(() => isoMetrics.value.secBaseline);
const isEfficient = computed(() => secPerTon.value <= secBaselinePerTon.value);

onMounted(() => {
  fetchLVMDPData();
});
</script>

<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <Leaf class="text-emerald-500" :size="28" />
        <div>
          <h1 class="text-2xl font-bold text-white">
            Utilities & Energy Efficiency
          </h1>
          <p class="text-slate-400 text-sm font-medium">
            {{ plantName }} • Resource Consumption
          </p>
        </div>
      </div>
    </div>

    <!-- ISO 50001 Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- SEC Metric -->
      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start">
          <div>
            <p
              class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"
            >
              Efficiency Metric
            </p>
            <h3 class="text-white text-lg font-bold">Specific Energy Cons.</h3>
            <div class="mt-3 flex items-baseline gap-2">
              <span class="text-3xl font-bold text-blue-400 font-mono">{{
                formatNumber(secPerTon, 2)
              }}</span>
              <span class="text-xs text-slate-400">kWh/ton</span>
            </div>
          </div>
          <div class="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Gauge :size="24" />
          </div>
        </div>
        <div
          class="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs"
        >
          <span class="text-slate-400"
            >Baseline:
            <span class="text-slate-200">{{
              formatNumber(secBaselinePerTon, 2)
            }}</span></span
          >
          <span
            :class="[
              'font-bold',
              isEfficient ? 'text-emerald-400' : 'text-rose-400',
            ]"
          >
            {{ isEfficient ? "Efficient" : "Over Limit" }}
          </span>
        </div>
      </div>

      <!-- Carbon Footprint -->
      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start">
          <div>
            <p
              class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"
            >
              Environment
            </p>
            <h3 class="text-white text-lg font-bold">Carbon Footprint</h3>
            <div class="mt-3 flex items-baseline gap-2">
              <span class="text-3xl font-bold text-emerald-400 font-mono">{{
                formatNumber(isoMetrics.co2Emissions / 1000, 2)
              }}</span>
              <span class="text-xs text-slate-400">Ton CO2e</span>
            </div>
          </div>
          <div class="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
            <Cloud :size="24" />
          </div>
        </div>
        <div
          class="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs"
        >
          <span class="text-slate-400">Factor: 0.85 kg/kWh</span>
          <span class="text-emerald-400 font-bold flex items-center gap-1"
            ><TrendingDown :size="12" /> 2.4%</span
          >
        </div>
      </div>

      <!-- Total Energy -->
      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start">
          <div>
            <p
              class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1"
            >
              Consumption
            </p>
            <h3 class="text-white text-lg font-bold">Total Energy</h3>
            <div class="mt-3 flex items-baseline gap-2">
              <span class="text-3xl font-bold text-yellow-400 font-mono">{{
                formatNumber(isoMetrics.totalEnergyKWh)
              }}</span>
              <span class="text-xs text-slate-400">kWh</span>
            </div>
          </div>
          <div class="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
            <Zap :size="24" />
          </div>
        </div>
        <div
          class="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs"
        >
          <span class="text-slate-400"
            >Vs Production:
            <span class="text-white">{{
              formatNumber(isoMetrics.totalProductionKg)
            }}</span>
            kg</span
          >
        </div>
      </div>
    </div>

    <!-- LVMDP Panel Summary -->
    <div
      class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6"
    >
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">
          <Zap :size="24" class="text-blue-400" />
          LVMDP Panel Summary
        </h2>
        <router-link
          :to="`/app/plant/${plantId}/electrical/panels`"
          class="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
        >
          View Details →
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-8 text-slate-400">
        Loading panel data...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="panel in lvmdpPanels"
          :key="panel.panelName"
          class="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600 transition-all"
        >
          <h3 class="text-white font-bold mb-3 flex items-center gap-2">
            <div
              class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
            ></div>
            {{ panel.panelName }}
          </h3>
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-400">Voltage</span>
              <span class="text-sm font-bold text-blue-400 font-mono"
                >{{ formatNumber(panel.voltage, 1) }} V</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-400">Current</span>
              <span class="text-sm font-bold text-emerald-400 font-mono"
                >{{ formatNumber(panel.current, 1) }} A</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-400">Power</span>
              <span class="text-sm font-bold text-yellow-400 font-mono"
                >{{ formatNumber(panel.power, 1) }} kW</span
              >
            </div>
            <div
              class="flex justify-between items-center pt-2 border-t border-slate-700/30"
            >
              <span class="text-xs text-slate-400">Total kWh</span>
              <span class="text-sm font-bold text-white font-mono">{{
                formatNumber(panel.totalKwh)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional Utilities (Coming Soon) -->
    <div
      class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
    >
      <h2 class="text-xl font-bold text-white mb-4">Additional Utilities</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <h3 class="font-semibold text-white mb-2">Water Management</h3>
          <p class="text-sm text-slate-400">Coming soon...</p>
        </div>
        <div class="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <h3 class="font-semibold text-white mb-2">Gas Distribution</h3>
          <p class="text-sm text-slate-400">Coming soon...</p>
        </div>
        <div class="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <h3 class="font-semibold text-white mb-2">HVAC Systems</h3>
          <p class="text-sm text-slate-400">Coming soon...</p>
        </div>
      </div>
    </div>
  </div>
</template>
