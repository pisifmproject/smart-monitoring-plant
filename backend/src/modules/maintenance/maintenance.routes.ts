import express, { Request, Response } from 'express';
import { query } from '../../config/database';

const router = express.Router();

router.get('/maintenance-records', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM maintenance_records ORDER BY started_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/maintenance-records', async (req: Request, res: Response) => {
    const { machine_id, checked_by, note, status } = req.body;
    try {
        const result = await query(
            'INSERT INTO maintenance_records (machine_id, checked_by, note, status, started_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [machine_id, checked_by, note, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/maintenance-records/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query('SELECT * FROM maintenance_records WHERE id = $1', [id]);
        if (result.rows.length > 0) res.json(result.rows[0]);
        else res.status(404).json({ message: 'Record not found' });
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as maintenanceRouter };
