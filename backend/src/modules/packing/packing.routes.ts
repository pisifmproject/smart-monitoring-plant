import express, { Request, Response } from 'express';
import { query } from '../../config/database';

const router = express.Router();

router.get('/plants/:plantId/packing-configs', async (req: Request, res: Response) => {
    try {
        const plantId = parseInt(req.params.plantId);
        const result = await query('SELECT * FROM packing_configs WHERE plant_id = $1', [plantId]);
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/packing-configs/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query('SELECT * FROM packing_configs WHERE id = $1', [id]);
        if (result.rows.length > 0) res.json(result.rows[0]);
        else res.status(404).json({ message: 'Config not found' });
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as packingRouter };
