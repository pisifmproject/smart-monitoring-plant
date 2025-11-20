import { findLVMDPs } from "./lvmdp_4.repository";

const getAllLVMDPs = async () => {
  return await findLVMDPs();
};

const SHIFT = [
  { key: "shift1", start: "07:01", end: "14:30" },
  { key: "shift2", start: "14:31", end: "22:00" },
  { key: "shift3", start: "22:01", end: "07:00" },
] as const;

type ShiftAvg = {
  count: number;
  totalKwh: number; // Sum of all kWh
  avgKwh: number; // Average of kWh
  avgCurrent: number;
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
}
function makeRange(dateStr: string, startHHMM: string, endHHMM: string) {
  const start = at(dateStr, startHHMM);
  let end = at(dateStr, endHHMM);
  if (end <= start) end.setDate(end.getDate() + 1);
  return { start, end };
}

function computeAverages(rows: Array<any>): ShiftAvg {
  let sumKwh = 0;
  let sumI = 0;
  let sumCosPhi = 0;
  let n = 0;

  for (const r of rows) {
    const kwh = Number(r.totalKwh) || 0;
    const I = Number(r.avgCurrent) || 0;
    const cosPhi = Number(r.cosPhi) || 0;
    sumKwh += kwh;
    sumI += I;
    sumCosPhi += cosPhi;
    n++;
  }

  return {
    count: n,
    totalKwh: sumKwh, // Sum of all kWh
    avgKwh: n ? sumKwh / n : 0, // Average of kWh
    avgCurrent: n ? sumI / n : 0,
    avgCosPhi: n ? sumCosPhi / n : 0, // Average power factor
  };
}

const getShiftAveragesLVMDP4 = async (dateStr?: string) => {
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

    out[s.key] = computeAverages(rows);
  }

  return out;
};

/**
 * Ambil hourly aggregates untuk satu hari, dihitung dari raw data
 * Konsisten dengan metode shift calculation
 */
const getHourlyAveragesLVMDP4 = async (dateStr?: string) => {
  const today = dateStr ?? new Date().toISOString().slice(0, 10);
  const allRows = await getAllLVMDPs();

  // Kelompokkan per jam
  const hourlyMap = new Map<string, any[]>();

  for (const r of allRows) {
    const t: Date = r.waktu instanceof Date ? r.waktu : new Date(r.waktu);
    const rowDateStr = new Intl.DateTimeFormat("sv-SE").format(t); // YYYY-MM-DD

    if (rowDateStr !== today) continue;

    // Ambil jam (format: HH:00)
    const hourStr = `${String(t.getHours()).padStart(2, "0")}:00`;
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
        cosPhi: avg.avgCosPhi, // Average power factor
        count: avg.count,
      };
    });

  return result;
};

export { getAllLVMDPs, getShiftAveragesLVMDP4, getHourlyAveragesLVMDP4 };
