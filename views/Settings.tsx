
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, VisibilityCategory, VisibilityGroup } from '../types';
import { Card } from '../components/SharedComponents';
import {
    DATA_ITEM_REGISTRY,
    getVisibilityRulesForRoleAndScope,
    updateVisibilityRule,
    getScopeKeyForSettings
} from '../services/visibilityStore';

import {
    User, Shield, Bell, Database,
    Eye, ChevronDown, Check,
    LayoutDashboard, Factory, Monitor, Zap, LayoutGrid, Globe, Grid
} from 'lucide-react';

interface SettingsProps {
    userRole: UserRole;
}

const PLANTS = [
    { id: "ALL_PLANTS", name: "All Plants (Default)" },
    { id: "CIKOKOL", name: "Plant Cikokol" },
    { id: "CIKUPA", name: "Plant Cikupa" },
    { id: "AGRO", name: "Plant Agro" },
    { id: "SEMARANG", name: "Plant Semarang" }
];

const ROLE_OPTIONS = [
    { label: 'Supervisor', value: UserRole.SUPERVISOR },
    { label: 'Operator', value: UserRole.OPERATOR },
    { label: 'Maintenance', value: UserRole.MAINTENANCE },
    { label: 'Quality Control', value: UserRole.QC },
    { label: 'Management', value: UserRole.MANAGEMENT },
    { label: 'Guest', value: UserRole.VIEWER }, 
];

const CATEGORY_FILTERS = [
    { 
        id: 'GLOBAL_DASHBOARD', 
        label: 'Global Dashboard', 
        icon: Globe, 
        types: [VisibilityCategory.GLOBAL_DASHBOARD] 
    },
    { 
        id: 'PLANT_DASHBOARD', 
        label: 'Plant Dashboard', 
        icon: Factory, 
        types: [VisibilityCategory.PLANT_DASHBOARD, VisibilityCategory.MACHINE_DETAIL] 
    },
    { 
        id: 'UTILITY', 
        label: 'Utility', 
        icon: Zap, 
        types: [VisibilityCategory.UTILITY] 
    },
    { 
        id: 'MAIN_PANEL', 
        label: 'Main Panel', 
        icon: LayoutGrid, 
        types: [
            VisibilityCategory.MAIN_PANEL_1, 
            VisibilityCategory.MAIN_PANEL_2, 
            VisibilityCategory.MAIN_PANEL_3, 
            VisibilityCategory.MAIN_PANEL_4
        ] 
    },
];

const SettingsView: React.FC<SettingsProps> = ({ userRole }) => {
    const [activeSection, setActiveSection] = useState("visibility");
    const [targetRole, setTargetRole] = useState<UserRole>(UserRole.SUPERVISOR);
    const [selectedPlant, setSelectedPlant] = useState("ALL_PLANTS");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("GLOBAL_DASHBOARD");
    const [visibilityRules, setVisibilityRules] = useState<Record<string, boolean>>({});

    // Determine scopes to fetch based on selected plant
    const currentScopeKeys = useMemo(() => {
        const categories = Object.values(VisibilityCategory);
        const keys: Record<string, string> = {};
        categories.forEach(cat => {
            keys[cat] = getScopeKeyForSettings({ category: cat, plantId: selectedPlant });
        });
        return keys;
    }, [selectedPlant]);

    // Load rules whenever role or plant changes
    useEffect(() => {
        let allRules: Record<string, boolean> = {};
        Object.values(currentScopeKeys).forEach(scopeKey => {
            const rules = getVisibilityRulesForRoleAndScope(targetRole, scopeKey);
            allRules = { ...allRules, ...rules };
        });
        setVisibilityRules(allRules);
    }, [targetRole, currentScopeKeys]);

    if (userRole !== UserRole.ADMINISTRATOR) {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 animate-in fade-in zoom-in">
                <div className="bg-rose-500/10 p-8 rounded-full border border-rose-500/20">
                    <Shield size={64} className="text-rose-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Access Denied</h2>
                <p className="text-slate-400 max-w-md text-base">
                    Only Administrators have access to system settings.
                </p>
            </div>
        );
    }

    const handleToggleVisibility = (key: string, category: VisibilityCategory) => {
        const item = DATA_ITEM_REGISTRY.find(i => i.key === key);
        const currentVisibility = visibilityRules[key] ?? item?.defaultVisible ?? true;
        const newVisibility = !currentVisibility;

        // Update Store
        updateVisibilityRule(
            targetRole, 
            { category, plantId: selectedPlant }, 
            key, 
            newVisibility
        );

        // Update Local State for UI
        setVisibilityRules(prev => ({ ...prev, [key]: newVisibility }));
    };

    // Filter Items based on Plant Scope AND Category Filter
    const filteredItems = useMemo(() => {
        const activeFilter = CATEGORY_FILTERS.find(f => f.id === selectedCategoryFilter);
        const allowedCategories = activeFilter?.types || [];

        return DATA_ITEM_REGISTRY.filter(item => {
            // 1. Filter by Category Type
            if (!allowedCategories.includes(item.category)) return false;

            // 2. Filter by Plant Scope (if specific plant selected)
            if (selectedPlant !== "ALL_PLANTS") {
                // Filter Machines
                if (item.group === VisibilityGroup.MACHINES) {
                    if (!item.key.includes(selectedPlant)) return false;
                }
                // Filter Utility Cards
                if (item.category === VisibilityCategory.UTILITY && item.key.startsWith('SHOW_LVMDP_CARD_')) {
                    if (!item.key.includes(selectedPlant)) return false;
                }
            }
            return true;
        });
    }, [selectedPlant, selectedCategoryFilter]);

    // Group the filtered items by Category -> Group
    const groupedItems = useMemo(() => {
        const groups: Record<string, Record<string, typeof DATA_ITEM_REGISTRY>> = {};
        
        filteredItems.forEach(item => {
            if (!groups[item.category]) groups[item.category] = {};
            if (!groups[item.category][item.group]) groups[item.category][item.group] = [];
            groups[item.category][item.group].push(item);
        });
        return groups;
    }, [filteredItems]);

    const renderVisibilitySettings = () => (
        <div className="space-y-6">
            {/* Control Bar */}
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-lg space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Role Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <User size={14} /> Target Role
                        </label>
                        <div className="relative group">
                            <select
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value as UserRole)}
                                className="w-full appearance-none bg-slate-800 hover:bg-slate-750 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:border-blue-500 outline-none transition-colors cursor-pointer"
                            >
                                {ROLE_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-white transition-colors" size={16} />
                        </div>
                    </div>

                    {/* Plant Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Factory size={14} /> Context Scope
                        </label>
                        <div className="relative group">
                            <select
                                value={selectedPlant}
                                onChange={(e) => setSelectedPlant(e.target.value)}
                                className="w-full appearance-none bg-slate-800 hover:bg-slate-750 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:border-blue-500 outline-none transition-colors cursor-pointer"
                            >
                                {PLANTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-white transition-colors" size={16} />
                        </div>
                    </div>

                    {/* Category Selector */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <Grid size={14} /> Category
                        </label>
                        <div className="relative group">
                            <select
                                value={selectedCategoryFilter}
                                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                                className="w-full appearance-none bg-slate-800 hover:bg-slate-750 border border-slate-600 rounded-xl px-4 py-3 text-white font-medium focus:border-blue-500 outline-none transition-colors cursor-pointer"
                            >
                                {CATEGORY_FILTERS.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-white transition-colors" size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Render */}
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                {Object.keys(groupedItems).length === 0 && (
                    <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                        <p className="text-slate-500">No settings available for this selection.</p>
                    </div>
                )}

                {Object.entries(groupedItems).map(([category, groups]) => {
                    // Find icon from filters if possible, else generic
                    const filterMatch = CATEGORY_FILTERS.find(f => f.types.includes(category as VisibilityCategory));
                    const CatIcon = filterMatch?.icon || LayoutDashboard;
                    const formatCatName = category.replace(/_/g, " ").replace('MAIN PANEL', 'PANEL');
                    
                    return (
                        <div key={category} className="space-y-4">
                            <div className="flex items-center gap-3 px-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                                    <CatIcon size={20} />
                                </div>
                                <h3 className="text-lg font-bold text-white capitalize">{formatCatName.toLowerCase()}</h3>
                                <div className="h-px bg-slate-800 flex-1 ml-4"></div>
                            </div>

                            {/* Dynamic Layout: Grid for cleaner look */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {Object.entries(groups).map(([group, items]) => (
                                    <div key={group} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-colors h-fit">
                                        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{group}</span>
                                        </div>
                                        <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {items.map(item => {
                                                const isVisible = visibilityRules[item.key] ?? item.defaultVisible;
                                                return (
                                                    <div 
                                                        key={item.key} 
                                                        onClick={() => handleToggleVisibility(item.key, item.category)}
                                                        className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer group transition-colors border border-transparent hover:border-slate-700/50"
                                                    >
                                                        <div className="min-w-0 pr-2">
                                                            <p className={`font-medium text-sm transition-colors truncate ${isVisible ? 'text-slate-200' : 'text-slate-500'}`}>
                                                                {item.label}
                                                            </p>
                                                            {/* Show key for advanced users/debugging if needed, or hide to be cleaner */}
                                                            <p className="text-[10px] text-slate-600 font-mono mt-0.5 group-hover:text-slate-500 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {item.key}
                                                            </p>
                                                        </div>
                                                        
                                                        {/* Toggle Switch */}
                                                        <div className={`shrink-0 w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${isVisible ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                                            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${isVisible ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Sidebar Navigation for Settings */}
            <div className="w-full lg:w-64 bg-slate-900 p-2 rounded-xl border border-slate-800 shadow-sm flex flex-row lg:flex-col overflow-x-auto gap-1 self-start shrink-0 sticky top-6">
                <button onClick={() => setActiveSection("visibility")} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-all ${activeSection === "visibility" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                    <Eye size={18} /> Visibility
                </button>
                <button onClick={() => setActiveSection("users")} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-all ${activeSection === "users" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                    <User size={18} /> Users & Roles
                </button>
                <button onClick={() => setActiveSection("alerts")} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-all ${activeSection === "alerts" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                    <Bell size={18} /> Notifications
                </button>
                <button onClick={() => setActiveSection("database")} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 transition-all ${activeSection === "database" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                    <Database size={18} /> Database
                </button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 pb-20">
                <header className="mb-6">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                        {activeSection === "visibility" ? "Master Visibility Settings" : `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Settings`}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Configure system-wide parameters and access controls.
                    </p>
                </header>

                {activeSection === "visibility" ? renderVisibilitySettings() : (
                    <Card title="Feature Not Implemented">
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <SettingsPropsIcon size={32} className="text-slate-500" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Coming Soon</h3>
                            <p className="text-slate-400 max-w-sm mx-auto">
                                This settings module is currently under development. Please check back in a future update.
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

function SettingsPropsIcon(props: any) {
    return <Database {...props} />;
}

export default SettingsView;
