import { db } from '../../config/database';
import { lvmdpPanels, utilityReadings } from '../../db/schema';
import { eq, desc, and } from 'drizzle-orm';

export const lvmdpService = {
    async getPanelById(id: number) {
        const result = await db.select().from(lvmdpPanels).where(eq(lvmdpPanels.id, id));
        return result.length > 0 ? result[0] : null;
    },

    async getRealtimeData(id: number) {
        // Mock realtime data
        return {
            voltage: 220 + Math.random() * 10 - 5,
            current: 10 + Math.random() * 5,
            power: 2.2 + Math.random(),
            frequency: 50 + Math.random() * 0.1,
            timestamp: new Date()
        };
    },

    async getHistoricalData(id: number) {
        return await db.select().from(utilityReadings)
            .where(and(eq(utilityReadings.panelId, id), eq(utilityReadings.utilityType, 'ELECTRICITY')))
            .orderBy(desc(utilityReadings.periodStart))
            .limit(24);
    }
};
