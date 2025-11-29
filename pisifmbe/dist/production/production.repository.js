"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAllProduction = findAllProduction;
exports.findLatestProduction = findLatestProduction;
exports.findProductionByDateRange = findProductionByDateRange;
exports.insertProduction = insertProduction;
// src/production/production.repository.ts
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
// Mapping hasil query
const mapRow = (r) => ({
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
async function findAllProduction(limit = 100) {
    try {
        const rows = await db_1.db
            .select()
            .from(schema_1.productionLineAPC39)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.productionLineAPC39.timestamp))
            .limit(limit);
        return rows.map(mapRow);
    }
    catch (err) {
        console.error("findAllProduction error:", err);
        return [];
    }
}
// Ambil data production terbaru (latest)
async function findLatestProduction() {
    try {
        const [row] = await db_1.db
            .select()
            .from(schema_1.productionLineAPC39)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.productionLineAPC39.timestamp))
            .limit(1);
        return row ? mapRow(row) : null;
    }
    catch (err) {
        console.error("findLatestProduction error:", err);
        return null;
    }
}
// Ambil data production by date range
async function findProductionByDateRange(startDate, endDate) {
    try {
        const rows = await db_1.db
            .select()
            .from(schema_1.productionLineAPC39)
            .where((0, drizzle_orm_1.sql) `${schema_1.productionLineAPC39.timestamp} >= ${startDate} AND ${schema_1.productionLineAPC39.timestamp} <= ${endDate}`)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.productionLineAPC39.timestamp));
        return rows.map(mapRow);
    }
    catch (err) {
        console.error("findProductionByDateRange error:", err);
        return [];
    }
}
// Insert new production data
async function insertProduction(data) {
    try {
        const [row] = await db_1.db
            .insert(schema_1.productionLineAPC39)
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
    }
    catch (err) {
        console.error("insertProduction error:", err);
        return null;
    }
}
