"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSingleHour = exports.generateHourlyReport = exports.getHourlyReportRange = exports.getHourlyReport = void 0;
const lvmdp_3_hourlyReport_services_1 = require("./lvmdp_3.hourlyReport.services");
const lvmdp_3_hourlyReport_repository_1 = require("./lvmdp_3.hourlyReport.repository");
/**
 * GET /api/lvmdp/3/hourly?date=YYYY-MM-DD
 * Ambil data hourly untuk tanggal tertentu (24 jam)
 * SUPER FAST: < 10ms karena data sudah pre-aggregated
 */
const getHourlyReport = async (req, res) => {
    try {
        const { date } = req.query;
        if (!date || typeof date !== "string") {
            return res.status(400).json({
                success: false,
                message: "Query parameter 'date' (YYYY-MM-DD) is required",
            });
        }
        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Expected YYYY-MM-DD",
            });
        }
        const t0 = Date.now();
        const data = await (0, lvmdp_3_hourlyReport_services_1.fetchHourlyReportByDate)(date);
        const t1 = Date.now();
        return res.json({
            success: true,
            data,
            meta: {
                date,
                hoursCount: data.filter((h) => (h.count ?? 0) > 0).length,
                queryTime: `${t1 - t0}ms`,
            },
        });
    }
    catch (err) {
        console.error("[LVMDP3 Hourly Controller] Error:", err);
        return res.status(500).json({
            success: false,
            message: err?.message || "Failed to fetch hourly report",
        });
    }
};
exports.getHourlyReport = getHourlyReport;
/**
 * GET /api/lvmdp/3/hourly/range?start=YYYY-MM-DD&end=YYYY-MM-DD
 * Ambil data hourly untuk range tanggal
 */
const getHourlyReportRange = async (req, res) => {
    try {
        const { start, end } = req.query;
        if (!start ||
            !end ||
            typeof start !== "string" ||
            typeof end !== "string") {
            return res.status(400).json({
                success: false,
                message: "Query parameters 'start' and 'end' (YYYY-MM-DD) are required",
            });
        }
        const t0 = Date.now();
        const data = await (0, lvmdp_3_hourlyReport_services_1.fetchHourlyReportByRange)(start, end);
        const t1 = Date.now();
        return res.json({
            success: true,
            data,
            meta: {
                startDate: start,
                endDate: end,
                recordsCount: data.length,
                queryTime: `${t1 - t0}ms`,
            },
        });
    }
    catch (err) {
        console.error("[LVMDP3 Hourly Controller] Error:", err);
        return res.status(500).json({
            success: false,
            message: err?.message || "Failed to fetch hourly report range",
        });
    }
};
exports.getHourlyReportRange = getHourlyReportRange;
/**
 * POST /api/lvmdp/3/hourly/generate
 * Generate & save hourly data untuk tanggal tertentu
 * Body: { date: "YYYY-MM-DD" }
 */
const generateHourlyReport = async (req, res) => {
    try {
        const { date } = req.body;
        if (!date || typeof date !== "string") {
            return res.status(400).json({
                success: false,
                message: "Body parameter 'date' (YYYY-MM-DD) is required",
            });
        }
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Expected YYYY-MM-DD",
            });
        }
        const data = await (0, lvmdp_3_hourlyReport_services_1.generateHourlyReportsFromView)(date);
        return res.json({
            success: true,
            message: `Generated ${data.length} hourly records for ${date}`,
            data,
        });
    }
    catch (err) {
        console.error("[LVMDP3 Hourly Controller] Error:", err);
        return res.status(500).json({
            success: false,
            message: err?.message || "Failed to generate hourly report",
        });
    }
};
exports.generateHourlyReport = generateHourlyReport;
/**
 * POST /api/lvmdp/3/hourly/generate-hour
 * Generate single hour report
 * Body: { date: "YYYY-MM-DD", hour: 14 }
 */
const generateSingleHour = async (req, res) => {
    try {
        const { date, hour } = req.body;
        if (!date || typeof date !== "string" || typeof hour !== "number") {
            return res.status(400).json({
                success: false,
                message: "Body parameters 'date' (YYYY-MM-DD) and 'hour' (0-23) are required",
            });
        }
        if (hour < 0 || hour > 23) {
            return res.status(400).json({
                success: false,
                message: "Hour must be between 0 and 23",
            });
        }
        const data = await (0, lvmdp_3_hourlyReport_services_1.generateSingleHourReport)(date, hour);
        if (!data) {
            return res.json({
                success: true,
                message: `No data found for ${date} hour ${hour}`,
                data: null,
            });
        }
        await (0, lvmdp_3_hourlyReport_repository_1.saveHourlyReport)(data);
        return res.json({
            success: true,
            message: `Generated hourly record for ${date} hour ${hour}`,
            data,
        });
    }
    catch (err) {
        console.error("[LVMDP3 Hourly Controller] Error:", err);
        return res.status(500).json({
            success: false,
            message: err?.message || "Failed to generate single hour report",
        });
    }
};
exports.generateSingleHour = generateSingleHour;
