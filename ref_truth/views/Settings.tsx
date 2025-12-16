
import React, { useState, useEffect, useMemo, memo } from 'react';
import { UserRole, VisibilityCategory, VisibilityGroup, DataItem, User, PlantCode, MachineType, Machine, LVMDP, Plant, UtilityConfig, MachineStatus, PackingLineConfig } from '../types';
import { Card } from '../components/SharedComponents';
import {
    DATA_ITEM_REGISTRY,
    updateVisibilityRule,
    isDataItemVisible
} from '../services/visibilityStore';
import { plantService } from '../services/plantService'; 
import { lvmdpService } from '../services/lvmdpService';
import { utilityService } from '../services/utilityService';
import { packingConfigService } from '../services/packingConfigService';
import { getUsers, addUser, updateUser, deleteUser } from '../services/auth';

import {
    User as UserIcon, Shield, Bell, Database,
    Eye, ChevronDown, Check,
    LayoutDashboard, Factory, Monitor, Zap, LayoutGrid, Globe, Grid,
    Settings, Sliders, ListFilter, Plus, Edit, Trash2, X, Save, Wind, Package, Search
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
    { id: 'GLOBAL_DASHBOARD', label: 'Global Dashboard', icon: Globe, types: [VisibilityCategory.GLOBAL_DASHBOARD] },
    { id: 'PLANT_DASHBOARD', label: 'Plant Dashboard', icon: Factory, types: [VisibilityCategory.PLANT_DASHBOARD] },
    { id: 'MACHINE_DETAIL', label: 'Machine Detail', icon: Monitor, types: [VisibilityCategory.MACHINE_DETAIL] },
    { id: 'UTILITY', label: 'Utility & Energy', icon: Zap, types: [ VisibilityCategory.UTILITY, VisibilityCategory.MAIN_PANEL_1, VisibilityCategory.MAIN_PANEL_2, VisibilityCategory.MAIN_PANEL_3, VisibilityCategory.MAIN_PANEL_4 ] },
];

const SettingsView: React.FC<SettingsProps> = ({ userRole }) => {
    const [activeSection, setActiveSection] = useState("visibility");

    if (userRole !== UserRole.ADMINISTRATOR) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in zoom-in">
                <div className="bg-rose-500/10 p-6 rounded-full border border-rose-500/20 shadow-lg shadow-rose-900/20">
                    <Shield size={48} className="text-rose-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">Access Restricted</h2>
                    <p className="text-slate-300 max-w-md text-sm leading-relaxed">This configuration console is restricted to Administrator accounts only.</p>
                </div>
            </div>
        );
    }
    
    const renderContent = () => {
        switch (activeSection) {
            case 'visibility': return <VisibilitySettings />;
            case 'users': return <UsersAndRolesSettings />;
            case 'database': return <MasterDataSettings />;
            default: return (
                 <Card title="Module Status">
                    <div className="py-16 text-center">
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800"><Database size={32} className="text-slate-600" /></div>
                        <h3 className="text-white font-bold text-xl mb-2">Module Under Development</h3>
                        <p className="text-slate-300 max-w-md mx-auto text-sm leading-relaxed">
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
                : "text-slate-300 hover:bg-slate-800 hover:text-slate-200"
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
                    <NavButton id="database" label="Master Data" icon={Database} />
                </div>
                <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900/50">
                    <div className="flex items-center gap-2 text-xs text-slate-500"><Settings size={12} /><span>Build v25.12</span></div>
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
                    <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
                        {activeSection === "visibility" ? "Configure system-wide visibility rules and dashboard layout preferences across all plant scopes." :
                         activeSection === "users" ? "Manage user accounts, assign roles, and set plant-level access permissions." :
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

const VisibilitySettings = () => {
    const [targetRole, setTargetRole] = useState<UserRole>(UserRole.SUPERVISOR);
    const [selectedPlant, setSelectedPlant] = useState("ALL_PLANTS");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("GLOBAL_DASHBOARD");
    const [searchQuery, setSearchQuery] = useState('');
    const [tick, setTick] = useState(0);

    const handleToggleVisibility = (key: string, category: VisibilityCategory, machineId?: string) => {
        const context = { plantId: selectedPlant, machineId };
        updateVisibilityRule(targetRole, { category, plantId: selectedPlant, machineId }, key, !isDataItemVisible(targetRole, key, context));
        setTick(t => t + 1);
    };
    
    const machineVisibilityItems = useMemo(() => {
        if (selectedPlant === "ALL_PLANTS") return [];
        const lowercasedQuery = searchQuery.toLowerCase();
        return DATA_ITEM_REGISTRY.filter(item => 
            item.group === VisibilityGroup.MACHINES &&
            item.key.includes(selectedPlant) &&
            (searchQuery === '' || item.label.toLowerCase().includes(lowercasedQuery) || item.key.toLowerCase().includes(lowercasedQuery))
        );
    }, [selectedPlant, searchQuery]);

    const filteredItems = useMemo(() => {
        const activeFilter = CATEGORY_FILTERS.find(f => f.id === selectedCategoryFilter);
        const allowedCategories = activeFilter?.types || [];
        const lowercasedQuery = searchQuery.toLowerCase();

        return DATA_ITEM_REGISTRY.filter(item => {
            if (!allowedCategories.includes(item.category)) return false;
            if (selectedPlant !== "ALL_PLANTS" && item.category === VisibilityCategory.UTILITY && item.key.startsWith('SHOW_LVMDP_CARD_') && !item.key.includes(selectedPlant)) return false;
            if (item.group === VisibilityGroup.MACHINES) return false;
            if (searchQuery && !(item.label.toLowerCase().includes(lowercasedQuery) || item.key.toLowerCase().includes(lowercasedQuery))) return false;
            return true;
        });
    }, [selectedPlant, selectedCategoryFilter, searchQuery]);

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
        // Complex rendering for Machine Detail when a specific plant is selected
        if (selectedCategoryFilter === 'MACHINE_DETAIL' && selectedPlant !== 'ALL_PLANTS') {
            const plant = plantService.getPlantById(selectedPlant);
            if (!plant) return <div className="text-slate-500 p-4">Plant not found.</div>;
            
            const allMachineDetailItems = DATA_ITEM_REGISTRY.filter(item => {
                 const lowercasedQuery = searchQuery.toLowerCase();
                 return item.category === VisibilityCategory.MACHINE_DETAIL && (searchQuery === '' || item.label.toLowerCase().includes(lowercasedQuery) || item.key.toLowerCase().includes(lowercasedQuery));
            });
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
                                <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">Controls machine cards on the Plant Dashboard page</span>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                <VisibilityItemGroup title="Visible Machines" items={machineVisibilityItems} onToggle={handleToggleVisibility} targetRole={targetRole} context={{plantId: selectedPlant}} />
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-800">
                            <div className="p-1.5 bg-slate-800 rounded text-slate-400"><Monitor size={18} /></div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Machine Detail Page Settings</h3>
                            <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-700">Controls components inside each Machine's detail view</span>
                        </div>
                        <div className="space-y-8">
                            {plant.machines.map(machine => (
                                <Card key={machine.id} title={machine.name} className="bg-slate-900/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                        {Object.entries(groupedDetailItems).map(([groupName, items]) => (
                                            <div key={groupName}>
                                                <h4 className="font-bold text-slate-300 text-xs uppercase tracking-widest mb-4 pb-2 border-b border-slate-800">{groupName}</h4>
                                                <div className="space-y-3">
                                                    {items.map(item => <VisibilityToggle key={item.key} item={item} onToggle={handleToggleVisibility} targetRole={targetRole} context={{plantId: plant.id, machineId: machine.id}} isChecked={isDataItemVisible(targetRole, item.key, { plantId: plant.id, machineId: machine.id })} />)}
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

        if (Object.keys(groupedItems).length === 0 && machineVisibilityItems.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
                    <div className="p-4 bg-slate-800 rounded-full mb-4"><Sliders size={24} className="text-slate-500" /></div>
                    <p className="text-slate-300 font-medium">No configuration items found for this selection.</p>
                    <p className="text-slate-500 text-sm mt-1">Try changing the plant or category filter, or clear your search.</p>
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
                                <div className="p-1.5 bg-slate-800 rounded text-slate-300"><CatIcon size={18} /></div>
                                <h3 className="text-lg font-bold text-white capitalize tracking-tight">{formatCatName.toLowerCase()}</h3>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {Object.entries(groups).map(([group, items]) => (
                                    <VisibilityItemGroup key={group} title={group} items={items} onToggle={handleToggleVisibility} targetRole={targetRole} context={{plantId: selectedPlant}} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
                    <FilterDropdown value={targetRole} onChange={e => setTargetRole(e.target.value as UserRole)} icon={UserIcon} options={ROLE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)} />
                    <FilterDropdown value={selectedPlant} onChange={e => setSelectedPlant(e.target.value)} icon={Factory} options={PLANT_SCOPES_VISIBILITY.map(p => <option key={p.id} value={p.id}>{p.name}</option>)} />
                    <FilterDropdown value={selectedCategoryFilter} onChange={e => setSelectedCategoryFilter(e.target.value)} icon={ListFilter} options={CATEGORY_FILTERS.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)} />
                    <SearchInput value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
            </div>
            <div className="animate-in slide-in-from-bottom-2 duration-500 min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};

const FilterDropdown = memo(({ value, onChange, icon: Icon, options }: any) => (
    <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icon size={16} className="text-slate-400" /></div>
        <select value={value} onChange={onChange} className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded-md text-sm text-white font-medium outline-none appearance-none transition-all cursor-pointer">
            {options}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><ChevronDown size={14} className="text-slate-400" /></div>
    </div>
));

const SearchInput = memo(({ value, onChange }: any) => (
    <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-slate-400" /></div>
        <input type="search" placeholder="Search settings..." value={value} onChange={onChange} className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded-md text-sm text-white font-medium outline-none transition-all" />
    </div>
));

const VisibilityItemGroup = memo(({ title, items, onToggle, targetRole, context }: any) => (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full hover:border-slate-700 transition-colors shadow-sm">
        <div className="px-5 py-3 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
            <span className="font-bold text-slate-300 text-xs uppercase tracking-wider flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>{title}</span>
            <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">{items.length}</span>
        </div>
        <div className="flex-1 divide-y divide-slate-800/50 bg-slate-900/30">
            {items.map((item: DataItem) => <VisibilityToggle key={item.key} item={item} onToggle={onToggle} targetRole={targetRole} context={context} isChecked={isDataItemVisible(targetRole, item.key, context)} />)}
        </div>
    </div>
));

const VisibilityToggle = memo(({ item, onToggle, targetRole, context, isChecked }: any) => (
    <div onClick={() => onToggle(item.key, item.category, context.machineId)} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-800 cursor-pointer group transition-colors">
        <div className="pr-4 min-w-0">
            <p className={`text-sm font-medium transition-colors truncate ${isChecked ? 'text-slate-200' : 'text-slate-400'}`}>{item.label}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">{item.key}</p>
        </div>
        <div className={`shrink-0 w-10 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${isChecked ? 'bg-blue-600' : 'bg-slate-700 border border-slate-600'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${isChecked ? 'translate-x-5' : 'translate-x-0'}`}></div>
        </div>
    </div>
));

// ===================================
// USERS AND ROLES SETTINGS COMPONENT
// ===================================
const UsersAndRolesSettings = memo(() => {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setUsers(getUsers());
    }, []);

    const refreshUsers = () => setUsers(getUsers());

    const openAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
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
        refreshUsers();
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <h3 className="text-lg font-bold text-white">Current Users</h3>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                            <input 
                                type="search" 
                                placeholder="Search by name or ID..." 
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)} 
                                className="w-full sm:w-48 bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" 
                            />
                        </div>
                        <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md">
                            <Plus size={16} /> Add New User
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                     <table className="w-full text-left text-slate-300 min-w-[700px]">
                        <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-300">
                            <tr><th className="p-3">Full Name</th><th className="p-3">Corporate ID</th><th className="p-3">Role</th><th className="p-3">Plant Access</th><th className="p-3 text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {filteredUsers.map(user => (
                                <tr key={user.username} className="hover:bg-slate-800/50">
                                    <td className="p-3 font-bold text-white">{user.name}</td><td className="p-3 font-mono">{user.username}</td>
                                    <td className="p-3"><span className="bg-slate-700 px-2 py-1 rounded-md text-xs font-bold text-blue-300">{user.role}</span></td>
                                    <td className="p-3">
                                        {user.role === UserRole.ADMINISTRATOR ? (
                                             <span className="text-emerald-400 font-bold text-xs uppercase">All Systems</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {(user.plantAccess || []).length > 0 ? (
                                                    user.plantAccess?.map(p => (
                                                        <span key={p} className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] text-slate-300">{p}</span>
                                                    ))
                                                ) : (
                                                    <span className="text-rose-500 text-xs italic">No Access</span>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-3 text-right"><div className="flex justify-end items-center gap-2"><button onClick={() => openEditModal(user)} className="p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button><button onClick={() => openDeleteConfirm(user.username)} className="p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isModalOpen && <UserModal user={editingUser} onClose={() => setIsModalOpen(false)} onSave={() => { setIsModalOpen(false); refreshUsers(); }} />}
            {isConfirmOpen && <ConfirmDeleteModal itemName={userToDelete || ''} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} />}
        </div>
    );
});

// ===================================
// MASTER DATA SETTINGS COMPONENT
// ===================================

// --- Prop Interfaces ---
interface ManagementTableProps<T> { items: T[]; onAdd: () => void; onEdit: (item: T) => void; onDelete: (item: T) => void; searchQuery: string; setSearchQuery: (query: string) => void; }
interface PlantModalProps { plant: Plant | null; onClose: () => void; onSave: () => void; }
interface MachineModalProps { machine: Machine | null; onClose: () => void; onSave: () => void; }
interface LVMDPModalProps { panel: LVMDP | null; onClose: () => void; onSave: () => void; }
interface UtilityConfigModalProps { data: { plant: Plant, utility: { type: string, config: UtilityConfig } } | null; onClose: () => void; onSave: () => void; }
interface PackingConfigModalProps { line: PackingLineConfig | null; onClose: () => void; onSave: () => void; plantId: PlantCode; }
interface ConfirmDeleteModalProps { itemName: string; onClose: () => void; onConfirm: () => void; }

const MasterDataSettings = memo(() => {
    const [activeTab, setActiveTab] = useState('plants');
    
    const [data, setData] = useState({ plants: [], machines: [], lvmdps: [], packingLines: [] });
    const [packingConfigPlant, setPackingConfigPlant] = useState<PlantCode>(PlantCode.CIKUPA);
    
    const [search, setSearch] = useState({ plants: '', machines: '', lvmdps: '', utilities: '', packing: '' });
    const [modal, setModal] = useState<any>({ open: null, item: null });

    const refreshData = () => {
        setData({
            plants: plantService.getAllPlants(),
            machines: plantService.getAllMachines(),
            lvmdps: lvmdpService.getAllLVMDPs(),
            packingLines: packingConfigService.getPackingLines(packingConfigPlant),
        });
    };

    useEffect(refreshData, [packingConfigPlant]);
    
    const handleConfirmDelete = () => {
        if (!modal.item) return;
        const { type, id, name, plantId, utilityType } = modal.item;
        if (type === 'machine') plantService.deleteMachine(id);
        else if (type === 'lvmdp') lvmdpService.deleteLVMDP(id);
        else if (type === 'plant') plantService.deletePlant(id as PlantCode);
        else if (type === 'utility') utilityService.deleteUtilityConfig(plantId, utilityType);
        else if (type === 'packing') packingConfigService.deletePackingLine(packingConfigPlant, id);
        setModal({ open: null, item: null });
        refreshData();
    };

    const handleSave = () => {
        setModal({ open: null, item: null });
        refreshData();
    };

    const TabButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
        <button onClick={() => setActiveTab(id)} className={`flex-1 flex justify-center items-center gap-2.5 px-3 py-3 rounded-lg font-bold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${activeTab === id ? 'bg-slate-700/50 text-white shadow-inner' : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-200'}`}>
            <Icon size={16} /> {label}
        </button>
    );

    const filteredPlants = data.plants.filter(p => p.name.toLowerCase().includes(search.plants.toLowerCase()) || p.location.toLowerCase().includes(search.plants.toLowerCase()));
    const filteredMachines = data.machines.filter(m => m.name.toLowerCase().includes(search.machines.toLowerCase()) || m.plantId.toLowerCase().includes(search.machines.toLowerCase()));
    const filteredLvmdps = data.lvmdps.filter(l => l.name.toLowerCase().includes(search.lvmdps.toLowerCase()) || l.plantId.toLowerCase().includes(search.lvmdps.toLowerCase()));
    const filteredPackingLines = data.packingLines.filter(p => p.lineName.toLowerCase().includes(search.packing.toLowerCase()));

    return (
        <Card className="bg-slate-900/30">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-1.5 flex flex-col sm:flex-row gap-2 mb-6 shadow-md overflow-x-auto">
                <TabButton id="plants" label="Plants" icon={Factory} />
                <TabButton id="machines" label="Machines" icon={Monitor} />
                <TabButton id="lvmdps" label="LVMDP Panels" icon={Zap} />
                <TabButton id="utilities" label="Utilities" icon={Wind} />
                <TabButton id="packing" label="Packing Config" icon={Package} />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'plants' && <PlantManagementTable items={filteredPlants} onAdd={() => setModal({ open: 'plant', item: null })} onEdit={(item) => setModal({ open: 'plant', item })} onDelete={(item) => setModal({ open: 'confirm', item: { id: item.id, name: item.name, type: 'plant' }})} searchQuery={search.plants} setSearchQuery={q => setSearch({...search, plants: q})} />}
                {activeTab === 'machines' && <MachineManagementTable items={filteredMachines} onAdd={() => setModal({ open: 'machine', item: null })} onEdit={(item) => setModal({ open: 'machine', item })} onDelete={(item) => setModal({ open: 'confirm', item: { id: item.id, name: item.name, type: 'machine' }})} searchQuery={search.machines} setSearchQuery={q => setSearch({...search, machines: q})} />}
                {activeTab === 'lvmdps' && <LVMDPManagementTable items={filteredLvmdps} onAdd={() => setModal({ open: 'lvmdp', item: null })} onEdit={(item) => setModal({ open: 'lvmdp', item })} onDelete={(item) => setModal({ open: 'confirm', item: { id: item.id, name: item.name, type: 'lvmdp' }})} searchQuery={search.lvmdps} setSearchQuery={q => setSearch({...search, lvmdps: q})} />}
                {activeTab === 'utilities' && <UtilityConfigTable plants={data.plants} onAdd={() => setModal({ open: 'utility', item: null })} onEdit={(plant, utility) => setModal({ open: 'utility', item: { plant, utility }})} onDelete={(plantId, utilityType) => setModal({ open: 'confirm', item: { id: `${plantId}-${utilityType}`, name: `${utilityType} @ ${plantId}`, type: 'utility', plantId, utilityType }})} searchQuery={search.utilities} setSearchQuery={q => setSearch({...search, utilities: q})} />}
                {activeTab === 'packing' && (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                            <label htmlFor="packing-plant-select" className="text-sm font-bold text-slate-300 flex items-center gap-2 shrink-0"><Factory size={16} /> Configure Packing For:</label>
                            <select id="packing-plant-select" value={packingConfigPlant} onChange={(e) => { setPackingConfigPlant(e.target.value as PlantCode); setSearch({...search, packing: ''}); }} className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-sm font-medium text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
                                <option value={PlantCode.CIKUPA}>Plant Cikupa</option><option value={PlantCode.CIKOKOL}>Plant Cikokol</option><option value={PlantCode.SEMARANG}>Plant Semarang</option>
                            </select>
                        </div>
                        <PackingConfigManagementTable items={filteredPackingLines} plantId={packingConfigPlant} onAdd={() => setModal({ open: 'packing', item: null })} onEdit={(item) => setModal({ open: 'packing', item })} onDelete={(item) => setModal({ open: 'confirm', item: { id: item.lineName, name: `Packing Line: ${item.lineName}`, type: 'packing' }})} searchQuery={search.packing} setSearchQuery={q => setSearch({...search, packing: q})} />
                    </div>
                )}
            </div>
            
            {modal.open === 'plant' && <PlantModal plant={modal.item} onClose={() => setModal({ open: null, item: null })} onSave={handleSave} />}
            {modal.open === 'machine' && <MachineModal machine={modal.item} onClose={() => setModal({ open: null, item: null })} onSave={handleSave} />}
            {modal.open === 'lvmdp' && <LVMDPModal panel={modal.item} onClose={() => setModal({ open: null, item: null })} onSave={handleSave} />}
            {modal.open === 'utility' && <UtilityConfigModal data={modal.item} onClose={() => setModal({ open: null, item: null })} onSave={handleSave} />}
            {modal.open === 'packing' && <PackingConfigModal plantId={packingConfigPlant} line={modal.item} onClose={() => setModal({ open: null, item: null })} onSave={handleSave} />}
            {modal.open === 'confirm' && modal.item && <ConfirmDeleteModal itemName={modal.item.name} onClose={() => setModal({ open: null, item: null })} onConfirm={handleConfirmDelete} />}
        </Card>
    );
});

// --- Management Table Components ---
const ManagementTableHeader: React.FC<{ title: string; subtitle: string; onAdd: () => void; addLabel: string; searchQuery: string; setSearchQuery: (q: string) => void; }> = ({ title, subtitle, onAdd, addLabel, searchQuery, setSearchQuery }) => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-5">
        <div><h3 className="text-lg font-bold text-white">{title}</h3><p className="text-sm text-slate-300 mt-1">{subtitle}</p></div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" /><input type="search" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full sm:w-48 bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" /></div>
            <button onClick={onAdd} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md self-stretch sm:self-center"><Plus size={16} /> {addLabel}</button>
        </div>
    </div>
);

const PlantManagementTable: React.FC<ManagementTableProps<Plant>> = ({ items, onAdd, onEdit, onDelete, searchQuery, setSearchQuery }) => (
    <Card className="bg-slate-800/50">
        <ManagementTableHeader title="Plant Configuration" subtitle="Add, edit, or remove production facilities." onAdd={onAdd} addLabel="Add Plant" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="overflow-x-auto"><table className="w-full text-left text-slate-300 min-w-[600px]"><thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-300"><tr><th className="p-4">Plant Name</th><th className="p-4 text-center">Location</th><th className="p-4 text-center">ID</th><th className="p-4 text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-700/50 text-sm">{items.map((plant) => (<tr key={plant.id} className="hover:bg-slate-800/50 transition-colors"><td className="p-4 font-bold text-white">{plant.name}</td><td className="p-4 text-slate-300 text-center">{plant.location}</td><td className="p-4 font-mono text-center">{plant.id}</td><td className="p-4"><div className="flex justify-center items-center gap-2"><button onClick={() => onEdit(plant)} className="p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button><button onClick={() => onDelete(plant)} className="p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button></div></td></tr>))}</tbody></table></div>
    </Card>
);

const MachineManagementTable: React.FC<ManagementTableProps<Machine>> = ({ items, onAdd, onEdit, onDelete, searchQuery, setSearchQuery }) => (
    <Card className="bg-slate-800/50">
        <ManagementTableHeader title="Machine Configuration" subtitle="Manage production machines across all plants." onAdd={onAdd} addLabel="Add Machine" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="overflow-x-auto"><table className="w-full text-left text-slate-300 min-w-[600px]"><thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-300"><tr><th className="p-4">Name</th><th className="p-4 text-center">Plant</th><th className="p-4 text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-700/50 text-sm">{items.map((machine) => (<tr key={machine.id} className="hover:bg-slate-800/50 transition-colors"><td className="p-4 font-bold text-white">{machine.name}</td><td className="p-4 text-slate-300 text-center">{machine.plantId}</td><td className="p-4"><div className="flex justify-center items-center gap-2"><button onClick={() => onEdit(machine)} className="p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button><button onClick={() => onDelete(machine)} className="p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button></div></td></tr>))}</tbody></table></div>
    </Card>
);

const LVMDPManagementTable: React.FC<ManagementTableProps<LVMDP>> = ({ items, onAdd, onEdit, onDelete, searchQuery, setSearchQuery }) => (
     <Card className="bg-slate-800/50">
        <ManagementTableHeader title="LVMDP Panel Configuration" subtitle="Manage Low Voltage Main Distribution Panels." onAdd={onAdd} addLabel="Add Panel" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="overflow-x-auto"><table className="w-full text-left text-slate-300 min-w-[600px]"><thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-300"><tr><th className="p-4">Name</th><th className="p-4 text-center">Plant</th><th className="p-4 text-center">Code</th><th className="p-4 text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-700/50 text-sm">{items.map((panel) => (<tr key={panel.id} className="hover:bg-slate-800/50 transition-colors"><td className="p-4 font-bold text-white">{panel.name}</td><td className="p-4 text-slate-300 text-center">{panel.plantId}</td><td className="p-4 font-mono text-center">{panel.code}</td><td className="p-4"><div className="flex justify-center items-center gap-2"><button onClick={() => onEdit(panel)} className="p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button><button onClick={() => onDelete(panel)} className="p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button></div></td></tr>))}</tbody></table></div>
    </Card>
);

const UtilityConfigTable: React.FC<{ plants: Plant[]; onAdd: () => void; onEdit: (p: Plant, u: { type: string, config: UtilityConfig }) => void; onDelete: (plantId: PlantCode, utilityType: string) => void; searchQuery: string; setSearchQuery: (q: string) => void; }> = ({ plants, onAdd, onEdit, onDelete, searchQuery, setSearchQuery }) => {
    const allUtilities = useMemo(() => plants.flatMap(plant => utilityService.getUtilityConfigsForPlant(plant.id).map(utility => ({ plant, utility }))), [plants]);
    const filteredUtilities = useMemo(() => allUtilities.filter(({ plant, utility }) => plant.name.toLowerCase().includes(searchQuery.toLowerCase()) || utility.type.toLowerCase().includes(searchQuery.toLowerCase())), [allUtilities, searchQuery]);
    
    return (
        <Card className="bg-slate-800/50">
            <ManagementTableHeader title="Utility Baseline Configuration" subtitle="Set baseline daily consumption values." onAdd={onAdd} addLabel="Add Utility" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <div className="overflow-x-auto"><table className="w-full text-left text-slate-300 min-w-[600px]"><thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-300"><tr><th className="p-4">Plant</th><th className="p-4">Utility</th><th className="p-4 text-center">Base Consumption (/day)</th><th className="p-4 text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-700/50 text-sm">{filteredUtilities.map(({ plant, utility }) => (<tr key={`${plant.id}-${utility.type}`} className="hover:bg-slate-800/50 transition-colors"><td className="p-4 font-bold text-white">{plant.name}</td><td className="p-4 capitalize text-slate-300">{utility.type}</td><td className="p-4 font-mono text-center">{utility.config.baseConsumption.toLocaleString()}</td><td className="p-4"><div className="flex justify-center items-center gap-2"><button onClick={() => onEdit(plant, utility)} className="p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button><button onClick={() => onDelete(plant.id, utility.type)} className="p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button></div></td></tr>))}</tbody></table></div>
        </Card>
    );
};

const PackingConfigManagementTable: React.FC<ManagementTableProps<PackingLineConfig> & { plantId: PlantCode }> = ({ items, onAdd, onEdit, onDelete, searchQuery, setSearchQuery, plantId }) => (
    <Card className="bg-slate-800/50">
        <ManagementTableHeader title={`${plantId} Packing Line Configuration`} subtitle={`Manage multi-unit packing lines for the ${plantId} plant.`} onAdd={onAdd} addLabel="Add Line" searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="overflow-x-auto"><table className="w-full text-left text-slate-300 min-w-[600px]"><thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-300"><tr><th className="p-4">Line Name</th><th className="p-4 text-center">Bagmakers</th><th className="p-4 text-center">Weighers</th><th className="p-4 text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-700/50 text-sm">{items.map((line) => (<tr key={line.lineName} className="hover:bg-slate-800/50 transition-colors"><td className="p-4 font-bold text-white">{line.lineName}</td><td className="p-4 font-mono text-center">{line.bagmakers}</td><td className="p-4 font-mono text-center">{line.weighers}</td><td className="p-4"><div className="flex justify-center items-center gap-2"><button onClick={() => onEdit(line)} className="p-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md transition-colors"><Edit size={16}/></button><button onClick={() => onDelete(line)} className="p-2 text-slate-300 hover:text-rose-400 hover:bg-slate-700 rounded-md transition-colors"><Trash2 size={16}/></button></div></td></tr>))}</tbody></table></div>
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
        <h3 className="text-white font-bold text-lg flex items-center gap-2"><Icon size={20} className="text-blue-500" />{title}</h3>
        <button onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"><X size={20} /></button>
    </div>
);

const UserModal: React.FC<{ user: User | null; onClose: () => void; onSave: () => void; }> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({ username: '', name: '', role: UserRole.OPERATOR, password: '', plantAccess: [] as PlantCode[] });
    const [formError, setFormError] = useState('');
    const allPlants = plantService.getAllPlants();
    
    useEffect(() => {
        setFormData(user 
            ? { username: user.username, name: user.name, role: user.role, password: '', plantAccess: user.plantAccess || [] } 
            : { username: '', name: '', role: UserRole.OPERATOR, password: '', plantAccess: [] }
        );
        setFormError('');
    }, [user]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePlantAccess = (plantId: PlantCode) => {
        const current = formData.plantAccess;
        if (current.includes(plantId)) {
            setFormData({ ...formData, plantAccess: current.filter(id => id !== plantId) });
        } else {
            setFormData({ ...formData, plantAccess: [...current, plantId] });
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!formData.name || !formData.username) { setFormError('Username and Full Name are required.'); return; }
        if (!user && !formData.password) { setFormError('Password is required for new users.'); return; }
        
        const payload = { 
            name: formData.name, 
            role: formData.role, 
            plantAccess: formData.plantAccess,
            ...(formData.password && { pass: formData.password }) 
        };

        const result = user 
            ? updateUser(user.username, payload) 
            : addUser({ username: formData.username, name: formData.name, role: formData.role, plantAccess: formData.plantAccess }, formData.password);
        
        if (result.success) onSave(); else setFormError(result.message || 'An unknown error occurred.');
    };

    return (
        <ModalWrapper>
            <ModalHeader title={user ? 'Edit User' : 'Add New User'} icon={UserIcon} onClose={onClose} />
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {formError && <p className="text-rose-400 bg-rose-900/20 p-3 rounded-md text-sm border border-rose-500/30">{formError}</p>}
                <div><label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label><input name="name" value={formData.name} onChange={handleFormChange} required type="text" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold text-slate-300 uppercase mb-1">Corporate ID</label><input name="username" value={formData.username} onChange={handleFormChange} required type="text" disabled={!!user} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none disabled:opacity-50" /></div>
                    <div><label className="block text-xs font-bold text-slate-300 uppercase mb-1">Role</label><select name="role" value={formData.role} onChange={handleFormChange} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none h-[42px]">{Object.values(UserRole).filter(r => r !== UserRole.ADMINISTRATOR).map(role => (<option key={role} value={role}>{role}</option>))}</select></div>
                </div>
                
                {formData.role !== UserRole.ADMINISTRATOR && (
                    <div>
                        <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Plant Access Permissions</label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                            {allPlants.map(plant => (
                                <label key={plant.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-900 p-1.5 rounded transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={formData.plantAccess.includes(plant.id)}
                                        onChange={() => togglePlantAccess(plant.id)}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                                    />
                                    <span className="text-sm text-slate-300">{plant.name}</span>
                                </label>
                            ))}
                        </div>
                         <p className="text-[10px] text-slate-500 mt-1">Select which plant dashboards this user can access.</p>
                    </div>
                )}

                <div><label className="block text-xs font-bold text-slate-300 uppercase mb-1">Password</label><input name="password" value={formData.password} onChange={handleFormChange} type="password" placeholder={user ? 'Leave blank to keep unchanged' : 'Required'} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none" /></div>
                <div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 rounded text-slate-300 hover:text-white font-bold transition-colors">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"><Save size={16} /> Save Changes</button></div>
            </form>
        </ModalWrapper>
    );
};

const PlantModal: React.FC<PlantModalProps> = ({ plant, onClose, onSave }) => {
    const [formData, setFormData] = useState({ id: '' as PlantCode, name: '', location: '' });
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (plant) setFormData({ id: plant.id, name: plant.name, location: plant.location });
        else setFormData({ id: '' as PlantCode, name: '', location: '' });
        setError('');
    }, [plant]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let result;
        if (plant) result = plantService.updatePlant(plant.id, { name: formData.name, location: formData.location });
        else {
            if (!formData.id) { setError("Plant ID is required."); return; }
            result = plantService.addPlant(formData);
        }
        if (result.success) onSave(); else setError(result.message || 'An unknown error occurred.');
    };

    return (
        <ModalWrapper><ModalHeader title={plant ? "Edit Plant Details" : "Add New Plant"} icon={Factory} onClose={onClose} /><form onSubmit={handleSubmit} className="p-6 space-y-4">{error && <p className="text-rose-400 bg-rose-900/20 p-3 rounded-md text-sm border border-rose-500/30">{error}</p>}<div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Plant ID (e.g., CIKARANG)</label><input value={formData.id} onChange={e => setFormData({...formData, id: e.target.value.toUpperCase() as PlantCode})} required disabled={!!plant} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:opacity-50" /></div><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Plant Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" /></div><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Location</label><input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" /></div><div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700/50 hover:bg-slate-700">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"><Save size={16} /> Save Changes</button></div></form></ModalWrapper>
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
    
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (machine) plantService.updateMachine(machine.id, { name: formData.name }); else plantService.addMachine(formData); onSave(); };

    return (
        <ModalWrapper><ModalHeader title={machine ? 'Edit Machine' : 'Add New Machine'} icon={Monitor} onClose={onClose} /><form onSubmit={handleSubmit} className="p-6 space-y-4"><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Machine Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" /></div><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Plant</label><select value={formData.plantId} onChange={e => setFormData({...formData, plantId: e.target.value as PlantCode})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white h-[46px]">{availablePlants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700/50 hover:bg-slate-700">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"><Save size={16} /> Save Changes</button></div></form></ModalWrapper>
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
    
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (panel) lvmdpService.updateLVMDP(panel.id, { name: formData.name }); else lvmdpService.addLVMDP(formData); onSave(); };

    return (
        <ModalWrapper><ModalHeader title={panel ? 'Edit LVMDP Panel' : 'Add New Panel'} icon={Zap} onClose={onClose} /><form onSubmit={handleSubmit} className="p-6 space-y-4"><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Panel Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" /></div><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Plant</label><select value={formData.plantId} onChange={e => setFormData({...formData, plantId: e.target.value as PlantCode})} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white h-[46px]">{availablePlants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700/50 hover:bg-slate-700">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"><Save size={16} /> Save Changes</button></div></form></ModalWrapper>
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
        if (isEditMode) setFormData({ plantId: data.plant.id, type: data.utility.type, baseConsumption: data.utility.config.baseConsumption });
        else setFormData({ plantId: defaultPlantId, type: '', baseConsumption: 0 });
        setError('');
    }, [data]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        let result;
        if (isEditMode) result = utilityService.updateUtilityConfig(formData.plantId, formData.type, { baseConsumption: formData.baseConsumption });
        else {
             if (!formData.plantId || !formData.type) { setError("Plant and utility type are required."); return; }
            result = utilityService.addUtilityConfig(formData.plantId, { type: formData.type, baseConsumption: formData.baseConsumption });
        }
        if (result.success) onSave(); else setError(result.message || 'An unknown error occurred.');
    };

    return (
        <ModalWrapper><ModalHeader title={isEditMode ? `Edit ${formData.type} - ${formData.plantId}` : "Add New Utility Config"} icon={Wind} onClose={onClose} /><form onSubmit={handleSubmit} className="p-6 space-y-4">{error && <p className="text-rose-400 bg-rose-900/20 p-3 rounded-md text-sm border border-rose-500/30">{error}</p>}<div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Plant</label><select value={formData.plantId} onChange={e => setFormData({...formData, plantId: e.target.value as PlantCode})} disabled={isEditMode} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white h-[46px] disabled:opacity-50">{availablePlants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Utility Type</label><input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} disabled={isEditMode} required placeholder="e.g., co2" className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:opacity-50" /></div></div><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Base Consumption / Day</label><input type="number" value={formData.baseConsumption} onChange={e => setFormData({...formData, baseConsumption: Number(e.target.value)})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" /></div><div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700/50 hover:bg-slate-700">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"><Save size={16} /> Save Changes</button></div></form></ModalWrapper>
    );
};

const PackingConfigModal: React.FC<PackingConfigModalProps> = ({ line, onClose, onSave, plantId }) => {
    const [formData, setFormData] = useState({ lineName: '', bagmakers: 0, weighers: 0 });
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (line) setFormData({ lineName: line.lineName, bagmakers: line.bagmakers, weighers: line.weighers });
        else setFormData({ lineName: '', bagmakers: 0, weighers: 0 });
        setError('');
    }, [line]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const result = line ? packingConfigService.updatePackingLine(plantId, line.lineName, { bagmakers: formData.bagmakers, weighers: formData.weighers }) : packingConfigService.addPackingLine(plantId, formData);
        if (result.success) onSave(); else setError(result.message || 'An unknown error occurred.');
    };

    return (
        <ModalWrapper><ModalHeader title={line ? "Edit Packing Line" : "Add New Packing Line"} icon={Package} onClose={onClose} /><form onSubmit={handleSubmit} className="p-6 space-y-4">{error && <p className="text-rose-400 bg-rose-900/20 p-3 rounded-md text-sm border border-rose-500/30">{error}</p>}<div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Line Name</label><input value={formData.lineName} onChange={e => setFormData({...formData, lineName: e.target.value})} required disabled={!!line} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition disabled:opacity-50" /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5"># Bagmakers</label><input type="number" value={formData.bagmakers} onChange={e => setFormData({...formData, bagmakers: Number(e.target.value)})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" /></div><div><label className="block text-xs font-bold text-slate-300 uppercase mb-1.5"># Weighers</label><input type="number" value={formData.weighers} onChange={e => setFormData({...formData, weighers: Number(e.target.value)})} required className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" /></div></div><div className="pt-2 flex justify-end gap-3"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700/50 hover:bg-slate-700">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"><Save size={16} /> Save Changes</button></div></form></ModalWrapper>
    );
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ itemName, onClose, onConfirm }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
       <div className="bg-slate-900 border border-rose-500/30 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 text-center"><div className="mx-auto w-14 h-14 rounded-full bg-rose-900/50 flex items-center justify-center border-4 border-slate-800 mb-4 ring-1 ring-rose-500/30"><Trash2 className="text-rose-400" size={28}/></div><h3 className="text-lg font-bold text-white">Confirm Deletion</h3><p className="text-sm text-slate-300 mt-2 leading-relaxed">Are you sure you want to permanently delete <br/><strong className="font-bold text-white bg-slate-800/50 px-1.5 py-0.5 rounded">{itemName}</strong>? This action cannot be undone.</p></div>
            <div className="p-4 bg-slate-950/50 grid grid-cols-2 gap-3 border-t border-slate-800"><button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-300 hover:text-white font-bold transition-colors bg-slate-700 hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500">Cancel</button><button onClick={onConfirm} className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400">Confirm Delete</button></div>
       </div>
    </div>
);

export default SettingsView;
