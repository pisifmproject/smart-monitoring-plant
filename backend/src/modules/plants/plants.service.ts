import { db } from '../../config/database';
import { plants, machines, lvmdpPanels } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const plantsService = {
    async getAllPlants() {
        try {
            return await db.select().from(plants).orderBy(plants.id);
        } catch (err) {
            console.error('DB Error:', err);
            // Fallback
            return [
                 { id: 1, code: 'P01', name: 'Plant Jakarta (Fallback)', location: 'Jakarta', isActive: true },
                 { id: 2, code: 'P02', name: 'Plant Surabaya (Fallback)', location: 'Surabaya', isActive: true }
            ];
        }
    },

    async createPlant(data: { code: string, name: string, location: string }) {
        const result = await db.insert(plants).values(data).returning();
        return result[0];
    },

    async getPlantById(id: number) {
        const result = await db.select().from(plants).where(eq(plants.id, id));
        return result.length > 0 ? result[0] : null;
    },

    async getMachinesByPlantId(plantId: number) {
        return await db.select().from(machines).where(eq(machines.plantId, plantId));
    },

    async getLVMDPByPlantId(plantId: number) {
        return await db.select().from(lvmdpPanels).where(eq(lvmdpPanels.plantId, plantId));
    }
};
