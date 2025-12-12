// services/utilityService.ts
import { Plant, PlantCode, UtilityConfig } from '../types';
import { Zap, Droplets, Flame, Wind, Cloud, Box } from 'lucide-react';
import { plantService } from './plantService';
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

export type Period = 'Day' | 'Week' | 'Month' | 'Year';

export const utilityService = {
    getUtilityTypes: () => {
        return [
            { key: 'electricity', label: 'Electricity', icon: Zap },
            { key: 'steam', label: 'Steam', icon: Cloud },
            { key: 'water', label: 'Water', icon: Droplets },
            { key: 'air', label: 'Compressed Air', icon: Wind },
            { key: 'nitrogen', label: 'Nitrogen', icon: Box },
            { key: 'gas', label: 'Natural Gas', icon: Flame },
        ];
    },

    getMultipliers: (plantId: string, period: Period) => {
        const isLargePlant = ['P01', 'P02'].includes(plantId);
        const baseMult = isLargePlant ? 1.5 : 0.8;
        const periodMult = period === 'Day' ? 1 : period === 'Week' ? 7 : period === 'Month' ? 30 : 365;
        return { baseMult, periodMult };
    },

    getUtilityConfig: (plant: Plant, type: string, period: Period) => {
        const { periodMult } = utilityService.getMultipliers(plant.id, period);
        const t = type.toLowerCase();
        const baseConfig = plant.utilityBaseValues?.[t] || { baseConsumption: 0, costPerUnit: 0 };

        switch (t) {
            case 'electricity':
                 const totalElec = (plant.lvmdps?.reduce((acc, p) => acc + (p.energyToday || 0), 0) || 1000) * periodMult;
                 return {
                    label: 'Electricity',
                    unit: 'kWh',
                    icon: Zap,
                    color: 'text-yellow-400',
                    hexColor: '#facc15',
                    value: totalElec,
                    trend: 12,
                    trendBase: totalElec,
                    variance: totalElec * 0.1,
                    breakdownTitle: 'Panel Breakdown'
                };
             default:
                 return {
                    label: type,
                    unit: 'Units',
                    icon: Box,
                    color: 'text-slate-400',
                    hexColor: '#94a3b8',
                    value: baseConfig.baseConsumption * periodMult,
                    trend: 0,
                    trendBase: 100,
                    variance: 10,
                    breakdownTitle: 'Breakdown'
                };
        }
    },

    getTrendData: async (config: any, period: Period) => {
        let points = 24;
        let label = (i: number) => `${i}:00`;

        if (period === 'Week') {
            points = 7;
            label = (i: number) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
        } else if (period === 'Month') {
            const now = new Date();
            points = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            label = (i: number) => `Day ${i + 1}`;
        } else if (period === 'Year') {
            points = 12;
            label = (i: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
        }

        const baseValuePerPoint = (config.trendBase || 100) / (period === 'Day' ? 24 : 1);
        const variance = config.variance || 10;

        return Array.from({ length: points }, (_, i) => ({
            time: label(i),
            value: Number(Math.max(
                0,
                baseValuePerPoint +
                    (Math.random() * (variance / (period === 'Day' ? 1 : points)) * 2 - (variance / (period === 'Day' ? 1 : points)))
            ).toFixed(2))
        }));
    },

    getGenericBreakdown: () => [
        { name: 'Production A', value: 40 },
        { name: 'Production B', value: 30 },
        { name: 'Utility', value: 15 },
        { name: 'General', value: 15 }
    ],

    getQuickStats: (config: any) => {
        const average = config.trendBase || 100;
        const peak = average * (1.5 + Math.random() * 0.5);
        const low = average * (0.5 + Math.random() * 0.2);
        const unitSuffix = config.unit.includes('/') ? '' : '/h';
        return {
            peak: { value: peak.toLocaleString('id-ID', { maximumFractionDigits: 2 }), time: '14:30', unit: config.unit + unitSuffix },
            average: { value: average.toLocaleString('id-ID', { maximumFractionDigits: 2 }), unit: config.unit + unitSuffix },
            low: { value: low.toLocaleString('id-ID', { maximumFractionDigits: 2 }), time: '03:00', unit: config.unit + unitSuffix }
        };
    },

    getUtilityConfigsForPlant: async (plantId: PlantCode) => {
        const plant = await plantService.getPlantById(plantId);
        if (!plant || !plant.utilityBaseValues) return [];
        return Object.entries(plant.utilityBaseValues).map(([type, config]) => ({ type, config }));
    },

    addUtilityConfig: async (plantId: PlantCode, data: any) => { return { success: true }; },
    updateUtilityConfig: async (plantId: PlantCode, type: string, data: any) => { return { success: true }; },
    deleteUtilityConfig: async (plantId: PlantCode, type: string) => { return { success: true }; }
};
