"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllWeigher = findAllWeigher;
exports.findLatestWeigher = findLatestWeigher;
exports.insertWeigher = insertWeigher;
exports.findAllBagMaker = findAllBagMaker;
exports.findLatestBagMaker = findLatestBagMaker;
exports.insertBagMaker = insertBagMaker;
// src/packing/packing.repository.ts
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
// Helper numeric
function toNumber(x) {
    if (x === null || x === undefined)
        return 0;
    if (typeof x === "number")
        return x;
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
}
// ============== WEIGHER ==================
const mapWeigherRow = (r) => ({
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
async function findAllWeigher(limit = 100) {
    try {
        const rows = await db_1.db
            .select()
            .from(schema_1.packingLineAWeigher)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.packingLineAWeigher.timestamp))
            .limit(limit);
        return rows.map(mapWeigherRow);
    }
    catch (err) {
        console.error("findAllWeigher error:", err);
        return [];
    }
}
async function findLatestWeigher() {
    try {
        const [row] = await db_1.db
            .select()
            .from(schema_1.packingLineAWeigher)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.packingLineAWeigher.timestamp))
            .limit(1);
        return row ? mapWeigherRow(row) : null;
    }
    catch (err) {
        console.error("findLatestWeigher error:", err);
        return null;
    }
}
async function insertWeigher(data) {
    try {
        const [row] = await db_1.db
            .insert(schema_1.packingLineAWeigher)
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
    }
    catch (err) {
        console.error("insertWeigher error:", err);
        return null;
    }
}
// ============== BAGMAKER ==================
const mapBagMakerRow = (r) => ({
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
async function findAllBagMaker(limit = 100) {
    try {
        const rows = await db_1.db
            .select()
            .from(schema_1.packingLineABagMaker)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.packingLineABagMaker.timestamp))
            .limit(limit);
        return rows.map(mapBagMakerRow);
    }
    catch (err) {
        console.error("findAllBagMaker error:", err);
        return [];
    }
}
async function findLatestBagMaker() {
    try {
        const [row] = await db_1.db
            .select()
            .from(schema_1.packingLineABagMaker)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.packingLineABagMaker.timestamp))
            .limit(1);
        return row ? mapBagMakerRow(row) : null;
    }
    catch (err) {
        console.error("findLatestBagMaker error:", err);
        return null;
    }
}
async function insertBagMaker(data) {
    try {
        const [row] = await db_1.db
            .insert(schema_1.packingLineABagMaker)
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
    }
    catch (err) {
        console.error("insertBagMaker error:", err);
        return null;
    }
}
