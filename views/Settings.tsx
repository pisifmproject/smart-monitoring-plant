

import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, VisibilityCategory, VisibilityGroup, DataItem, User } from '../types';
import { Card } from '../components/SharedComponents';
import {
    DATA_ITEM_REGISTRY,
    updateVisibilityRule,
    isDataItemVisible
} from '../services/visibilityStore';
import { plantService } from '../services/plantService'; 
import { getUsers, addUser, updateUser, deleteUser } from '../services/auth';

import {
    User as UserIcon, Shield, Bell, Database,
    Eye, ChevronDown, Check,
    LayoutDashboard, Factory, Monitor, Zap, LayoutGrid, Globe, Grid,
    Settings, Sliders, ListFilter, Plus, Edit, Trash2, X, Save
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
                    <NavButton id="database" label="Data Management" icon={Database} />
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
                        {!["visibility", "users"].includes(activeSection) && <Settings className="text-slate-500" />}
                        
                        {activeSection === "visibility" ? "Master Visibility Settings" : 
                         activeSection === "users" ? "User & Role Management" :
                         `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Configuration`}
                    </h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                        {activeSection === "visibility" ? "Configure system-wide visibility rules and dashboard layout preferences across all plant scopes." :
                         activeSection === "users" ? "Manage user accounts, assign roles, and set access permissions for the application." :
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
                            {PLANTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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

export default SettingsView;
