import express, { Request, Response } from 'express';
import { db } from '../../config/database';
import { packingConfigs } from '../../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.get('/plants/:plantId/packing-configs', async (req: Request, res: Response) => {
    try {
        const plantId = parseInt(req.params.plantId);
        const result = await db.select().from(packingConfigs).where(eq(packingConfigs.plantId, plantId));
        res.json(result);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/packing-configs/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(packingConfigs).where(eq(packingConfigs.id, id));
        if (result.length > 0) res.json(result[0]);
        else res.status(404).json({ message: 'Config not found' });
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as packingRouter };
