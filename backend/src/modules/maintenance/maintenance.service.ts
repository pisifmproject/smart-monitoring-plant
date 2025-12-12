import { db } from '../../config/database';
import { maintenanceRecords } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

export const maintenanceService = {
    async getAllRecords() {
        return await db.select().from(maintenanceRecords).orderBy(desc(maintenanceRecords.startedAt));
    },

    async createRecord(data: { machine_id: number, checked_by: number, note: string, status: 'OPEN' | 'IN_PROGRESS' | 'DONE' }) {
        const result = await db.insert(maintenanceRecords).values({
            machineId: data.machine_id,
            checkedBy: data.checked_by,
            note: data.note,
            status: data.status,
            startedAt: new Date()
        }).returning();
        return result[0];
    },

    async getRecordById(id: number) {
        const result = await db.select().from(maintenanceRecords).where(eq(maintenanceRecords.id, id));
        return result.length > 0 ? result[0] : null;
    }
};
