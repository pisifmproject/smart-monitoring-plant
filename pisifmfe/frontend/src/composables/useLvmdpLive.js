// src/composables/useLvmdpLive.ts
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getLvmdpLatest } from "@/lib/api";
/**
 * Realtime LVMDP polling 1 detik
 * Bisa dipakai untuk semua panel (1–4)
 */
export function useLvmdpLive(panelId) {
    const isConnected = ref(false);
    const power = ref(null);
    const apparentPower = ref(null);
    const reactivePower = ref(null);
    const freq = ref(null);
    const cosPhi = ref(null);
    const voltage = ref(null);
    const accEnergy = ref(null);
    const avgCurrent = ref(null);
    const prevHour = ref(null);
    const currHour = ref(null);
    let timer = null;
    /** Fetch 1 baris terbaru dari backend */
    async function fetchLatest() {
        try {
            const row = (await getLvmdpLatest(panelId));
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
        }
        catch (err) {
            const e = err; // FIX TYPE TS
            const status = e?.response?.status ?? e?.status ?? null;
            // kalau backend kasih 404 → berarti belum ada data
            if (status === 404) {
                isConnected.value = false;
                return;
            }
            isConnected.value = false;
        }
    }
    onMounted(() => {
        fetchLatest();
        timer = setInterval(fetchLatest, 1000);
    });
    onBeforeUnmount(() => {
        if (timer)
            clearInterval(timer);
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
        prevHour,
        currHour,
    };
}
