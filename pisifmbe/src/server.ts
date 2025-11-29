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
import { initDailyReportScheduler } from "./cron/dailyReportScheduler";
import { initHourlyReportScheduler } from "./cron/hourlyReportScheduler";
import { startLvmdpPolling } from "./lvmdp/lvmdpPoller";
import { findLatestLVMDP1 } from "./lvmdp/LVMDP_1/lvmdp_1.repository";
import { findLatestLVMDP2 } from "./lvmdp/LVMDP_2/lvmdp_2.repository";
import { findLatestLVMDP3 } from "./lvmdp/LVMDP_3/lvmdp_3.repository";
import { findLatestLVMDP4 } from "./lvmdp/LVMDP_4/lvmdp_4.repository";

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
server.listen(PORT, "0.0.0.0", () => {
  console.log(`API & WS running on http://localhost:${PORT}`);

  // Start hourly report scheduler (generate reports every hour at :05)
  try {
    initHourlyReportScheduler();
    console.log("✓ Hourly report scheduler initialized");
  } catch (err) {
    console.error("✗ Failed to init hourly report scheduler:", err);
  }

  // Start daily report scheduler (generate reports for yesterday at 00:05 every day)
  try {
    initDailyReportScheduler();
    console.log("✓ Daily report scheduler initialized");
  } catch (err) {
    console.error("✗ Failed to init daily report scheduler:", err);
  }

  // Start LVMDP polling untuk realtime data via Socket.IO
  try {
    startLvmdpPolling(1, findLatestLVMDP1, 1000);
    startLvmdpPolling(2, findLatestLVMDP2, 1000);
    startLvmdpPolling(3, findLatestLVMDP3, 1000);
    startLvmdpPolling(4, findLatestLVMDP4, 1000);
    console.log("✓ LVMDP polling initialized for panels 1-4");
  } catch (err) {
    console.error("✗ Failed to init LVMDP polling:", err);
  }
});
