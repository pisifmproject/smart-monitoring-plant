









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

export interface WeigherDetails {
    averageWeight: number; // grams
    standardDeviation: number; // grams
    giveaway: number; // %
    averageSpeed: number; // bpm, renamed from speed
    status: 'RUNNING' | 'IDLE' | 'FAULT';
    
    // New detailed stats assuming dual weigher
    totalWeight1: number; // kg for the shift
    totalWeight2: number; // kg for the shift
    speed1: number; // bpm
    speed2: number; // bpm
}

export interface BagmakerDetails {
    targetSpeed: number; // bpm (renamed from speed)
    actualSpeed: number; // bpm (new)
    filmRemaining: number; // %
    sealTempHorizontal: number; // Celsius
    sealTempVertical: number; // Celsius
    status: 'RUNNING' | 'IDLE' | 'FAULT';
    totalEfficiency: number; // % (new)
    efficiencyWeigher: number; // % (new)
    efficiencyBagmaker: number; // % (new)
    bagPercentage: number; // % of good bags (new)
    wastedFilmPercentage: number; // % (new)
    metalDetectCount: number; // count (new)
    printerDateErrorCount: number; // count (new)
    productInSealCount: number; // count (new)
    spliceDetectCount: number; // count (new)
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
    
    // Extended properties for Detail View
    availability?: number;
    performance?: number;
    quality?: number;
    processParams?: Record<string, number | string>;
    utilityConsumption?: {
        electricity: number;
        steam: number;
        water: number;
        air: number;
    };

    // Packing specific details
    weigher?: WeigherDetails;
    bagmaker?: BagmakerDetails;

    // Multi-unit packing details for Cikupa PC39
    bagmakerUnits?: BagmakerDetails[];
    weigherUnits?: WeigherDetails[];
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

export interface UtilityConfig {
    baseConsumption: number; // per day
    costPerUnit: number;
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
    utilityBaseValues: Record<string, UtilityConfig>; // e.g., 'water', 'gas', 'steam'
}

export interface Alarm {
    id: string;
    machineId?: string; // Optional, to link to specific machine
    timestamp: string;
    source: string;
    message: string;
    severity: AlarmSeverity;
    code: string;
    isActive: boolean;
    handledByMaintenance: boolean;
    inProgressBy?: string; // Name of technician working on it
}

export interface MaintenanceRecord {
    id: string;
    alarmId: string;
    machineId: string;
    timestamp: string;
    checkedBy: string; // User name
    solved: boolean;
    note: string;
    photoUrl?: string;
}

export interface DowntimeLog {
    id: string;
    machineId: string;
    start: string;
    end: string;
    duration: string;
    reason: string;
    description: string;
    source: 'AUTO' | 'MANUAL';
}

// --- NEW ---
export interface PackingLineConfig {
    lineName: string;
    bagmakers: number;
    weighers: number;
}


// --- VISIBILITY SETTINGS TYPES ---

export enum VisibilityCategory {
    GLOBAL_DASHBOARD = 'GLOBAL_DASHBOARD',
    PLANT_DASHBOARD = 'PLANT_DASHBOARD',
    MACHINE_DETAIL = 'MACHINE_DETAIL',
    UTILITY = 'UTILITY',
    MAIN_PANEL_1 = 'MAIN_PANEL_1',
    MAIN_PANEL_2 = 'MAIN_PANEL_2',
    MAIN_PANEL_3 = 'MAIN_PANEL_3',
    MAIN_PANEL_4 = 'MAIN_PANEL_4',
    OTHER = 'OTHER'
}

export enum VisibilityGroup {
    KPI = 'KPI',
    CHART = 'CHART',
    TABLE = 'TABLE',
    LIST = 'LIST',
    STATUS = 'STATUS',
    OUTPUT = 'OUTPUT',
    OEE = 'OEE',
    ENERGY = 'ENERGY',
    UTILITY_CONSUMPTION = 'UTILITY_CONSUMPTION',
    ALARM_DATA = 'ALARM_DATA',
    PROCESS_PARAM = 'PROCESS_PARAM',
    MACHINE_HEALTH = 'MACHINE_HEALTH',
    FORM = 'FORM',
    TAB = 'TAB',
    MACHINES = 'MACHINES',
    WEIGHER = 'WEIGHER',
    BAGMAKER = 'BAGMAKER',
    PACKING_STATS = 'PACKING_STATS',
    // FIX: Added 'OTHER' to the enum to resolve a compile error in Settings.tsx.
    OTHER = 'OTHER'
}

export interface DataItem {
    id: string;
    key: string;
    label: string;
    category: VisibilityCategory;
    group: VisibilityGroup;
    location: string; // e.g., 'Global Dashboard', 'Machine Detail / Performance Tab'
    defaultVisible: boolean;
}