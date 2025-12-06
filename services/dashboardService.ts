//dashboardService.ts

import { PLANTS } from './mockData';
import { maintenanceService } from './maintenanceService';
import { utilityService } from './utilityService';
// FIX: Import lvmdpService to resolve reference error in getLVMDPTrend.
import { lvmdpService } from './lvmdpService';
import { PlantCode, Plant } from '../types';
import { Zap, Cloud, Droplets, Wind, Box, Flame } from 'lucide-react';

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

// Helper to convert period to utility service format
const convertPeriod = (p: Period) =>
    p === 'DAY' ? 'Day' : p === 'WEEK' ? 'Week' : p === 'MONTH' ? 'Month' : 'Year';

export const dashboardService = {

    // --------------------------------------------------
    // GLOBAL KPIs
    // --------------------------------------------------
    getGlobalKPIs: (period: Period) => {
        const plants = Object.values(PLANTS);
        const multiplier = period === 'DAY' ? 1 : period === 'WEEK' ? 6.5 : period === 'MONTH' ? 28 : 340;

        const totalOutput = plants.reduce((acc, p) => acc + p.outputToday, 0) * multiplier;
        const totalEnergy = plants.reduce((acc, p) => acc + p.energyTotal, 0) * multiplier;

        const baseAvgOEE =
            (plants.reduce((acc, p) => acc + p.oeeAvg, 0) /
                plants.filter(p => p.oeeAvg > 0).length) * 100;

        const avgOEE = Math.min(
            99.9,
            baseAvgOEE * (1 + (period === 'DAY' ? 0 : Math.random() * 0.05 - 0.025))
        );

        const activeAlarmsCount = maintenanceService.getActiveAlarms().length;
        const totalAlarmsValue =
            period === 'DAY'
                ? activeAlarmsCount
                : Math.floor(activeAlarmsCount * multiplier * 0.8) + 5;

        return {
            totalOutput,
            totalEnergy,
            avgOEE,
            totalAlarmsValue
        };
    },

    // --------------------------------------------------
    // GLOBAL PLANT OVERVIEW
    // --------------------------------------------------
    getPlantOverview: (period: Period) => {
        const plants = Object.values(PLANTS);
        const multiplier = period === 'DAY' ? 1 : period === 'WEEK' ? 6.5 : period === 'MONTH' ? 28 : 340;

        return plants.map(plant => {
            const activeAlarms = maintenanceService.getActiveAlarms();
            const plantAlarms = activeAlarms.filter(
                a =>
                    a.source.includes(plant.name) ||
                    a.machineId?.includes(plant.id)
            );

            const alarmCount = plantAlarms.length;
            let status = 'NORMAL';
            if (alarmCount > 5 || plant.oeeAvg < 0.5) status = 'CRITICAL';
            else if (alarmCount > 0 || plant.oeeAvg < 0.7) status = 'WARNING';

            return {
                ...plant,
                scaledOutput: plant.outputToday * multiplier,
                scaledEnergy: plant.energyTotal * multiplier,
                scaledOEE: Math.min(
                    100,
                    plant.oeeAvg * 100 * (1 + (Math.random() * 0.02 - 0.01))
                ),
                alarmCount,
                computedStatus: status
            };
        });
    },

    // --------------------------------------------------
    // PLANT KPIs
    // --------------------------------------------------
    getPlantKPIs: (plant: Plant, period: Period) => {
        const multiplier =
            period === 'DAY'
                ? 1
                : period === 'WEEK'
                ? 6.5
                : period === 'MONTH'
                ? 28
                : 340;

        const activeAlarms = maintenanceService.getActiveAlarms(plant.id);
        const activeAlarmCount = activeAlarms.length;
        const totalAlarmCount =
            period === 'DAY'
                ? activeAlarmCount
                : Math.floor(activeAlarmCount * multiplier * 0.8) + 3;

        return {
            output: plant.outputToday * multiplier,
            oee: Math.min(
                100,
                plant.oeeAvg * 100 * (1 + (Math.random() * 0.02 - 0.01))
            ),
            energy: plant.energyTotal * multiplier,
            alarms: totalAlarmCount
        };
    },

    // --------------------------------------------------
    // UTILITY SUMMARY FIXED (Electricity, Water, Steam, Air, Gas, Nitrogen)
    // --------------------------------------------------
    getUtilityMetrics: (plantId: string, period: Period) => {
        const plant = PLANTS[plantId as PlantCode];
        if (!plant) return [];

        const types = ['electricity', 'steam', 'water', 'air', 'nitrogen', 'gas'];

        return types.map(type => {
            const config = utilityService.getUtilityConfig(
                plant,
                type,
                convertPeriod(period)
            );

            return {
                key: `UTILITY_${type.toUpperCase()}`,
                type,
                label: config.label,
                value: config.value.toLocaleString(undefined, {
                    maximumFractionDigits: 0
                }),
                unit: config.unit,
                icon: config.icon,
                color: config.color
            };
        });
    },

    // --------------------------------------------------
    // SHIFT PERFORMANCE
    // --------------------------------------------------
    getShifts: (plant: Plant) => [
        {
            id: 1,
            name: 'Shift 1',
            time: '07:01 - 14:30',
            output: plant.outputToday,
            target: 12000,
            oee: plant.oeeAvg,
            status: 'ACTIVE'
        },
        {
            id: 2,
            name: 'Shift 2',
            time: '14:31 - 22:00',
            output: 0,
            target: 12000,
            oee: 0,
            status: 'PENDING'
        },
        {
            id: 3,
            name: 'Shift 3',
            time: '22:01 - 07:00',
            output: 0,
            target: 12000,
            oee: 0,
            status: 'PENDING'
        }
    ],

    // --------------------------------------------------
    // LVMDP TREND WRAPPER
    // --------------------------------------------------
    getLVMDPTrend: (panelId: string, period: Period) => {
        return lvmdpService.getEnergyTrend(panelId, convertPeriod(period));
    }
};