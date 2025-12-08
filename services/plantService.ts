// services/plantService.ts

import { 
    PLANTS,
    CIKUPA_PACKING_LINES,
    CIKOKOL_PACKING_LINES,
    SEMARANG_PACKING_LINES
} from './mockData';
import { Plant, PlantCode, Machine, MachineType, MachineStatus } from '../types';

type DashboardPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
type DetailPeriod = 'Day' | 'Week' | 'Month' | 'Year';

// --- Private helper to find a machine and its plant ---
const findMachineAndPlant = (machineId: string): { machine: Machine, plant: Plant } | null => {
    for (const plant of Object.values(PLANTS)) {
        const machine = plant.machines.find(m => m.id === machineId);
        if (machine) {
            return { machine, plant };
        }
    }
    return null;
};


export const plantService = {
  getAllPlants: (): Plant[] => {
    return Object.values(PLANTS);
  },

  getPlantById: (plantId: string): Plant | undefined => {
    return PLANTS[plantId as PlantCode];
  },

  getMachineById: (machineId: string): Machine | undefined => {
    return findMachineAndPlant(machineId)?.machine;
  },

  // Production lines for Plant Dashboard
  getProductionLines: (plantId: string, period: DashboardPeriod) => {
    const plant = PLANTS[plantId as PlantCode];
    if (!plant) return [];

    const multiplier =
      period === 'DAY'
        ? 1
        : period === 'WEEK'
        ? 6.5
        : period === 'MONTH'
        ? 28
        : 340;

    return plant.machines.map((machine) => {
      const scaledOutput = machine.outputPerHour * 15 * multiplier;
      const scaledOEE = Math.min(
        0.99,
        machine.oee * (1 + (Math.random() * 0.04 - 0.02)),
      );

      return {
        ...machine,
        scaledOutput,
        scaledOEE,
      };
    });
  },

  // Calculate accumulated stats for Machine Detail based on period
  getMachineStats: (machineId: string, period: DetailPeriod) => {
      const machine = plantService.getMachineById(machineId);
      if (!machine) return null;

      const multiplier = period === 'Day' ? 1 : period === 'Week' ? 7 : period === 'Month' ? 30 : 365;
      
      const totalOutput = machine.totalOutputShift * multiplier;
      const rejectMass = (machine.totalOutputShift * (machine.rejectRate / 100)) * multiplier;
      
      const util = machine.utilityConsumption || { electricity: 0, steam: 0, water: 0, air: 0 };
      
      const hours = period === 'Day' ? 24 : period === 'Week' ? 168 : period === 'Month' ? 720 : 8760;

      return {
          totalOutput,
          rejectMass,
          rejectRate: machine.rejectRate,
          oee: machine.oee,
          utility: {
              electricity: util.electricity * hours,
              steam: util.steam * hours,
              water: util.water * hours,
              air: util.air * hours
          }
      };
  },

  // Mock time-series data for Detail View charts
  getMachineTimeSeries: (machineId: string, period: DetailPeriod) => {
    const machine = plantService.getMachineById(machineId);
    if (!machine) return { output: [], rejects: [], params: [], utility: { electricity: [], steam: [] } };

    let points = 24;
    let label = (i: number) => `${i}:00`;
    let varianceMult = 1;

    if (period === 'Week') {
        points = 7;
        label = (i: number) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
        varianceMult = 5;
    } else if (period === 'Month') {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        points = daysInMonth;
        label = (i: number) => `Day ${i + 1}`;
        varianceMult = 8;
    } else if (period === 'Year') {
        points = 12;
        label = (i: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
        varianceMult = 20;
    }

    const generate = (base: number, variance: number, isAccumulated: boolean = false) => {
        const effectiveBase = isAccumulated ? base * (period === 'Day' ? 1 : 24) : base;
        
        return Array.from({ length: points }, (_, i) => ({
            time: label(i),
            value: Number((effectiveBase + (Math.random() * variance * varianceMult * 2 - variance * varianceMult)).toFixed(1)),
        }));
    };
    
    const outputBase = period === 'Day' ? machine.outputPerHour : machine.outputPerHour * 24; 
    
    const outputData = generate(machine.outputPerHour, 100, true);
    const targetBase = period === 'Day' ? machine.outputPerHour : machine.outputPerHour * 24;
    outputData.forEach((d: any) => d.target = targetBase);

    const params = machine.processParams || {};
    const utility = machine.utilityConsumption || { electricity: 0, steam: 0 };

    return {
        output: outputData,
        rejects: generate(machine.rejectRate * 10, 15, false),
        params: Array.from({ length: points }, (_, i) => ({
            time: label(i),
            temp: (Number(params['Barrel Temp Zone 1'] || params['Oil Temp']) || 140) + Math.random() * 10,
            pressure: (Number(params['Die Pressure']) || 40) + Math.random() * 5,
            speed: (Number(params['Screw Speed'] || params['Conveyor Speed']) || 80) + Math.random() * 2
        })),
        utility: {
            electricity: generate(utility.electricity, 20, true),
            steam: generate(utility.steam, 50, true),
        }
    };
  },
  
  // --- CRUD Operations for Plants ---
  addPlant: (data: { id: PlantCode; name: string; location: string }): { success: boolean; message?: string } => {
    if (PLANTS[data.id]) {
        return { success: false, message: 'Plant with this ID already exists.' };
    }
    // Basic validation for ID format
    if (!/^[A-Z_]+$/.test(data.id)) {
        return { success: false, message: 'Plant ID must be uppercase letters and underscores only.' };
    }
    PLANTS[data.id] = {
        id: data.id,
        name: data.name,
        location: data.location,
        outputToday: 0,
        oeeAvg: 0.7,
        energyTotal: 0,
        activeAlarms: 0,
        machines: [],
        lvmdps: [],
        utilityBaseValues: {
            water: { baseConsumption: 100, costPerUnit: 12000 },
            gas: { baseConsumption: 200, costPerUnit: 4500 },
            steam: { baseConsumption: 5, costPerUnit: 250000 },
            air: { baseConsumption: 3000, costPerUnit: 150 },
            nitrogen: { baseConsumption: 100, costPerUnit: 2000 },
        },
    };
    return { success: true };
  },

  updatePlant: (plantId: PlantCode, data: { name: string, location: string }): { success: boolean, message?: string } => {
      const plant = PLANTS[plantId];
      if (!plant) {
          return { success: false, message: "Plant not found." };
      }
      plant.name = data.name;
      plant.location = data.location;
      return { success: true };
  },

  deletePlant: (plantId: PlantCode): { success: boolean; message?: string } => {
    if (!PLANTS[plantId]) {
        return { success: false, message: 'Plant not found.' };
    }
    if (Object.keys(PLANTS).length <= 1) {
        return { success: false, message: 'Cannot delete the last remaining plant.' };
    }
    delete PLANTS[plantId];
    return { success: true };
  },

  // --- CRUD Operations for Machines ---
  getAllMachines: (): Machine[] => {
      return Object.values(PLANTS).flatMap(plant => plant.machines);
  },

  addMachine: (data: { name: string, plantId: PlantCode }): { success: boolean, message?: string } => {
      const plant = PLANTS[data.plantId];
      if (!plant) {
          return { success: false, message: "Plant not found." };
      }
      const newIndex = plant.machines.length;
      const newMachine: Machine = {
          id: `${data.plantId}-M-${newIndex}-${Date.now()}`,
          code: data.name.replace(/\s+/g, '_').toUpperCase(),
          name: data.name,
          plantId: data.plantId,
          type: MachineType.GENERIC, // Default type
          status: MachineStatus.OFFLINE, // Default status
          outputPerHour: 0,
          oee: 0.75,
          temperature: 60,
          totalOutputShift: 0,
          targetShift: 8000,
          lineSpeed: 100,
          rejectRate: 0.5,
          availability: 0.9,
          performance: 0.85,
          quality: 0.98,
          processParams: { 'Default Param': 0 },
          utilityConsumption: { electricity: 100, steam: 0, water: 0, air: 150 },
      };
      plant.machines.push(newMachine);
      return { success: true };
  },

  updateMachine: (machineId: string, data: Partial<{ name: string }>): { success: boolean, message?: string } => {
      const result = findMachineAndPlant(machineId);
      if (!result) {
          return { success: false, message: "Machine not found." };
      }
      const { machine } = result;
      if (data.name) {
          machine.name = data.name;
          machine.code = data.name.replace(/\s+/g, '_').toUpperCase();
      }
      return { success: true };
  },

  deleteMachine: (machineId: string): { success: boolean, message?: string } => {
      const result = findMachineAndPlant(machineId);
      if (!result) {
          return { success: false, message: "Machine not found." };
      }
      const { machine, plant } = result;

      // --- NEW LOGIC ---
      // When a machine is deleted, also delete its corresponding packing config if it exists.
      let packingLinesArray;
      switch (plant.id) {
          case PlantCode.CIKUPA:
              packingLinesArray = CIKUPA_PACKING_LINES;
              break;
          case PlantCode.CIKOKOL:
              packingLinesArray = CIKOKOL_PACKING_LINES;
              break;
          case PlantCode.SEMARANG:
              packingLinesArray = SEMARANG_PACKING_LINES;
              break;
          default:
              packingLinesArray = undefined;
      }

      if (packingLinesArray) {
          const packingConfigIndex = packingLinesArray.findIndex(p => p.lineName === machine.name);
          if (packingConfigIndex > -1) {
              packingLinesArray.splice(packingConfigIndex, 1);
          }
      }
      // --- END NEW LOGIC ---

      plant.machines = plant.machines.filter(m => m.id !== machineId);
      return { success: true };
  }
};