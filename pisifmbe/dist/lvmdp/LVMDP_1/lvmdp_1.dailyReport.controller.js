"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/lvmdp/LVMDP_1/lvmdp_1.dailyReport.controller.ts
const express_1 = __importDefault(require("express"));
const lvmdp_1_dailyReport_services_1 = require("./lvmdp_1.dailyReport.services");
const router = express_1.default.Router();
function formatLocalYMD(d) {
    if (!d)
        return "";
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
        if (maybe)
            return formatLocalYMD(maybe);
    }
    // fallback: coba ekstrak yyyy-mm-dd dari string
    const m = String(d).match(/(\d{4}-\d{2}-\d{2})/);
    if (m)
        return m[1];
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
        let reports = await (0, lvmdp_1_dailyReport_services_1.fetchAllDailyReports)();
        // Auto-fill today's current shift if not exist or incomplete
        const { getCurrentShift } = await Promise.resolve().then(() => __importStar(require("./lvmdp_1.dailyReport.services")));
        const { shift: currentShift, date: todayStr } = getCurrentShift();
        // Check if today's report exists
        const todayReport = reports.find((r) => {
            const rDate = formatLocalYMD(r.reportDate);
            return rDate === todayStr;
        });
        // If today's report doesn't exist or current shift is empty, generate it
        const needsCurrentShift = !todayReport ||
            (currentShift === 1 &&
                (!todayReport.shift1Count || todayReport.shift1Count === 0)) ||
            (currentShift === 2 &&
                (!todayReport.shift2Count || todayReport.shift2Count === 0)) ||
            (currentShift === 3 &&
                (!todayReport.shift3Count || todayReport.shift3Count === 0));
        if (needsCurrentShift) {
            try {
                const { saveCurrentShiftReport } = await Promise.resolve().then(() => __importStar(require("./lvmdp_1.dailyReport.services")));
                await saveCurrentShiftReport();
                // Refresh reports after save
                reports = await (0, lvmdp_1_dailyReport_services_1.fetchAllDailyReports)();
            }
            catch (err) {
                console.error("[LVMDP1] Auto-fill current shift failed:", err);
            }
        }
        // Jika belum ada data sama sekali, generate on-the-fly dari raw data
        if (reports.length === 0) {
            try {
                const { getShiftAveragesLVMDP1 } = await Promise.resolve().then(() => __importStar(require("./lvmdp_1.services")));
                // Generate for last 30 days
                const dates = [];
                for (let i = 0; i < 30; i++) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = new Intl.DateTimeFormat("sv-SE").format(d);
                    dates.push(dateStr);
                }
                // Paralelisasi dengan Promise.all untuk speed up
                const computedReports = await Promise.all(dates.map(async (dateStr) => {
                    try {
                        const shifts = await getShiftAveragesLVMDP1(dateStr);
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
                    }
                    catch (e) {
                        return null;
                    }
                }));
                const validReports = computedReports.filter((r) => r !== null);
                return res.json({
                    success: true,
                    data: validReports,
                });
            }
            catch (genErr) {
                // lanjut dengan empty array
            }
        }
        const data = reports.map((r) => ({
            ...r,
            // Compute totalKwh from avgKwh * count
            shift1TotalKwh: (r.shift1AvgKwh || 0) * (r.shift1Count || 1),
            shift1CosPhi: r.shift1AvgCosPhi || 0,
            shift2TotalKwh: (r.shift2AvgKwh || 0) * (r.shift2Count || 1),
            shift2CosPhi: r.shift2AvgCosPhi || 0,
            shift3TotalKwh: (r.shift3AvgKwh || 0) * (r.shift3Count || 1),
            shift3CosPhi: r.shift3AvgCosPhi || 0,
            // field tambahan khusus buat frontend
            date: formatLocalYMD(r.reportDate || r.reportDate),
        }));
        // kirim data yang sudah dinormalisasi
        res.json({
            success: true,
            data,
        });
    }
    catch (err) {
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
                message: "Query year dan month wajib diisi. Contoh: ?year=2025&month=11",
            });
        }
        const reports = await (0, lvmdp_1_dailyReport_services_1.fetchMonthlyReport)(year, month);
        res.json({
            success: true,
            data: reports,
        });
    }
    catch (err) {
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
        // Use raw data calculation untuk konsistensi dengan shift report
        const { getHourlyAveragesLVMDP1 } = await Promise.resolve().then(() => __importStar(require("./lvmdp_1.services")));
        const hourlyData = await getHourlyAveragesLVMDP1(date);
        // Format untuk frontend
        const formatted = hourlyData.map((h) => ({
            hour: h.hour,
            totalKwh: h.totalKwh,
            avgKwh: h.avgKwh,
            cosPhi: h.cosPhi || 0,
            avgCurrent: h.avgCurrent,
            minCurrent: h.minCurrent || 0,
            maxCurrent: h.maxCurrent || 0,
        }));
        res.json(formatted);
    }
    catch (err) {
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
        const report = await (0, lvmdp_1_dailyReport_services_1.fetchDailyReport)(dateStr);
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
    }
    catch (err) {
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
        const saved = await (0, lvmdp_1_dailyReport_services_1.generateAndSaveDailyReport)(dateStr);
        res.status(201).json({
            success: true,
            message: "Daily report generated",
            data: Array.isArray(saved) ? saved[0] : saved,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err?.message || "Failed to generate daily report",
        });
    }
});
/**
 * GET /api/lvmdp1/daily-report/hourly/:date
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
        // Import hourly report service
        const { fetchHourlyReportByDate } = await Promise.resolve().then(() => __importStar(require("./lvmdp_1.hourlyReport.services")));
        const data = await fetchHourlyReportByDate(date);
        // Transform to match frontend expectations
        const transformed = data.map((h) => ({
            hour: h.hour,
            totalKwh: h.totalKwh || 0,
            avgKwh: h.avgKwh || 0,
            avgCurrent: h.avgCurrent || 0,
            cosPhi: h.avgCosPhi || 0,
        }));
        return res.json(transformed);
    }
    catch (err) {
        console.error("[LVMDP1 Daily Controller] Error fetching hourly:", err);
        return res.status(500).json({
            success: false,
            message: err?.message || "Failed to fetch hourly data",
        });
    }
});
/**
 * POST /api/lvmdp1/daily-report/save-shift
 * Manual trigger untuk save shift specific
 * Body: { date: "2025-11-29", shift: 1 }
 */
router.post("/save-shift", async (req, res) => {
    try {
        const { date, shift } = req.body;
        if (!date || !shift) {
            return res.status(400).json({
                success: false,
                message: "Missing date or shift parameter",
            });
        }
        if (shift < 1 || shift > 3) {
            return res.status(400).json({
                success: false,
                message: "Shift must be 1, 2, or 3",
            });
        }
        const { saveShiftReport } = await Promise.resolve().then(() => __importStar(require("./lvmdp_1.dailyReport.services")));
        const result = await saveShiftReport(date, shift);
        return res.json({
            success: true,
            message: `Shift ${shift} for ${date} saved successfully`,
            data: result,
        });
    }
    catch (err) {
        console.error("[LVMDP1 Daily Controller] Error saving shift:", err);
        return res.status(500).json({
            success: false,
            message: err?.message || "Failed to save shift",
        });
    }
});
/**
 * GET /api/lvmdp1/daily-report/debug/:date
 * Debug endpoint untuk cek data shift yang akan disave
 */
router.get("/debug/:date", async (req, res) => {
    try {
        const dateStr = req.params.date;
        const { getShiftAveragesLVMDP1 } = await Promise.resolve().then(() => __importStar(require("./lvmdp_1.services")));
        const shifts = await getShiftAveragesLVMDP1(dateStr);
        return res.json({
            success: true,
            date: dateStr,
            shifts: shifts,
            message: "This is what will be saved to daily report",
        });
    }
    catch (err) {
        console.error("[LVMDP1 Daily Controller] Error in debug:", err);
        return res.status(500).json({
            success: false,
            message: err?.message || "Failed to fetch debug data",
        });
    }
});
/**
 * POST /api/lvmdp1/daily-report/current-shift
 * Generate and save current shift report (real-time)
 * Useful for viewing shift data before shift ends
 */
router.post("/current-shift", async (req, res) => {
    try {
        const { saveCurrentShiftReport, getCurrentShift } = await Promise.resolve().then(() => __importStar(require("./lvmdp_1.dailyReport.services")));
        const { shift, date } = getCurrentShift();
        const result = await saveCurrentShiftReport();
        return res.json({
            success: true,
            message: `Successfully saved current shift ${shift} for ${date}`,
            data: result,
        });
    }
    catch (err) {
        console.error("[LVMDP1 Daily Controller] Error saving current shift:", err);
        return res.status(500).json({
            success: false,
            message: err?.message || "Failed to save current shift",
        });
    }
});
exports.default = router;
