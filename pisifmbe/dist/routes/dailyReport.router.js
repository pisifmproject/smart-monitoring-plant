"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dailyReport_controller_1 = require("../dailyReport/dailyReport.controller");
const router = (0, express_1.Router)();
const controller = new dailyReport_controller_1.DailyReportController();
// LVMDP daily reports
router.get("/lvmdp/:panelId", (req, res) => controller.getLvmdpDailyReport(req, res));
// Production daily reports
router.get("/production/:lineId", (req, res) => controller.getProductionDailyReport(req, res));
// Packing weigher daily reports
router.get("/weigher/:lineId", (req, res) => controller.getWeigherDailyReport(req, res));
// Packing bagmaker daily reports
router.get("/bagmaker/:lineId", (req, res) => controller.getBagMakerDailyReport(req, res));
exports.default = router;
