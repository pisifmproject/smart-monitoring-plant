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
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/lvmdp.router.ts
const express_1 = require("express");
const lvmdp_1_repository_1 = require("../lvmdp/LVMDP_1/lvmdp_1.repository");
const lvmdp_2_repository_1 = require("../lvmdp/LVMDP_2/lvmdp_2.repository");
const lvmdp_3_repository_1 = require("../lvmdp/LVMDP_3/lvmdp_3.repository");
const lvmdp_4_repository_1 = require("../lvmdp/LVMDP_4/lvmdp_4.repository");
const r = (0, express_1.Router)();
// Peta fungsi repository per panel
const REPO_FUNCTIONS = {
    1: lvmdp_1_repository_1.findLatestLVMDP1,
    2: lvmdp_2_repository_1.findLatestLVMDP2,
    3: lvmdp_3_repository_1.findLatestLVMDP3,
    4: lvmdp_4_repository_1.findLatestLVMDP4,
};
// GET /api/lvmdp/all/latest - Batch fetch all panels at once (optimized)
r.get("/all/latest", async (req, res) => {
    const startTime = Date.now();
    try {
        // Fetch all panels in parallel
        const [panel1, panel2, panel3, panel4] = await Promise.all([
            (0, lvmdp_1_repository_1.findLatestLVMDP1)(),
            (0, lvmdp_2_repository_1.findLatestLVMDP2)(),
            (0, lvmdp_3_repository_1.findLatestLVMDP3)(),
            (0, lvmdp_4_repository_1.findLatestLVMDP4)(),
        ]);
        const mapPanel = (row) => {
            if (!row)
                return null;
            return {
                waktu: row.waktu,
                totalKwh: row.totalKwh,
                realPower: row.realPower,
                cosPhi: row.cosPhi,
                freq: row.freq,
                avgLineLine: row.avgLineLine,
                avgLineNeut: row.avgLineNeut,
                avgCurrent: row.avgCurrent,
                currentR: row.currentR,
                currentS: row.currentS,
                currentT: row.currentT,
                voltageRS: row.voltageRS,
                voltageST: row.voltageST,
                voltageTR: row.voltageTR,
            };
        };
        const elapsed = Date.now() - startTime;
        // Set cache headers for 3 seconds
        res.setHeader("Cache-Control", "public, max-age=3");
        return res.json({
            panels: {
                1: mapPanel(panel1),
                2: mapPanel(panel2),
                3: mapPanel(panel3),
                4: mapPanel(panel4),
            },
            _meta: {
                fetchTime: elapsed,
                timestamp: new Date().toISOString(),
            }
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: String(err)
        });
    }
});
// Test endpoint to check database connection
r.get("/test", async (req, res) => {
    try {
        const result = await (0, lvmdp_1_repository_1.findLatestLVMDP1)();
        if (result) {
            return res.json({
                success: true,
                message: "Database connection OK",
                sampleData: {
                    power: result.realPower,
                    current: result.avgCurrent,
                    voltage: result.avgLineLine,
                    timestamp: result.waktu,
                },
            });
        }
        else {
            return res.json({
                success: false,
                message: "No data found in database",
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Database error",
            error: String(err),
        });
    }
});
// GET /api/lvmdp/:id/latest
r.get("/:id/latest", async (req, res) => {
    const startTime = Date.now();
    try {
        const id = Number(req.params.id);
        if (![1, 2, 3, 4].includes(id)) {
            return res.status(400).json({ message: "Bad id (must be 1..4)" });
        }
        const findLatest = REPO_FUNCTIONS[id];
        if (!findLatest) {
            return res.status(500).json({ message: "Repository not found" });
        }
        const row = await findLatest();
        if (!row) {
            return res.status(404).json({ message: "No data" });
        }
        return res.json({
            waktu: row.waktu,
            totalKwh: row.totalKwh,
            realPower: row.realPower,
            cosPhi: row.cosPhi,
            freq: row.freq,
            avgLineLine: row.avgLineLine,
            avgLineNeut: row.avgLineNeut,
            avgCurrent: row.avgCurrent,
            currentR: row.currentR,
            currentS: row.currentS,
            currentT: row.currentT,
            voltageRS: row.voltageRS,
            voltageST: row.voltageST,
            voltageTR: row.voltageTR,
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: String(err) });
    }
});
// GET /api/lvmdp/:id/shift-today
r.get("/:id/shift-today", async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (![1, 2, 3, 4].includes(id)) {
            return res.status(400).json({ message: "Bad id (must be 1..4)" });
        }
        const dateQuery = req.query.date;
        const targetDate = dateQuery || new Date().toISOString().split("T")[0];
        // Import the appropriate service based on panel ID
        let getShiftAverages;
        switch (id) {
            case 1:
                const { getShiftAveragesLVMDP1 } = await Promise.resolve().then(() => __importStar(require("../lvmdp/LVMDP_1/lvmdp_1.services")));
                getShiftAverages = getShiftAveragesLVMDP1;
                break;
            case 2:
                const { getShiftAveragesLVMDP2 } = await Promise.resolve().then(() => __importStar(require("../lvmdp/LVMDP_2/lvmdp_2.services")));
                getShiftAverages = getShiftAveragesLVMDP2;
                break;
            case 3:
                const { getShiftAveragesLVMDP3 } = await Promise.resolve().then(() => __importStar(require("../lvmdp/LVMDP_3/lvmdp_3.services")));
                getShiftAverages = getShiftAveragesLVMDP3;
                break;
            case 4:
                const { getShiftAveragesLVMDP4 } = await Promise.resolve().then(() => __importStar(require("../lvmdp/LVMDP_4/lvmdp_4.services")));
                getShiftAverages = getShiftAveragesLVMDP4;
                break;
        }
        const shifts = await getShiftAverages(targetDate);
        return res.json({
            date: targetDate,
            shift1: {
                totalKwh: shifts.shift1?.totalKwh || 0,
                avgKwh: shifts.shift1?.avgKwh || 0,
                avgCurrent: shifts.shift1?.avgCurrent || 0,
                minCurrent: shifts.shift1?.minCurrent || 0,
                maxCurrent: shifts.shift1?.maxCurrent || 0,
                cosPhi: shifts.shift1?.avgCosPhi || 0,
            },
            shift2: {
                totalKwh: shifts.shift2?.totalKwh || 0,
                avgKwh: shifts.shift2?.avgKwh || 0,
                avgCurrent: shifts.shift2?.avgCurrent || 0,
                minCurrent: shifts.shift2?.minCurrent || 0,
                maxCurrent: shifts.shift2?.maxCurrent || 0,
                cosPhi: shifts.shift2?.avgCosPhi || 0,
            },
            shift3: {
                totalKwh: shifts.shift3?.totalKwh || 0,
                avgKwh: shifts.shift3?.avgKwh || 0,
                avgCurrent: shifts.shift3?.avgCurrent || 0,
                minCurrent: shifts.shift3?.minCurrent || 0,
                maxCurrent: shifts.shift3?.maxCurrent || 0,
                cosPhi: shifts.shift3?.avgCosPhi || 0,
            },
        });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: String(err) });
    }
});
// GET /api/lvmdp/:id/trend?period=day|week|month|year&date=YYYY-MM-DD
r.get("/:id/trend", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const period = req.query.period || "day";
        const dateParam = req.query.date || new Date().toISOString().split("T")[0];
        if (![1, 2, 3, 4].includes(id)) {
            return res.status(400).json({ message: "Bad id (must be 1..4)" });
        }
        // Import Indofood calendar utilities
        const { getIndofoodWeekByDate, getIndofoodMonthByDate, getIndofoodYearRange, getIndofoodMonthByNumber, } = await Promise.resolve().then(() => __importStar(require("../utils/indofoodCalendar")));
        // Import appropriate repository
        let dailyReportRepo;
        switch (id) {
            case 1:
                dailyReportRepo = await Promise.resolve().then(() => __importStar(require("../lvmdp/LVMDP_1/lvmdp_1.dailyReport.repository")));
                break;
            case 2:
                dailyReportRepo = await Promise.resolve().then(() => __importStar(require("../lvmdp/LVMDP_2/lvmdp_2.dailyReport.repository")));
                break;
            case 3:
                dailyReportRepo = await Promise.resolve().then(() => __importStar(require("../lvmdp/LVMDP_3/lvmdp_3.dailyReport.repository")));
                break;
            case 4:
                dailyReportRepo = await Promise.resolve().then(() => __importStar(require("../lvmdp/LVMDP_4/lvmdp_4.dailyReport.repository")));
                break;
        }
        let data = [];
        let labels = [];
        if (period === "day") {
            // Hourly data for a specific day (00:00 - 23:59)
            const { fetchHourlyReportByDate } = await Promise.resolve(`${`../lvmdp/LVMDP_${id}/lvmdp_${id}.hourlyReport.services`}`).then(s => __importStar(require(s)));
            const hourlyData = await fetchHourlyReportByDate(dateParam);
            // Fill 24 hours
            for (let hour = 0; hour < 24; hour++) {
                const hourData = hourlyData.find((h) => h.hour === hour);
                labels.push(`${hour}:00`);
                data.push(hourData?.totalKwh || 0);
            }
        }
        else if (period === "week") {
            // Weekly data based on Indofood calendar
            const week = getIndofoodWeekByDate(dateParam);
            if (!week) {
                return res.status(404).json({ message: "Week not found for date " + dateParam });
            }
            // Get daily reports for the week range and filter anomalies
            const allReports = await dailyReportRepo.getAllDailyReports();
            const reports = allReports.filter((r) => {
                const total = (r.shift1TotalKwh || 0) + (r.shift2TotalKwh || 0) + (r.shift3TotalKwh || 0);
                return total <= 50000; // Filter out anomalies (> 50,000 kWh per day)
            });
            const weekReports = reports.filter((r) => r.reportDate >= week.startDate && r.reportDate <= week.endDate);
            // Generate labels for each day in the week
            const startDate = new Date(week.startDate);
            const endDate = new Date(week.endDate);
            const currentDate = new Date(startDate);
            while (currentDate <= endDate) {
                const dateStr = currentDate.toISOString().split("T")[0];
                const dayReport = weekReports.find((r) => r.reportDate === dateStr);
                const dayName = currentDate.toLocaleDateString("en-US", { weekday: "short" });
                const dayNum = currentDate.getDate();
                labels.push(`${dayName} ${dayNum}`);
                const totalKwh = (dayReport?.shift1TotalKwh || 0) +
                    (dayReport?.shift2TotalKwh || 0) +
                    (dayReport?.shift3TotalKwh || 0);
                data.push(totalKwh);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }
        else if (period === "month") {
            // Monthly data based on Indofood calendar (weekly aggregation)
            const currentMonth = getIndofoodMonthByDate(dateParam);
            if (!currentMonth) {
                return res.status(404).json({ message: "Month not found for date " + dateParam });
            }
            const allReports = await dailyReportRepo.getAllDailyReports();
            const reports = allReports.filter((r) => {
                const total = (r.shift1TotalKwh || 0) + (r.shift2TotalKwh || 0) + (r.shift3TotalKwh || 0);
                return total <= 50000; // Filter out anomalies
            });
            // Aggregate by week
            for (const week of currentMonth.weeks) {
                const weekReports = reports.filter((r) => r.reportDate >= week.startDate && r.reportDate <= week.endDate);
                let weekTotal = 0;
                for (const report of weekReports) {
                    weekTotal +=
                        (report.shift1TotalKwh || 0) +
                            (report.shift2TotalKwh || 0) +
                            (report.shift3TotalKwh || 0);
                }
                labels.push(`Week ${week.week}`);
                data.push(weekTotal);
            }
        }
        else if (period === "year") {
            // Yearly data based on Indofood calendar (monthly aggregation)
            const year = new Date(dateParam).getFullYear();
            const yearRange = getIndofoodYearRange(year);
            // Fetch reports within the year range and filter anomalies
            const allReports = await dailyReportRepo.getAllDailyReports();
            const reports = allReports.filter((r) => {
                const total = (r.shift1TotalKwh || 0) + (r.shift2TotalKwh || 0) + (r.shift3TotalKwh || 0);
                return total <= 50000 && r.reportDate >= yearRange.startDate && r.reportDate <= yearRange.endDate;
            });
            // Aggregate by Indofood month
            const monthNames = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ];
            for (let monthNum = 1; monthNum <= 12; monthNum++) {
                const indofoodMonth = getIndofoodMonthByNumber(year, monthNum);
                if (!indofoodMonth)
                    continue;
                const monthReports = reports.filter((r) => r.reportDate >= indofoodMonth.startDate && r.reportDate <= indofoodMonth.endDate);
                let monthTotal = 0;
                for (const report of monthReports) {
                    monthTotal +=
                        (report.shift1TotalKwh || 0) +
                            (report.shift2TotalKwh || 0) +
                            (report.shift3TotalKwh || 0);
                }
                labels.push(monthNames[monthNum - 1]);
                data.push(monthTotal);
            }
        }
        return res.json({
            period,
            labels,
            data,
            unit: "kWh",
        });
    }
    catch (err) {
        console.error("[LVMDP Trend Error]", err);
        return res.status(500).json({ message: "Internal server error", error: String(err) });
    }
});
exports.default = r;
