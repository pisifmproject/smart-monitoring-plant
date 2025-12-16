<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Factory, Activity, TrendingUp, AlertCircle } from "lucide-vue-next";
import axios from "axios";

const route = useRoute();
const plantId = computed(() => route.params.plantId as string);

interface ProductionLine {
  id: string;
  name: string;
  output: number;
  oee: number;
  status: string;
  speed: number;
  target: number;
}

const productionLines = ref<ProductionLine[]>([]);
const loading = ref(true);

const plantNames: Record<string, string> = {
  CIKOKOL: "Plant Cikokol",
  SEMARANG: "Plant Semarang",
  CIKUPA: "Plant Cikupa",
  AGRO: "Plant Agro",
};

const fetchProductionLines = async () => {
  loading.value = true;
  try {
    // Generate dummy production lines data
    const baseLines = [
      { id: "pc39", name: "PC39", multiplier: 1.2 },
      { id: "pc14", name: "PC14", multiplier: 1.4 },
      { id: "tortila", name: "Tortila", multiplier: 1.1 },
      { id: "tws56", name: "TWS 5.6", multiplier: 1.3 },
      { id: "tws72", name: "TWS 7.2", multiplier: 1.15 },
      { id: "fcp", name: "FCP", multiplier: 1.0 },
      { id: "copack", name: "Cassava Copack", multiplier: 0.9 },
      { id: "cassava", name: "Cassava Inhouse", multiplier: 1.25 },
    ];

    productionLines.value = baseLines.map((line) => {
      const baseOutput =
        Math.floor(Math.random() * 2000 + 1000) * line.multiplier;
      const target = Math.floor(baseOutput * 1.2);
      const oee = Math.min(95, Math.floor(Math.random() * 20 + 75));
      const status =
        Math.random() > 0.2
          ? "RUNNING"
          : Math.random() > 0.5
          ? "IDLE"
          : "MAINTENANCE";

      return {
        id: line.id,
        name: line.name,
        output: Math.floor(baseOutput),
        oee,
        status,
        speed: Math.floor(Math.random() * 30 + 70),
        target,
      };
    });
  } catch (error) {
    console.error("Error fetching production lines:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProductionLines();
});

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(Math.round(num));
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "RUNNING":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "IDLE":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "MAINTENANCE":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
};

const getOEEColor = (oee: number) => {
  if (oee >= 85) return "text-emerald-400";
  if (oee >= 70) return "text-yellow-400";
  return "text-rose-400";
};
</script>

<template>
  <div class="w-full space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1
          class="text-2xl font-bold text-white tracking-tight flex items-center gap-3"
        >
          <Factory class="text-emerald-500" :size="28" />
          Production Lines Overview
        </h1>
        <p class="text-slate-300 text-sm font-medium mt-1">
          {{ plantNames[plantId?.toUpperCase()] || plantId }} - Real-time
          monitoring
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-blue-500"
        ></div>
        <p class="text-slate-400 mt-4">Loading production lines...</p>
      </div>
    </div>

    <!-- Production Lines Grid -->
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="line in productionLines"
        :key="line.id"
        class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all cursor-pointer group"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-emerald-500/30"
            >
              <Factory :size="24" class="text-emerald-400" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">{{ line.name }}</h3>
              <p class="text-xs text-slate-400">Production Line</p>
            </div>
          </div>
          <span
            :class="[
              'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border',
              getStatusColor(line.status),
            ]"
          >
            {{ line.status }}
          </span>
        </div>

        <!-- Metrics -->
        <div class="space-y-4">
          <!-- Output -->
          <div class="bg-slate-800/50 rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs text-slate-400 uppercase tracking-wider"
                >Output Today</span
              >
              <TrendingUp :size="16" class="text-emerald-400" />
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-white">{{
                formatNumber(line.output)
              }}</span>
              <span class="text-sm text-slate-400">kg</span>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <div class="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-all"
                  :style="{
                    width: `${Math.min(
                      100,
                      (line.output / line.target) * 100
                    )}%`,
                  }"
                ></div>
              </div>
              <span class="text-xs text-slate-400"
                >{{ Math.floor((line.output / line.target) * 100) }}%</span
              >
            </div>
          </div>

          <!-- OEE & Speed -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-800/50 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <Activity :size="14" class="text-blue-400" />
                <span class="text-xs text-slate-400">OEE</span>
              </div>
              <div class="flex items-baseline gap-1">
                <span :class="['text-xl font-bold', getOEEColor(line.oee)]">{{
                  line.oee
                }}</span>
                <span class="text-xs text-slate-400">%</span>
              </div>
            </div>
            <div class="bg-slate-800/50 rounded-lg p-3">
              <div class="flex items-center gap-2 mb-1">
                <TrendingUp :size="14" class="text-emerald-400" />
                <span class="text-xs text-slate-400">Speed</span>
              </div>
              <div class="flex items-baseline gap-1">
                <span class="text-xl font-bold text-white">{{
                  line.speed
                }}</span>
                <span class="text-xs text-slate-400">%</span>
              </div>
            </div>
          </div>

          <!-- Target -->
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400">Target:</span>
            <span class="text-slate-300 font-medium"
              >{{ formatNumber(line.target) }} kg</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!loading && productionLines.length === 0"
      class="text-center py-20"
    >
      <AlertCircle :size="48" class="mx-auto text-slate-600 mb-4" />
      <h3 class="text-lg font-bold text-slate-300 mb-2">No Production Lines</h3>
      <p class="text-slate-400">No production lines found for this plant.</p>
    </div>
  </div>
</template>

<style scoped>
/* Smooth animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}
</style>
