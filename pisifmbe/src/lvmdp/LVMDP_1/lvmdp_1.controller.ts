// src/lvmdp/LVMDP_1/lvmdp_1.controller.ts
import express from "express";
import { getAllLVMDPs, getShiftAveragesLVMDP1 } from "./lvmdp_1.services";
import * as repo from "./lvmdp_1.repository";

const r = express.Router();

// semua data (kalau butuh)
r.get("/", async (_req, res) => {
  const rows = await getAllLVMDPs();
  res.json(rows);
});

// data paling terbaru (untuk gauge realtime)
r.get("/latest", async (_req, res) => {
  const row = await repo.findLatestLVMDP1();
  if (!row) return res.status(404).json({ message: "No data" });
  res.json(row);
});

// data RST (current & voltage) dari HMI
r.get("/hmi", async (_req, res) => {
  const hmiData = await repo.findLatestHMI1();
  if (!hmiData) return res.status(404).json({ message: "No HMI data" });
  res.json(hmiData);
});

// rata-rata per shift (dipakai ShiftCard di frontend)
r.get("/shift-avg", async (req, res) => {
  const date = req.query.date as string | undefined; // optional ?date=2025-11-12
  const data = await getShiftAveragesLVMDP1(date);

  // Transform avgKwh -> avgPower untuk frontend
  const transformed = {
    shift1: {
      avgPower: data.shift1.avgKwh,
      avgCurrent: data.shift1.avgCurrent,
      minCurrent: data.shift1.minCurrent,
      maxCurrent: data.shift1.maxCurrent,
      count: data.shift1.count,
    },
    shift2: {
      avgPower: data.shift2.avgKwh,
      avgCurrent: data.shift2.avgCurrent,
      minCurrent: data.shift2.minCurrent,
      maxCurrent: data.shift2.maxCurrent,
      count: data.shift2.count,
    },
    shift3: {
      avgPower: data.shift3.avgKwh,
      avgCurrent: data.shift3.avgCurrent,
      minCurrent: data.shift3.minCurrent,
      maxCurrent: data.shift3.maxCurrent,
      count: data.shift3.count,
    },
  };

  res.json(transformed);
});

export default r;
