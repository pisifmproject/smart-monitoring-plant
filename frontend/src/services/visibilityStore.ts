// services/visibilityStore.ts
import { UserRole, DataItem, VisibilityCategory, VisibilityGroup } from '../types';
import { plantService } from './plantService';
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

/* ============================================================
   DATA ITEM REGISTRY
   ============================================================ */

const STATIC_REGISTRY: DataItem[] = [
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

    { id: 'p5', key: 'SHIFT_PERFORMANCE_TABLE', label: 'Shift Performance', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.TABLE, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p6', key: 'ACTIVE_ALARMS_LIST', label: 'Active Alarms', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.LIST, location: 'Plant Dashboard', defaultVisible: true },
    { id: 'p_mach_1', key: 'MACHINE_CARD_OUTPUT', label: 'Machine Card: Output', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.OUTPUT, location: 'Plant Dashboard / Machine List', defaultVisible: true },
    { id: 'p_mach_2', key: 'MACHINE_CARD_OEE', label: 'Machine Card: OEE', category: VisibilityCategory.PLANT_DASHBOARD, group: VisibilityGroup.OEE, location: 'Plant Dashboard / Machine List', defaultVisible: true },

];


export let DATA_ITEM_REGISTRY: DataItem[] = [...STATIC_REGISTRY];
let isRegistryLoaded = false;

export const loadRegistry = async () => {
    if (isRegistryLoaded) return DATA_ITEM_REGISTRY;

    try {
        const items = await handleResponse(await fetch(`${API_BASE}/visibility/items`, { headers: getAuthHeaders() }));
        if (items && items.length > 0) {
            DATA_ITEM_REGISTRY = items.map((i: any) => ({
                id: i.id.toString(),
                key: i.key,
                label: i.label,
                category: i.category as VisibilityCategory,
                group: i.group_name as VisibilityGroup,
                location: i.location,
                defaultVisible: i.default_visible
            }));
        } else {
             const plants = await plantService.getAllPlants();
             plants.forEach(plant => {
                plant.machines.forEach(machine => {
                    DATA_ITEM_REGISTRY.push({
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
        }
        isRegistryLoaded = true;
    } catch(e) {
        console.warn("Using static registry due to API failure");
    }
    return DATA_ITEM_REGISTRY;
};

/* ============================================================
   VISIBILITY STATE MODEL (CONTEXT-AWARE)
   ============================================================ */

type VisibilityRules = Record<string, boolean>; // { [dataItemKey]: boolean }
type ScopeRules = Record<string, VisibilityRules>; // { [scopeKey]: VisibilityRules }
type VisibilityState = Record<string, ScopeRules>; // { [role]: ScopeRules }


let state: VisibilityState = {};

export const loadVisibilityRules = async () => {
     try {
         const rules = await handleResponse(await fetch(`${API_BASE}/visibility/rules`, { headers: getAuthHeaders() }));
         await loadRegistry();
         state = {};
     } catch(e) {
         const stored = localStorage.getItem('SMART_MONITORING_DATA_VISIBILITY_V8');
         if (stored) state = JSON.parse(stored);
     }
};

/* ------------------ INTERNAL HELPERS ------------------- */
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
            return `PLANT:${context.plantId || 'ALL_PLANTS'}`;
        case VisibilityCategory.MACHINE_DETAIL:
            if (context.machineId) return `MACHINE:${context.machineId}`;
            if (context.plantId) return `PLANT:${context.plantId}`;
            return 'PLANT:ALL_PLANTS';
        default:
            return 'OTHER';
    }
};

/* ============================================================
   PUBLIC API
   ============================================================ */

export const getVisibilityRulesForRoleAndScope = (role: UserRole, scopeKey: string): VisibilityRules => {
    return state[role]?.[scopeKey] || {};
};

export const updateVisibilityRule = (
    role: UserRole,
    context: { category: VisibilityCategory, plantId?: string, machineId?: string },
    dataItemKey: string,
    visible: boolean
) => {
    const scopeKey = getScopeKey(context);
    if (!state[role]) state[role] = {};
    if (!state[role][scopeKey]) state[role][scopeKey] = {};
    state[role][scopeKey][dataItemKey] = visible;
};

export const bulkUpdateVisibilityRules = (
    role: UserRole,
    context: { category: VisibilityCategory, plantId?: string },
    updates: Record<string, boolean>
) => {
     const scopeKey = getScopeKey(context);
    if (!state[role]) state[role] = {};
    if (!state[role][scopeKey]) state[role][scopeKey] = {};
    state[role][scopeKey] = {
        ...state[role][scopeKey],
        ...updates,
    };
};

export const isDataItemVisible = (
    role: UserRole,
    dataItemKey: string,
    context?: { plantId?: string; machineId?: string }
): boolean => {
    if (role === UserRole.ADMINISTRATOR) return true;

    const item = DATA_ITEM_REGISTRY.find(i => i.key === dataItemKey);

    const roleState = state[role] || {};

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

    if (item && item.category !== VisibilityCategory.GLOBAL_DASHBOARD) {
        const allPlantsScopeKey = 'PLANT:ALL_PLANTS';
        if (roleState[allPlantsScopeKey]?.[dataItemKey] !== undefined) {
            return roleState[allPlantsScopeKey][dataItemKey];
        }
    } else {
        const globalScopeKey = 'GLOBAL';
        if (roleState[globalScopeKey]?.[dataItemKey] !== undefined) {
            return roleState[globalScopeKey][dataItemKey];
        }
    }

    return item ? item.defaultVisible : true;
};

export { getScopeKey as getScopeKeyForSettings };
