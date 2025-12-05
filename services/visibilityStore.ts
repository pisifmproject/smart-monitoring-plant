
import { UserRole, VisibilityItem, WidgetCategory, WidgetType } from '../types';

// The Central Registry of all controllable UI Widgets
export const WIDGET_REGISTRY: VisibilityItem[] = [
    // --- GLOBAL DASHBOARD ---
    { id: '1', key: 'GLOBAL_KPI_OUTPUT', label: 'Total Output KPI', category: WidgetCategory.GLOBAL, location: 'Global Dashboard', type: WidgetType.KPI, defaultVisible: true },
    { id: '2', key: 'GLOBAL_KPI_OEE', label: 'Average OEE KPI', category: WidgetCategory.GLOBAL, location: 'Global Dashboard', type: WidgetType.KPI, defaultVisible: true },
    { id: '3', key: 'GLOBAL_KPI_ENERGY', label: 'Total Energy KPI', category: WidgetCategory.GLOBAL, location: 'Global Dashboard', type: WidgetType.KPI, defaultVisible: true },
    { id: '4', key: 'GLOBAL_KPI_ALARMS', label: 'Active Alarms KPI', category: WidgetCategory.GLOBAL, location: 'Global Dashboard', type: WidgetType.KPI, defaultVisible: true },
    { id: '5', key: 'GLOBAL_CHART_OUTPUT', label: 'Production Output Chart', category: WidgetCategory.GLOBAL, location: 'Global Dashboard', type: WidgetType.CHART, defaultVisible: true },
    { id: '6', key: 'GLOBAL_CHART_DOWNTIME', label: 'Downtime Ranking Chart', category: WidgetCategory.GLOBAL, location: 'Global Dashboard', type: WidgetType.CHART, defaultVisible: true },
    { id: '7', key: 'GLOBAL_CHART_ENERGY', label: 'Energy Consumption Chart', category: WidgetCategory.GLOBAL, location: 'Global Dashboard', type: WidgetType.CHART, defaultVisible: true },
    { id: '8', key: 'GLOBAL_CHART_OEE_COMP', label: 'OEE Comparison Chart', category: WidgetCategory.GLOBAL, location: 'Global Dashboard', type: WidgetType.CHART, defaultVisible: true },
    { id: '9', key: 'GLOBAL_PLANT_LIST', label: 'Plant Status Cards', category: WidgetCategory.GLOBAL, location: 'Global Dashboard', type: WidgetType.CARD, defaultVisible: true },

    // --- PLANT DASHBOARD ---
    { id: '10', key: 'PLANT_KPI_SUMMARY', label: 'Plant Summary KPIs (Output, OEE, etc.)', category: WidgetCategory.PLANT, location: 'Plant Dashboard', type: WidgetType.KPI, defaultVisible: true },
    { id: '11', key: 'PLANT_WIDGET_SHIFT', label: 'Shift Performance Table', category: WidgetCategory.PLANT, location: 'Plant Dashboard', type: WidgetType.TABLE, defaultVisible: true },
    { id: '12', key: 'PLANT_WIDGET_ALARMS', label: 'Active Alarms List', category: WidgetCategory.PLANT, location: 'Plant Dashboard', type: WidgetType.TABLE, defaultVisible: true },
    { id: '13', key: 'PLANT_GRID_MACHINES', label: 'Production Lines Grid', category: WidgetCategory.PLANT, location: 'Plant Dashboard', type: WidgetType.CARD, defaultVisible: true },
    { id: '14', key: 'PLANT_GRID_LVMDP', label: 'LVMDP Overview Grid', category: WidgetCategory.PLANT, location: 'Plant Dashboard', type: WidgetType.CARD, defaultVisible: true },

    // --- MACHINE DETAIL ---
    { id: '20', key: 'MACHINE_TAB_PERFORMANCE', label: 'Tab: Performance', category: WidgetCategory.MACHINE, location: 'Machine Detail', type: WidgetType.TAB, defaultVisible: true },
    { id: '21', key: 'MACHINE_TAB_PROCESS', label: 'Tab: Process Parameters', category: WidgetCategory.MACHINE, location: 'Machine Detail', type: WidgetType.TAB, defaultVisible: true },
    { id: '22', key: 'MACHINE_TAB_HEALTH', label: 'Tab: Machine Health', category: WidgetCategory.MACHINE, location: 'Machine Detail', type: WidgetType.TAB, defaultVisible: true },
    { id: '23', key: 'MACHINE_TAB_UTILITY', label: 'Tab: Utility', category: WidgetCategory.MACHINE, location: 'Machine Detail', type: WidgetType.TAB, defaultVisible: true },
    { id: '24', key: 'MACHINE_TAB_ALARMS', label: 'Tab: Alarms', category: WidgetCategory.MACHINE, location: 'Machine Detail', type: WidgetType.TAB, defaultVisible: true },
    { id: '25', key: 'MACHINE_TAB_DOWNTIME', label: 'Tab: Downtime', category: WidgetCategory.MACHINE, location: 'Machine Detail', type: WidgetType.TAB, defaultVisible: true },
    { id: '26', key: 'MACHINE_TAB_MAINTENANCE', label: 'Tab: Maintenance', category: WidgetCategory.MACHINE, location: 'Machine Detail', type: WidgetType.TAB, defaultVisible: true },
    
    // --- LVMDP DETAIL ---
    { id: '30', key: 'LVMDP_KPI_MAIN', label: 'Main Power KPIs (P, Q, S, PF)', category: WidgetCategory.LVMDP, location: 'LVMDP Detail', type: WidgetType.KPI, defaultVisible: true },
    { id: '31', key: 'LVMDP_WIDGET_PHASE', label: 'Phase Monitoring Table', category: WidgetCategory.LVMDP, location: 'LVMDP Detail', type: WidgetType.TABLE, defaultVisible: true },
    { id: '32', key: 'LVMDP_WIDGET_ENERGY', label: 'Energy Metrics & Trend', category: WidgetCategory.LVMDP, location: 'LVMDP Detail', type: WidgetType.CHART, defaultVisible: true },
    { id: '33', key: 'LVMDP_WIDGET_STATUS', label: 'Panel Status & Environment', category: WidgetCategory.LVMDP, location: 'LVMDP Detail', type: WidgetType.CARD, defaultVisible: true },
    { id: '34', key: 'LVMDP_WIDGET_QUALITY', label: 'Power Quality (Harmonics)', category: WidgetCategory.LVMDP, location: 'LVMDP Detail', type: WidgetType.CHART, defaultVisible: true },

    // --- UTILITY SUMMARY ---
    { id: '40', key: 'UTILITY_KPI_ALL', label: 'All Utility KPIs', category: WidgetCategory.UTILITY, location: 'Utility Summary', type: WidgetType.KPI, defaultVisible: true },
    { id: '41', key: 'UTILITY_CHART_TREND', label: 'Consumption Trend Chart', category: WidgetCategory.UTILITY, location: 'Utility Summary', type: WidgetType.CHART, defaultVisible: true },
    { id: '42', key: 'UTILITY_CHART_DIST', label: 'Distribution Breakdown', category: WidgetCategory.UTILITY, location: 'Utility Summary', type: WidgetType.CHART, defaultVisible: true },
];

// Type for the visibility store state: { [Role]: { [WidgetKey]: boolean } }
type VisibilityState = Record<string, Record<string, boolean>>;

// LocalStorage key
const STORAGE_KEY = 'SMART_MONITORING_VISIBILITY_V1';

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

export const updateVisibilityRule = (role: UserRole, widgetKey: string, isVisible: boolean) => {
    if (!currentState[role]) {
        currentState[role] = {};
    }
    currentState[role][widgetKey] = isVisible;
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
export const isWidgetVisible = (role: UserRole, widgetKey: string): boolean => {
    // 1. ADMIN sees everything always
    if (role === UserRole.ADMINISTRATOR) {
        return true;
    }

    // 2. Check for Role-Specific Override
    const roleRules = currentState[role];
    if (roleRules && typeof roleRules[widgetKey] !== 'undefined') {
        return roleRules[widgetKey];
    }

    // 3. Fallback to Default defined in Registry
    const widget = WIDGET_REGISTRY.find(w => w.key === widgetKey);
    return widget ? widget.defaultVisible : true;
};
