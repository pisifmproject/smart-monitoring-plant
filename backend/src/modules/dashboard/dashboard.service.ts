import { db } from '../../config/database';
import { plants, machines, alarms } from '../../db/schema';
import { eq, count, and } from 'drizzle-orm';

export const dashboardService = {
    async getGlobalSummary() {
        const plantsCount = await db.select({ count: count() }).from(plants).where(eq(plants.isActive, true));
        const machinesCount = await db.select({ count: count() }).from(machines).where(eq(machines.status, 'RUNNING'));
        const alarmsCount = await db.select({ count: count() }).from(alarms).where(eq(alarms.isActive, true));

        return {
            totalPlants: plantsCount[0].count,
            activeMachines: machinesCount[0].count,
            totalAlarms: alarmsCount[0].count,
            overallEfficiency: 87.5
        };
    },

    async getPlantOverview(plantId: number) {
        const activeAlarms = await db.select({ count: count() })
            .from(alarms)
            .where(and(eq(alarms.plantId, plantId), eq(alarms.isActive, true)));

        return {
            plantId,
            production: 15000,
            efficiency: 92.5,
            activeAlarms: activeAlarms[0].count
        };
    }
};
