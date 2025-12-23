// src/composables/useLvmdpLive.ts
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getLvmdpLatest, getLvmdpHMI, type LvmdpRaw } from "@/lib/api";

/**
 * Realtime LVMDP polling 1 detik
 * Bisa dipakai untuk semua panel (1–4)
 */
export function useLvmdpLive(panelId: number) {
  const isConnected = ref(false);
  const power = ref<number | null>(null);
  const apparentPower = ref<number | null>(null);
  const reactivePower = ref<number | null>(null);

  const freq = ref<number | null>(null);
  const cosPhi = ref<number | null>(null);
  const voltage = ref<number | null>(null);

  const accEnergy = ref<number | null>(null);
  const avgCurrent = ref<number | null>(null);

  // RST Current and Voltage from HMI
  const currentR = ref<number | null>(null);
  const currentS = ref<number | null>(null);
  const currentT = ref<number | null>(null);
  const voltageRS = ref<number | null>(null);
  const voltageST = ref<number | null>(null);
  const voltageTR = ref<number | null>(null);

  const prevHour = ref<number | null>(null);
  const currHour = ref<number | null>(null);

  let timer: ReturnType<typeof setInterval> | null = null;

  /** Fetch 1 baris terbaru dari backend */
  async function fetchLatest() {
    try {
      // Fetch LVMDP data which now includes RST columns from updated view
      const row = (await getLvmdpLatest(panelId)) as LvmdpRaw;

      isConnected.value = true;

      // rumus perhitungan power dari VLL, Current, dan cosPhi
      const Vll = row.avgLineLine ?? 0;
      const I = row.avgCurrent ?? 0;
      const pf = row.cosPhi ?? 0;

      const S = (Math.sqrt(3) * Vll * I) / 1000; // kVA
      const P = S * pf; // kW

      power.value = P;
      apparentPower.value = S;
      reactivePower.value = null; // nanti bisa ditambah kalau ada data Q

      freq.value = row.freq ?? null;
      cosPhi.value = row.cosPhi ?? null;
      voltage.value = row.avgLineLine ?? null;

      accEnergy.value = row.totalKwh ?? null;
      avgCurrent.value = row.avgCurrent ?? null;

      prevHour.value = null;
      currHour.value = null;

      // DEBUG: Log row BEFORE assignment
      // console.log("🔍 RAW ROW FROM API:", JSON.stringify(row, null, 2));
      // console.log(
      //   "🔍 row.currentR:",
      //   row.currentR,
      //   "Type:",
      //   typeof row.currentR
      // );

      // Update RST data directly from row (now includes RST columns from updated view)
      currentR.value = Number(row.currentR) || 0;
      currentS.value = Number(row.currentS) || 0;
      currentT.value = Number(row.currentT) || 0;
      voltageRS.value = Number(row.voltageRS) || 0;
      voltageST.value = Number(row.voltageST) || 0;
      voltageTR.value = Number(row.voltageTR) || 0;

      // console.log(
      //   `%c[LVMDP${panelId}] ✅ RST DATA SET!`,
      //   "background: lime; color: black; font-size: 20px; padding: 10px;"
      // );
      // console.log("RST Values AFTER SET:", {
      //   R: currentR.value,
      //   S: currentS.value,
      //   T: currentT.value,
      //   "R-S": voltageRS.value,
      //   "S-T": voltageST.value,
      //   "T-R": voltageTR.value,
      // });
    } catch (err) {
      const e = err as any;
      const status = e?.response?.status ?? e?.status ?? null;

      // kalau backend kasih 404 → berarti belum ada data
      if (status === 404) {
        isConnected.value = false;
        return;
      }

      // console.error(`[LVMDP${panelId}] Error fetching data:`, e.message || err);
      isConnected.value = false;
    }
  }

  onMounted(() => {
    // console.log(
    //   `%c[LVMDP${panelId}] 🚀 Starting data fetch...`,
    //   "background: #4CAF50; color: white; padding: 5px; font-weight: bold;"
    // );
    fetchLatest();
    timer = setInterval(fetchLatest, 1000);
  });

  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
  });

  return {
    isConnected,

    power,
    apparentPower,
    reactivePower,

    freq,
    cosPhi,
    voltage,

    accEnergy,
    avgCurrent,

    // RST data from HMI
    currentR,
    currentS,
    currentT,
    voltageRS,
    voltageST,
    voltageTR,

    prevHour,
    currHour,
  };
}
