import express, { Request, Response } from 'express';
import { query } from '../../config/database';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await query('SELECT * FROM lvmdp_panels WHERE id = $1', [id]);
        if (result.rows.length > 0) res.json(result.rows[0]);
        else res.status(404).json({ message: 'Panel not found' });
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/realtime', async (req: Request, res: Response) => {
    // In a real system, this might come from a different table or a time-series DB, or just the latest reading
    // For now, we simulate or fetch latest reading if we had a table for realtime snapshots
    // Let's try to fetch latest reading from utility_readings if applicable, or return mock

    // Using mock for realtime nature as it changes often and might not be stored permanently in the same way
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
        // Fetch last 24 hours hourly data for electricity
        const result = await query(`
            SELECT * FROM utility_readings
            WHERE panel_id = $1 AND utility_type = 'ELECTRICITY'
            ORDER BY period_start DESC LIMIT 24
        `, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as lvmdpRouter };
