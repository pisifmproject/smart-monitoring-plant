"use strict";
// import http from "http";
// import app from "./index";
// import { initSocket, io } from "./socket";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const http_1 = __importDefault(require("http"));
const index_1 = __importDefault(require("./index"));
const socket_1 = require("./socket");
const dailyReportScheduler_1 = require("./cron/dailyReportScheduler");
const hourlyReportScheduler_1 = require("./cron/hourlyReportScheduler");
const electricalReportScheduler_1 = require("./cron/electricalReportScheduler");
const lvmdpPoller_1 = require("./lvmdp/lvmdpPoller");
const lvmdp_1_repository_1 = require("./lvmdp/LVMDP_1/lvmdp_1.repository");
const lvmdp_2_repository_1 = require("./lvmdp/LVMDP_2/lvmdp_2.repository");
const lvmdp_3_repository_1 = require("./lvmdp/LVMDP_3/lvmdp_3.repository");
const lvmdp_4_repository_1 = require("./lvmdp/LVMDP_4/lvmdp_4.repository");
const server = http_1.default.createServer(index_1.default);
(0, socket_1.initSocket)(server);
// mesin 1–4, random-walk biar halus
const ids = [1, 2, 3, 4];
const state = {
    1: Math.trunc(Math.random() * 100),
    2: Math.trunc(Math.random() * 100),
    3: Math.trunc(Math.random() * 100),
    4: Math.trunc(Math.random() * 100),
};
const step = (v) => {
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
        (0, hourlyReportScheduler_1.initHourlyReportScheduler)();
        console.log("✓ Hourly report scheduler initialized");
    }
    catch (err) {
        console.error("✗ Failed to init hourly report scheduler:", err);
    }
    // Start daily report scheduler (generate reports for yesterday at 00:05 every day)
    try {
        (0, dailyReportScheduler_1.initDailyReportScheduler)();
        console.log("✓ Daily report scheduler initialized");
    }
    catch (err) {
        console.error("✗ Failed to init daily report scheduler:", err);
    }
    // Start electrical report scheduler (aggregate electrical data daily at 00:05)
    try {
        (0, electricalReportScheduler_1.initElectricalReportScheduler)();
        console.log("✓ Electrical report scheduler initialized (ISO 50001 compliant)");
    }
    catch (err) {
        console.error("✗ Failed to init electrical report scheduler:", err);
    }
    // Start LVMDP polling untuk realtime data via Socket.IO
    try {
        (0, lvmdpPoller_1.startLvmdpPolling)(1, lvmdp_1_repository_1.findLatestLVMDP1, 1000);
        (0, lvmdpPoller_1.startLvmdpPolling)(2, lvmdp_2_repository_1.findLatestLVMDP2, 1000);
        (0, lvmdpPoller_1.startLvmdpPolling)(3, lvmdp_3_repository_1.findLatestLVMDP3, 1000);
        (0, lvmdpPoller_1.startLvmdpPolling)(4, lvmdp_4_repository_1.findLatestLVMDP4, 1000);
        console.log("✓ LVMDP polling initialized for panels 1-4");
    }
    catch (err) {
        console.error("✗ Failed to init LVMDP polling:", err);
    }
});
