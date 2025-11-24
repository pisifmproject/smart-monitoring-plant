import { db } from "../db/index";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import {
  dailyReportLVMDP1,
  dailyReportLVMDP2,
  dailyReportLVMDP3,
  dailyReportLVMDP4,
} from "../db/schema";

export class DailyReportRepository {
  // Get LVMDP daily report by panel and date
  async getLvmdpDailyReport(panelId: number, date: string) {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    let table;
    switch (panelId) {
      case 1:
        table = dailyReportLVMDP1;
        break;
      case 2:
        table = dailyReportLVMDP2;
        break;
      case 3:
        table = dailyReportLVMDP3;
        break;
      case 4:
        table = dailyReportLVMDP4;
        break;
      default:
        throw new Error("Invalid panel ID");
    }

    const data = await db
      .select()
      .from(table)
      .where(eq(table.reportDate, sql`${date}::date`))
      .orderBy(desc(table.reportDate));

    return data;
  }

  // Get production daily report by line and date
  async getProductionDailyReport(lineId: string, date: string) {
    try {
      // TODO: Implement real database query when production tables are ready
      // For now, return realistic mock data based on lineId

      const machineData: Record<string, any> = {
        LINE_A_PC39: {
          machineName: "PC39",
          shifts: [
            {
              shift: 1,
              startTime: "07:00",
              endTime: "15:00",
              target: 1200,
              actual: 1150,
              defect: 12,
              oee: 94.2,
              availability: 96.0,
              performance: 98.0,
              quality: 99.0,
            },
            {
              shift: 2,
              startTime: "15:00",
              endTime: "23:00",
              target: 1200,
              actual: 1180,
              defect: 8,
              oee: 97.5,
              availability: 98.0,
              performance: 99.0,
              quality: 99.3,
            },
            {
              shift: 3,
              startTime: "23:00",
              endTime: "07:00",
              target: 1200,
              actual: 1100,
              defect: 18,
              oee: 89.8,
              availability: 93.0,
              performance: 96.0,
              quality: 98.5,
            },
          ],
        },
        LINE_A_PC14: {
          machineName: "PC14",
          shifts: [
            {
              shift: 1,
              startTime: "07:00",
              endTime: "15:00",
              target: 1000,
              actual: 950,
              defect: 10,
              oee: 92.5,
              availability: 95.0,
              performance: 97.5,
              quality: 98.8,
            },
            {
              shift: 2,
              startTime: "15:00",
              endTime: "23:00",
              target: 1000,
              actual: 980,
              defect: 5,
              oee: 95.0,
              availability: 96.0,
              performance: 98.0,
              quality: 99.5,
            },
            {
              shift: 3,
              startTime: "23:00",
              endTime: "07:00",
              target: 1000,
              actual: 920,
              defect: 15,
              oee: 89.0,
              availability: 92.0,
              performance: 95.0,
              quality: 98.4,
            },
          ],
        },
      };

      // Get data for specific machine or use default
      const data = machineData[lineId] || machineData.LINE_A_PC39;

      // Calculate summary
      const summary = {
        totalTarget: data.shifts.reduce(
          (sum: number, s: any) => sum + s.target,
          0
        ),
        totalActual: data.shifts.reduce(
          (sum: number, s: any) => sum + s.actual,
          0
        ),
        totalDefect: data.shifts.reduce(
          (sum: number, s: any) => sum + s.defect,
          0
        ),
        avgOee:
          data.shifts.reduce((sum: number, s: any) => sum + s.oee, 0) /
          data.shifts.length,
      };

      return {
        lineId,
        date,
        machineName: data.machineName,
        shifts: data.shifts,
        summary,
      };
    } catch (error) {
      console.error("Error in getProductionDailyReport:", error);
      throw error;
    }
  }

  // Get packing weigher daily report
  async getWeigherDailyReport(lineId: string, date: string) {
    try {
      // TODO: Implement real database query when packing tables are ready
      // Generate realistic data based on lineId

      const lineVariations: Record<string, number> = {
        LINE_A_WEIGHER: 1.0,
        LINE_B_WEIGHER: 0.95,
        LINE_C_WEIGHER: 1.02,
        LINE_D_WEIGHER: 0.98,
        LINE_E_WEIGHER: 1.05,
        LINE_F_WEIGHER: 0.97,
        LINE_G_WEIGHER: 1.01,
        LINE_H_WEIGHER: 0.99,
        LINE_I_WEIGHER: 1.03,
      };

      const variation = lineVariations[lineId] || 1.0;

      const shifts = [
        {
          shift: 1,
          startTime: "07:00",
          endTime: "15:00",
          targetPacks: Math.floor(5000 * variation),
          actualPacks: Math.floor(4800 * variation),
          rejectCount: Math.floor(50 * variation),
          avgWeight: 1.02,
          minWeight: 0.98,
          maxWeight: 1.05,
          efficiency: 96.0,
        },
        {
          shift: 2,
          startTime: "15:00",
          endTime: "23:00",
          targetPacks: Math.floor(5000 * variation),
          actualPacks: Math.floor(4900 * variation),
          rejectCount: Math.floor(40 * variation),
          avgWeight: 1.01,
          minWeight: 0.99,
          maxWeight: 1.04,
          efficiency: 98.0,
        },
        {
          shift: 3,
          startTime: "23:00",
          endTime: "07:00",
          targetPacks: Math.floor(5000 * variation),
          actualPacks: Math.floor(4700 * variation),
          rejectCount: Math.floor(60 * variation),
          avgWeight: 1.03,
          minWeight: 0.97,
          maxWeight: 1.06,
          efficiency: 94.0,
        },
      ];

      const summary = {
        totalTargetPacks: shifts.reduce((sum, s) => sum + s.targetPacks, 0),
        totalActualPacks: shifts.reduce((sum, s) => sum + s.actualPacks, 0),
        totalRejects: shifts.reduce((sum, s) => sum + s.rejectCount, 0),
        avgEfficiency:
          shifts.reduce((sum, s) => sum + s.efficiency, 0) / shifts.length,
      };

      return {
        lineId,
        date,
        shifts,
        summary,
      };
    } catch (error) {
      console.error("Error in getWeigherDailyReport:", error);
      throw error;
    }
  }

  // Get packing bagmaker daily report
  async getBagMakerDailyReport(lineId: string, date: string) {
    try {
      // TODO: Implement real database query when packing tables are ready
      // Generate realistic data based on lineId

      const lineVariations: Record<string, number> = {
        LINE_A_BAGMAKER: 1.0,
        LINE_B_BAGMAKER: 0.96,
        LINE_C_BAGMAKER: 1.03,
        LINE_D_BAGMAKER: 0.99,
        LINE_E_BAGMAKER: 1.04,
        LINE_F_BAGMAKER: 0.98,
        LINE_G_BAGMAKER: 1.01,
        LINE_H_BAGMAKER: 0.97,
        LINE_I_BAGMAKER: 1.02,
      };

      const variation = lineVariations[lineId] || 1.0;

      const shifts = [
        {
          shift: 1,
          startTime: "07:00",
          endTime: "15:00",
          targetBags: Math.floor(6000 * variation),
          actualBags: Math.floor(5800 * variation),
          rejectCount: Math.floor(45 * variation),
          avgSpeed: Math.floor(85 * variation),
          maxSpeed: 95,
          efficiency: 96.7,
        },
        {
          shift: 2,
          startTime: "15:00",
          endTime: "23:00",
          targetBags: Math.floor(6000 * variation),
          actualBags: Math.floor(5900 * variation),
          rejectCount: Math.floor(35 * variation),
          avgSpeed: Math.floor(88 * variation),
          maxSpeed: 95,
          efficiency: 98.3,
        },
        {
          shift: 3,
          startTime: "23:00",
          endTime: "07:00",
          targetBags: Math.floor(6000 * variation),
          actualBags: Math.floor(5700 * variation),
          rejectCount: Math.floor(55 * variation),
          avgSpeed: Math.floor(82 * variation),
          maxSpeed: 95,
          efficiency: 95.0,
        },
      ];

      const summary = {
        totalTargetBags: shifts.reduce((sum, s) => sum + s.targetBags, 0),
        totalActualBags: shifts.reduce((sum, s) => sum + s.actualBags, 0),
        totalRejects: shifts.reduce((sum, s) => sum + s.rejectCount, 0),
        avgEfficiency:
          shifts.reduce((sum, s) => sum + s.efficiency, 0) / shifts.length,
      };

      return {
        lineId,
        date,
        shifts,
        summary,
      };
    } catch (error) {
      console.error("Error in getBagMakerDailyReport:", error);
      throw error;
    }
  }
}
