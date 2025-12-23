// Summary controller untuk electrical dashboard
import { Router, Request, Response } from "express";
import { db } from "../db";
import { sql } from "drizzle-orm";

const router = Router();

/**
 * GET /api/summary/electrical
 * Get real-time summary data from all LVMDP panels
 */
router.get("/electrical", async (req: Request, res: Response) => {
  try {
    // Get latest data from each LVMDP view
    const [lvmdp1, lvmdp2, lvmdp3, lvmdp4] = await Promise.all([
      db.execute(
        sql`SELECT 
          real_power,
          avg_line_line,
          avg_current,
          cos_phi,
          waktu
        FROM v_lvmdp_1 
        ORDER BY waktu DESC 
        LIMIT 1`
      ),
      db.execute(
        sql`SELECT 
          real_power,
          avg_line_line,
          avg_current,
          cos_phi,
          waktu
        FROM v_lvmdp_2 
        ORDER BY waktu DESC 
        LIMIT 1`
      ),
      db.execute(
        sql`SELECT 
          real_power,
          avg_line_line,
          avg_current,
          cos_phi,
          waktu
        FROM v_lvmdp_3 
        ORDER BY waktu DESC 
        LIMIT 1`
      ),
      db.execute(
        sql`SELECT 
          real_power,
          avg_line_line,
          avg_current,
          cos_phi,
          waktu
        FROM v_lvmdp_4 
        ORDER BY waktu DESC 
        LIMIT 1`
      ),
    ]);

    // Extract data
    const panel1 = lvmdp1.rows[0] as any;
    const panel2 = lvmdp2.rows[0] as any;
    const panel3 = lvmdp3.rows[0] as any;
    const panel4 = lvmdp4.rows[0] as any;

    // Calculate kVA for each panel: kVA = kW / cos_phi
    const calculateKVA = (realPower: number, cosPhi: number) => {
      if (!cosPhi || cosPhi === 0) return 0;
      return realPower / cosPhi;
    };

    const kva1 = panel1
      ? calculateKVA(Number(panel1.real_power), Number(panel1.cos_phi))
      : 0;
    const kva2 = panel2
      ? calculateKVA(Number(panel2.real_power), Number(panel2.cos_phi))
      : 0;
    const kva3 = panel3
      ? calculateKVA(Number(panel3.real_power), Number(panel3.cos_phi))
      : 0;
    const kva4 = panel4
      ? calculateKVA(Number(panel4.real_power), Number(panel4.cos_phi))
      : 0;

    const totalKVA = kva1 + kva2 + kva3 + kva4;
    const installedCapacity = 5540; // kVA
    const loadPercentage = (totalKVA / installedCapacity) * 100;

    // Get most recent timestamp
    const timestamps = [
      panel1?.waktu,
      panel2?.waktu,
      panel3?.waktu,
      panel4?.waktu,
    ].filter(Boolean);

    const lastUpdated =
      timestamps.length > 0
        ? new Date(Math.max(...timestamps.map((t) => new Date(t).getTime())))
        : new Date();

    res.json({
      success: true,
      data: {
        totalKVA: Number(totalKVA.toFixed(2)),
        installedCapacity,
        loadPercentage: Number(loadPercentage.toFixed(2)),
        lastUpdated,
        panels: [
          {
            id: 1,
            name: "LVMDP 1",
            realPower: panel1 ? Number(panel1.real_power) : 0,
            voltage: panel1 ? Number(panel1.avg_line_line) : 0,
            current: panel1 ? Number(panel1.avg_current) : 0,
            cosPhi: panel1 ? Number(panel1.cos_phi) : 0,
            kva: Number(kva1.toFixed(2)),
            status: panel1 ? "online" : "offline",
            waktu: panel1?.waktu || null,
          },
          {
            id: 2,
            name: "LVMDP 2",
            realPower: panel2 ? Number(panel2.real_power) : 0,
            voltage: panel2 ? Number(panel2.avg_line_line) : 0,
            current: panel2 ? Number(panel2.avg_current) : 0,
            cosPhi: panel2 ? Number(panel2.cos_phi) : 0,
            kva: Number(kva2.toFixed(2)),
            status: panel2 ? "online" : "offline",
            waktu: panel2?.waktu || null,
          },
          {
            id: 3,
            name: "LVMDP 3",
            realPower: panel3 ? Number(panel3.real_power) : 0,
            voltage: panel3 ? Number(panel3.avg_line_line) : 0,
            current: panel3 ? Number(panel3.avg_current) : 0,
            cosPhi: panel3 ? Number(panel3.cos_phi) : 0,
            kva: Number(kva3.toFixed(2)),
            status: panel3 ? "online" : "offline",
            waktu: panel3?.waktu || null,
          },
          {
            id: 4,
            name: "LVMDP 4",
            realPower: panel4 ? Number(panel4.real_power) : 0,
            voltage: panel4 ? Number(panel4.avg_line_line) : 0,
            current: panel4 ? Number(panel4.avg_current) : 0,
            cosPhi: panel4 ? Number(panel4.cos_phi) : 0,
            kva: Number(kva4.toFixed(2)),
            status: panel4 ? "online" : "offline",
            waktu: panel4?.waktu || null,
          },
        ],
      },
    });
  } catch (error: any) {
    console.error("[SUMMARY] Error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Failed to get summary data",
    });
  }
});

export default router;
