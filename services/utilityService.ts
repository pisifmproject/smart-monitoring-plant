
//utilityService.ts

import { Plant, PlantCode, UtilityConfig } from '../types';
import { Zap, Droplets, Flame, Wind, Cloud, Box } from 'lucide-react';
import { plantService } from './plantService';

export type Period = 'Day' | 'Week' | 'Month' | 'Year';

export const utilityService = {

    // ----------------------------------------------
    // NEW: Get all available utility types for sidebar menu
    // ----------------------------------------------
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

    // ----------------------------------------------
    // GLOBAL MULTIPLIER (menyesuaikan ukuran plant)
    // ----------------------------------------------
    getMultipliers: (plantId: string, period: Period) => {
        const isLargePlant =
            [PlantCode.CIKOKOL, PlantCode.SEMARANG].includes(
                plantId as PlantCode
            );

        const baseMult = isLargePlant ? 1.5 : 0.8;

        const periodMult =
            period === 'Day'
                ? 1
                : period === 'Week'
                ? 7
                : period === 'Month'
                ? 30
                : 365;

        return { baseMult, periodMult };
    },

    // ----------------------------------------------
    // UTILITY CONFIG FINAL
    // ----------------------------------------------
    getUtilityConfig: (plant: Plant, type: string, period: Period) => {
        const { periodMult } = utilityService.getMultipliers(
            plant.id,
            period
        );

        const t = type.toLowerCase();
        const baseConfig = plant.utilityBaseValues[t] || { baseConsumption: 0, costPerUnit: 0 };
        const target = baseConfig.baseConsumption * periodMult;

        switch (t) {
            case 'electricity':
                const totalElec =
                    plant.lvmdps.reduce(
                        (acc, p) => acc + (p.energyToday || 0),
                        0
                    ) * periodMult;

                let elecTrendBase = totalElec;
                let elecVariance = 0;
                
                if (period === 'Day') {
                     elecTrendBase = totalElec;
                     elecVariance = (totalElec / 24) * 0.2;
                } else {
                     const points = period === 'Week' ? 7 : period === 'Month' ? 30 : 12;
                     elecTrendBase = totalElec / points;
                     elecVariance = (elecTrendBase * 0.2) * points;
                }

                return {
                    label: 'Electricity',
                    unit: 'kWh',
                    icon: Zap,
                    color: 'text-yellow-400',
                    hexColor: '#facc15',
                    value: totalElec,
                    target: target,
                    trend: 12,
                    trendBase: elecTrendBase,
                    variance: elecVariance,
                    breakdownTitle: 'Panel Breakdown'
                };

            case 'water':
                return {
                    label: 'Water',
                    unit: 'm³',
                    icon: Droplets,
                    color: 'text-blue-400',
                    hexColor: '#60a5fa',
                    value: target * (1 + (Math.random() * 0.15 - 0.05)),
                    target: target,
                    trend: -5,
                    trendBase: target / (period === 'Day' ? 24 : 1),
                    variance: target * 0.1,
                    breakdownTitle: 'Area Consumption',
                    // Process Params
                    pressure: 4.2 + Math.random() * 0.2, // bar
                    flow: (target / 24) * (1 + Math.random() * 0.1), // m3/h
                    temp: 28 + Math.random() * 2 // C
                };

            case 'gas':
                return {
                    label: 'Natural Gas',
                    unit: 'Nm³',
                    icon: Flame,
                    color: 'text-rose-400',
                    hexColor: '#fb7185',
                    value: target * (1 + (Math.random() * 0.1 - 0.02)),
                    target: target,
                    trend: 2,
                    trendBase: target / (period === 'Day' ? 24 : 1),
                    variance: target * 0.1,
                    breakdownTitle: 'Area Consumption',
                    // Process Params
                    pressure: 150 + Math.random() * 10, // mbar
                    flow: (target / 24) * (1 + Math.random() * 0.1), // Nm3/h
                    temp: 30 + Math.random() * 2 // C
                };

            case 'steam':
                return {
                    label: 'Steam',
                    unit: 'Ton',
                    icon: Cloud,
                    color: 'text-slate-200',
                    hexColor: '#e2e8f0',
                    value: target * (1 + (Math.random() * 0.2 - 0.05)),
                    target: target,
                    trend: 8,
                    trendBase: target / (period === 'Day' ? 24 : 1),
                    variance: target * 0.05,
                    breakdownTitle: 'Line Consumption',
                    // Process Params
                    pressure: 10.5 + Math.random() * 0.5, // bar
                    flow: (target / 24) * (1 + Math.random() * 0.1), // Ton/h
                    temp: 184 + Math.random() * 3 // C
                };

            case 'air':
                return {
                    label: 'Compressed Air',
                    unit: 'Nm³',
                    icon: Wind,
                    color: 'text-cyan-400',
                    hexColor: '#22d3ee',
                    value: target * (1 + (Math.random() * 0.1 - 0.05)),
                    target: target,
                    trend: 0,
                    trendBase: target / (period === 'Day' ? 24 : 1),
                    variance: target * 0.08,
                    breakdownTitle: 'Line Consumption',
                    // Process Params
                    pressure: 6.8 + Math.random() * 0.3, // bar
                    flow: (target / 24) * (1 + Math.random() * 0.1), // Nm3/h
                    temp: 35 + Math.random() * 5 // C
                };

            case 'nitrogen':
                return {
                    label: 'Nitrogen',
                    unit: 'Nm³',
                    icon: Box,
                    color: 'text-emerald-400',
                    hexColor: '#34d399',
                    value: target * (1 + (Math.random() * 0.05 - 0.02)),
                    target: target,
                    trend: 15,
                    trendBase: target / (period === 'Day' ? 24 : 1),
                    variance: target * 0.05,
                    breakdownTitle: 'Line Consumption',
                    // Process Params
                    pressure: 5.5 + Math.random() * 0.2, // bar
                    flow: (target / 24) * (1 + Math.random() * 0.1), // Nm3/h
                    purity: 99.9 // %
                };

            default:
                return {
                    label: type,
                    unit: 'Units',
                    icon: Box,
                    color: 'text-slate-400',
                    hexColor: '#94a3b8',
                    value: 0,
                    target: 100,
                    trend: 0,
                    trendBase: 100,
                    variance: 10,
                    breakdownTitle: 'Breakdown'
                };
        }
    },

    // ----------------------------------------------
    // TREND DATA FINAL
    // ----------------------------------------------
    getTrendData: (config: any, period: Period) => {
        let points = 24;
        let label = (i: number) => `${i}:00`;

        if (period === 'Week') {
            points = 7;
            label = (i: number) =>
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
        } else if (period === 'Month') {
            const now = new Date();
            points = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            label = (i: number) => `Day ${i + 1}`;
        } else if (period === 'Year') {
            points = 12;
            label = (i: number) =>
                [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ][i];
        }
        
        const baseValuePerPoint = config.trendBase / (period === 'Day' ? 24 : 1);

        return Array.from({ length: points }, (_, i) => ({
            time: label(i),
            value: Number(Math.max(
                0,
                baseValuePerPoint +
                    (Math.random() * (config.variance / (period === 'Day' ? 1 : points)) * 2 - (config.variance / (period === 'Day' ? 1 : points)))
            ).toFixed(2))
        }));
    },

    // ----------------------------------------------
    // GENERIC PIE (BREAKDOWN)
    // ----------------------------------------------
    getGenericBreakdown: () => [
        { name: 'Production Line A', value: 35, status: 'NORMAL' },
        { name: 'Production Line B', value: 25, status: 'WARNING' },
        { name: 'Utility Room', value: 15, status: 'NORMAL' },
        { name: 'Packaging Area', value: 15, status: 'NORMAL' },
        { name: 'Warehouse', value: 10, status: 'NORMAL' }
    ],

    // ----------------------------------------------
    // QUICK STATS - NEW FUNCTION
    // ----------------------------------------------
    getQuickStats: (config: any) => {
        const average = config.trendBase; // Base is already hourly
        const peak = average * (1.5 + Math.random() * 0.5);
        const low = average * (0.5 + Math.random() * 0.2);
        const unitSuffix = config.unit.includes('/') ? '' : '/h';
        return {
            peak: { value: peak.toLocaleString('id-ID', { maximumFractionDigits: 2 }), time: '14:30', unit: config.unit + unitSuffix },
            average: { value: average.toLocaleString('id-ID', { maximumFractionDigits: 2 }), unit: config.unit + unitSuffix },
            low: { value: low.toLocaleString('id-ID', { maximumFractionDigits: 2 }), time: '03:00', unit: config.unit + unitSuffix }
        };
    },

    // --- CRUD Operations for Utility Configs ---
    getUtilityConfigsForPlant: (plantId: PlantCode): { type: string, config: UtilityConfig }[] => {
        const plant = plantService.getPlantById(plantId);
        if (!plant || !plant.utilityBaseValues) return [];
        return Object.entries(plant.utilityBaseValues).map(([type, config]) => ({ type, config }));
    },

    addUtilityConfig: (plantId: PlantCode, data: { type: string; baseConsumption: number }): { success: boolean, message?: string } => {
        const plant = plantService.getPlantById(plantId);
        if (!plant) {
            return { success: false, message: "Plant not found." };
        }
        const utilityType = data.type.toLowerCase();
        if (plant.utilityBaseValues[utilityType]) {
            return { success: false, message: `Utility type '${data.type}' already exists for this plant.`};
        }
        plant.utilityBaseValues[utilityType] = {
            baseConsumption: data.baseConsumption,
            costPerUnit: 0 // Default cost, can be edited later if needed
        };
        return { success: true };
    },

    updateUtilityConfig: (plantId: PlantCode, type: string, data: { baseConsumption: number }): { success: boolean, message?: string } => {
        const plant = plantService.getPlantById(plantId);
        if (!plant) {
            return { success: false, message: "Plant not found." };
        }
        if (!plant.utilityBaseValues[type]) {
             return { success: false, message: "Utility type not found for this plant." };
        }
        // Only update baseConsumption, preserve costPerUnit
        plant.utilityBaseValues[type].baseConsumption = data.baseConsumption;
        return { success: true };
    },

    deleteUtilityConfig: (plantId: PlantCode, type: string): { success: boolean, message?: string } => {
        const plant = plantService.getPlantById(plantId);
        if (!plant) {
            return { success: false, message: "Plant not found." };
        }
        if (!plant.utilityBaseValues[type]) {
            return { success: false, message: "Utility type not found for this plant." };
        }
        delete plant.utilityBaseValues[type];
        return { success: true };
    }
};
