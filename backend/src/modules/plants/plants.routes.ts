import express, { Request, Response } from 'express';
import { db } from '../../config/database';
import { plants, machines, lvmdpPanels } from '../../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(plants).orderBy(plants.id);
        res.json(result);
    } catch (err) {
        console.error('DB Error:', err);
        res.json([
             { id: 1, code: 'P01', name: 'Plant Jakarta (Fallback)', location: 'Jakarta', isActive: true },
             { id: 2, code: 'P02', name: 'Plant Surabaya (Fallback)', location: 'Surabaya', isActive: true }
        ]);
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { code, name, location } = req.body;
    try {
        const result = await db.insert(plants).values({ code, name, location }).returning();
        res.status(201).json(result[0]);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(plants).where(eq(plants.id, id));
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: 'Plant not found' });
        }
    } catch (err) {
         console.error('DB Error:', err);
         res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/machines', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(machines).where(eq(machines.plantId, id));
        res.json(result);
    } catch (err) {
         console.error('DB Error:', err);
         res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/lvmdp-panels', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(lvmdpPanels).where(eq(lvmdpPanels.plantId, id));
        res.json(result);
    } catch (err) {
         console.error('DB Error:', err);
         res.status(500).json({ error: 'Database error' });
    }
});

export { router as plantRouter };
