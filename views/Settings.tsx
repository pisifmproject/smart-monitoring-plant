
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
    LayoutDashboard, Factory, Monitor, Zap, LayoutGrid, Globe, Grid,
    Settings, Sliders, ListFilter
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
        label: 'Utility & Energy', 
        icon: Zap, 
        types: [
            VisibilityCategory.UTILITY,
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
        const categories = Object.values(VisibilityCategory) as VisibilityCategory[];
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
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in zoom-in">
                <div className="bg-rose-500/10 p-6 rounded-full border border-rose-500/20 shadow-lg shadow-rose-900/20">
                    <Shield size={48} className="text-rose-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
                    <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                        This configuration console is restricted to Administrator accounts only.
                    </p>
                </div>
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
        <div className="space-y-8">
            {/* Control Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 shadow-sm sticky top-0 z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    {/* Role Selector */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={16} className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <select
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value as UserRole)}
                            className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded-md text-sm text-white font-medium outline-none appearance-none transition-all cursor-pointer"
                        >
                            {ROLE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown size={14} className="text-slate-500" />
                        </div>
                    </div>

                    {/* Plant Selector */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Factory size={16} className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <select
                            value={selectedPlant}
                            onChange={(e) => setSelectedPlant(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded-md text-sm text-white font-medium outline-none appearance-none transition-all cursor-pointer"
                        >
                            {PLANTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown size={14} className="text-slate-500" />
                        </div>
                    </div>

                    {/* Category Selector */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <ListFilter size={16} className="text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <select
                            value={selectedCategoryFilter}
                            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded-md text-sm text-white font-medium outline-none appearance-none transition-all cursor-pointer"
                        >
                            {CATEGORY_FILTERS.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown size={14} className="text-slate-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-in slide-in-from-bottom-2 duration-500 min-h-[400px]">
                {Object.keys(groupedItems).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                        <div className="p-4 bg-slate-800 rounded-full mb-4">
                            <Sliders size={24} className="text-slate-500" />
                        </div>
                        <p className="text-slate-400 font-medium">No configuration items found for this selection.</p>
                        <p className="text-slate-600 text-sm mt-1">Try changing the plant or category filter.</p>
                    </div>
                ) : (
                    <div className="space-y-10">
                        {Object.entries(groupedItems).map(([category, groups]) => {
                            const filterMatch = CATEGORY_FILTERS.find(f => f.types.includes(category as VisibilityCategory));
                            const CatIcon = filterMatch?.icon || LayoutDashboard;
                            const formatCatName = category.replace(/_/g, " ").replace('MAIN PANEL', 'PANEL');
                            
                            return (
                                <div key={category} className="space-y-4">
                                    {/* Category Header */}
                                    <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
                                        <div className="p-1.5 bg-slate-800 rounded text-slate-400">
                                            <CatIcon size={18} />
                                        </div>
                                        <h3 className="text-lg font-bold text-white capitalize tracking-tight">{formatCatName.toLowerCase()}</h3>
                                    </div>

                                    {/* Groups Grid */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                        {Object.entries(groups).map(([group, items]) => (
                                            <div key={group} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full hover:border-slate-700 transition-colors shadow-sm">
                                                {/* Group Header */}
                                                <div className="px-5 py-3 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                                                    <span className="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                        {group}
                                                    </span>
                                                    <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full border border-slate-700">
                                                        {items.length}
                                                    </span>
                                                </div>
                                                
                                                {/* Items List */}
                                                <div className="flex-1 divide-y divide-slate-800/50 bg-slate-900/30">
                                                    {items.map(item => {
                                                        const isVisible = visibilityRules[item.key] ?? item.defaultVisible;
                                                        return (
                                                            <div 
                                                                key={item.key} 
                                                                onClick={() => handleToggleVisibility(item.key, item.category)}
                                                                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-800 cursor-pointer group transition-colors"
                                                            >
                                                                <div className="pr-4 min-w-0">
                                                                    <p className={`text-sm font-medium transition-colors truncate ${isVisible ? 'text-slate-200' : 'text-slate-500'}`}>
                                                                        {item.label}
                                                                    </p>
                                                                    <p className="text-[10px] text-slate-600 font-mono mt-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                                                        {item.key}
                                                                    </p>
                                                                </div>
                                                                
                                                                {/* Toggle */}
                                                                <div className={`shrink-0 w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${isVisible ? 'bg-blue-600' : 'bg-slate-700 border border-slate-600'}`}>
                                                                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${isVisible ? 'translate-x-5' : 'translate-x-0'}`}></div>
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
                )}
            </div>
        </div>
    );

    const NavButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
        <button 
            onClick={() => setActiveSection(id)} 
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${
                activeSection === id 
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 items-start">
            {/* Sidebar Settings Navigation */}
            <div className="w-full lg:w-64 bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col shrink-0 sticky top-6 overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Admin</h2>
                </div>
                <div className="p-2 space-y-1">
                    <NavButton id="visibility" label="Visibility Control" icon={Eye} />
                    <NavButton id="users" label="Users & Roles" icon={User} />
                    <NavButton id="alerts" label="Notifications" icon={Bell} />
                    <NavButton id="database" label="Data Management" icon={Database} />
                </div>
                <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900/50">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Settings size={12} />
                        <span>Build v2.5.0</span>
                    </div>
                </div>
            </div>

            {/* Main Settings Panel */}
            <div className="flex-1 min-w-0">
                <header className="mb-8 border-b border-slate-800 pb-6">
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        {activeSection === "visibility" ? <Eye className="text-blue-500" /> : <Settings className="text-slate-500" />}
                        {activeSection === "visibility" ? "Master Visibility Settings" : `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Configuration`}
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                        Configure system-wide visibility rules, user permissions, and dashboard layout preferences across all plant scopes.
                    </p>
                </header>

                {activeSection === "visibility" ? renderVisibilitySettings() : (
                    <Card title="Module Status">
                        <div className="py-16 text-center">
                            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
                                <Database size={32} className="text-slate-600" />
                            </div>
                            <h3 className="text-white font-bold text-xl mb-2">Module Under Development</h3>
                            <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                                The {activeSection} configuration module is currently being updated by the engineering team. Please check back in the next release cycle.
                            </p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default SettingsView;
