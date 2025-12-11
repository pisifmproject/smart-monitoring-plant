// composables/useExcelExport.ts
import {
  createCorporateWorkbook,
  createMultiSheetWorkbook,
  downloadWorkbook,
} from "@/utils/excelExport";

export function useExcelExport() {
  function formatDate(dateStr: string) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  function exportShiftReportByDate(
    panelId: number,
    date: string,
    shiftReports: any[]
  ) {
    const headers = [
      "LVMDP",
      "Tanggal",
      "Shift",
      "Total kWh",
      "Avg Power (kW)",
      "Avg Current (A)",
      "Min Current (A)",
      "Max Current (A)",
      "Load (%)",
      "Power Factor",
    ];

    const data = shiftReports.map((row) => [
      `LVMDP ${panelId}`,
      formatDate(date),
      `Shift ${row.shift}`,
      row.totalKwh || 0,
      row.avgKwh || 0,
      row.iavg || 0,
      row.imin || 0,
      row.imax || 0,
      ((row.iavg / 2500) * 100).toFixed(2),
      row.cosPhi || 0,
    ]);

    const title = `LVMDP ${panelId} - Shift Report - ${formatDate(date)}`;
    const wb = createCorporateWorkbook("Shift Report", headers, data, title);
    const filename = `LVMDP${panelId}_ShiftReport_${date}.xlsx`;
    downloadWorkbook(wb, filename);
  }

  function exportHourlyReportByDate(
    panelId: number,
    date: string,
    hourlyReports: any[]
  ) {
    const headers = [
      "LVMDP",
      "Tanggal",
      "Waktu",
      "Total kWh",
      "Avg Power (kW)",
      "Avg Current (A)",
      "Min Current (A)",
      "Max Current (A)",
      "Load (%)",
      "Power Factor",
    ];

    const data = hourlyReports.map((row) => {
      const hour = new Date(row.hour);
      const timeStr = hour.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return [
        `LVMDP ${panelId}`,
        formatDate(date),
        timeStr,
        row.totalKwh || 0,
        row.avgKwh || 0,
        row.avgCurrent || 0,
        row.minCurrent || 0,
        row.maxCurrent || 0,
        ((row.avgCurrent / 2500) * 100).toFixed(2),
        row.cosPhi || 0,
      ];
    });

    const title = `LVMDP ${panelId} - Hourly Report - ${formatDate(date)}`;
    const wb = createCorporateWorkbook("Hourly Report", headers, data, title);
    const filename = `LVMDP${panelId}_HourlyReport_${date}.xlsx`;
    downloadWorkbook(wb, filename);
  }

  function exportMonthlyReport(
    panelId: number,
    monthData: any[],
    yearMonth: string
  ) {
    // Sheet 1: Shift Reports
    const shiftHeaders = [
      "LVMDP",
      "Tanggal",
      "Shift",
      "Total kWh",
      "Avg Power (kW)",
      "Avg Current (A)",
      "Min Current (A)",
      "Max Current (A)",
      "Load (%)",
      "Power Factor",
    ];

    const shiftData: any[][] = [];
    monthData.forEach((dayReport) => {
      const reportDate = dayReport.date || dayReport.reportDate;
      for (let shiftNum = 1; shiftNum <= 3; shiftNum++) {
        const avgCurrent = dayReport[`shift${shiftNum}AvgCurrent`] || 0;
        shiftData.push([
          `LVMDP ${panelId}`,
          reportDate,
          `Shift ${shiftNum}`,
          dayReport[`shift${shiftNum}TotalKwh`] || 0,
          dayReport[`shift${shiftNum}AvgKwh`] || 0,
          avgCurrent,
          dayReport[`shift${shiftNum}MinCurrent`] || 0,
          dayReport[`shift${shiftNum}MaxCurrent`] || 0,
          ((avgCurrent / 2500) * 100).toFixed(2),
          dayReport[`shift${shiftNum}CosPhi`] || 0,
        ]);
      }
    });

    const [year, month] = yearMonth.split("-");
    const monthName = new Date(
      parseInt(year),
      parseInt(month) - 1,
      1
    ).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
    });

    const wb = createMultiSheetWorkbook([
      {
        name: "Shift Report",
        headers: shiftHeaders,
        data: shiftData,
        title: `LVMDP ${panelId} - Monthly Shift Report - ${monthName}`,
      },
    ]);

    const filename = `LVMDP${panelId}_MonthlyReport_${yearMonth}.xlsx`;
    downloadWorkbook(wb, filename);
  }

  return {
    exportShiftReportByDate,
    exportHourlyReportByDate,
    exportMonthlyReport,
  };
}
