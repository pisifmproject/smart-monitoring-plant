import { db } from "../../db";
import { sql } from "drizzle-orm";

type Lvmdp3Row = {
  waktu: Date;
  totalKwh: number;
  cosPhi: number;
  freq: number;
  avgLineLine: number;
  avgLineNeut: number;
  avgCurrent: number;
};

function toNumber(x: unknown): number {
  if (x === null || x === undefined) return 0;
  if (typeof x === "number") return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

const mapRow = (r: any): Lvmdp3Row => ({
  waktu: r.waktu instanceof Date ? r.waktu : new Date(r.waktu),
  totalKwh: toNumber(r.total_kwh),
  cosPhi: toNumber(r.cos_phi),
  freq: toNumber(r.freq),
  avgLineLine: toNumber(r.avg_line_line),
  avgLineNeut: toNumber(r.avg_line_neut),
  avgCurrent: toNumber(r.avg_current),
});

export async function findLVMDPs(dateFrom?: string, dateTo?: string) {
  try {
    let query;
    if (dateFrom && dateTo) {
      // Date range query
      query = sql`SELECT * FROM public.v_lvmdp_3 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateTo}::date + interval '1 day')
                  ORDER BY waktu ASC`;
    } else if (dateFrom) {
      // Single date filter - only get data for this specific date
      query = sql`SELECT * FROM public.v_lvmdp_3 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateFrom}::date + interval '1 day')
                  ORDER BY waktu ASC`;
    } else {
      // No filter, get only last 7 days (reduced from 31)
      query = sql`SELECT * FROM public.v_lvmdp_3 
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

    console.log(`[REPO LVMDP3] Query: ${t1 - t0}ms, Rows: ${rows.length}`);
    return rows.map(mapRow);
  } catch (error) {
    console.error("Error in findLVMDPs:", error);
    return [];
  }
}

export async function findLatestLVMDP3() {
  const result = await db.execute(
    sql`SELECT * FROM public.v_lvmdp_3 ORDER BY waktu DESC LIMIT 1`
  );
  const rows = (result as any).rows || result;
  const row = Array.isArray(rows) ? rows[0] : null;
  return row ? mapRow(row) : null;
}
