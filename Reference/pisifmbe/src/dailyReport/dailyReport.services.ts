import { DailyReportRepository } from "./dailyReport.repository";

export class DailyReportService {
  private repository: DailyReportRepository;

  constructor() {
    this.repository = new DailyReportRepository();
  }

  // Get LVMDP daily report
  async getLvmdpDailyReport(panelId: number, date?: string) {
    const reportDate = date || new Date().toISOString().split("T")[0];
    return await this.repository.getLvmdpDailyReport(panelId, reportDate);
  }

  // Get production daily report
  async getProductionDailyReport(lineId: string, date?: string) {
    const reportDate = date || new Date().toISOString().split("T")[0];
    return await this.repository.getProductionDailyReport(lineId, reportDate);
  }

  // Get weigher daily report
  async getWeigherDailyReport(lineId: string, date?: string) {
    const reportDate = date || new Date().toISOString().split("T")[0];
    return await this.repository.getWeigherDailyReport(lineId, reportDate);
  }

  // Get bagmaker daily report
  async getBagMakerDailyReport(lineId: string, date?: string) {
    const reportDate = date || new Date().toISOString().split("T")[0];
    return await this.repository.getBagMakerDailyReport(lineId, reportDate);
  }
}
