<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";
import { Globe, Activity, Zap, AlertTriangle, Factory } from "lucide-vue-next";
import axios from "axios";

const API_URL = "http://localhost:2000/api";

const router = useRouter();
const { currentUser } = useAuth();

type Period = "DAY" | "WEEK" | "MONTH" | "YEAR";

const period = ref<Period>("DAY");
const kpis = ref({
  totalOutput: 0,
  totalEnergy: 0,
  avgOEE: 0,
  totalAlarmsValue: 0,
});

const plants = ref<any[]>([]);
const loading = ref(true);

const FilterButton = ({ label }: { label: Period }) => {
  return {
    label,
    isActive: period.value === label,
    onClick: () => {
      period.value = label;
      fetchData();
    },
  };
};

const filterButtons = computed(() => [
  FilterButton({ label: "DAY" }),
  FilterButton({ label: "WEEK" }),
  FilterButton({ label: "MONTH" }),
  FilterButton({ label: "YEAR" }),
]);

const showAlarms = computed(() => {
  const role = currentUser.value?.role;
  return role !== "Viewer" && role !== "Management";
});

const formatNumber = (value: number, decimals = 0) => {
  const maxDecimals = Math.min(decimals, 2); // Global rule: max 2 decimals
  return value.toFixed(maxDecimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await axios.get(`${API_URL}/dashboard/global`, {
      params: { period: period.value },
    });
    kpis.value = response.data.kpis;
    plants.value = response.data.plants;
  } catch (error) {
    console.error("Error fetching global dashboard data:", error);
    // Fallback to dummy data if API fails
    const multiplier =
      period.value === "DAY"
        ? 1
        : period.value === "WEEK"
        ? 7
        : period.value === "MONTH"
        ? 30
        : 365;

    kpis.value = {
      totalOutput: 48600 * multiplier,
      totalEnergy: 11600 * multiplier,
      avgOEE: 78.8,
      totalAlarmsValue: 5,
    };

    plants.value = [
      {
        id: "CIKOKOL",
        name: "Plant Cikokol",
        location: "TANGERANG",
        status: "WARNING",
        output: 15000,
        oee: 81.8,
        energy: 3200,
        alarms: 2,
      },
      {
        id: "SEMARANG",
        name: "Plant Semarang",
        location: "CENTRAL JAVA",
        status: "WARNING",
        output: 18000,
        oee: 78.26,
        energy: 4100,
        alarms: 3,
      },
      {
        id: "CIKUPA",
        name: "Plant Cikupa",
        location: "TANGERANG",
        status: "WARNING",
        output: 15600,
        oee: 85.38,
        energy: 3800,
        alarms: 3,
      },
      {
        id: "AGRO",
        name: "Plant Agro",
        location: "DEVELOPMENT",
        status: "WARNING",
        output: 0,
        oee: 69.7,
        energy: 500,
        alarms: 1,
      },
    ];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-500 p-6">
    <!-- Header with Period Filter -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-bold text-white tracking-tight flex items-center gap-3"
        >
          <Globe class="text-blue-500" :size="28" />
          Corporate Overview
        </h1>
        <p class="text-slate-300 text-sm font-medium mt-1">
          Multi-Plant Performance Monitor
        </p>
      </div>
      <div
        class="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1 self-start sm:self-auto"
      >
        <button
          v-for="btn in filterButtons"
          :key="btn.label"
          @click="btn.onClick"
          :class="[
            'px-3 py-1.5 text-xs font-bold rounded-md transition-all',
            btn.isActive
              ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-900/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800',
          ]"
        >
          {{ btn.label }}
        </button>
      </div>
    </div>

    <!-- Global KPIs Card -->
    <div
      class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6"
    >
      <h2
        class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4"
      >
        Global Performance At a Glance
      </h2>
      <div
        :class="[
          'grid grid-cols-1 sm:grid-cols-2 gap-5',
          showAlarms ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
        ]"
      >
        <!-- Total Output -->
        <div class="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-slate-400 text-xs font-medium uppercase mb-1">
                Total Output ({{ period }})
              </p>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{{
                  formatNumber(kpis.totalOutput)
                }}</span>
                <span class="text-xs text-slate-400">kg</span>
              </div>
            </div>
            <div class="p-2 bg-blue-500/10 rounded-lg">
              <Factory class="text-blue-400" :size="20" />
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-emerald-400 font-semibold">↑ 2.5%</span>
            <span class="text-slate-500">vs yesterday</span>
          </div>
        </div>

        <!-- Global OEE -->
        <div class="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-slate-400 text-xs font-medium uppercase mb-1">
                Global Avg OEE
              </p>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{{
                  formatNumber(kpis.avgOEE, 1)
                }}</span>
                <span class="text-xs text-slate-400">%</span>
              </div>
            </div>
            <div class="p-2 bg-emerald-500/10 rounded-lg">
              <Activity class="text-emerald-400" :size="20" />
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-emerald-400 font-semibold">↑ 1.2%</span>
            <span class="text-slate-500">vs yesterday</span>
          </div>
        </div>

        <!-- Total Energy -->
        <div class="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50">
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-slate-400 text-xs font-medium uppercase mb-1">
                Total Energy ({{ period }})
              </p>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{{
                  formatNumber(kpis.totalEnergy)
                }}</span>
                <span class="text-xs text-slate-400">kWh</span>
              </div>
            </div>
            <div class="p-2 bg-yellow-500/10 rounded-lg">
              <Zap class="text-yellow-400" :size="20" />
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-rose-400 font-semibold">↓ 0.8%</span>
            <span class="text-slate-500">vs yesterday</span>
          </div>
        </div>

        <!-- Active Alarms -->
        <div
          v-if="showAlarms"
          class="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-slate-400 text-xs font-medium uppercase mb-1">
                Active Alarms
              </p>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{{
                  kpis.totalAlarmsValue
                }}</span>
              </div>
            </div>
            <div class="p-2 bg-rose-500/10 rounded-lg">
              <AlertTriangle class="text-rose-400" :size="20" />
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-slate-400">Across all plants</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Plant Status Overview -->
    <div>
      <h2
        class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"
      >
        <Factory :size="16" />
        Plant Status Overview
      </h2>
      <div v-if="loading" class="text-center py-12 text-slate-400">
        Loading plants data...
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          v-for="plant in plants"
          :key="plant.id"
          @click="router.push(`/app/plant/${plant.id}`)"
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 hover:border-blue-500 transition-all cursor-pointer group"
        >
          <!-- Plant Header -->
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3
                class="text-lg font-bold text-white group-hover:text-blue-400 transition-colors"
              >
                {{ plant.name }}
              </h3>
              <p class="text-xs text-slate-400 uppercase tracking-wide">
                {{ plant.location }}
              </p>
            </div>
            <span
              :class="[
                'px-2 py-1 rounded text-[10px] font-bold uppercase',
                plant.status === 'NORMAL'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-yellow-500/10 text-yellow-400',
              ]"
            >
              {{ plant.status }}
            </span>
          </div>

          <!-- Metrics -->
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-400 uppercase">Output</span>
              <div class="flex items-baseline gap-1">
                <span class="text-sm font-bold text-white">{{
                  formatNumber(plant.output)
                }}</span>
                <span class="text-[10px] text-slate-500">kg</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-400 uppercase">OEE</span>
              <div class="flex items-baseline gap-1">
                <span
                  :class="[
                    'text-sm font-bold',
                    plant.oee >= 85
                      ? 'text-emerald-400'
                      : plant.oee >= 70
                      ? 'text-yellow-400'
                      : 'text-rose-400',
                  ]"
                  >{{ formatNumber(plant.oee, 2) }}</span
                >
                <span class="text-[10px] text-slate-500">%</span>
              </div>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-400 uppercase">Energy</span>
              <div class="flex items-baseline gap-1">
                <span class="text-sm font-bold text-white">{{
                  formatNumber(plant.energy)
                }}</span>
                <span class="text-[10px] text-slate-500">kWh</span>
              </div>
            </div>
            <div
              v-if="showAlarms"
              class="flex justify-between items-center pt-2 border-t border-slate-700/50"
            >
              <span class="text-xs text-slate-400 uppercase">Alarms</span>
              <span
                :class="[
                  'text-sm font-bold',
                  plant.alarms > 0 ? 'text-rose-400' : 'text-slate-400',
                ]"
                >{{ plant.alarms }} Active</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
