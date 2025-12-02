import express from "express";
import { getAllLVMDPs, getShiftAveragesLVMDP2 } from "./lvmdp_2.services";
import * as repo from "./lvmdp_2.repository";

const r = express.Router();

r.get("/", async (_req, res) => {
  const rows = await getAllLVMDPs();
  res.json(rows);
});

r.get("/latest", async (_req, res) => {
  const row = await repo.findLatestLVMDP2();
  if (!row) return res.status(404).json({ message: "No data" });
  res.json(row);
});

r.get("/shift-avg", async (req, res) => {
  const date = req.query.date as string | undefined;
  const data = await getShiftAveragesLVMDP2(date);

  // Transform avgKwh -> avgPower untuk frontend
  const transformed = {
    shift1: {
      avgPower: data.shift1.avgKwh,
      avgCurrent: data.shift1.avgCurrent,
      count: data.shift1.count,
    },
    shift2: {
      avgPower: data.shift2.avgKwh,
      avgCurrent: data.shift2.avgCurrent,
      count: data.shift2.count,
    },
    shift3: {
      avgPower: data.shift3.avgKwh,
      avgCurrent: data.shift3.avgCurrent,
      count: data.shift3.count,
    },
  };

  res.json(transformed);
});

// data RST (current & voltage) dari HMI
r.get("/hmi", async (_req, res) => {
  const hmiData = await repo.findLatestHMI2();
  if (!hmiData) return res.status(404).json({ message: "No HMI data" });
  res.json(hmiData);
});

export default r;
