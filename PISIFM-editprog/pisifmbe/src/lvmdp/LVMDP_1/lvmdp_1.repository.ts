// src/lvmdp/LVMDP_1/lvmdp_1.repository.ts
import { db } from "../../db";
import { sql } from "drizzle-orm";

type Lvmdp1Row = {
  waktu: Date;
  totalKwh: number;
  realPower: number;
  cosPhi: number;
  freq: number;
  avgLineLine: number;
  avgLineNeut: number;
  avgCurrent: number;
  currentR: number;
  currentS: number;
  currentT: number;
  voltageRS: number;
  voltageST: number;
  voltageTR: number;
};

// helper numeric
function toNumber(x: unknown): number {
  if (x === null || x === undefined) return 0;
  if (typeof x === "number") return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

// mapping hasil query → bentuk yang rapi
const mapRow = (r: any): Lvmdp1Row => ({
  waktu: r.waktu instanceof Date ? r.waktu : new Date(r.waktu),
  totalKwh: toNumber(r.total_kwh),
  realPower: toNumber(r.real_power),
  cosPhi: toNumber(r.cos_phi),
  freq: toNumber(r.freq),
  avgLineLine: toNumber(r.avg_line_line),
  avgLineNeut: toNumber(r.avg_line_neut),
  avgCurrent: toNumber(r.avg_current),
  currentR: toNumber(r.current_r),
  currentS: toNumber(r.current_s),
  currentT: toNumber(r.current_t),
  voltageRS: toNumber(r.voltage_rs),
  voltageST: toNumber(r.voltage_st),
  voltageTR: toNumber(r.voltage_tr),
});

// ambil semua data (urut terbaru dulu)
export async function findLVMDPs(dateFrom?: string, dateTo?: string) {
  try {
    let query;
    if (dateFrom && dateTo) {
      // Date range query
      query = sql`SELECT * FROM public.v_lvmdp_1 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateTo}::date + interval '1 day')
                  ORDER BY waktu ASC`;
    } else if (dateFrom) {
      // Single date filter - only get data for this specific date
      query = sql`SELECT * FROM public.v_lvmdp_1 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateFrom}::date + interval '1 day')
                  ORDER BY waktu ASC`;
    } else {
      // No filter, get only last 7 days (reduced from 31)
      query = sql`SELECT * FROM public.v_lvmdp_1 
                  WHERE waktu >= CURRENT_DATE - interval '7 days'
                  ORDER BY waktu DESC
                  LIMIT 10000`;
    }

    const t0 = Date.now();
    const result = await db.execute(query);
    const t1 = Date.now();

    // Handle different response formats from pg driver
    let rows: any[] = [];
    if (Array.isArray(result)) {
      rows = result;
    } else if (result && typeof result === "object") {
      if (Array.isArray((result as any).rows)) {
        rows = (result as any).rows;
      }
    }

    console.log(`[REPO LVMDP1] Query: ${t1 - t0}ms, Rows: ${rows.length}`);
    return rows.map(mapRow);

    // // Debug: log first 5 rows dengan waktu
    // if (mapped.length > 0) {
    //   console.log(`[REPO LVMDP1] Total rows: ${mapped.length}, Sample times:`);
    //   mapped.slice(0, 5).forEach((r, i) => {
    //     const rawStr = rows[i].waktu;
    //     const parsed = r.waktu;
    //     console.log(
    //       `  ${i + 1}. Raw: "${rawStr}" → Parsed: ${parsed.toISOString()}`
    //     );
    //   });
    // }
    // return mapped;
  } catch (error) {
    console.error("Error in findLVMDPs:", error);
    return [];
  }
}

// ambil data paling baru (untuk gauge realtime)
export async function findLatestLVMDP1() {
  const result = await db.execute(
    sql`SELECT * FROM public.v_lvmdp_1 ORDER BY waktu DESC LIMIT 1`
  );
  const rows = (result as any).rows || result;
  const row = Array.isArray(rows) ? rows[0] : null;
  return row ? mapRow(row) : null;
}

// ambil data RST (current & voltage) dari lvmdp_hmi
export async function findLatestHMI1() {
  try {
    const result = await db.execute(
      sql`SELECT 
        lvmdp_r_lvmdp1, lvmdp_s_lvmdp1, lvmdp_t_lvmdp1,
        lvmdp_r_s_lvmdp1, lvmdp_s_t_lvmdp1, lvmdp_t_r_lvmdp1
      FROM public.lvmdp_hmi 
      ORDER BY datetimefield DESC LIMIT 1`
    );
    const rows = (result as any).rows || result;
    const row = Array.isArray(rows) ? rows[0] : null;

    if (!row) return null;

    return {
      currentR: toNumber(row.lvmdp_r_lvmdp1),
      currentS: toNumber(row.lvmdp_s_lvmdp1),
      currentT: toNumber(row.lvmdp_t_lvmdp1),
      voltageRS: toNumber(row.lvmdp_r_s_lvmdp1),
      voltageST: toNumber(row.lvmdp_s_t_lvmdp1),
      voltageTR: toNumber(row.lvmdp_t_r_lvmdp1),
    };
  } catch (error) {
    console.error("Error in findLatestHMI1:", error);
    return null;
  }
}
