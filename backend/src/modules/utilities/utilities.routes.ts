import express, { Request, Response } from 'express';
import { query } from '../../config/database';

const router = express.Router();

router.get('/plants/:plantId/utility-summary', async (req: Request, res: Response) => {
    try {
        const plantId = parseInt(req.params.plantId);
        // Aggregate consumption for current month (or latest period available)
        // Simplified query: sum all values for this plant

        // This is a placeholder logic. In real world, we need date filters.
        const electricity = await query(`
            SELECT SUM(value) as total, unit FROM utility_readings
            WHERE plant_id = $1 AND utility_type = 'ELECTRICITY'
            GROUP BY unit`, [plantId]);

        const water = await query(`
            SELECT SUM(value) as total, unit FROM utility_readings
            WHERE plant_id = $1 AND utility_type = 'WATER'
            GROUP BY unit`, [plantId]);

        const steam = await query(`
            SELECT SUM(value) as total, unit FROM utility_readings
            WHERE plant_id = $1 AND utility_type = 'STEAM'
            GROUP BY unit`, [plantId]);

        res.json({
            electricity: electricity.rows[0] ? { consumption: parseFloat(electricity.rows[0].total), unit: electricity.rows[0].unit } : { consumption: 0, unit: 'kWh' },
            water: water.rows[0] ? { consumption: parseFloat(water.rows[0].total), unit: water.rows[0].unit } : { consumption: 0, unit: 'm3' },
            steam: steam.rows[0] ? { consumption: parseFloat(steam.rows[0].total), unit: steam.rows[0].unit } : { consumption: 0, unit: 'ton' }
        });

    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/plants/:plantId/utility-trend', async (req: Request, res: Response) => {
    try {
         const plantId = parseInt(req.params.plantId);
         // Get electricity trend for last 7 days
         const result = await query(`
            SELECT period_start as time, value
            FROM utility_readings
            WHERE plant_id = $1 AND utility_type = 'ELECTRICITY' AND period_type = 'DAILY'
            ORDER BY period_start ASC LIMIT 7
         `, [plantId]);

         // If empty, return mock structure to avoid frontend break
         if (result.rows.length === 0) {
              res.json([
                { time: '2023-01-01T00:00:00Z', value: 0 }
              ]);
         } else {
             res.json(result.rows);
         }
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/plants/:plantId/utility-area-consumption', async (req: Request, res: Response) => {
     try {
        const plantId = parseInt(req.params.plantId);
        const result = await query(`
            SELECT area_name, value, utility_type
            FROM utility_area_consumption
            WHERE plant_id = $1
        `, [plantId]);
        res.json(result.rows);
     } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
     }
});

export { router as utilityRouter };
