
import { UserRole, DataItem, VisibilityCategory, VisibilityGroup } from '../types';
import { plantService } from './plantService';

/* ============================================================
   DATA ITEM REGISTRY
   ============================================================ */

const STATIC_REGISTRY: DataItem[] = [
    // --- GLOBAL DASHBOARD ---
    { id: 'g1', key: 'GLOBAL_OUTPUT_TODAY', label: 'Total Output', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.KPI, location: 'Global Dashboard', defaultVisible: true },
    { id: 'g2', key: 'GLOBAL_OEE', label: 'Global Avg OEE', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.KPI, location: 'Global Dashboard', defaultVisible: true },
    { id: 'g3', key: 'GLOBAL_TOTAL_ENERGY', label: 'Total Energy', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.KPI, location: 'Global Dashboard', defaultVisible: true },
    { id: 'g4', key: 'GLOBAL_TOTAL_ALARMS', label: 'Active Alarms', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.KPI, location: 'Global Dashboard', defaultVisible: true },
    
    // Plant Overviews
    { id: 'gp1', key: 'GLOBAL_PLANT_CIKOKOL', label: 'Overview Plant Cikokol', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.LIST, location: 'Global Dashboard', defaultVisible: true },
    { id: 'gp2', key: 'GLOBAL_PLANT_SEMARANG', label: 'Overview Plant Semarang', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.LIST, location: 'Global Dashboard', defaultVisible: true },
    { id: 'gp3', key: 'GLOBAL_PLANT_CIKUPA', label: 'Overview Plant Cikupa', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.LIST, location: 'Global Dashboard', defaultVisible: true },
    { id: 'gp4', key: 'GLOBAL_PLANT_AGRO', label: 'Overview Plant Agro', category: VisibilityCategory.GLOBAL_DASHBOARD, group: VisibilityGroup.LIST, location: 'Global Dashboard', defaultVisible: true },
    
    // --- PLANT DASHBOARD ---
    { id: 'p1', key: 'PLANT_OUTPUT_TODAY', label: 'Total Output', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.KPI, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p2', key: 'PLANT_OEE', label: 'OEE', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.KPI, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p3', key: 'PLANT_POWER_USAGE', label: 'Energy', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.KPI, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p4', key: 'PLANT_ALARM_COUNT', label: 'Total Alarms', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.KPI, location: 'Plant Dashboard', defaultVisible: true },
    
    // Utility Metrics (Plant Dashboard)
    { id: 'p_util_1', key: 'UTILITY_ELECTRICITY', label: 'Electricity', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p_util_2', key: 'UTILITY_STEAM', label: 'Steam', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p_util_3', key: 'UTILITY_WATER', label: 'Water', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p_util_4', key: 'UTILITY_AIR', label: 'Compressed Air', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p_util_5', key: 'UTILITY_NITROGEN', label: 'Nitrogen', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p_util_6', key: 'UTILITY_GAS', label: 'Natural Gas', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.UTILITY_CONSUMPTION, location: 'Plant Dashboard', defaultVisible: true },

    // --- ELECTRICITY DETAIL ---
    { id: 'elec_det_1', key: 'ELECTRICITY_DETAIL_KPI_TOTAL', label: 'Total Electricity', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Electricity Detail', defaultVisible: true },
    { id: 'elec_det_2', key: 'ELECTRICITY_DETAIL_CHART_TREND', label: 'Electricity Usage Trend', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Electricity Detail', defaultVisible: true },
    { id: 'elec_det_3', key: 'ELECTRICITY_DETAIL_KPI_STATS', label: 'Quick Stats', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Electricity Detail', defaultVisible: true },
    { id: 'elec_det_4', key: 'LV_PANEL_LOAD_PERCENT', label: 'Panel Load %', category: VisibilityCategory.UTILITY, group: VisibilityGroup.STATUS, location: 'Electricity Detail', defaultVisible: true },
    
    // --- STEAM DETAIL ---
    { id: 'steam_det_1', key: 'STEAM_DETAIL_KPI_TOTAL', label: 'Total Steam', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Steam Detail', defaultVisible: true },
    { id: 'steam_det_2', key: 'STEAM_DETAIL_CHART_TREND', label: 'Steam Usage Trend', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Steam Detail', defaultVisible: true },
    { id: 'steam_det_3', key: 'STEAM_DETAIL_KPI_STATS', label: 'Quick Stats', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Steam Detail', defaultVisible: true },
    { id: 'steam_det_4', key: 'STEAM_DETAIL_CONSUMPTION_BAR', label: 'Consumption by Area (Bar)', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Steam Detail', defaultVisible: true },
    { id: 'steam_det_5', key: 'STEAM_DETAIL_CONSUMPTION_PIE', label: 'Consumption by Area (Pie)', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Steam Detail', defaultVisible: true },

    // --- WATER DETAIL ---
    { id: 'water_det_1', key: 'WATER_DETAIL_KPI_TOTAL', label: 'Total Water', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Water Detail', defaultVisible: true },
    { id: 'water_det_2', key: 'WATER_DETAIL_CHART_TREND', label: 'Water Usage Trend', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Water Detail', defaultVisible: true },
    { id: 'water_det_3', key: 'WATER_DETAIL_KPI_STATS', label: 'Quick Stats', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Water Detail', defaultVisible: true },
    { id: 'water_det_4', key: 'WATER_DETAIL_CONSUMPTION_BAR', label: 'Consumption by Area (Bar)', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Water Detail', defaultVisible: true },
    { id: 'water_det_5', key: 'WATER_DETAIL_CONSUMPTION_PIE', label: 'Consumption by Area (Pie)', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Water Detail', defaultVisible: true },

    // --- COMPRESSED AIR DETAIL ---
    { id: 'air_det_1', key: 'AIR_DETAIL_KPI_TOTAL', label: 'Total Compressed Air', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Compressed Air Detail', defaultVisible: true },
    { id: 'air_det_2', key: 'AIR_DETAIL_CHART_TREND', label: 'Compressed Air Usage Trend', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Compressed Air Detail', defaultVisible: true },
    { id: 'air_det_3', key: 'AIR_DETAIL_KPI_STATS', label: 'Quick Stats', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Compressed Air Detail', defaultVisible: true },
    { id: 'air_det_4', key: 'AIR_DETAIL_CONSUMPTION_BAR', label: 'Consumption by Area (Bar)', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Compressed Air Detail', defaultVisible: true },
    { id: 'air_det_5', key: 'AIR_DETAIL_CONSUMPTION_PIE', label: 'Consumption by Area (Pie)', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Compressed Air Detail', defaultVisible: true },

    // --- NITROGEN DETAIL ---
    { id: 'nitro_det_1', key: 'NITROGEN_DETAIL_KPI_TOTAL', label: 'Total Nitrogen', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Nitrogen Detail', defaultVisible: true },
    { id: 'nitro_det_2', key: 'NITROGEN_DETAIL_CHART_TREND', label: 'Nitrogen Usage Trend', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Nitrogen Detail', defaultVisible: true },
    { id: 'nitro_det_3', key: 'NITROGEN_DETAIL_KPI_STATS', label: 'Quick Stats', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Nitrogen Detail', defaultVisible: true },
    { id: 'nitro_det_4', key: 'NITROGEN_DETAIL_CONSUMPTION_BAR', label: 'Consumption by Area (Bar)', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Nitrogen Detail', defaultVisible: true },
    { id: 'nitro_det_5', key: 'NITROGEN_DETAIL_CONSUMPTION_PIE', label: 'Consumption by Area (Pie)', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Nitrogen Detail', defaultVisible: true },

    // --- NATURAL GAS DETAIL ---
    { id: 'gas_det_1', key: 'GAS_DETAIL_KPI_TOTAL', label: 'Total Natural Gas', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Natural Gas Detail', defaultVisible: true },
    { id: 'gas_det_2', key: 'GAS_DETAIL_CHART_TREND', label: 'Natural Gas Usage Trend', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Natural Gas Detail', defaultVisible: true },
    { id: 'gas_det_3', key: 'GAS_DETAIL_KPI_STATS', label: 'Quick Stats', category: VisibilityCategory.UTILITY, group: VisibilityGroup.KPI, location: 'Natural Gas Detail', defaultVisible: true },
    { id: 'gas_det_4', key: 'GAS_DETAIL_CONSUMPTION_BAR', label: 'Consumption by Area (Bar)', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Natural Gas Detail', defaultVisible: true },
    { id: 'gas_det_5', key: 'GAS_DETAIL_CONSUMPTION_PIE', label: 'Consumption by Area (Pie)', category: VisibilityCategory.UTILITY, group: VisibilityGroup.CHART, location: 'Natural Gas Detail', defaultVisible: true },

    { id: 'p5', key: 'SHIFT_PERFORMANCE_TABLE', label: 'Shift Performance', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.TABLE, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p6', key: 'ACTIVE_ALARMS_LIST', label: 'Active Alarms', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.LIST, location: 'Plant Dashboard', defaultVisible: true },

    // --- MAIN PANEL 1 (Previously LV_SUMMARY) ---
    { id: 'lv1', key: 'LV_KW', label: 'Active Power (kW) - Panel 1', category: VisibilityCategory.MAIN_PANEL_1, group: VisibilityGroup.KPI, location: 'Main Panel 1 Detail', defaultVisible: true },
    { id: 'lv2', key: 'LV_KVA', label: 'Apparent Power (kVA) - Panel 1', category: VisibilityCategory.MAIN_PANEL_1, group: VisibilityGroup.KPI, location: 'Main Panel 1 Detail', defaultVisible: true },
    { id: 'lv3', key: 'LV_KVAR', label: 'Reactive Power (kVAR) - Panel 1', category: VisibilityCategory.MAIN_PANEL_1, group: VisibilityGroup.KPI, location: 'Main Panel 1 Detail', defaultVisible: true },
    { id: 'lv4', key: 'LV_PF', label: 'Power Factor - Panel 1', category: VisibilityCategory.MAIN_PANEL_1, group: VisibilityGroup.KPI, location: 'Main Panel 1 Detail', defaultVisible: true },
    { id: 'lv5', key: 'LV_VOLT_GROUP', label: 'Voltage Metrics - Panel 1', category: VisibilityCategory.MAIN_PANEL_1, group: VisibilityGroup.STATUS, location: 'Main Panel 1 Detail', defaultVisible: true },
    { id: 'lv6', key: 'LV_CURRENT_LOAD_SECTION', label: 'Current Load - Panel 1', category: VisibilityCategory.MAIN_PANEL_1, group: VisibilityGroup.STATUS, location: 'Main Panel 1 Detail', defaultVisible: true },
    { id: 'lv7', key: 'LV_POWER_METRICS_LIST', label: 'Power Quality Metrics - Panel 1', category: VisibilityCategory.MAIN_PANEL_1, group: VisibilityGroup.STATUS, location: 'Main Panel 1 Detail', defaultVisible: true },
    { id: 'lv8', key: 'LV_ENERGY_TREND', label: 'Energy Usage Trend - Panel 1', category: VisibilityCategory.MAIN_PANEL_1, group: VisibilityGroup.CHART, location: 'Main Panel 1 Detail', defaultVisible: true },
    { id: 'lv9', key: 'LV_SHIFT_DATA', label: 'Shift Performance - Panel 1', category: VisibilityCategory.MAIN_PANEL_1, group: VisibilityGroup.TABLE, location: 'Main Panel 1 Detail', defaultVisible: true },

    // --- MAIN PANEL 2 ---
    { id: 'lv2_1', key: 'PANEL2_KW', label: 'Active Power (kW) - Panel 2', category: VisibilityCategory.MAIN_PANEL_2, group: VisibilityGroup.KPI, location: 'Main Panel 2 Detail', defaultVisible: true },
    { id: 'lv2_2', key: 'PANEL2_KVA', label: 'Apparent Power (kVA) - Panel 2', category: VisibilityCategory.MAIN_PANEL_2, group: VisibilityGroup.KPI, location: 'Main Panel 2 Detail', defaultVisible: true },
    { id: 'lv2_3', key: 'PANEL2_KVAR', label: 'Reactive Power (kVAR) - Panel 2', category: VisibilityCategory.MAIN_PANEL_2, group: VisibilityGroup.KPI, location: 'Main Panel 2 Detail', defaultVisible: true },
    { id: 'lv2_4', key: 'PANEL2_PF', label: 'Power Factor - Panel 2', category: VisibilityCategory.MAIN_PANEL_2, group: VisibilityGroup.KPI, location: 'Main Panel 2 Detail', defaultVisible: true },
    { id: 'lv2_5', key: 'PANEL2_VOLT_GROUP', label: 'Voltage Metrics - Panel 2', category: VisibilityCategory.MAIN_PANEL_2, group: VisibilityGroup.STATUS, location: 'Main Panel 2 Detail', defaultVisible: true },
    { id: 'lv2_6', key: 'PANEL2_CURRENT_LOAD_SECTION', label: 'Current Load - Panel 2', category: VisibilityCategory.MAIN_PANEL_2, group: VisibilityGroup.STATUS, location: 'Main Panel 2 Detail', defaultVisible: true },
    { id: 'lv2_7', key: 'PANEL2_POWER_METRICS_LIST', label: 'Power Quality Metrics - Panel 2', category: VisibilityCategory.MAIN_PANEL_2, group: VisibilityGroup.STATUS, location: 'Main Panel 2 Detail', defaultVisible: true },
    { id: 'lv2_8', key: 'PANEL2_ENERGY_TREND', label: 'Energy Usage Trend - Panel 2', category: VisibilityCategory.MAIN_PANEL_2, group: VisibilityGroup.CHART, location: 'Main Panel 2 Detail', defaultVisible: true },
    { id: 'lv2_9', key: 'PANEL2_SHIFT_DATA', label: 'Shift Performance - Panel 2', category: VisibilityCategory.MAIN_PANEL_2, group: VisibilityGroup.TABLE, location: 'Main Panel 2 Detail', defaultVisible: true },
    
    // --- MAIN PANEL 3 ---
    { id: 'lv3_1', key: 'PANEL3_KW', label: 'Active Power (kW) - Panel 3', category: VisibilityCategory.MAIN_PANEL_3, group: VisibilityGroup.KPI, location: 'Main Panel 3 Detail', defaultVisible: true },
    { id: 'lv3_2', key: 'PANEL3_KVA', label: 'Apparent Power (kVA) - Panel 3', category: VisibilityCategory.MAIN_PANEL_3, group: VisibilityGroup.KPI, location: 'Main Panel 3 Detail', defaultVisible: true },
    { id: 'lv3_3', key: 'PANEL3_KVAR', label: 'Reactive Power (kVAR) - Panel 3', category: VisibilityCategory.MAIN_PANEL_3, group: VisibilityGroup.KPI, location: 'Main Panel 3 Detail', defaultVisible: true },
    { id: 'lv3_4', key: 'PANEL3_PF', label: 'Power Factor - Panel 3', category: VisibilityCategory.MAIN_PANEL_3, group: VisibilityGroup.KPI, location: 'Main Panel 3 Detail', defaultVisible: true },
    { id: 'lv3_5', key: 'PANEL3_VOLT_GROUP', label: 'Voltage Metrics - Panel 3', category: VisibilityCategory.MAIN_PANEL_3, group: VisibilityGroup.STATUS, location: 'Main Panel 3 Detail', defaultVisible: true },
    { id: 'lv3_6', key: 'PANEL3_CURRENT_LOAD_SECTION', label: 'Current Load - Panel 3', category: VisibilityCategory.MAIN_PANEL_3, group: VisibilityGroup.STATUS, location: 'Main Panel 3 Detail', defaultVisible: true },
    { id: 'lv3_7', key: 'PANEL3_POWER_METRICS_LIST', label: 'Power Quality Metrics - Panel 3', category: VisibilityCategory.MAIN_PANEL_3, group: VisibilityGroup.STATUS, location: 'Main Panel 3 Detail', defaultVisible: true },
    { id: 'lv3_8', key: 'PANEL3_ENERGY_TREND', label: 'Energy Usage Trend - Panel 3', category: VisibilityCategory.MAIN_PANEL_3, group: VisibilityGroup.CHART, location: 'Main Panel 3 Detail', defaultVisible: true },
    { id: 'lv3_9', key: 'PANEL3_SHIFT_DATA', label: 'Shift Performance - Panel 3', category: VisibilityCategory.MAIN_PANEL_3, group: VisibilityGroup.TABLE, location: 'Main Panel 3 Detail', defaultVisible: true },

    // --- MAIN PANEL 4 ---
    { id: 'lv4_1', key: 'PANEL4_KW', label: 'Active Power (kW) - Panel 4', category: VisibilityCategory.MAIN_PANEL_4, group: VisibilityGroup.KPI, location: 'Main Panel 4 Detail', defaultVisible: true },
    { id: 'lv4_2', key: 'PANEL4_KVA', label: 'Apparent Power (kVA) - Panel 4', category: VisibilityCategory.MAIN_PANEL_4, group: VisibilityGroup.KPI, location: 'Main Panel 4 Detail', defaultVisible: true },
    { id: 'lv4_3', key: 'PANEL4_KVAR', label: 'Reactive Power (kVAR) - Panel 4', category: VisibilityCategory.MAIN_PANEL_4, group: VisibilityGroup.KPI, location: 'Main Panel 4 Detail', defaultVisible: true },
    { id: 'lv4_4', key: 'PANEL4_PF', label: 'Power Factor - Panel 4', category: VisibilityCategory.MAIN_PANEL_4, group: VisibilityGroup.KPI, location: 'Main Panel 4 Detail', defaultVisible: true },
    { id: 'lv4_5', key: 'PANEL4_VOLT_GROUP', label: 'Voltage Metrics - Panel 4', category: VisibilityCategory.MAIN_PANEL_4, group: VisibilityGroup.STATUS, location: 'Main Panel 4 Detail', defaultVisible: true },
    { id: 'lv4_6', key: 'PANEL4_CURRENT_LOAD_SECTION', label: 'Current Load - Panel 4', category: VisibilityCategory.MAIN_PANEL_4, group: VisibilityGroup.STATUS, location: 'Main Panel 4 Detail', defaultVisible: true },
    { id: 'lv4_7', key: 'PANEL4_POWER_METRICS_LIST', label: 'Power Quality Metrics - Panel 4', category: VisibilityCategory.MAIN_PANEL_4, group: VisibilityGroup.STATUS, location: 'Main Panel 4 Detail', defaultVisible: true },
    { id: 'lv4_8', key: 'PANEL4_ENERGY_TREND', label: 'Energy Usage Trend - Panel 4', category: VisibilityCategory.MAIN_PANEL_4, group: VisibilityGroup.CHART, location: 'Main Panel 4 Detail', defaultVisible: true },
    { id: 'lv4_9', key: 'PANEL4_SHIFT_DATA', label: 'Shift Performance - Panel 4', category: VisibilityCategory.MAIN_PANEL_4, group: VisibilityGroup.TABLE, location: 'Main Panel 4 Detail', defaultVisible: true },
];

// Dynamically generate registry items for every machine in the system to allow specific hiding
const generateMachineRegistry = (): DataItem[] => {
    const plants = plantService.getAllPlants();
    const items: DataItem[] = [];

    plants.forEach(plant => {
        plant.machines.forEach(machine => {
            items.push({
                id: `mach_vis_${machine.id}`,
                key: `SHOW_MACHINE_${machine.id}`,
                label: machine.name,
                category: VisibilityCategory.PLANT_DASHBOARD,
                group: VisibilityGroup.MACHINES,
                location: `Plant Dashboard - ${plant.name}`,
                defaultVisible: true
            });
        });
    });
    return items;
};

// Dynamically generate registry items for LVMDP panels to allow specific hiding in Utility Summary
const generateLVMDPRegistry = (): DataItem[] => {
    const plants = plantService.getAllPlants();
    const items: DataItem[] = [];

    plants.forEach(plant => {
        plant.lvmdps.forEach(panel => {
            items.push({
                id: `lvmdp_card_vis_${panel.id}`,
                key: `SHOW_LVMDP_CARD_${panel.id}`,
                label: `Show Card: ${panel.name}`,
                category: VisibilityCategory.UTILITY,
                group: VisibilityGroup.LIST,
                location: `Utility - Electricity - ${plant.name}`,
                defaultVisible: true
            });
        });
    });
    return items;
};

export const DATA_ITEM_REGISTRY: DataItem[] = [
    ...STATIC_REGISTRY, 
    ...generateMachineRegistry(),
    ...generateLVMDPRegistry()
];

/* ============================================================
   VISIBILITY STATE MODEL (CONTEXT-AWARE)
   ============================================================ */

type VisibilityRules = Record<string, boolean>; // { [dataItemKey]: boolean }
type ScopeRules = Record<string, VisibilityRules>; // { [scopeKey]: VisibilityRules }
type VisibilityState = Record<string, ScopeRules>; // { [role]: ScopeRules }

const STORAGE_KEY = 'SMART_MONITORING_DATA_VISIBILITY_V8'; // Version bump

/* ------------------ INTERNAL HELPERS ------------------- */

const loadState = (): VisibilityState => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return {};
        const parsed = JSON.parse(stored);
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
        case VisibilityCategory.MAIN_PANEL_1:
        case VisibilityCategory.MAIN_PANEL_2:
        case VisibilityCategory.MAIN_PANEL_3:
        case VisibilityCategory.MAIN_PANEL_4:
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
