<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PLANTS, type PlantId } from "@/config/app.config";
import {
  Zap,
  Activity,
  ArrowLeft,
  Download,
  Calendar,
  HelpCircle,
  X,
  ChevronDown,
  FileText,
  Table,
} from "lucide-vue-next";
import { lvmdpService } from "@/modules/energy/services/lvmdp.service";
import type { LVMDPData } from "@/modules/energy/models";
import {
  getLvmdpShiftToday,
  getLvmdpTrend,
  getDailyReportAll,
} from "@/lib/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const route = useRoute();
const router = useRouter();

const plantId = computed(() => route.params.plantId as PlantId);
const plant = computed(() => PLANTS[plantId.value]);

// State for panels data (1-4)
const panels = ref<(LVMDPData | null)[]>([null, null, null, null]);
const unwatchers: (() => void)[] = [];
const isRealData = computed(() => plant.value?.useRealData ?? false);
const lastUpdate = ref(new Date());

// Report State
const reportType = ref<"date" | "month">("date");
const dateType = ref<"nasional" | "indofood">("nasional");
const selectedDate = ref(new Date().toISOString().split("T")[0]); // YYYY-MM-DD
const selectedMonth = ref(new Date().toISOString().slice(0, 7)); // YYYY-MM
const isGenerating = ref(false);
const showHelpModal = ref(false);
const showDownloadMenu = ref(false);
const downloadMenuRef = ref<HTMLElement | null>(null);

// Close dropdown when clicking outside
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

function handleClickOutside(event: MouseEvent) {
  if (
    downloadMenuRef.value &&
    !downloadMenuRef.value.contains(event.target as Node)
  ) {
    showDownloadMenu.value = false;
  }
}

const PANEL_CONFIG = [
  { capacity: 5540, maxCurrent: 2500 },
  { capacity: 5540, maxCurrent: 2500 },
  { capacity: 5540, maxCurrent: 2500 },
  { capacity: 5540, maxCurrent: 3200 },
];

const indofoodRanges2025: Record<string, { start: string; end: string }> = {
  "01": { start: "2025-01-01", end: "2025-02-02" },
  "02": { start: "2025-02-03", end: "2025-03-02" },
  "03": { start: "2025-03-03", end: "2025-03-30" },
  "04": { start: "2025-03-31", end: "2025-05-04" },
  "05": { start: "2025-05-05", end: "2025-06-01" },
  "06": { start: "2025-06-02", end: "2025-06-30" },
  "07": { start: "2025-07-01", end: "2025-08-03" },
  "08": { start: "2025-08-04", end: "2025-08-31" },
  "09": { start: "2025-09-01", end: "2025-09-28" },
  "10": { start: "2025-09-29", end: "2025-11-02" },
  "11": { start: "2025-11-03", end: "2025-11-30" },
  "12": { start: "2025-12-01", end: "2025-12-31" },
};

const indofoodRanges2026: Record<string, { start: string; end: string }> = {
  "01": { start: "2026-01-01", end: "2026-02-01" },
  "02": { start: "2026-02-02", end: "2026-03-01" },
  "03": { start: "2026-03-02", end: "2026-04-05" },
  "04": { start: "2026-04-06", end: "2026-05-03" },
  "05": { start: "2026-05-04", end: "2026-05-31" },
  "06": { start: "2026-06-01", end: "2026-06-30" },
  "07": { start: "2026-07-01", end: "2026-08-02" },
  "08": { start: "2026-08-03", end: "2026-08-30" },
  "09": { start: "2026-08-31", end: "2026-10-04" },
  "10": { start: "2026-10-05", end: "2026-11-01" },
  "11": { start: "2026-11-02", end: "2026-11-29" },
  "12": { start: "2026-11-30", end: "2026-12-31" },
};

const computedPeriod = computed(() => {
  if (reportType.value === "date") return "";

  const [y, m] = selectedMonth.value.split("-");
  if (dateType.value === "nasional") {
    const lastDay = new Date(Number(y), Number(m), 0).getDate();
    const start = new Date(Number(y), Number(m) - 1, 1).toLocaleDateString(
      "id-ID",
      { day: "2-digit", month: "short", year: "numeric" }
    );
    const end = new Date(Number(y), Number(m) - 1, lastDay).toLocaleDateString(
      "id-ID",
      { day: "2-digit", month: "short", year: "numeric" }
    );
    return `${start} - ${end}`;
  } else {
    // Support both 2025 and 2026
    const ranges =
      y === "2025"
        ? indofoodRanges2025
        : y === "2026"
        ? indofoodRanges2026
        : null;
    if (!ranges) return `Indofood calendar not available for year ${y}`;

    const range = ranges[m];
    if (!range) return "Invalid Month";

    const s = new Date(range.start).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const e = new Date(range.end).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${s} - ${e}`;
  }
});

function navigateToLvmdp(id: number) {
  router.push(`/plant/${plantId.value}/energy/electricity/lvmdp/${id}`);
}

const goBack = () => {
  router.push(`/plant/${plantId.value}`);
};

// Calculate Plant Totals
const plantStats = computed(() => {
  let totalKva = 0;
  let totalKw = 0;
  let maxCurrent = 0;
  let minCurrent = 999999;
  let validPanels = 0;

  panels.value.forEach((p) => {
    if (p) {
      totalKva += p.apparentPower;
      totalKw += p.activePower;
      validPanels++;

      // Max/Min logic
      if (p.avgCurrent > maxCurrent) maxCurrent = p.avgCurrent;
      if (p.avgCurrent < minCurrent) minCurrent = p.avgCurrent;
    }
  });

  if (validPanels === 0) minCurrent = 0;

  const capacity = 5540;
  const utilization = capacity > 0 ? (totalKva / capacity) * 100 : 0;
  const avgPf = totalKva > 0 ? totalKw / totalKva : 0;

  return {
    totalKva,
    totalKw,
    utilization,
    avgPf,
    maxCurrent,
    minCurrent,
  };
});

onMounted(() => {
  // Use batch subscribe for better performance (1 API call instead of 4)
  const unsub = lvmdpService.subscribeAll(plantId.value, {
    1: (data) => {
      panels.value[0] = data;
      lastUpdate.value = new Date();
    },
    2: (data) => {
      panels.value[1] = data;
      lastUpdate.value = new Date();
    },
    3: (data) => {
      panels.value[2] = data;
      lastUpdate.value = new Date();
    },
    4: (data) => {
      panels.value[3] = data;
      lastUpdate.value = new Date();
    },
  });
  unwatchers.push(unsub);
});

onUnmounted(() => {
  unwatchers.forEach((u) => u());
});

const formatNumber = (num: number, decimals = 1) => {
  return num.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

// PDF Generation Logic
const generateReport = async () => {
  isGenerating.value = true;
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Constants & Helpers
    const primaryColor = [30, 58, 138];
    const secondaryColor = [59, 130, 246];
    const lightBg = [248, 250, 252];
    const textColor = [51, 65, 85];

    const centerText = (
      text: string,
      y: number,
      size: number,
      font: string = "helvetica",
      style: string = "normal",
      color: number[] = textColor
    ) => {
      doc.setFontSize(size);
      doc.setFont(font, style);
      doc.setTextColor(color[0], color[1], color[2]);
      doc.text(text, pageWidth / 2, y, { align: "center" });
    };

    const reportData = {
      panels: [] as any[],
      totalEnergy: 0,
      avgLoad: 0,
      dateRange: "",
    };

    // Date Range Logic
    if (reportType.value === "date") {
      const d = new Date(selectedDate.value);
      reportData.dateRange = d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } else {
      reportData.dateRange = computedPeriod.value;
    }

    // Fetch Data Loop
    for (let i = 1; i <= 4; i++) {
      let energy = 0; // Total Energy for the period
      let avgLoad = 0; // Average Load for the period
      let current = 0; // Snapshot/Avg Current
      let voltage = 0; // Snapshot Voltage
      let pf = 0; // Snapshot PF
      let status = "Offline";

      try {
        const isToday =
          selectedDate.value === new Date().toISOString().split("T")[0];

        if (reportType.value === "date" && isToday) {
          const shifts = await getLvmdpShiftToday(i as 1 | 2 | 3 | 4).catch(
            () => null
          );
          if (shifts) {
            const shiftList = [shifts.shift1, shifts.shift2, shifts.shift3];
            let totalKwhShift = 0;
            let countCheck = 0;
            let totalLoadShift = 0;

            shiftList.forEach((s) => {
              if (s && s.totalKwh != null) {
                totalKwhShift += s.totalKwh;
                if (s.avgKwh > 0 && (s.cosPhi || 1) > 0) {
                  totalLoadShift += s.avgKwh / (s.cosPhi || 1);
                  countCheck++;
                }
              }
            });
            energy = totalKwhShift;
            avgLoad = countCheck > 0 ? totalLoadShift / countCheck : 0;
          }
        } else {
          // For Monthly, or non-today dates, use Trend Data aggregation
          let apiPeriod: "day" | "week" | "month" | "year" = "month";
          let apiDate = selectedMonth.value + "-01"; // Default start of month

          if (reportType.value === "date") {
            apiPeriod = "day";
            apiDate = selectedDate.value;
          }

          const trend = await getLvmdpTrend(
            i as 1 | 2 | 3 | 4,
            apiPeriod,
            apiDate
          ).catch(() => null);

          if (trend && trend.data) {
            energy = trend.data.reduce((a, b) => a + b, 0);
            // Approximation: Energy (kWh) / Hours = Avg Power (kW).
            // Avg Power / PF = Avg Apparent Power (kVA).
            // Hours in month = 24 * 30 = 720.
            // Hours in day = 24.
            const hours = apiPeriod === "month" ? 720 : 24;
            const estimatedPF = 0.95;
            avgLoad = energy / hours / estimatedPF;
          }
        }

        // Fallback live data for instant metrics
        const live = panels.value[i - 1] || {
          avgCurrent: 0,
          phases: { r: { voltageRS: 0 } },
          powerFactor: 0,
          isConnected: false,
          apparentPower: 0,
        };
        if (avgLoad === 0 && reportType.value === "date" && isToday) {
          // Live data fallback for today if shift data incomplete
          if (avgLoad === 0) avgLoad = live.apparentPower || 0;
        }

        current = live.avgCurrent;
        voltage = live.phases?.r?.voltageRS || 400;
        pf = live.powerFactor;
        status = live.isConnected ? "Online" : "Offline";
      } catch (e) {
        console.warn(`Failed to fetch data for LVMDP ${i}`, e);
      }

      reportData.panels.push({
        name: `LVMDP ${i}`,
        status,
        energy,
        avgLoad,
        voltage,
        current,
        pf: pf || 0.95,
      });

      reportData.totalEnergy += energy;
      reportData.avgLoad += avgLoad; // Aggregating Avg Load of panels ~ Total Plant Load
    }

    // 2. Load Logo
    const logoUrl = "/logo.png";
    let logoData = "";
    let logoRatio = 1;
    try {
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      logoData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      if (logoData) {
        const img = new Image();
        img.src = logoData;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        logoRatio = img.width / img.height;
      }
    } catch (e) {
      console.warn("Logo load failed", e);
    }

    let yPos = 15;

    // Render Header
    if (logoData) {
      const maxW = 140;
      const maxH = 60;
      let lw = maxW;
      let lh = lw / logoRatio;
      if (lh > maxH) {
        lh = maxH;
        lw = lh * logoRatio;
      }
      doc.addImage(logoData, "PNG", (pageWidth - lw) / 2, yPos, lw, lh);
      yPos += lh + 8;
    } else {
      yPos += 10;
    }

    // centerText("PT INDOFOOD FORTUNA MAKMUR", yPos, 16, "helvetica", "bold", primaryColor);
    // yPos += 7;
    centerText(
      "ELECTRICAL DASHBOARD",
      yPos,
      14,
      "helvetica",
      "bold",
      primaryColor
    );
    yPos += 8;
    centerText(
      "Executive Summary Report",
      yPos,
      11,
      "helvetica",
      "normal",
      secondaryColor
    );
    yPos += 15;

    // Info Bar
    const infoH = 32;
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, yPos, pageWidth - margin * 2, infoH, 3, 3, "FD");

    const genDate = new Date().toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.text("Report Generated:", margin + 5, yPos + 10);
    doc.setFont("helvetica", "normal");
    doc.text(genDate, margin + 5, yPos + 16);

    doc.setFont("helvetica", "bold");
    doc.text("Period:", margin + 5, yPos + 24);
    doc.setFont("helvetica", "normal");
    doc.text(reportData.dateRange, margin + 20, yPos + 24);

    const midX = pageWidth / 2 + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Total Energy:", midX, yPos + 10);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setFontSize(11);
    doc.text(`${formatNumber(reportData.totalEnergy, 2)} kWh`, midX, yPos + 18);

    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("Status:", midX, yPos + 26);

    const capacity = 5540;
    const util = (reportData.avgLoad / capacity) * 100;
    const statusTxt = util > 85 ? "CRITICAL" : util > 70 ? "WARNING" : "NORMAL";
    const statusCol =
      util > 85 ? [220, 38, 38] : util > 70 ? [245, 158, 11] : [22, 163, 74];

    doc.setFillColor(statusCol[0], statusCol[1], statusCol[2]);
    doc.roundedRect(midX + 15, yPos + 22, 22, 6, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(statusTxt, midX + 26, yPos + 26, { align: "center" });

    yPos += infoH + 15;

    // Metrics Cards
    const cardW = (pageWidth - margin * 2 - 10) / 3;
    const cardH = 25;

    // Avg Load
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(margin, yPos, cardW, cardH, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("Average Load", margin + cardW / 2, yPos + 8, { align: "center" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${formatNumber(reportData.avgLoad, 2)} kVA`,
      margin + cardW / 2,
      yPos + 19,
      { align: "center" }
    );

    // Utilization
    doc.setFillColor(statusCol[0], statusCol[1], statusCol[2]);
    doc.roundedRect(margin + cardW + 5, yPos, cardW, cardH, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Utilization", margin + cardW + 5 + cardW / 2, yPos + 8, {
      align: "center",
    });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${formatNumber(util, 1)}%`,
      margin + cardW + 5 + cardW / 2,
      yPos + 19,
      { align: "center" }
    );

    // Capacity
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(margin + (cardW + 5) * 2, yPos, cardW, cardH, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Installed Capacity",
      margin + (cardW + 5) * 2 + cardW / 2,
      yPos + 8,
      { align: "center" }
    );
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${capacity} kVA`,
      margin + (cardW + 5) * 2 + cardW / 2,
      yPos + 19,
      { align: "center" }
    );

    yPos += cardH + 15;

    // Table
    doc.setFontSize(11);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont("helvetica", "bold");
    doc.text("Panel Distribution Details", margin, yPos);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
    yPos += 8;

    const tableBody = reportData.panels.map((p) => [
      p.name,
      p.status,
      formatNumber(p.energy, 2),
      formatNumber(p.avgLoad, 2),
      formatNumber(p.voltage, 2),
      formatNumber(p.current, 2),
      formatNumber(p.pf, 3),
    ]);

    autoTable(doc, {
      startY: yPos,
      head: [
        [
          "Panel Name",
          "Status",
          "Energy (kWh)",
          "Avg Load (kVA)",
          "Voltage (V)",
          "Current (A)",
          "PF",
        ],
      ],
      body: tableBody,
      theme: "grid",
      headStyles: {
        fillColor: primaryColor as [number, number, number],
        textColor: 255,
        halign: "center",
        fontStyle: "bold",
      },
      bodyStyles: {
        textColor: [51, 65, 85],
        halign: "right",
      },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold" },
        1: { halign: "center" },
        6: { halign: "center" },
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249],
      },
      didParseCell: function (data) {
        if (data.section === "body" && data.column.index === 1) {
          if (data.cell.raw === "Online") {
            data.cell.styles.textColor = [22, 163, 74];
          } else {
            data.cell.styles.textColor = [220, 38, 38];
          }
        }
      },
    });

    doc.save(
      `Electrical_Monitoring_Report_${reportData.dateRange.replace(
        / /g,
        "_"
      )}.pdf`
    );
  } catch (e) {
    console.error("PDF Generation Error", e);
  } finally {
    isGenerating.value = false;
  }
};

const toggleDownloadMenu = () => {
  showDownloadMenu.value = !showDownloadMenu.value;
};

const handleDownload = (type: "pdf" | "excel") => {
  showDownloadMenu.value = false;
  if (type === "pdf") {
    generateReport();
  } else {
    generateExcel();
  }
};

const generateExcel = async () => {
  isGenerating.value = true;
  try {
    const workbook = XLSX.utils.book_new();
    const dateStr =
      reportType.value === "date" ? selectedDate.value : selectedMonth.value;

    // Fetch all data in parallel for better performance
    const panelPromises = [1, 2, 3, 4].map(async (i) => {
      const panelName = `LVMDP ${i}`;
      let sheetData: any[] = [];

      if (reportType.value === "date") {
        // Fetch shift and trend data in parallel
        const [shiftData, trend] = await Promise.all([
          getLvmdpShiftToday(i as 1 | 2 | 3 | 4, selectedDate.value).catch(
            () => null
          ),
          getLvmdpTrend(i as 1 | 2 | 3 | 4, "day", selectedDate.value).catch(
            () => null
          ),
        ]);

        sheetData.push(["DAILY REPORT DETAIL", panelName]);
        sheetData.push(["Date", selectedDate.value]);
        sheetData.push([]);

        // Shift Summary Section
        sheetData.push(["SHIFT SUMMARY"]);
        sheetData.push([
          "Shift",
          "Total Energy (kWh)",
          "Avg Power (kW)",
          "Avg Current (A)",
          "PF",
        ]);

        if (shiftData) {
          ["shift1", "shift2", "shift3"].forEach((k, idx) => {
            const s = shiftData[k as keyof typeof shiftData] as any;
            if (s) {
              const totalKwh =
                Math.round((Number(s.totalKwh) || 0) * 100) / 100;
              const avgCurrent =
                Math.round((Number(s.avgCurrent) || 0) * 100) / 100;
              const cosPhi = Math.round((Number(s.cosPhi) || 0) * 1000) / 1000;
              const avgPower =
                s.avgKwh && s.cosPhi
                  ? Math.round((s.avgKwh / s.cosPhi) * 100) / 100
                  : 0;
              sheetData.push([
                `Shift ${idx + 1}`,
                totalKwh,
                avgPower,
                avgCurrent,
                cosPhi,
              ]);
            } else {
              sheetData.push([`Shift ${idx + 1}`, 0, 0, 0, 0]);
            }
          });
        }
        sheetData.push([]);

        // Hourly Trend Section
        sheetData.push(["HOURLY ENERGY USAGE (00:00 - 23:59)"]);
        sheetData.push(["Hour", "Energy (kWh)"]);

        if (trend && trend.data && trend.labels) {
          trend.labels.forEach((label, idx) => {
            const value =
              Math.round((Number(trend.data[idx]) || 0) * 100) / 100;
            sheetData.push([label, value]);
          });
        }
      } else {
        // --- MONTHLY DETAIL REPORT ---
        const [year, month] = selectedMonth.value.split("-").map(Number);

        sheetData.push(["MONTHLY REPORT DETAIL", panelName]);
        sheetData.push(["Period", computedPeriod.value]);
        sheetData.push([]);

        sheetData.push(["DAILY SHIFT BREAKDOWN"]);
        sheetData.push([
          "Date",
          "Shift 1 (kWh)",
          "Shift 1 Avg(A)",
          "Shift 2 (kWh)",
          "Shift 2 Avg(A)",
          "Shift 3 (kWh)",
          "Shift 3 Avg(A)",
          "Total Daily (kWh)",
        ]);

        // Fetch all reports
        const allReports = await getDailyReportAll(i as 1 | 2 | 3 | 4).catch(
          (err) => {
            console.error(`[Excel Export] Error fetching LVMDP${i}:`, err);
            return [];
          }
        );

        console.log(
          `[Excel Export] LVMDP${i} - Fetched ${allReports.length} reports`
        );
        if (allReports.length > 0) {
          console.log(
            `[Excel Export] LVMDP${i} - Sample report:`,
            JSON.stringify(allReports[0], null, 2)
          );
        }

        const filteredReports = allReports.filter((r: any) => {
          // Backend may return 'date' or 'reportDate'
          const dateStr = r.date || r.reportDate;
          if (!dateStr) return false;

          // Use string comparison to avoid timezone issues
          // dateStr format is "YYYY-MM-DD"
          const dateParts = dateStr.split("-");
          const rYear = parseInt(dateParts[0], 10);
          const rMonth = parseInt(dateParts[1], 10);
          const rDay = parseInt(dateParts[2], 10);

          if (dateType.value === "nasional") {
            return rYear === year && rMonth === month;
          } else {
            let range = null;
            const yStr = year.toString();
            const mStr = month.toString().padStart(2, "0");
            if (yStr === "2025") range = indofoodRanges2025[mStr];
            if (yStr === "2026") range = indofoodRanges2026[mStr];

            if (range) {
              // Compare strings directly (YYYY-MM-DD format is sortable)
              return dateStr >= range.start && dateStr <= range.end;
            }
            return false;
          }
        });

        // Sort by date using string comparison (YYYY-MM-DD is naturally sortable)
        filteredReports.sort((a: any, b: any) => {
          const dateA = a.date || a.reportDate || "";
          const dateB = b.date || b.reportDate || "";
          return dateA.localeCompare(dateB);
        });

        console.log(
          `[Excel Export] LVMDP${i} - After filter: ${filteredReports.length} reports`
        );
        if (filteredReports.length > 0) {
          console.log(
            `[Excel Export] LVMDP${i} - First filtered report:`,
            JSON.stringify(filteredReports[0], null, 2)
          );
        }

        filteredReports.forEach((r: any) => {
          // Backend returns flat structure: shift1TotalKwh, shift2TotalKwh, etc.
          // NOT nested: r.shift1.totalKwh
          // Use Number() to ensure proper conversion from any type
          // Round to 2 decimal places for cleaner output
          const s1TotalKwh =
            Math.round(
              (Number(r.shift1TotalKwh ?? r.shift1?.totalKwh ?? 0) || 0) * 100
            ) / 100;
          const s1AvgCurrent =
            Math.round(
              (Number(r.shift1AvgCurrent ?? r.shift1?.avgCurrent ?? 0) || 0) *
                100
            ) / 100;
          const s2TotalKwh =
            Math.round(
              (Number(r.shift2TotalKwh ?? r.shift2?.totalKwh ?? 0) || 0) * 100
            ) / 100;
          const s2AvgCurrent =
            Math.round(
              (Number(r.shift2AvgCurrent ?? r.shift2?.avgCurrent ?? 0) || 0) *
                100
            ) / 100;
          const s3TotalKwh =
            Math.round(
              (Number(r.shift3TotalKwh ?? r.shift3?.totalKwh ?? 0) || 0) * 100
            ) / 100;
          const s3AvgCurrent =
            Math.round(
              (Number(r.shift3AvgCurrent ?? r.shift3?.avgCurrent ?? 0) || 0) *
                100
            ) / 100;
          const total =
            Math.round((s1TotalKwh + s2TotalKwh + s3TotalKwh) * 100) / 100;

          sheetData.push([
            r.date || r.reportDate,
            s1TotalKwh,
            s1AvgCurrent,
            s2TotalKwh,
            s2AvgCurrent,
            s3TotalKwh,
            s3AvgCurrent,
            total,
          ]);
        });

        sheetData.push([]);
        sheetData.push(["ENERGY USAGE TREND WEEK/PERIOD"]);
        sheetData.push([
          "Note:",
          "See daily breakdown above for full trend details.",
        ]);
      }

      return { panelName, sheetData };
    });

    // Wait for all panels to complete
    const panelResults = await Promise.all(panelPromises);

    // Add sheets to workbook
    panelResults.forEach(({ panelName, sheetData }) => {
      const sheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, sheet, panelName);
    });

    // Save file
    const safeName =
      reportType.value === "date" ? selectedDate.value : selectedMonth.value;
    XLSX.writeFile(workbook, `Electrical_Report_${safeName}.xlsx`);
  } catch (e) {
    console.error("Excel Generation Error", e);
    alert("Failed to generate Excel report");
  } finally {
    isGenerating.value = false;
  }
};
</script>

<template>
  <div class="elec-dashboard">
    <div class="header">
      <div class="header-top">
        <button @click="goBack" class="back-btn">
          <ArrowLeft class="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <button class="help-btn" @click="showHelpModal = true">
          <HelpCircle class="w-4 h-4" />
          <span>Help</span>
        </button>

        <!-- Report Controls (New Design) -->
        <div class="report-controls">
          <!-- Report Type -->
          <div class="control-group">
            <label>Report Type:</label>
            <select v-model="reportType" class="input-control">
              <option value="date">By Date</option>
              <option value="month">By Month</option>
            </select>
          </div>

          <!-- Month-Only: Date Type -->
          <div class="control-group" v-if="reportType === 'month'">
            <label>Date Type:</label>
            <select v-model="dateType" class="input-control">
              <option value="nasional">By Nasional</option>
              <option value="indofood">By Indofood</option>
            </select>
          </div>

          <!-- Date Selection -->
          <div class="control-group" v-if="reportType === 'date'">
            <label>Select Date:</label>
            <input type="date" v-model="selectedDate" class="input-control" />
          </div>

          <!-- Month Selection -->
          <div class="control-group" v-if="reportType === 'month'">
            <label>Select Month:</label>
            <input type="month" v-model="selectedMonth" class="input-control" />
          </div>

          <!-- Computed Period Display -->
          <div class="period-display" v-if="reportType === 'month'">
            <Calendar class="w-4 h-4" />
            <span>Period: {{ computedPeriod }}</span>
          </div>

          <!-- Download Dropdown -->
          <div class="relative inline-block text-left" ref="downloadMenuRef">
            <button
              class="download-btn-primary"
              @click="toggleDownloadMenu"
              :disabled="isGenerating"
            >
              <Download v-if="!isGenerating" class="w-4 h-4" />
              <span v-else>...</span>
              <span>Download Report</span>
              <ChevronDown class="w-4 h-4 ml-2" />
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showDownloadMenu"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#1e293b] ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-slate-700"
            >
              <div class="py-1">
                <button
                  @click="handleDownload('pdf')"
                  class="group flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white w-full text-left"
                >
                  <FileText
                    class="mr-3 h-4 w-4 text-slate-400 group-hover:text-white"
                  />
                  Download PDF
                </button>
                <button
                  @click="handleDownload('excel')"
                  class="group flex items-center px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white w-full text-left"
                >
                  <Table
                    class="mr-3 h-4 w-4 text-slate-400 group-hover:text-white"
                  />
                  Download Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="title-section">
        <div class="title-row">
          <Zap class="icon-zap" />
          <h1>Power Monitoring System</h1>
          <span class="live-badge">● LIVE</span>
        </div>
        <p class="subtitle">
          Plant {{ plantId }} - Installed Capacity: 5.540 kVA
        </p>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="overview-section">
      <!-- Plant Capacity / Utilization -->
      <div class="main-card utilization-card">
        <div class="card-header">
          <Activity class="w-4 h-4 text-blue-400" />
          <span>Plant Capacity Utilization</span>
        </div>

        <div class="util-content">
          <div class="util-bar-container">
            <div class="util-info">
              <span class="label">CURRENT LOAD DISTRIBUTION</span>
              <span class="capacity-label">CAPACITY</span>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: `${Math.min(plantStats.utilization, 100)}%` }"
              >
                <div class="progress-glow"></div>
              </div>
            </div>
          </div>

          <div class="util-stats">
            <div class="stat-big">
              <span class="value">{{ formatNumber(plantStats.totalKva) }}</span>
              <span class="unit">kVA</span>
            </div>
            <div class="stat-perc">
              <span class="perc-value"
                >{{ formatNumber(plantStats.utilization, 2) }}%</span
              >
              <span class="perc-label">of 5540 kVA</span>
            </div>
          </div>
        </div>

        <div class="secondary-stats">
          <div class="sec-stat">
            <span class="sec-label">TOTAL REAL POWER</span>
            <span class="sec-value text-yellow"
              >{{ formatNumber(plantStats.totalKw) }} <small>kW</small></span
            >
          </div>
          <div class="sec-stat">
            <span class="sec-label">AVG POWER FACTOR</span>
            <span class="sec-value text-green">{{
              formatNumber(plantStats.avgPf, 2)
            }}</span>
          </div>
          <div class="sec-stat">
            <span class="sec-label">MAX CURRENT (PLANT)</span>
            <span class="sec-value text-red"
              >{{ formatNumber(plantStats.maxCurrent) }} <small>A</small></span
            >
          </div>
          <div class="sec-stat">
            <span class="sec-label">MIN CURRENT (PLANT)</span>
            <span class="sec-value text-blue"
              >{{ formatNumber(plantStats.minCurrent) }} <small>A</small></span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Panel Grid -->
    <div class="panels-grid">
      <div class="grid-header">
        <div class="grid-title">
          <div class="icon-grid"></div>
          <h2>Panel Summaries</h2>
        </div>
      </div>

      <div class="grid-container">
        <div
          v-for="i in 4"
          :key="i"
          class="panel-card"
          @click="navigateToLvmdp(i)"
        >
          <div class="p-header">
            <div class="p-title">
              <h3>LVMDP {{ i }}</h3>
              <!-- <span class="p-code">LVMDP-{{ i }}</span> -->
            </div>
            <div class="p-action">
              <Activity class="w-4 h-4" />
            </div>
          </div>

          <div class="p-body">
            <div class="p-main-val">
              <span class="label">APPARENT POWER</span>
              <div class="val-row">
                <span class="val">{{
                  formatNumber(panels[i - 1]?.apparentPower || 0)
                }}</span>
                <span class="unit">kVA</span>
              </div>
              <span class="sub-val"
                >({{
                  formatNumber(
                    ((panels[i - 1]?.apparentPower || 0) /
                      PANEL_CONFIG[i - 1].capacity) *
                      100,
                    1
                  )
                }}% of
                {{ formatNumber(PANEL_CONFIG[i - 1].capacity, 2) }} kVA)</span
              >
            </div>

            <div class="p-metrics">
              <div class="pm-row">
                <span>CURRENT NOW</span>
                <div class="text-right">
                  <div class="pm-val">
                    {{ formatNumber(panels[i - 1]?.avgCurrent || 0) }} A
                  </div>
                  <div class="pm-sub">
                    {{
                      formatNumber(
                        ((panels[i - 1]?.avgCurrent || 0) /
                          PANEL_CONFIG[i - 1].maxCurrent) *
                          100,
                        1
                      )
                    }}% of
                    {{ formatNumber(PANEL_CONFIG[i - 1].maxCurrent, 0) }} A
                  </div>
                </div>
              </div>
              <div class="pm-row">
                <span>REAL POWER</span>
                <span class="pm-val text-white"
                  >{{ formatNumber(panels[i - 1]?.activePower || 0) }} kW</span
                >
              </div>
              <div class="pm-row">
                <span>VOLTAGE (AVG)</span>
                <span class="pm-val text-blue"
                  >{{
                    formatNumber(panels[i - 1]?.phases.r.voltageRS || 0, 0)
                  }}
                  V</span
                >
              </div>
              <div class="pm-row">
                <span>POWER FACTOR</span>
                <span class="pm-val text-green">{{
                  formatNumber(panels[i - 1]?.powerFactor || 0, 2)
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Help Modal -->
    <div
      v-if="showHelpModal"
      class="modal-overlay"
      @click.self="showHelpModal = false"
    >
      <div class="modal-content help-modal">
        <div class="modal-header">
          <h3>LVMDP System Overview</h3>
          <button class="close-btn" @click="showHelpModal = false">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="modal-body">
          <!-- LVMDP 1 -->
          <div class="help-section">
            <h3>LVMDP 1 (Main Production Area)</h3>
            <ul>
              <li>SDP Process A — Daya: 360 kW | Breaker: 1600 A</li>
              <li>SDP Process B — Daya: 300 kW | Breaker: 630 A</li>
              <li>SDP Process C — Daya: 120 kW | Breaker: 500 A</li>
              <li>SDP Process — Daya: 160 kW | Breaker: 1250 A</li>
              <li>SDP Raw Material Warehouse — Daya: 20 kW | Breaker: 250 A</li>
              <li>
                SDP Finished Goods Warehouse — Daya: 30 kW | Breaker: 400 A
              </li>
              <li>SDP Packing — Daya: 145 kW | Breaker: 630 A</li>
              <li>SDP Process Line B — Daya: 85 kW | Breaker: 200 A</li>
              <li>SDP X&amp;P — Daya: 250 kW | Breaker: 800 A</li>
            </ul>
          </div>

          <!-- LVMDP 2 -->
          <div class="help-section">
            <h3>LVMDP 2 (Utilities & Supporting Facilities)</h3>
            <ul>
              <li>SDP Office — Daya: 575 kW | Breaker: 800 A</li>
              <li>SDP Workshop — Daya: 40 kW | Breaker: 100 A</li>
              <li>SDP Compressor — Daya: 420 kW | Breaker: 630 A</li>
              <li>SDP Nitrogen — Daya: 100 kW | Breaker: 400 A</li>
              <li>SDP Cooking Oil Pump — Daya: 8 kW | Breaker: 100 A</li>
              <li>SDP Fuel Pump — Daya: 8 kW | Breaker: 25 A</li>
              <li>SDP Deepwell — Daya: 50 kW | Breaker: 80 A</li>
              <li>SDP WWTP 1 (By WWTP) — Daya: 160 kW | Breaker: 630 A</li>
              <li>SDP Water Pump — Daya: 60 kW | Breaker: 100 A</li>
              <li>SDP Oil — Daya: 15 kW | Breaker: 63 A</li>
              <li>SDP pH System — Daya: 5 kW | Breaker: 63 A</li>
              <li>SDP Booster Pump — Daya: 50 kW | Breaker: 100 A</li>
              <li>SDP Compressor 5 — Daya: 130 kW | Breaker: 250 A</li>
            </ul>
          </div>

          <!-- LVMDP 3 -->
          <div class="help-section">
            <h3>LVMDP 3 (Extended Production & Storage Areas)</h3>
            <ul>
              <li>SDP TC Line — Daya: 520 kW | Breaker: 1250 A</li>
              <li>
                SDP Raw Material Warehouse 2 — Daya: 40 kW | Breaker: 400 A
              </li>
              <li>
                SDP Finished Goods Warehouse 2 — Daya: 50 kW | Breaker: 200 A
              </li>
              <li>P VAC 2 — Daya: 320 kW | Breaker: 800 A</li>
              <li>P WWTP 2 — Daya: 80 kW | Breaker: 250 A</li>
              <li>P WTP — Daya: 30 kW | Breaker: 50 A</li>
              <li>P Cold Room — Daya: 60 kW | Breaker: 160 A</li>
              <li>PDQC — Daya: 15 kW | Breaker: 400 A</li>
              <li>SDP Process Line 7 — Daya: 375 kW | Breaker: 1000 A</li>
              <li>SDP Compressor 4 — Daya: 130 kW | Breaker: 250 A</li>
            </ul>
          </div>

          <!-- LVMDP 4 -->
          <div class="help-section">
            <h3>LVMDP 4 (Boiler & Specialized Production Lines)</h3>
            <ul>
              <li>SDB Line 9 — Daya: 490 kW | Breaker: 400–1000 A</li>
              <li>SDB Line 10 — Daya: 385 kW | Breaker: 320–800 A</li>
              <li>P Boiler — Daya: 42,32 kW | Breaker: 70–100 A</li>
              <li>
                SDB Finished Goods Mezzanine — Daya: 14,28 kW | Breaker: 44–63 A
              </li>
              <li>SDB VAC 3.1 — Daya: 223,36 kW | Breaker: 250–630 A</li>
              <li>P Compressor 3 — Daya: 270 kW | Breaker: 250–630 A</li>
              <li>SDB VAC 3.2 — Daya: 308,1 kW | Breaker: 250–630 A</li>
              <li>SDB Raw Material 3 — Daya: 174,25 kW | Breaker: 160–400 A</li>
              <li>P WTP — Daya: 110,43 kW | Breaker: 175–250 A</li>
              <li>SDB Line 11 — Daya: 75 kW | Breaker: 112–160 A</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.elec-dashboard {
  min-height: 100vh;
  background: #0f172a;
  color: #e2e8f0;
  font-family: "Inter", sans-serif;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.back-btn:hover {
  color: white;
}

.help-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 1rem;
  margin-right: auto; /* Push controls to right */
}
.help-btn:hover {
  border-color: #94a3b8;
  color: white;
}

/* Report Controls Styling */
.report-controls {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.control-group label {
  font-size: 0.75rem;
  color: #cbd5e1;
  font-weight: 600;
}

.input-control {
  background: #1e293b;
  border: 1px solid #334155;
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  min-width: 140px;
  transition: border-color 0.2s;
}

.input-control:focus {
  border-color: #3b82f6;
}

.period-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #60a5fa;
  font-size: 0.85rem;
  height: 38px; /* Match input height roughly */
}

.download-btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  border: none;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  height: 38px;
}

.download-btn-primary:hover {
  background: #2563eb;
}
.download-btn-primary:disabled {
  background: #475569;
  cursor: not-allowed;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-zap {
  color: #fbbf24;
  fill: #fbbf24;
  width: 1.5rem;
  height: 1.5rem;
}

h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.live-badge {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 99px;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-left: 2.25rem;
}

/* Overview Section */
.overview-section {
  display: flex;
  flex-direction: column;
}

.main-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  /* Glassmorphism subtle */
  background: linear-gradient(145deg, #1e293b 0%, #151e32 100%);
}

.card-header {
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
}

.util-content {
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.util-bar-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.util-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.progress-track {
  height: 40px;
  background: #020617;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.6);
  border: 1px solid #1e293b;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%);
  border-radius: 6px;
  position: relative;
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); /* Enhanced glow */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem;
  overflow: hidden; /* important for shimmer */
}

/* Texture Flow Animation */
.progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.1) 0px,
    rgba(255, 255, 255, 0.1) 1px,
    transparent 1px,
    transparent 10px
  );
  background-size: 28px 28px; /* Must match the repeating pattern size geometry roughly for smooth loop */
  z-index: 1;
  animation: texture-flow 20s linear infinite;
}

/* Professional Shimmer Sweep */
.progress-fill::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0) 35%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0) 65%,
    transparent 100%
  );
  transform: translateX(-120%);
  z-index: 2;
  animation: shimmer-sweep 5s ease-in-out infinite;
}

/* Top Edge Highlight */
.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.5);
  z-index: 3;
  box-shadow: 0 1px 4px rgba(255, 255, 255, 0.3);
}

@keyframes texture-flow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 28px 0;
  }
}

@keyframes shimmer-sweep {
  0% {
    transform: translateX(-120%);
  }
  60% {
    transform: translateX(120%);
  } /* Fast sweep */
  100% {
    transform: translateX(120%);
  } /* Wait */
}

.util-stats {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.stat-big {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.stat-big .value {
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.stat-big .unit {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-perc {
  text-align: right;
}

.perc-value {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  color: #60a5fa;
  line-height: 1;
}

.perc-label {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.secondary-stats {
  background: rgba(15, 23, 42, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.sec-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sec-label {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 700;
  text-transform: uppercase;
}

.sec-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
}

.sec-value small {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}
.text-yellow {
  color: #facc15;
}
.text-green {
  color: #4ade80;
}
.text-red {
  color: #f87171;
}
.text-blue {
  color: #60a5fa;
}

/* Panels Grid */
.panels-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.grid-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.grid-title h2 {
  font-size: 1.1rem;
  color: #e2e8f0;
  font-weight: 700;
  margin: 0;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1400px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
  .secondary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .header-top {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  .report-controls {
    flex-wrap: wrap;
    width: 100%;
  }
}

.panel-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.panel-card:hover {
  transform: translateY(-2px);
  border-color: #475569;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}

.p-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.p-title h3 {
  margin: 0;
  font-size: 0.95rem;
  color: white;
  font-weight: 700;
}

.p-code {
  font-size: 0.75rem;
  color: #64748b;
}

.p-action {
  color: #4ade80; /* Active indicator */
  background: rgba(74, 222, 128, 0.1);
  padding: 0.4rem;
  border-radius: 6px;
}

.p-main-val {
  margin-bottom: 1.25rem;
}

.p-main-val .label {
  display: block;
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.val-row {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.val-row .val {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.val-row .unit {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
}

.sub-val {
  font-size: 0.75rem;
  color: #64748b;
}

.p-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid #334155;
  padding-top: 1rem;
}

.pm-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 0.8rem;
  color: #94a3b8;
}

.pm-row span {
  font-weight: 500;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.pm-val {
  font-weight: 700;
  color: #e2e8f0;
  font-size: 0.9rem;
}

.pm-sub {
  font-size: 0.7rem;
  color: #64748b;
}

.text-white {
  color: white;
}

.text-right {
  text-align: right;
}

/* Modal Styles Reuse */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(4px);
}
.modal-content {
  background: #1e293b;
  border-radius: 12px;
  border: 1px solid #334155;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.help-modal {
  max-width: 600px;
}
@keyframes modal-pop {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #151e32;
}
.modal-header h3 {
  margin: 0;
  color: white;
  font-size: 1.1rem;
}
.close-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}
.close-btn:hover {
  background: #334155;
  color: white;
}
.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}
.help-section h3 {
  color: #3b82f6;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.help-section p {
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}
.help-section ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0;
  color: #cbd5e1;
}
.help-section li {
  margin-bottom: 0.25rem;
}
</style>
