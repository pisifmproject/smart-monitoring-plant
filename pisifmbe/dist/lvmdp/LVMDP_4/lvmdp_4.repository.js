"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLVMDPs = findLVMDPs;
exports.findLatestLVMDP4 = findLatestLVMDP4;
const db_1 = require("../../db");
const drizzle_orm_1 = require("drizzle-orm");
function toNumber(x) {
    if (x === null || x === undefined)
        return 0;
    if (typeof x === "number")
        return x;
    const n = Number(x);
    return Number.isFinite(n) ? n : 0;
}
const mapRow = (r) => ({
    waktu: r.waktu instanceof Date ? r.waktu : new Date(r.waktu),
    totalKwh: toNumber(r.total_kwh),
    cosPhi: toNumber(r.cos_phi),
    freq: toNumber(r.freq),
    avgLineLine: toNumber(r.avg_line_line),
    avgLineNeut: toNumber(r.avg_line_neut),
    avgCurrent: toNumber(r.avg_current),
});
async function findLVMDPs(dateFrom, dateTo) {
    try {
        let query;
        if (dateFrom && dateTo) {
            // Date range query
            query = (0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_4 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateTo}::date + interval '1 day')
                  ORDER BY waktu ASC`;
        }
        else if (dateFrom) {
            // Single date filter - only get data for this specific date
            query = (0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_4 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateFrom}::date + interval '1 day')
                  ORDER BY waktu ASC`;
        }
        else {
            // No filter, get only last 7 days (reduced from 31)
            query = (0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_4 
                  WHERE waktu >= CURRENT_DATE - interval '7 days'
                  ORDER BY waktu DESC
                  LIMIT 10000`;
        }
        const t0 = Date.now();
        const result = await db_1.db.execute(query);
        const t1 = Date.now();
        let rows = [];
        if (Array.isArray(result)) {
            rows = result;
        }
        else if (result && typeof result === "object") {
            if (Array.isArray(result.rows)) {
                rows = result.rows;
            }
        }
        console.log(`[REPO LVMDP4] Query: ${t1 - t0}ms, Rows: ${rows.length}`);
        return rows.map(mapRow);
    }
    catch (error) {
        console.error("Error in findLVMDPs:", error);
        return [];
    }
}
async function findLatestLVMDP4() {
    const result = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_4 ORDER BY waktu DESC LIMIT 1`);
    const rows = result.rows || result;
    const row = Array.isArray(rows) ? rows[0] : null;
    return row ? mapRow(row) : null;
}
