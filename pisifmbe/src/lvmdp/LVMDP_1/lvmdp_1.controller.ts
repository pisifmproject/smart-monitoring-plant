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

// rata-rata per shift (dipakai ShiftCard di frontend)
r.get("/shift-avg", async (req, res) => {
  const date = req.query.date as string | undefined; // optional ?date=2025-11-12
  const data = await getShiftAveragesLVMDP1(date);
  res.json(data);
});

export default r;
