import { db } from '../../config/database';
import { packingConfigs } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const packingService = {
    async getConfigsByPlantId(plantId: number) {
        return await db.select().from(packingConfigs).where(eq(packingConfigs.plantId, plantId));
    },

    async getConfigById(id: number) {
        const result = await db.select().from(packingConfigs).where(eq(packingConfigs.id, id));
        return result.length > 0 ? result[0] : null;
    }
};
