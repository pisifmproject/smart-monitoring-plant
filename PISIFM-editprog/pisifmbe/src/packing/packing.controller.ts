// src/packing/packing.controller.ts
import express from "express";
import * as service from "./packing.services";

const r = express.Router();

/* ===========================
   WEIGHER ENDPOINTS
=========================== */

// GET /api/packing/weigher - Get all weigher data
r.get("/weigher", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const data = await service.getAllWeigher(limit);
    res.json(data);
  } catch (err) {
    console.error("GET /packing/weigher error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/packing/weigher/latest - Get latest weigher data
r.get("/weigher/latest", async (_req, res) => {
  try {
    const data = await service.getLatestWeigher();
    if (!data) {
      return res.status(404).json({ message: "No weigher data found" });
    }
    res.json(data);
  } catch (err) {
    console.error("GET /packing/weigher/latest error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/packing/weigher - Create new weigher data
r.post("/weigher", async (req, res) => {
  try {
    const data = await service.createWeigherData(req.body);
    if (!data) {
      return res.status(500).json({ message: "Failed to create weigher data" });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error("POST /packing/weigher error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ===========================
   BAGMAKER ENDPOINTS
=========================== */

// GET /api/packing/bagmaker - Get all bagmaker data
r.get("/bagmaker", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    const data = await service.getAllBagMaker(limit);
    res.json(data);
  } catch (err) {
    console.error("GET /packing/bagmaker error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/packing/bagmaker/latest - Get latest bagmaker data
r.get("/bagmaker/latest", async (_req, res) => {
  try {
    const data = await service.getLatestBagMaker();
    if (!data) {
      return res.status(404).json({ message: "No bagmaker data found" });
    }
    res.json(data);
  } catch (err) {
    console.error("GET /packing/bagmaker/latest error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /api/packing/bagmaker - Create new bagmaker data
r.post("/bagmaker", async (req, res) => {
  try {
    const data = await service.createBagMakerData(req.body);
    if (!data) {
      return res
        .status(500)
        .json({ message: "Failed to create bagmaker data" });
    }
    res.status(201).json(data);
  } catch (err) {
    console.error("POST /packing/bagmaker error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ===========================
   SUMMARY ENDPOINTS
=========================== */

// GET /api/packing/summary - Get summary for both weigher and bagmaker
r.get("/summary", async (_req, res) => {
  try {
    const summary = await service.getPackingSummary();
    res.json(summary);
  } catch (err) {
    console.error("GET /packing/summary error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/packing/shift-summary - Get shift summary
r.get("/shift-summary", async (req, res) => {
  try {
    const date = req.query.date as string | undefined;
    const summary = await service.getShiftSummary(date);
    res.json(summary);
  } catch (err) {
    console.error("GET /packing/shift-summary error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default r;
