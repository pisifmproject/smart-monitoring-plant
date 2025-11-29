"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/hourlyReport.router.ts
const express_1 = require("express");
const lvmdp_1_hourlyReport_controller_1 = require("../lvmdp/LVMDP_1/lvmdp_1.hourlyReport.controller");
const lvmdp_2_hourlyReport_controller_1 = require("../lvmdp/LVMDP_2/lvmdp_2.hourlyReport.controller");
const lvmdp_3_hourlyReport_controller_1 = require("../lvmdp/LVMDP_3/lvmdp_3.hourlyReport.controller");
const lvmdp_4_hourlyReport_controller_1 = require("../lvmdp/LVMDP_4/lvmdp_4.hourlyReport.controller");
const router = (0, express_1.Router)();
/* ===========================
   LVMDP 1 - Hourly Report Routes
=========================== */
router.get("/1/hourly", lvmdp_1_hourlyReport_controller_1.getHourlyReport); // GET /api/hourly-report/1/hourly?date=2025-11-27
router.get("/1/hourly/range", lvmdp_1_hourlyReport_controller_1.getHourlyReportRange); // GET /api/hourly-report/1/hourly/range?start=2025-11-01&end=2025-11-27
router.post("/1/hourly/generate", lvmdp_1_hourlyReport_controller_1.generateHourlyReport); // POST /api/hourly-report/1/hourly/generate { date: "2025-11-27" }
router.post("/1/hourly/generate-hour", lvmdp_1_hourlyReport_controller_1.generateSingleHour); // POST /api/hourly-report/1/hourly/generate-hour { date: "2025-11-27", hour: 14 }
/* ===========================
   LVMDP 2 - Hourly Report Routes
=========================== */
router.get("/2/hourly", lvmdp_2_hourlyReport_controller_1.getHourlyReport);
router.get("/2/hourly/range", lvmdp_2_hourlyReport_controller_1.getHourlyReportRange);
router.post("/2/hourly/generate", lvmdp_2_hourlyReport_controller_1.generateHourlyReport);
router.post("/2/hourly/generate-hour", lvmdp_2_hourlyReport_controller_1.generateSingleHour);
/* ===========================
   LVMDP 3 - Hourly Report Routes
=========================== */
router.get("/3/hourly", lvmdp_3_hourlyReport_controller_1.getHourlyReport);
router.get("/3/hourly/range", lvmdp_3_hourlyReport_controller_1.getHourlyReportRange);
router.post("/3/hourly/generate", lvmdp_3_hourlyReport_controller_1.generateHourlyReport);
router.post("/3/hourly/generate-hour", lvmdp_3_hourlyReport_controller_1.generateSingleHour);
/* ===========================
   LVMDP 4 - Hourly Report Routes
=========================== */
router.get("/4/hourly", lvmdp_4_hourlyReport_controller_1.getHourlyReport);
router.get("/4/hourly/range", lvmdp_4_hourlyReport_controller_1.getHourlyReportRange);
router.post("/4/hourly/generate", lvmdp_4_hourlyReport_controller_1.generateHourlyReport);
router.post("/4/hourly/generate-hour", lvmdp_4_hourlyReport_controller_1.generateSingleHour);
exports.default = router;
