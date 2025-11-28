// src/lvmdp/LVMDP_4/lvmdp_4.dailyReport.controller.ts
import express from "express";
import {
  generateAndSaveDailyReport,
  fetchDailyReport,
  fetchMonthlyReport,
  fetchAllDailyReports,
  fetchHourlyAggregates,
} from "./lvmdp_4.dailyReport.services";

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
    // Always calculate from raw data to include cosPhi
    const { getShiftAveragesLVMDP4 } = await import("./lvmdp_4.services");

    // Generate for last 30 days
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = new Intl.DateTimeFormat("sv-SE").format(d);
      dates.push(dateStr);
    }

    // Paralelisasi dengan Promise.all untuk speed up
    const computedReports = await Promise.all(
      dates.map(async (dateStr) => {
        try {
          const shifts = await getShiftAveragesLVMDP4(dateStr);
          return {
            reportDate: dateStr,
            date: dateStr,
            shift1TotalKwh: shifts.shift1?.totalKwh || 0,
            shift1AvgKwh: shifts.shift1?.avgKwh || 0,
            shift1AvgCurrent: shifts.shift1?.avgCurrent || 0,
            shift1CosPhi: shifts.shift1?.avgCosPhi || 0,
            shift2TotalKwh: shifts.shift2?.totalKwh || 0,
            shift2AvgKwh: shifts.shift2?.avgKwh || 0,
            shift2AvgCurrent: shifts.shift2?.avgCurrent || 0,
            shift2CosPhi: shifts.shift2?.avgCosPhi || 0,
            shift3TotalKwh: shifts.shift3?.totalKwh || 0,
            shift3AvgKwh: shifts.shift3?.avgKwh || 0,
            shift3AvgCurrent: shifts.shift3?.avgCurrent || 0,
            shift3CosPhi: shifts.shift3?.avgCosPhi || 0,
          };
        } catch (e) {
          // Return null for error dates, filter later
          return null;
        }
      })
    );

    // Filter out null entries
    const validReports = computedReports.filter((r) => r !== null);

    return res.json({
      success: true,
      data: validReports,
    });
  } catch (err: any) {
    // console.error("fetchAllDailyReports error:", err);
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

    // Auto-generate shift report untuk tanggal ini kalau belum ada
    const { getDailyReportByDate } = await import(
      "./lvmdp_4.dailyReport.repository"
    );
    const existing = await getDailyReportByDate(new Date(date));
    if (!existing || existing.length === 0) {
      try {
        await generateAndSaveDailyReport(date);
      } catch (genErr) {
        // lanjut, tidak perlu error
      }
    }

    const rows = await fetchHourlyAggregates(date);

    // Format untuk frontend dengan field names yang konsisten
    const formatted = rows.map((h: any) => ({
      hour: h.hour instanceof Date ? h.hour.toISOString() : h.hour,
      totalKwh: h.totalKwh || h.total_kwh || 0,
      avgKwh: h.avgKwh || h.avg_kwh || 0,
      cosPhi: h.cosPhi || h.cos_phi || 0,
      avgCurrent: h.avgCurrent || h.avg_current || 0,
    }));

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ message: err.message || "Internal server error" });
  }
});

/**
 * GET /api/lvmdp1/daily-report/:date
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
 * POST /api/lvmdp1/daily-report/generate?date=YYYY-MM-DD
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
 * GET /api/lvmdp4/daily-report/hourly/:date
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
      "./lvmdp_4.hourlyReport.services"
    );
    const data = await fetchHourlyReportByDate(date);

    const transformed = data.map((h: any) => ({
      hour: h.hour,
      totalKwh: h.totalKwh || 0,
      avgKwh: h.avgKwh || 0,
      avgCurrent: h.avgCurrent || 0,
      cosPhi: h.avgCosPhi || 0,
    }));

    return res.json(transformed);
  } catch (err: any) {
    console.error("[LVMDP4 Daily Controller] Error fetching hourly:", err);
    return res.status(500).json({
      success: false,
      message: err?.message || "Failed to fetch hourly data",
    });
  }
});

export default router;
