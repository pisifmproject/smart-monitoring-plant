
import React, { useState, useEffect } from 'react';
import { UserRole, WidgetCategory } from '../types';
import { Card } from '../components/SharedComponents';
import { WIDGET_REGISTRY, getVisibilityRulesForRole, updateVisibilityRule, bulkUpdateVisibilityRules } from '../services/visibilityStore';
import { Save, User, Shield, Bell, Server, Database, Eye, EyeOff, Filter, CheckSquare, Square, CheckCircle2 } from 'lucide-react';

interface SettingsProps {
    userRole: UserRole;
}

const SettingsView: React.FC<SettingsProps> = ({ userRole }) => {
    const [activeSection, setActiveSection] = useState('general');
    
    // Visibility Settings State
    const [targetRole, setTargetRole] = useState<UserRole>(UserRole.SUPERVISOR);
    const [filterCategory, setFilterCategory] = useState<string>('ALL');
    const [visibilityRules, setVisibilityRules] = useState<Record<string, boolean>>({});

    // Load rules when target role changes
    useEffect(() => {
        if (activeSection === 'visibility') {
            const rules = getVisibilityRulesForRole(targetRole);
            setVisibilityRules(rules);
        }
    }, [targetRole, activeSection]);

    // Security Check
    if (userRole !== UserRole.ADMINISTRATOR) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4 animate-in fade-in zoom-in">
                <div className="bg-rose-500/10 p-6 rounded-full border border-rose-500/20">
                    <Shield size={64} className="text-rose-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Access Denied</h2>
                <p className="text-slate-400 max-w-md">
                    You do not have the required permissions to access System Settings. 
                    This area is restricted to users with the <span className="text-rose-400 font-bold">Administrator</span> role.
                </p>
            </div>
        );
    }

    const handleToggleVisibility = (key: string, currentVisible: boolean) => {
        const newValue = !currentVisible;
        // Update local state for UI
        setVisibilityRules(prev => ({ ...prev, [key]: newValue }));
        // Persist
        updateVisibilityRule(targetRole, key, newValue);
    };

    const handleSelectAll = (select: boolean) => {
        const updates: Record<string, boolean> = {};
        filteredWidgets.forEach(w => {
            updates[w.key] = select;
        });
        setVisibilityRules(prev => ({ ...prev, ...updates }));
        bulkUpdateVisibilityRules(targetRole, updates);
    };

    const filteredWidgets = WIDGET_REGISTRY.filter(w => {
        if (filterCategory !== 'ALL' && w.category !== filterCategory) return false;
        return true;
    });

    const renderVisibilitySettings = () => (
        <Card title="Master Data Visibility Control">
            <div className="space-y-6">
                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center bg-slate-900 p-4 rounded-lg border border-slate-700">
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-xs font-semibold uppercase text-slate-400">Target Role</label>
                        <select 
                            value={targetRole} 
                            onChange={(e) => setTargetRole(e.target.value as UserRole)}
                            className="bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none focus:border-blue-500"
                        >
                            {Object.values(UserRole).filter(r => r !== UserRole.ADMINISTRATOR).map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex flex-col gap-1 w-full md:w-auto">
                        <label className="text-xs font-semibold uppercase text-slate-400 flex items-center gap-2"><Filter size={12}/> Filter Category</label>
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-slate-800 border border-slate-600 rounded p-2 text-white outline-none focus:border-blue-500"
                        >
                            <option value="ALL">All Categories</option>
                            {Object.values(WidgetCategory).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => handleSelectAll(true)} className="flex-1 bg-emerald-900/30 text-emerald-400 border border-emerald-800 px-3 py-2 rounded text-xs font-medium hover:bg-emerald-900/50 flex items-center justify-center gap-1">
                            <CheckSquare size={14}/> Show All
                        </button>
                        <button onClick={() => handleSelectAll(false)} className="flex-1 bg-rose-900/30 text-rose-400 border border-rose-800 px-3 py-2 rounded text-xs font-medium hover:bg-rose-900/50 flex items-center justify-center gap-1">
                            <Square size={14}/> Hide All
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="border border-slate-700 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900 uppercase tracking-wider text-xs font-semibold text-slate-300">
                            <tr>
                                <th className="p-3">Widget Label</th>
                                <th className="p-3">Location</th>
                                <th className="p-3">Type</th>
                                <th className="p-3 text-center">Visible</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900/30">
                            {filteredWidgets.length === 0 ? (
                                <tr><td colSpan={4} className="p-4 text-center text-slate-500">No widgets found matching filters.</td></tr>
                            ) : filteredWidgets.map(widget => {
                                const isVisible = visibilityRules[widget.key] !== undefined ? visibilityRules[widget.key] : widget.defaultVisible;
                                return (
                                    <tr key={widget.key} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-3">
                                            <p className="text-white font-medium">{widget.label}</p>
                                            <p className="text-xs text-slate-500 font-mono">{widget.key}</p>
                                        </td>
                                        <td className="p-3">
                                            <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">{widget.location}</span>
                                        </td>
                                        <td className="p-3 text-xs uppercase">{widget.type}</td>
                                        <td className="p-3 text-center">
                                            <button 
                                                onClick={() => handleToggleVisibility(widget.key, isVisible)}
                                                className={`p-2 rounded-md transition-all ${isVisible ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-700 text-slate-500'}`}
                                            >
                                                {isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p className="text-xs text-slate-500 italic">* Changes are saved automatically.</p>
            </div>
        </Card>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <Card title="System Configuration">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">System Name</label>
                                    <input type="text" defaultValue="Smart Monitoring Multi-Plant" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Data Refresh Rate (seconds)</label>
                                    <select className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none">
                                        <option>5</option>
                                        <option>10</option>
                                        <option>30</option>
                                        <option>60</option>
                                    </select>
                                </div>
                                 <div className="flex items-center justify-between py-2 border-t border-slate-700 mt-2">
                                    <span className="text-sm text-slate-300">Maintenance Mode</span>
                                    <button className="bg-slate-700 w-12 h-6 rounded-full relative transition-colors duration-200">
                                        <span className="absolute left-1 top-1 bg-slate-400 w-4 h-4 rounded-full transition-transform duration-200"></span>
                                    </button>
                                </div>
                            </div>
                        </Card>
                        <Card title="Global Thresholds">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">OEE Target (%)</label>
                                    <input type="number" defaultValue="85" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Max Power Demand (kW)</label>
                                    <input type="number" defaultValue="5000" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white" />
                                </div>
                            </div>
                        </Card>
                    </div>
                );
            case 'visibility':
                return renderVisibilitySettings();
            case 'users':
                return (
                    <Card title="User Management">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-900/50 uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="p-3">Username</th>
                                    <th className="p-3">Role</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                <tr>
                                    <td className="p-3 text-white font-medium">admin1</td>
                                    <td className="p-3"><span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs border border-purple-500/20">Administrator</span></td>
                                    <td className="p-3"><span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle2 size={12}/> Active</span></td>
                                    <td className="p-3 text-right"><button className="text-blue-400 hover:text-blue-300">Edit</button></td>
                                </tr>
                                <tr>
                                    <td className="p-3 text-white font-medium">spv2</td>
                                    <td className="p-3"><span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/20">Supervisor</span></td>
                                    <td className="p-3"><span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle2 size={12}/> Active</span></td>
                                    <td className="p-3 text-right"><button className="text-blue-400 hover:text-blue-300">Edit</button></td>
                                </tr>
                                 <tr>
                                    <td className="p-3 text-white font-medium">operator3</td>
                                    <td className="p-3"><span className="bg-slate-500/10 text-slate-400 px-2 py-1 rounded text-xs border border-slate-500/20">Operator</span></td>
                                    <td className="p-3"><span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle2 size={12}/> Active</span></td>
                                    <td className="p-3 text-right"><button className="text-blue-400 hover:text-blue-300">Edit</button></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2">
                                <User size={16} /> Add New User
                            </button>
                        </div>
                    </Card>
                );
            case 'alerts':
                return (
                     <Card title="Notification Rules">
                        <div className="space-y-4">
                            <div className="bg-slate-900 p-3 rounded border border-slate-700 flex items-start justify-between">
                                <div>
                                    <p className="text-white font-medium">Critical Alarm Broadcast</p>
                                    <p className="text-xs text-slate-500">Send email to Supervisors when Critical alarm persists > 10min</p>
                                </div>
                                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="bg-slate-900 p-3 rounded border border-slate-700 flex items-start justify-between">
                                <div>
                                    <p className="text-white font-medium">Shift Summary Report</p>
                                    <p className="text-xs text-slate-500">Auto-generate PDF report at end of shift</p>
                                </div>
                                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                            </div>
                             <button className="w-full py-2 border border-dashed border-slate-600 text-slate-400 rounded hover:border-slate-500 hover:text-slate-300 text-sm">
                                + Add New Rule
                            </button>
                        </div>
                     </Card>
                );
            default:
                return <div>Select a category</div>;
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-full gap-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Settings Sidebar */}
            <div className="w-full lg:w-64 shrink-0">
                <div className="bg-slate-900 rounded-lg p-2 border border-slate-800 flex flex-row lg:flex-col overflow-x-auto">
                    <button 
                        onClick={() => setActiveSection('general')}
                        className={`min-w-max lg:w-full text-left px-4 py-3 rounded-md text-sm font-medium flex items-center gap-3 mb-1 transition-colors ${activeSection === 'general' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Server size={18} /> General
                    </button>
                    <button 
                         onClick={() => setActiveSection('visibility')}
                        className={`min-w-max lg:w-full text-left px-4 py-3 rounded-md text-sm font-medium flex items-center gap-3 mb-1 transition-colors ${activeSection === 'visibility' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Eye size={18} /> Master Visibility
                    </button>
                    <button 
                         onClick={() => setActiveSection('users')}
                        className={`min-w-max lg:w-full text-left px-4 py-3 rounded-md text-sm font-medium flex items-center gap-3 mb-1 transition-colors ${activeSection === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <User size={18} /> Users & Roles
                    </button>
                    <button 
                         onClick={() => setActiveSection('alerts')}
                        className={`min-w-max lg:w-full text-left px-4 py-3 rounded-md text-sm font-medium flex items-center gap-3 mb-1 transition-colors ${activeSection === 'alerts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                    <button 
                         onClick={() => setActiveSection('database')}
                        className={`min-w-max lg:w-full text-left px-4 py-3 rounded-md text-sm font-medium flex items-center gap-3 mb-1 transition-colors ${activeSection === 'database' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <Database size={18} /> Database
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 space-y-6 pb-12">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-white capitalize">{activeSection === 'visibility' ? 'Master Visibility Settings' : `${activeSection} Settings`}</h2>
                    {activeSection !== 'visibility' && (
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2 text-sm font-bold transition-all hover:scale-105">
                            <Save size={18} /> Save Changes
                        </button>
                    )}
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsView;
