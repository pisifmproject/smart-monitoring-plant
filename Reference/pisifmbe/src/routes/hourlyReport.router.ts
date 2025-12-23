// src/routes/hourlyReport.router.ts
import { Router } from "express";
import {
  getHourlyReport as get1,
  getHourlyReportRange as getRange1,
  generateHourlyReport as generate1,
  generateSingleHour as generateHour1,
} from "../lvmdp/LVMDP_1/lvmdp_1.hourlyReport.controller";
import {
  getHourlyReport as get2,
  getHourlyReportRange as getRange2,
  generateHourlyReport as generate2,
  generateSingleHour as generateHour2,
} from "../lvmdp/LVMDP_2/lvmdp_2.hourlyReport.controller";
import {
  getHourlyReport as get3,
  getHourlyReportRange as getRange3,
  generateHourlyReport as generate3,
  generateSingleHour as generateHour3,
} from "../lvmdp/LVMDP_3/lvmdp_3.hourlyReport.controller";
import {
  getHourlyReport as get4,
  getHourlyReportRange as getRange4,
  generateHourlyReport as generate4,
  generateSingleHour as generateHour4,
} from "../lvmdp/LVMDP_4/lvmdp_4.hourlyReport.controller";

const router = Router();

/* ===========================
   LVMDP 1 - Hourly Report Routes
=========================== */
router.get("/1/hourly", get1); // GET /api/hourly-report/1/hourly?date=2025-11-27
router.get("/1/hourly/range", getRange1); // GET /api/hourly-report/1/hourly/range?start=2025-11-01&end=2025-11-27
router.post("/1/hourly/generate", generate1); // POST /api/hourly-report/1/hourly/generate { date: "2025-11-27" }
router.post("/1/hourly/generate-hour", generateHour1); // POST /api/hourly-report/1/hourly/generate-hour { date: "2025-11-27", hour: 14 }

/* ===========================
   LVMDP 2 - Hourly Report Routes
=========================== */
router.get("/2/hourly", get2);
router.get("/2/hourly/range", getRange2);
router.post("/2/hourly/generate", generate2);
router.post("/2/hourly/generate-hour", generateHour2);

/* ===========================
   LVMDP 3 - Hourly Report Routes
=========================== */
router.get("/3/hourly", get3);
router.get("/3/hourly/range", getRange3);
router.post("/3/hourly/generate", generate3);
router.post("/3/hourly/generate-hour", generateHour3);

/* ===========================
   LVMDP 4 - Hourly Report Routes
=========================== */
router.get("/4/hourly", get4);
router.get("/4/hourly/range", getRange4);
router.post("/4/hourly/generate", generate4);
router.post("/4/hourly/generate-hour", generateHour4);

export default router;
