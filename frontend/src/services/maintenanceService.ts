// services/maintenanceService.ts
import { Alarm, AlarmSeverity, MaintenanceRecord, PlantCode, DowntimeLog } from '../types';
import { getAuthHeaders } from './auth';

const API_BASE = '/api/stable';

// Helper to handle API response
async function handleResponse(response: Response) {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

export const maintenanceService = {
  getActiveAlarms: async (plantId?: PlantCode | string): Promise<Alarm[]> => {
    return [];
  },

  hasActiveAlarm: async (machineId: string): Promise<boolean> => {
     const alarms = await maintenanceService.getMachineActiveAlarms(machineId);
     return alarms.length > 0;
  },

  getAlarmInProgress: async (machineId: string): Promise<string | undefined> => {
     return undefined;
  },

  getMachineActiveAlarms: async (machineId: string): Promise<Alarm[]> => {
     try {
         const alarms = await handleResponse(await fetch(`${API_BASE}/machines/${machineId}/alarms`, { headers: getAuthHeaders() }));
         return alarms.map((a: any) => ({
             id: a.id.toString(),
             machineId: a.machine_id?.toString(),
             timestamp: new Date(a.raised_at).toLocaleTimeString(),
             source: a.source || 'Unknown',
             message: a.message,
             severity: a.severity as AlarmSeverity,
             code: a.code,
             isActive: a.is_active,
             handledByMaintenance: false
         }));
     } catch(e) {
         return [];
     }
  },

  getAlarmHistory: async (machineId: string): Promise<Alarm[]> => {
     return maintenanceService.getMachineActiveAlarms(machineId);
  },

  getMaintenanceHistory: async (machineId: string): Promise<MaintenanceRecord[]> => {
    try {
        const records = await handleResponse(await fetch(`${API_BASE}/machines/${machineId}/maintenance-records`, { headers: getAuthHeaders() }));
        return records.map((r: any) => ({
            id: r.id.toString(),
            alarmId: r.alarm_id?.toString(),
            machineId: r.machine_id?.toString(),
            timestamp: new Date(r.started_at).toLocaleTimeString(),
            checkedBy: r.checked_by?.toString() || 'Unknown',
            solved: r.status === 'DONE',
            note: r.note,
            photoUrl: r.photo_url
        }));
    } catch(e) {
        return [];
    }
  },

  getDowntimeLogs: async (machineId: string): Promise<DowntimeLog[]> => {
    try {
        const logs = await handleResponse(await fetch(`${API_BASE}/machines/${machineId}/downtime`, { headers: getAuthHeaders() }));
        return logs.map((l: any) => ({
            id: l.id.toString(),
            machineId: l.machine_id?.toString(),
            start: new Date(l.start_time).toLocaleTimeString(),
            end: l.end_time ? new Date(l.end_time).toLocaleTimeString() : undefined,
            duration: l.duration_seconds ? Math.floor(l.duration_seconds / 60) : 0,
            reason: l.reason_code,
            description: l.description,
            category: l.source
        }));
    } catch(e) {
        return [];
    }
  },

  addDowntimeLog: async (log: Omit<DowntimeLog, 'id'>) => {
    return { ...log, id: 'temp' };
  },

  startMaintenance: async (alarmId: string, technicianName: string) => {

  },

  submitMaintenanceAction: async (
    record: Omit<MaintenanceRecord, 'id' | 'timestamp'>,
  ) => {
    try {
        const res = await handleResponse(await fetch(`${API_BASE}/maintenance-records`, {
            method: 'POST',
            headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({
                machine_id: record.machineId,
                checked_by: 1,
                note: record.note,
                status: record.solved ? 'DONE' : 'IN_PROGRESS'
            })
        }));
        return { ...record, id: res.id.toString(), timestamp: new Date().toLocaleTimeString() };
    } catch(e) {
        throw e;
    }
  },
};
