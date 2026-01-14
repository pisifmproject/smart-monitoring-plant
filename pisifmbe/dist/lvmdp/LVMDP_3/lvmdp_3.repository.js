"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLVMDPs = findLVMDPs;
exports.findLatestLVMDP3 = findLatestLVMDP3;
exports.findLatestHMI3 = findLatestHMI3;
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
// Map dari lvmdp_hmi table untuk LVMDP3
const mapHMIRow = (r) => ({
    waktu: r.datetimefield instanceof Date
        ? r.datetimefield
        : new Date(r.datetimefield),
    totalKwh: toNumber(r.lvmdp_energy_lvmdp3),
    realPower: toNumber(r.lvmdp__total_lvmdp3),
    cosPhi: toNumber(r.lvmdp_cos_phi_lvmdp3),
    freq: toNumber(r.lvmdp_hz_lvmdp3),
    avgLineLine: toNumber(r.lvmdp_l_l_avg_lvmdp3),
    avgLineNeut: toNumber(r.lvmdp_l_n_avg_lvmdp3),
    avgCurrent: toNumber(r.lvmdp_avg_ampere_lvmdp3),
    currentR: toNumber(r.lvmdp_r_lvmdp3),
    currentS: toNumber(r.lvmdp_s_lvmdp3),
    currentT: toNumber(r.lvmdp_t_lvmdp3),
    voltageRS: toNumber(r.lvmdp_r_s_lvmdp3),
    voltageST: toNumber(r.lvmdp_s_t_lvmdp3),
    voltageTR: toNumber(r.lvmdp_t_r_lvmdp3),
});
async function findLVMDPs(dateFrom, dateTo) {
    try {
        let query;
        if (dateFrom && dateTo) {
            // Date range query
            query = (0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_3 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateTo}::date + interval '1 day')
                  ORDER BY waktu ASC`;
        }
        else if (dateFrom) {
            // Single date filter - only get data for this specific date
            query = (0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_3 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateFrom}::date + interval '1 day')
                  ORDER BY waktu ASC`;
        }
        else {
            // No filter, get only last 7 days (reduced from 31)
            query = (0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_3 
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
        console.log(`[REPO LVMDP3] Query: ${t1 - t0}ms, Rows: ${rows.length}`);
        return rows.map(mapRow);
    }
    catch (error) {
        console.error("Error in findLVMDPs:", error);
        return [];
    }
}
/**
 * Try to get data dari v_lvmdp_3 view atau lvmdp_hmi table (LVMDP3 columns)
 */
// In-memory cache for latest data (reduces DB queries)
let latestCache3 = null;
const LATEST_CACHE_TTL_3 = 3000; // 3 seconds cache
async function findLatestLVMDP3() {
    // Check cache first
    if (latestCache3 && Date.now() - latestCache3.timestamp < LATEST_CACHE_TTL_3) {
        return latestCache3.data;
    }
    // Try v_lvmdp_3 first with optimized query (no date filter for faster index scan)
    try {
        const result = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_3 
          ORDER BY waktu DESC 
          LIMIT 1`);
        const rows = result.rows || result;
        const row = Array.isArray(rows) ? rows[0] : null;
        if (row) {
            const mapped = mapRow(row);
            latestCache3 = { data: mapped, timestamp: Date.now() };
            return mapped;
        }
    }
    catch (error) {
        // Silently try fallback
    }
    // Fallback ke lvmdp_hmi for LVMDP3 data with optimized query
    try {
        const result = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT * FROM public.lvmdp_hmi 
          ORDER BY datetimefield DESC 
          LIMIT 1`);
        const rows = result.rows || result;
        const row = Array.isArray(rows) ? rows[0] : null;
        if (row) {
            const mapped = mapHMIRow(row);
            latestCache3 = { data: mapped, timestamp: Date.now() };
            return mapped;
        }
    }
    catch (error) {
        console.error("[LVMDP3] Error fetching data:", error);
    }
    return null;
}
// ambil data RST (current & voltage) dari lvmdp_hmi
async function findLatestHMI3() {
    try {
        const result = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT 
        lvmdp_r_lvmdp3, lvmdp_s_lvmdp3, lvmdp_t_lvmdp3,
        lvmdp_r_s_lvmdp3, lvmdp_s_t_lvmdp3, lvmdp_t_r_lvmdp3
      FROM public.lvmdp_hmi 
      ORDER BY datetimefield DESC LIMIT 1`);
        const rows = result.rows || result;
        const row = Array.isArray(rows) ? rows[0] : null;
        if (!row)
            return null;
        return {
            currentR: toNumber(row.lvmdp_r_lvmdp3),
            currentS: toNumber(row.lvmdp_s_lvmdp3),
            currentT: toNumber(row.lvmdp_t_lvmdp3),
            voltageRS: toNumber(row.lvmdp_r_s_lvmdp3),
            voltageST: toNumber(row.lvmdp_s_t_lvmdp3),
            voltageTR: toNumber(row.lvmdp_t_r_lvmdp3),
        };
    }
    catch (error) {
        console.error("Error in findLatestHMI3:", error);
        return null;
    }
}
