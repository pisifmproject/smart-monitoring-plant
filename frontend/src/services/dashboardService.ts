// services/dashboardService.ts
import { Plant, User, UserRole, PlantCode } from '../types';
import { plantService } from './plantService';
import { maintenanceService } from './maintenanceService';
import { lvmdpService } from './lvmdpService';
import { utilityService } from './utilityService';
import { Zap, Cloud, Droplets, Wind, Box, Flame } from 'lucide-react';
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

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

const convertPeriod = (p: Period) =>
    p === 'DAY' ? 'Day' : p === 'WEEK' ? 'Week' : p === 'MONTH' ? 'Month' : 'Year';

export const dashboardService = {

    getGlobalKPIs: async (period: Period, user: User | null) => {
        try {
            const summary = await handleResponse(await fetch(`${API_BASE}/dashboard/global-summary`, { headers: getAuthHeaders() }));

            const multiplier = period === 'DAY' ? 1 : period === 'WEEK' ? 6.5 : period === 'MONTH' ? 28 : 340;

            const estimatedOutput = summary.activeMachines * 1000 * multiplier;
            const estimatedEnergy = summary.activeMachines * 50 * multiplier;

            return {
                totalOutput: estimatedOutput,
                totalEnergy: estimatedEnergy,
                avgOEE: summary.overallEfficiency,
                totalAlarmsValue: summary.totalAlarms
            };
        } catch (err) {
             console.error("KPI Fetch Error", err);
             return { totalOutput: 0, totalEnergy: 0, avgOEE: 0, totalAlarmsValue: 0 };
        }
    },

    getPlantOverview: async (period: Period) => {
        const plants = await plantService.getAllPlants();
        const multiplier = period === 'DAY' ? 1 : period === 'WEEK' ? 6.5 : period === 'MONTH' ? 28 : 340;

        return plants.map(plant => {
            let status = 'NORMAL';
            if (plant.activeAlarms > 5 || plant.oeeAvg < 0.5) status = 'CRITICAL';
            else if (plant.activeAlarms > 0 || plant.oeeAvg < 0.7) status = 'WARNING';

            return {
                ...plant,
                scaledOutput: plant.outputToday * multiplier,
                scaledEnergy: (plant.energyTotal || 1000) * multiplier,
                scaledOEE: Math.min(
                    100,
                    plant.oeeAvg * 100 * (1 + (Math.random() * 0.02 - 0.01))
                ),
                alarmCount: plant.activeAlarms,
                computedStatus: status
            };
        });
    },

    getPlantKPIs: async (plant: Plant, period: Period) => {
        try {
             const overview = await handleResponse(await fetch(`${API_BASE}/plants/${plant.id}/dashboard-overview`, { headers: getAuthHeaders() }));
             const multiplier = period === 'DAY' ? 1 : period === 'WEEK' ? 6.5 : period === 'MONTH' ? 28 : 340;

             return {
                output: (overview.production || 0) * multiplier,
                oee: (overview.efficiency || 0),
                energy: (1000) * multiplier, // Mock
                alarms: overview.activeAlarms
            };
        } catch (err) {
            return { output: 0, oee: 0, energy: 0, alarms: 0 };
        }
    },

    getUtilityMetrics: async (plantId: string, period: Period) => {
        const types = ['electricity', 'steam', 'water', 'air', 'nitrogen', 'gas'];

        let summary: any = {};
        try {
             summary = await handleResponse(await fetch(`${API_BASE}/plants/${plantId}/utility-summary`, { headers: getAuthHeaders() }));
        } catch (e) { console.error(e); }

        return types.map(type => {
            const backendKey = type;
            const data = summary[backendKey] || { consumption: 0, unit: 'unit' };

            const multiplier = period === 'DAY' ? 1 : period === 'WEEK' ? 7 : period === 'MONTH' ? 30 : 365;
            const value = data.consumption * multiplier;

            let icon = Zap;
            let color = 'text-yellow-400';
            let label = type.charAt(0).toUpperCase() + type.slice(1);

            switch(type) {
                case 'steam': icon = Cloud; color = 'text-gray-400'; break;
                case 'water': icon = Droplets; color = 'text-blue-400'; break;
                case 'air': icon = Wind; color = 'text-sky-200'; break;
                case 'gas': icon = Flame; color = 'text-orange-400'; break;
                case 'nitrogen': icon = Box; color = 'text-green-400'; break;
            }

            return {
                key: `UTILITY_${type.toUpperCase()}`,
                type,
                label: label,
                value: value.toLocaleString('id-ID', { maximumFractionDigits: 2 }),
                unit: data.unit || '',
                icon,
                color
            };
        });
    },

    getShifts: (plant: Plant) => [
        {
            id: 1,
            name: 'Shift 1',
            time: '07:01 - 14:30',
            output: plant.outputToday * 0.6,
            target: 12000,
            oee: plant.oeeAvg * 100 * 1.02,
            status: 'COMPLETED'
        },
        {
            id: 2,
            name: 'Shift 2',
            time: '14:31 - 22:00',
            output: plant.outputToday * 0.4,
            target: 12000,
            oee: plant.oeeAvg * 100,
            status: 'ACTIVE'
        },
        {
            id: 3,
            name: 'Shift 3',
            time: '22:01 - 07:00',
            output: 0,
            target: 12000,
            oee: 0,
            status: 'UPCOMING'
        }
    ],

    getLVMDPTrend: async (panelId: string, period: Period) => {
        return await lvmdpService.getEnergyTrend(panelId, convertPeriod(period));
    }
};
