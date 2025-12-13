// src/electricalReport/electricalReport.service.ts
import {
  aggregateDailyData,
  saveDailyReport,
  getDailyReports,
} from "./electricalReport.repository";

/**
 * Service layer for electrical reporting
 * Handles business logic, validation, and calculations
 */

interface PanelConfig {
  panelId: string;
  viewName: string;
  capacityKva: number;
}

const PANEL_CONFIGS: PanelConfig[] = [
  { panelId: "LVMDP_1", viewName: "v_lvmdp_1", capacityKva: 1000 },
  { panelId: "LVMDP_2", viewName: "v_lvmdp_2", capacityKva: 1000 },
  { panelId: "LVMDP_3", viewName: "v_lvmdp_3", capacityKva: 2000 },
  { panelId: "LVMDP_4", viewName: "v_lvmdp_4", capacityKva: 1540 },
];

const TOTAL_CAPACITY_KVA = 5540;

export interface ElectricalReportResponse {
  period: "day" | "week" | "month";
  dateRange: {
    start: string;
    end: string;
    formatted: string;
  };
  summary: {
    totalEnergy_kWh: number;
    averageLoad_kVA: number;
    peakDemand_kVA: number;
    peakDemandTime: string | null;
    installedCapacity_kVA: number;
    utilization_percent: number;
    loadFactor_percent: number;
    averagePowerFactor: number;
    voltage: {
      average: number;
      min: number;
      max: number;
    };
  };
  panels: Array<{
    panelId: string;
    panelName: string;
    energy_kWh: number;
    averageLoad_kVA: number;
    peakDemand_kVA: number;
    peakDemandTime: string | null;
    averageVoltage: number;
    averageCurrent: number;
    averagePowerFactor: number;
    contribution_percent: number;
    status: string;
  }>;
  comparison: {
    energyChange_percent: number;
    peakDemandChange_percent: number;
    previousPeriod: {
      totalEnergy_kWh: number;
      peakDemand_kVA: number;
    };
  };
  metadata: {
    generatedAt: string;
    dataPoints: number;
    samplingInterval_seconds: number;
    dataCompleteness_percent: number;
  };
}

/**
 * Generate daily electrical report
 */
export async function generateDailyReport(
  date: string
): Promise<ElectricalReportResponse> {
  const reports = await getDailyReports(date, date);

  if (reports.length === 0) {
    throw new Error(`No data available for date: ${date}`);
  }

  // Calculate summary metrics
  const totalEnergy = reports.reduce((sum, r) => sum + r.energyKwh, 0);
  const avgLoad = reports.reduce((sum, r) => sum + r.avgLoadKw, 0);
  const peakDemand = Math.max(...reports.map((r) => r.peakDemandKw));
  const totalSamples = reports.reduce((sum, r) => sum + r.sampleCount, 0);
  const avgCompleteness =
    reports.reduce((sum, r) => sum + r.dataCompletenessPercent, 0) /
    reports.length;

  // Find peak demand time
  const peakPanel = reports.find((r) => r.peakDemandKw === peakDemand);
  const peakTime = peakPanel?.peakDemandTime;

  // Weighted average power factor
  const weightedPF =
    reports.reduce((sum, r) => sum + r.avgPowerFactor * r.avgLoadKw, 0) /
    avgLoad;

  // Voltage metrics
  const avgVoltages = reports.map((r) => r.avgVoltage);
  const minVoltages = reports.map((r) => r.minVoltage);
  const maxVoltages = reports.map((r) => r.maxVoltage);

  // Panel details
  const panels = reports.map((r) => ({
    panelId: r.panelId,
    panelName: r.panelId.replace("_", " "),
    energy_kWh: r.energyKwh,
    averageLoad_kVA: r.avgLoadKw,
    peakDemand_kVA: r.peakDemandKw,
    peakDemandTime: r.peakDemandTime?.toISOString() || null,
    averageVoltage: r.avgVoltage,
    averageCurrent: r.avgCurrent,
    averagePowerFactor: r.avgPowerFactor,
    contribution_percent: (r.energyKwh / totalEnergy) * 100,
    status: r.dataCompletenessPercent >= 50 ? "online" : "offline",
  }));

  // Get previous day for comparison
  const prevDate = new Date(date);
  prevDate.setDate(prevDate.getDate() - 1);
  const prevDateStr = prevDate.toISOString().split("T")[0];

  const prevReports = await getDailyReports(prevDateStr, prevDateStr);
  const prevTotalEnergy = prevReports.reduce((sum, r) => sum + r.energyKwh, 0);
  const prevPeakDemand = Math.max(...prevReports.map((r) => r.peakDemandKw), 0);

  const energyChange =
    prevTotalEnergy > 0
      ? ((totalEnergy - prevTotalEnergy) / prevTotalEnergy) * 100
      : 0;
  const peakChange =
    prevPeakDemand > 0
      ? ((peakDemand - prevPeakDemand) / prevPeakDemand) * 100
      : 0;

  return {
    period: "day",
    dateRange: {
      start: `${date}T00:00:00Z`,
      end: `${date}T23:59:59Z`,
      formatted: new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
    summary: {
      totalEnergy_kWh: totalEnergy,
      averageLoad_kVA: avgLoad,
      peakDemand_kVA: peakDemand,
      peakDemandTime: peakTime?.toISOString() || null,
      installedCapacity_kVA: TOTAL_CAPACITY_KVA,
      utilization_percent: (avgLoad / TOTAL_CAPACITY_KVA) * 100,
      loadFactor_percent: (avgLoad / peakDemand) * 100,
      averagePowerFactor: weightedPF,
      voltage: {
        average: avgVoltages.reduce((a, b) => a + b, 0) / avgVoltages.length,
        min: Math.min(...minVoltages),
        max: Math.max(...maxVoltages),
      },
    },
    panels,
    comparison: {
      energyChange_percent: energyChange,
      peakDemandChange_percent: peakChange,
      previousPeriod: {
        totalEnergy_kWh: prevTotalEnergy,
        peakDemand_kVA: prevPeakDemand,
      },
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      dataPoints: totalSamples,
      samplingInterval_seconds: 5,
      dataCompleteness_percent: avgCompleteness,
    },
  };
}

/**
 * Generate weekly electrical report
 */
export async function generateWeeklyReport(
  weekStart: string
): Promise<ElectricalReportResponse> {
  // Calculate week end (7 days from start)
  const startDate = new Date(weekStart);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  const endDateStr = endDate.toISOString().split("T")[0];

  const reports = await getDailyReports(weekStart, endDateStr);

  if (reports.length === 0) {
    throw new Error(`No data available for week starting: ${weekStart}`);
  }

  // Group by panel
  const panelGroups = new Map<string, typeof reports>();
  reports.forEach((r) => {
    if (!panelGroups.has(r.panelId)) {
      panelGroups.set(r.panelId, []);
    }
    panelGroups.get(r.panelId)!.push(r);
  });

  // Aggregate weekly metrics
  const panels: any[] = [];
  let totalEnergy = 0;
  let totalAvgLoad = 0;
  let overallPeakDemand = 0;
  let peakDemandTime: Date | null = null;

  panelGroups.forEach((panelReports, panelId) => {
    const weeklyEnergy = panelReports.reduce((sum, r) => sum + r.energyKwh, 0);
    const avgOfAvg =
      panelReports.reduce((sum, r) => sum + r.avgLoadKw, 0) /
      panelReports.length;
    const weeklyPeak = Math.max(...panelReports.map((r) => r.peakDemandKw));
    const peakReport = panelReports.find((r) => r.peakDemandKw === weeklyPeak);

    totalEnergy += weeklyEnergy;
    totalAvgLoad += avgOfAvg;

    if (weeklyPeak > overallPeakDemand) {
      overallPeakDemand = weeklyPeak;
      peakDemandTime = (peakReport?.peakDemandTime as Date | null) || null;
    }

    panels.push({
      panelId,
      panelName: panelId.replace("_", " "),
      energy_kWh: weeklyEnergy,
      averageLoad_kVA: avgOfAvg,
      peakDemand_kVA: weeklyPeak,
      peakDemandTime: peakReport?.peakDemandTime?.toISOString() || null,
      averageVoltage:
        panelReports.reduce((sum, r) => sum + r.avgVoltage, 0) /
        panelReports.length,
      averageCurrent:
        panelReports.reduce((sum, r) => sum + r.avgCurrent, 0) /
        panelReports.length,
      averagePowerFactor:
        panelReports.reduce((sum, r) => sum + r.avgPowerFactor, 0) /
        panelReports.length,
      contribution_percent: 0, // Will calculate after total is known
      status: "online",
    });
  });

  // Calculate contributions
  panels.forEach((p) => {
    p.contribution_percent = (p.energy_kWh / totalEnergy) * 100;
  });

  // Previous week comparison
  const prevWeekStart = new Date(startDate);
  prevWeekStart.setDate(prevWeekStart.getDate() - 7);
  const prevWeekEnd = new Date(prevWeekStart);
  prevWeekEnd.setDate(prevWeekEnd.getDate() + 6);

  const prevReports = await getDailyReports(
    prevWeekStart.toISOString().split("T")[0],
    prevWeekEnd.toISOString().split("T")[0]
  );

  const prevTotalEnergy = prevReports.reduce((sum, r) => sum + r.energyKwh, 0);
  const prevPeakDemand = Math.max(...prevReports.map((r) => r.peakDemandKw), 0);

  return {
    period: "week",
    dateRange: {
      start: `${weekStart}T00:00:00Z`,
      end: `${endDateStr}T23:59:59Z`,
      formatted: `${startDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })} - ${endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}`,
    },
    summary: {
      totalEnergy_kWh: totalEnergy,
      averageLoad_kVA: totalAvgLoad,
      peakDemand_kVA: overallPeakDemand,
      peakDemandTime: (peakDemandTime as Date | null)?.toISOString() || null,
      installedCapacity_kVA: TOTAL_CAPACITY_KVA,
      utilization_percent: (totalAvgLoad / TOTAL_CAPACITY_KVA) * 100,
      loadFactor_percent: (totalAvgLoad / overallPeakDemand) * 100,
      averagePowerFactor:
        reports.reduce((sum, r) => sum + r.avgPowerFactor, 0) / reports.length,
      voltage: {
        average:
          reports.reduce((sum, r) => sum + r.avgVoltage, 0) / reports.length,
        min: Math.min(...reports.map((r) => r.minVoltage)),
        max: Math.max(...reports.map((r) => r.maxVoltage)),
      },
    },
    panels,
    comparison: {
      energyChange_percent:
        prevTotalEnergy > 0
          ? ((totalEnergy - prevTotalEnergy) / prevTotalEnergy) * 100
          : 0,
      peakDemandChange_percent:
        prevPeakDemand > 0
          ? ((overallPeakDemand - prevPeakDemand) / prevPeakDemand) * 100
          : 0,
      previousPeriod: {
        totalEnergy_kWh: prevTotalEnergy,
        peakDemand_kVA: prevPeakDemand,
      },
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      dataPoints: reports.reduce((sum, r) => sum + r.sampleCount, 0),
      samplingInterval_seconds: 5,
      dataCompleteness_percent:
        reports.reduce((sum, r) => sum + r.dataCompletenessPercent, 0) /
        reports.length,
    },
  };
}

/**
 * Generate monthly electrical report
 */
export async function generateMonthlyReport(
  year: number,
  month: number
): Promise<ElectricalReportResponse> {
  // Get first and last day of month
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Last day of month

  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = endDate.toISOString().split("T")[0];

  const reports = await getDailyReports(startDateStr, endDateStr);

  if (reports.length === 0) {
    throw new Error(`No data available for ${year}-${month}`);
  }

  // Similar logic to weekly but aggregated monthly
  const panelGroups = new Map<string, typeof reports>();
  reports.forEach((r) => {
    if (!panelGroups.has(r.panelId)) {
      panelGroups.set(r.panelId, []);
    }
    panelGroups.get(r.panelId)!.push(r);
  });

  const panels: any[] = [];
  let totalEnergy = 0;
  let totalAvgLoad = 0;
  let overallPeakDemand = 0;
  let peakDemandTime: Date | null = null;

  panelGroups.forEach((panelReports, panelId) => {
    const monthlyEnergy = panelReports.reduce((sum, r) => sum + r.energyKwh, 0);
    const avgOfAvg =
      panelReports.reduce((sum, r) => sum + r.avgLoadKw, 0) /
      panelReports.length;
    const monthlyPeak = Math.max(...panelReports.map((r) => r.peakDemandKw));
    const peakReport = panelReports.find((r) => r.peakDemandKw === monthlyPeak);

    totalEnergy += monthlyEnergy;
    totalAvgLoad += avgOfAvg;

    if (monthlyPeak > overallPeakDemand) {
      overallPeakDemand = monthlyPeak;
      peakDemandTime = peakReport?.peakDemandTime || null;
    }

    panels.push({
      panelId,
      panelName: panelId.replace("_", " "),
      energy_kWh: monthlyEnergy,
      averageLoad_kVA: avgOfAvg,
      peakDemand_kVA: monthlyPeak,
      peakDemandTime: peakReport?.peakDemandTime?.toISOString() || null,
      averageVoltage:
        panelReports.reduce((sum, r) => sum + r.avgVoltage, 0) /
        panelReports.length,
      averageCurrent:
        panelReports.reduce((sum, r) => sum + r.avgCurrent, 0) /
        panelReports.length,
      averagePowerFactor:
        panelReports.reduce((sum, r) => sum + r.avgPowerFactor, 0) /
        panelReports.length,
      contribution_percent: 0,
      status: "online",
    });
  });

  panels.forEach((p) => {
    p.contribution_percent = (p.energy_kWh / totalEnergy) * 100;
  });

  // Previous month comparison
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevStart = new Date(prevYear, prevMonth - 1, 1);
  const prevEnd = new Date(prevYear, prevMonth, 0);

  const prevReports = await getDailyReports(
    prevStart.toISOString().split("T")[0],
    prevEnd.toISOString().split("T")[0]
  );

  const prevTotalEnergy = prevReports.reduce((sum, r) => sum + r.energyKwh, 0);
  const prevPeakDemand = Math.max(...prevReports.map((r) => r.peakDemandKw), 0);

  return {
    period: "month",
    dateRange: {
      start: startDateStr + "T00:00:00Z",
      end: endDateStr + "T23:59:59Z",
      formatted: startDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    },
    summary: {
      totalEnergy_kWh: totalEnergy,
      averageLoad_kVA: totalAvgLoad,
      peakDemand_kVA: overallPeakDemand,
      peakDemandTime: (peakDemandTime as Date | null)?.toISOString() || null,
      installedCapacity_kVA: TOTAL_CAPACITY_KVA,
      utilization_percent: (totalAvgLoad / TOTAL_CAPACITY_KVA) * 100,
      loadFactor_percent: (totalAvgLoad / overallPeakDemand) * 100,
      averagePowerFactor:
        reports.reduce((sum, r) => sum + r.avgPowerFactor, 0) / reports.length,
      voltage: {
        average:
          reports.reduce((sum, r) => sum + r.avgVoltage, 0) / reports.length,
        min: Math.min(...reports.map((r) => r.minVoltage)),
        max: Math.max(...reports.map((r) => r.maxVoltage)),
      },
    },
    panels,
    comparison: {
      energyChange_percent:
        prevTotalEnergy > 0
          ? ((totalEnergy - prevTotalEnergy) / prevTotalEnergy) * 100
          : 0,
      peakDemandChange_percent:
        prevPeakDemand > 0
          ? ((overallPeakDemand - prevPeakDemand) / prevPeakDemand) * 100
          : 0,
      previousPeriod: {
        totalEnergy_kWh: prevTotalEnergy,
        peakDemand_kVA: prevPeakDemand,
      },
    },
    metadata: {
      generatedAt: new Date().toISOString(),
      dataPoints: reports.reduce((sum, r) => sum + r.sampleCount, 0),
      samplingInterval_seconds: 5,
      dataCompleteness_percent:
        reports.reduce((sum, r) => sum + r.dataCompletenessPercent, 0) /
        reports.length,
    },
  };
}

/**
 * Aggregate all panels for a specific date
 * Called by cron job
 */
export async function aggregateAllPanelsForDate(date: string): Promise<void> {
  console.log(`Starting aggregation for ${date}...`);

  for (const config of PANEL_CONFIGS) {
    try {
      const data = await aggregateDailyData(
        config.panelId,
        config.viewName,
        date
      );

      if (data) {
        await saveDailyReport(data);
        console.log(
          `✓ Aggregated ${config.panelId}: ${data.energyKwh.toFixed(2)} kWh`
        );
      } else {
        console.warn(`✗ No data for ${config.panelId} on ${date}`);
      }
    } catch (error) {
      console.error(`✗ Error aggregating ${config.panelId}:`, error);
    }
  }

  console.log(`Aggregation complete for ${date}`);
}
