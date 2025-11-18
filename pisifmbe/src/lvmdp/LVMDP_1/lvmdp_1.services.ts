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
   Shift 1 : 07:00 → 14:30
   Shift 2 : 14:30 → 22:00
   Shift 3 : 22:00 → 07:00 (+1 hari)
=========================== */

// pakai batas yang pas & konsisten [start, end)
const SHIFT = [
  { key: "shift1", start: "07:01", end: "14:30" },
  { key: "shift2", start: "14:31", end: "22:00" },
  { key: "shift3", start: "22:01", end: "07:00" }, // lintas hari
] as const;

type ShiftAvg = {
  count: number;
  avgKwh: number;
  avgCurrent: number;
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

/** rata-rata total_kwh dan avg_current dari kumpulan baris */
function computeAverages(rows: Array<any>): ShiftAvg {
  let sumKwh = 0;
  let sumI = 0;
  let n = 0;

  for (const r of rows) {
    const kwh = Number(r.totalKwh) || 0;
    const I = Number(r.avgCurrent) || 0;
    sumKwh += kwh;
    sumI += I;
    n++;
  }

  return {
    count: n,
    avgKwh: n ? sumKwh / n : 0,
    avgCurrent: n ? sumI / n : 0,
  };
}

/**
 * Ambil rata-rata per shift untuk hari tertentu.
 * @param dateStr 'YYYY-MM-DD', default: hari ini (local server time +07:00)
 */
const getShiftAveragesLVMDP1 = async (dateStr?: string) => {
  // Gunakan local date untuk query (timezone +07:00 WIB)
  const today = dateStr ?? new Date().toISOString().slice(0, 10);

  const allRows = await findLVMDPs();

  // Data dari DB sudah dalam UTC (converted dari +07:00)
  const inRange = (d: Date, start: Date, end: Date) => d >= start && d < end;

  const out: Record<string, ShiftAvg> = {} as any;

  for (const s of SHIFT) {
    const { start, end } = makeRange(today, s.start, s.end);

    const rows = allRows.filter((r) => {
      const t: Date = r.waktu instanceof Date ? r.waktu : new Date(r.waktu);
      return inRange(t, start, end);
    });

    console.log(
      `[SHIFT ${
        s.key
      }] Date: ${today}, TimeRange: ${start.toISOString()} ~ ${end.toISOString()}, Found ${
        rows.length
      } rows`
    );
    out[s.key] = computeAverages(rows);
  }

  return out;
};

export { getAllLVMDPs, getShiftAveragesLVMDP1 };
