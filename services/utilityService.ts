
//utilityService.ts

import { Plant, PlantCode } from '../types';
import { Zap, Droplets, Flame, Wind, Cloud, Box } from 'lucide-react';

export type Period = 'Day' | 'Week' | 'Month' | 'Year';

export const utilityService = {

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
        const { baseMult, periodMult } = utilityService.getMultipliers(
            plant.id,
            period
        );

        const t = type.toLowerCase();

        switch (t) {
            case 'electricity':
                const totalElec =
                    plant.lvmdps.reduce(
                        (acc, p) => acc + (p.energyToday || 0),
                        0
                    ) * periodMult;

                // Dynamic Trend Calculation to match Total
                let elecTrendBase = totalElec;
                let elecVariance = 0;
                
                if (period === 'Day') {
                     // Day: trendBase is Total Daily. getTrendData divides by 24 to get hourly avg.
                     elecTrendBase = totalElec;
                     // Variance: used as-is by getTrendData for Day.
                     // We want approx 20% variance on hourly value.
                     elecVariance = (totalElec / 24) * 0.2;
                } else {
                     const points = period === 'Week' ? 7 : period === 'Month' ? 30 : 12;
                     // Others: trendBase is Average Per Point. getTrendData divides by 1.
                     elecTrendBase = totalElec / points;
                     // Variance: getTrendData divides by points.
                     // We want 20% variance on avg value.
                     // So input variance = (Avg * 0.2) * points
                     elecVariance = (elecTrendBase * 0.2) * points;
                }

                return {
                    label: 'Electricity',
                    unit: 'kWh',
                    icon: Zap,
                    color: 'text-yellow-400',
                    hexColor: '#facc15',
                    value: totalElec,
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
                    value: 450 * baseMult * periodMult,
                    trend: -5,
                    trendBase: 20 * baseMult,
                    variance: 5 * baseMult,
                    breakdownTitle: 'Area Consumption'
                };

            case 'gas':
                return {
                    label: 'Natural Gas',
                    unit: 'Nm³',
                    icon: Flame,
                    color: 'text-rose-400',
                    hexColor: '#fb7185',
                    value: 1200 * baseMult * periodMult,
                    trend: 2,
                    trendBase: 50 * baseMult,
                    variance: 10 * baseMult,
                    breakdownTitle: 'Area Consumption'
                };

            case 'steam':
                return {
                    label: 'Steam',
                    unit: 'Ton',
                    icon: Cloud,
                    color: 'text-slate-200',
                    hexColor: '#e2e8f0',
                    value: 15 * baseMult * periodMult,
                    trend: 8,
                    trendBase: 0.8 * baseMult,
                    variance: 0.2 * baseMult,
                    breakdownTitle: 'Line Consumption'
                };

            case 'air':
                return {
                    label: 'Compressed Air',
                    unit: 'Nm³',
                    icon: Wind,
                    color: 'text-cyan-400',
                    hexColor: '#22d3ee',
                    value: 18000 * baseMult * periodMult,
                    trend: 0,
                    trendBase: 800 * baseMult,
                    variance: 50 * baseMult,
                    breakdownTitle: 'Line Consumption'
                };

            case 'nitrogen':
                return {
                    label: 'Nitrogen',
                    unit: 'Nm³',
                    icon: Box,
                    color: 'text-emerald-400',
                    hexColor: '#34d399',
                    value: 450 * baseMult * periodMult,
                    trend: 15,
                    trendBase: 20 * baseMult,
                    variance: 2 * baseMult,
                    breakdownTitle: 'Line Consumption'
                };

            default:
                return {
                    label: type,
                    unit: 'Units',
                    icon: Box,
                    color: 'text-slate-400',
                    hexColor: '#94a3b8',
                    value: 0,
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
            points = 30;
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
        { name: 'Production A', value: 40 },
        { name: 'Production B', value: 30 },
        { name: 'Utility', value: 15 },
        { name: 'General', value: 15 }
    ],

    // ----------------------------------------------
    // QUICK STATS - NEW FUNCTION
    // ----------------------------------------------
    getQuickStats: (config: any) => {
        const average = config.trendBase / 24; // Always calculate hourly average from daily base
        const peak = average * (1.5 + Math.random() * 0.5);
        const low = average * (0.5 + Math.random() * 0.2);
        const unitSuffix = config.unit.includes('/') ? '' : '/h';
        return {
            peak: { value: peak.toLocaleString('id-ID', { maximumFractionDigits: 2 }), time: '14:30', unit: config.unit + unitSuffix },
            average: { value: average.toLocaleString('id-ID', { maximumFractionDigits: 2 }), unit: config.unit + unitSuffix },
            low: { value: low.toLocaleString('id-ID', { maximumFractionDigits: 2 }), time: '03:00', unit: config.unit + unitSuffix }
        };
    }
};