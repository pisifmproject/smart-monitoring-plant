//dashboardService.ts

import { PLANTS } from './mockData';
import { maintenanceService } from './maintenanceService';
import { utilityService } from './utilityService';
import { lvmdpService } from './lvmdpService';
import { PlantCode, Plant, User, UserRole } from '../types';
import { Zap, Cloud, Droplets, Wind, Box, Flame } from 'lucide-react';

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

// Helper to convert period to utility service format
const convertPeriod = (p: Period) =>
    p === 'DAY' ? 'Day' : p === 'WEEK' ? 'Week' : p === 'MONTH' ? 'Month' : 'Year';

export const dashboardService = {

    // --------------------------------------------------
    // GLOBAL KPIs (REFACTORED to be access-aware)
    // --------------------------------------------------
    getGlobalKPIs: (period: Period, user: User | null) => {
        let plantsToCalculate: Plant[];

        if (!user || user.role === UserRole.ADMINISTRATOR || !user.plantAccess || user.plantAccess.length === 0) {
            plantsToCalculate = Object.values(PLANTS);
        } else {
            plantsToCalculate = Object.values(PLANTS).filter(p => user.plantAccess!.includes(p.id));
        }

        const multiplier = period === 'DAY' ? 1 : period === 'WEEK' ? 6.5 : period === 'MONTH' ? 28 : 340;

        const totalOutput = plantsToCalculate.reduce((acc, p) => acc + p.outputToday, 0) * multiplier;
        const totalEnergy = plantsToCalculate.reduce((acc, p) => acc + p.energyTotal, 0) * multiplier;
        
        const plantsWithOEE = plantsToCalculate.filter(p => p.oeeAvg > 0);
        const baseAvgOEE = plantsWithOEE.length > 0
            ? (plantsWithOEE.reduce((acc, p) => acc + p.oeeAvg, 0) / plantsWithOEE.length) * 100
            : 0;

        const avgOEE = Math.min(
            99.9,
            baseAvgOEE * (1 + (period === 'DAY' ? 0 : Math.random() * 0.05 - 0.025))
        );

        // Filter alarms based on user's plant access
        const allActiveAlarms = maintenanceService.getActiveAlarms();
        let filteredAlarms;

        if (!user || user.role === UserRole.ADMINISTRATOR || !user.plantAccess || user.plantAccess.length === 0) {
            filteredAlarms = allActiveAlarms;
        } else {
            const allowedPlantIds = user.plantAccess;
            filteredAlarms = allActiveAlarms.filter(alarm => {
                if (!alarm.machineId && !alarm.source) return false;
                return allowedPlantIds.some(plantId =>
                    (alarm.machineId && alarm.machineId.toUpperCase().includes(plantId)) ||
                    (alarm.source && alarm.source.toUpperCase().includes(plantId))
                );
            });
        }
        
        const activeAlarmsCount = filteredAlarms.length;

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
                value: config.value.toLocaleString('id-ID', {
                    maximumFractionDigits: 2
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
            output: plant.outputToday * 0.6, // Attributing 60% of output to completed shift
            target: 12000,
            oee: plant.oeeAvg * 1.02, // Slightly higher OEE
            status: 'COMPLETED'
        },
        {
            id: 2,
            name: 'Shift 2',
            time: '14:31 - 22:00',
            output: plant.outputToday * 0.4, // Attributing 40% to active shift
            target: 12000,
            oee: plant.oeeAvg,
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

    // --------------------------------------------------
    // LVMDP TREND WRAPPER
    // --------------------------------------------------
    getLVMDPTrend: (panelId: string, period: Period) => {
        return lvmdpService.getEnergyTrend(panelId, convertPeriod(period));
    }
};