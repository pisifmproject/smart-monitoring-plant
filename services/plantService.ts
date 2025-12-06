
// services/plantService.ts

import { PLANTS, getMachineById } from './mockData';
import { Plant, PlantCode, Machine } from '../types';

type DashboardPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
type DetailPeriod = 'Day' | 'Week' | 'Month' | 'Year';

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

  // Calculate accumulated stats for Machine Detail based on period
  getMachineStats: (machineId: string, period: DetailPeriod) => {
      const machine = getMachineById(machineId);
      if (!machine) return null;

      const multiplier = period === 'Day' ? 1 : period === 'Week' ? 7 : period === 'Month' ? 30 : 365;
      
      const totalOutput = machine.totalOutputShift * multiplier;
      const rejectMass = (machine.totalOutputShift * (machine.rejectRate / 100)) * multiplier;
      
      const util = machine.utilityConsumption || { electricity: 0, steam: 0, water: 0, air: 0 };
      
      // Calculate utility totals (Base rate * 24 hours * multiplier)
      // Assuming utilityConsumption values in mockData are "per hour" or similar base rate
      // Adjusting logic: The mock utility is likely hourly rate.
      const hours = period === 'Day' ? 24 : period === 'Week' ? 168 : period === 'Month' ? 720 : 8760;

      return {
          totalOutput,
          rejectMass,
          rejectRate: machine.rejectRate, // Rate stays roughly same
          oee: machine.oee, // Average OEE stays roughly same
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
    const machine = getMachineById(machineId);
    if (!machine) return { output: [], rejects: [], params: [], utility: { electricity: [], steam: [] } };

    let points = 24;
    let label = (i: number) => `${i}:00`;
    let varianceMult = 1;

    if (period === 'Week') {
        points = 7;
        label = (i: number) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
        varianceMult = 5;
    } else if (period === 'Month') {
        points = 30;
        label = (i: number) => `Day ${i + 1}`;
        varianceMult = 8;
    } else if (period === 'Year') {
        points = 12;
        label = (i: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
        varianceMult = 20;
    }

    const generate = (base: number, variance: number, isAccumulated: boolean = false) => {
        // If accumulated (like total output per day/month), scale base
        const effectiveBase = isAccumulated ? base * (period === 'Day' ? 1 : 24) : base;
        
        return Array.from({ length: points }, (_, i) => ({
            time: label(i),
            value: Number((effectiveBase + (Math.random() * variance * varianceMult * 2 - variance * varianceMult)).toFixed(1)),
        }));
    };
    
    // Output is per hour in mock. For chart:
    // Day: Hourly output
    // Week/Month/Year: Daily/Monthly accumulated output? 
    // Usually charts show the rate or the total for that bucket.
    // Let's assume Output Chart shows "Total Output" for that time bucket.
    const outputBase = period === 'Day' ? machine.outputPerHour : machine.outputPerHour * 24; 
    
    const outputData = generate(machine.outputPerHour, 100, true);
    // Explicitly add target property
    const targetBase = period === 'Day' ? machine.outputPerHour : machine.outputPerHour * 24;
    outputData.forEach((d: any) => d.target = targetBase);

    const params = machine.processParams || {};
    const utility = machine.utilityConsumption || { electricity: 0, steam: 0 };

    return {
        output: outputData,
        rejects: generate(machine.rejectRate * 10, 15, false), // Reject rate is % or mass, assuming simplified
        params: Array.from({ length: points }, (_, i) => ({
            time: label(i),
            temp: (Number(params['Barrel Temp Zone 1'] || params['Oil Temp']) || 140) + Math.random() * 10,
            pressure: (Number(params['Die Pressure']) || 40) + Math.random() * 5,
            speed: (Number(params['Screw Speed'] || params['Conveyor Speed']) || 80) + Math.random() * 2
        })),
        utility: {
            // Utility per bucket
            electricity: generate(utility.electricity, 20, true),
            steam: generate(utility.steam, 50, true),
        }
    };
  }
};
