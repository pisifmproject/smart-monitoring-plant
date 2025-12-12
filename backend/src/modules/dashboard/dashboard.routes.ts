import express, { Request, Response } from 'express';
import { query } from '../../config/database';

const router = express.Router();

router.get('/dashboard/global-summary', async (req: Request, res: Response) => {
    try {
        const plantsCount = await query('SELECT count(*) FROM plants WHERE is_active = true');
        const machinesCount = await query('SELECT count(*) FROM machines WHERE status = \'RUNNING\''); // Example logic
        const alarmsCount = await query('SELECT count(*) FROM alarms WHERE is_active = true');

        // Calculate efficiency (mock calculation or complex query)
        // Assume we have some daily production target vs actual
        const overallEfficiency = 87.5; // Placeholder

        res.json({
            totalPlants: parseInt(plantsCount.rows[0].count),
            activeMachines: parseInt(machinesCount.rows[0].count),
            totalAlarms: parseInt(alarmsCount.rows[0].count),
            overallEfficiency
        });
    } catch (err) {
        console.error('DB Error:', err);
        // Fallback
        res.json({
            totalPlants: 0,
            activeMachines: 0,
            totalAlarms: 0,
            overallEfficiency: 0
        });
    }
});

router.get('/plants/:plantId/dashboard-overview', async (req: Request, res: Response) => {
    try {
        const plantId = parseInt(req.params.plantId);

        // Mock calculations for dashboard
        const activeAlarms = await query('SELECT count(*) FROM alarms WHERE plant_id = $1 AND is_active = true', [plantId]);

        res.json({
            plantId,
            production: 15000, // Would be a SUM query on production logs
            efficiency: 92.5,  // Would be calculated from production / target
            activeAlarms: parseInt(activeAlarms.rows[0].count)
        });
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as dashboardRouter };
