import { Request, Response } from 'express';
import { utilitiesService } from './utilities.service';

export const utilitiesController = {
    async getSummary(req: Request, res: Response) {
        try {
            const plantId = parseInt(req.params.plantId);
            const summary = await utilitiesService.getUtilitySummary(plantId);
            res.json(summary);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getTrend(req: Request, res: Response) {
        try {
             const plantId = parseInt(req.params.plantId);
             const trend = await utilitiesService.getUtilityTrend(plantId);

             if (trend.length === 0) {
                  res.json([
                    { time: '2023-01-01T00:00:00Z', value: 0 }
                  ]);
             } else {
                 res.json(trend);
             }
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getAreaConsumption(req: Request, res: Response) {
         try {
            const plantId = parseInt(req.params.plantId);
            const consumption = await utilitiesService.getAreaConsumption(plantId);
            res.json(consumption);
         } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
         }
    }
};
