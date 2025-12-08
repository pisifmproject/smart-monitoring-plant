//lvmdpService.ts

import { PLANTS } from './mockData';
import { LVMDP, PlantCode } from '../types';

type Period = 'Day' | 'Week' | 'Month' | 'Year';

// --- Private helper to find LVMDP and its plant ---
const findLVMDPAndPlant = (lvmdpId: string): { panel: LVMDP, plant: any } | null => {
    for (const plant of Object.values(PLANTS)) {
        const panel = plant.lvmdps.find(p => p.id === lvmdpId);
        if (panel) {
            return { panel, plant };
        }
    }
    return null;
};

// fallback panel to prevent UI blank screens
const safePanel = (panel: any) => {
    if (!panel) {
        return {
            id: 'DUMMY_LVMDP',
            name: 'Demo Panel',
            totalPowerKW: 320,
            totalPowerKVA: 360,
            totalPowerKVAR: 110,
            powerFactor: 0.92,
            frequency: 50,
            currentLoadPercent: 65,
            voltageRS: 400,
            voltageST: 401,
            voltageTR: 402,
            currentR: 1200,
            currentS: 1180,
            currentT: 1220,
            thdV: 2.5,
            thdI: 5.3,
            energyToday: 4200,
            breakerStatus: 'CLOSED',
            doorOpen: false
        };
    }
    return panel;
};

export const lvmdpService = {

    getPanelById: (id: string): LVMDP | undefined => {
        return safePanel(findLVMDPAndPlant(id)?.panel);
    },

    // Trend Data generation (works for all periods)
    getEnergyTrend: (panelId: string, period: Period) => {
        const panel = safePanel(lvmdpService.getPanelById(panelId));

        const multiplier =
            period === 'Day'
                ? 1
                : period === 'Week'
                ? 7
                : period === 'Month'
                ? 30
                : 365;

        let points: number;
        let labels: (i: number) => string;

        if (period === 'Day') {
            points = 24;
            labels = (i: number) => `${i}:00`;
        } else if (period === 'Week') {
            points = 7;
            labels = (i: number) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
        } else if (period === 'Month') {
            const now = new Date();
            points = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            labels = (i: number) => `Day ${i + 1}`;
        } else { // Year
            points = 12;
            labels = (i: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
        }

        return Array.from({ length: points }, (_, i) => ({
            time: labels(i),
            value:
                panel.totalPowerKW *
                (0.6 + Math.random() * 0.4) *
                multiplier *
                (period === 'Day' ? 1 : 24) /
                points
        }));
    },

    // Shift Summary for LVMDP
    getShiftAnalysis: (panelId: string, period: Period) => {
        const panel = safePanel(lvmdpService.getPanelById(panelId));

        const avgCurrent = (panel.currentR + panel.currentS + panel.currentT) / 3;
        const maxCurrent = 2500;
        const loadPercent = (avgCurrent / maxCurrent) * 100;

        return [
            {
                name: 'Shift 1 (07:01 - 14:30)',
                kwh: panel.energyToday * 0.45,
                avgPower: panel.totalPowerKW * 0.9,
                avgLoad: Math.min(100, loadPercent * 1.1),
                avgCurrent: avgCurrent * 1.1,
                avgPF: 0.96
            },
            {
                name: 'Shift 2 (14:31 - 22:00)',
                kwh: panel.energyToday * 0.35,
                avgPower: panel.totalPowerKW * 0.75,
                avgLoad: loadPercent * 0.8,
                avgCurrent: avgCurrent * 0.8,
                avgPF: 0.94
            },
            {
                name: 'Shift 3 (22:01 - 07:00)',
                kwh: panel.energyToday * 0.2,
                avgPower: panel.totalPowerKW * 0.4,
                avgLoad: loadPercent * 0.5,
                avgCurrent: avgCurrent * 0.5,
                avgPF: 0.92
            }
        ];
    },

    getDeltas: (panelId: string) => {
        return {
            kw: 2.4,
            kva: -1.1,
            kvar: 0.7,
            pf: -0.02,
            v_rs: 0.1,
            v_st: 0.0,
            v_tr: -0.2
        };
    },

    // --- CRUD Operations for LVMDPs ---
    getAllLVMDPs: (): LVMDP[] => {
        return Object.values(PLANTS).flatMap(plant => plant.lvmdps);
    },

    addLVMDP: (data: { name: string, plantId: PlantCode }): { success: boolean, message?: string } => {
        const plant = PLANTS[data.plantId];
        if (!plant) {
            return { success: false, message: "Plant not found." };
        }
        const newIndex = plant.lvmdps.length + 1;
        const newPanel: LVMDP = {
            id: `${data.plantId}-LVMDP-${newIndex}-${Date.now()}`,
            code: `LVMDP-${newIndex}`,
            name: data.name,
            plantId: data.plantId,
            status: 'NORMAL',
            totalPowerKW: 250,
            totalPowerKVA: 275,
            totalPowerKVAR: 115,
            powerFactor: 0.9,
            frequency: 50.0,
            currentLoadPercent: 50,
            voltageRS: 400, voltageST: 400, voltageTR: 400,
            currentR: 400, currentS: 400, currentT: 400,
            unbalanceVoltage: 0.5, unbalanceCurrent: 1.0,
            energyToday: 0, energyMTD: 0, energyTotal: 0,
            thdV: 2.0, thdI: 3.0,
            panelTemp: 40,
            breakerStatus: 'CLOSED',
            doorOpen: false,
        };
        plant.lvmdps.push(newPanel);
        return { success: true };
    },

    updateLVMDP: (panelId: string, data: { name: string }): { success: boolean, message?: string } => {
        const result = findLVMDPAndPlant(panelId);
        if (!result) {
            return { success: false, message: "LVMDP Panel not found." };
        }
        result.panel.name = data.name;
        return { success: true };
    },

    deleteLVMDP: (panelId: string): { success: boolean, message?: string } => {
        const result = findLVMDPAndPlant(panelId);
        if (!result) {
            return { success: false, message: "LVMDP Panel not found." };
        }
        result.plant.lvmdps = result.plant.lvmdps.filter(p => p.id !== panelId);
        return { success: true };
    }
};