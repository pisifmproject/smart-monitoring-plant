<!-- frontend/src/components/dailyReportTable.vue -->
<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { getDailyReportAll } from "@/lib/api";

const props = defineProps<{ panelId?: number }>();
const panelId = (props.panelId ?? 1) as 1 | 2 | 3 | 4;

type ShiftSummary = {
  avgKwh?: number;
  avgTotalKwh?: number;
  avgCurrent: number;
  count?: number;
};

type DailyReportRow = {
  reportDate?: string | Date;
  date: string; // 'YYYY-MM-DD'
  shift1?: ShiftSummary;
  shift2?: ShiftSummary;
  shift3?: ShiftSummary;
};

const rows = ref<DailyReportRow[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Cache to prevent redundant API calls
const dataCache = ref<{ data: DailyReportRow[]; timestamp: number } | null>(
  null
);
const CACHE_TTL = 30000; // 30 seconds

const numberFormatter = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function safeFormatNumber(v: any) {
  if (v === null || v === undefined || v === "-") return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return numberFormatter.format(n);
}

// function formatDateSafe(dateRaw: any) {
//   if (!dateRaw) return "-";
//   const t = Date.parse(dateRaw);
//   if (!Number.isNaN(t)) {
//     return new Date(t).toLocaleDateString("id-ID");
//   }
//   return String(dateRaw);
// }

function formatDateSafe(dateRaw: any) {
  if (!dateRaw) return "-";

  // Jika backend kirim Date object → jadikan string dulu
  const d = new Date(dateRaw);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  // fallback
  return String(dateRaw);
}

function fmtShift(s?: ShiftSummary) {
  if (!s) return { kwh: "-", iavg: "-" };

  const kwh = s.avgTotalKwh ?? s.avgKwh ?? null;
  const iavg = s.avgCurrent ?? null;

  return {
    kwh: safeFormatNumber(kwh),
    iavg: safeFormatNumber(iavg),
  };
}

async function loadAll(forceRefresh: boolean = false) {
  // Use cached data if available and not expired
  const now = Date.now();
  if (
    !forceRefresh &&
    dataCache.value &&
    now - dataCache.value.timestamp < CACHE_TTL
  ) {
    rows.value = dataCache.value.data;
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    const raw = (await getDailyReportAll(panelId)) as any[];

    // Normalisasi: pakai reportDate → simpan ke field date
    const data: DailyReportRow[] = raw.map((r) => ({
      ...r,
      date: r.date ?? r.reportDate ?? r.tanggal ?? null,
    }));

    // sort by date desc
    const sortedData = [...data].sort((a, b) => {
      const da = Date.parse(String(a.date ?? a.reportDate ?? "")) || 0;
      const db = Date.parse(String(b.date ?? b.reportDate ?? "")) || 0;
      return db - da;
    });

    rows.value = sortedData;

    // Update cache
    dataCache.value = {
      data: sortedData,
      timestamp: now,
    };
  } catch (err: any) {
    console.error("loadAll daily report error:", err);
    error.value =
      err?.response?.data?.message || err.message || "Gagal memuat laporan";
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(loadAll);

function extractShift(r: any, n: 1 | 2 | 3) {
  return {
    avgKwh: r[`shift${n}AvgKwh`] ?? null,
    avgCurrent: r[`shift${n}AvgCurrent`] ?? null,
  };
}

const displayRows = computed(() =>
  rows.value.map((r, idx) => {
    const sh1 = fmtShift(extractShift(r, 1));
    const sh2 = fmtShift(extractShift(r, 2));
    const sh3 = fmtShift(extractShift(r, 3));

    const dateSource = r.date ?? r.reportDate ?? null;

    return {
      no: idx + 1,
      dateKey: String(dateSource ?? idx),
      dateStr: formatDateSafe(dateSource),
      sh1,
      sh2,
      sh3,
    };
  })
);

function refresh() {
  loadAll(true); // Force refresh when user explicitly clicks refresh
}
</script>

<template>
  <div class="mt-8">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-semibold text-slate-700">
        Daily Reports (All Dates)
      </h3>
      <button
        class="px-3 py-1 bg-white border rounded shadow text-sm"
        @click="refresh"
      >
        Refresh
      </button>
    </div>

    <div v-if="loading" class="py-6 text-center text-slate-500">Loading...</div>
    <div v-else-if="error" class="text-red-600 mb-4">
      {{ error }}
    </div>
    <div v-else-if="!displayRows.length" class="text-sm text-slate-500">
      Tidak ada laporan.
    </div>

    <div v-if="displayRows.length" class="bg-white rounded-lg shadow-lg border">
      <div
        class="px-4 py-3 border-b bg-white flex items-center justify-between text-sm text-slate-600"
      >
        Showing {{ displayRows.length }} entries
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y table-auto">
          <thead class="bg-slate-50 sticky top-0">
            <tr>
              <th class="th-cell">No</th>
              <th class="th-cell">Tanggal</th>
              <th class="th-cell">Shift 1</th>
              <th class="th-cell">Shift 2</th>
              <th class="th-cell">Shift 3</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr
              v-for="r in displayRows"
              :key="r.dateKey + '-' + r.no"
              class="hover:bg-slate-50 odd:bg-slate-50"
            >
              <td class="td-cell">{{ r.no }}</td>
              <td class="td-cell">{{ r.dateStr }}</td>

              <td class="td-cell">
                <div class="flex gap-2 items-center">
                  <span class="value">{{ r.sh1.kwh }}</span>
                  <span class="unit">kWh</span>
                  <span class="sep">/</span>
                  <span class="value">{{ r.sh1.iavg }}</span>
                  <span class="unit">A</span>
                </div>
              </td>

              <td class="td-cell">
                <div class="flex gap-2 items-center">
                  <span class="value">{{ r.sh2.kwh }}</span>
                  <span class="unit">kWh</span>
                  <span class="sep">/</span>
                  <span class="value">{{ r.sh2.iavg }}</span>
                  <span class="unit">A</span>
                </div>
              </td>

              <td class="td-cell">
                <div class="flex gap-2 items-center">
                  <span class="value">{{ r.sh3.kwh }}</span>
                  <span class="unit">kWh</span>
                  <span class="sep">/</span>
                  <span class="value">{{ r.sh3.iavg }}</span>
                  <span class="unit">A</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
}
.th-cell {
  @apply px-4 py-3 text-left text-xs text-slate-600 uppercase tracking-wider;
}
.td-cell {
  @apply px-4 py-3 text-sm text-slate-700;
}
.value {
  @apply text-sm font-medium text-slate-800;
}
.unit {
  @apply text-xs text-slate-500;
}
.sep {
  @apply ml-3 text-sm text-slate-700;
}
</style>
