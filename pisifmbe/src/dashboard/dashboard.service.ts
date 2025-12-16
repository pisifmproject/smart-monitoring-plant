// src/dashboard/dashboard.service.ts
import { db } from "../db";
import { sql } from "drizzle-orm";

type Period = "DAY" | "WEEK" | "MONTH" | "YEAR";

// Helper untuk plant data (hanya Cikupa yang real dari LVMDP)
const PLANTS_DATA = {
  CIKOKOL: {
    id: "CIKOKOL",
    name: "Plant Cikokol",
    location: "TANGERANG",
    outputToday: 15000,
    energyTotal: 3200,
    oeeAvg: 0.82,
  },
  SEMARANG: {
    id: "SEMARANG",
    name: "Plant Semarang",
    location: "CENTRAL JAVA",
    outputToday: 18000,
    energyTotal: 4100,
    oeeAvg: 0.78,
  },
  CIKUPA: {
    id: "CIKUPA",
    name: "Plant Cikupa",
    location: "TANGERANG",
    outputToday: 0, // Will be calculated from real LVMDP data
    energyTotal: 0, // Will be calculated from real LVMDP data
    oeeAvg: 0, // Will be calculated from real LVMDP data
  },
  AGRO: {
    id: "AGRO",
    name: "Plant Agro",
    location: "DEVELOPMENT",
    outputToday: 0,
    energyTotal: 500,
    oeeAvg: 0.7,
  },
};

export const getGlobalKPIs = async (period: Period) => {
  const multiplier =
    period === "DAY"
      ? 1
      : period === "WEEK"
      ? 6.5
      : period === "MONTH"
      ? 28
      : 340;

  // Get real data from LVMDP Cikupa (today's data)
  try {
    const lvmdpData = await db.execute(sql`
      SELECT 
        COALESCE(SUM(kwh), 0) as total_energy,
        COUNT(*) as record_count
      FROM (
        SELECT kwh FROM lvmdp_1 WHERE DATE(waktu) = CURRENT_DATE
        UNION ALL
        SELECT kwh FROM lvmdp_2 WHERE DATE(waktu) = CURRENT_DATE
        UNION ALL
        SELECT kwh FROM lvmdp_3 WHERE DATE(waktu) = CURRENT_DATE
        UNION ALL
        SELECT kwh FROM lvmdp_4 WHERE DATE(waktu) = CURRENT_DATE
      ) as combined
    `);

    const cikupaEnergy = Number(lvmdpData.rows[0]?.total_energy || 0);

    // Estimate production based on energy (rough approximation)
    // Assume 0.2 kWh per kg production
    const cikupaOutput = cikupaEnergy > 0 ? cikupaEnergy / 0.2 : 12000;
    const cikupaOEE = cikupaEnergy > 0 ? 0.85 : 0.75;

    PLANTS_DATA.CIKUPA.energyTotal = cikupaEnergy;
    PLANTS_DATA.CIKUPA.outputToday = cikupaOutput;
    PLANTS_DATA.CIKUPA.oeeAvg = cikupaOEE;
  } catch (error) {
    console.error("Error fetching LVMDP data:", error);
    // Use fallback dummy data
    PLANTS_DATA.CIKUPA.energyTotal = 3800;
    PLANTS_DATA.CIKUPA.outputToday = 15600;
    PLANTS_DATA.CIKUPA.oeeAvg = 0.85;
  }

  const plants = Object.values(PLANTS_DATA);
  const totalOutput =
    plants.reduce((acc, p) => acc + p.outputToday, 0) * multiplier;
  const totalEnergy =
    plants.reduce((acc, p) => acc + p.energyTotal, 0) * multiplier;

  const baseAvgOEE =
    (plants.reduce((acc, p) => acc + p.oeeAvg, 0) /
      plants.filter((p) => p.oeeAvg > 0).length) *
    100;

  const avgOEE = Math.min(
    99.9,
    baseAvgOEE * (1 + (period === "DAY" ? 0 : Math.random() * 0.05 - 0.025))
  );

  // Mock alarm count
  const activeAlarmsCount = Math.floor(Math.random() * 10) + 3;
  const totalAlarmsValue =
    period === "DAY"
      ? activeAlarmsCount
      : Math.floor(activeAlarmsCount * multiplier * 0.8) + 5;

  return {
    totalOutput,
    totalEnergy,
    avgOEE,
    totalAlarmsValue,
  };
};

export const getPlantOverview = async (period: Period) => {
  const multiplier =
    period === "DAY"
      ? 1
      : period === "WEEK"
      ? 6.5
      : period === "MONTH"
      ? 28
      : 340;

  // Fetch real LVMDP data for Cikupa
  try {
    const lvmdpData = await db.execute(sql`
      SELECT 
        COALESCE(SUM(kwh), 0) as total_energy,
        COUNT(*) as record_count
      FROM (
        SELECT kwh FROM lvmdp_1 WHERE DATE(waktu) = CURRENT_DATE
        UNION ALL
        SELECT kwh FROM lvmdp_2 WHERE DATE(waktu) = CURRENT_DATE
        UNION ALL
        SELECT kwh FROM lvmdp_3 WHERE DATE(waktu) = CURRENT_DATE
        UNION ALL
        SELECT kwh FROM lvmdp_4 WHERE DATE(waktu) = CURRENT_DATE
      ) as combined
    `);

    const cikupaEnergy = Number(lvmdpData.rows[0]?.total_energy || 0);
    const cikupaOutput = cikupaEnergy > 0 ? cikupaEnergy / 0.2 : 12000;
    const cikupaOEE = cikupaEnergy > 0 ? 0.85 : 0.75;

    PLANTS_DATA.CIKUPA.energyTotal = cikupaEnergy;
    PLANTS_DATA.CIKUPA.outputToday = cikupaOutput;
    PLANTS_DATA.CIKUPA.oeeAvg = cikupaOEE;
  } catch (error) {
    console.error("Error fetching LVMDP data:", error);
    PLANTS_DATA.CIKUPA.energyTotal = 3800;
    PLANTS_DATA.CIKUPA.outputToday = 15600;
    PLANTS_DATA.CIKUPA.oeeAvg = 0.85;
  }

  const plants = Object.values(PLANTS_DATA);

  return plants.map((plant) => {
    // Mock alarm calculation
    const alarmCount = Math.floor(Math.random() * 5);
    let status = "NORMAL";
    if (alarmCount > 3 || plant.oeeAvg < 0.5) status = "CRITICAL";
    else if (alarmCount > 0 || plant.oeeAvg < 0.7) status = "WARNING";

    return {
      id: plant.id,
      name: plant.name,
      location: plant.location,
      output: Math.round(plant.outputToday * multiplier),
      energy: Math.round(plant.energyTotal * multiplier),
      oee: parseFloat(
        (plant.oeeAvg * 100 * (1 + (Math.random() * 0.02 - 0.01))).toFixed(2)
      ),
      alarms: alarmCount,
      status: status,
    };
  });
};

export const getPlantDashboard = async (plantId: string, period: Period) => {
  const plant = PLANTS_DATA[plantId.toUpperCase() as keyof typeof PLANTS_DATA];
  if (!plant) {
    return null;
  }

  const multiplier =
    period === "DAY"
      ? 1
      : period === "WEEK"
      ? 6.5
      : period === "MONTH"
      ? 28
      : 340;

  // Get real LVMDP data for Cikupa
  if (plantId.toUpperCase() === "CIKUPA") {
    try {
      const lvmdpData = await db.execute(sql`
        SELECT 
          COALESCE(SUM(kwh), 0) as total_energy
        FROM (
          SELECT kwh FROM lvmdp_1 WHERE DATE(waktu) = CURRENT_DATE
          UNION ALL
          SELECT kwh FROM lvmdp_2 WHERE DATE(waktu) = CURRENT_DATE
          UNION ALL
          SELECT kwh FROM lvmdp_3 WHERE DATE(waktu) = CURRENT_DATE
          UNION ALL
          SELECT kwh FROM lvmdp_4 WHERE DATE(waktu) = CURRENT_DATE
        ) as combined
      `);

      const cikupaEnergy = Number(lvmdpData.rows[0]?.total_energy || 0);
      plant.energyTotal = cikupaEnergy;
      plant.outputToday = cikupaEnergy > 0 ? cikupaEnergy / 0.2 : 12000;
      plant.oeeAvg = cikupaEnergy > 0 ? 0.85 : 0.75;
    } catch (error) {
      console.error("Error fetching LVMDP data:", error);
    }
  }

  const kpis = {
    totalOutput: plant.outputToday * multiplier,
    avgOEE: plant.oeeAvg * 100,
    totalEnergy: plant.energyTotal * multiplier,
    totalAlarmsValue: Math.floor(Math.random() * 5) + 2,
  };

  const utilityMetrics = [
    { type: "Electricity", value: plant.energyTotal * multiplier, unit: "kWh" },
    { type: "Steam", value: Math.floor(Math.random() * 50) + 10, unit: "ton" },
    {
      type: "Water",
      value: Math.floor(Math.random() * 1000) + 300,
      unit: "m³",
    },
    {
      type: "Compressed Air",
      value: Math.floor(Math.random() * 30000) + 10000,
      unit: "m³",
    },
    {
      type: "Nitrogen",
      value: Math.floor(Math.random() * 1000) + 300,
      unit: "m³",
    },
    {
      type: "Natural Gas",
      value: Math.floor(Math.random() * 2000) + 500,
      unit: "m³",
    },
  ];

  const shifts = [
    {
      name: "Shift 1",
      time: "07:01 - 14:38",
      output: Math.floor(plant.outputToday * 0.35),
      oee: 86.7,
      status: "COMPLETED",
    },
    {
      name: "Shift 2",
      time: "14:11 - 22:08",
      output: Math.floor(plant.outputToday * 0.4),
      oee: 85.0,
      status: "ACTIVE",
    },
    {
      name: "Shift 3",
      time: "22:01 - 07:08",
      output: 0,
      oee: 0,
      status: "UPCOMING",
    },
  ];

  const activeAlarms = [
    {
      id: "1",
      title: "Overcurrent Phase R",
      source: "LVMDP-2 • Panel Cikupa",
      severity: "WARNING",
    },
    {
      id: "2",
      title: "Sealer Temp Low",
      source: "PC14 • Packing Plant Cikupa",
      severity: "WARNING",
    },
  ];

  const productionLines = [
    {
      id: "pc39",
      name: "PC39",
      output: Math.floor(plant.outputToday * 0.15),
      oee: 83.0,
      status: "RUNNING",
    },
    {
      id: "pc14",
      name: "PC14",
      output: Math.floor(plant.outputToday * 0.2),
      oee: 78.8,
      status: "RUNNING",
    },
    {
      id: "tortila",
      name: "Tortila",
      output: Math.floor(plant.outputToday * 0.18),
      oee: 88.1,
      status: "RUNNING",
    },
    {
      id: "tws56",
      name: "TWS 5.6",
      output: Math.floor(plant.outputToday * 0.17),
      oee: 87.4,
      status: "RUNNING",
    },
  ];

  // Get LVMDP panel data for Cikupa (real), dummy for others
  let lvmdpPanels = [];
  if (plantId.toUpperCase() === "CIKUPA") {
    try {
      // Fetch latest reading from each LVMDP panel
      const panel1 = await db.execute(sql`
        SELECT voltage_r, current_r, power, kwh 
        FROM lvmdp_1 
        WHERE DATE(waktu) = CURRENT_DATE 
        ORDER BY waktu DESC 
        LIMIT 1
      `);
      const panel2 = await db.execute(sql`
        SELECT voltage_r, current_r, power, kwh 
        FROM lvmdp_2 
        WHERE DATE(waktu) = CURRENT_DATE 
        ORDER BY waktu DESC 
        LIMIT 1
      `);
      const panel3 = await db.execute(sql`
        SELECT voltage_r, current_r, power, kwh 
        FROM lvmdp_3 
        WHERE DATE(waktu) = CURRENT_DATE 
        ORDER BY waktu DESC 
        LIMIT 1
      `);
      const panel4 = await db.execute(sql`
        SELECT voltage_r, current_r, power, kwh 
        FROM lvmdp_4 
        WHERE DATE(waktu) = CURRENT_DATE 
        ORDER BY waktu DESC 
        LIMIT 1
      `);

      lvmdpPanels = [
        {
          panelName: "LVMDP 1",
          voltage: parseFloat(panel1.rows[0]?.voltage_r || "0"),
          current: parseFloat(panel1.rows[0]?.current_r || "0"),
          power: parseFloat(panel1.rows[0]?.power || "0"),
          totalKwh: parseFloat(panel1.rows[0]?.kwh || "0"),
        },
        {
          panelName: "LVMDP 2",
          voltage: parseFloat(panel2.rows[0]?.voltage_r || "0"),
          current: parseFloat(panel2.rows[0]?.current_r || "0"),
          power: parseFloat(panel2.rows[0]?.power || "0"),
          totalKwh: parseFloat(panel2.rows[0]?.kwh || "0"),
        },
        {
          panelName: "LVMDP 3",
          voltage: parseFloat(panel3.rows[0]?.voltage_r || "0"),
          current: parseFloat(panel3.rows[0]?.current_r || "0"),
          power: parseFloat(panel3.rows[0]?.power || "0"),
          totalKwh: parseFloat(panel3.rows[0]?.kwh || "0"),
        },
        {
          panelName: "LVMDP 4",
          voltage: parseFloat(panel4.rows[0]?.voltage_r || "0"),
          current: parseFloat(panel4.rows[0]?.current_r || "0"),
          power: parseFloat(panel4.rows[0]?.power || "0"),
          totalKwh: parseFloat(panel4.rows[0]?.kwh || "0"),
        },
      ];
    } catch (error) {
      console.error("Error fetching LVMDP panel data:", error);
      // Fallback to dummy if query fails
      lvmdpPanels = generateDummyLVMDPPanels();
    }
  } else {
    // Dummy data for other plants
    lvmdpPanels = generateDummyLVMDPPanels();
  }

  return {
    plant,
    kpis,
    utilityMetrics,
    shifts,
    activeAlarms,
    productionLines,
    lvmdpPanels,
  };
};

// Helper function to generate dummy LVMDP panel data
const generateDummyLVMDPPanels = () => {
  return [
    {
      panelName: "LVMDP 1",
      voltage: 385 + Math.random() * 10,
      current: 120 + Math.random() * 20,
      power: 78 + Math.random() * 15,
      totalKwh: 2800 + Math.random() * 400,
    },
    {
      panelName: "LVMDP 2",
      voltage: 380 + Math.random() * 10,
      current: 110 + Math.random() * 20,
      power: 72 + Math.random() * 15,
      totalKwh: 2600 + Math.random() * 400,
    },
    {
      panelName: "LVMDP 3",
      voltage: 390 + Math.random() * 10,
      current: 130 + Math.random() * 20,
      power: 85 + Math.random() * 15,
      totalKwh: 3100 + Math.random() * 400,
    },
    {
      panelName: "LVMDP 4",
      voltage: 383 + Math.random() * 10,
      current: 115 + Math.random() * 20,
      power: 75 + Math.random() * 15,
      totalKwh: 2700 + Math.random() * 400,
    },
  ];
};
