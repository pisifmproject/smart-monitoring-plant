"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLVMDPs = findLVMDPs;
exports.findLatestLVMDP2 = findLatestLVMDP2;
exports.findLatestHMI2 = findLatestHMI2;
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
async function findLVMDPs(dateFrom, dateTo) {
    try {
        let query;
        if (dateFrom && dateTo) {
            // Date range query
            query = (0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_2 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateTo}::date + interval '1 day')
                  ORDER BY waktu ASC`;
        }
        else if (dateFrom) {
            // Single date filter - only get data for this specific date
            query = (0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_2 
                  WHERE waktu >= ${dateFrom}::date 
                  AND waktu < (${dateFrom}::date + interval '1 day')
                  ORDER BY waktu ASC`;
        }
        else {
            // No filter, get only last 7 days (reduced from 31)
            query = (0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_2 
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
        console.log(`[REPO LVMDP2] Query: ${t1 - t0}ms, Rows: ${rows.length}`);
        return rows.map(mapRow);
    }
    catch (error) {
        console.error("Error in findLVMDPs:", error);
        return [];
    }
}
async function findLatestLVMDP2() {
    const result = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT * FROM public.v_lvmdp_2 ORDER BY waktu DESC LIMIT 1`);
    const rows = result.rows || result;
    const row = Array.isArray(rows) ? rows[0] : null;
    return row ? mapRow(row) : null;
}
// ambil data RST (current & voltage) dari lvmdp_hmi
async function findLatestHMI2() {
    try {
        const result = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT 
        lvmdp_r_lvmdp2, lvmdp_s_lvmdp2, lvmdp_t_lvmdp2,
        lvmdp_r_s_lvmdp2, lvmdp_s_t_lvmdp2, lvmdp_t_r_lvmdp2
      FROM public.lvmdp_hmi 
      ORDER BY datetimefield DESC LIMIT 1`);
        const rows = result.rows || result;
        const row = Array.isArray(rows) ? rows[0] : null;
        if (!row)
            return null;
        return {
            currentR: toNumber(row.lvmdp_r_lvmdp2),
            currentS: toNumber(row.lvmdp_s_lvmdp2),
            currentT: toNumber(row.lvmdp_t_lvmdp2),
            voltageRS: toNumber(row.lvmdp_r_s_lvmdp2),
            voltageST: toNumber(row.lvmdp_s_t_lvmdp2),
            voltageTR: toNumber(row.lvmdp_t_r_lvmdp2),
        };
    }
    catch (error) {
        console.error("Error in findLatestHMI2:", error);
        return null;
    }
}
