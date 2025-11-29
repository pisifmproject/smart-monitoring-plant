"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyReportService = void 0;
const dailyReport_repository_1 = require("./dailyReport.repository");
class DailyReportService {
    constructor() {
        this.repository = new dailyReport_repository_1.DailyReportRepository();
    }
    // Get LVMDP daily report
    async getLvmdpDailyReport(panelId, date) {
        const reportDate = date || new Date().toISOString().split("T")[0];
        return await this.repository.getLvmdpDailyReport(panelId, reportDate);
    }
    // Get production daily report
    async getProductionDailyReport(lineId, date) {
        const reportDate = date || new Date().toISOString().split("T")[0];
        return await this.repository.getProductionDailyReport(lineId, reportDate);
    }
    // Get weigher daily report
    async getWeigherDailyReport(lineId, date) {
        const reportDate = date || new Date().toISOString().split("T")[0];
        return await this.repository.getWeigherDailyReport(lineId, reportDate);
    }
    // Get bagmaker daily report
    async getBagMakerDailyReport(lineId, date) {
        const reportDate = date || new Date().toISOString().split("T")[0];
        return await this.repository.getBagMakerDailyReport(lineId, reportDate);
    }
}
exports.DailyReportService = DailyReportService;
