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
  res.json(data);
});

export default r;
