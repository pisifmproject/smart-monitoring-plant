import express, { Request, Response } from 'express';
import { db } from '../../config/database';
import { plants, machines, alarms } from '../../db/schema';
import { eq, sql, count } from 'drizzle-orm';

const router = express.Router();

router.get('/dashboard/global-summary', async (req: Request, res: Response) => {
    try {
        const plantsCount = await db.select({ count: count() }).from(plants).where(eq(plants.isActive, true));
        const machinesCount = await db.select({ count: count() }).from(machines).where(eq(machines.status, 'RUNNING'));
        const alarmsCount = await db.select({ count: count() }).from(alarms).where(eq(alarms.isActive, true));

        const overallEfficiency = 87.5;

        res.json({
            totalPlants: plantsCount[0].count,
            activeMachines: machinesCount[0].count,
            totalAlarms: alarmsCount[0].count,
            overallEfficiency
        });
    } catch (err) {
        console.error('DB Error:', err);
        res.json({
            totalPlants: 0,
            activeMachines: 0,
            totalAlarms: 0,
            overallEfficiency: 0
        });
    }
});

router.get('/plants/:plantId/dashboard-overview', async (req: Request, res: Response) => {
    try {
        const plantId = parseInt(req.params.plantId);

        const activeAlarms = await db.select({ count: count() })
            .from(alarms)
            .where(and(eq(alarms.plantId, plantId), eq(alarms.isActive, true)));

        res.json({
            plantId,
            production: 15000,
            efficiency: 92.5,
            activeAlarms: activeAlarms[0].count
        });
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

import { and } from 'drizzle-orm';

export { router as dashboardRouter };
