import { db } from '../../config/database';
import { machines, alarms, downtimeLogs, packingConfigs, maintenanceRecords } from '../../db/schema';
import { eq, desc, and } from 'drizzle-orm';

export const machinesService = {
    async getAllMachines() {
        return await db.select().from(machines).orderBy(machines.id);
    },

    async getMachineById(id: number) {
        const result = await db.select().from(machines).where(eq(machines.id, id));
        return result.length > 0 ? result[0] : null;
    },

    async getActiveAlarms(machineId: number) {
        return await db.select().from(alarms)
            .where(and(eq(alarms.machineId, machineId), eq(alarms.isActive, true)))
            .orderBy(desc(alarms.raisedAt));
    },

    async getDowntimeLogs(machineId: number) {
        return await db.select().from(downtimeLogs)
            .where(eq(downtimeLogs.machineId, machineId))
            .orderBy(desc(downtimeLogs.startTime))
            .limit(50);
    },

    async getPackingConfig(machineId: number) {
        const result = await db.select().from(packingConfigs)
            .where(and(eq(packingConfigs.machineId, machineId), eq(packingConfigs.isActive, true)))
            .limit(1);
        return result.length > 0 ? result[0] : null;
    },

    async getMaintenanceRecords(machineId: number) {
        return await db.select().from(maintenanceRecords)
            .where(eq(maintenanceRecords.machineId, machineId))
            .orderBy(desc(maintenanceRecords.startedAt));
    }
};
