"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyReportController = void 0;
const dailyReport_services_1 = require("./dailyReport.services");
const service = new dailyReport_services_1.DailyReportService();
class DailyReportController {
    // GET /api/daily-report/lvmdp/:panelId?date=YYYY-MM-DD
    async getLvmdpDailyReport(req, res) {
        try {
            const panelId = parseInt(req.params.panelId);
            const date = req.query.date;
            if (!panelId || panelId < 1 || panelId > 4) {
                return res.status(400).json({ error: "Invalid panel ID (1-4)" });
            }
            const data = await service.getLvmdpDailyReport(panelId, date);
            return res.json({ success: true, data });
        }
        catch (error) {
            console.error("Error fetching LVMDP daily report:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    // GET /api/daily-report/production/:lineId?date=YYYY-MM-DD
    async getProductionDailyReport(req, res) {
        try {
            const lineId = req.params.lineId;
            const date = req.query.date;
            const data = await service.getProductionDailyReport(lineId, date);
            return res.json({ success: true, data });
        }
        catch (error) {
            console.error("Error fetching production daily report:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    // GET /api/daily-report/weigher/:lineId?date=YYYY-MM-DD
    async getWeigherDailyReport(req, res) {
        try {
            const lineId = req.params.lineId;
            const date = req.query.date;
            const data = await service.getWeigherDailyReport(lineId, date);
            return res.json({ success: true, data });
        }
        catch (error) {
            console.error("Error fetching weigher daily report:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    // GET /api/daily-report/bagmaker/:lineId?date=YYYY-MM-DD
    async getBagMakerDailyReport(req, res) {
        try {
            const lineId = req.params.lineId;
            const date = req.query.date;
            const data = await service.getBagMakerDailyReport(lineId, date);
            return res.json({ success: true, data });
        }
        catch (error) {
            console.error("Error fetching bagmaker daily report:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
exports.DailyReportController = DailyReportController;
