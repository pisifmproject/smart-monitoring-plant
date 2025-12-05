
export enum PlantCode {
    CIKOKOL = 'CIKOKOL',
    SEMARANG = 'SEMARANG',
    CIKUPA = 'CIKUPA',
    AGRO = 'AGRO'
}

export enum MachineStatus {
    RUNNING = 'RUNNING',
    IDLE = 'IDLE',
    BREAKDOWN = 'BREAKDOWN',
    OFFLINE = 'OFFLINE'
}

export enum AlarmSeverity {
    INFO = 'INFO',
    WARNING = 'WARNING',
    CRITICAL = 'CRITICAL'
}

export enum UserRole {
    ADMINISTRATOR = 'Administrator',
    SUPERVISOR = 'Supervisor',
    OPERATOR = 'Operator',
    MAINTENANCE = 'Maintenance',
    QC = 'Quality Control',
    MANAGEMENT = 'Management',
    VIEWER = 'Viewer'
}

export enum MachineType {
    EXTRUDER = 'EXTRUDER',
    FRYER = 'FRYER',
    SEASONING = 'SEASONING',
    PACKING = 'PACKING',
    GENERIC = 'GENERIC'
}

export interface User {
    username: string;
    name: string;
    role: UserRole;
}

export interface Metric {
    value: number;
    unit: string;
    trend?: number; // percentage change
}

export interface Machine {
    id: string;
    code: string;
    name: string;
    plantId: PlantCode;
    status: MachineStatus;
    type: MachineType;
    outputPerHour: number;
    oee: number;
    temperature: number;
    totalOutputShift: number;
    targetShift: number;
    lineSpeed: number; // rpm or ppm
    rejectRate: number; // %
}

export interface LVMDP {
    id: string;
    code: string; // LVMDP-1 to 4
    name: string;
    plantId: PlantCode;
    status: 'NORMAL' | 'WARNING' | 'CRITICAL';
    
    // Power & Load
    totalPowerKW: number;
    totalPowerKVAR: number;
    totalPowerKVA: number;
    powerFactor: number;
    frequency: number;
    currentLoadPercent: number;
    
    // Phase Data
    voltageRS: number;
    voltageST: number;
    voltageTR: number;
    currentR: number;
    currentS: number;
    currentT: number;
    unbalanceVoltage: number; // %
    unbalanceCurrent: number; // %
    
    // Energy
    energyToday: number;
    energyMTD: number;
    energyTotal: number;
    
    // Power Quality
    thdV: number; // %
    thdI: number; // %

    // Environment & Status
    panelTemp: number; // Celsius
    breakerStatus: 'CLOSED' | 'TRIPPED' | 'OPEN';
    doorOpen: boolean;
}

export interface Plant {
    id: PlantCode;
    name: string;
    location: string;
    outputToday: number;
    oeeAvg: number;
    energyTotal: number; // kWh
    activeAlarms: number;
    machines: Machine[];
    lvmdps: LVMDP[];
}

export interface Alarm {
    id: string;
    timestamp: string;
    source: string;
    message: string;
    severity: AlarmSeverity;
}

// --- VISIBILITY SETTINGS TYPES ---

export enum WidgetCategory {
    GLOBAL = 'GLOBAL',
    PLANT = 'PLANT',
    MACHINE = 'MACHINE',
    LVMDP = 'LVMDP',
    UTILITY = 'UTILITY',
    OTHER = 'OTHER'
}

export enum WidgetType {
    CARD = 'CARD',
    CHART = 'CHART',
    TABLE = 'TABLE',
    KPI = 'KPI',
    TAB = 'TAB'
}

export interface VisibilityItem {
    id: string;
    key: string;
    label: string;
    category: WidgetCategory;
    location: string; // e.g., 'Global Dashboard', 'Machine Detail'
    type: WidgetType;
    defaultVisible: boolean;
}
