import express, { Request, Response } from 'express';
import { db } from '../../config/database';
import { visibilityDataItems, visibilityRules } from '../../db/schema';

const router = express.Router();

router.get('/visibility/items', async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(visibilityDataItems);
        res.json(result);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/visibility/rules', async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(visibilityRules);
        res.json(result);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as visibilityRouter };
