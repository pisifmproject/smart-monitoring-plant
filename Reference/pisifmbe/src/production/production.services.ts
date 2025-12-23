// src/production/production.services.ts
import * as repo from "./production.repository";

/* ===========================
   BASIC READ OPERATIONS
=========================== */

export const getAllProduction = async (limit: number = 100) => {
  return await repo.findAllProduction(limit);
};

export const getLatestProduction = async () => {
  return await repo.findLatestProduction();
};

export const getProductionByDateRange = async (
  startDate: Date,
  endDate: Date
) => {
  return await repo.findProductionByDateRange(startDate, endDate);
};

/* ===========================
   CALCULATIONS & ANALYTICS
=========================== */

// Calculate OEE (Overall Equipment Effectiveness)
export const calculateOEE = (
  availability: number,
  performance: number,
  quality: number
): number => {
  return (availability * performance * quality) / 10000; // Convert from percentage
};

// Calculate shift summary untuk production
export const getShiftSummary = async (date?: string) => {
  // TODO: Implement shift-based calculation similar to LVMDP
  // For now, return dummy data
  const targetDate = date ? new Date(date) : new Date();

  return {
    shift1: {
      targetProduction: 1000,
      actualProduction: 950,
      defectCount: 10,
      oee: 92.5,
    },
    shift2: {
      targetProduction: 1000,
      actualProduction: 980,
      defectCount: 5,
      oee: 95.0,
    },
    shift3: {
      targetProduction: 1000,
      actualProduction: 920,
      defectCount: 15,
      oee: 89.0,
    },
  };
};

/* ===========================
   WRITE OPERATIONS
=========================== */

export const createProductionData = async (data: any) => {
  return await repo.insertProduction(data);
};
