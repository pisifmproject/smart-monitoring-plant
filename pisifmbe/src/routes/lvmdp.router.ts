// src/routes/lvmdp.router.ts
import { Router } from "express";
import { findLatestLVMDP1 } from "../lvmdp/LVMDP_1/lvmdp_1.repository";
import { findLatestLVMDP2 } from "../lvmdp/LVMDP_2/lvmdp_2.repository";
import { findLatestLVMDP3 } from "../lvmdp/LVMDP_3/lvmdp_3.repository";
import { findLatestLVMDP4 } from "../lvmdp/LVMDP_4/lvmdp_4.repository";

const r = Router();

// Peta fungsi repository per panel
const REPO_FUNCTIONS: Record<number, () => Promise<any>> = {
  1: findLatestLVMDP1,
  2: findLatestLVMDP2,
  3: findLatestLVMDP3,
  4: findLatestLVMDP4,
};

// GET /api/lvmdp/:id/latest
r.get("/:id/latest", async (req, res) => {
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
      cosPhi: row.cosPhi,
      freq: row.freq,
      avgLineLine: row.avgLineLine,
      avgLineNeut: row.avgLineNeut,
      avgCurrent: row.avgCurrent,
    });
  } catch (err) {
    console.error("GET /lvmdp/:id/latest error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: String(err) });
  }
});

export default r;
