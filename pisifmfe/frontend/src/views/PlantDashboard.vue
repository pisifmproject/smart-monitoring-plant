<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Factory,
  Activity,
  Zap,
  AlertTriangle,
  ArrowLeft,
  TrendingUp,
  Clock,
  AlertCircle,
  AlertOctagon,
  Info,
  Flame,
  Cloud,
  Droplets,
  Wind,
  Box,
} from "lucide-vue-next";
import axios from "axios";

const route = useRoute();
const router = useRouter();

type Period = "DAY" | "WEEK" | "MONTH" | "YEAR";

const period = ref<Period>("DAY");
const plantId = computed(() => route.params.plantId as string);

interface PlantKPIs {
  totalOutput: number;
  avgOEE: number;
  totalEnergy: number;
  totalAlarmsValue: number;
}

interface UtilityMetric {
  type: string;
  value: number;
  unit: string;
  icon: string;
}

interface Shift {
  name: string;
  time: string;
  output: number;
  oee: number;
  status: string;
}

interface Alarm {
  id: string;
  title: string;
  source: string;
  severity: string;
}

interface ProductionLine {
  id: string;
  name: string;
  output: number;
  oee: number;
  status: string;
}

const plantData = ref<any>(null);
const kpis = ref<PlantKPIs | null>(null);
const utilityMetrics = ref<UtilityMetric[]>([]);
const shifts = ref<Shift[]>([]);
const activeAlarms = ref<Alarm[]>([]);
const productionLines = ref<ProductionLine[]>([]);

const plantNames: Record<string, string> = {
  CIKOKOL: "Plant Cikokol",
  SEMARANG: "Plant Semarang",
  CIKUPA: "Plant Cikupa",
  AGRO: "Plant Agro",
};

const plantLocations: Record<string, string> = {
  CIKOKOL: "TANGERANG",
  SEMARANG: "CENTRAL JAVA",
  CIKUPA: "TANGERANG",
  AGRO: "DEVELOPMENT",
};

const getUtilityIcon = (type: string) => {
  switch (type) {
    case "Electricity":
      return Zap;
    case "Steam":
      return Cloud;
    case "Water":
      return Droplets;
    case "Compressed Air":
      return Wind;
    case "Nitrogen":
      return Box;
    case "Natural Gas":
      return Flame;
    default:
      return Zap;
  }
};

const getAlarmIcon = (severity: string) => {
  switch (severity) {
    case "CRITICAL":
      return AlertOctagon;
    case "WARNING":
      return AlertTriangle;
    case "INFO":
      return Info;
    default:
      return AlertCircle;
  }
};

const getAlarmColor = (severity: string) => {
  switch (severity) {
    case "CRITICAL":
      return "text-rose-500";
    case "WARNING":
      return "text-amber-500";
    case "INFO":
      return "text-blue-500";
    default:
      return "text-slate-500";
  }
};

const fetchPlantData = async () => {
  try {
    const response = await axios.get(
      `/api/dashboard/plant/${plantId.value}?period=${period.value}`
    );
    if (response.data.success) {
      kpis.value = response.data.kpis;
      utilityMetrics.value = response.data.utilityMetrics;
      shifts.value = response.data.shifts;
      activeAlarms.value = response.data.activeAlarms;
      productionLines.value = response.data.productionLines;
      plantData.value = response.data.plant;
    }
  } catch (error) {
    console.error("Error fetching plant data:", error);
  }
};

onMounted(() => {
  fetchPlantData();
});

const handlePeriodChange = (newPeriod: Period) => {
  period.value = newPeriod;
  fetchPlantData();
};

const goBackToGlobal = () => {
  router.push("/app/global");
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(Math.round(num));
};
</script>

<template>
  <div class="space-y-6 w-full">
    <!-- Header with Back Button -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-4">
        <button
          @click="goBackToGlobal"
          class="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
        >
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1
            class="text-2xl font-bold text-white tracking-tight flex items-center gap-3"
          >
            <Factory class="text-blue-500" :size="28" />
            {{ plantNames[plantId] || plantId }}
          </h1>
          <p class="text-slate-300 text-sm font-medium mt-1">
            {{ plantLocations[plantId] || "" }}
          </p>
        </div>
      </div>
      <div
        class="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1 self-start sm:self-auto"
      >
        <button
          v-for="p in ['DAY', 'WEEK', 'MONTH', 'YEAR']"
          :key="p"
          @click="handlePeriodChange(p as Period)"
          :class="[
            'px-3 py-1.5 text-xs font-bold rounded-md transition-all',
            period === p
              ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-900/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800',
          ]"
        >
          {{ p }}
        </button>
      </div>
    </div>

    <!-- KPIs Section -->
    <div
      v-if="kpis"
      class="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
    >
      <h2 class="text-lg font-bold text-white mb-4">Plant At a Glance</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Output -->
        <div
          class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <span
              class="text-xs font-medium text-slate-400 uppercase tracking-wider"
              >Output ({{ period }})</span
            >
            <Factory :size="20" class="text-blue-400" />
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold text-white">{{
              formatNumber(kpis.totalOutput)
            }}</span>
            <span class="text-sm text-slate-400">kg</span>
          </div>
          <div class="flex items-center gap-1 mt-2">
            <TrendingUp :size="14" class="text-emerald-400" />
            <span class="text-xs text-emerald-400">3.2% vs yesterday</span>
          </div>
        </div>

        <!-- OEE -->
        <div
          class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-emerald-500/50 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <span
              class="text-xs font-medium text-slate-400 uppercase tracking-wider"
              >OEE</span
            >
            <Activity :size="20" class="text-emerald-400" />
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold text-white">{{
              kpis.avgOEE.toFixed(1)
            }}</span>
            <span class="text-sm text-slate-400">%</span>
          </div>
          <div class="flex items-center gap-1 mt-2">
            <TrendingUp :size="14" class="text-emerald-400" />
            <span class="text-xs text-emerald-400">0.5% vs yesterday</span>
          </div>
        </div>

        <!-- Energy -->
        <div
          class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-yellow-500/50 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <span
              class="text-xs font-medium text-slate-400 uppercase tracking-wider"
              >Energy ({{ period }})</span
            >
            <Zap :size="20" class="text-yellow-400" />
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold text-white">{{
              formatNumber(kpis.totalEnergy)
            }}</span>
            <span class="text-sm text-slate-400">kWh</span>
          </div>
          <div class="flex items-center gap-1 mt-2">
            <TrendingUp :size="14" class="text-rose-400 rotate-180" />
            <span class="text-xs text-emerald-400">1.1% vs yesterday</span>
          </div>
        </div>

        <!-- Alarms -->
        <div
          class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-rose-500/50 transition-all"
        >
          <div class="flex items-center justify-between mb-3">
            <span
              class="text-xs font-medium text-slate-400 uppercase tracking-wider"
              >Total Alarms</span
            >
            <AlertTriangle :size="20" class="text-rose-400" />
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold text-white">{{
              kpis.totalAlarmsValue
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Utility Consumption -->
    <div
      v-if="utilityMetrics.length > 0"
      class="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
    >
      <h2 class="text-lg font-bold text-white mb-4">
        Utility Consumption ({{ period }})
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          v-for="utility in utilityMetrics"
          :key="utility.type"
          class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/30 transition-all"
        >
          <component
            :is="getUtilityIcon(utility.type)"
            :size="24"
            class="text-blue-400 mb-2"
          />
          <div class="text-xs text-slate-400 mb-1">{{ utility.type }}</div>
          <div class="text-lg font-bold text-white">
            {{ formatNumber(utility.value) }}
          </div>
          <div class="text-xs text-slate-500">{{ utility.unit }}</div>
        </div>
      </div>
    </div>

    <!-- Shift Performance and Active Alarms Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Shift Performance -->
      <div
        v-if="shifts.length > 0"
        class="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-xl p-6"
      >
        <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Clock :size="20" class="text-blue-400" />
          Shift Performance
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-800">
                <th
                  class="text-left text-xs font-medium text-slate-400 uppercase tracking-wider py-3 px-4"
                >
                  Shift
                </th>
                <th
                  class="text-left text-xs font-medium text-slate-400 uppercase tracking-wider py-3 px-4"
                >
                  Time
                </th>
                <th
                  class="text-right text-xs font-medium text-slate-400 uppercase tracking-wider py-3 px-4"
                >
                  Output (kg)
                </th>
                <th
                  class="text-right text-xs font-medium text-slate-400 uppercase tracking-wider py-3 px-4"
                >
                  OEE
                </th>
                <th
                  class="text-center text-xs font-medium text-slate-400 uppercase tracking-wider py-3 px-4"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="shift in shifts"
                :key="shift.name"
                class="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
              >
                <td class="py-3 px-4 text-sm font-medium text-white">
                  {{ shift.name }}
                </td>
                <td class="py-3 px-4 text-sm text-slate-300">
                  {{ shift.time }}
                </td>
                <td class="py-3 px-4 text-sm text-white text-right">
                  {{ formatNumber(shift.output) }}
                </td>
                <td
                  class="py-3 px-4 text-sm text-emerald-400 text-right font-medium"
                >
                  {{ shift.oee }}%
                </td>
                <td class="py-3 px-4 text-center">
                  <span
                    :class="[
                      'inline-block px-2 py-1 text-xs font-bold uppercase rounded-md',
                      shift.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : shift.status === 'ACTIVE'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-700 text-slate-400',
                    ]"
                  >
                    {{ shift.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Active Alarms -->
      <div
        v-if="activeAlarms.length > 0"
        class="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
      >
        <h2 class="text-lg font-bold text-white mb-4">Active Alarms</h2>
        <div class="space-y-3 max-h-96 overflow-y-auto">
          <div
            v-for="alarm in activeAlarms"
            :key="alarm.id"
            class="bg-slate-800/50 border border-slate-700 rounded-lg p-3 hover:border-rose-500/30 transition-all cursor-pointer"
          >
            <div class="flex items-start gap-3">
              <component
                :is="getAlarmIcon(alarm.severity)"
                :size="16"
                :class="getAlarmColor(alarm.severity)"
              />
              <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-white truncate">
                  {{ alarm.title }}
                </div>
                <div class="text-xs text-slate-400 mt-1">
                  {{ alarm.source }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Production Lines -->
    <div
      v-if="productionLines.length > 0"
      class="bg-slate-900/50 border border-slate-800 rounded-xl p-6"
    >
      <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <Activity :size="20" class="text-emerald-400" />
        Production Lines
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="line in productionLines"
          :key="line.id"
          class="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-emerald-500/50 transition-all cursor-pointer"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm font-bold text-white">{{ line.name }}</span>
            <span
              :class="[
                'inline-block px-2 py-0.5 text-xs font-bold uppercase rounded',
                line.status === 'RUNNING'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-slate-700 text-slate-400',
              ]"
            >
              {{ line.status }}
            </span>
          </div>
          <div class="space-y-2">
            <div>
              <div class="text-xs text-slate-400">OUTPUT</div>
              <div class="text-lg font-bold text-white">
                {{ formatNumber(line.output) }}
                <span class="text-xs text-slate-400">kg</span>
              </div>
            </div>
            <div>
              <div class="text-xs text-slate-400">OEE</div>
              <div class="text-lg font-bold text-emerald-400">
                {{ line.oee }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
