import { Request, Response } from 'express';
import { dashboardService } from './dashboard.service';

export const dashboardController = {
    async getGlobalSummary(req: Request, res: Response) {
        try {
            const summary = await dashboardService.getGlobalSummary();
            res.json(summary);
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
    },

    async getPlantOverview(req: Request, res: Response) {
        try {
            const plantId = parseInt(req.params.plantId);
            const overview = await dashboardService.getPlantOverview(plantId);
            res.json(overview);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    }
};
