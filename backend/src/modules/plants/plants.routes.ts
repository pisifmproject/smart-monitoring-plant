import express, { Request, Response } from 'express';
import { query } from '../../config/database';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM plants ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        // Fallback for demo if DB not available
        res.json([
             { id: 1, code: 'P01', name: 'Plant Jakarta (Fallback)', location: 'Jakarta', is_active: true },
             { id: 2, code: 'P02', name: 'Plant Surabaya (Fallback)', location: 'Surabaya', is_active: true }
        ]);
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { code, name, location } = req.body;
    try {
        const result = await query(
            'INSERT INTO plants (code, name, location) VALUES ($1, $2, $3) RETURNING *',
            [code, name, location]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query('SELECT * FROM plants WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
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
        const result = await query('SELECT * FROM machines WHERE plant_id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
         console.error('DB Error:', err);
         res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/lvmdp-panels', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query('SELECT * FROM lvmdp_panels WHERE plant_id = $1', [id]);
        res.json(result.rows);
    } catch (err) {
         console.error('DB Error:', err);
         res.status(500).json({ error: 'Database error' });
    }
});

export { router as plantRouter };
