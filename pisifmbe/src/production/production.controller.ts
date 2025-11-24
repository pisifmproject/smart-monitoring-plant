// src/production/production.controller.ts
import express from "express";
import * as service from "./production.services";

const r = express.Router();

// GET /api/production - Get all production data
r.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const data = await service.getAllProduction(limit);
    res.json(data);
  } catch (err) {
    console.error("GET /production error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/production/latest - Get latest production data
r.get("/latest", async (_req, res) => {
  try {
    const data = await service.getLatestProduction();
    if (!data) {
      return res.status(404).json({ message: "No production data found" });
    }
    res.json(data);
  } catch (err) {
    console.error("GET /production/latest error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/production/shift-summary - Get shift summary
r.get("/shift-summary", async (req, res) => {
  try {
    const date = req.query.date as string | undefined;
    const summary = await service.getShiftSummary(date);
    res.json(summary);
  } catch (err) {
    console.error("GET /production/shift-summary error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/production - Create new production data
r.post("/", async (req, res) => {
  try {
    const data = await service.createProductionData(req.body);
    if (!data) {
      return res
        .status(500)
        .json({ message: "Failed to create production data" });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error("POST /production error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default r;
