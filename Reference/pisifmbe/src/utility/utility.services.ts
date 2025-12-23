// src/utility/utility.services.ts

export type UtilityType =
  | "electricity"
  | "freshWater"
  | "wasteWater"
  | "naturalGas"
  | "fuelOil"
  | "steam"
  | "air"
  | "nitrogen";

export type TimePeriod = "daily" | "monthly";
export type TrendRange = "7days" | "30days" | "12months";

interface UtilityConsumption {
  machineId: string;
  utilityType: UtilityType;
  current: number;
  target: number;
  previous: number; // yesterday for daily, last month for monthly
  unit: string;
  timestamp: Date;
}

interface UtilityTrendData {
  date: string;
  value: number;
  target?: number;
}

interface UtilitySummary {
  [key: string]: {
    current: number;
    target: number;
    unit: string;
  };
}

/**
 * Get utility consumption data for a specific machine and type
 * TODO: Replace mock data with actual database queries
 */
export async function getUtilityConsumption(
  machineId: string,
  utilityType: string,
  period: string = "daily",
  date?: string
): Promise<{
  daily: { current: number; target: number; yesterday: number };
  monthly: { current: number; target: number; lastMonth: number };
  unit: string;
}> {
  // Mock data - Replace with actual DB query
  const units: Record<UtilityType, string> = {
    electricity: "kWh",
    freshWater: "m³",
    wasteWater: "m³",
    naturalGas: "m³",
    fuelOil: "Liter",
    steam: "kg",
    air: "m³",
    nitrogen: "m³",
  };

  const unit = units[utilityType as UtilityType] || "unit";

  // Generate realistic mock data based on machine and utility type
  const baseValue = getBaseValueForUtility(
    machineId,
    utilityType as UtilityType
  );

  return {
    daily: {
      current: baseValue * (0.8 + Math.random() * 0.3),
      target: baseValue,
      yesterday: baseValue * (0.75 + Math.random() * 0.3),
    },
    monthly: {
      current: baseValue * 25 * (0.8 + Math.random() * 0.3),
      target: baseValue * 30,
      lastMonth: baseValue * 28 * (0.75 + Math.random() * 0.3),
    },
    unit,
  };
}

/**
 * Get historical trend data for charts
 * TODO: Replace mock data with actual database queries
 */
export async function getUtilityTrend(
  machineId: string,
  utilityType: string,
  range: string = "7days"
): Promise<UtilityTrendData[]> {
  // Mock data - Replace with actual DB query
  const days =
    range === "7days"
      ? 7
      : range === "30days"
      ? 30
      : range === "12months"
      ? 12
      : 7;
  const baseValue = getBaseValueForUtility(
    machineId,
    utilityType as UtilityType
  );

  const data: UtilityTrendData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      value: baseValue * (0.7 + Math.random() * 0.4),
      target: baseValue,
    });
  }

  return data;
}

/**
 * Get summary of all utility types for a machine
 * TODO: Replace mock data with actual database queries
 */
export async function getUtilitySummary(
  machineId: string,
  date?: string
): Promise<UtilitySummary> {
  // Mock data - Replace with actual DB query
  const utilityTypes: UtilityType[] = [
    "electricity",
    "freshWater",
    "wasteWater",
    "naturalGas",
    "fuelOil",
    "steam",
    "air",
    "nitrogen",
  ];

  const summary: UtilitySummary = {};

  for (const type of utilityTypes) {
    const baseValue = getBaseValueForUtility(machineId, type);
    const units: Record<UtilityType, string> = {
      electricity: "kWh",
      freshWater: "m³",
      wasteWater: "m³",
      naturalGas: "m³",
      fuelOil: "Liter",
      steam: "kg",
      air: "m³",
      nitrogen: "m³",
    };

    summary[type] = {
      current: baseValue * (0.8 + Math.random() * 0.3),
      target: baseValue,
      unit: units[type],
    };
  }

  return summary;
}

/**
 * Record utility consumption data
 * TODO: Implement database insert
 */
export async function recordUtilityConsumption(data: {
  machineId: string;
  utilityType: UtilityType;
  value: number;
  timestamp?: Date;
}): Promise<{ success: boolean; message: string }> {
  // TODO: Insert into database
  // const result = await db.insert(utilityConsumption).values({
  //   machineId: data.machineId,
  //   utilityType: data.utilityType,
  //   value: data.value,
  //   timestamp: data.timestamp || new Date(),
  // });

  return {
    success: true,
    message: "Utility consumption recorded successfully",
  };
}

/**
 * Helper function to get base values for different machines and utilities
 * This provides realistic mock data until database is ready
 */
function getBaseValueForUtility(
  machineId: string,
  utilityType: UtilityType
): number {
  // Base consumption values per day (adjust based on machine size/type)
  const baseValues: Record<string, Record<UtilityType, number>> = {
    pc14: {
      electricity: 1500,
      freshWater: 50,
      wasteWater: 45,
      naturalGas: 30,
      fuelOil: 20,
      steam: 100,
      air: 200,
      nitrogen: 15,
    },
    pc39: {
      electricity: 1600,
      freshWater: 55,
      wasteWater: 50,
      naturalGas: 35,
      fuelOil: 22,
      steam: 110,
      air: 220,
      nitrogen: 18,
    },
    cassavaInhouse: {
      electricity: 1200,
      freshWater: 60,
      wasteWater: 55,
      naturalGas: 25,
      fuelOil: 15,
      steam: 80,
      air: 150,
      nitrogen: 10,
    },
    copack: {
      electricity: 1400,
      freshWater: 48,
      wasteWater: 43,
      naturalGas: 28,
      fuelOil: 18,
      steam: 95,
      air: 180,
      nitrogen: 12,
    },
    tortila: {
      electricity: 1100,
      freshWater: 45,
      wasteWater: 40,
      naturalGas: 22,
      fuelOil: 14,
      steam: 75,
      air: 140,
      nitrogen: 8,
    },
    fcp: {
      electricity: 1350,
      freshWater: 52,
      wasteWater: 47,
      naturalGas: 30,
      fuelOil: 19,
      steam: 90,
      air: 170,
      nitrogen: 13,
    },
    tws56: {
      electricity: 1250,
      freshWater: 50,
      wasteWater: 45,
      naturalGas: 27,
      fuelOil: 17,
      steam: 85,
      air: 160,
      nitrogen: 11,
    },
    tws72: {
      electricity: 1450,
      freshWater: 53,
      wasteWater: 48,
      naturalGas: 32,
      fuelOil: 21,
      steam: 100,
      air: 190,
      nitrogen: 14,
    },
    packingPouch: {
      electricity: 900,
      freshWater: 35,
      wasteWater: 30,
      naturalGas: 15,
      fuelOil: 10,
      steam: 60,
      air: 120,
      nitrogen: 7,
    },
    vacuumFryer: {
      electricity: 1800,
      freshWater: 65,
      wasteWater: 60,
      naturalGas: 40,
      fuelOil: 25,
      steam: 120,
      air: 200,
      nitrogen: 20,
    },
  };

  // Default fallback values
  const defaultValues: Record<UtilityType, number> = {
    electricity: 1300,
    freshWater: 50,
    wasteWater: 45,
    naturalGas: 28,
    fuelOil: 18,
    steam: 90,
    air: 170,
    nitrogen: 12,
  };

  return baseValues[machineId]?.[utilityType] || defaultValues[utilityType];
}
