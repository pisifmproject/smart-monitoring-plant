import { Request, Response } from 'express';
import { packingService } from './packing.service';

export const packingController = {
    async getByPlantId(req: Request, res: Response) {
        try {
            const plantId = parseInt(req.params.plantId);
            const configs = await packingService.getConfigsByPlantId(plantId);
            res.json(configs);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const config = await packingService.getConfigById(id);
            if (config) {
                res.json(config);
            } else {
                res.status(404).json({ message: 'Config not found' });
            }
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    }
};
