<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuth } from "@/stores/auth";
import {
  ArrowLeft,
  Factory,
  Activity,
  Zap,
  AlertTriangle,
  Clock,
  AlertCircle,
  AlertOctagon,
  Info,
  Download,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-vue-next";

const router = useRouter();
const route = useRoute();
const { userRole } = useAuth();

const plantId = computed(() => String(route.params.plantId || ""));

// Period state
type Period = "DAY" | "WEEK" | "MONTH" | "YEAR";
const period = ref<Period>("DAY");

// Download state
const isDownloading = ref(false);
const showDownloadToast = ref(false);

// Mock data for all plants (real data for Cikupa logic handled in parent)
const isCikupa = computed(() => plantId.value.toUpperCase() === "CIKUPA");

// Plant info
const plants: Record<
  string,
  { name: string; location: string; description: string }
> = {
  CIKUPA: {
    name: "Plant Cikupa",
    location: "Cikupa, Banten",
    description: "Main production facility",
  },
  CIKOKOL: {
    name: "Plant Cikokol",
    location: "Cikokol, West Java",
    description: "Secondary facility",
  },
  SEMARANG: {
    name: "Plant Semarang",
    location: "Semarang, Central Java",
    description: "Regional facility",
  },
  AGRO: {
    name: "Plant Agro",
    location: "Bekasi, West Java",
    description: "Agro processing plant",
  },
};

const plant = computed(() => {
  const plantKey = plantId.value.toUpperCase();
  return plants[plantKey] || plants["CIKUPA"];
});

// Mock KPI data
const mockKPIs = {
  output: 12500,
  oee: 85.3,
  energy: 4250,
  alarms: 3,
};

// Mock utility metrics - sesuai dengan image2
const utilityMetrics = [
  {
    key: "ELECTRICITY_USAGE",
    label: "Electricity",
    value: 8643,
    unit: "kWh",
    icon: Zap,
    color: "text-blue-400",
    type: "electricity",
  },
  {
    key: "STEAM_USAGE",
    label: "Steam",
    value: 226,
    unit: "Ton",
    icon: Zap,
    color: "text-orange-400",
    type: "steam",
  },
  {
    key: "WATER_USAGE",
    label: "Water",
    value: 53923,
    unit: "m³",
    icon: Activity,
    color: "text-cyan-400",
    type: "water",
  },
  {
    key: "AIR_USAGE",
    label: "Compressed Air",
    value: 21569,
    unit: "m³",
    icon: Activity,
    color: "text-purple-400",
    type: "air",
  },
  {
    key: "NITROGEN_USAGE",
    label: "Nitrogen",
    value: 54055,
    unit: "m³",
    icon: Activity,
    color: "text-pink-400",
    type: "nitrogen",
  },
  {
    key: "GAS_USAGE",
    label: "Natural Gas",
    value: 14413,
    unit: "m³",
    icon: Zap,
    color: "text-orange-500",
    type: "gas",
  },
];

// Mock shift data
const shifts = [
  {
    id: 1,
    name: "Shift 1",
    time: "06:00 - 14:00",
    output: 4200,
    oee: 0.87,
    status: "COMPLETED",
  },
  {
    id: 2,
    name: "Shift 2",
    time: "14:00 - 22:00",
    output: 4100,
    oee: 0.83,
    status: "COMPLETED",
  },
  {
    id: 3,
    name: "Shift 3",
    time: "22:00 - 06:00",
    output: 3800,
    oee: 0.82,
    status: "ACTIVE",
  },
];

// Mock alarms
const alarms = [
  {
    id: 1,
    severity: "CRITICAL",
    message: "Production Line 1 - Motor Overheating",
    timestamp: "2 min ago",
    source: "PC39",
    machineId: "PC39",
  },
  {
    id: 2,
    severity: "WARNING",
    message: "Compressed Air Pressure Low",
    timestamp: "15 min ago",
    source: "System",
    machineId: null,
  },
  {
    id: 3,
    severity: "INFO",
    message: "Maintenance Due - PC14",
    timestamp: "1 hour ago",
    source: "PC14",
    machineId: "PC14",
  },
];

// Mock production lines
const productionLines = [
  {
    id: "PC39",
    name: "Production Line 39",
    status: "RUNNING",
    output: 2100,
    oee: 0.86,
    hasAlarm: true,
  },
  {
    id: "PC14",
    name: "Production Line 14",
    status: "RUNNING",
    output: 2050,
    oee: 0.84,
    hasAlarm: false,
  },
  {
    id: "FCP",
    name: "Filler & Packaging",
    status: "RUNNING",
    output: 1950,
    oee: 0.85,
    hasAlarm: false,
  },
  {
    id: "COPACK",
    name: "Co-Packing Line",
    status: "IDLE",
    output: 0,
    oee: 0,
    hasAlarm: false,
  },
  {
    id: "WEIGHER",
    name: "Weigher System",
    status: "RUNNING",
    output: 3400,
    oee: 0.88,
    hasAlarm: false,
  },
  {
    id: "BAGMAKER",
    name: "Bag Maker",
    status: "MAINTENANCE",
    output: 0,
    oee: 0,
    hasAlarm: true,
  },
];

const formatNumber = (num: number, decimals = 0) => {
  if (decimals === 0) return num.toLocaleString("id-ID");
  return num.toFixed(decimals);
};

const getAlarmIcon = (
  severity: string
):
  | InstanceType<typeof AlertTriangle>
  | InstanceType<typeof AlertOctagon>
  | InstanceType<typeof Info>
  | InstanceType<typeof AlertCircle> => {
  const iconProps = { size: 16 };
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "RUNNING":
      return "bg-emerald-500/10 text-emerald-400";
    case "IDLE":
      return "bg-slate-600/30 text-slate-400";
    case "MAINTENANCE":
      return "bg-amber-500/10 text-amber-400";
    case "ACTIVE":
      return "bg-emerald-500/20 text-emerald-400";
    case "COMPLETED":
      return "bg-slate-700 text-slate-400";
    default:
      return "bg-slate-700 text-slate-400";
  }
};

const handleDownloadReport = () => {
  if (isDownloading.value) return;
  isDownloading.value = true;
  setTimeout(() => {
    isDownloading.value = false;
    showDownloadToast.value = true;
    setTimeout(() => {
      showDownloadToast.value = false;
    }, 3000);
  }, 2000);
};

const handleAlarmClick = (alarm: any) => {
  if (!alarm.machineId) return;
  router.push(`/app/machines/${alarm.machineId}`);
};

const handleMachineClick = (machineId: string) => {
  router.push(`/app/machines/${machineId}`);
};
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-300 w-full">
    <!-- Header with Back Button and Title -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-4">
        <!-- Back Button with proper spacing -->
        <button
          @click="router.push('/app/global')"
          class="p-2 rounded-full transition-all text-slate-400 hover:text-white hover:scale-110 duration-200 flex-shrink-0"
        >
          <ArrowLeft size="24" />
        </button>
        <div>
          <h1
            class="text-2xl font-bold text-white flex items-center gap-3 tracking-tight"
          >
            <Factory class="text-blue-500" size="28" />
            {{ plant.name }}
          </h1>
          <p class="text-slate-400 text-sm font-medium mt-0.5">
            {{ plant.location }}
          </p>
        </div>
      </div>

      <!-- Period Filter and Export -->
      <div class="flex flex-wrap items-center gap-3 self-start sm:self-auto">
        <!-- Period Filter Buttons -->
        <div
          class="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1"
        >
          <button
            v-for="p in ['DAY', 'WEEK', 'MONTH', 'YEAR']"
            :key="p"
            @click="period = p as Period"
            :class="[
              'px-3 py-1.5 text-xs font-bold rounded-md transition-all',
              period === p
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'bg-slate-700/50 text-white hover:bg-slate-700 hover:text-blue-400',
            ]"
          >
            {{ p }}
          </button>
        </div>

        <!-- Export PDF Button -->
        <button
          @click="handleDownloadReport"
          :disabled="isDownloading"
          class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
        >
          <Loader2
            v-if="isDownloading"
            size="16"
            class="animate-spin text-blue-400"
          />
          <FileText
            v-else
            size="16"
            class="text-blue-400 group-hover:text-blue-300"
          />
          <span class="hidden sm:inline">{{
            isDownloading ? "Generating..." : "Export PDF"
          }}</span>
        </button>
      </div>
    </div>

    <!-- Plant At a Glance Card -->
    <div
      class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:shadow-lg transition-all duration-200"
    >
      <h2
        class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6"
      >
        Plant At a Glance
      </h2>

      <!-- KPI Cards -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 pb-6 border-b border-slate-700/50"
      >
        <!-- Output -->
        <div
          class="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50 hover:scale-105 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-slate-400 text-xs font-medium uppercase mb-1">
                Output ({{ period }})
              </p>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{{
                  formatNumber(mockKPIs.output)
                }}</span>
                <span class="text-xs text-slate-400">kg</span>
              </div>
            </div>
            <div class="p-2 bg-blue-500/10 rounded-lg">
              <Factory class="text-blue-400" size="20" />
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-emerald-400 font-semibold">↑ 3.2%</span>
            <span class="text-slate-500">vs yesterday</span>
          </div>
        </div>

        <!-- OEE -->
        <div
          class="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50 hover:scale-105 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-slate-400 text-xs font-medium uppercase mb-1">
                OEE
              </p>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{{
                  formatNumber(mockKPIs.oee, 1)
                }}</span>
                <span class="text-xs text-slate-400">%</span>
              </div>
            </div>
            <div class="p-2 bg-emerald-500/10 rounded-lg">
              <Activity class="text-emerald-400" size="20" />
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-emerald-400 font-semibold">↑ 0.5%</span>
            <span class="text-slate-500">vs yesterday</span>
          </div>
        </div>

        <!-- Energy -->
        <div
          class="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50 hover:scale-105 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-slate-400 text-xs font-medium uppercase mb-1">
                Energy ({{ period }})
              </p>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{{
                  formatNumber(mockKPIs.energy)
                }}</span>
                <span class="text-xs text-slate-400">kWh</span>
              </div>
            </div>
            <div class="p-2 bg-yellow-500/10 rounded-lg">
              <Zap class="text-yellow-400" size="20" />
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-rose-400 font-semibold">↓ 1.1%</span>
            <span class="text-slate-500">vs yesterday</span>
          </div>
        </div>

        <!-- Total Alarms -->
        <div
          class="bg-slate-900/50 rounded-lg p-5 border border-slate-700/50 hover:scale-105 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div class="flex justify-between items-start mb-3">
            <div>
              <p class="text-slate-400 text-xs font-medium uppercase mb-1">
                Total Alarms
              </p>
              <div class="flex items-baseline gap-2">
                <span class="text-3xl font-bold text-white">{{
                  alarms.length
                }}</span>
              </div>
            </div>
            <div class="p-2 bg-rose-500/10 rounded-lg">
              <AlertTriangle class="text-rose-400" size="20" />
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <span class="text-slate-400">Active issues</span>
          </div>
        </div>
      </div>

      <!-- Utility Consumption -->
      <div>
        <h4 class="text-sm font-bold text-slate-300 mb-4">
          Utility Consumption ({{ period }})
        </h4>
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <div
            v-for="metric in utilityMetrics"
            :key="metric.key"
            class="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 flex items-center gap-3 transition-all duration-200 group hover:border-blue-500 hover:bg-slate-800/50 cursor-pointer hover:scale-105 hover:shadow-md"
          >
            <div :class="['p-2 rounded-lg bg-slate-700/50', metric.color]">
              <component :is="metric.icon" size="20" />
            </div>
            <div>
              <span class="text-xs text-slate-400 font-bold">{{
                metric.label
              }}</span>
              <div class="text-md font-bold text-white font-mono">
                {{ metric.value }}
                <span class="text-xs text-slate-500">{{ metric.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Shift Performance and Alarms Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Shift Performance (main area) -->
      <div class="lg:col-span-3">
        <div
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:shadow-lg transition-all duration-200"
        >
          <h2
            class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4"
          >
            Shift Performance
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm min-w-[500px]">
              <thead
                class="bg-slate-900/50 text-slate-400 font-bold uppercase text-xs tracking-wider"
              >
                <tr>
                  <th class="p-3">Shift</th>
                  <th class="p-3">Time</th>
                  <th class="p-3">Output (kg)</th>
                  <th class="p-3 text-center">OEE</th>
                  <th class="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/50 text-slate-300">
                <tr
                  v-for="shift in shifts"
                  :key="shift.id"
                  :class="[
                    'transition-all duration-200',
                    shift.status === 'ACTIVE'
                      ? 'bg-blue-600/20 border-l-4 border-blue-500'
                      : 'hover:bg-slate-800/50 border-l-4 border-transparent',
                  ]"
                >
                  <td class="p-3 font-semibold text-white">{{ shift.name }}</td>
                  <td class="p-3 font-mono text-xs">{{ shift.time }}</td>
                  <td class="p-3 font-mono">
                    {{ formatNumber(shift.output) }}
                  </td>
                  <td class="p-3 text-center">
                    <span
                      :class="[
                        'font-bold',
                        shift.oee > 0.8 ? 'text-emerald-400' : 'text-amber-400',
                      ]"
                    >
                      {{ formatNumber(shift.oee * 100) }}%
                    </span>
                  </td>
                  <td class="p-3 text-center">
                    <span
                      :class="[
                        'text-[10px] uppercase px-2 py-0.5 rounded-full font-bold',
                        getStatusColor(shift.status),
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
      </div>

      <!-- Active Alarms -->
      <div class="lg:col-span-2">
        <div
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:shadow-lg transition-all duration-200 h-full"
        >
          <h2
            class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4"
          >
            Active Alarms
          </h2>
          <div
            v-if="alarms.length === 0"
            class="flex flex-col items-center justify-center h-48 text-slate-500"
          >
            <Clock size="32" class="mb-2 opacity-50" />
            <p>No active alarms</p>
          </div>
          <div
            v-else
            class="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2"
          >
            <div
              v-for="alarm in alarms"
              :key="alarm.id"
              @click="handleAlarmClick(alarm)"
              :class="[
                'flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 transition-all duration-200 group',
                alarm.machineId
                  ? 'cursor-pointer hover:border-blue-500 hover:bg-slate-800 hover:shadow-md'
                  : 'hover:border-slate-600',
              ]"
            >
              <div class="flex items-center gap-3 min-w-0">
                <component
                  :is="getAlarmIcon(alarm.severity)"
                  :class="['flex-shrink-0', getAlarmColor(alarm.severity)]"
                  size="16"
                />
                <div class="min-w-0">
                  <p
                    class="text-white font-bold text-sm group-hover:text-blue-400 transition-colors truncate"
                  >
                    {{ alarm.message }}
                  </p>
                  <p class="text-xs text-slate-400 truncate">
                    {{ alarm.timestamp }} • {{ alarm.source }}
                  </p>
                </div>
              </div>
              <span
                :class="[
                  'text-[10px] uppercase px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-2',
                  alarm.severity === 'CRITICAL'
                    ? 'bg-rose-500/20 text-rose-400'
                    : alarm.severity === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-blue-500/20 text-blue-400',
                ]"
              >
                {{ alarm.severity }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Production Lines -->
    <div>
      <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Activity class="text-slate-400" size="24" />
        Production Lines
      </h3>
      <div
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5"
      >
        <div
          v-for="machine in productionLines"
          :key="machine.id"
          @click="handleMachineClick(machine.id)"
          class="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-5 transition-all duration-200 group hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        >
          <!-- Header -->
          <div class="flex justify-between items-start mb-3">
            <h4
              class="font-bold text-white text-base group-hover:text-blue-400 transition-colors"
            >
              {{ machine.name }}
            </h4>
            <span
              :class="[
                'text-[10px] uppercase px-2 py-0.5 rounded-full font-bold',
                getStatusColor(machine.status),
              ]"
            >
              {{ machine.status }}
            </span>
          </div>

          <!-- Alarm Alert -->
          <div
            v-if="machine.hasAlarm"
            class="mb-3 bg-rose-500/10 border border-rose-500/20 rounded-md p-1.5 flex items-center gap-2 text-xs font-bold text-rose-400"
          >
            <div
              class="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"
            ></div>
            Maintenance Required
          </div>

          <!-- Metrics -->
          <div
            class="grid grid-cols-2 gap-4 mt-auto pt-3 border-t border-slate-700/50"
          >
            <div>
              <p class="text-slate-400 text-xs font-bold uppercase">Output</p>
              <p class="text-white font-mono font-bold text-lg">
                {{ formatNumber(machine.output) }}
                <span class="text-xs text-slate-500 font-normal">kg</span>
              </p>
            </div>
            <div>
              <p class="text-slate-400 text-xs font-bold uppercase">OEE</p>
              <p
                :class="[
                  'font-mono font-bold text-lg',
                  machine.oee * 100 >= 80
                    ? 'text-emerald-400'
                    : machine.oee * 100 >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400',
                ]"
              >
                {{ formatNumber(machine.oee * 100) }}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Download Toast -->
    <Transition
      enter-active-class="animate-in slide-in-from-bottom-5 fade-in duration-300"
      leave-active-class="animate-out slide-out-to-bottom-5 fade-out duration-200"
    >
      <div v-if="showDownloadToast" class="fixed bottom-8 right-8 z-50">
        <div
          class="bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl shadow-emerald-900/30 flex items-center gap-3 border border-emerald-500/50"
        >
          <div class="bg-white/20 p-1 rounded-full">
            <CheckCircle2 size="18" class="text-white" />
          </div>
          <div>
            <p class="font-bold text-sm">Report Downloaded</p>
            <p class="text-emerald-100 text-xs mt-0.5">
              Plant_Performance_{{ period }}.pdf
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Custom scrollbar for alarms list */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(51, 65, 85, 0.5);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(51, 65, 85, 0.8);
}
</style>
