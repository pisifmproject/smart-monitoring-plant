import express, { Request, Response } from 'express';
import { db } from '../../config/database';
import { utilityReadings, utilityAreaConsumption } from '../../db/schema';
import { eq, and, sql } from 'drizzle-orm';

const router = express.Router();

router.get('/plants/:plantId/utility-summary', async (req: Request, res: Response) => {
    try {
        const plantId = parseInt(req.params.plantId);

        // Helper to query sum
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

        res.json({
            electricity: electricity ? { consumption: Number(electricity.total), unit: electricity.unit } : { consumption: 0, unit: 'kWh' },
            water: water ? { consumption: Number(water.total), unit: water.unit } : { consumption: 0, unit: 'm3' },
            steam: steam ? { consumption: Number(steam.total), unit: steam.unit } : { consumption: 0, unit: 'ton' }
        });

    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/plants/:plantId/utility-trend', async (req: Request, res: Response) => {
    try {
         const plantId = parseInt(req.params.plantId);
         const result = await db.select({
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

         if (result.length === 0) {
              res.json([
                { time: '2023-01-01T00:00:00Z', value: 0 }
              ]);
         } else {
             res.json(result);
         }
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/plants/:plantId/utility-area-consumption', async (req: Request, res: Response) => {
     try {
        const plantId = parseInt(req.params.plantId);
        const result = await db.select({
            area_name: utilityAreaConsumption.areaName,
            value: utilityAreaConsumption.value,
            utility_type: utilityAreaConsumption.utilityType
        })
        .from(utilityAreaConsumption)
        .where(eq(utilityAreaConsumption.plantId, plantId));

        res.json(result);
     } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
     }
});

export { router as utilityRouter };
