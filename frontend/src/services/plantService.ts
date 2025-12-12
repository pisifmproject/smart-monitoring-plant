// services/plantService.ts
import { Plant, Machine, PlantCode } from '../types';
import { getAuthHeaders } from './auth';

const API_BASE = '/api/stable';

// Helper to handle API response
async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const plantService = {
  getAllPlants: async (): Promise<Plant[]> => {
    try {
        const plants = await handleResponse(await fetch(`${API_BASE}/plants`, { headers: getAuthHeaders() }));

        return Promise.all(plants.map(async (p: any) => {
             const machines = await handleResponse(await fetch(`${API_BASE}/plants/${p.id}/machines`, { headers: getAuthHeaders() }));
             const overview = await handleResponse(await fetch(`${API_BASE}/plants/${p.id}/dashboard-overview`, { headers: getAuthHeaders() }));

             return {
                 id: p.code as PlantCode,
                 name: p.name,
                 location: p.location,
                 outputToday: overview.production || 0,
                 oeeAvg: (overview.efficiency || 0) / 100,
                 energyTotal: 0,
                 activeAlarms: overview.activeAlarms || 0,
                 machines: machines.map((m: any) => mapBackendMachineToFrontend(m, p.code)),
                 lvmdps: [],
                 utilityBaseValues: {
                    water: { baseConsumption: 100, costPerUnit: 12000 },
                    gas: { baseConsumption: 200, costPerUnit: 4500 },
                    steam: { baseConsumption: 5, costPerUnit: 250000 },
                    air: { baseConsumption: 3000, costPerUnit: 150 },
                    nitrogen: { baseConsumption: 100, costPerUnit: 2000 },
                 }
             };
        }));

    } catch (err) {
        console.error("Failed to fetch plants", err);
        return [];
    }
  },

  getPlantById: async (plantId: string): Promise<Plant | undefined> => {
     const plants = await plantService.getAllPlants();
     return plants.find(p => p.id === plantId);
  },

  getMachineById: async (machineId: string): Promise<Machine | undefined> => {
      const plants = await plantService.getAllPlants();
      for (const plant of plants) {
          const machine = plant.machines.find(m => m.id === machineId);
          if (machine) return machine;
      }
      return undefined;
  },

  getProductionLines: async (plantId: string, period: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR') => {
       const plant = await plantService.getPlantById(plantId);
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

  getMachineStats: async (machineId: string, period: 'Day' | 'Week' | 'Month') => {
      const machine = await plantService.getMachineById(machineId);
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

  getMachineTimeSeries: async (machineId: string, period: any) => {
        const machine = await plantService.getMachineById(machineId);
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

  addPlant: async (data: any) => {
      try {
          await handleResponse(await fetch(`${API_BASE}/plants`, {
              method: 'POST',
              headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  code: data.id,
                  name: data.name,
                  location: data.location
              })
          }));
          return { success: true };
      } catch (e: any) {
          return { success: false, message: e.message };
      }
  },

  updatePlant: async (plantId: string, data: any) => {
      return { success: true };
  },

  deletePlant: async (plantId: string) => {
       return { success: true };
  },

  getAllMachines: async () => {
       const plants = await plantService.getAllPlants();
       return plants.flatMap(p => p.machines);
  },

  addMachine: async (data: any) => {
      return { success: true };
  },

  updateMachine: async (machineId: string, data: any) => {
       return { success: true };
  },

  deleteMachine: async (machineId: string) => {
       return { success: true };
  }
};

function mapBackendMachineToFrontend(m: any, plantCode: string): Machine {
    return {
        id: m.id.toString(),
        code: m.code,
        name: m.name,
        plantId: plantCode as PlantCode,
        type: m.type || 'GENERIC',
        status: m.status || 'OFFLINE',
        outputPerHour: 1200,
        oee: 0.85,
        temperature: 65,
        totalOutputShift: 5000,
        targetShift: 8000,
        lineSpeed: 100,
        rejectRate: 0.5,
        availability: 0.9,
        performance: 0.85,
        quality: 0.98,
        processParams: {},
        utilityConsumption: { electricity: 100, steam: 50, water: 10, air: 100 }
    } as any;
}
