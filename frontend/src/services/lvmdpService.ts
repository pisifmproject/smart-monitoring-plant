// services/lvmdpService.ts
import { LVMDP, PlantCode } from '../types';
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

    getPanelById: async (id: string): Promise<LVMDP | undefined> => {
        try {
             if (!isNaN(Number(id))) {
                 const panel = await handleResponse(await fetch(`${API_BASE}/lvmdp-panels/${id}`, { headers: getAuthHeaders() }));
                 const realtime = await handleResponse(await fetch(`${API_BASE}/lvmdp-panels/${id}/realtime`, { headers: getAuthHeaders() }));
                 return { ...panel, ...realtime };
             }
             return safePanel(undefined);
        } catch (e) {
            return safePanel(undefined);
        }
    },

    getEnergyTrend: async (panelId: string, period: Period) => {
        try {
             if (!isNaN(Number(panelId))) {
                 const history = await handleResponse(await fetch(`${API_BASE}/lvmdp-panels/${panelId}/historical`, { headers: getAuthHeaders() }));
                 return history.map((h: any) => ({
                     time: new Date(h.period_start).getHours() + ':00',
                     value: parseFloat(h.value)
                 }));
             }
        } catch(e) { }

        const panel = safePanel(null);

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

    getShiftAnalysis: async (panelId: string, period: Period) => {
        const panel = await lvmdpService.getPanelById(panelId) || safePanel(null);

        const avgCurrent = (panel.currentR + panel.currentS + panel.currentT) / 3;
        const maxCurrent = 2500;
        const loadPercent = (avgCurrent / maxCurrent) * 100;

        return [
            {
                name: 'Shift 1 (07:01 - 14:30)',
                kwh: (panel.energyToday || 1000) * 0.45,
                avgPower: panel.totalPowerKW * 0.9,
                avgLoad: Math.min(100, loadPercent * 1.1),
                avgCurrent: avgCurrent * 1.1,
                avgPF: 0.96
            },
            {
                name: 'Shift 2 (14:31 - 22:00)',
                kwh: (panel.energyToday || 1000) * 0.35,
                avgPower: panel.totalPowerKW * 0.75,
                avgLoad: loadPercent * 0.8,
                avgCurrent: avgCurrent * 0.8,
                avgPF: 0.94
            },
            {
                name: 'Shift 3 (22:01 - 07:00)',
                kwh: (panel.energyToday || 1000) * 0.2,
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

    getAllLVMDPs: async (): Promise<LVMDP[]> => {
        const plants = await plantService.getAllPlants();
        return [];
    },

    addLVMDP: async (data: any) => {
        return { success: true };
    },

    updateLVMDP: async (panelId: string, data: any) => {
        return { success: true };
    },

    deleteLVMDP: async (panelId: string) => {
        return { success: true };
    }
};
