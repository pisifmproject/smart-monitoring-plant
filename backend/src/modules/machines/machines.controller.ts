import { Request, Response } from 'express';
import { machinesService } from './machines.service';

export const machinesController = {
    async getAll(req: Request, res: Response) {
        try {
            const machines = await machinesService.getAllMachines();
            res.json(machines);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const machine = await machinesService.getMachineById(id);
            if (machine) {
                res.json(machine);
            } else {
                res.status(404).json({ message: 'Machine not found' });
            }
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getAlarms(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const alarms = await machinesService.getActiveAlarms(id);
            res.json(alarms);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getDowntime(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const logs = await machinesService.getDowntimeLogs(id);
            res.json(logs);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getPackingConfig(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const config = await machinesService.getPackingConfig(id);
            res.json(config); // returns null if not found, which is fine or can be 404
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    },

    async getMaintenanceRecords(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const records = await machinesService.getMaintenanceRecords(id);
            res.json(records);
        } catch (err) {
            console.error('DB Error:', err);
            res.status(500).json({ error: 'Database error' });
        }
    }
};
