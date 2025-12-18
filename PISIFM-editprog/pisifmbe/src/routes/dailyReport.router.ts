import { Router } from "express";
import { DailyReportController } from "../dailyReport/dailyReport.controller";

const router = Router();
const controller = new DailyReportController();

// LVMDP daily reports
router.get("/lvmdp/:panelId", (req, res) =>
  controller.getLvmdpDailyReport(req, res)
);

// Production daily reports
router.get("/production/:lineId", (req, res) =>
  controller.getProductionDailyReport(req, res)
);

// Packing weigher daily reports
router.get("/weigher/:lineId", (req, res) =>
  controller.getWeigherDailyReport(req, res)
);

// Packing bagmaker daily reports
router.get("/bagmaker/:lineId", (req, res) =>
  controller.getBagMakerDailyReport(req, res)
);

export default router;
