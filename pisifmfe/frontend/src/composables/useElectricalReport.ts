// src/composables/useElectricalReport.ts
import { ref } from "vue";

export interface ElectricalReportData {
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

export function useElectricalReport() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const reportData = ref<ElectricalReportData | null>(null);

  // Get base URL dynamically
  const getBaseURL = () => {
    const origin = window.location.origin;
    // Handle different port scenarios
    // If accessing from :30 (dev), replace with :2000
    // If accessing from default port (80/443), add :2000
    if (origin.includes(":30")) {
      return origin.replace(":30", ":2000");
    } else {
      // Extract protocol and hostname
      const url = new URL(origin);
      return `${url.protocol}//${url.hostname}:2000`;
    }
  };

  /**
   * Fetch daily report
   */
  async function fetchDailyReport(
    date: string
  ): Promise<ElectricalReportData | null> {
    loading.value = true;
    error.value = null;

    try {
      const apiUrl = `${getBaseURL()}/api/report/electrical?period=day&date=${date}`;
      console.log("[ElectricalReport] Fetching daily report:", apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      reportData.value = data;
      console.log("[ElectricalReport] Daily report fetched successfully");
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch daily report";
      console.error("Error fetching daily report:", err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch weekly report
   */
  async function fetchWeeklyReport(
    weekStart: string
  ): Promise<ElectricalReportData | null> {
    loading.value = true;
    error.value = null;

    try {
      const apiUrl = `${getBaseURL()}/api/report/electrical?period=week&weekStart=${weekStart}`;
      console.log("[ElectricalReport] Fetching weekly report:", apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      reportData.value = data;
      console.log("[ElectricalReport] Weekly report fetched successfully");
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch weekly report";
      console.error("Error fetching weekly report:", err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch monthly report
   */
  async function fetchMonthlyReport(
    year: number,
    month: number
  ): Promise<ElectricalReportData | null> {
    loading.value = true;
    error.value = null;

    try {
      const apiUrl = `${getBaseURL()}/api/report/electrical?period=month&year=${year}&month=${month}`;
      console.log("[ElectricalReport] Fetching monthly report:", apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      reportData.value = data;
      console.log("[ElectricalReport] Monthly report fetched successfully");
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch monthly report";
      console.error("Error fetching monthly report:", err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetch latest available report (yesterday)
   */
  async function fetchLatestReport(): Promise<ElectricalReportData | null> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(
        `${getBaseURL()}/api/report/electrical/latest`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      reportData.value = data;
      return data;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch latest report";
      console.error("Error fetching latest report:", err);
      return null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Get Monday of current week
   */
  function getCurrentMonday(): string {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust when Sunday
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    return monday.toISOString().split("T")[0];
  }

  /**
   * Get yesterday's date
   */
  function getYesterdayDate(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  }

  /**
   * Get today's date
   */
  function getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }

  return {
    loading,
    error,
    reportData,
    fetchDailyReport,
    fetchWeeklyReport,
    fetchMonthlyReport,
    fetchLatestReport,
    getCurrentMonday,
    getYesterdayDate,
    getTodayDate,
  };
}
