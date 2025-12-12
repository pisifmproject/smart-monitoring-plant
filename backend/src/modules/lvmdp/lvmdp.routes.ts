import express, { Request, Response } from 'express';
import { db } from '../../config/database';
import { lvmdpPanels, utilityReadings } from '../../db/schema';
import { eq, desc, and } from 'drizzle-orm';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(lvmdpPanels).where(eq(lvmdpPanels.id, id));
        if (result.length > 0) res.json(result[0]);
        else res.status(404).json({ message: 'Panel not found' });
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/realtime', async (req: Request, res: Response) => {
    // Mock realtime data
    res.json({
        voltage: 220 + Math.random() * 10 - 5,
        current: 10 + Math.random() * 5,
        power: 2.2 + Math.random(),
        frequency: 50 + Math.random() * 0.1,
        timestamp: new Date()
    });
});

router.get('/:id/historical', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(utilityReadings)
            .where(and(eq(utilityReadings.panelId, id), eq(utilityReadings.utilityType, 'ELECTRICITY')))
            .orderBy(desc(utilityReadings.periodStart))
            .limit(24);
        res.json(result);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as lvmdpRouter };
