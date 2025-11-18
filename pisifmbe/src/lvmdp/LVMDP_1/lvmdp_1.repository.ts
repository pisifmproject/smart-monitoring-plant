// src/lvmdp/LVMDP_1/lvmdp_1.repository.ts
import { db } from "../../db";
import { sql } from "drizzle-orm";

type Lvmdp1Row = {
  waktu: Date;
  totalKwh: number;
  cosPhi: number;
  freq: number;
  avgLineLine: number;
  avgLineNeut: number;
  avgCurrent: number;
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
  cosPhi: toNumber(r.cos_phi),
  freq: toNumber(r.freq),
  avgLineLine: toNumber(r.avg_line_line),
  avgLineNeut: toNumber(r.avg_line_neut),
  avgCurrent: toNumber(r.avg_current),
});

// ambil semua data (urut terbaru dulu)
export async function findLVMDPs() {
  try {
    const result = await db.execute(
      sql`SELECT * FROM public.v_lvmdp_1 ORDER BY waktu DESC`
    );

    // Handle different response formats from pg driver
    let rows: any[] = [];
    if (Array.isArray(result)) {
      rows = result;
    } else if (result && typeof result === "object") {
      if (Array.isArray((result as any).rows)) {
        rows = (result as any).rows;
      }
    }

    const mapped = rows.map(mapRow);

    // Debug: log first 5 rows dengan waktu
    if (mapped.length > 0) {
      console.log(`[REPO LVMDP1] Total rows: ${mapped.length}, Sample times:`);
      mapped.slice(0, 5).forEach((r, i) => {
        const rawStr = rows[i].waktu;
        const parsed = r.waktu;
        console.log(
          `  ${i + 1}. Raw: "${rawStr}" → Parsed: ${parsed.toISOString()}`
        );
      });
    }
    return mapped;
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
