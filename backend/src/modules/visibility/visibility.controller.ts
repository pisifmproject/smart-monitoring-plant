import { Request, Response } from 'express';
import { visibilityService } from './visibility.service';

export const visibilityController = {
    async getItems(req: Request, res: Response) {
        try {
            const items = await visibilityService.getItems();
            res.json(items);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getRules(req: Request, res: Response) {
        try {
            const rules = await visibilityService.getRules();
            res.json(rules);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    }
};
