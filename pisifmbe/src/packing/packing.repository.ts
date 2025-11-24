// src/packing/packing.repository.ts
import { db } from "../db";
import { packingLineAWeigher, packingLineABagMaker } from "../db/schema";
import { desc, sql } from "drizzle-orm";

type PackingWeigherRow = {
  id: string;
  timestamp: Date;
  lineId: string;
  targetPacks: number;
  actualPacks: number;
  rejectCount: number;
  avgWeight: number;
  minWeight: number;
  maxWeight: number;
  status: string;
  efficiency: number;
};

type PackingBagMakerRow = {
  id: string;
  timestamp: Date;
  lineId: string;
  targetBags: number;
  actualBags: number;
  defectBags: number;
  status: string;
  efficiency: number;
  speedRpm: number;
};

// Helper numeric
function toNumber(x: unknown): number {
  if (x === null || x === undefined) return 0;
  if (typeof x === "number") return x;
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

// ============== WEIGHER ==================

const mapWeigherRow = (r: any): PackingWeigherRow => ({
  id: r.id || "",
  timestamp: r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp),
  lineId: r.line_id || r.lineId || "LINE_A_WEIGHER",
  targetPacks: toNumber(r.target_packs || r.targetPacks),
  actualPacks: toNumber(r.actual_packs || r.actualPacks),
  rejectCount: toNumber(r.reject_count || r.rejectCount),
  avgWeight: toNumber(r.avg_weight || r.avgWeight),
  minWeight: toNumber(r.min_weight || r.minWeight),
  maxWeight: toNumber(r.max_weight || r.maxWeight),
  status: r.status || "idle",
  efficiency: toNumber(r.efficiency),
});

export async function findAllWeigher(limit: number = 100) {
  try {
    const rows = await db
      .select()
      .from(packingLineAWeigher)
      .orderBy(desc(packingLineAWeigher.timestamp))
      .limit(limit);

    return rows.map(mapWeigherRow);
  } catch (err) {
    console.error("findAllWeigher error:", err);
    return [];
  }
}

export async function findLatestWeigher() {
  try {
    const [row] = await db
      .select()
      .from(packingLineAWeigher)
      .orderBy(desc(packingLineAWeigher.timestamp))
      .limit(1);

    return row ? mapWeigherRow(row) : null;
  } catch (err) {
    console.error("findLatestWeigher error:", err);
    return null;
  }
}

export async function insertWeigher(data: Partial<PackingWeigherRow>) {
  try {
    const [row] = await db
      .insert(packingLineAWeigher)
      .values({
        id: data.id || `weigher_${Date.now()}`,
        timestamp: data.timestamp || new Date(),
        lineId: data.lineId || "LINE_A_WEIGHER",
        targetPacks: data.targetPacks || 0,
        actualPacks: data.actualPacks || 0,
        rejectCount: data.rejectCount || 0,
        avgWeight: data.avgWeight || 0,
        minWeight: data.minWeight || 0,
        maxWeight: data.maxWeight || 0,
        status: data.status || "idle",
        efficiency: data.efficiency || 0,
      })
      .returning();

    return row ? mapWeigherRow(row) : null;
  } catch (err) {
    console.error("insertWeigher error:", err);
    return null;
  }
}

// ============== BAGMAKER ==================

const mapBagMakerRow = (r: any): PackingBagMakerRow => ({
  id: r.id || "",
  timestamp: r.timestamp instanceof Date ? r.timestamp : new Date(r.timestamp),
  lineId: r.line_id || r.lineId || "LINE_A_BAGMAKER",
  targetBags: toNumber(r.target_bags || r.targetBags),
  actualBags: toNumber(r.actual_bags || r.actualBags),
  defectBags: toNumber(r.defect_bags || r.defectBags),
  status: r.status || "idle",
  efficiency: toNumber(r.efficiency),
  speedRpm: toNumber(r.speed_rpm || r.speedRpm),
});

export async function findAllBagMaker(limit: number = 100) {
  try {
    const rows = await db
      .select()
      .from(packingLineABagMaker)
      .orderBy(desc(packingLineABagMaker.timestamp))
      .limit(limit);

    return rows.map(mapBagMakerRow);
  } catch (err) {
    console.error("findAllBagMaker error:", err);
    return [];
  }
}

export async function findLatestBagMaker() {
  try {
    const [row] = await db
      .select()
      .from(packingLineABagMaker)
      .orderBy(desc(packingLineABagMaker.timestamp))
      .limit(1);

    return row ? mapBagMakerRow(row) : null;
  } catch (err) {
    console.error("findLatestBagMaker error:", err);
    return null;
  }
}

export async function insertBagMaker(data: Partial<PackingBagMakerRow>) {
  try {
    const [row] = await db
      .insert(packingLineABagMaker)
      .values({
        id: data.id || `bagmaker_${Date.now()}`,
        timestamp: data.timestamp || new Date(),
        lineId: data.lineId || "LINE_A_BAGMAKER",
        targetBags: data.targetBags || 0,
        actualBags: data.actualBags || 0,
        defectBags: data.defectBags || 0,
        status: data.status || "idle",
        efficiency: data.efficiency || 0,
        speedRpm: data.speedRpm || 0,
      })
      .returning();

    return row ? mapBagMakerRow(row) : null;
  } catch (err) {
    console.error("insertBagMaker error:", err);
    return null;
  }
}
