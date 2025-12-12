import { Request, Response } from 'express';
import { lvmdpService } from './lvmdp.service';

export const lvmdpController = {
    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const panel = await lvmdpService.getPanelById(id);
            if (panel) {
                res.json(panel);
            } else {
                res.status(404).json({ message: 'Panel not found' });
            }
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getRealtime(req: Request, res: Response) {
        const id = parseInt(req.params.id);
        const data = await lvmdpService.getRealtimeData(id);
        res.json(data);
    },

    async getHistorical(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const data = await lvmdpService.getHistoricalData(id);
            res.json(data);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    }
};
