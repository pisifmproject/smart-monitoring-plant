// src/electricalReport/electricalReport.controller.ts
import { Request, Response } from "express";
import {
  generateDailyReport,
  generateWeeklyReport,
  generateMonthlyReport,
} from "./electricalReport.service";

/**
 * Controller for electrical reporting API endpoints
 */

/**
 * GET /api/report/electrical
 * Query params:
 *   - period: "day" | "week" | "month"
 *   - date: YYYY-MM-DD (for day)
 *   - weekStart: YYYY-MM-DD (for week, Monday)
 *   - year: YYYY (for month)
 *   - month: 1-12 (for month)
 */
export async function getElectricalReport(req: Request, res: Response) {
  try {
    const { period, date, weekStart, year, month } = req.query;

    if (!period || !["day", "week", "month"].includes(period as string)) {
      return res.status(400).json({
        error: "Invalid period. Must be 'day', 'week', or 'month'",
      });
    }

    let report;

    if (period === "day") {
      if (!date) {
        return res.status(400).json({
          error: "Missing 'date' parameter (format: YYYY-MM-DD)",
        });
      }

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date as string)) {
        return res.status(400).json({
          error: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      report = await generateDailyReport(date as string);
    } else if (period === "week") {
      if (!weekStart) {
        return res.status(400).json({
          error: "Missing 'weekStart' parameter (format: YYYY-MM-DD, Monday)",
        });
      }

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart as string)) {
        return res.status(400).json({
          error: "Invalid weekStart format. Use YYYY-MM-DD",
        });
      }

      // Validate it's Monday
      const startDate = new Date(weekStart as string);
      if (startDate.getDay() !== 1) {
        return res.status(400).json({
          error: "weekStart must be a Monday",
        });
      }

      report = await generateWeeklyReport(weekStart as string);
    } else if (period === "month") {
      if (!year || !month) {
        return res.status(400).json({
          error: "Missing 'year' and 'month' parameters",
        });
      }

      const yearNum = parseInt(year as string);
      const monthNum = parseInt(month as string);

      if (isNaN(yearNum) || isNaN(monthNum)) {
        return res.status(400).json({
          error: "Invalid year or month format",
        });
      }

      if (monthNum < 1 || monthNum > 12) {
        return res.status(400).json({
          error: "Month must be between 1 and 12",
        });
      }

      report = await generateMonthlyReport(yearNum, monthNum);
    }

    // Set cache headers (cache for 5 minutes for current day, longer for past data)
    const isToday =
      period === "day" && date === new Date().toISOString().split("T")[0];

    if (isToday) {
      // Cache current day data for 5 minutes
      res.setHeader("Cache-Control", "public, max-age=300");
    } else {
      // Cache historical data for 1 hour
      res.setHeader("Cache-Control", "public, max-age=3600");
    }

    return res.json(report);
  } catch (error: any) {
    console.error("Error generating electrical report:", error);

    if (error.message.includes("No data available")) {
      return res.status(404).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Failed to generate electrical report",
      details: error.message,
    });
  }
}

/**
 * GET /api/report/electrical/latest
 * Get the latest available report (yesterday's data)
 */
export async function getLatestElectricalReport(req: Request, res: Response) {
  try {
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    const report = await generateDailyReport(dateStr);

    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.json(report);
  } catch (error: any) {
    console.error("Error generating latest report:", error);

    return res.status(500).json({
      error: "Failed to generate latest report",
      details: error.message,
    });
  }
}

/**
 * GET /api/report/electrical/health
 * Check system health and data availability
 */
export async function getReportingHealth(req: Request, res: Response) {
  try {
    // Try to generate yesterday's report to check system health
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    const report = await generateDailyReport(dateStr);

    return res.json({
      status: "healthy",
      latestReportDate: dateStr,
      dataCompleteness: report.metadata.dataCompleteness_percent,
      panels: report.panels.map((p) => ({
        panelId: p.panelId,
        status: p.status,
      })),
    });
  } catch (error: any) {
    return res.status(503).json({
      status: "unhealthy",
      error: error.message,
    });
  }
}
