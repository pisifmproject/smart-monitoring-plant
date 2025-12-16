<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Zap, Activity, TrendingUp, AlertCircle } from "lucide-vue-next";

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

// Dummy utility metrics
const utilityMetrics = [
  {
    name: "Total Power Consumption",
    value: "1,234 kWh",
    change: "+5.2%",
    trend: "up",
    icon: Zap,
    color: "blue",
  },
  {
    name: "Current Load",
    value: "850 kW",
    change: "-2.1%",
    trend: "down",
    icon: Activity,
    color: "green",
  },
  {
    name: "Peak Demand",
    value: "1,050 kW",
    change: "+3.8%",
    trend: "up",
    icon: TrendingUp,
    color: "yellow",
  },
  {
    name: "Active Alerts",
    value: "2",
    change: "0",
    trend: "neutral",
    icon: AlertCircle,
    color: "red",
  },
];
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-white">Energy & Utilities</h1>
        <p class="text-slate-400 mt-1">
          Plant {{ plantName }} - Utility Monitoring Overview
        </p>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="metric in utilityMetrics"
        :key="metric.name"
        class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
      >
        <div class="flex items-start justify-between mb-4">
          <div
            :class="[
              'p-3 rounded-lg',
              metric.color === 'blue'
                ? 'bg-blue-500/10 text-blue-400'
                : metric.color === 'green'
                ? 'bg-green-500/10 text-green-400'
                : metric.color === 'yellow'
                ? 'bg-yellow-500/10 text-yellow-400'
                : 'bg-red-500/10 text-red-400',
            ]"
          >
            <component :is="metric.icon" :size="24" />
          </div>
          <span
            :class="[
              'text-xs font-semibold px-2 py-1 rounded',
              metric.trend === 'up'
                ? 'bg-red-500/10 text-red-400'
                : metric.trend === 'down'
                ? 'bg-green-500/10 text-green-400'
                : 'bg-slate-500/10 text-slate-400',
            ]"
          >
            {{ metric.change }}
          </span>
        </div>
        <h3 class="text-2xl font-bold text-white mb-1">{{ metric.value }}</h3>
        <p class="text-slate-400 text-sm">{{ metric.name }}</p>
      </div>
    </div>

    <!-- Electrical Systems Section -->
    <div
      class="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
    >
      <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Zap :size="24" class="text-blue-400" />
        Electrical Systems
      </h2>
      <p class="text-slate-400 mb-4">
        Access detailed electrical monitoring and panel distribution data
      </p>
      <div class="flex gap-3">
        <router-link
          :to="`/app/plant/${plantId}/electrical/panels`"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          View Panel Distribution
        </router-link>
        <router-link
          v-if="plantId?.toUpperCase() === 'CIKUPA'"
          :to="`/app/plant/${plantId}/electrical/panel1`"
          class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
        >
          Individual Panels
        </router-link>
      </div>
    </div>

    <!-- Coming Soon Section -->
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
