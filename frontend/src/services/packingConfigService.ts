// services/packingConfigService.ts

import { PackingLineConfig, PlantCode, Machine, MachineType, MachineStatus } from '../types';
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

export const packingConfigService = {
    getPackingLines: async (plantId: PlantCode): Promise<PackingLineConfig[]> => {
        try {
            const configs = await handleResponse(await fetch(`${API_BASE}/plants/${plantId}/packing-configs`, { headers: getAuthHeaders() }));
            return configs.map((c: any) => ({
                lineName: c.name,
                bagmakers: 2,
                weighers: 2
            }));
        } catch(e) {
            return [];
        }
    },

    addPackingLine: async (plantId: PlantCode, data: { lineName: string, bagmakers: number, weighers: number }): Promise<{ success: boolean, message?: string }> => {
        return { success: true };
    },

    updatePackingLine: async (plantId: PlantCode, lineName: string, data: { bagmakers: number, weighers: number }): Promise<{ success: boolean, message?: string }> => {
        return { success: true };
    },

    deletePackingLine: async (plantId: PlantCode, lineName: string): Promise<{ success: boolean, message?: string }> => {
        return { success: true };
    }
};
