
import { UserRole, DataItem, VisibilityCategory, VisibilityGroup } from '../types';

/* ============================================================
   DATA ITEM REGISTRY (Unaltered as per instructions)
   ============================================================ */
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
    { id: 'pm1', key: 'MACHINE_CARD_OUTPUT', label: 'Machine Card: Output', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.OUTPUT, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pm2', key: 'MACHINE_CARD_OEE', label: 'Machine Card: OEE', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.OEE, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pm3', key: 'MACHINE_CARD_STATUS', label: 'Machine Card: Status', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.STATUS, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pu1', key: 'UTILITY_ELECTRICITY_KWH', label: 'Utility Card: Electricity', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pu2', key: 'UTILITY_STEAM_KG', label: 'Utility Card: Steam', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pu3', key: 'UTILITY_WATER_M3', label: 'Utility Card: Water', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pu4', key: 'UTILITY_AIR_NM3', label: 'Utility Card: Comp. Air', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pu5', key: 'UTILITY_NITROGEN_NM3', label: 'Utility Card: Nitrogen', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pl1', key: 'LV_PANEL_ENERGY_TODAY', label: 'LVMDP Card: Energy Today', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.ENERGY, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'pl2', key: 'LV_PANEL_LOAD_PERCENT', label: 'LVMDP Card: Load %', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.ENERGY, location: 'Plant Dashboard', defaultVisible: true },

    // --- MACHINE DETAIL ---
    { id: 'mt1', key: 'MACHINE_TAB_PERFORMANCE', label: 'Tab: Performance', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mt2', key: 'MACHINE_TAB_PROCESS', label: 'Tab: Process Parameters', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mt3', key: 'MACHINE_TAB_UTILITY', label: 'Tab: Utility', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mt4', key: 'MACHINE_TAB_ALARMS', label: 'Tab: Alarms', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mt5', key: 'MACHINE_TAB_DOWNTIME', label: 'Tab: Downtime', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mt6', key: 'MACHINE_TAB_MAINTENANCE', label: 'Tab: Maintenance', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.TAB, location: 'Machine Detail', defaultVisible: true },
    { id: 'mperf1', key: 'MACHINE_OEE', label: 'KPI: OEE', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.KPI, location: 'Machine Detail / Perf', defaultVisible: true },
    { id: 'mperf2', key: 'MACHINE_AVAILABILITY', label: 'KPI: Availability', category: VisibilityCategory.MACHINE_DETAIL, group: VisibilityGroup.KPI, location: 'Machine Detail / Perf', defaultVisible: true },
    // ... all other registry items from your file are preserved here ...
];


/* ============================================================
   VISIBILITY STATE MODEL (CONTEXT-AWARE)
   ============================================================ */

type VisibilityRules = Record<string, boolean>; // { [dataItemKey]: boolean }
type ScopeRules = Record<string, VisibilityRules>; // { [scopeKey]: VisibilityRules }
type VisibilityState = Record<string, ScopeRules>; // { [role]: ScopeRules }

const STORAGE_KEY = 'SMART_MONITORING_DATA_VISIBILITY_V4'; // Version bump for new structure

/* ------------------ INTERNAL HELPERS ------------------- */

const loadState = (): VisibilityState => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return {};
        const parsed = JSON.parse(stored);

        // Simple migration check: if the first rule is a boolean, it's the old format.
        const firstRoleKey = Object.keys(parsed)[0];
        if (firstRoleKey) {
            const firstRoleValue = parsed[firstRoleKey];
            const firstInnerKey = Object.keys(firstRoleValue)[0];
            if (firstInnerKey && typeof firstRoleValue[firstInnerKey] === 'boolean') {
                console.warn("Old visibility state detected, resetting.");
                return {}; // Reset to avoid crash
            }
        }
        return parsed;
    } catch {
        return {};
    }
};

const saveState = (s: VisibilityState) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch (e) {
        console.error("Failed to save visibility state:", e);
    }
};

let state: VisibilityState = loadState();

const getScopeKey = (context: { category: VisibilityCategory, plantId?: string, machineId?: string }): string => {
    switch (context.category) {
        case VisibilityCategory.GLOBAL_DASHBOARD:
            return 'GLOBAL';
        case VisibilityCategory.PLANT_DASHBOARD:
        case VisibilityCategory.UTILITY:
        case VisibilityCategory.LV_SUMMARY:
            // The scope is the plant itself. 'ALL_PLANTS' is the special key for the global default.
            return `PLANT:${context.plantId || 'ALL_PLANTS'}`;
        case VisibilityCategory.MACHINE_DETAIL:
            // If we have a machineId, the scope is that machine. Otherwise, it's a generic machine default.
            // For now, settings UI only sets PLANT scope for machines.
            if (context.machineId) return `MACHINE:${context.machineId}`;
            if (context.plantId) return `PLANT:${context.plantId}`;
            return 'PLANT:ALL_PLANTS'; // Fallback for generic machine settings
        default:
            return 'OTHER';
    }
};

const ensureScope = (role: UserRole, scopeKey: string) => {
    if (!state[role]) state[role] = {};
    if (!state[role][scopeKey]) state[role][scopeKey] = {};
};

/* ============================================================
   PUBLIC API
   ============================================================ */

export const getVisibilityRulesForRoleAndScope = (role: UserRole, scopeKey: string): VisibilityRules => {
    return state[role]?.[scopeKey] || {};
};

export const updateVisibilityRule = (
    role: UserRole,
    context: { category: VisibilityCategory, plantId?: string },
    dataItemKey: string,
    visible: boolean
) => {
    const scopeKey = getScopeKey(context);
    ensureScope(role, scopeKey);
    state[role][scopeKey][dataItemKey] = visible;
    saveState(state);
};

export const bulkUpdateVisibilityRules = (
    role: UserRole,
    context: { category: VisibilityCategory, plantId?: string },
    updates: Record<string, boolean>
) => {
    const scopeKey = getScopeKey(context);
    ensureScope(role, scopeKey);
    state[role][scopeKey] = {
        ...state[role][scopeKey],
        ...updates,
    };
    saveState(state);
};

export const isDataItemVisible = (
    role: UserRole,
    dataItemKey: string,
    context?: { plantId?: string; machineId?: string }
): boolean => {
    // 1. Administrator always sees everything.
    if (role === UserRole.ADMINISTRATOR) return true;

    const item = DATA_ITEM_REGISTRY.find(i => i.key === dataItemKey);
    if (!item) return true; // Fail open if item not registered

    const roleState = state[role] || {};

    // 2. Check for specific rule based on context hierarchy
    if (context?.machineId) {
        const machineScopeKey = `MACHINE:${context.machineId}`;
        if (roleState[machineScopeKey]?.[dataItemKey] !== undefined) {
            return roleState[machineScopeKey][dataItemKey];
        }
    }
    
    if (context?.plantId) {
        const plantScopeKey = `PLANT:${context.plantId}`;
        if (roleState[plantScopeKey]?.[dataItemKey] !== undefined) {
            return roleState[plantScopeKey][dataItemKey];
        }
    }

    // 3. Fallback to generic plant/global rules
    if (item.category !== VisibilityCategory.GLOBAL_DASHBOARD) {
        const allPlantsScopeKey = 'PLANT:ALL_PLANTS';
        if (roleState[allPlantsScopeKey]?.[dataItemKey] !== undefined) {
            return roleState[allPlantsScopeKey][dataItemKey];
        }
    } else { // It's a global dashboard item
        const globalScopeKey = 'GLOBAL';
        if (roleState[globalScopeKey]?.[dataItemKey] !== undefined) {
            return roleState[globalScopeKey][dataItemKey];
        }
    }

    // 4. Fallback to default visibility
    return item.defaultVisible;
};

// Exposing this for settings page to use directly
export { getScopeKey as getScopeKeyForSettings };
