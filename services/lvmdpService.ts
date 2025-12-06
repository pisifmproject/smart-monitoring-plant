//lvmdpService.ts

import { getLVMDPById } from './mockData';
import { LVMDP } from '../types';

type Period = 'Day' | 'Week' | 'Month' | 'Year';

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
        return safePanel(getLVMDPById(id));
    },

    // Trend Data generation (works for all periods)
    getEnergyTrend: (panelId: string, period: Period) => {
        const panel = safePanel(getLVMDPById(panelId));

        const multiplier =
            period === 'Day'
                ? 1
                : period === 'Week'
                ? 7
                : period === 'Month'
                ? 30
                : 365;

        const points =
            period === 'Day'
                ? 24
                : period === 'Week'
                ? 7
                : period === 'Month'
                ? 30
                : 12;

        const labels =
            period === 'Day'
                ? (i: number) => `${i}:00`
                : period === 'Week'
                ? (i: number) =>
                      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]
                : period === 'Month'
                ? (i: number) => `D${i + 1}`
                : (i: number) => `M${i + 1}`;

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
        const panel = safePanel(getLVMDPById(panelId));

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
    }
};
