

import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, VisibilityCategory, VisibilityGroup, DataItem, User, PlantCode, MachineType, Machine, LVMDP, Plant, UtilityConfig, MachineStatus } from '../types';
import { Card } from '../components/SharedComponents';
import {
    DATA_ITEM_REGISTRY,
    updateVisibilityRule,
    isDataItemVisible
} from '../services/visibilityStore';
import { plantService } from '../services/plantService'; 
import { lvmdpService } from '../services/lvmdpService';
import { utilityService } from '../services/utilityService';
import { getUsers, addUser, updateUser, deleteUser } from '../services/auth';

import {
    User as UserIcon, Shield, Bell, Database,
    Eye, ChevronDown, Check,
    LayoutDashboard, Factory, Monitor, Zap, LayoutGrid, Globe, Grid,
    Settings, Sliders, ListFilter, Plus, Edit, Trash2, X, Save, Wind
} from 'lucide-react';

interface SettingsProps {
    userRole: UserRole;
}

const PLANT_SCOPES_VISIBILITY = [
    { id: "ALL_PLANTS", name: "All Plants (Default)" },
    ...plantService.getAllPlants().map(p => ({id: p.id, name: p.name}))
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
        types: [VisibilityCategory.PLANT_DASHBOARD] 
    },
    { 
        id: 'MACHINE_DETAIL', 
        label: 'Machine Detail', 
        icon: Monitor, 
        types: [VisibilityCategory.MACHINE_DETAIL] 
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
    
    // Used to force re-renders when visibility store is updated
    const [tick, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

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
    
    const renderContent = () => {
        switch (activeSection) {
            case 'visibility':
                return <VisibilitySettings key={`vis-${tick}`} forceUpdate={forceUpdate} />;
            case 'users':
                return <UsersAndRolesSettings key={`users-${tick}`} forceUpdate={forceUpdate} />;
            case 'database':
                return <MasterDataSettings key={`db-${tick}`} forceUpdate={forceUpdate} />;
            default:
                return (
                     <Card title="Module Status">
                        <div className="py-16 text-center">
                            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800"><Database size={32} className="text-slate-600" /></div>
                            <h3 className="text-white font-bold text-xl mb-2">Module Under Development</h3>
                            <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
                                The {activeSection} configuration module is currently being updated by the engineering team. Please check back in the next release cycle.
                            </p>
                        </div>
                    </Card>
                );
        }
    }


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
            <div className="w-full lg:w-64 bg-slate-900 rounded-xl border border-slate-800 shadow-sm flex flex-col shrink-0 sticky top-6 overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Admin</h2>
                </div>
                <div className="p-2 space-y-1">
                    <NavButton id="visibility" label="Visibility Control" icon={Eye} />
                    <NavButton id="users" label="Users & Roles" icon={UserIcon} />
                    <NavButton id="alerts" label="Notifications" icon={Bell} />
                    <NavButton id="database" label="Master Data" icon={Database} />
                </div>
                <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900/50">
                    <div className="flex items-center gap-2 text-xs text-slate-500"><Settings size={12} /><span>Build v2.5.0</span></div>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <header className="mb-8 border-b border-slate-800 pb-6">
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        {activeSection === "visibility" && <Eye className="text-blue-500" />}
                        {activeSection === "users" && <UserIcon className="text-blue-500" />}
                        {activeSection === "database" && <Database className="text-blue-500" />}
                        {!["visibility", "users", "database"].includes(activeSection) && <Settings className="text-slate-500" />}
                        
                        {activeSection === "visibility" ? "Master Visibility Settings" : 
                         activeSection === "users" ? "User & Role Management" :
                         activeSection === "database" ? "Master Data Configuration" :
                         `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Configuration`}
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                        {activeSection === "visibility" ? "Configure system-wide visibility rules and dashboard layout preferences across all plant scopes." :
                         activeSection === "users" ? "Manage user accounts, assign roles, and set access permissions for the application." :
                         activeSection === "database" ? "Manage core system data including plants, machines, LVMDP panels, and utility configurations." :
                         "This module is currently under development."}
                    </p>
                </header>
                {renderContent()}
            </div>
        </div>
    );
};

// ===================================
// VISIBILITY SETTINGS COMPONENT
// ===================================

const VisibilitySettings = ({ forceUpdate }: { forceUpdate: () => void }) => {
    const [targetRole, setTargetRole] = useState<UserRole>(UserRole.SUPERVISOR);
    const [selectedPlant, setSelectedPlant] = useState("ALL_PLANTS");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("GLOBAL_DASHBOARD");

    const handleToggleVisibility = (key: string, category: VisibilityCategory, machineId?: string) => {
        const context = { plantId: selectedPlant, machineId };
        const currentVisibility = isDataItemVisible(targetRole, key, context);
        const newVisibility = !currentVisibility;

        updateVisibilityRule(
            targetRole, 
            { category, plantId: selectedPlant, machineId }, 
            key, 
            newVisibility
        );

        forceUpdate();
    };
    
    const machineVisibilityItems = useMemo(() => {
        if (selectedPlant === "ALL_PLANTS") return [];
        return DATA_ITEM_REGISTRY.filter(item => 
            item.group === VisibilityGroup.MACHINES &&
            item.key.includes(selectedPlant)
        );
    }, [selectedPlant]);

    const filteredItems = useMemo(() => {
        const activeFilter = CATEGORY_FILTERS.find(f => f.id === selectedCategoryFilter);
        const allowedCategories = activeFilter?.types || [];

        return DATA_ITEM_REGISTRY.filter(item => {
            if (!allowedCategories.includes(item.category)) return false;
            if (selectedPlant !== "ALL_PLANTS") {
                if (item.category === VisibilityCategory.UTILITY && item.key.startsWith('SHOW_LVMDP_CARD_')) {
                    if (!item.key.includes(selectedPlant)) return false;
                }
            }
            if (item.group === VisibilityGroup.MACHINES) return false;
            return true;
        });
    }, [selectedPlant, selectedCategoryFilter]);

    const groupedItems = useMemo(() => {
        const groups: Record<string, Record<string, typeof DATA_ITEM_REGISTRY>> = {};
        filteredItems.forEach(item => {
            if (!groups[item.category]) groups[item.category] = {};
            if (!groups[item.category][item.group]) groups[item.category][item.group] = [];
            groups[item.category][item.group].push(item);
        });
        return groups;
    }, [filteredItems]);

    const renderContent = () => {
        if (selectedCategoryFilter === 'MACHINE_DETAIL' && selectedPlant !== 'ALL_PLANTS') {
            const plant = plantService.getPlantById(selectedPlant);
            if (!plant) return <div className="text-slate-500 p-4">Plant not found.</div>;
            
            const allMachineDetailItems = DATA_ITEM_REGISTRY.filter(item => item.category === VisibilityCategory.MACHINE_DETAIL);
            const groupedDetailItems = allMachineDetailItems.reduce((acc, item) => {
                const group = item.group || VisibilityGroup.OTHER;
                if (!acc[group]) acc[group] = [];
                acc[group].push(item);
                return acc;
            }, {} as Record<string, DataItem[]>);

            return (
                <div className="space-y-12">
                     {machineVisibilityItems.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
                                <div className="p-1.5 bg-slate-800 rounded text-slate-400"><LayoutDashboard size={18} /></div>
                                <h3 className="text-lg font-bold text-white tracking-tight">Dashboard Visibility</h3>
                                <span className="text-xs font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700">Controls machine cards on the Plant Dashboard page</span>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full hover:border-slate-700 transition-colors shadow-sm">
                                    <div className="px-5 py-3 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                                        <span className="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>VISIBLE MACHINES</span>
                                    </div>
                                    <div className="flex-1 divide-y divide-slate-800/50 bg-slate-900/30">
                                        {machineVisibilityItems.map(item => {
                                            const isVisible = isDataItemVisible(targetRole, item.key, { plantId: selectedPlant });
                                            return (
                                                <div key={item.key} onClick={() => handleToggleVisibility(item.key, item.category)} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-800 cursor-pointer group transition-colors">
                                                    <p className={`text-sm font-medium transition-colors truncate ${isVisible ? 'text-slate-200' : 'text-slate-500'}`}>{item.label}</p>
                                                    <div className={`shrink-0 w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${isVisible ? 'bg-blue-600' : 'bg-slate-700 border border-slate-600'}`}><div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${isVisible ? 'translate-x-5' : 'translate-x-0'}`}></div></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
                            <div className="p-1.5 bg-slate-800 rounded text-slate-400"><Monitor size={18} /></div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Machine Detail Page Settings</h3>
                            <span className="text-xs font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700">Controls components inside each Machine's detail view</span>
                        </div>
                        <div className="space-y-8">
                            {plant.machines.map(machine => (
                                <Card key={machine.id} title={machine.name} className="bg-slate-900/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                        {Object.entries(groupedDetailItems).map(([groupName, items]) => (
                                            <div key={groupName}>
                                                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-slate-800">{groupName}</h4>
                                                <div className="space-y-3">
                                                    {items.map(item => {
                                                        const isVisible = isDataItemVisible(targetRole, item.key, { plantId: plant.id, machineId: machine.id });
                                                        return (
                                                            <div key={item.key} onClick={() => handleToggleVisibility(item.key, item.category, machine.id)} className="flex items-center justify-between hover:bg-slate-800/50 px-2 py-1 rounded-md cursor-pointer group transition-colors">
                                                                <p className={`text-sm font-medium transition-colors truncate ${isVisible ? 'text-slate-200' : 'text-slate-500'}`}>{item.label}</p>
                                                                <div className={`shrink-0 w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${isVisible ? 'bg-blue-600' : 'bg-slate-700 border border-slate-600'}`}><div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${isVisible ? 'translate-x-4' : 'translate-x-0'}`}></div></div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                </div>
            );
        }

        if (Object.keys(groupedItems).length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                    <div className="p-4 bg-slate-800 rounded-full mb-4"><Sliders size={24} className="text-slate-500" /></div>
                    <p className="text-slate-400 font-medium">No configuration items found for this selection.</p>
                    <p className="text-slate-600 text-sm mt-1">Try changing the plant or category filter.</p>
                </div>
            );
        }

        return (
            <div className="space-y-10">
                {Object.entries(groupedItems).map(([category, groups]) => {
                    const filterMatch = CATEGORY_FILTERS.find(f => f.types.includes(category as VisibilityCategory));
                    const CatIcon = filterMatch?.icon || LayoutDashboard;
                    const formatCatName = category.replace(/_/g, " ").replace('MAIN PANEL', 'PANEL');
                    return (
                        <div key={category} className="space-y-4">
                            <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
                                <div className="p-1.5 bg-slate-800 rounded text-slate-400"><CatIcon size={18} /></div>
                                <h3 className="text-lg font-bold text-white capitalize tracking-tight">{formatCatName.toLowerCase()}</h3>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {Object.entries(groups).map(([group, items]) => (
                                    <div key={group} className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full hover:border-slate-700 transition-colors shadow-sm">
                                        <div className="px-5 py-3 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                                            <span className="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{group}</span>
                                            <span className="text-[10px] font-bold bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full border border-slate-700">{items.length}</span>
                                        </div>
                                        <div className="flex-1 divide-y divide-slate-800/50 bg-slate-900/30">
                                            {items.map(item => {
                                                const isVisible = isDataItemVisible(targetRole, item.key, { plantId: selectedPlant });
                                                return (
                                                    <div key={item.key} onClick={() => handleToggleVisibility(item.key, item.category)} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-800 cursor-pointer group transition-colors">
                                                        <div className="pr-4 min-w-0">
                                                            <p className={`text-sm font-medium transition-colors truncate ${isVisible ? 'text-slate-200' : 'text-slate-500'}`}>{item.label}</p>
                                                            <p className="text-[10px] text-slate-600 font-mono mt-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">{item.key}</p>
                                                        </div>
                                                        <div className={`shrink-0 w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${isVisible ? 'bg-blue-600' : 'bg-slate-700 border border-slate-600'}`}><div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${isVisible ? 'translate-x-5' : 'translate-x-0'}`}></div></div>
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
        );
    };

    return (
        <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 shadow-sm sticky top-6 z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon size={16} className="text-slate-500" /></div>
                        <select value={targetRole} onChange={(e) => setTargetRole(e.target.value as UserRole)} className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded-md text-sm text-white font-medium outline-none appearance-none transition-all cursor-pointer">
                            {ROLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><ChevronDown size={14} className="text-slate-500" /></div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Factory size={16} className="text-slate-500" /></div>
                        <select value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)} className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded-md text-sm text-white font-medium outline-none appearance-none transition-all cursor-pointer">
                            {PLANT_SCOPES_VISIBILITY.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><ChevronDown size={14} className="text-slate-500" /></div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><ListFilter size={16} className="text-slate-500" /></div>
                        <select value={selectedCategoryFilter} onChange={(e) => setSelectedCategoryFilter(e.target.value)} className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded-md text-sm text-white font-medium outline-none appearance-none transition-all cursor-pointer">
                            {CATEGORY_FILTERS.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><ChevronDown size={14} className="text-slate-500" /></div>
                    </div>
                </div>
            </div>
            <div className="animate-in slide-in-from-bottom-2 duration-500 min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};

// ===================================
// USERS AND ROLES SETTINGS COMPONENT
// ===================================
const UsersAndRolesSettings = ({ forceUpdate }: { forceUpdate: () => void }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ username: '', name: '', role: UserRole.OPERATOR, password: '' });
    const [formError, setFormError] = useState('');
    
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    useEffect(() => {
        setUsers(getUsers());
    }, []);

    const openAddModal = () => {
        setEditingUser(null);
        setFormData({ username: '', name: '', role: UserRole.OPERATOR, password: '' });
        setFormError('');
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({ username: user.username, name: user.name, role: user.role, password: '' });
        setFormError('');
        setIsModalOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!formData.name || !formData.username) {
            setFormError('Username and Full Name are required.');
            return;
        }

        if (!editingUser && !formData.password) {
            setFormError('Password is required for new users.');
            return;
        }

        let result;
        if (editingUser) {
            result = updateUser(editingUser.username, {
                name: formData.name,
                role: formData.role,
                ...(formData.password && { pass: formData.password })
            });
        } else {
            result = addUser({ username: formData.username, name: formData.name, role: formData.role }, formData.password);
        }
        
        if (result.success) {
            setIsModalOpen(false);
            setUsers(getUsers()); // Refresh user list
            forceUpdate();
        } else {
            setFormError(result.message || 'An unknown error occurred.');
        }
    };
    
    const openDeleteConfirm = (username: string) => {
        setUserToDelete(username);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!userToDelete) return;
        const result = deleteUser(userToDelete);
        if(!result.success){
            alert(result.message);
        }
        setIsConfirmOpen(false);
        setUserToDelete(null);
        setUsers(getUsers()); // Refresh list
        forceUpdate();
    };

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">Current Users</h3>
                    <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md">
                        <Plus size={16} /> Add New User
                    </button>
                </div>
                <div className="overflow-x-auto">
                     <table className="w-full text-left text-slate-300">
                        <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-400">
                            <tr>
                                <th className="p-3">Full Name</th>
                                <th className="p-3">Corporate ID</th>
                                <th className="p-3">Role</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {users.map(user => (
                                <tr key={user.username} className="hover:bg-slate-800/50">
                                    <td className="p-3 font-bold text-white">{user.name}</td>
                                    <td className="p-3 font-mono">{user.username}</td>
                                    <td className="p-3"><span className="bg-slate-700 px-2 py-1 rounded-md text-xs font-bold text-blue-300">{user.role}</span></td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <button onClick={() => openEditModal(user)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button>
                                            <button onClick={() => openDeleteConfirm(user.username)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                            <h3 className="text-white font-bold text-lg">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            {formError && <p className="text-rose-400 bg-rose-900/20 p-3 rounded-md text-sm border border-rose-500/30">{formError}</p>}
                             <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Full Name</label>
                                <input name="name" value={formData.name} onChange={handleFormChange} required type="text" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Corporate ID</label>
                                    <input name="username" value={formData.username} onChange={handleFormChange} required type="text" disabled={!!editingUser} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none disabled:opacity-50" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Role</label>
                                    <select name="role" value={formData.role} onChange={handleFormChange} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none h-[42px]">
                                         {Object.values(UserRole).filter(r => r !== UserRole.ADMINISTRATOR).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                             <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
                                <input name="password" value={formData.password} onChange={handleFormChange} type="password" placeholder={editingUser ? 'Leave blank to keep unchanged' : 'Required'} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none" />
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded text-slate-400 hover:text-white font-bold transition-colors">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-colors flex items-center gap-2">
                                    <Save size={16} /> Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Delete Confirmation Modal */}
            {isConfirmOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-rose-500/30 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
                         <div className="p-6 text-center">
                             <div className="mx-auto w-12 h-12 rounded-full bg-rose-900/50 flex items-center justify-center border border-rose-500/30 mb-4">
                                <Trash2 className="text-rose-400" size={24}/>
                             </div>
                             <h3 className="text-lg font-bold text-white">Delete User Account</h3>
                             <p className="text-sm text-slate-400 mt-2">Are you sure you want to permanently delete the account for <span className="font-bold text-white">{userToDelete}</span>? This action cannot be undone.</p>
                         </div>
                         <div className="p-4 bg-slate-800/50 grid grid-cols-2 gap-3">
                            <button onClick={() => setIsConfirmOpen(false)} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700 hover:bg-slate-600">Cancel</button>
                            <button onClick={handleConfirmDelete} className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-colors">Confirm Delete</button>
                         </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

// ===================================
// MASTER DATA SETTINGS COMPONENT
// ===================================

// --- Prop Interfaces ---
interface PlantManagementTableProps { plants: Plant[]; onAdd: () => void; onEdit: (p: Plant) => void; onDelete: (p: Plant) => void; }
interface MachineManagementTableProps { machines: Machine[]; onAdd: () => void; onEdit: (m: Machine) => void; onDelete: (m: Machine) => void; }
interface LVMDPManagementTableProps { lvmdps: LVMDP[]; onAdd: () => void; onEdit: (l: LVMDP) => void; onDelete: (l: LVMDP) => void; }
interface UtilityConfigTableProps { plants: Plant[]; onAdd: () => void; onEdit: (p: Plant, u: { type: string, config: UtilityConfig }) => void; onDelete: (plantId: PlantCode, utilityType: string) => void; }
interface PlantModalProps { plant: Plant | null; onClose: () => void; onSave: () => void; }
interface MachineModalProps { machine: Machine | null; onClose: () => void; onSave: () => void; }
interface LVMDPModalProps { panel: LVMDP | null; onClose: () => void; onSave: () => void; }
interface UtilityConfigModalProps { data: { plant: Plant, utility: { type: string, config: UtilityConfig } } | null; onClose: () => void; onSave: () => void; }
interface ConfirmDeleteModalProps { itemName: string; onClose: () => void; onConfirm: () => void; }

const MasterDataSettings = ({ forceUpdate }: { forceUpdate: () => void }) => {
    const [activeTab, setActiveTab] = useState('plants');
    
    // Data states
    const [plants, setPlants] = useState<Plant[]>([]);
    const [machines, setMachines] = useState<Machine[]>([]);
    const [lvmdps, setLvmdps] = useState<LVMDP[]>([]);
    
    // Modal states
    const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
    const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
    const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);
    const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
    const [isLVMDPModalOpen, setIsLVMDPModalOpen] = useState(false);
    const [editingLVMDP, setEditingLVMDP] = useState<LVMDP | null>(null);
    const [isUtilityModalOpen, setIsUtilityModalOpen] = useState(false);
    const [editingUtility, setEditingUtility] = useState<{ plant: Plant, utility: { type: string, config: UtilityConfig } } | null>(null);
    
    // Confirmation state
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, name: string, type: 'machine' | 'lvmdp' | 'plant' | 'utility', plantId?: PlantCode, utilityType?: string } | null>(null);

    useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        setPlants(plantService.getAllPlants());
        setMachines(plantService.getAllMachines());
        setLvmdps(lvmdpService.getAllLVMDPs());
    };
    
    const handleConfirmDelete = () => {
        if (!itemToDelete) return;
        if (itemToDelete.type === 'machine') {
            plantService.deleteMachine(itemToDelete.id);
        } else if (itemToDelete.type === 'lvmdp') {
            lvmdpService.deleteLVMDP(itemToDelete.id);
        } else if (itemToDelete.type === 'plant') {
            plantService.deletePlant(itemToDelete.id as PlantCode);
        } else if (itemToDelete.type === 'utility' && itemToDelete.plantId && itemToDelete.utilityType) {
            utilityService.deleteUtilityConfig(itemToDelete.plantId, itemToDelete.utilityType);
        }
        
        refreshData();
        setIsConfirmOpen(false);
        setItemToDelete(null);
        forceUpdate();
    };

    const handleSave = () => {
        refreshData();
        forceUpdate();
    }

    const TabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex justify-center items-center gap-2.5 px-3 py-3 rounded-lg font-bold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                activeTab === id 
                ? 'bg-slate-700/50 text-white shadow-inner' 
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
        >
            <Icon size={16} /> {label}
        </button>
    );

    return (
        <Card className="bg-slate-900/30">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex gap-2 mb-6 shadow-md">
                <TabButton id="plants" label="Plants" icon={Factory} />
                <TabButton id="machines" label="Machines" icon={Monitor} />
                <TabButton id="lvmdps" label="LVMDP Panels" icon={Zap} />
                <TabButton id="utilities" label="Utilities" icon={Wind} />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'plants' && (
                    <PlantManagementTable 
                        plants={plants}
                        onAdd={() => { setEditingPlant(null); setIsPlantModalOpen(true); }}
                        onEdit={(plant) => { setEditingPlant(plant); setIsPlantModalOpen(true); }}
                        onDelete={(plant) => { setItemToDelete({ id: plant.id, name: plant.name, type: 'plant' }); setIsConfirmOpen(true); }}
                    />
                )}
                {activeTab === 'machines' && (
                    <MachineManagementTable 
                        machines={machines}
                        onAdd={() => { setEditingMachine(null); setIsMachineModalOpen(true); }}
                        onEdit={(machine) => { setEditingMachine(machine); setIsMachineModalOpen(true); }}
                        onDelete={(machine) => { setItemToDelete({ id: machine.id, name: machine.name, type: 'machine' }); setIsConfirmOpen(true); }}
                    />
                )}
                {activeTab === 'lvmdps' && (
                    <LVMDPManagementTable
                        lvmdps={lvmdps}
                        onAdd={() => { setEditingLVMDP(null); setIsLVMDPModalOpen(true); }}
                        onEdit={(panel) => { setEditingLVMDP(panel); setIsLVMDPModalOpen(true); }}
                        onDelete={(panel) => { setItemToDelete({ id: panel.id, name: panel.name, type: 'lvmdp' }); setIsConfirmOpen(true); }}
                    />
                )}
                {activeTab === 'utilities' && (
                    <UtilityConfigTable
                        plants={plants}
                        onAdd={() => { setEditingUtility(null); setIsUtilityModalOpen(true); }}
                        onEdit={(plant, utility) => { setEditingUtility({ plant, utility }); setIsUtilityModalOpen(true); }}
                        onDelete={(plantId, utilityType) => { setItemToDelete({ id: `${plantId}-${utilityType}`, name: `${utilityType} @ ${plantId}`, type: 'utility', plantId, utilityType }); setIsConfirmOpen(true); }}
                    />
                )}
            </div>
            
            {isPlantModalOpen && (
                <PlantModal
                    plant={editingPlant}
                    onClose={() => setIsPlantModalOpen(false)}
                    onSave={() => { handleSave(); setIsPlantModalOpen(false); }}
                />
            )}
            {isMachineModalOpen && (
                <MachineModal
                    machine={editingMachine}
                    onClose={() => setIsMachineModalOpen(false)}
                    onSave={() => { handleSave(); setIsMachineModalOpen(false); }}
                />
            )}
            {isLVMDPModalOpen && (
                <LVMDPModal
                    panel={editingLVMDP}
                    onClose={() => setIsLVMDPModalOpen(false)}
                    onSave={() => { handleSave(); setIsLVMDPModalOpen(false); }}
                />
            )}
            {isUtilityModalOpen && (
                 <UtilityConfigModal
                    data={editingUtility}
                    onClose={() => setIsUtilityModalOpen(false)}
                    onSave={() => { handleSave(); setIsUtilityModalOpen(false); }}
                />
            )}
            {isConfirmOpen && itemToDelete && (
                 <ConfirmDeleteModal
                    itemName={itemToDelete.name}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleConfirmDelete}
                 />
            )}
        </div>
    );
};

// --- Management Table Components ---

const PlantManagementTable: React.FC<PlantManagementTableProps> = ({ plants, onAdd, onEdit, onDelete }) => (
    <Card className="bg-slate-800/50">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
            <div>
                <h3 className="text-lg font-bold text-white">Plant Configuration</h3>
                <p className="text-sm text-slate-400 mt-1">Add, edit, or remove production facilities.</p>
            </div>
            <button onClick={onAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md self-start sm:self-center"><Plus size={16} /> Add Plant</button>
        </div>
        <div className="overflow-x-auto">
             <table className="w-full text-left text-slate-300">
                <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-400">
                    <tr>
                        <th className="p-4">Plant Name</th>
                        <th className="p-4 text-center">Location</th>
                        <th className="p-4 text-center">ID</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-sm">
                    {plants.map((plant) => (
                        <tr key={plant.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 font-bold text-white">{plant.name}</td>
                            <td className="p-4 text-slate-400 text-center">{plant.location}</td>
                            <td className="p-4 font-mono text-center">{plant.id}</td>
                            <td className="p-4">
                                <div className="flex justify-center items-center gap-2">
                                    <button onClick={() => onEdit(plant)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button>
                                    <button onClick={() => onDelete(plant)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const MachineManagementTable: React.FC<MachineManagementTableProps> = ({ machines, onAdd, onEdit, onDelete }) => (
    <Card className="bg-slate-800/50">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
            <div>
                <h3 className="text-lg font-bold text-white">Machine Configuration</h3>
                <p className="text-sm text-slate-400 mt-1">Add, edit, or remove production machines across all plants.</p>
            </div>
            <button onClick={onAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md self-start sm:self-center"><Plus size={16} /> Add Machine</button>
        </div>
        <div className="overflow-x-auto">
             <table className="w-full text-left text-slate-300">
                <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-400">
                    <tr><th className="p-4">Name</th><th className="p-4 text-center">Plant</th><th className="p-4 text-center">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-sm">
                    {machines.map((machine) => (
                        <tr key={machine.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 font-bold text-white">{machine.name}</td>
                            <td className="p-4 text-slate-400 text-center">{machine.plantId}</td>
                            <td className="p-4">
                                <div className="flex justify-center items-center gap-2">
                                    <button onClick={() => onEdit(machine)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button>
                                    <button onClick={() => onDelete(machine)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const LVMDPManagementTable: React.FC<LVMDPManagementTableProps> = ({ lvmdps, onAdd, onEdit, onDelete }) => (
     <Card className="bg-slate-800/50">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
            <div>
                <h3 className="text-lg font-bold text-white">LVMDP Panel Configuration</h3>
                <p className="text-sm text-slate-400 mt-1">Manage Low Voltage Main Distribution Panels for power monitoring.</p>
            </div>
            <button onClick={onAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md self-start sm:self-center"><Plus size={16} /> Add Panel</button>
        </div>
        <div className="overflow-x-auto">
             <table className="w-full text-left text-slate-300">
                <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-400">
                    <tr><th className="p-4">Name</th><th className="p-4 text-center">Plant</th><th className="p-4 text-center">Code</th><th className="p-4 text-center">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-sm">
                    {lvmdps.map((panel) => (
                        <tr key={panel.id} className="hover:bg-slate-800/50 transition-colors">
                            <td className="p-4 font-bold text-white">{panel.name}</td>
                            <td className="p-4 text-slate-400 text-center">{panel.plantId}</td>
                            <td className="p-4 font-mono text-center">{panel.code}</td>
                            <td className="p-4">
                                <div className="flex justify-center items-center gap-2">
                                    <button onClick={() => onEdit(panel)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button>
                                    <button onClick={() => onDelete(panel)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);

const UtilityConfigTable: React.FC<UtilityConfigTableProps> = ({ plants, onAdd, onEdit, onDelete }) => (
    <Card className="bg-slate-800/50">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-5">
            <div>
                <h3 className="text-lg font-bold text-white">Utility Baseline Configuration</h3>
                <p className="text-sm text-slate-400 mt-1">Set baseline daily consumption values for dashboard calculations.</p>
            </div>
             <button onClick={onAdd} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md self-start sm:self-center"><Plus size={16} /> Add Utility</button>
        </div>
        <div className="overflow-x-auto">
             <table className="w-full text-left text-slate-300">
                <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-400">
                    <tr><th className="p-4">Plant</th><th className="p-4">Utility</th><th className="p-4 text-center">Base Consumption (/day)</th><th className="p-4 text-center">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-sm">
                    {plants.flatMap(plant => 
                        utilityService.getUtilityConfigsForPlant(plant.id).map(utility => (
                            <tr key={`${plant.id}-${utility.type}`} className="hover:bg-slate-800/50 transition-colors">
                                <td className="p-4 font-bold text-white">{plant.name}</td>
                                <td className="p-4 capitalize text-slate-300">{utility.type}</td>
                                <td className="p-4 font-mono text-center">{utility.config.baseConsumption.toLocaleString()}</td>
                                <td className="p-4">
                                    <div className="flex justify-center items-center gap-2">
                                        <button onClick={() => onEdit(plant, utility)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button>
                                        <button onClick={() => onDelete(plant.id, utility.type)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </Card>
);

// --- Modal Components ---
const ModalWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            {children}
        </div>
    </div>
);

const ModalHeader: React.FC<{ title: string; icon: React.ElementType; onClose: () => void; }> = ({ title, icon: Icon, onClose }) => (
    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Icon size={20} className="text-blue-500" />
            {title}
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"><X size={20} /></button>
    </div>
);

const PlantModal: React.FC<PlantModalProps> = ({ plant, onClose, onSave }) => {
    const [formData, setFormData] = useState({ id: '' as PlantCode, name: '', location: '' });
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (plant) {
            setFormData({ id: plant.id, name: plant.name, location: plant.location });
        } else {
            setFormData({ id: '' as PlantCode, name: '', location: '' });
        }
        setError('');
    }, [plant]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let result;
        if (plant) {
            result = plantService.updatePlant(plant.id, { name: formData.name, location: formData.location });
        } else {
            if (!formData.id) {
                setError("Plant ID is required.");
                return;
            }
            result = plantService.addPlant(formData);
        }
        
        if (result.success) {
            onSave();
        } else {
            setError(result.message || 'An unknown error occurred.');
        }
    };

    return (
        <ModalWrapper>
            <ModalHeader title={plant ? "Edit Plant Details" : "Add New Plant"} icon={Factory} onClose={onClose} />
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && <p className="text-rose-400 bg-rose-900/20 p-3 rounded-md text-sm border border-rose-500/30">{error}</p>}
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Plant ID (e.g., CIKARANG)</label>
                    <input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value.toUpperCase() as PlantCode})} required disabled={!!plant} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:opacity-50" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Plant Name</label>
                    <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Location</label>
                    <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700/50 hover:bg-slate-700">Cancel</button>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"><Save size={16} /> Save Changes</button>
                </div>
            </form>
        </ModalWrapper>
    );
};

const MachineModal: React.FC<MachineModalProps> = ({ machine, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', plantId: '' as PlantCode });
    const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);

    useEffect(() => {
        const allPlants = plantService.getAllPlants();
        setAvailablePlants(allPlants);
        const defaultPlantId = allPlants.length > 0 ? allPlants[0].id : '' as PlantCode;
        setFormData(machine ? { name: machine.name, plantId: machine.plantId } : { name: '', plantId: defaultPlantId });
    }, [machine]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (machine) plantService.updateMachine(machine.id, { name: formData.name });
        else plantService.addMachine(formData);
        onSave();
    };

    return (
        <ModalWrapper>
            <ModalHeader title={machine ? 'Edit Machine' : 'Add New Machine'} icon={Monitor} onClose={onClose} />
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Machine Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" /></div>
                <div><label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Plant</label><select value={formData.plantId} onChange={e => setFormData({...formData, plantId: e.target.value as PlantCode})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white h-[46px]">{availablePlants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                <div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700/50 hover:bg-slate-700">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"><Save size={16} /> Save Changes</button></div>
            </form>
        </ModalWrapper>
    );
};

const LVMDPModal: React.FC<LVMDPModalProps> = ({ panel, onClose, onSave }) => {
    const [formData, setFormData] = useState({ name: '', plantId: '' as PlantCode });
    const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);
    
    useEffect(() => {
        const allPlants = plantService.getAllPlants();
        setAvailablePlants(allPlants);
        const defaultPlantId = allPlants.length > 0 ? allPlants[0].id : '' as PlantCode;
        setFormData(panel ? { name: panel.name, plantId: panel.plantId } : { name: '', plantId: defaultPlantId });
    }, [panel]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (panel) lvmdpService.updateLVMDP(panel.id, { name: formData.name });
        else lvmdpService.addLVMDP(formData);
        onSave();
    };

    return (
        <ModalWrapper>
            <ModalHeader title={panel ? 'Edit LVMDP Panel' : 'Add New Panel'} icon={Zap} onClose={onClose} />
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div><label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Panel Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" /></div>
                <div><label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Plant</label><select value={formData.plantId} onChange={e => setFormData({...formData, plantId: e.target.value as PlantCode})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white h-[46px]">{availablePlants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                <div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700/50 hover:bg-slate-700">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"><Save size={16} /> Save Changes</button></div>
            </form>
        </ModalWrapper>
    );
};

const UtilityConfigModal: React.FC<UtilityConfigModalProps> = ({ data, onClose, onSave }) => {
    const [formData, setFormData] = useState({ plantId: '' as PlantCode, type: '', baseConsumption: 0 });
    const [error, setError] = useState('');
    const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);
    
    const isEditMode = !!data;

    useEffect(() => {
        const allPlants = plantService.getAllPlants();
        setAvailablePlants(allPlants);
        const defaultPlantId = allPlants.length > 0 ? allPlants[0].id : '' as PlantCode;

        if (isEditMode) {
            setFormData({
                plantId: data.plant.id,
                type: data.utility.type,
                baseConsumption: data.utility.config.baseConsumption
            });
        } else {
            setFormData({ plantId: defaultPlantId, type: '', baseConsumption: 0 });
        }
        setError('');
    }, [data]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let result;

        if (isEditMode) {
            result = utilityService.updateUtilityConfig(formData.plantId, formData.type, { baseConsumption: formData.baseConsumption });
        } else {
             if (!formData.plantId || !formData.type) {
                setError("Plant and utility type are required.");
                return;
            }
            result = utilityService.addUtilityConfig(formData.plantId, { type: formData.type, baseConsumption: formData.baseConsumption });
        }
        
        if (result.success) {
            onSave();
        } else {
            setError(result.message || 'An unknown error occurred.');
        }
    };

    return (
        <ModalWrapper>
            <ModalHeader title={isEditMode ? `Edit ${formData.type} - ${formData.plantId}` : "Add New Utility Config"} icon={Wind} onClose={onClose} />
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                 {error && <p className="text-rose-400 bg-rose-900/20 p-3 rounded-md text-sm border border-rose-500/30">{error}</p>}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Plant</label>
                        <select value={formData.plantId} onChange={e => setFormData({...formData, plantId: e.target.value as PlantCode})} disabled={isEditMode} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white h-[46px] disabled:opacity-50">
                            {availablePlants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Utility Type</label>
                        <input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} disabled={isEditMode} required placeholder="e.g., co2" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:opacity-50" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Base Consumption / Day</label>
                    <input type="number" value={formData.baseConsumption} onChange={e => setFormData({...formData, baseConsumption: Number(e.target.value)})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" />
                </div>
                <div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700/50 hover:bg-slate-700">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"><Save size={16} /> Save Changes</button></div>
            </form>
        </ModalWrapper>
    );
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ itemName, onClose, onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <div className="bg-slate-900 border border-rose-500/30 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-rose-900/50 flex items-center justify-center border-4 border-slate-800 mb-4 ring-1 ring-rose-500/30">
                    <Trash2 className="text-rose-400" size={28}/>
                </div>
                <h3 className="text-lg font-bold text-white">Confirm Deletion</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">Are you sure you want to permanently delete <br/><strong className="font-bold text-white bg-slate-800/50 px-1.5 py-0.5 rounded">{itemName}</strong>? This action cannot be undone.</p>
            </div>
            <div className="p-4 bg-slate-950/50 grid grid-cols-2 gap-3 border-t border-slate-800">
               <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700 hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">Cancel</button>
               <button onClick={onConfirm} className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400">Confirm Delete</button>
            </div>
       </div>
    </div>
);

export default SettingsView;