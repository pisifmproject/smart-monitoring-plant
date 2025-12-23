// src/lvmdp/lvmdpPoller.ts
import { io, roomFor } from "../socket";

/**
 * Bentuk data yang dikirim ke frontend.
 * Sesuaikan dengan mapRow di repository (totalKwh, cosPhi, dst).
 */
export type LvmdpRow = {
  waktu: Date | string;
  totalKwh: number | null;
  cosPhi: number | null;
  freq: number | null;
  avgLineLine: number | null;
  avgLineNeut: number | null;
  avgCurrent: number | null;
};

// Signature fungsi "ambil data terbaru" dari repository
export type FetchLatestFn = () => Promise<LvmdpRow | null>;

// Simpan state terakhir per panelId
const lastKey: Record<number, string | null> = {};
const timers: Record<number, NodeJS.Timeout | null> = {};

/**
 * Start polling 1 LVMDP (panelId 1–4).
 * - panelId     : 1, 2, 3, 4
 * - fetchLatest : fungsi dari repository, mis. findLatestLVMDP1
 * - intervalMs  : default 1000 ms
 */
export function startLvmdpPolling(
  panelId: number,
  fetchLatest: FetchLatestFn,
  intervalMs = 1000
) {
  // kalau sudah jalan, jangan start dua kali
  if (timers[panelId]) return;

  timers[panelId] = setInterval(async () => {
    try {
      const row = await fetchLatest();
      if (!row) return;

      // bikin "key" unik untuk mendeteksi perubahan data
      const ts = new Date(row.waktu).toISOString();
      const key = `${ts}-${row.totalKwh ?? 0}-${row.avgCurrent ?? 0}`;

      if (lastKey[panelId] === key) {
        // data sama dengan sebelumnya -> tidak usah emit
        return;
      }
      lastKey[panelId] = key;

      // emit ke room socket: "lvmdp:raw"
      io().to(roomFor(panelId)).emit("lvmdp:raw", {
        panelId,
        waktu: row.waktu,
        totalKwh: row.totalKwh,
        cosPhi: row.cosPhi,
        freq: row.freq,
        avgLineLine: row.avgLineLine,
        avgLineNeut: row.avgLineNeut,
        avgCurrent: row.avgCurrent,
      });
    } catch (err) {
      // silently handle polling errors
    }
  }, intervalMs);
}

/** optional: berhentikan polling kalau perlu */
export function stopLvmdpPolling(panelId: number) {
  const t = timers[panelId];
  if (!t) return;
  clearInterval(t);
  timers[panelId] = null;
  lastKey[panelId] = null;
}
