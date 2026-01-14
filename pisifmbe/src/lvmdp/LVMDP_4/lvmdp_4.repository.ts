import { db } from "../../db";
import { sql } from "drizzle-orm";

type Lvmdp4Row = {
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

function toNumber(x: unknown): number {
  if (x === null || x === undefined) return 0;
  if (typeof x === "number") return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

const mapRow = (r: any): Lvmdp4Row => ({
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

// Map dari lvmdp_hmi table untuk LVMDP4
const mapHMIRow = (r: any): Lvmdp4Row => ({
  waktu:
    r.datetimefield instanceof Date
      ? r.datetimefield
      : new Date(r.datetimefield),
  totalKwh: toNumber(r.lvmdp_energy_lvmdp4), // MWh for LVMDP4
  realPower: toNumber(r.lvmdp__total_lvmdp4),
  cosPhi: toNumber(r.lvmdp_cos_phi_lvmdp4),
  freq: toNumber(r.lvmdp_hz_lvmdp4),
  avgLineLine: toNumber(r.lvmdp_l_l_avg_lvmdp4),
  avgLineNeut: toNumber(r.lvmdp_l_n_avg_lvmdp4),
  avgCurrent: toNumber(r.lvmdp_avg_ampere_lvmdp4),
  currentR: toNumber(r.lvmdp_r_lvmdp4),
  currentS: toNumber(r.lvmdp_s_lvmdp4),
  currentT: toNumber(r.lvmdp_t_lvmdp4),
  voltageRS: toNumber(r.lvmdp_r_s_lvmdp4),
  voltageST: toNumber(r.lvmdp_s_t_lvmdp4),
  voltageTR: toNumber(r.lvmdp_t_r_lvmdp4),
});

export async function findLVMDPs(dateFrom?: string, dateTo?: string) {
  try {
    let query;
    if (dateFrom && dateTo) {
      // Date range query
      query = sql`SELECT * FROM public.v_lvmdp_4 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateTo}::date + interval '1 day')
                  ORDER BY waktu ASC`;
    } else if (dateFrom) {
      // Single date filter - only get data for this specific date
      query = sql`SELECT * FROM public.v_lvmdp_4 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateFrom}::date + interval '1 day')
                  ORDER BY waktu ASC`;
    } else {
      // No filter, get only last 7 days (reduced from 31)
      query = sql`SELECT * FROM public.v_lvmdp_4 
                  WHERE waktu >= CURRENT_DATE - interval '7 days'
                  ORDER BY waktu DESC
                  LIMIT 10000`;
    }

    const t0 = Date.now();
    const result = await db.execute(query);
    const t1 = Date.now();

    let rows: any[] = [];
    if (Array.isArray(result)) {
      rows = result;
    } else if (result && typeof result === "object") {
      if (Array.isArray((result as any).rows)) {
        rows = (result as any).rows;
      }
    }

    console.log(`[REPO LVMDP4] Query: ${t1 - t0}ms, Rows: ${rows.length}`);
    return rows.map(mapRow);
  } catch (error) {
    console.error("Error in findLVMDPs:", error);
    return [];
  }
}

/**
 * Try to get data dari v_lvmdp_4 view atau lvmdp_hmi table (LVMDP4 columns)
 */
// In-memory cache for latest data (reduces DB queries)
let latestCache4: { data: any; timestamp: number } | null = null;
const LATEST_CACHE_TTL_4 = 3000; // 3 seconds cache

export async function findLatestLVMDP4() {
  // Check cache first
  if (latestCache4 && Date.now() - latestCache4.timestamp < LATEST_CACHE_TTL_4) {
    return latestCache4.data;
  }

  // Try v_lvmdp_4 first with optimized query (no date filter for faster index scan)
  try {
    const result = await db.execute(
      sql`SELECT * FROM public.v_lvmdp_4 
          ORDER BY waktu DESC 
          LIMIT 1`
    );
    const rows = (result as any).rows || result;
    const row = Array.isArray(rows) ? rows[0] : null;
    if (row) {
      const mapped = mapRow(row);
      latestCache4 = { data: mapped, timestamp: Date.now() };
      return mapped;
    }
  } catch (error) {
    // Silently try fallback
  }

  // Fallback ke lvmdp_hmi for LVMDP4 data with optimized query
  try {
    const result = await db.execute(
      sql`SELECT * FROM public.lvmdp_hmi 
          ORDER BY datetimefield DESC 
          LIMIT 1`
    );
    const rows = (result as any).rows || result;
    const row = Array.isArray(rows) ? rows[0] : null;
    if (row) {
      const mapped = mapHMIRow(row);
      latestCache4 = { data: mapped, timestamp: Date.now() };
      return mapped;
    }
  } catch (error) {
    console.error("[LVMDP4] Error fetching data:", error);
  }

  return null;
}

// ambil data RST (current & voltage) dari lvmdp_hmi
export async function findLatestHMI4() {
  try {
    const result = await db.execute(
      sql`SELECT 
        lvmdp_r_lvmdp4, lvmdp_s_lvmdp4, lvmdp_t_lvmdp4,
        lvmdp_r_s_lvmdp4, lvmdp_s_t_lvmdp4, lvmdp_t_r_lvmdp4
      FROM public.lvmdp_hmi 
      ORDER BY datetimefield DESC LIMIT 1`
    );
    const rows = (result as any).rows || result;
    const row = Array.isArray(rows) ? rows[0] : null;

    if (!row) return null;

    return {
      currentR: toNumber(row.lvmdp_r_lvmdp4),
      currentS: toNumber(row.lvmdp_s_lvmdp4),
      currentT: toNumber(row.lvmdp_t_lvmdp4),
      voltageRS: toNumber(row.lvmdp_r_s_lvmdp4),
      voltageST: toNumber(row.lvmdp_s_t_lvmdp4),
      voltageTR: toNumber(row.lvmdp_t_r_lvmdp4),
    };
  } catch (error) {
    console.error("Error in findLatestHMI4:", error);
    return null;
  }
}
