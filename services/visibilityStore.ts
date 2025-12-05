
import { UserRole, DataItem, VisibilityCategory, VisibilityGroup } from '../types';

// The Central Registry of all controllable Data Items
export const DATA_ITEM_REGISTRY: DataItem[] = [
    // --- GLOBAL DASHBOARD ---
    { id: 'g1', key: 'GLOBAL_OUTPUT_TODAY', label: 'Global Output Today', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.KPI, location: 'Global Dashboard', defaultVisible: true },
    { id: 'g2', key: 'GLOBAL_OEE', label: 'Global Avg OEE', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.KPI, location: 'Global Dashboard', defaultVisible: true },
    { id: 'g3', key: 'GLOBAL_TOTAL_ENERGY', label: 'Global Total Energy', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.KPI, location: 'Global Dashboard', defaultVisible: true },
    { id: 'g4', key: 'GLOBAL_TOTAL_ALARMS', label: 'Global Active Alarms', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.KPI, location: 'Global Dashboard', defaultVisible: true },
    { id: 'g5', key: 'GLOBAL_OUTPUT_COMPARISON_CHART', label: 'Output Comparison Chart', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.CHART, location: 'Global Dashboard', defaultVisible: true },
    { id: 'g6', key: 'GLOBAL_OEE_COMPARISON_CHART', label: 'OEE Comparison Chart', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.CHART, location: 'Global Dashboard', defaultVisible: true },
    { id: 'g7', key: 'GLOBAL_PLANT_LIST', label: 'Plant List Grid', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.LIST, location: 'Global Dashboard', defaultVisible: true },

    // --- PLANT DASHBOARD ---
    { id: 'p1', key: 'PLANT_OUTPUT_TODAY', label: 'Plant Output Today', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.KPI, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p2', key: 'PLANT_OEE', label: 'Plant OEE', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.KPI, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p3', key: 'PLANT_POWER_USAGE', label: 'Plant Power Usage', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.KPI, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p4', key: 'PLANT_ALARM_COUNT', label: 'Plant Alarm Count', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.KPI, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p5', key: 'SHIFT_PERFORMANCE_TABLE', label: 'Shift Performance Table', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.TABLE, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p6', key: 'ACTIVE_ALARMS_LIST', label: 'Active Alarms List', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.LIST, location: 'Plant Dashboard', defaultVisible: true },
    
    // Plant Dashboard - Machine Cards
    { id: 'pm1', key: 'MACHINE_CARD_OUTPUT', label: 'Machine Card: Output', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.OUTPUT, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pm2', key: 'MACHINE_CARD_OEE', label: 'Machine Card: OEE', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.OEE, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pm3', key: 'MACHINE_CARD_STATUS', label: 'Machine Card: Status', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.STATUS, location: 'Plant Dashboard', defaultVisible: true },

    // Plant Dashboard - Utility Summary Cards
    { id: 'pu1', key: 'UTILITY_ELECTRICITY_KWH', label: 'Utility Card: Electricity', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pu2', key: 'UTILITY_STEAM_KG', label: 'Utility Card: Steam', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pu3', key: 'UTILITY_WATER_M3', label: 'Utility Card: Water', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pu4', key: 'UTILITY_AIR_NM3', label: 'Utility Card: Comp. Air', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pu5', key: 'UTILITY_NITROGEN_NM3', label: 'Utility Card: Nitrogen', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },

    // Plant Dashboard - LVMDP Summary Cards
    { id: 'pl1', key: 'LV_PANEL_ENERGY_TODAY', label: 'LVMDP Card: Energy Today', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.ENERGY, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pl2', key: 'LV_PANEL_LOAD_PERCENT', label: 'LVMDP Card: Load %', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.ENERGY, location: 'Plant Dashboard', defaultVisible: true },

    // --- MACHINE DETAIL PAGE ---
    // Tabs
    { id: 'mt1', key: 'MACHINE_TAB_PERFORMANCE', label: 'Tab: Performance', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mt2', key: 'MACHINE_TAB_PROCESS', label: 'Tab: Process Parameters', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mt3', key: 'MACHINE_TAB_UTILITY', label: 'Tab: Utility', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mt4', key: 'MACHINE_TAB_ALARMS', label: 'Tab: Alarms', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mt5', key: 'MACHINE_TAB_DOWNTIME', label: 'Tab: Downtime', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mt6', key: 'MACHINE_TAB_MAINTENANCE', label: 'Tab: Maintenance', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },

    // Performance Section
    { id: 'mperf1', key: 'MACHINE_OEE', label: 'KPI: OEE', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.KPI, location: 'Machine Detail / Perf', defaultVisible: true },
    { id: 'mperf2', key: 'MACHINE_AVAILABILITY', label: 'KPI: Availability', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.KPI, location: 'Machine Detail / Perf', defaultVisible: true },
    { id: 'mperf3', key: 'MACHINE_PERFORMANCE', label: 'KPI: Performance', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.KPI, location: 'Machine Detail / Perf', defaultVisible: true },
    { id: 'mperf4', key: 'MACHINE_QUALITY', label: 'KPI: Quality', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.KPI, location: 'Machine Detail / Perf', defaultVisible: true },
    { id: 'mperf5', key: 'MACHINE_OUTPUT_KG_H', label: 'KPI: Output Rate (kg/h)', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.OUTPUT, location: 'Machine Detail / Perf', defaultVisible: true },
    { id: 'mperf6', key: 'MACHINE_OUTPUT_SHIFT', label: 'KPI: Output Shift Total', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.OUTPUT, location: 'Machine Detail / Perf', defaultVisible: true },
    { id: 'mperf7', key: 'MACHINE_REJECT_KG', label: 'KPI: Reject (kg)', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.OUTPUT, location: 'Machine Detail / Perf', defaultVisible: true },
    { id: 'mperf8', key: 'MACHINE_REJECT_PERCENT', label: 'KPI: Reject (%)', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.OUTPUT, location: 'Machine Detail / Perf', defaultVisible: true },
    { id: 'mperf9', key: 'MACHINE_OUTPUT_TREND_CHART', label: 'Chart: Output vs Target', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.CHART, location: 'Machine Detail / Perf', defaultVisible: true },
    { id: 'mperf10', key: 'MACHINE_REJECT_TREND_CHART', label: 'Chart: Reject Trend', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.CHART, location: 'Machine Detail / Perf', defaultVisible: true },

    // Process Parameters - Extruder
    { id: 'mproc1', key: 'PARAM_SCREW_SPEED', label: 'Param: Screw Speed', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mproc2', key: 'PARAM_BARREL_TEMP_ZONE1', label: 'Param: Barrel Temp Zone 1', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mproc3', key: 'PARAM_BARREL_TEMP_ZONE2', label: 'Param: Barrel Temp Zone 2', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mproc4', key: 'PARAM_BARREL_TEMP_ZONE3', label: 'Param: Barrel Temp Zone 3', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mproc5', key: 'PARAM_BARREL_TEMP_ZONE4', label: 'Param: Barrel Temp Zone 4', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mproc6', key: 'PARAM_BARREL_TEMP_ZONE5', label: 'Param: Barrel Temp Zone 5', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mproc7', key: 'PARAM_BARREL_TEMP_ZONE6', label: 'Param: Barrel Temp Zone 6', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mproc8', key: 'PARAM_FEEDER_SPEED', label: 'Param: Feeder Speed', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mproc9', key: 'PARAM_PRODUCT_TEMP_OUT', label: 'Param: Product Temp Out', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mproc10', key: 'PARAM_DIE_PRESSURE', label: 'Param: Die Pressure', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mproc_chart', key: 'MACHINE_CHART_PROCESS_TREND', label: 'Chart: Multi-Param Trend', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.CHART, location: 'Machine Detail / Process', defaultVisible: true },

    // Process Parameters - Fryer
    { id: 'mfry1', key: 'PARAM_OIL_TEMP', label: 'Param: Oil Temp', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mfry2', key: 'PARAM_CONVEYOR_SPEED', label: 'Param: Conveyor Speed', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mfry3', key: 'PARAM_OIL_LEVEL', label: 'Param: Oil Level', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mfry4', key: 'PARAM_EXHAUST_TEMP', label: 'Param: Exhaust Temp', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mfry5', key: 'PARAM_STEAM_PRESSURE', label: 'Param: Steam Pressure', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    
    // Process Parameters - Generic
    { id: 'mgen1', key: 'PARAM_LINE_SPEED', label: 'Param: Line Speed', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },
    { id: 'mgen2', key: 'PARAM_TEMPERATURE', label: 'Param: Temperature', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.PROCESS_PARAM, location: 'Machine Detail / Process', defaultVisible: true },

    // Machine Utility
    { id: 'mutil1', key: 'MACHINE_UTIL_ELECTRICITY', label: 'Util: Electricity', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Machine Detail / Utility', defaultVisible: true },
    { id: 'mutil2', key: 'MACHINE_UTIL_STEAM', label: 'Util: Steam', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Machine Detail / Utility', defaultVisible: true },
    { id: 'mutil3', key: 'MACHINE_UTIL_WATER', label: 'Util: Water', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Machine Detail / Utility', defaultVisible: true },
    { id: 'mutil4', key: 'MACHINE_UTIL_AIR', label: 'Util: Comp. Air', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Machine Detail / Utility', defaultVisible: true },
    { id: 'mutil5', key: 'MACHINE_UTIL_NITROGEN', label: 'Util: Nitrogen', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Machine Detail / Utility', defaultVisible: true },
    { id: 'mutil6', key: 'MACHINE_CHART_UTILITY_ELEC', label: 'Chart: Elec Trend', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.CHART, location: 'Machine Detail / Utility', defaultVisible: true },
    { id: 'mutil7', key: 'MACHINE_CHART_UTILITY_STEAM', label: 'Chart: Steam Trend', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.CHART, location: 'Machine Detail / Utility', defaultVisible: true },

    // Machine Alarms & Downtime
    { id: 'malm1', key: 'MACHINE_ALARM_TABLE', label: 'Table: Alarms', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TABLE, location: 'Machine Detail / Alarms', defaultVisible: true },
    { id: 'mdt1', key: 'MACHINE_DOWNTIME_TABLE', label: 'Table: Downtime Logs', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TABLE, location: 'Machine Detail / Downtime', defaultVisible: true },
    { id: 'mdt2', key: 'MACHINE_DOWNTIME_FORM', label: 'Form: Add Downtime', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.FORM, location: 'Machine Detail / Downtime', defaultVisible: true },
    { id: 'mdt3', key: 'MACHINE_KPI_DOWNTIME_SUMMARY', label: 'Downtime Summary Stats', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.KPI, location: 'Machine Detail / Downtime', defaultVisible: true },

    // --- LV DETAIL ---
    { id: 'lv1', key: 'LV_DETAIL_ENERGY_TREND', label: 'Chart: Energy Trend', category: VisibilityCategory.LV_SUMMARY, group: VisibilityGroup.CHART, location: 'LV Detail', defaultVisible: true },
    { id: 'lv2', key: 'LV_DETAIL_LOAD_TREND', label: 'Chart: Load % Trend', category: VisibilityCategory.LV_SUMMARY, group: VisibilityGroup.CHART, location: 'LV Detail', defaultVisible: true },
];

// Type for the visibility store state: { [Role]: { [DataItemKey]: boolean } }
type VisibilityState = Record<string, Record<string, boolean>>;

// LocalStorage key
const STORAGE_KEY = 'SMART_MONITORING_DATA_VISIBILITY_V2';

// Load from local storage or initialize empty
const loadState = (): VisibilityState => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        console.error("Failed to load visibility settings", e);
        return {};
    }
};

const saveState = (state: VisibilityState) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save visibility settings", e);
    }
};

let currentState: VisibilityState = loadState();

export const getVisibilityRulesForRole = (role: UserRole): Record<string, boolean> => {
    return currentState[role] || {};
};

export const updateVisibilityRule = (role: UserRole, dataItemKey: string, isVisible: boolean) => {
    if (!currentState[role]) {
        currentState[role] = {};
    }
    currentState[role][dataItemKey] = isVisible;
    saveState(currentState);
};

export const bulkUpdateVisibilityRules = (role: UserRole, updates: Record<string, boolean>) => {
    if (!currentState[role]) {
        currentState[role] = {};
    }
    currentState[role] = { ...currentState[role], ...updates };
    saveState(currentState);
};

// THE MAIN FUNCTION to check visibility
export const isDataItemVisible = (role: UserRole, dataItemKey: string): boolean => {
    // 1. ADMIN sees everything always
    if (role === UserRole.ADMINISTRATOR) {
        return true;
    }

    // 2. Check for Role-Specific Override
    const roleRules = currentState[role];
    if (roleRules && typeof roleRules[dataItemKey] !== 'undefined') {
        return roleRules[dataItemKey];
    }

    // 3. Fallback to Default defined in Registry
    const item = DATA_ITEM_REGISTRY.find(i => i.key === dataItemKey);
    return item ? item.defaultVisible : true;
};
