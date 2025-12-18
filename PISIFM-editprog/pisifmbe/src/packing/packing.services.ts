// src/packing/packing.services.ts
import * as repo from "./packing.repository";

/* ===========================
   WEIGHER OPERATIONS
=========================== */

export const getAllWeigher = async (limit: number = 100) => {
  return await repo.findAllWeigher(limit);
};

export const getLatestWeigher = async () => {
  return await repo.findLatestWeigher();
};

export const createWeigherData = async (data: any) => {
  return await repo.insertWeigher(data);
};

/* ===========================
   BAGMAKER OPERATIONS
=========================== */

export const getAllBagMaker = async (limit: number = 100) => {
  return await repo.findAllBagMaker(limit);
};

export const getLatestBagMaker = async () => {
  return await repo.findLatestBagMaker();
};

export const createBagMakerData = async (data: any) => {
  return await repo.insertBagMaker(data);
};

/* ===========================
   ANALYTICS & CALCULATIONS
=========================== */

// Calculate efficiency untuk packing line
export const calculateEfficiency = (actual: number, target: number): number => {
  if (target === 0) return 0;
  return (actual / target) * 100;
};

// Get summary for both weigher and bagmaker
export const getPackingSummary = async () => {
  const weigher = await repo.findLatestWeigher();
  const bagmaker = await repo.findLatestBagMaker();

  return {
    weigher: weigher || {
      targetPacks: 0,
      actualPacks: 0,
      rejectCount: 0,
      efficiency: 0,
      status: "idle",
    },
    bagmaker: bagmaker || {
      targetBags: 0,
      actualBags: 0,
      defectBags: 0,
      efficiency: 0,
      status: "idle",
    },
  };
};

// Get shift summary untuk packing
export const getShiftSummary = async (date?: string) => {
  // TODO: Implement shift-based calculation
  // For now, return dummy data
  return {
    shift1: {
      weigher: { targetPacks: 5000, actualPacks: 4800, rejectCount: 50 },
      bagmaker: { targetBags: 5000, actualBags: 4850, defectBags: 30 },
    },
    shift2: {
      weigher: { targetPacks: 5000, actualPacks: 4900, rejectCount: 40 },
      bagmaker: { targetBags: 5000, actualBags: 4900, defectBags: 25 },
    },
    shift3: {
      weigher: { targetPacks: 5000, actualPacks: 4700, rejectCount: 60 },
      bagmaker: { targetBags: 5000, actualBags: 4750, defectBags: 40 },
    },
  };
};
