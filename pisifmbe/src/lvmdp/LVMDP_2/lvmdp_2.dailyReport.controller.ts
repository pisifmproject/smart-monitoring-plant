// src/lvmdp/LVMDP_2/lvmdp_2.dailyReport.controller.ts
import express from "express";
import {
  generateAndSaveDailyReport,
  fetchDailyReport,
  fetchMonthlyReport,
  fetchAllDailyReports,
  fetchHourlyAggregates,
} from "./lvmdp_2.dailyReport.services";

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
router.get("/all", async (_req, res) => {
  try {
    const reports = await fetchAllDailyReports();

    const data = reports.map((r) => ({
      ...r,
      // field tambahan khusus buat frontend
      date: formatLocalYMD(r.reportDate as Date),
    }));

    // kirim data yang sudah dinormalisasi
    res.json({
      success: true,
      data,
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
    console.error("fetchMonthlyReport error:", err);
    res.status(500).json({
      success: false,
      message: err?.message || "Failed to load monthly report",
    });
  }
});

/**
 * GET /api/lvmdp1/daily-report/hourly/:date
 * :date = 'YYYY-MM-DD'
 * Ambil hourly aggregates untuk satu hari
 */
// router.get("/hourly/:date", async (req, res) => {
//   try {
//     const dateStr = req.params.date;
//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     if (!dateRegex.test(dateStr)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid date format: ${dateStr}. Expected YYYY-MM-DD`,
//       });
//     }

//     const hourlyData = await fetchHourlyAggregates(dateStr);

//     res.json({
//       success: true,
//       data: hourlyData,
//     });
//   } catch (err: any) {
//     console.error("fetchHourlyAggregates error:", err);
//     res.status(500).json({
//       success: false,
//       message: err?.message || "Failed to load hourly data",
//     });
//   }
// });

router.get("/hourly/:date", async (req, res) => {
  try {
    const { date } = req.params; // 'YYYY-MM-DD'
    const rows = await fetchHourlyAggregates(date);
    res.json(rows);
  } catch (err: any) {
    console.error("fetchHourlyAggregates error:", err);
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
    console.error("fetchDailyReport error:", err);
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
    console.error("generateAndSaveDailyReport error:", err);
    res.status(500).json({
      success: false,
      message: err?.message || "Failed to generate daily report",
    });
  }
});

export default router;
