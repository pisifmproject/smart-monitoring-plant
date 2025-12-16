<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { Wind, TrendingUp, AlertTriangle, Activity } from "lucide-vue-next";

const route = useRoute();
const plantId = computed(() => route.params.plantId as string);

const airData = ref({
  totalConsumption: 0,
  pressure: 0,
  flowRate: 0,
  dewPoint: 0,
  efficiency: 0,
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
  airData.value = {
    totalConsumption: 8500 + Math.random() * 1500,
    pressure: 6.5 + Math.random() * 1.5,
    flowRate: 120 + Math.random() * 40,
    dewPoint: -40 + Math.random() * 10,
    efficiency: 82 + Math.random() * 13,
    status: Math.random() > 0.85 ? "WARNING" : "NORMAL",
  };

  historicalData.value = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    consumption: 8000 + Math.random() * 2000,
    pressure: 6 + Math.random() * 2,
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
  <div class="air-dashboard">
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <div class="flex items-center gap-3">
            <div class="p-2 bg-sky-500/10 rounded-lg">
              <Wind class="text-sky-400" :size="28" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-white">
                Compressed Air Monitoring
              </h1>
              <p class="text-sm text-slate-400">
                Plant {{ plantId }} - Real-time Air System
              </p>
            </div>
          </div>
        </div>
        <div
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold uppercase border',
            getStatusColor(airData.status),
          ]"
        >
          {{ airData.status }}
        </div>
      </div>
    </div>

    <div
      class="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3"
    >
      <AlertTriangle class="text-blue-400 flex-shrink-0 mt-0.5" :size="20" />
      <div>
        <p class="text-sm font-medium text-blue-300">
          Simulation Mode - Development Data
        </p>
        <p class="text-xs text-blue-400/70 mt-1">
          Real compressed air monitoring coming soon. Currently showing
          simulated values.
        </p>
      </div>
    </div>

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
                formatNumber(airData.totalConsumption)
              }}</span>
              <span class="text-xs text-slate-400">m³</span>
            </div>
          </div>
          <div class="p-2 bg-sky-500/10 rounded-lg">
            <Wind class="text-sky-400" :size="20" />
          </div>
        </div>
        <div class="flex items-center gap-1 text-xs">
          <TrendingUp class="text-emerald-400" :size="14" />
          <span class="text-emerald-400 font-semibold">+1.8%</span>
          <span class="text-slate-500">vs yesterday</span>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-xs text-slate-400 uppercase font-medium mb-1">
              System Pressure
            </p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-white">{{
                formatNumber(airData.pressure, 2)
              }}</span>
              <span class="text-xs text-slate-400">bar</span>
            </div>
          </div>
          <div class="p-2 bg-blue-500/10 rounded-lg">
            <Activity class="text-blue-400" :size="20" />
          </div>
        </div>
        <p class="text-xs text-slate-500">Operating range: 6-8 bar</p>
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
                formatNumber(airData.flowRate)
              }}</span>
              <span class="text-xs text-slate-400">m³/h</span>
            </div>
          </div>
          <div class="p-2 bg-cyan-500/10 rounded-lg">
            <Wind class="text-cyan-400" :size="20" />
          </div>
        </div>
        <p class="text-xs text-slate-500">Target: 100-160 m³/h</p>
      </div>

      <div
        class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <p class="text-xs text-slate-400 uppercase font-medium mb-1">
              System Efficiency
            </p>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-white">{{
                formatNumber(airData.efficiency, 1)
              }}</span>
              <span class="text-xs text-slate-400">%</span>
            </div>
          </div>
          <div class="p-2 bg-emerald-500/10 rounded-lg">
            <TrendingUp class="text-emerald-400" :size="20" />
          </div>
        </div>
        <p class="text-xs text-slate-500">Target: >80%</p>
      </div>
    </div>

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
              class="w-12 bg-sky-500/20 rounded-t"
              :style="{
                height: `${(data.consumption / 10000) * 200}px`,
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
.air-dashboard {
  padding: 32px;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

@media (max-width: 1280px) {
  .air-dashboard {
    padding: 24px;
    max-width: 1200px;
  }
}

@media (max-width: 768px) {
  .air-dashboard {
    padding: 16px;
  }
}

@media (min-width: 1920px) {
  .air-dashboard {
    max-width: 1800px;
    padding: 40px;
  }
}
</style>
