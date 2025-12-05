
import React, { useState } from 'react';
import { Machine, MachineStatus, UserRole, MachineType } from '../types';
import { Card, StatusBadge, MetricCard } from '../components/SharedComponents';
import { isWidgetVisible } from '../services/visibilityStore';
import { Activity, Gauge, Thermometer, Zap, AlertTriangle, Settings, ArrowLeft, ClipboardPen, Wrench, X, Flame, Wind, Droplets, CheckCircle2, Waves, Beaker, Fan, Cloud } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface MachineDetailProps {
    machine: Machine;
    onBack: () => void;
    userRole: UserRole;
}

const ALL_TABS = [
    { key: 'Performance', visibilityKey: 'MACHINE_TAB_PERFORMANCE' },
    { key: 'Process', visibilityKey: 'MACHINE_TAB_PROCESS' },
    { key: 'Health', visibilityKey: 'MACHINE_TAB_HEALTH' },
    { key: 'Utility', visibilityKey: 'MACHINE_TAB_UTILITY' },
    { key: 'Alarms', visibilityKey: 'MACHINE_TAB_ALARMS' },
    { key: 'Downtime', visibilityKey: 'MACHINE_TAB_DOWNTIME' },
    { key: 'Maintenance', visibilityKey: 'MACHINE_TAB_MAINTENANCE' }
];

// Mock timeseries data
const generateTimeSeries = (points: number, base: number, variance: number) => {
    return Array.from({ length: points }, (_, i) => ({
        time: `${10 + Math.floor(i / 4)}:${(i % 4) * 15 || '00'}`,
        value: base + (Math.random() * variance * 2 - variance)
    }));
};

const outputData = generateTimeSeries(16, 950, 50);
const tempData = generateTimeSeries(16, 85, 2);

// Mock Downtime Stats
const downtimeReasonData = [
    { name: 'Machine Jam', minutes: 45, color: '#f59e0b' },
    { name: 'Changeover', minutes: 90, color: '#3b82f6' },
    { name: 'Material Empty', minutes: 30, color: '#10b981' },
    { name: 'Sensor Fault', minutes: 15, color: '#ef4444' },
    { name: 'Other', minutes: 10, color: '#94a3b8' },
];

// Mock Maintenance Logs
const maintenanceLogs = [
    { id: 1, date: '2023-12-01', type: 'PM', desc: 'Weekly greasing of main bearings', tech: 'Budi (MTC)', status: 'COMPLETED' },
    { id: 2, date: '2023-11-28', type: 'CM', desc: 'Replaced broken proximity sensor at infeed', tech: 'Agus (MTC)', status: 'COMPLETED' },
    { id: 3, date: '2023-11-15', type: 'PM', desc: 'Monthly oil filter change', tech: 'Team A', status: 'COMPLETED' },
    { id: 4, date: '2023-11-02', type: 'CM', desc: 'Adjusted conveyor belt tension', tech: 'Budi (MTC)', status: 'COMPLETED' },
];

const MachineDetail: React.FC<MachineDetailProps> = ({ machine, onBack, userRole }) => {
    // Filter tabs based on visibility
    const visibleTabs = ALL_TABS.filter(t => isWidgetVisible(userRole, t.visibilityKey));
    
    // Default to first visible tab, or empty string if none
    const [activeTab, setActiveTab] = useState(visibleTabs.length > 0 ? visibleTabs[0].key : '');
    const [showDowntimeModal, setShowDowntimeModal] = useState(false);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

    // Permission Logic (Keep existing RBAC logic in addition to visibility)
    const canEditConfig = userRole === UserRole.ADMINISTRATOR;
    const canInputDowntime = [UserRole.ADMINISTRATOR, UserRole.SUPERVISOR, UserRole.OPERATOR].includes(userRole);
    const canLogMaintenance = [UserRole.ADMINISTRATOR, UserRole.MAINTENANCE].includes(userRole);

    const handleDowntimeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowDowntimeModal(false);
        alert("Downtime record saved successfully.");
    };

    const handleMaintenanceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowMaintenanceModal(false);
        alert("Maintenance log entry created.");
    };

    const renderProcessTab = () => {
        switch (machine.type) {
            case MachineType.EXTRUDER:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <Card title="Barrel Temperatures" className="lg:col-span-3">
                             <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {[1,2,3,4,5,6].map(z => (
                                    <div key={z} className="bg-slate-900 p-3 rounded text-center">
                                        <p className="text-slate-500 text-xs">Zone {z}</p>
                                        <p className="text-xl font-bold text-amber-400">{(machine.temperature + Math.random()*10 - 5).toFixed(1)}°C</p>
                                    </div>
                                ))}
                             </div>
                         </Card>
                         <Card title="Extruder Parameters">
                             <div className="space-y-4">
                                 <div className="flex justify-between border-b border-slate-700 pb-2">
                                     <span className="text-slate-400">Screw Speed</span>
                                     <span className="text-white font-mono font-bold">125 RPM</span>
                                 </div>
                                 <div className="flex justify-between border-b border-slate-700 pb-2">
                                     <span className="text-slate-400">Feeder Speed</span>
                                     <span className="text-white font-mono font-bold">45.5 Hz</span>
                                 </div>
                                  <div className="flex justify-between border-b border-slate-700 pb-2">
                                     <span className="text-slate-400">Die Pressure</span>
                                     <span className="text-white font-mono font-bold">45 Bar</span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span className="text-slate-400">Product Moisture</span>
                                     <span className="text-blue-400 font-mono font-bold">12.5%</span>
                                 </div>
                             </div>
                         </Card>
                         <Card title="Product Outfeed">
                             <div className="flex flex-col items-center justify-center h-full">
                                 <Thermometer size={48} className="text-rose-500 mb-2"/>
                                 <span className="text-4xl font-bold text-white">82.5°C</span>
                                 <span className="text-slate-500">Product Temp</span>
                             </div>
                         </Card>
                         <Card title="Trend History">
                             <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={tempData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" hide />
                                    <YAxis stroke="#94a3b8" domain={['auto', 'auto']} hide />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                         </Card>
                    </div>
                );
            case MachineType.FRYER:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card title="Oil System">
                             <div className="space-y-4">
                                 <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                     <span className="text-slate-400">Oil Temperature</span>
                                     <span className="text-rose-400 font-mono font-bold text-lg">175.5°C</span>
                                 </div>
                                 <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                                     <span className="text-slate-400">Oil Level</span>
                                     <span className="text-emerald-400 font-mono font-bold text-lg">85%</span>
                                 </div>
                                  <div className="flex justify-between items-center">
                                     <span className="text-slate-400">Circulation Pump</span>
                                     <span className="text-white bg-emerald-600/20 px-2 py-0.5 rounded text-xs font-bold uppercase border border-emerald-600/50">Running</span>
                                 </div>
                             </div>
                        </Card>
                        <Card title="Conveyor Control">
                             <div className="flex flex-col items-center justify-center h-full">
                                 <Activity size={48} className="text-blue-500 mb-2"/>
                                 <span className="text-4xl font-bold text-white">4.2 <span className="text-sm text-slate-400">m/min</span></span>
                                 <span className="text-slate-500">Belt Speed</span>
                             </div>
                        </Card>
                        <Card title="Exhaust & Steam">
                             <div className="space-y-4">
                                 <div className="flex justify-between border-b border-slate-700 pb-2">
                                     <span className="text-slate-400">Exhaust Temp</span>
                                     <span className="text-white font-mono font-bold">110°C</span>
                                 </div>
                                 <div className="flex justify-between">
                                     <span className="text-slate-400">Steam Pressure</span>
                                     <span className="text-white font-mono font-bold">6.5 Bar</span>
                                 </div>
                             </div>
                        </Card>
                    </div>
                );
            default: // Generic or other types
                return (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <Card title="General Process Parameters">
                             <div className="grid grid-cols-2 gap-4">
                                 <div className="bg-slate-900 p-3 rounded">
                                     <p className="text-slate-500 text-xs uppercase">Speed</p>
                                     <p className="text-xl font-bold text-white">{machine.lineSpeed} RPM</p>
                                 </div>
                                 <div className="bg-slate-900 p-3 rounded">
                                     <p className="text-slate-500 text-xs uppercase">Temperature</p>
                                     <p className="text-xl font-bold text-amber-400">{machine.temperature}°C</p>
                                 </div>
                                  <div className="bg-slate-900 p-3 rounded">
                                     <p className="text-slate-500 text-xs uppercase">Pressure</p>
                                     <p className="text-xl font-bold text-blue-400">4.5 Bar</p>
                                 </div>
                                 <div className="bg-slate-900 p-3 rounded">
                                     <p className="text-slate-500 text-xs uppercase">Flow Rate</p>
                                     <p className="text-xl font-bold text-emerald-400">120 L/m</p>
                                 </div>
                             </div>
                         </Card>
                         <Card title="Parameter Trend">
                             <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={tempData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                     </div>
                );
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 relative">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            {machine.name}
                            <StatusBadge status={machine.status} />
                        </h1>
                        <p className="text-slate-400 text-sm">{machine.code} • {machine.type} • Plant {machine.plantId}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {canEditConfig && (
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-md text-sm font-medium flex items-center gap-2">
                            <Settings size={16} /> Config
                        </button>
                    )}
                    
                    {canInputDowntime && (
                        <button 
                            onClick={() => setShowDowntimeModal(true)}
                            className="px-4 py-2 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-600/50 rounded-md text-sm font-medium flex items-center gap-2"
                        >
                            <ClipboardPen size={16} /> Input Downtime
                        </button>
                    )}

                    {canLogMaintenance && (
                        <button 
                            onClick={() => setShowMaintenanceModal(true)}
                            className="px-4 py-2 bg-amber-600/20 text-amber-400 hover:bg-amber-600/30 border border-amber-600/50 rounded-md text-sm font-medium flex items-center gap-2"
                        >
                            <Wrench size={16} /> Log Repair
                        </button>
                    )}

                    <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium">
                        Live Monitor
                    </button>
                </div>
            </div>

            {/* Tabs */}
            {visibleTabs.length > 0 ? (
                <div className="border-b border-slate-700 overflow-x-auto">
                    <nav className="flex space-x-8 min-w-max">
                        {visibleTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                                    activeTab === tab.key
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                                }`}
                            >
                                {tab.key === 'Maintenance' ? 'Maintenance Notes' : tab.key}
                            </button>
                        ))}
                    </nav>
                </div>
            ) : (
                <div className="p-4 bg-slate-900 rounded-lg text-slate-400 text-center">
                    No details available for your role.
                </div>
            )}

            {/* Content */}
            <div className="min-h-[500px]">
                {activeTab === 'Performance' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* OEE Gauges */}
                        <Card title="OEE & Components" className="col-span-1 lg:col-span-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                                    <p className="text-slate-400 text-xs uppercase">Overall OEE</p>
                                    <p className="text-4xl font-bold text-emerald-400 my-2">{(machine.oee * 100).toFixed(0)}%</p>
                                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div className="bg-emerald-500 h-full" style={{ width: `${machine.oee * 100}%` }}></div>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                                    <p className="text-slate-400 text-xs uppercase">Availability</p>
                                    <p className="text-2xl font-bold text-white my-2">92%</p>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full" style={{ width: '92%' }}></div>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                                    <p className="text-slate-400 text-xs uppercase">Performance</p>
                                    <p className="text-2xl font-bold text-white my-2">88%</p>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full" style={{ width: '88%' }}></div>
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-lg text-center">
                                    <p className="text-slate-400 text-xs uppercase">Quality</p>
                                    <p className="text-2xl font-bold text-white my-2">99%</p>
                                    <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full" style={{ width: '99%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card title="Output Trend (kg/hr)" className="col-span-1 lg:col-span-2 min-h-[300px]">
                             <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={outputData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                    />
                                    <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>

                        <div className="space-y-6">
                            <Card title="Current Shift Status">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                                        <span className="text-slate-400">Target</span>
                                        <span className="font-mono text-white text-lg">{machine.targetShift.toLocaleString()} kg</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                                        <span className="text-slate-400">Actual</span>
                                        <span className="font-mono text-emerald-400 text-lg">{machine.totalOutputShift.toLocaleString()} kg</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-1">
                                        <span className="text-slate-400">Completion</span>
                                        <span className="font-mono text-blue-400 text-lg">{Math.round((machine.totalOutputShift/machine.targetShift)*100)}%</span>
                                    </div>
                                </div>
                            </Card>
                            <Card title="Speed & Quality">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Line Speed</p>
                                        <p className="text-xl font-bold text-white">{machine.lineSpeed} <span className="text-sm text-slate-400">{machine.type === 'PACKING' ? 'ppm' : 'rpm'}</span></p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase">Reject Rate</p>
                                        <p className="text-xl font-bold text-rose-400">{machine.rejectRate}%</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-slate-500 uppercase">Reject Mass (Est)</p>
                                        <p className="text-lg font-mono text-slate-300">{(machine.totalOutputShift * (machine.rejectRate/100)).toFixed(1)} kg</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'Process' && renderProcessTab()}
                
                {activeTab === 'Health' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card title="Motor Status (Main Drive)">
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-slate-900 p-2 rounded border border-slate-700">
                                        <p className="text-xs text-slate-500">I-R</p>
                                        <p className="font-bold text-slate-200">42.5 A</p>
                                    </div>
                                    <div className="bg-slate-900 p-2 rounded border border-slate-700">
                                        <p className="text-xs text-slate-500">I-S</p>
                                        <p className="font-bold text-slate-200">43.1 A</p>
                                    </div>
                                    <div className="bg-slate-900 p-2 rounded border border-slate-700">
                                        <p className="text-xs text-slate-500">I-T</p>
                                        <p className="font-bold text-slate-200">42.8 A</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-slate-400">Load</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 bg-slate-700 h-2 rounded-full overflow-hidden">
                                            <div className="bg-emerald-500 h-full" style={{ width: '75%' }}></div>
                                        </div>
                                        <span className="text-sm font-bold text-white">75%</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <Card title="Temperatures">
                             <div className="flex items-center justify-around h-32">
                                <div className="text-center">
                                    <Thermometer className="mx-auto text-rose-400 mb-2" size={32} />
                                    <span className="text-2xl font-bold text-white">65°C</span>
                                    <p className="text-slate-500 text-xs">Winding Temp</p>
                                </div>
                                <div className="w-px h-16 bg-slate-700"></div>
                                <div className="text-center">
                                    <Thermometer className="mx-auto text-amber-400 mb-2" size={32} />
                                    <span className="text-2xl font-bold text-white">58°C</span>
                                    <p className="text-slate-500 text-xs">Bearing Temp</p>
                                </div>
                            </div>
                        </Card>
                         <Card title="Vibration Analysis">
                             <div className="flex flex-col items-center justify-center h-full">
                                 <Activity size={40} className="text-blue-500 mb-2"/>
                                 <div className="text-center">
                                    <span className="text-3xl font-bold text-white">2.1</span>
                                    <span className="text-sm text-slate-400 ml-1">mm/s</span>
                                 </div>
                                 <span className="text-xs text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded mt-2 border border-emerald-800">NORMAL</span>
                            </div>
                        </Card>
                    </div>
                )}
                
                 {activeTab === 'Utility' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MetricCard 
                            title="Electricity" 
                            value={125.6} 
                            unit="kWh" 
                            icon={Zap} 
                            color="text-yellow-400"
                        />
                         <MetricCard 
                            title="Fresh Water" 
                            value={4.2} 
                            unit="m³/h" 
                            icon={Droplets} 
                            color="text-blue-400"
                        />
                        <MetricCard 
                            title="Waste Water" 
                            value={3.8} 
                            unit="m³/h" 
                            icon={Waves} 
                            color="text-slate-400"
                        />
                         <MetricCard 
                            title="Natural Gas" 
                            value={12.5} 
                            unit="Nm³/h" 
                            icon={Flame} 
                            color="text-rose-400"
                        />
                         <MetricCard 
                            title="Steam" 
                            value={210} 
                            unit="kg/h" 
                            icon={Cloud} 
                            color="text-slate-200"
                        />
                         <MetricCard 
                            title="Comp. Air" 
                            value={35.5} 
                            unit="Nm³/h" 
                            icon={Wind} 
                            color="text-cyan-400"
                        />
                         <MetricCard 
                            title="Nitrogen" 
                            value={5.2} 
                            unit="m³/h" 
                            icon={Fan} 
                            color="text-emerald-400"
                        />
                         <MetricCard 
                            title="Fuel Oil" 
                            value={0} 
                            unit="L/h" 
                            icon={Beaker} 
                            color="text-amber-600"
                        />
                    </div>
                )}

                 {activeTab === 'Alarms' && (
                    <Card title="Alarm History">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-900/50 uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Severity</th>
                                    <th className="p-3">Message</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                <tr>
                                    <td className="p-3 font-mono">10:45:22</td>
                                    <td className="p-3"><span className="text-rose-400 font-bold flex items-center gap-1"><AlertTriangle size={14}/> CRITICAL</span></td>
                                    <td className="p-3 text-white">Motor Overload detected on Main Drive</td>
                                    <td className="p-3"><span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded border border-rose-500/30 text-xs uppercase">Active</span></td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-mono">09:12:10</td>
                                    <td className="p-3"><span className="text-amber-400 font-bold flex items-center gap-1"><AlertTriangle size={14}/> WARNING</span></td>
                                    <td className="p-3 text-white">Temperature deviation in Zone 2</td>
                                    <td className="p-3"><span className="bg-slate-700 text-slate-400 px-2 py-0.5 rounded border border-slate-600 text-xs uppercase">Ack</span></td>
                                </tr>
                                 <tr>
                                    <td className="p-3 font-mono">Yesterday</td>
                                    <td className="p-3"><span className="text-blue-400 font-bold flex items-center gap-1"><AlertTriangle size={14}/> INFO</span></td>
                                    <td className="p-3 text-white">Process Start Sequence Initiated</td>
                                    <td className="p-3"><span className="bg-emerald-900/30 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 text-xs uppercase">Resolved</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                )}

                {activeTab === 'Downtime' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card title="Downtime Statistics (Reasons)" className="lg:col-span-1">
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={downtimeReasonData} layout="vertical" margin={{ left: 30 }}>
                                         <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                         <XAxis type="number" stroke="#94a3b8" />
                                         <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} tick={{fontSize: 10}} />
                                         <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                         <Bar dataKey="minutes" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20}>
                                            {downtimeReasonData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                         </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card title="Downtime List" className="lg:col-span-2">
                             <div className="flex justify-end mb-4">
                                {canInputDowntime && (
                                    <button 
                                        onClick={() => setShowDowntimeModal(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2"
                                    >
                                        <ClipboardPen size={14}/> Add Log
                                    </button>
                                )}
                            </div>
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-900/50 uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="p-3">Start Time</th>
                                        <th className="p-3">Duration</th>
                                        <th className="p-3">Reason</th>
                                        <th className="p-3">Comment</th>
                                        <th className="p-3">Source</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    <tr>
                                        <td className="p-3 font-mono">08:15:00</td>
                                        <td className="p-3">15 min</td>
                                        <td className="p-3 text-amber-400">Machine Jam</td>
                                        <td className="p-3">Cleared blockage at infeed</td>
                                        <td className="p-3"><span className="text-xs bg-slate-700 px-2 py-1 rounded border border-slate-600">AUTO</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-mono">06:30:00</td>
                                        <td className="p-3">45 min</td>
                                        <td className="p-3 text-blue-400">Changeover</td>
                                        <td className="p-3">Product change to PC32</td>
                                        <td className="p-3"><span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-800/50">MANUAL</span></td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-mono">Yesterday</td>
                                        <td className="p-3">30 min</td>
                                        <td className="p-3 text-emerald-400">Material Empty</td>
                                        <td className="p-3">Waiting for corn supply</td>
                                        <td className="p-3"><span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded border border-blue-800/50">MANUAL</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </Card>
                    </div>
                )}

                {activeTab === 'Maintenance' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Maintenance History & Notes</h3>
                            {canLogMaintenance && (
                                <button 
                                    onClick={() => setShowMaintenanceModal(true)}
                                    className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/50 px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
                                >
                                    <Wrench size={16} /> New Entry
                                </button>
                            )}
                        </div>
                        <div className="grid gap-4">
                            {maintenanceLogs.map(log => (
                                <Card key={log.id} className="hover:border-slate-500 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg ${log.type === 'PM' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                                {log.type === 'PM' ? <ClipboardPen size={20}/> : <Wrench size={20}/>}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${log.type === 'PM' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                        {log.type}
                                                    </span>
                                                    <span className="text-slate-500 text-sm font-mono">{log.date}</span>
                                                </div>
                                                <p className="text-white font-medium">{log.desc}</p>
                                                <p className="text-slate-500 text-sm mt-1">Tech: <span className="text-slate-300">{log.tech}</span></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded">
                                            <CheckCircle2 size={12}/> {log.status}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Downtime Input Modal */}
            {showDowntimeModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <ClipboardPen size={18} className="text-rose-400" /> Input Downtime
                            </h3>
                            <button onClick={() => setShowDowntimeModal(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleDowntimeSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Reason Code</label>
                                <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none">
                                    <option>Select Reason...</option>
                                    <option>Machine Breakdown (Mech)</option>
                                    <option>Electrical Fault</option>
                                    <option>Material Empty</option>
                                    <option>Quality Reject High</option>
                                    <option>Planned Maintenance</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Start Time</label>
                                    <input type="time" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Duration (min)</label>
                                    <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="0" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Comments</label>
                                <textarea className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white h-24" placeholder="Describe the issue..."></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowDowntimeModal(false)} className="px-4 py-2 text-slate-300 hover:text-white text-sm">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Maintenance Log Modal */}
            {showMaintenanceModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Wrench size={18} className="text-amber-400" /> Log Maintenance
                            </h3>
                            <button onClick={() => setShowMaintenanceModal(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleMaintenanceSubmit} className="p-4 space-y-4">
                             <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Activity Type</label>
                                <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none">
                                    <option>Preventive Maintenance (PM)</option>
                                    <option>Corrective Maintenance (CM)</option>
                                    <option>Condition Monitoring</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Parts Replaced</label>
                                <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" placeholder="e.g. Bearing 6204, Seal Kit" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Work Description</label>
                                <textarea className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white h-24" placeholder="Details of work performed..."></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowMaintenanceModal(false)} className="px-4 py-2 text-slate-300 hover:text-white text-sm">Cancel</button>
                                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium">Log Activity</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MachineDetail;
