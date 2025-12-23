// src/lvmdp/LVMDP_1/lvmdp_1.services.ts
import { findLVMDPs } from "./lvmdp_1.repository";

/* ===========================
   BASIC READ
=========================== */

const getAllLVMDPs = async () => {
  return await findLVMDPs();
};

/* ===========================
   SHIFT AVERAGES
   Shift 1 : 07:01 → 14:30
   Shift 2 : 14:31 → 22:00
   Shift 3 : 22:01 → 07:00 (+1 hari)
=========================== */

// pakai batas yang pas & konsisten [start, end)
const SHIFT = [
  { key: "shift1", start: "07:01", end: "14:30" },
  { key: "shift2", start: "14:31", end: "22:00" },
  { key: "shift3", start: "22:01", end: "07:00" }, // lintas hari
] as const;

type ShiftAvg = {
  count: number;
  totalKwh: number; // Sum of all kWh
  avgKwh: number; // Average of kWh
  avgCurrent: number;
  minCurrent: number; // Minimum current
  maxCurrent: number; // Maximum current
  avgCosPhi: number; // Average of power factor
};

/**
 * Bikin Date dari 'YYYY-MM-DD' + 'HH:mm' dalam timezone +07:00 (WIB)
 * Hasil dalam UTC (untuk comparison dengan data dari DB yang sudah UTC)
 */
function at(dateStr: string, hhmm: string) {
  const [Y, M, D] = dateStr.split("-").map(Number);
  const [h, m] = hhmm.split(":").map(Number);
  // Bikin date di local +07:00 timezone, convert ke UTC
  // UTC = LocalTime - 7 jam
  const utcTime = Date.UTC(Y, M - 1, D, h, m, 0, 0) - 7 * 60 * 60 * 1000;
  return new Date(utcTime);
} /** range waktu satu shift; kalau end <= start → tambahkan 1 hari (shift 3) */
function makeRange(dateStr: string, startHHMM: string, endHHMM: string) {
  const start = at(dateStr, startHHMM);
  let end = at(dateStr, endHHMM);
  if (end <= start) end.setDate(end.getDate() + 1);
  return { start, end };
}

/** rata-rata real_power, avg_current, dan cos_phi dari kumpulan baris */
function computeAverages(rows: Array<any>): ShiftAvg {
  let sumRealPower = 0;
  let sumI = 0;
  let sumCosPhi = 0;

  let minI = Infinity;
  let maxI = -Infinity;
  let n = 0;

  for (const r of rows) {
    const realPower = Number(r.realPower);
    const cosPhi = Number(r.cosPhi);

    // === 🔥 FIX UTAMA: PAKAI ARUS R/S/T ===
    const currents = [
      Number(r.currentR),
      Number(r.currentS),
      Number(r.currentT),
    ].filter((v) => Number.isFinite(v) && v > 0);

    if (currents.length === 0) continue;

    const avgI = currents.reduce((a, b) => a + b, 0) / currents.length;
    const minPhase = Math.min(...currents);
    const maxPhase = Math.max(...currents);

    sumRealPower += Number.isFinite(realPower) ? realPower : 0;
    sumI += avgI;
    sumCosPhi += Number.isFinite(cosPhi) ? cosPhi : 0;

    minI = Math.min(minI, minPhase);
    maxI = Math.max(maxI, maxPhase);

    n++;
  }

  const totalKwh = sumRealPower * (3 / 3600);

  return {
    count: n,
    totalKwh,
    avgKwh: n ? sumRealPower / n : 0,
    avgCurrent: n ? sumI / n : 0,
    minCurrent: minI === Infinity ? 0 : minI,
    maxCurrent: maxI === -Infinity ? 0 : maxI,
    avgCosPhi: n ? sumCosPhi / n : 0,
  };
}

/**
 * Ambil rata-rata per shift untuk hari tertentu.
 * @param dateStr 'YYYY-MM-DD', default: hari ini (local server time +07:00)
 */
const getShiftAveragesLVMDP1 = async (dateStr?: string) => {
  // Gunakan local date (WIB) sebagai referensi hari
  const today = dateStr ?? new Date().toISOString().slice(0, 10);

  // Helper: tambah hari ke YYYY-MM-DD
  function addDaysYmd(ymd: string, days: number) {
    const [Y, M, D] = ymd.split("-").map(Number);
    const dt = new Date(Date.UTC(Y, M - 1, D));
    dt.setUTCDate(dt.getUTCDate() + days);
    const y = dt.getUTCFullYear();
    const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
    const d = String(dt.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // 🔴 WAJIB: ambil hari ini + besok (untuk SHIFT 3 lintas hari)
  const tomorrow = addDaysYmd(today, 1);
  const allRows = await findLVMDPs(today, tomorrow);

  // Range check helper
  const inRange = (d: Date, start: Date, end: Date) => d >= start && d < end;

  const out: Record<string, ShiftAvg> = {} as any;

  for (const s of SHIFT) {
    const { start, end } = makeRange(today, s.start, s.end);

    // Filter data sesuai window shift
    const rows = allRows.filter((r) => {
      const t: Date = r.waktu instanceof Date ? r.waktu : new Date(r.waktu);
      return inRange(t, start, end);
    });

    /* ===========================
       Hitung kWh per jam dulu
       (lebih akurat & stabil)
    =========================== */
    const hourlyMap = new Map<string, any[]>();

    for (const r of rows) {
      const t: Date = r.waktu instanceof Date ? r.waktu : new Date(r.waktu);

      // Convert ke WIB untuk grouping jam
      const wibTime = new Date(t.getTime() + 7 * 60 * 60 * 1000);
      const hourStr = `${String(wibTime.getUTCHours()).padStart(2, "0")}:00`;

      if (!hourlyMap.has(hourStr)) {
        hourlyMap.set(hourStr, []);
      }
      hourlyMap.get(hourStr)!.push(r);
    }

    let shiftTotalKwh = 0;

    for (const hourRows of hourlyMap.values()) {
      const hourAvg = computeAverages(hourRows);
      shiftTotalKwh += hourAvg.totalKwh;
    }

    /* ===========================
       Hitung average & min/max
       dari SEMUA row shift
    =========================== */
    const shiftAvg = computeAverages(rows);

    out[s.key] = {
      ...shiftAvg,
      totalKwh: shiftTotalKwh,
    };
  }

  return out;
};

/**
 * Ambil hourly aggregates untuk satu hari, dihitung dari raw data
 * Range: 00:00 - 23:59 untuk tanggal yang dipilih (calendar day)
 */
const getHourlyAveragesLVMDP1 = async (dateStr?: string) => {
  const today = dateStr ?? new Date().toISOString().slice(0, 10);

  // Fetch data untuk tanggal yang dipilih
  const allRows = await findLVMDPs(today);

  // Kelompokkan per jam untuk calendar day (00:00-23:00)
  const hourlyMap = new Map<string, any[]>();

  for (const r of allRows) {
    const t: Date = r.waktu instanceof Date ? r.waktu : new Date(r.waktu);

    // Convert to WIB timezone
    const wibTime = new Date(t.getTime() + 7 * 60 * 60 * 1000);
    const rowDateStr = wibTime.toISOString().slice(0, 10);

    // Only include data from the selected date
    if (rowDateStr !== today) continue;

    // Get hour in WIB (00-23)
    const hourStr = `${String(wibTime.getUTCHours()).padStart(2, "0")}:00`;
    const key = `${today}T${hourStr}`;

    if (!hourlyMap.has(key)) {
      hourlyMap.set(key, []);
    }
    hourlyMap.get(key)!.push(r);
  }

  // Compute averages per jam
  const result = Array.from(hourlyMap.entries())
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([hour, rows]) => {
      const avg = computeAverages(rows);
      return {
        hour: new Date(hour),
        totalKwh: avg.totalKwh, // Sum of kWh for this hour
        avgKwh: avg.avgKwh, // Average kWh
        avgCurrent: avg.avgCurrent,
        minCurrent: avg.minCurrent,
        maxCurrent: avg.maxCurrent,
        cosPhi: avg.avgCosPhi, // Average power factor
        count: avg.count,
      };
    });

  return result;
};

export { getAllLVMDPs, getShiftAveragesLVMDP1, getHourlyAveragesLVMDP1 };
