// services/packingConfigService.ts

import { 
    CIKUPA_PACKING_LINES,
    CIKOKOL_PACKING_LINES,
    SEMARANG_PACKING_LINES, 
    PLANTS,
    generateSingleBagmakerDetails,
    generateSingleWeigherDetails
} from './mockData';
import { PackingLineConfig, PlantCode, Machine, MachineType, MachineStatus } from '../types';
import { plantService } from './plantService';

// Helper to get the correct data array based on plantId
const getLinesForPlant = (plantId: PlantCode): PackingLineConfig[] => {
    if (plantId === PlantCode.CIKOKOL) {
        return CIKOKOL_PACKING_LINES;
    }
    if (plantId === PlantCode.SEMARANG) {
        return SEMARANG_PACKING_LINES;
    }
    // Default to Cikupa
    return CIKUPA_PACKING_LINES;
};


export const packingConfigService = {
    getPackingLines: (plantId: PlantCode): PackingLineConfig[] => {
        return [...getLinesForPlant(plantId)];
    },

    addPackingLine: (plantId: PlantCode, data: { lineName: string, bagmakers: number, weighers: number }): { success: boolean, message?: string } => {
        const lines = getLinesForPlant(plantId);
        const existingConfig = lines.find(l => l.lineName.toLowerCase() === data.lineName.toLowerCase());
        if (existingConfig) {
            return { success: false, message: `Packing line config for '${data.lineName}' already exists.` };
        }

        // NEW LOGIC: Check if machine exists first
        const plant = PLANTS[plantId];
        if (!plant) {
            return { success: false, message: "Plant not found." };
        }

        const machineIndex = plant.machines.findIndex(m => m.name.toLowerCase() === data.lineName.toLowerCase());
        
        if (machineIndex === -1) {
            // Machine does NOT exist, return error.
            return { success: false, message: `Machine '${data.lineName}' not found. Please add it in the 'Machines' tab first.` };
        }

        // Machine EXISTS, proceed to update it.
        
        // 1. Add to packing config array
        lines.push({
            lineName: data.lineName,
            bagmakers: data.bagmakers,
            weighers: data.weighers
        });

        // 2. Update the existing machine to be a multi-unit packing machine
        const machineToUpdate = plant.machines[machineIndex];
        
        // Remove single-unit properties if they exist
        delete machineToUpdate.weigher;
        delete machineToUpdate.bagmaker;

        // Add multi-unit properties
        machineToUpdate.bagmakerUnits = Array.from({ length: data.bagmakers }, () => generateSingleBagmakerDetails());
        machineToUpdate.weigherUnits = Array.from({ length: data.weighers }, () => generateSingleWeigherDetails());
        
        // Also update the type just in case
        machineToUpdate.type = MachineType.PACKING;
        
        return { success: true };
    },

    updatePackingLine: (plantId: PlantCode, lineName: string, data: { bagmakers: number, weighers: number }): { success: boolean, message?: string } => {
        const lines = getLinesForPlant(plantId);
        const lineIndex = lines.findIndex(l => l.lineName === lineName);
        if (lineIndex === -1) {
            return { success: false, message: 'Packing line not found.' };
        }
        
        // 1. Update the configuration array
        lines[lineIndex] = {
            ...lines[lineIndex],
            bagmakers: data.bagmakers,
            weighers: data.weighers
        };

        // 2. Find and update the corresponding machine in the correct plant to sync data
        const plant = PLANTS[plantId];
        if (plant) {
            const machineIndex = plant.machines.findIndex(m => m.name === lineName);
            if (machineIndex !== -1) {
                // Regenerate the units for this machine to reflect the new counts
                plant.machines[machineIndex] = {
                    ...plant.machines[machineIndex],
                    bagmakerUnits: Array.from({ length: data.bagmakers }, () => generateSingleBagmakerDetails()),
                    weigherUnits: Array.from({ length: data.weighers }, () => generateSingleWeigherDetails()),
                };
            }
        }

        return { success: true };
    },

    deletePackingLine: (plantId: PlantCode, lineName: string): { success: boolean, message?: string } => {
        const lines = getLinesForPlant(plantId);
        const lineIndex = lines.findIndex(l => l.lineName === lineName);

        if (lineIndex === -1) {
             return { success: false, message: 'Packing line not found.' };
        }

        lines.splice(lineIndex, 1);

        // Also remove the corresponding machine from the correct plant
        const plant = PLANTS[plantId];
        if (plant) {
            const machineToDelete = plant.machines.find(m => m.name === lineName);
            if (machineToDelete) {
                plantService.deleteMachine(machineToDelete.id);
            }
        }

        return { success: true };
    }
};