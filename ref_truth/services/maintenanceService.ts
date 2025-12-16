
// services/maintenanceService.ts

import {
  Alarm,
  AlarmSeverity,
  MaintenanceRecord,
  PlantCode,
  DowntimeLog
} from '../types';
import { MOCK_DOWNTIME_LOGS } from './mockData';

// -----------------------------------------------------
// Initial Mock Data
// -----------------------------------------------------
const INITIAL_ALARMS: Alarm[] = [
  {
    id: '1',
    machineId: 'CIKOKOL-M-1',
    timestamp: '10:15:00',
    source: 'PC14_SM',
    message: 'Oil Temp High',
    severity: AlarmSeverity.WARNING,
    code: 'W-001',
    isActive: true,
    handledByMaintenance: false,
  },
  {
    id: '2',
    machineId: 'CIKOKOL-LVMDP-2',
    timestamp: '10:10:00',
    source: 'LVMDP-2 Cikokol',
    message: 'THD-V Warning',
    severity: AlarmSeverity.WARNING,
    code: 'W-002',
    isActive: true,
    handledByMaintenance: false,
  },
  {
    id: '3',
    machineId: 'SEMARANG-M-3',
    timestamp: '09:45:00',
    source: 'Extruder Semarang',
    message: 'Motor Trip',
    severity: AlarmSeverity.CRITICAL,
    code: 'C-001',
    isActive: true,
    handledByMaintenance: false,
  },
  {
    id: '4',
    machineId: 'CIKOKOL-M-4',
    timestamp: '08:30:00',
    source: 'Boiler 1 Cikokol',
    message: 'Low Pressure',
    severity: AlarmSeverity.INFO,
    code: 'I-001',
    isActive: false,
    handledByMaintenance: true,
  },
  {
    id: '5',
    machineId: 'SEMARANG-M-0',
    timestamp: '11:20:00',
    source: 'PC32_SEMARANG',
    message: 'Conveyor Jam',
    severity: AlarmSeverity.CRITICAL,
    code: 'C-002',
    isActive: true,
    handledByMaintenance: false,
  },
  {
    id: '6',
    machineId: 'CIKUPA-LVMDP-1',
    timestamp: '11:15:00',
    source: 'LVMDP-1 Cikupa',
    message: 'Overcurrent Phase R',
    severity: AlarmSeverity.WARNING,
    code: 'W-003',
    isActive: true,
    handledByMaintenance: false,
  },
  {
    id: '7',
    machineId: 'CIKUPA-M-8',
    timestamp: '11:00:00',
    source: 'Packing Pouch Cikupa',
    message: 'Sealer Temp Low',
    severity: AlarmSeverity.WARNING,
    code: 'W-004',
    isActive: true,
    handledByMaintenance: false,
  },
  {
    id: '8',
    machineId: 'CIKOKOL-M-5',
    timestamp: '10:55:00',
    source: 'Batch Fryer Cikokol',
    message: 'Oil Level Low',
    severity: AlarmSeverity.WARNING,
    code: 'W-005',
    isActive: true,
    handledByMaintenance: false,
  },
];

const INITIAL_HISTORY: MaintenanceRecord[] = [
  {
    id: 'hist-1',
    alarmId: '4',
    machineId: 'CIKOKOL-M-4',
    timestamp: '08:45:00',
    checkedBy: 'Budi Saputra',
    solved: true,
    note: 'Pressure valve adjusted. System normal.',
  },
];

// -----------------------------------------------------
// In-memory state
// -----------------------------------------------------
let alarms: Alarm[] = [...INITIAL_ALARMS];
let maintenanceHistory: MaintenanceRecord[] = [...INITIAL_HISTORY];
let downtimeLogs: DowntimeLog[] = [...MOCK_DOWNTIME_LOGS];

// Helper untuk buat alarm dummy kalau mesin belum punya alarm
const createDummyAlarmForMachine = (machineId: string): Alarm => {
  const now = new Date();
  const time = now.toTimeString().slice(0, 8);

  const alarm: Alarm = {
    id: `dummy-alarm-${machineId}`,
    machineId,
    timestamp: time,
    source: machineId,
    message: 'Demo alarm for visualization',
    severity: AlarmSeverity.WARNING,
    code: 'D-ALM',
    isActive: true,
    handledByMaintenance: false,
  };

  alarms.push(alarm);
  return alarm;
};

export const maintenanceService = {
  // Active alarms (global atau per plant)
  getActiveAlarms: (plantId?: PlantCode | string) => {
    let active = alarms.filter((a) => a.isActive);
    if (plantId) {
      const pid = plantId.toString().toUpperCase();
      active = active.filter(
        (a) =>
          (a.machineId && a.machineId.toUpperCase().includes(pid)) ||
          a.source.toUpperCase().includes(pid),
      );

      // Kalau filter per plant kosong, buat satu dummy supaya list tidak kosong
      if (active.length === 0) {
        const dummy = createDummyAlarmForMachine(`${pid}-M-DEMO`);
        active = [dummy];
      }
    }
    return active;
  },

  hasActiveAlarm: (machineId: string): boolean => {
    return alarms.some((a) => a.isActive && a.machineId === machineId);
  },

  getAlarmInProgress: (machineId: string): string | undefined => {
    const alarm = alarms.find(
      (a) => a.isActive && a.machineId === machineId && a.inProgressBy,
    );
    return alarm?.inProgressBy;
  },

  // Active alarms untuk Machine Detail
  getMachineActiveAlarms: (machineId: string) => {
    let result = alarms.filter((a) => a.isActive && a.machineId === machineId);
    if (result.length === 0) {
      // Don't auto-create active alarm if none exist, just return empty so UI shows "All Systems Normal"
      return []; 
    }
    return result;
  },

  // Alarm History for Machine Detail (All alarms, active or cleared)
  getAlarmHistory: (machineId: string): Alarm[] => {
    return alarms.filter(a => a.machineId === machineId).sort((a,b) => b.timestamp.localeCompare(a.timestamp));
  },

  // Maintenance History for Machine Detail (Solved records)
  getMaintenanceHistory: (machineId: string) => {
    let result = maintenanceHistory.filter(
      (h) => h.machineId === machineId,
    );
    // Return real history or empty array, view will handle empty state
    return result.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },
  
  // Downtime Logs for Machine Detail
  getDowntimeLogs: (machineId: string) => {
    return downtimeLogs.filter(log => log.machineId === machineId).sort((a,b) => b.start.localeCompare(a.start));
  },

  addDowntimeLog: (log: Omit<DowntimeLog, 'id'>) => {
    const newLog: DowntimeLog = {
      ...log,
      id: `dt-${Date.now()}`,
    };
    downtimeLogs = [newLog, ...downtimeLogs];
    return newLog;
  },

  startMaintenance: (alarmId: string, technicianName: string) => {
    alarms = alarms.map((a) => {
      if (a.id === alarmId) {
        return { ...a, inProgressBy: technicianName };
      }
      return a;
    });
  },

  submitMaintenanceAction: (
    record: Omit<MaintenanceRecord, 'id' | 'timestamp'>,
  ) => {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: `hist-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };

    maintenanceHistory.push(newRecord);

    alarms = alarms.map((a) => {
      if (a.id === record.alarmId) {
        return { ...a, isActive: false, handledByMaintenance: true };
      }
      return a;
    });

    return newRecord;
  },
};
