import express, { Request, Response } from 'express';
import { db } from '../../config/database';
import { maintenanceRecords } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();

router.get('/maintenance-records', async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(maintenanceRecords).orderBy(desc(maintenanceRecords.startedAt));
        res.json(result);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/maintenance-records', async (req: Request, res: Response) => {
    const { machine_id, checked_by, note, status } = req.body;
    try {
        const result = await db.insert(maintenanceRecords).values({
            machineId: machine_id,
            checkedBy: checked_by,
            note,
            status,
            startedAt: new Date()
        }).returning();
        res.status(201).json(result[0]);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

router.get('/maintenance-records/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.select().from(maintenanceRecords).where(eq(maintenanceRecords.id, id));
        if (result.length > 0) res.json(result[0]);
        else res.status(404).json({ message: 'Record not found' });
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

export { router as maintenanceRouter };
