// src/dashboard/dashboard.controller.ts
import express from "express";
import {
  getGlobalKPIs,
  getPlantOverview,
  getPlantDashboard,
} from "./dashboard.service";

const router = express.Router();

// GET /api/dashboard/global?period=DAY|WEEK|MONTH|YEAR
router.get("/global", async (req, res) => {
  try {
    const period = (req.query.period as string) || "DAY";

    if (!["DAY", "WEEK", "MONTH", "YEAR"].includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Invalid period. Must be DAY, WEEK, MONTH, or YEAR",
      });
    }

    const kpis = await getGlobalKPIs(period as any);
    const plants = await getPlantOverview(period as any);

    res.json({
      success: true,
      kpis,
      plants,
    });
  } catch (error) {
    console.error("Error in global dashboard endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/dashboard/plant/:plantId?period=DAY|WEEK|MONTH|YEAR
router.get("/plant/:plantId", async (req, res) => {
  try {
    const { plantId } = req.params;
    const period = (req.query.period as string) || "DAY";

    if (!["DAY", "WEEK", "MONTH", "YEAR"].includes(period)) {
      return res.status(400).json({
        success: false,
        message: "Invalid period. Must be DAY, WEEK, MONTH, or YEAR",
      });
    }

    const plantData = await getPlantDashboard(plantId, period as any);

    if (!plantData) {
      return res.status(404).json({
        success: false,
        message: "Plant not found",
      });
    }

    res.json({
      success: true,
      ...plantData,
    });
  } catch (error) {
    console.error("Error in plant dashboard endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
