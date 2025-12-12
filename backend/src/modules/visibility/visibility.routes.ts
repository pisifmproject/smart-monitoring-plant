import express, { Request, Response } from 'express';
import { query } from '../../config/database';

const router = express.Router();

router.get('/visibility/items', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM visibility_data_items');
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/visibility/rules', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM visibility_rules');
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as visibilityRouter };
