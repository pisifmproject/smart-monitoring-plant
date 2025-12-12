import express, { Request, Response } from 'express';
import { db } from '../../config/database';
import { machines, alarms, downtimeLogs, packingConfigs, maintenanceRecords } from '../../db/schema';
import { eq, desc, and } from 'drizzle-orm';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(machines).orderBy(machines.id);
        res.json(result);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(machines).where(eq(machines.id, id));
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: 'Machine not found' });
        }
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/alarms', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(alarms)
            .where(and(eq(alarms.machineId, id), eq(alarms.isActive, true)))
            .orderBy(desc(alarms.raisedAt));
        res.json(result);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/downtime', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(downtimeLogs)
            .where(eq(downtimeLogs.machineId, id))
            .orderBy(desc(downtimeLogs.startTime))
            .limit(50);
        res.json(result);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/packing-config', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(packingConfigs)
            .where(and(eq(packingConfigs.machineId, id), eq(packingConfigs.isActive, true)))
            .limit(1);
        if (result.length > 0) res.json(result[0]);
        else res.json(null);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/:id/maintenance-records', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(maintenanceRecords)
            .where(eq(maintenanceRecords.machineId, id))
            .orderBy(desc(maintenanceRecords.startedAt));
        res.json(result);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as machineRouter };
