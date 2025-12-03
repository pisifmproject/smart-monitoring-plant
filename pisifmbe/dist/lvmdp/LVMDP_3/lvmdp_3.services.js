"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHourlyAveragesLVMDP3 = exports.getShiftAveragesLVMDP3 = exports.getAllLVMDPs = void 0;
const lvmdp_3_repository_1 = require("./lvmdp_3.repository");
const getAllLVMDPs = async () => {
    return await (0, lvmdp_3_repository_1.findLVMDPs)();
};
exports.getAllLVMDPs = getAllLVMDPs;
const SHIFT = [
    { key: "shift1", start: "07:01", end: "14:30" },
    { key: "shift2", start: "14:31", end: "22:00" },
    { key: "shift3", start: "22:01", end: "07:00" },
];
/**
 * Bikin Date dari 'YYYY-MM-DD' + 'HH:mm' dalam timezone +07:00 (WIB)
 * Hasil dalam UTC (untuk comparison dengan data dari DB yang sudah UTC)
 */
function at(dateStr, hhmm) {
    const [Y, M, D] = dateStr.split("-").map(Number);
    const [h, m] = hhmm.split(":").map(Number);
    // Bikin date di local +07:00 timezone, convert ke UTC
    // UTC = LocalTime - 7 jam
    const utcTime = Date.UTC(Y, M - 1, D, h, m, 0, 0) - 7 * 60 * 60 * 1000;
    return new Date(utcTime);
}
function makeRange(dateStr, startHHMM, endHHMM) {
    const start = at(dateStr, startHHMM);
    let end = at(dateStr, endHHMM);
    if (end <= start)
        end.setDate(end.getDate() + 1);
    return { start, end };
}
function computeAverages(rows) {
    let sumRealPower = 0;
    let sumI = 0;
    let sumCosPhi = 0;
    let n = 0;
    for (const r of rows) {
        const realPower = Number(r.realPower) || 0;
        const I = Number(r.avgCurrent) || 0;
        const cosPhi = Number(r.cosPhi) || 0;
        sumRealPower += realPower;
        sumI += I;
        sumCosPhi += cosPhi;
        n++;
    }
    return {
        count: n,
        totalKwh: sumRealPower, // Sum of all real power
        avgKwh: n ? sumRealPower / n : 0, // Average of real power (kW)
        avgCurrent: n ? sumI / n : 0,
        avgCosPhi: n ? sumCosPhi / n : 0, // Average power factor
    };
}
const getShiftAveragesLVMDP3 = async (dateStr) => {
    const today = dateStr ?? new Date().toISOString().slice(0, 10);
    // Pass date filter to reduce data fetched from DB
    const allRows = await (0, lvmdp_3_repository_1.findLVMDPs)(today);
    // Data dari DB sudah dalam UTC (converted dari +07:00)
    const inRange = (d, start, end) => d >= start && d < end;
    const out = {};
    for (const s of SHIFT) {
        const { start, end } = makeRange(today, s.start, s.end);
        const rows = allRows.filter((r) => {
            const t = r.waktu instanceof Date ? r.waktu : new Date(r.waktu);
            return inRange(t, start, end);
        });
        out[s.key] = computeAverages(rows);
    }
    return out;
};
exports.getShiftAveragesLVMDP3 = getShiftAveragesLVMDP3;
/**
 * Ambil hourly aggregates untuk satu hari, dihitung dari raw data
 * Range: 00:00 - 23:59 untuk tanggal yang dipilih (calendar day)
 */
const getHourlyAveragesLVMDP3 = async (dateStr) => {
    const today = dateStr ?? new Date().toISOString().slice(0, 10);
    // Fetch data untuk tanggal yang dipilih
    const allRows = await (0, lvmdp_3_repository_1.findLVMDPs)(today);
    // Kelompokkan per jam untuk calendar day (00:00-23:00)
    const hourlyMap = new Map();
    for (const r of allRows) {
        const t = r.waktu instanceof Date ? r.waktu : new Date(r.waktu);
        // Convert to WIB timezone
        const wibTime = new Date(t.getTime() + 7 * 60 * 60 * 1000);
        const rowDateStr = wibTime.toISOString().slice(0, 10);
        // Only include data from the selected date
        if (rowDateStr !== today)
            continue;
        // Get hour in WIB (00-23)
        const hourStr = `${String(wibTime.getUTCHours()).padStart(2, "0")}:00`;
        const key = `${today}T${hourStr}`;
        if (!hourlyMap.has(key)) {
            hourlyMap.set(key, []);
        }
        hourlyMap.get(key).push(r);
    } // Compute averages per jam
    const result = Array.from(hourlyMap.entries())
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([hour, rows]) => {
        const avg = computeAverages(rows);
        return {
            hour: new Date(hour),
            totalKwh: avg.totalKwh, // Sum of kWh for this hour
            avgKwh: avg.avgKwh, // Average kWh
            avgCurrent: avg.avgCurrent,
            cosPhi: avg.avgCosPhi, // Average power factor
            count: avg.count,
        };
    });
    return result;
};
exports.getHourlyAveragesLVMDP3 = getHourlyAveragesLVMDP3;
