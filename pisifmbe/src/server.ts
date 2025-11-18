// import http from "http";
// import app from "./index";
// import { initSocket, io } from "./socket";

// const server = http.createServer(app);

// // inisialisasi Socket.IO
// initSocket(server);

// // simulasi update data setiap 1 detik
// setInterval(() => {
//   // kirim hanya ke room LVMDP 1
//   io().to("lvmdp:1").emit("gaugeUpdate", {
//     id: "LVMDP_1",
//     availability: Math.trunc(Math.random() * 100),
//   });

//   // kalau nanti mau simulasi untuk mesin lain tinggal tambahkan:
//   // io().to("lvmdp:2").emit("gaugeUpdate", { id: "LVMDP_2", availability: Math.trunc(Math.random() * 100) });
// }, 1000);

// const PORT = Number(process.env.PORT) || 2000;
// server.listen(PORT, () => {
//   console.log(`API & WS running on http://localhost:${PORT}`);
// });

import http from "http";
import app from "./index";
import { initSocket, io } from "./socket";
import { roomFor } from "./socket"; // <- pakai helper roomFor
import { initDailyReportScheduler } from "./cron/dailyReportScheduler";

const server = http.createServer(app);
initSocket(server);

// mesin 1–4, random-walk biar halus
const ids = [1, 2, 3, 4] as const;
const state: Record<(typeof ids)[number], number> = {
  1: Math.trunc(Math.random() * 100),
  2: Math.trunc(Math.random() * 100),
  3: Math.trunc(Math.random() * 100),
  4: Math.trunc(Math.random() * 100),
};

const step = (v: number) => {
  const n = Math.max(0, Math.min(100, v + (Math.random() - 0.5) * 12));
  return Math.round(n);
};

// setInterval(() => {
//   for (const id of ids) {
//     state[id] = step(state[id]);
//     io().to(roomFor(id)).emit("gaugeUpdate", {
//       id: `LVMDP_${id}`,
//       availability: state[id],
//     });
//   }
// }, 1000);

const PORT = Number(process.env.PORT) || 2000;
server.listen(PORT, () => {
  console.log(`API & WS running on http://localhost:${PORT}`);
  // start daily report scheduler (generate reports for yesterday at 00:05 every day)
  try {
    initDailyReportScheduler();
  } catch (err) {
    console.error("Failed to init daily report scheduler:", err);
  }
});
