// src/utility/utility.controller.ts
import express from "express";
import * as service from "./utility.services";

const r = express.Router();

/**
 * GET /api/utility/:machineId/consumption
 * Get utility consumption data for a specific machine and utility type
 * Query params:
 *  - type: electricity|freshWater|wasteWater|naturalGas|fuelOil|steam|air|nitrogen
 *  - period: daily|monthly
 *  - date: YYYY-MM-DD (optional, defaults to today)
 */
r.get("/:machineId/consumption", async (req, res) => {
  try {
    const { machineId } = req.params;
    const type = req.query.type as string;
    const period = (req.query.period as string) || "daily";
    const date = req.query.date as string | undefined;

    if (!type) {
      return res.status(400).json({ message: "Utility type is required" });
    }

    const data = await service.getUtilityConsumption(
      machineId,
      type,
      period,
      date
    );
    res.json(data);
  } catch (err) {
    console.error("GET /utility/:machineId/consumption error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /api/utility/:machineId/trend
 * Get historical trend data for charts
 * Query params:
 *  - type: electricity|freshWater|wasteWater|naturalGas|fuelOil|steam|air|nitrogen
 *  - range: 7days|30days|12months
 */
r.get("/:machineId/trend", async (req, res) => {
  try {
    const { machineId } = req.params;
    const type = req.query.type as string;
    const range = (req.query.range as string) || "7days";

    if (!type) {
      return res.status(400).json({ message: "Utility type is required" });
    }

    const data = await service.getUtilityTrend(machineId, type, range);
    res.json(data);
  } catch (err) {
    console.error("GET /utility/:machineId/trend error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /api/utility/:machineId/summary
 * Get all utility types summary for a machine
 */
r.get("/:machineId/summary", async (req, res) => {
  try {
    const { machineId } = req.params;
    const date = req.query.date as string | undefined;

    const data = await service.getUtilitySummary(machineId, date);
    res.json(data);
  } catch (err) {
    console.error("GET /utility/:machineId/summary error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * POST /api/utility/record
 * Record utility consumption (for data ingestion)
 */
r.post("/record", async (req, res) => {
  try {
    const data = await service.recordUtilityConsumption(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error("POST /utility/record error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default r;
