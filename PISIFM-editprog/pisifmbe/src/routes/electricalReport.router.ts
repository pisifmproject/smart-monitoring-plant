// src/routes/electricalReport.router.ts
import { Router } from "express";
import {
  getElectricalReport,
  getLatestElectricalReport,
  getReportingHealth,
} from "../electricalReport/electricalReport.controller";

const router = Router();

/**
 * GET /api/report/electrical
 * Main endpoint for generating electrical reports
 *
 * Query parameters:
 *   Daily: ?period=day&date=2025-12-12
 *   Weekly: ?period=week&weekStart=2025-12-09 (Monday)
 *   Monthly: ?period=month&year=2025&month=12
 */
router.get("/electrical", getElectricalReport);

/**
 * GET /api/report/electrical/latest
 * Get yesterday's report (most recent complete data)
 */
router.get("/electrical/latest", getLatestElectricalReport);

/**
 * GET /api/report/electrical/health
 * System health check
 */
router.get("/electrical/health", getReportingHealth);

export default router;
