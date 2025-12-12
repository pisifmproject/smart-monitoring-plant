import express, { Request, Response } from 'express';
import { query } from '../../config/database';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await query('SELECT * FROM machines ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query('SELECT * FROM machines WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'Machine not found' });
        }
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/alarms', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query(
            'SELECT * FROM alarms WHERE machine_id = $1 AND is_active = TRUE ORDER BY raised_at DESC',
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/downtime', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query(
            'SELECT * FROM downtime_logs WHERE machine_id = $1 ORDER BY start_time DESC LIMIT 50',
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/packing-config', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query(
            'SELECT * FROM packing_configs WHERE machine_id = $1 AND is_active = TRUE LIMIT 1',
            [id]
        );
        if (result.rows.length > 0) res.json(result.rows[0]);
        else res.json(null);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/maintenance-records', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query(
            'SELECT * FROM maintenance_records WHERE machine_id = $1 ORDER BY started_at DESC',
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as machineRouter };
