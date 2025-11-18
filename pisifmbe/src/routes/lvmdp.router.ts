// src/routes/lvmdp.router.ts
import { Router } from "express";
import { db } from "../db";
import { lvmdp1, lvmdp2, lvmdp3, lvmdp4 } from "../db/schema";
import { desc } from "drizzle-orm";

const r = Router();

// Peta table per panel → pakai number biar aman
const TABLES: Record<number, any> = {
  1: lvmdp1,
  2: lvmdp2,
  3: lvmdp3,
  4: lvmdp4,
};

// GET /api/lvmdp/:id/latest
r.get("/:id/latest", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (![1, 2, 3, 4].includes(id)) {
      return res.status(400).json({ message: "Bad id (must be 1..4)" });
    }

    const table = TABLES[id];
    if (!table) {
      return res.status(500).json({ message: "Table not found in schema" });
    }

    const [row] = await db
      .select()
      .from(table)
      .orderBy(desc(table.waktu))
      .limit(1);

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
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default r;
