import { db } from '../../config/database';
import { utilityReadings, utilityAreaConsumption } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const utilitiesService = {
    async getUtilitySummary(plantId: number) {
        const getSum = async (type: 'ELECTRICITY' | 'WATER' | 'STEAM') => {
             const result = await db.select({
                 total: sql<number>`sum(${utilityReadings.value})`,
                 unit: utilityReadings.unit
             })
             .from(utilityReadings)
             .where(and(eq(utilityReadings.plantId, plantId), eq(utilityReadings.utilityType, type)))
             .groupBy(utilityReadings.unit);
             return result[0];
        };

        const electricity = await getSum('ELECTRICITY');
        const water = await getSum('WATER');
        const steam = await getSum('STEAM');

        return {
            electricity: electricity ? { consumption: Number(electricity.total), unit: electricity.unit } : { consumption: 0, unit: 'kWh' },
            water: water ? { consumption: Number(water.total), unit: water.unit } : { consumption: 0, unit: 'm3' },
            steam: steam ? { consumption: Number(steam.total), unit: steam.unit } : { consumption: 0, unit: 'ton' }
        };
    },

    async getUtilityTrend(plantId: number) {
         return await db.select({
             time: utilityReadings.periodStart,
             value: utilityReadings.value
         })
         .from(utilityReadings)
         .where(and(
             eq(utilityReadings.plantId, plantId),
             eq(utilityReadings.utilityType, 'ELECTRICITY'),
             eq(utilityReadings.periodType, 'DAILY')
         ))
         .orderBy(utilityReadings.periodStart)
         .limit(7);
    },

    async getAreaConsumption(plantId: number) {
        return await db.select({
            area_name: utilityAreaConsumption.areaName,
            value: utilityAreaConsumption.value,
            utility_type: utilityAreaConsumption.utilityType
        })
        .from(utilityAreaConsumption)
        .where(eq(utilityAreaConsumption.plantId, plantId));
    }
};
