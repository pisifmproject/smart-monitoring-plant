// src/lvmdp/LVMDP_3/lvmdp_3.dailyReport.controller.ts
import express from "express";
import {
  generateAndSaveDailyReport,
  fetchDailyReport,
  fetchMonthlyReport,
  fetchAllDailyReports,
  fetchHourlyAggregates,
} from "./lvmdp_3.dailyReport.services";

const router = express.Router();

function formatLocalYMD(d: any) {
  if (!d) return "";

  // Jika sudah Date
  if (d instanceof Date && !isNaN(d.getTime())) {
    const year = d.getFullYear(); // pakai waktu lokal server (+07)
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Jika string/number: coba parsing
  const parsed = Date.parse(String(d));
  if (!Number.isNaN(parsed)) {
    const dt = new Date(parsed);
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Jika objek dengan property reportDate atau tanggal
  if (typeof d === "object") {
    const maybe = d.reportDate ?? d.tanggal ?? null;
    if (maybe) return formatLocalYMD(maybe);
  }

  // fallback: coba ekstrak yyyy-mm-dd dari string
  const m = String(d).match(/(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];

  return String(d);
}

/**
 * GET /api/lvmdp1/daily-report/all
 * Dipakai tabel di frontend (DailyReportTable)
 *
 * NOTE: route /all HARUS di atas "/:date" supaya "all"
 * tidak masuk ke param :date.
 */
router.get("/all", async (req, res) => {
  try {
    const t0 = Date.now();

    const { getAllDailyReports } = await import(
      "./lvmdp_3.dailyReport.repository"
    );
    const { saveDailyReport } = await import(
      "./lvmdp_3.dailyReport.repository"
    );

    let allReports = await getAllDailyReports();

    // Ensure today's record exists
    const today = new Date().toISOString().split("T")[0];
    const todayExists = allReports.some((r: any) => r.reportDate === today);

    if (!todayExists) {
      // Create placeholder for today if doesn't exist
      await saveDailyReport({
        id: `lvmdp3_${today}`,
        reportDate: today,
        shift1Count: 0,
        shift1TotalKwh: 0,
        shift1AvgKwh: 0,
        shift1AvgCurrent: 0,
        shift1MinCurrent: 0,
        shift1MaxCurrent: 0,
        shift1AvgCosPhi: 0,
        shift2Count: 0,
        shift2TotalKwh: 0,
        shift2AvgKwh: 0,
        shift2AvgCurrent: 0,
        shift2MinCurrent: 0,
        shift2MaxCurrent: 0,
        shift2AvgCosPhi: 0,
        shift3Count: 0,
        shift3TotalKwh: 0,
        shift3AvgKwh: 0,
        shift3AvgCurrent: 0,
        shift3MinCurrent: 0,
        shift3MaxCurrent: 0,
        shift3AvgCosPhi: 0,
      });
      // Re-fetch to include today
      allReports = await getAllDailyReports();
    }

    // For today, calculate interim shift data from raw view
    const todayReport = allReports.find((r: any) => r.reportDate === today);

    if (todayReport) {
      // Calculate interim shifts for today
      const { getShiftAveragesLVMDP3 } = await import("./lvmdp_3.services");
      const interimShifts = await getShiftAveragesLVMDP3(today);

      // Update today's data with interim calculations
      todayReport.shift1TotalKwh =
        interimShifts.shift1?.totalKwh || todayReport.shift1TotalKwh;
      todayReport.shift1AvgKwh =
        interimShifts.shift1?.avgKwh || todayReport.shift1AvgKwh;
      todayReport.shift1AvgCurrent =
        interimShifts.shift1?.avgCurrent || todayReport.shift1AvgCurrent;
      todayReport.shift1MinCurrent =
        interimShifts.shift1?.minCurrent || todayReport.shift1MinCurrent;
      todayReport.shift1MaxCurrent =
        interimShifts.shift1?.maxCurrent || todayReport.shift1MaxCurrent;
      todayReport.shift1AvgCosPhi =
        interimShifts.shift1?.avgCosPhi || todayReport.shift1AvgCosPhi;

      todayReport.shift2TotalKwh =
        interimShifts.shift2?.totalKwh || todayReport.shift2TotalKwh;
      todayReport.shift2AvgKwh =
        interimShifts.shift2?.avgKwh || todayReport.shift2AvgKwh;
      todayReport.shift2AvgCurrent =
        interimShifts.shift2?.avgCurrent || todayReport.shift2AvgCurrent;
      todayReport.shift2MinCurrent =
        interimShifts.shift2?.minCurrent || todayReport.shift2MinCurrent;
      todayReport.shift2MaxCurrent =
        interimShifts.shift2?.maxCurrent || todayReport.shift2MaxCurrent;
      todayReport.shift2AvgCosPhi =
        interimShifts.shift2?.avgCosPhi || todayReport.shift2AvgCosPhi;

      todayReport.shift3TotalKwh =
        interimShifts.shift3?.totalKwh || todayReport.shift3TotalKwh;
      todayReport.shift3AvgKwh =
        interimShifts.shift3?.avgKwh || todayReport.shift3AvgKwh;
      todayReport.shift3AvgCurrent =
        interimShifts.shift3?.avgCurrent || todayReport.shift3AvgCurrent;
      todayReport.shift3MinCurrent =
        interimShifts.shift3?.minCurrent || todayReport.shift3MinCurrent;
      todayReport.shift3MaxCurrent =
        interimShifts.shift3?.maxCurrent || todayReport.shift3MaxCurrent;
      todayReport.shift3AvgCosPhi =
        interimShifts.shift3?.avgCosPhi || todayReport.shift3AvgCosPhi;
    }

    // Transform untuk format API
    const formatted = allReports.map((r: any) => ({
      reportDate: r.reportDate,
      date: r.reportDate,
      shift1TotalKwh: r.shift1TotalKwh || 0,
      shift1AvgKwh: r.shift1AvgKwh || 0,
      shift1AvgCurrent: r.shift1AvgCurrent || 0,
      shift1MinCurrent: r.shift1MinCurrent || 0,
      shift1MaxCurrent: r.shift1MaxCurrent || 0,
      shift1CosPhi: r.shift1AvgCosPhi || 0,
      shift2TotalKwh: r.shift2TotalKwh || 0,
      shift2AvgKwh: r.shift2AvgKwh || 0,
      shift2AvgCurrent: r.shift2AvgCurrent || 0,
      shift2MinCurrent: r.shift2MinCurrent || 0,
      shift2MaxCurrent: r.shift2MaxCurrent || 0,
      shift2CosPhi: r.shift2AvgCosPhi || 0,
      shift3TotalKwh: r.shift3TotalKwh || 0,
      shift3AvgKwh: r.shift3AvgKwh || 0,
      shift3AvgCurrent: r.shift3AvgCurrent || 0,
      shift3MinCurrent: r.shift3MinCurrent || 0,
      shift3MaxCurrent: r.shift3MaxCurrent || 0,
      shift3CosPhi: r.shift3AvgCosPhi || 0,
      isInterim: r.reportDate === today,
    }));

    const t1 = Date.now();
    console.log(
      `[LVMDP3 Daily /all] Fetched ${formatted.length} reports in ${t1 - t0}ms`
    );

    return res.json({
      success: true,
      data: formatted,
    });
  } catch (err: any) {
    console.error("fetchAllDailyReports error:", err);
    res.status(500).json({
      success: false,
      message: err?.message ?? "Failed get daily reports",
    });
  }
});

/**
 * GET /api/lvmdp1/daily-report/month?year=2025&month=11
 * Ambil semua daily report dalam 1 bulan
 */
router.get("/month", async (req, res) => {
  try {
    const year = Number(req.query.year);
    const month = Number(req.query.month);

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message:
          "Query year dan month wajib diisi. Contoh: ?year=2025&month=11",
      });
    }

    const reports = await fetchMonthlyReport(year, month);

    res.json({
      success: true,
      data: reports,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || "Failed to load monthly report",
    });
  }
});

router.get("/hourly/:date", async (req, res) => {
  try {
    const { date } = req.params; // 'YYYY-MM-DD'

    // Try to get pre-aggregated data from database first
    const { fetchHourlyReportByDate } = await import(
      "./lvmdp_3.hourlyReport.services"
    );
    let data = await fetchHourlyReportByDate(date);

    // If no data or incomplete, calculate interim from raw view
    const isToday = date === new Date().toISOString().split("T")[0];
    if (data.length === 0 || isToday) {
      // Calculate interim from raw data for incomplete hours
      const { generateHourlyReportsFromView } = await import(
        "./lvmdp_3.hourlyReport.services"
      );
      const interimData = await generateHourlyReportsFromView(date);

      if (interimData && interimData.length > 0) {
        // Merge: prefer interim for today, use database for past dates
        if (isToday) {
          data = interimData; // Use calculated interim for today
        } else {
          data = data.length > 0 ? data : interimData; // Fallback to interim if DB empty
        }
      }
    }

    // Format untuk frontend dengan field names yang konsisten
    const formatted = data.map((h: any) => ({
      hour: h.hour, // Keep as number 0-23
      totalKwh: h.totalKwh || h.total_kwh || 0,
      avgKwh: h.avgKwh || h.avg_kwh || 0,
      cosPhi: h.avgCosPhi || h.avg_cos_phi || h.cos_phi || 0,
      avgCurrent: h.avgCurrent || h.avg_current || 0,
      minCurrent: h.minCurrent || h.min_current || 0,
      maxCurrent: h.maxCurrent || h.max_current || 0,
      isInterim: isToday ? true : false, // Flag untuk UI
    }));

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});

/**
 * GET /api/lvmdp3/daily-report/:date
 * :date = 'YYYY-MM-DD'
 * Ambil daily report untuk satu hari
 */
router.get("/:date", async (req, res) => {
  try {
    const dateStr = req.params.date;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return res.status(400).json({
        success: false,
        message: `Invalid date format: ${dateStr}. Expected YYYY-MM-DD`,
      });
    }

    const report = await fetchDailyReport(dateStr);
    // fetchDailyReport balikin array dari repo
    const first = Array.isArray(report) ? report[0] : report;

    if (!first) {
      return res.status(404).json({
        success: false,
        message: `No daily report for date ${dateStr}`,
      });
    }

    res.json({
      success: true,
      data: first,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || "Failed to load daily report",
    });
  }
});

/**
 * POST /api/lvmdp3/daily-report/generate?date=YYYY-MM-DD
 * Generate & simpan daily report untuk satu hari
 * Kalau ?date gak diisi → default hari ini
 */
router.post("/generate", async (req, res) => {
  try {
    let dateStr = String(req.query.date || "").trim();

    // default ke hari ini kalau kosong
    if (!dateStr) {
      dateStr = new Date().toISOString().slice(0, 10);
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      return res.status(400).json({
        success: false,
        message: `Invalid date format: ${dateStr}. Expected YYYY-MM-DD`,
      });
    }

    const saved = await generateAndSaveDailyReport(dateStr);

    res.status(201).json({
      success: true,
      message: "Daily report generated",
      data: Array.isArray(saved) ? saved[0] : saved,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err?.message || "Failed to generate daily report",
    });
  }
});

/**
 * GET /api/lvmdp3/daily-report/hourly/:date
 * Fetch hourly data untuk frontend (compatibility endpoint)
 */
router.get("/hourly/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Expected YYYY-MM-DD",
      });
    }

    const { fetchHourlyReportByDate } = await import(
      "./lvmdp_3.hourlyReport.services"
    );
    const data = await fetchHourlyReportByDate(date);

    const transformed = data.map((h: any) => ({
      hour: h.hour,
      totalKwh: h.totalKwh || 0,
      avgKwh: h.avgKwh || 0,
      avgCurrent: h.avgCurrent || 0,
      minCurrent: h.minCurrent || 0,
      maxCurrent: h.maxCurrent || 0,
      cosPhi: h.avgCosPhi || 0,
    }));

    return res.json(transformed);
  } catch (err: any) {
    console.error("[LVMDP3 Daily Controller] Error fetching hourly:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to fetch hourly data",
    });
  }
});

/**
 * POST /api/lvmdp3/daily-report/current-shift
 * Generate and save current shift report (real-time)
 */
router.post("/current-shift", async (req, res) => {
  try {
    const { saveCurrentShiftReport, getCurrentShift } = await import(
      "./lvmdp_3.dailyReport.services"
    );

    const { shift, date } = getCurrentShift();
    const result = await saveCurrentShiftReport();

    return res.json({
      success: true,
      message: `Successfully saved current shift ${shift} for ${date}`,
      data: result,
    });
  } catch (err: any) {
    console.error("[LVMDP3 Daily Controller] Error saving current shift:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to save current shift",
    });
  }
});

export default router;
