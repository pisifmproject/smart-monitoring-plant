import { db } from "../../db";
import { sql } from "drizzle-orm";

type Lvmdp2Row = {
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

const mapRow = (r: any): Lvmdp2Row => ({
  waktu: r.waktu instanceof Date ? r.waktu : new Date(r.waktu),
  totalKwh: toNumber(r.total_kwh),
  cosPhi: toNumber(r.cos_phi),
  freq: toNumber(r.freq),
  avgLineLine: toNumber(r.avg_line_line),
  avgLineNeut: toNumber(r.avg_line_neut),
  avgCurrent: toNumber(r.avg_current),
});

export async function findLVMDPs() {
  try {
    const result = await db.execute(
      sql`SELECT * FROM public.v_lvmdp_2 ORDER BY waktu DESC`
    );

    let rows: any[] = [];
    if (Array.isArray(result)) {
      rows = result;
    } else if (result && typeof result === "object") {
      if (Array.isArray((result as any).rows)) {
        rows = (result as any).rows;
      }
    }

    return rows.map(mapRow);
  } catch (error) {
    console.error("Error in findLVMDPs:", error);
    return [];
  }
}

export async function findLatestLVMDP2() {
  const result = await db.execute(
    sql`SELECT * FROM public.v_lvmdp_2 ORDER BY waktu DESC LIMIT 1`
  );
  const rows = (result as any).rows || result;
  const row = Array.isArray(rows) ? rows[0] : null;
  return row ? mapRow(row) : null;
}
