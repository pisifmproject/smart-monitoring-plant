import { Request, Response } from 'express';
import { maintenanceService } from './maintenance.service';

export const maintenanceController = {
    async getAll(req: Request, res: Response) {
        try {
            const records = await maintenanceService.getAllRecords();
            res.json(records);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async create(req: Request, res: Response) {
        try {
            const record = await maintenanceService.createRecord(req.body);
            res.status(201).json(record);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const record = await maintenanceService.getRecordById(id);
            if (record) {
                res.json(record);
            } else {
                res.status(404).json({ message: 'Record not found' });
            }
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    }
};
