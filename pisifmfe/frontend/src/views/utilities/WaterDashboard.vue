<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { Droplets, TrendingUp, AlertTriangle, Activity } from "lucide-vue-next";

const route = useRoute();
const plantId = computed(() => route.params.plantId as string);

const waterData = ref({
  totalConsumption: 0,
  flowRate: 0,
  pressure: 0,
  quality: 0,
  temperature: 0,
  status: "NORMAL" as "NORMAL" | "WARNING" | "CRITICAL",
});

const historicalData = ref<any[]>([]);
let refreshInterval: any = null;

const formatNumber = (num: number, decimals = 0) => {
  const maxDecimals = Math.min(decimals, 2);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: maxDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(num);
};

const generateDummyData = () => {
  waterData.value = {
    totalConsumption: 15000 + Math.random() * 5000,
    flowRate: 35 + Math.random() * 15,
    pressure: 3.5 + Math.random() * 1.5,
    quality: 92 + Math.random() * 7,
    temperature: 22 + Math.random() * 8,
    status: Math.random() > 0.8 ? "WARNING" : "NORMAL",
  };

  historicalData.value = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    consumption: 14000 + Math.random() * 6000,
    quality: 90 + Math.random() * 9,
  }));
};

onMounted(() => {
  generateDummyData();
  refreshInterval = setInterval(generateDummyData, 30000);
});

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval);
});

const getStatusColor = (status: string) => {
  switch (status) {
    case "NORMAL":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "WARNING":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    case "CRITICAL":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  }
};
</script>

<template>
  <div class="water-dashboard">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-cyan-500/10 rounded-lg">
              <Droplets class="text-cyan-400" :size="28" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">Water Management</h1>
              <p class="text-sm text-slate-400">
                Plant {{ plantId }} - Real-time Water Monitoring
              </p>
            </div>
          </div>
        </div>
        <div
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold uppercase border',
            getStatusColor(waterData.status),
          ]"
        >
          {{ waterData.status }}
        </div>
      </div>
    </div>

    <!-- Alert Banner -->
    <div
      class="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3"
    >
      <AlertTriangle class="text-blue-400 flex-shrink-0 mt-0.5" :size="20" />
      <div>
        <p class="text-sm font-medium text-blue-300">
          Simulation Mode - Development Data
        </p>
        <p class="text-xs text-blue-400/70 mt-1">
          Real water monitoring data coming soon. Currently showing simulated
          values.
        </p>
      </div>
    </div>

    <!-- Summary Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-xs text-slate-400 uppercase font-medium mb-1">
              Total Consumption
            </p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-white">{{
                formatNumber(waterData.totalConsumption)
              }}</span>
              <span class="text-xs text-slate-400">L</span>
            </div>
          </div>
          <div class="p-2 bg-cyan-500/10 rounded-lg">
            <Droplets class="text-cyan-400" :size="20" />
          </div>
        </div>
        <div class="flex items-center gap-1 text-xs">
          <TrendingUp class="text-emerald-400" :size="14" />
          <span class="text-emerald-400 font-semibold">+2.1%</span>
          <span class="text-slate-500">vs yesterday</span>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-xs text-slate-400 uppercase font-medium mb-1">
              Flow Rate
            </p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-white">{{
                formatNumber(waterData.flowRate, 1)
              }}</span>
              <span class="text-xs text-slate-400">L/min</span>
            </div>
          </div>
          <div class="p-2 bg-blue-500/10 rounded-lg">
            <Activity class="text-blue-400" :size="20" />
          </div>
        </div>
        <p class="text-xs text-slate-500">Operating range: 30-50 L/min</p>
      </div>

      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-xs text-slate-400 uppercase font-medium mb-1">
              Water Quality
            </p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-white">{{
                formatNumber(waterData.quality, 1)
              }}</span>
              <span class="text-xs text-slate-400">%</span>
            </div>
          </div>
          <div class="p-2 bg-emerald-500/10 rounded-lg">
            <TrendingUp class="text-emerald-400" :size="20" />
          </div>
        </div>
        <p class="text-xs text-slate-500">Target: >90%</p>
      </div>

      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-xs text-slate-400 uppercase font-medium mb-1">
              Temperature
            </p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-white">{{
                formatNumber(waterData.temperature)
              }}</span>
              <span class="text-xs text-slate-400">°C</span>
            </div>
          </div>
          <div class="p-2 bg-blue-500/10 rounded-lg">
            <Activity class="text-blue-400" :size="20" />
          </div>
        </div>
        <p class="text-xs text-slate-500">Normal: 20-30°C</p>
      </div>
    </div>

    <!-- Historical Trend -->
    <div
      class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6"
    >
      <h2 class="text-lg font-bold text-white mb-4">
        24-Hour Consumption Trend
      </h2>
      <div class="overflow-x-auto">
        <div class="flex gap-2 min-w-max pb-4">
          <div
            v-for="data in historicalData"
            :key="data.hour"
            class="flex flex-col items-center"
          >
            <div
              class="w-12 bg-cyan-500/20 rounded-t"
              :style="{
                height: `${(data.consumption / 20000) * 200}px`,
                minHeight: '20px',
              }"
            ></div>
            <span class="text-xs text-slate-500 mt-2">{{ data.hour }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.water-dashboard {
  padding: 32px;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

@media (max-width: 1280px) {
  .water-dashboard {
    padding: 24px;
    max-width: 1200px;
  }
}

@media (max-width: 768px) {
  .water-dashboard {
    padding: 16px;
  }
}

@media (min-width: 1920px) {
  .water-dashboard {
    max-width: 1800px;
    padding: 40px;
  }
}
</style>
