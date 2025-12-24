<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getDailyReportAll, getDailyHourly } from "@/lib/api";
import { useExcelExport } from "@/composables/useExcelExport";
import { ArrowLeft, Download, Clock, ClockFading } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const panelId = Number(route.query.panel || 1);

const { exportShiftReportByDate, exportHourlyReportByDate } = useExcelExport();

// date
const selectedDate = ref(new Date().toISOString().slice(0, 10));

// tab
const activeTab = ref<"shift" | "hourly">("shift");

// data
const shiftReports = ref<any[]>([]);
const hourlyReports = ref<any[]>([]);
const loading = ref(false);

// format
const nf = new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2 });

const format = (v: any) =>
  v === null || v === undefined || isNaN(Number(v)) ? "-" : nf.format(v);

// back
function goBack() {
  router.push(`/app/plant/CIKUPA/electrical/panel${panelId}`);
}

// load shift
async function loadShift() {
  loading.value = true;
  const all = await getDailyReportAll(panelId);
  const row = all.find(
    (r: any) => (r.date || r.reportDate) === selectedDate.value
  );

  shiftReports.value = row
    ? [
        {
          shift: 1,
          total: row.shift1TotalKwh,
          power: row.shift1AvgKwh,
          avgI: row.shift1AvgCurrent,
          minI: row.shift1MinCurrent,
          maxI: row.shift1MaxCurrent,
          pf: row.shift1CosPhi,
        },
        {
          shift: 2,
          total: row.shift2TotalKwh,
          power: row.shift2AvgKwh,
          avgI: row.shift2AvgCurrent,
          minI: row.shift2MinCurrent,
          maxI: row.shift2MaxCurrent,
          pf: row.shift2CosPhi,
        },
        {
          shift: 3,
          total: row.shift3TotalKwh,
          power: row.shift3AvgKwh,
          avgI: row.shift3AvgCurrent,
          minI: row.shift3MinCurrent,
          maxI: row.shift3MaxCurrent,
          pf: row.shift3CosPhi,
        },
      ]
    : [];

  loading.value = false;
}

// load hourly
async function loadHourly() {
  loading.value = true;
  hourlyReports.value = await getDailyHourly(panelId, selectedDate.value);
  loading.value = false;
}

watch(selectedDate, () => {
  loadShift();
  if (activeTab.value === "hourly") loadHourly();
});

watch(activeTab, (v) => {
  if (v === "hourly" && hourlyReports.value.length === 0) loadHourly();
});

onMounted(loadShift);
</script>

<template>
  <div class="w-full min-h-screen px-6 py-6 text-slate-200">
    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="text-slate-400 hover:text-white">
          <ArrowLeft />
        </button>
        <div>
          <h1 class="text-xl font-bold">Daily Report</h1>
          <p class="text-sm text-slate-400">LVMDP {{ panelId }}</p>
        </div>
      </div>

      <input
        type="date"
        v-model="selectedDate"
        class="bg-slate-800 border border-slate-600 rounded px-3 py-2"
      />
    </div>

    <!-- TABS -->
    <div class="flex gap-4 border-b border-slate-700 mb-6">
      <button
        class="pb-2 font-semibold"
        :class="activeTab === 'shift' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400'"
        @click="activeTab = 'shift'"
      >
        <ClockFading class="inline w-4 h-4 mr-1" /> Shift
      </button>

      <button
        class="pb-2 font-semibold"
        :class="activeTab === 'hourly' ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400'"
        @click="activeTab = 'hourly'"
      >
        <Clock class="inline w-4 h-4 mr-1" /> Hourly
      </button>
    </div>

    <!-- TABLE -->
    <div v-if="loading" class="text-center py-10 text-slate-400">
      Loading...
    </div>

    <table v-else class="w-full text-sm border border-slate-700">
      <thead class="bg-blue-600 text-white">
        <tr>
          <th class="px-4 py-2">SHIFT</th>
          <th class="px-4 py-2">TOTAL KWH</th>
          <th class="px-4 py-2">AVG POWER</th>
          <th class="px-4 py-2">AVG CURRENT</th>
          <th class="px-4 py-2">MIN</th>
          <th class="px-4 py-2">MAX</th>
          <th class="px-4 py-2">PF</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in activeTab === 'shift' ? shiftReports : hourlyReports"
          :key="r.shift || r.hour"
          class="border-t border-slate-700"
        >
          <td class="px-4 py-2 font-bold">
            {{ r.shift ? `SHIFT ${r.shift}` : r.hour }}
          </td>
          <td class="px-4 py-2">{{ format(r.total || r.totalKwh) }}</td>
          <td class="px-4 py-2">{{ format(r.power || r.avgKwh) }}</td>
          <td class="px-4 py-2">{{ format(r.avgI || r.avgCurrent) }}</td>
          <td class="px-4 py-2">{{ format(r.minI || r.minCurrent) }}</td>
          <td class="px-4 py-2">{{ format(r.maxI || r.maxCurrent) }}</td>
          <td class="px-4 py-2">{{ format(r.pf || r.cosPhi) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
/* intentionally minimal */
</style>
