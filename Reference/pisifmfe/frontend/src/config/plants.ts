export type PlantId = "CIKOKOL" | "SEMARANG" | "CIKUPA" | "AGRO";

export interface MachineConfig {
  id: string;
  label: string;
  route: string;
}

export interface PlantConfig {
  plantCode: number;
  name: string;
  electricalMode: "REAL" | "DUMMY";
  machines: MachineConfig[];
}

export const PLANT_CONFIG: Record<PlantId, PlantConfig> = {
  // ======================
  // 1402 - CIKOKOL
  // ======================
  CIKOKOL: {
    plantCode: 1402,
    name: "Plant Cikokol",
    electricalMode: "DUMMY",
    machines: [
      { id: "baked-corn-puff", label: "Baked Corn Puff", route: "production/baked-corn-puff" },
      { id: "pc14", label: "Potato Chips Line - PC14", route: "production/pc14" },
      { id: "cassava-inhouse", label: "Cassava Inhouse", route: "production/cassava-inhouse" },
      { id: "cassava-copack", label: "Cassava Copack", route: "production/copack" },
      { id: "tempe", label: "Tempe", route: "production/tempe" },
      { id: "batch-fryer", label: "Batch Fryer", route: "production/batch-fryer" },
      { id: "continuous-fryer", label: "Continuous Fryer", route: "production/continuous-fryer" },
    ],
  },

  // ======================
  // 1400 - AGRO
  // ======================
  AGRO: {
    plantCode: 1400,
    name: "Plant Agro",
    electricalMode: "DUMMY",
    machines: [
      { id: "baked-corn-puff", label: "Baked Corn Puff", route: "production/baked-corn-puff" },
      { id: "pc14", label: "Potato Chips Line - PC14", route: "production/pc14" },
      { id: "cassava-inhouse", label: "Cassava Inhouse", route: "production/cassava-inhouse" },
      { id: "cassava-copack", label: "Cassava Copack", route: "production/copack" },
      { id: "tempe", label: "Tempe", route: "production/tempe" },
      { id: "batch-fryer", label: "Batch Fryer", route: "production/batch-fryer" },
      { id: "continuous-fryer", label: "Continuous Fryer", route: "production/continuous-fryer" },
    ],
  },

  // ======================
  // 1403 - SEMARANG
  // ======================
  SEMARANG: {
    plantCode: 1403,
    name: "Plant Semarang",
    electricalMode: "DUMMY",
    machines: [
      { id: "pc14", label: "PC 14", route: "production/pc14" },
      { id: "pc32", label: "PC 32", route: "production/pc32" },
      { id: "cassava-inhouse", label: "Cassava Inhouse", route: "production/cassava-inhouse" },
      { id: "cassava-copack", label: "Cassava Copack", route: "production/copack" },
      { id: "tempe", label: "Tempe", route: "production/tempe" },
      { id: "tortila", label: "Tortila", route: "production/tortila" },
      { id: "fcp", label: "FCP", route: "production/fcp" },
      { id: "extrude-pellet", label: "Extrude Pellet", route: "production/extrude-pellet" },
      { id: "sheeted-e250", label: "Sheeted Pellet E250", route: "production/sheeted-e250" },
      { id: "sheeted-e500-1", label: "Sheeted Pellet E500 - 1", route: "production/sheeted-e500-1" },
      { id: "sheeted-e500-2", label: "Sheeted Pellet E500 - 2", route: "production/sheeted-e500-2" },
      { id: "batch-fryer", label: "Batch Fryer", route: "production/batch-fryer" },
      { id: "continuous-fryer", label: "Continuous Fryer", route: "production/continuous-fryer" },
    ],
  },

  // ======================
  // 1405 - CIKUPA
  // ======================
  CIKUPA: {
    plantCode: 1405,
    name: "Plant Cikupa",
    electricalMode: "REAL",
    machines: [
      { id: "pc14", label: "PC 14", route: "production/pc14" },
      { id: "pc39", label: "PC 39", route: "production/pc39" },
      { id: "cassava-inhouse", label: "Cassava Inhouse", route: "production/cassava-inhouse" },
      { id: "cassava-copack", label: "Cassava Copack", route: "production/copack" },
      { id: "tortila", label: "Tortila", route: "production/tortila" },
      { id: "fcp", label: "FCP", route: "production/fcp" },
      { id: "tws56", label: "TWS 5.6", route: "production/tws56" },
      { id: "tws72", label: "TWS 7.2", route: "production/tws72" },
      { id: "packing-pouch", label: "Packing Pouch (Promina Puff)", route: "production/packing-pouch" },
      { id: "vacuum-fryer", label: "Vacuum Fryer 1", route: "production/vacuum-fryer" },
    ],
  },
};
