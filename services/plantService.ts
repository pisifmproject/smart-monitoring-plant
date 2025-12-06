
// services/plantService.ts

import { PLANTS, getMachineById } from './mockData';
import { Plant, PlantCode, Machine } from '../types';

type DashboardPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export const plantService = {
  getAllPlants: (): Plant[] => {
    return Object.values(PLANTS);
  },

  getPlantById: (plantId: string): Plant | undefined => {
    return PLANTS[plantId as PlantCode];
  },

  getMachineById: (machineId: string): Machine | undefined => {
    return getMachineById(machineId);
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

  // Mock time-series data for Detail View charts
  getMachineTimeSeries: (machineId: string) => {
    const machine = getMachineById(machineId);
    if (!machine) return { output: [], rejects: [], params: [], utility: { electricity: [], steam: [] } };

    const generate = (base: number, variance: number, points = 16) => 
        Array.from({ length: points }, (_, i) => ({
            time: `${8 + Math.floor(i / 2)}:${(i % 2) * 30 || '00'}`,
            value: Number((base + (Math.random() * variance * 2 - variance)).toFixed(1)),
        }));
    
    const outputData = generate(machine.outputPerHour, 100);
    // Explicitly add target property
    outputData.forEach((d: any) => d.target = machine.outputPerHour);

    const params = machine.processParams || {};
    const utility = machine.utilityConsumption || { electricity: 0, steam: 0 };

    return {
        output: outputData,
        rejects: generate(machine.rejectRate * 10, 15),
        params: Array.from({ length: 16 }, (_, i) => ({
            time: `${8 + Math.floor(i / 2)}:${(i % 2) * 30 || '00'}`,
            temp: (Number(params['Barrel Temp Zone 1'] || params['Oil Temp']) || 140) + Math.random() * 10,
            pressure: (Number(params['Die Pressure']) || 40) + Math.random() * 5,
            speed: (Number(params['Screw Speed'] || params['Conveyor Speed']) || 80) + Math.random() * 2
        })),
        utility: {
            electricity: generate(utility.electricity, 20, 24),
            steam: generate(utility.steam, 50, 24),
        }
    };
  }
};
