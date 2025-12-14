
//dashboardService.ts

import { PLANTS } from './mockData';
import { maintenanceService } from './maintenanceService';
import { utilityService } from './utilityService';
// FIX: Import lvmdpService to resolve reference error in getLVMDPTrend.
import { lvmdpService } from './lvmdpService';
import { PlantCode, Plant, MachineStatus } from '../types';
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
    // ISO 50001 ENERGY METRICS
    // --------------------------------------------------
    getISO50001Metrics: (plantId: string, period: Period) => {
        const plant = PLANTS[plantId as PlantCode];
        if (!plant) return null;

        const multiplier = period === 'DAY' ? 1 : period === 'WEEK' ? 6.5 : period === 'MONTH' ? 28 : 340;
        
        const totalEnergyKWh = plant.energyTotal * multiplier;
        const totalProductionKg = plant.outputToday * multiplier;
        
        // Specific Energy Consumption (EnPI) = Energy / Production
        const sec = totalProductionKg > 0 ? totalEnergyKWh / totalProductionKg : 0;
        
        // Mock Baseline (EnB) - assuming standard is slightly higher than current for demo "good performance"
        const secBaseline = sec * 1.05; 
        
        // Carbon Footprint (approx 0.85 kg CO2e per kWh for grid electricity in some regions)
        const co2Emissions = totalEnergyKWh * 0.85;

        // Mock Cost
        const energyCost = totalEnergyKWh * 1445; // IDR per kWh

        return {
            totalEnergyKWh,
            totalProductionKg,
            sec,
            secBaseline,
            co2Emissions, // kg CO2
            energyCost
        };
    },

    // --------------------------------------------------
    // PRODUCTION LINE AGGREGATES
    // --------------------------------------------------
    getProductionAggregateStats: (plantId: string, period: Period) => {
        const plant = PLANTS[plantId as PlantCode];
        if (!plant) return null;

        const machines = plant.machines;
        const totalMachines = machines.length;
        
        const statusCounts = {
            [MachineStatus.RUNNING]: machines.filter(m => m.status === MachineStatus.RUNNING).length,
            [MachineStatus.IDLE]: machines.filter(m => m.status === MachineStatus.IDLE).length,
            [MachineStatus.BREAKDOWN]: machines.filter(m => m.status === MachineStatus.BREAKDOWN).length,
            [MachineStatus.OFFLINE]: machines.filter(m => m.status === MachineStatus.OFFLINE).length,
        };

        const avgAvailability = machines.reduce((sum, m) => sum + (m.availability || 0), 0) / totalMachines;
        const avgPerformance = machines.reduce((sum, m) => sum + (m.performance || 0), 0) / totalMachines;
        const avgQuality = machines.reduce((sum, m) => sum + (m.quality || 0), 0) / totalMachines;
        const avgOEE = machines.reduce((sum, m) => sum + m.oee, 0) / totalMachines;

        const totalOutput = machines.reduce((sum, m) => {
             const multiplier = period === 'DAY' ? 24 : period === 'WEEK' ? 168 : period === 'MONTH' ? 720 : 8760;
             return sum + (m.outputPerHour * multiplier * 0.8); // 0.8 utilization factor approximation
        }, 0);

        return {
            totalMachines,
            statusCounts,
            oee: {
                availability: avgAvailability,
                performance: avgPerformance,
                quality: avgQuality,
                overall: avgOEE
            },
            totalOutput
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
                color: config.color,
                // Add trend for ISO 50001 dashboard
                trend: config.trend,
                trendBase: config.trendBase
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
