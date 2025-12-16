<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";
import { Globe, Activity, Zap, AlertTriangle, Factory } from "lucide-vue-next";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000/api";

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
  return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await axios.get(
      `${API_URL}/dashboard/global?period=${period.value}`
    );
    kpis.value = response.data.kpis;
    plants.value = response.data.plants;
  } catch (error) {
    console.error("Error fetching global dashboard data:", error);
  } finally {
    loading.value = false;
  }
};

const navigateToPlant = (plantId: string, hasAccess: boolean) => {
  if (hasAccess) {
    router.push(`/app/plant/${plantId}`);
  }
};

const hasPlantAccess = (plantId: string) => {
  if (!currentUser.value) return false;
  const role = currentUser.value.role;
  if (role === "Administrator") return true;
  return currentUser.value.plantAccess?.includes(plantId) || false;
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-500 w-full">
    <!-- Header -->
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
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
              : 'text-slate-300 hover:text-white hover:bg-slate-800',
          ]"
        >
          {{ btn.label }}
        </button>
      </div>
    </div>

    <!-- Global KPIs -->
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-sm">
      <h3 class="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wide">
        Global Performance At a Glance
      </h3>
      <div
        :class="[
          'grid grid-cols-1 sm:grid-cols-2 gap-5',
          !showAlarms ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
        ]"
      >
        <!-- Total Output -->
        <div class="bg-slate-900 border border-slate-700 rounded-lg p-5">
          <div class="flex items-start justify-between mb-3">
            <div>
              <p
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >
                Total Output ({{ period }})
              </p>
            </div>
            <Factory :size="20" class="text-blue-400" />
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-white font-mono">{{
              formatNumber(kpis.totalOutput)
            }}</span>
            <span class="text-sm text-slate-400">kg</span>
          </div>
          <div class="mt-2 flex items-center gap-1 text-emerald-400 text-xs">
            <span>▲</span>
            <span>2.5% vs yesterday</span>
          </div>
        </div>

        <!-- Global Avg OEE -->
        <div class="bg-slate-900 border border-slate-700 rounded-lg p-5">
          <div class="flex items-start justify-between mb-3">
            <div>
              <p
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >
                Global Avg OEE
              </p>
            </div>
            <Activity :size="20" class="text-emerald-400" />
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-white font-mono">{{
              formatNumber(kpis.avgOEE, 1)
            }}</span>
            <span class="text-sm text-slate-400">%</span>
          </div>
          <div class="mt-2 flex items-center gap-1 text-emerald-400 text-xs">
            <span>▲</span>
            <span>1.2% vs yesterday</span>
          </div>
        </div>

        <!-- Total Energy -->
        <div class="bg-slate-900 border border-slate-700 rounded-lg p-5">
          <div class="flex items-start justify-between mb-3">
            <div>
              <p
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >
                Total Energy ({{ period }})
              </p>
            </div>
            <Zap :size="20" class="text-yellow-400" />
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-white font-mono">{{
              formatNumber(kpis.totalEnergy)
            }}</span>
            <span class="text-sm text-slate-400">kWh</span>
          </div>
          <div class="mt-2 flex items-center gap-1 text-rose-400 text-xs">
            <span>▼</span>
            <span>0.8% vs yesterday</span>
          </div>
        </div>

        <!-- Active Alarms -->
        <div
          v-if="showAlarms"
          class="bg-slate-900 border border-slate-700 rounded-lg p-5"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <p
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
              >
                Active Alarms
              </p>
            </div>
            <AlertTriangle :size="20" class="text-rose-400" />
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold text-white font-mono">{{
              kpis.totalAlarmsValue
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Plant Status Overview -->
    <div class="space-y-4">
      <h2 class="text-lg font-bold text-white flex items-center gap-2">
        <Factory :size="20" class="text-slate-300" />
        Plant Status Overview
      </h2>
      <div
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-5"
      >
        <div
          v-for="plant in plants"
          :key="plant.id"
          @click="navigateToPlant(plant.id, hasPlantAccess(plant.id))"
          :class="[
            'bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm transition-all duration-300 group relative overflow-hidden',
            hasPlantAccess(plant.id)
              ? 'hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer'
              : 'cursor-default',
          ]"
        >
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3
                :class="[
                  'text-lg font-bold transition-colors',
                  hasPlantAccess(plant.id)
                    ? 'text-white group-hover:text-blue-400'
                    : 'text-white',
                ]"
              >
                {{ plant.name }}
              </h3>
              <p
                class="text-xs text-slate-300 font-semibold uppercase tracking-wider mt-1"
              >
                {{ plant.location }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span
                v-if="
                  currentUser?.role !== 'Management' &&
                  plant.computedStatus !== 'NORMAL'
                "
                :class="[
                  'px-2 py-1 text-xs font-bold rounded uppercase',
                  plant.computedStatus === 'WARNING'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : plant.computedStatus === 'CRITICAL'
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
                ]"
              >
                {{ plant.computedStatus }}
              </span>
            </div>
          </div>

          <div
            class="grid grid-cols-2 gap-y-5 gap-x-4 relative z-10 pt-4 mt-4 border-t border-slate-700/50"
          >
            <div>
              <p
                class="text-slate-300 text-xs font-bold uppercase tracking-wider"
              >
                Output
              </p>
              <p class="text-white font-mono font-bold text-lg">
                {{ formatNumber(plant.scaledOutput) }}
                <span class="text-xs font-normal text-slate-400">kg</span>
              </p>
            </div>
            <div>
              <p
                class="text-slate-300 text-xs font-bold uppercase tracking-wider"
              >
                OEE
              </p>
              <p
                :class="[
                  'font-mono font-bold text-lg',
                  plant.scaledOEE >= 80
                    ? 'text-emerald-400'
                    : plant.scaledOEE >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400',
                ]"
              >
                {{ formatNumber(plant.scaledOEE, 1) }}%
              </p>
            </div>
            <div>
              <p
                class="text-slate-300 text-xs font-bold uppercase tracking-wider"
              >
                Energy
              </p>
              <p class="text-yellow-400 font-mono font-bold">
                {{ formatNumber(plant.scaledEnergy) }}
                <span class="text-xs font-normal text-slate-400">kWh</span>
              </p>
            </div>
            <div v-if="showAlarms">
              <p
                class="text-slate-300 text-xs font-bold uppercase tracking-wider"
              >
                Alarms
              </p>
              <p
                :class="[
                  'font-mono font-bold',
                  plant.alarmCount > 0 ? 'text-rose-400' : 'text-slate-300',
                ]"
              >
                {{ plant.alarmCount }} Active
              </p>
            </div>
          </div>

          <div
            v-if="hasPlantAccess(plant.id)"
            class="absolute -top-8 -right-8 w-36 h-36 bg-slate-700/10 rounded-full pointer-events-none group-hover:scale-125 group-hover:bg-blue-900/20 transition-transform duration-300"
          ></div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="text-white">Loading...</div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-in {
  animation: fadeIn 0.5s ease-in-out;
}

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
</style>
