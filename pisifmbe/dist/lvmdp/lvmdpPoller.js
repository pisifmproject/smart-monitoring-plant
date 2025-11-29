"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startLvmdpPolling = startLvmdpPolling;
exports.stopLvmdpPolling = stopLvmdpPolling;
// src/lvmdp/lvmdpPoller.ts
const socket_1 = require("../socket");
// Simpan state terakhir per panelId
const lastKey = {};
const timers = {};
/**
 * Start polling 1 LVMDP (panelId 1–4).
 * - panelId     : 1, 2, 3, 4
 * - fetchLatest : fungsi dari repository, mis. findLatestLVMDP1
 * - intervalMs  : default 1000 ms
 */
function startLvmdpPolling(panelId, fetchLatest, intervalMs = 1000) {
    // kalau sudah jalan, jangan start dua kali
    if (timers[panelId])
        return;
    timers[panelId] = setInterval(async () => {
        try {
            const row = await fetchLatest();
            if (!row)
                return;
            // bikin "key" unik untuk mendeteksi perubahan data
            const ts = new Date(row.waktu).toISOString();
            const key = `${ts}-${row.totalKwh ?? 0}-${row.avgCurrent ?? 0}`;
            if (lastKey[panelId] === key) {
                // data sama dengan sebelumnya -> tidak usah emit
                return;
            }
            lastKey[panelId] = key;
            // emit ke room socket: "lvmdp:raw"
            (0, socket_1.io)().to((0, socket_1.roomFor)(panelId)).emit("lvmdp:raw", {
                panelId,
                waktu: row.waktu,
                totalKwh: row.totalKwh,
                cosPhi: row.cosPhi,
                freq: row.freq,
                avgLineLine: row.avgLineLine,
                avgLineNeut: row.avgLineNeut,
                avgCurrent: row.avgCurrent,
            });
        }
        catch (err) {
            // silently handle polling errors
        }
    }, intervalMs);
}
/** optional: berhentikan polling kalau perlu */
function stopLvmdpPolling(panelId) {
    const t = timers[panelId];
    if (!t)
        return;
    clearInterval(t);
    timers[panelId] = null;
    lastKey[panelId] = null;
}
