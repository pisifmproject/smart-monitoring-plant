// src/production/production.repository.ts
import { db } from "../db";
import { productionLineAPC39 } from "../db/schema";
import { desc, eq, sql } from "drizzle-orm";

type ProductionRow = {
  id: string;
  timestamp: Date;
  lineId: string;
  targetProduction: number;
  actualProduction: number;
  defectCount: number;
  status: string;
  oeePercentage: number;
  availability: number;
  performance: number;
  quality: number;
};

// Helper numeric
function toNumber(x: unknown): number {
  if (x === null || x === undefined) return 0;
  if (typeof x === "number") return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

// Mapping hasil query
const mapRow = (r: any): ProductionRow => ({
  id: r.id || "",
  timestamp: r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp),
  lineId: r.line_id || r.lineId || "LINE_A_PC39",
  targetProduction: toNumber(r.target_production || r.targetProduction),
  actualProduction: toNumber(r.actual_production || r.actualProduction),
  defectCount: toNumber(r.defect_count || r.defectCount),
  status: r.status || "idle",
  oeePercentage: toNumber(r.oee_percentage || r.oeePercentage),
  availability: toNumber(r.availability),
  performance: toNumber(r.performance),
  quality: toNumber(r.quality),
});

// Ambil semua data production (descending by timestamp)
export async function findAllProduction(limit: number = 100) {
  try {
    const rows = await db
      .select()
      .from(productionLineAPC39)
      .orderBy(desc(productionLineAPC39.timestamp))
      .limit(limit);

    return rows.map(mapRow);
  } catch (err) {
    console.error("findAllProduction error:", err);
    return [];
  }
}

// Ambil data production terbaru (latest)
export async function findLatestProduction() {
  try {
    const [row] = await db
      .select()
      .from(productionLineAPC39)
      .orderBy(desc(productionLineAPC39.timestamp))
      .limit(1);

    return row ? mapRow(row) : null;
  } catch (err) {
    console.error("findLatestProduction error:", err);
    return null;
  }
}

// Ambil data production by date range
export async function findProductionByDateRange(
  startDate: Date,
  endDate: Date
) {
  try {
    const rows = await db
      .select()
      .from(productionLineAPC39)
      .where(
        sql`${productionLineAPC39.timestamp} >= ${startDate} AND ${productionLineAPC39.timestamp} <= ${endDate}`
      )
      .orderBy(desc(productionLineAPC39.timestamp));

    return rows.map(mapRow);
  } catch (err) {
    console.error("findProductionByDateRange error:", err);
    return [];
  }
}

// Insert new production data
export async function insertProduction(data: Partial<ProductionRow>) {
  try {
    const [row] = await db
      .insert(productionLineAPC39)
      .values({
        id: data.id || `prod_${Date.now()}`,
        timestamp: data.timestamp || new Date(),
        lineId: data.lineId || "LINE_A_PC39",
        targetProduction: data.targetProduction || 0,
        actualProduction: data.actualProduction || 0,
        defectCount: data.defectCount || 0,
        status: data.status || "idle",
        oeePercentage: data.oeePercentage || 0,
        availability: data.availability || 0,
        performance: data.performance || 0,
        quality: data.quality || 0,
      })
      .returning();

    return row ? mapRow(row) : null;
  } catch (err) {
    console.error("insertProduction error:", err);
    return null;
  }
}
