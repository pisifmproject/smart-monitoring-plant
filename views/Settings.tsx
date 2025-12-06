
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, VisibilityCategory, VisibilityGroup } from '../types';
import { Card } from '../components/SharedComponents';
import {
    DATA_ITEM_REGISTRY,
    getVisibilityRulesForRoleAndScope,
    updateVisibilityRule,
    bulkUpdateVisibilityRules,
    getScopeKeyForSettings
} from '../services/visibilityStore';

import {
    Save, User, Shield, Bell, Database,
    Eye, EyeOff, Filter, CheckSquare, Square,
    CheckCircle2, Layers
} from 'lucide-react';

interface SettingsProps {
    userRole: UserRole;
}

const PLANTS = [
    { id: "ALL_PLANTS", name: "All Plants" },
    { id: "CIKOKOL", name: "Plant Cikokol" },
    { id: "CIKUPA", name: "Plant Cikupa" },
    { id: "AGRO", name: "Plant Agro" },
    { id: "SEMARANG", name: "Plant Semarang" }
];

const SettingsView: React.FC<SettingsProps> = ({ userRole }) => {
    const [activeSection, setActiveSection] = useState("visibility");
    const [targetRole, setTargetRole] = useState<UserRole>(UserRole.SUPERVISOR);
    const [selectedPlant, setSelectedPlant] = useState("ALL_PLANTS");
    const [filterCategory, setFilterCategory] = useState<VisibilityCategory | "ALL">(VisibilityCategory.PLANT_DASHBOARD);
    const [filterGroup, setFilterGroup] = useState("ALL");
    const [visibilityRules, setVisibilityRules] = useState<Record<string, boolean>>({});

    // When category changes to GLOBAL, lock plant to ALL
    useEffect(() => {
        if (filterCategory === VisibilityCategory.GLOBAL_DASHBOARD) {
            setSelectedPlant("ALL_PLANTS");
        }
    }, [filterCategory]);

    // Determine the scope key for fetching/updating rules
    const activeScopeKey = useMemo(() => {
        return getScopeKeyForSettings({ 
            category: filterCategory as VisibilityCategory, 
            plantId: selectedPlant 
        });
    }, [targetRole, selectedPlant, filterCategory]);

    // Load rules whenever the role or scope changes
    useEffect(() => {
        const rules = getVisibilityRulesForRoleAndScope(targetRole, activeScopeKey);
        setVisibilityRules(rules);
    }, [targetRole, activeScopeKey]);

    if (userRole !== UserRole.ADMINISTRATOR) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-6 animate-in fade-in zoom-in">
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

    const handleToggleVisibility = (key: string) => {
        const currentVisibility = visibilityRules[key] ?? DATA_ITEM_REGISTRY.find(i => i.key === key)?.defaultVisible ?? true;
        const newVisibility = !currentVisibility;

        updateVisibilityRule(
            targetRole, 
            { category: filterCategory as VisibilityCategory, plantId: selectedPlant }, 
            key, 
            newVisibility
        );

        setVisibilityRules(prev => ({ ...prev, [key]: newVisibility }));
    };

    const handleSelectAll = (select: boolean) => {
        const updates: Record<string, boolean> = {};
        filteredItems.forEach(item => {
            updates[item.key] = select;
        });

        bulkUpdateVisibilityRules(
            targetRole, 
            { category: filterCategory as VisibilityCategory, plantId: selectedPlant },
            updates
        );

        setVisibilityRules(prev => ({ ...prev, ...updates }));
    };

    const filteredItems = DATA_ITEM_REGISTRY.filter(item => {
        if (filterCategory !== "ALL" && item.category !== filterCategory) return false;
        if (filterGroup !== "ALL" && item.group !== filterGroup) return false;
        return true;
    });

    const renderVisibilitySettings = () => (
        <Card title="Master Data Visibility Control">
            <div className="space-y-6">
                <div className="flex flex-col xl:flex-row justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-700">
                    <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                            <label className="text-xs font-bold uppercase text-slate-400">Role</label>
                            <select
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value as UserRole)}
                                className="bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white"
                            >
                                {Object.values(UserRole).filter(r => r !== UserRole.ADMINISTRATOR).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                            <label className="text-xs font-bold uppercase text-slate-400">Plant</label>
                            <select
                                value={selectedPlant}
                                onChange={(e) => setSelectedPlant(e.target.value)}
                                className="bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white"
                                disabled={filterCategory === VisibilityCategory.GLOBAL_DASHBOARD}
                            >
                                {PLANTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><Filter size={12} /> Category</label>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value as VisibilityCategory | "ALL")}
                                className="bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white"
                            >
                                <option value="ALL">All Categories</option>
                                {Object.values(VisibilityCategory).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
                            <label className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><Layers size={12} /> Group</label>
                            <select
                                value={filterGroup}
                                onChange={(e) => setFilterGroup(e.target.value)}
                                className="bg-slate-800 border border-slate-600 rounded-lg p-2.5 text-white"
                            >
                                <option value="ALL">All Groups</option>
                                {Object.values(VisibilityGroup).map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => handleSelectAll(true)} className="bg-emerald-900/30 text-emerald-400 border border-emerald-800 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><CheckSquare size={16} /> Show All</button>
                        <button onClick={() => handleSelectAll(false)} className="bg-rose-900/30 text-rose-400 border border-rose-800 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"><Square size={16} /> Hide All</button>
                    </div>
                </div>
                <div className="border border-slate-700 rounded-xl overflow-hidden shadow-sm">
                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left text-slate-300">
                            <thead className="bg-slate-900 text-xs font-bold uppercase sticky top-0">
                                <tr>
                                    <th className="p-3">Data Label</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Group</th>
                                    <th className="p-3 text-center">Visible</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredItems.length === 0 ? (
                                    <tr><td colSpan={4} className="p-6 text-center text-slate-500">No data items found with the selected filters.</td></tr>
                                ) : filteredItems.map(item => {
                                    const isVisible = visibilityRules[item.key] ?? item.defaultVisible;
                                    return (
                                        <tr key={item.key} className="hover:bg-slate-800/40">
                                            <td className="p-3"><p className="text-white font-bold">{item.label}</p><p className="text-xs text-slate-500 font-mono">{item.key}</p></td>
                                            <td className="p-3"><span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono border border-slate-700">{item.category}</span></td>
                                            <td className="p-3"><span className="text-xs text-slate-400">{item.group}</span></td>
                                            <td className="p-3 text-center">
                                                <button onClick={() => handleToggleVisibility(item.key)} className={`p-2 rounded-lg transition-all ${isVisible ? "bg-blue-600 text-white shadow-lg hover:bg-blue-500" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}>
                                                    {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="text-xs text-slate-500 italic">Changes are saved automatically and applied based on Role, Plant, and Category context.</p>
            </div>
        </Card>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-full lg:w-64 bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-sm flex flex-row lg:flex-col overflow-x-auto gap-2">
                <button onClick={() => setActiveSection("visibility")} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSection === "visibility" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><Eye size={18} /> Master Visibility</button>
                <button onClick={() => setActiveSection("users")} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSection === "users" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><User size={18} /> Users & Roles</button>
                <button onClick={() => setActiveSection("alerts")} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSection === "alerts" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><Bell size={18} /> Notifications</button>
                <button onClick={() => setActiveSection("database")} className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold flex items-center gap-3 ${activeSection === "database" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:bg-slate-800"}`}><Database size={18} /> Database</button>
            </div>
            <div className="flex-1 space-y-6 pb-12">
                <h2 className="text-2xl font-bold text-white tracking-tight">{activeSection === "visibility" ? "Master Visibility Settings" : `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Settings`}</h2>
                {activeSection === "visibility" ? renderVisibilitySettings() : (
                    <Card title="Feature Not Implemented"><div className="p-6 text-slate-400">This section is a placeholder.</div></Card>
                )}
            </div>
        </div>
    );
};

export default SettingsView;
