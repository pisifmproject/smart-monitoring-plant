import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Machine, UserRole, MachineType } from '../types';
import { Card, StatusBadge, MetricCard, formatNumber } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { maintenanceService } from '../services/maintenanceService';
import { plantService as ps } from '../services/plantService'; // Using correct import path
import { 
    Activity, Zap, AlertTriangle, ArrowLeft, 
    ClipboardPen, Wrench, X, CheckCircle2, 
    Wind, Droplets, Cloud, Box, Clock, Camera, Plus, History, Save, FileText, Loader2,
    Scale, Package, Film, Thermometer
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, AreaChart, Area, Legend 
} from 'recharts';

interface MachineDetailProps {
    machine: Machine;
    onBack: () => void;
    userRole: UserRole;
    currentUser: string; 
}

type Period = 'Day' | 'Week' | 'Month' | 'Year';

const ALL_TABS_BASE = [
    { key: 'Performance', visibilityKey: 'MACHINE_TAB_PERFORMANCE' },
    { key: 'Process', visibilityKey: 'MACHINE_TAB_PROCESS' },
    { key: 'Packing', visibilityKey: 'MACHINE_TAB_PACKING' },
    { key: 'Utility', visibilityKey: 'MACHINE_TAB_UTILITY' },
    { key: 'Alarms', visibilityKey: 'MACHINE_TAB_ALARMS' },
    { key: 'Downtime', visibilityKey: 'MACHINE_TAB_DOWNTIME' },
    { key: 'Maintenance', visibilityKey: 'MACHINE_TAB_MAINTENANCE' }
];

const MachineDetail: React.FC<MachineDetailProps> = ({ machine, onBack, userRole, currentUser }) => {
    const location = useLocation();
    const visibilityContext = { plantId: machine.plantId, machineId: machine.id };
    
    // Check which tabs are visible for this user
    const visibleTabs = ALL_TABS_BASE.filter(t => isDataItemVisible(userRole, t.visibilityKey, visibilityContext));
    
    // Set active tab with priority:
    // 1. Navigation state (e.g. from clicking an alarm on dashboard)
    // 2. First visible tab
    const [activeTab, setActiveTab] = useState(() => {
        const requestedTab = location.state?.initialTab;
        if (requestedTab && visibleTabs.find(t => t.key === requestedTab)) {
            return requestedTab;
        }
        return visibleTabs.length > 0 ? visibleTabs[0].key : '';
    });

    const [period, setPeriod] = useState<Period>('Day');
    
    // Download State
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDownloadToast, setShowDownloadToast] = useState(false);
    
    // Ref for scrolling to maintenance form
    const maintenanceRef = useRef<HTMLDivElement>(null);

    // Scroll to maintenance tab content if requested via navigation
    useEffect(() => {
        if (activeTab === 'Maintenance' && location.state?.initialTab === 'Maintenance' && maintenanceRef.current) {
             maintenanceRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeTab, location.state]);
    
    // Force re-render helper
    const [tick, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    // Fetch real data from services with Period context
    const timeSeriesData = useMemo(() => ps.getMachineTimeSeries(machine.id, period), [machine.id, period]);
    const accumulatedStats = useMemo(() => ps.getMachineStats(machine.id, period), [machine.id, period]);

    const alarmHistory = useMemo(() => maintenanceService.getMaintenanceHistory(machine.id), [machine.id, tick]); // Refresh on maintenance action
    const activeAlarms = maintenanceService.getMachineActiveAlarms(machine.id);
    const downtimeLogs = useMemo(() => maintenanceService.getDowntimeLogs(machine.id), [machine.id, tick]);
    
    const primaryAlarm = activeAlarms.length > 0 ? activeAlarms[0] : null;

    // Maintenance Form State
    const [startTechnicianName, setStartTechnicianName] = useState('');
    const [formCheckedBy, setFormCheckedBy] = useState('');
    const [maintenanceNote, setMaintenanceNote] = useState('');
    const [maintenanceSolved, setMaintenanceSolved] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);

    // Downtime Form State
    const [isDowntimeModalOpen, setIsDowntimeModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [newDowntime, setNewDowntime] = useState({
        start: '',
        end: '',
        reason: 'Jam',
        description: ''
    });

    // Permissions
    const canAddDowntime = userRole === UserRole.OPERATOR || userRole === UserRole.ADMINISTRATOR || userRole === UserRole.SUPERVISOR;
    const canPerformMaintenance = userRole === UserRole.MAINTENANCE;
    const canViewHistory = true;
    const canDownloadReport = [UserRole.ADMINISTRATOR, UserRole.SUPERVISOR, UserRole.MANAGEMENT].includes(userRole);
    
    // Handle tab switching safety
    useEffect(() => {
        if (!visibleTabs.find(t => t.key === activeTab) && visibleTabs.length > 0) {
            setActiveTab(visibleTabs[0].key);
        }
    }, [userRole, visibleTabs, activeTab]);

    const handleStartMaintenance = (e: React.FormEvent) => {
        e.preventDefault();
        if (!primaryAlarm || !startTechnicianName.trim()) return;
        
        maintenanceService.startMaintenance(primaryAlarm.id, startTechnicianName);
        setFormCheckedBy(startTechnicianName); 
        forceUpdate();
    };

    const handleMaintenanceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!primaryAlarm || !formCheckedBy.trim()) return;
        
        setFormSubmitting(true);
        setTimeout(() => {
            maintenanceService.submitMaintenanceAction({
                alarmId: primaryAlarm.id,
                machineId: machine.id,
                checkedBy: formCheckedBy, 
                solved: maintenanceSolved,
                note: maintenanceNote,
                photoUrl: '' 
            });
            setFormSubmitting(false);
            setMaintenanceNote('');
            setStartTechnicianName('');
            setFormCheckedBy('');
            forceUpdate();
        }, 800);
    };

    const handleAddDowntimeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDowntime.start || !newDowntime.end) return;

        // Simple duration calculation for demo (assuming same day)
        let duration = "0m";
        try {
            // Using arbitrary date to calculate time difference
            const d1 = new Date(`2024-01-01T${newDowntime.start}`);
            const d2 = new Date(`2024-01-01T${newDowntime.end}`);
            let diffMs = d2.getTime() - d1.getTime();
            
            // Handle cross-midnight by adding 24 hours if end is before start
            if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
            
            const totalMinutes = Math.floor(diffMs / 60000);
            const h = Math.floor(totalMinutes / 60);
            const m = Math.floor(totalMinutes % 60);
            
            if (h > 0) duration = `${h}h ${m}m`;
            else duration = `${m}m`;

        } catch (err) {
            console.error("Date calc error", err);
        }

        maintenanceService.addDowntimeLog({
            machineId: machine.id,
            start: newDowntime.start,
            end: newDowntime.end,
            duration: duration,
            reason: newDowntime.reason,
            description: newDowntime.description,
            source: 'MANUAL'
        });

        setIsDowntimeModalOpen(false);
        setNewDowntime({ start: '', end: '', reason: 'Jam', description: '' });
        forceUpdate();
        
        // Show success toast
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };
    
    const handleDownloadReport = () => {
        if (isDownloading) return;
        setIsDownloading(true);

        // Simulate PDF generation delay
        setTimeout(() => {
            setIsDownloading(false);
            setShowDownloadToast(true);
            // Hide toast after 3 seconds
            setTimeout(() => setShowDownloadToast(false), 3000);
        }, 2000);
    };
    
    const FilterButton = ({ label }: { label: Period }) => {
        // Restricted: Operators can only see Day
        if (userRole === UserRole.OPERATOR && label !== 'Day') return null;

        return (
            <button 
                onClick={() => setPeriod(label)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    period === label 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
            >
                {label}
            </button>
        );
    };

    const renderPerformanceTab = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                 {isDataItemVisible(userRole, 'MACHINE_OEE', visibilityContext) && <MetricCard title="OEE" value={formatNumber(machine.oee * 100)} unit="%" icon={Activity} color="text-emerald-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_AVAILABILITY', visibilityContext) && <MetricCard title="Availability" value={formatNumber((machine.availability || 0.95) * 100)} unit="%" icon={Clock} color="text-blue-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_PERFORMANCE', visibilityContext) && <MetricCard title="Performance" value={formatNumber((machine.performance || 0.92) * 100)} unit="%" icon={Zap} color="text-yellow-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_QUALITY', visibilityContext) && <MetricCard title="Quality" value={formatNumber((machine.quality || 0.99) * 100)} unit="%" icon={CheckCircle2} color="text-purple-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_OUTPUT_KG_H', visibilityContext) && <MetricCard title="Output Rate" value={formatNumber(machine.outputPerHour)} unit="kg/h" icon={Box} />}
                 {isDataItemVisible(userRole, 'MACHINE_OUTPUT_SHIFT', visibilityContext) && <MetricCard title={`Total Output (${period})`} value={formatNumber(accumulatedStats?.totalOutput || 0)} unit="kg" icon={Box} />}
                 {isDataItemVisible(userRole, 'MACHINE_REJECT_KG', visibilityContext) && <MetricCard title={`Reject Mass (${period})`} value={formatNumber(accumulatedStats?.rejectMass || 0)} unit="kg" icon={AlertTriangle} color="text-rose-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_REJECT_PERCENT', visibilityContext) && <MetricCard title="Reject %" value={formatNumber(machine.rejectRate)} unit="%" icon={AlertTriangle} color="text-rose-400" />}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-6">
                {isDataItemVisible(userRole, 'MACHINE_OUTPUT_TREND_CHART', visibilityContext) && (
                    <Card title={`Output vs Target Trend (${period})`}>
                         <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={timeSeriesData.output}>
                                <defs><linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 13}} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 13}} tickFormatter={(val) => formatNumber(val, 0)} />
                                <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '14px' }} />
                                <Legend />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOutput)" name="Actual (kg)" />
                                <Line type="step" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                )}
            </div>
        </div>
    );

    const renderPackingTab = () => {
        const { weigher, bagmaker } = machine;
        if (!weigher || !bagmaker) return <div className="p-4 text-slate-500">Packing data not available.</div>;

        return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                {/* Weigher Section */}
                <Card title="Multihead Weigher Status" className="bg-slate-900/30">
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                        {isDataItemVisible(userRole, 'PACKING_WEIGHER_SPEED', visibilityContext) && (
                            <MetricCard title="Speed" value={formatNumber(weigher.speed)} unit="ppm" icon={Zap} color="text-blue-400" />
                        )}
                        {isDataItemVisible(userRole, 'PACKING_WEIGHER_AVG_WEIGHT', visibilityContext) && (
                            <MetricCard title="Avg. Weight" value={formatNumber(weigher.averageWeight, 2)} unit="g" icon={Scale} color="text-emerald-400" />
                        )}
                        {isDataItemVisible(userRole, 'PACKING_WEIGHER_GIVEAWAY', visibilityContext) && (
                            <MetricCard title="Giveaway" value={formatNumber(weigher.giveaway, 2)} unit="%" icon={AlertTriangle} color="text-amber-400" />
                        )}
                        {isDataItemVisible(userRole, 'PACKING_WEIGHER_STD_DEV', visibilityContext) && (
                            <MetricCard title="Std. Deviation" value={formatNumber(weigher.standardDeviation, 3)} unit="g" icon={Activity} color="text-purple-400" />
                        )}
                    </div>
                </Card>

                {/* Bagmaker Section */}
                <Card title="Bagmaker Status" className="bg-slate-900/30">
                     <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                        {isDataItemVisible(userRole, 'PACKING_BAGMAKER_SPEED', visibilityContext) && (
                            <MetricCard title="Speed" value={formatNumber(bagmaker.speed)} unit="ppm" icon={Zap} color="text-blue-400" />
                        )}
                        {isDataItemVisible(userRole, 'PACKING_BAGMAKER_FILM', visibilityContext) && (
                            <MetricCard title="Film Remaining" value={formatNumber(bagmaker.filmRemaining, 1)} unit="%" icon={Film} color="text-cyan-400" />
                        )}
                        {isDataItemVisible(userRole, 'PACKING_BAGMAKER_SEAL_H', visibilityContext) && (
                            <MetricCard title="Seal Temp (H)" value={formatNumber(bagmaker.sealTempHorizontal)} unit="°C" icon={Thermometer} color="text-rose-400" />
                        )}
                        {isDataItemVisible(userRole, 'PACKING_BAGMAKER_SEAL_V', visibilityContext) && (
                           <MetricCard title="Seal Temp (V)" value={formatNumber(bagmaker.sealTempVertical)} unit="°C" icon={Thermometer} color="text-rose-400" />
                        )}
                    </div>
                </Card>
            </div>
        );
    };

    const renderProcessTab = () => {
        const params = machine.processParams || {};
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                    {Object.entries(params).map(([key, value]) => (
                        isDataItemVisible(userRole, `PARAM_${key.toUpperCase().replace(/\s/g,'_')}`, visibilityContext) && (
                            <Card key={key} className="flex flex-col justify-center items-center text-center p-6 bg-slate-800/50">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{key}</span>
                                <span className="text-2xl font-bold text-white font-mono">{typeof value === 'number' ? formatNumber(value) : value}</span>
                            </Card>
                        )
                    ))}
                </div>
                {isDataItemVisible(userRole, 'MACHINE_PROCESS_TREND_CHART', visibilityContext) && (
                    <Card title="Process Parameter Trend">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={timeSeriesData.params}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" tickFormatter={(val) => formatNumber(val, 0)} />
                                <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Legend />
                                <Line type="monotone" dataKey="temp" stroke="#f59e0b" name="Temp" dot={false} strokeWidth={2} />
                                <Line type="monotone" dataKey="pressure" stroke="#3b82f6" name="Pressure" dot={false} strokeWidth={2} />
                                <Line type="monotone" dataKey="speed" stroke="#10b981" name="Speed" dot={false} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                )}
            </div>
        );
    };

    const renderUtilityTab = () => {
        const util = accumulatedStats?.utility || { electricity: 0, steam: 0, water: 0, air: 0 };
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_ELECTRICITY', visibilityContext) && <MetricCard title={`Electricity (${period})`} value={formatNumber(util.electricity)} unit="kWh" icon={Zap} color="text-yellow-400" />}
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_STEAM', visibilityContext) && <MetricCard title={`Steam (${period})`} value={formatNumber(util.steam)} unit="kg" icon={Cloud} color="text-slate-200" />}
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_WATER', visibilityContext) && <MetricCard title={`Water (${period})`} value={formatNumber(util.water)} unit="m³" icon={Droplets} color="text-blue-400" />}
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_AIR', visibilityContext) && <MetricCard title={`Compressed Air (${period})`} value={formatNumber(util.air)} unit="Nm³" icon={Wind} color="text-cyan-400" />}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_ELEC_CHART', visibilityContext) && (
                        <Card title={`Electricity Consumption Trend (${period})`}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={timeSeriesData.utility.electricity}>
                                    <defs><linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" tickFormatter={(val) => formatNumber(val, 0)} />
                                    <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                    <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="url(#colorElec)" name="kWh" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    )}
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_STEAM_CHART', visibilityContext) && (
                        <Card title={`Steam Consumption Trend (${period})`}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={timeSeriesData.utility.steam}>
                                    <defs><linearGradient id="colorSteam" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3}/><stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" tickFormatter={(val) => formatNumber(val, 0)} />
                                    <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                    <Area type="monotone" dataKey="value" stroke="#94a3b8" fill="url(#colorSteam)" name="kg" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    )}
                </div>
            </div>
        );
    };

    const renderAlarmsTab = () => (
        isDataItemVisible(userRole, 'MACHINE_ALARM_HISTORY_TABLE', visibilityContext) && (
            <Card title="Alarm History" className="animate-in fade-in slide-in-from-bottom-2">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-slate-300">
                        <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-400">
                            <tr>
                                <th className="p-3">Time</th>
                                <th className="p-3">Severity</th>
                                <th className="p-3">Code</th>
                                <th className="p-3">Message</th>
                                <th className="p-3">Source</th>
                                <th className="p-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 text-sm">
                            {maintenanceService.getAlarmHistory(machine.id).map(alarm => (
                                <tr key={alarm.id} className="hover:bg-slate-800/50">
                                    <td className="p-3 font-mono">{alarm.timestamp}</td>
                                    <td className="p-3"><StatusBadge status={alarm.severity} /></td>
                                    <td className="p-3 font-mono">{alarm.code}</td>
                                    <td className="p-3 font-bold text-white">{alarm.message}</td>
                                    <td className="p-3 text-slate-400">{alarm.source}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${alarm.isActive ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                            {alarm.isActive ? 'Active' : 'Cleared'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        )
    );

    const renderDowntimeTab = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {canAddDowntime && isDataItemVisible(userRole, 'MACHINE_DOWNTIME_ADD_BTN', visibilityContext) && (
                <div className="flex justify-end">
                    <button 
                        onClick={() => setIsDowntimeModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md"
                    >
                        <Plus size={18} /> Add Downtime Event
                    </button>
                </div>
            )}

            {/* Modal for adding downtime */}
            {isDowntimeModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                            <h3 className="text-white font-bold text-lg flex items-center gap-2"><Clock size={20} className="text-blue-500" /> Log Downtime</h3>
                            <button onClick={() => setIsDowntimeModalOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddDowntimeSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Start Time</label>
                                    <input required type="time" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none" 
                                        value={newDowntime.start} onChange={e => setNewDowntime({...newDowntime, start: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">End Time</label>
                                    <input required type="time" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none" 
                                        value={newDowntime.end} onChange={e => setNewDowntime({...newDowntime, end: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Reason</label>
                                <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none"
                                    value={newDowntime.reason} onChange={e => setNewDowntime({...newDowntime, reason: e.target.value})}>
                                    <option value="Jam">Jam</option>
                                    <option value="Breakdown">Breakdown</option>
                                    <option value="Changeover">Changeover</option>
                                    <option value="Material">Material Shortage</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Quality Issue">Quality Issue</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Description</label>
                                <textarea required className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none h-24 resize-none" placeholder="Enter details..."
                                    value={newDowntime.description} onChange={e => setNewDowntime({...newDowntime, description: e.target.value})}></textarea>
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsDowntimeModalOpen(false)} className="px-4 py-2 rounded text-slate-400 hover:text-white font-bold transition-colors">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-colors flex items-center gap-2">
                                    <Save size={16} /> Save Log
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isDataItemVisible(userRole, 'MACHINE_DOWNTIME_LOGS_TABLE', visibilityContext) && (
                <Card title="Downtime Logs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-300">
                            <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-400">
                                <tr>
                                    <th className="p-3">Start</th>
                                    <th className="p-3">End</th>
                                    <th className="p-3">Duration</th>
                                    <th className="p-3">Reason</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 text-sm">
                                {downtimeLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-800/50">
                                        <td className="p-3 font-mono">{log.start}</td>
                                        <td className="p-3 font-mono">{log.end}</td>
                                        <td className="p-3 font-bold text-white">{log.duration}</td>
                                        <td className="p-3"><span className="bg-slate-700 px-2 py-1 rounded text-xs font-bold uppercase">{log.reason}</span></td>
                                        <td className="p-3 text-slate-400">{log.description}</td>
                                        <td className="p-3">
                                            <span className={`text-xs font-bold uppercase ${log.source === 'AUTO' ? 'text-blue-400' : 'text-yellow-400'}`}>{log.source}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );

    const renderMaintenanceTab = () => (
        <div ref={maintenanceRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {isDataItemVisible(userRole, 'MACHINE_MAINTENANCE_ACTIVE_ALARM', visibilityContext) && (
                <>
                    {/* 1. Active Alarm Section */}
                    {primaryAlarm ? (
                        <div className="bg-rose-900/20 border border-rose-500/50 rounded-xl p-5 shadow-inner">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-rose-500/20 rounded-full animate-pulse">
                                    <AlertTriangle className="text-rose-500" size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1">Active Alarm: {primaryAlarm.message}</h3>
                                    <div className="flex gap-4 text-sm text-rose-300 font-mono mb-4">
                                        <span>Code: {primaryAlarm.code}</span>
                                        <span>Time: {primaryAlarm.timestamp}</span>
                                        <span>Source: {primaryAlarm.source}</span>
                                    </div>

                                    {/* 2. Maintenance Action Form */}
                                    {canPerformMaintenance && isDataItemVisible(userRole, 'MACHINE_MAINTENANCE_FORM', visibilityContext) && (
                                        <div className="bg-slate-900/80 border border-slate-700 rounded-lg p-5 mt-4">
                                            <h4 className="text-white font-bold mb-4 flex items-center gap-2"><Wrench size={18} /> Maintenance Action</h4>
                                            
                                            {!primaryAlarm.inProgressBy ? (
                                                <form onSubmit={handleStartMaintenance} className="flex flex-col sm:flex-row gap-4 items-end">
                                                    <div className="flex-1 w-full">
                                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Technician Name</label>
                                                        <input 
                                                            type="text" 
                                                            required
                                                            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                                                            placeholder="Enter your name to start..."
                                                            value={startTechnicianName}
                                                            onChange={e => setStartTechnicianName(e.target.value)}
                                                        />
                                                    </div>
                                                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold transition-colors w-full sm:w-auto">
                                                        Start Maintenance
                                                    </button>
                                                </form>
                                            ) : (
                                                <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Checked By</label>
                                                            <input 
                                                                type="text" 
                                                                className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                                                                value={formCheckedBy}
                                                                onChange={e => setFormCheckedBy(e.target.value)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Status</label>
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input type="radio" checked={maintenanceSolved} onChange={() => setMaintenanceSolved(true)} className="accent-emerald-500 w-4 h-4"/>
                                                                    <span className="text-emerald-400 font-bold">Solved</span>
                                                                </label>
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input type="radio" checked={!maintenanceSolved} onChange={() => setMaintenanceSolved(false)} className="accent-rose-500 w-4 h-4"/>
                                                                    <span className="text-rose-400 font-bold">Pending</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Maintenance Note</label>
                                                        <textarea 
                                                            required
                                                            className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none h-24"
                                                            placeholder="Describe the action taken..."
                                                            value={maintenanceNote}
                                                            onChange={e => setMaintenanceNote(e.target.value)}
                                                        ></textarea>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <button type="button" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm"><Camera size={16} /> Attach Photo (Optional)</button>
                                                        <button disabled={formSubmitting} type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2 rounded-lg font-bold shadow-lg transition-all disabled:opacity-50">
                                                            {formSubmitting ? 'Saving...' : 'Submit & Clear Alarm'}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl text-center">
                            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                            <h3 className="text-xl font-bold text-white">All Systems Normal</h3>
                            <p className="text-emerald-400/80">No active alarms for this machine.</p>
                        </div>
                    )}
                </>
            )}

            {/* 3. Maintenance History Table */}
            {canViewHistory && isDataItemVisible(userRole, 'MACHINE_MAINTENANCE_HISTORY_TABLE', visibilityContext) && (
                <Card title="Maintenance History">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-300">
                            <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-400">
                                <tr>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Technician</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 text-sm">
                                {alarmHistory.length === 0 ? (
                                    <tr><td colSpan={4} className="p-4 text-center text-slate-500">No maintenance history recorded.</td></tr>
                                ) : alarmHistory.map(record => (
                                    <tr key={record.id} className="hover:bg-slate-800/50">
                                        <td className="p-3 font-mono text-slate-400">{record.timestamp}</td>
                                        <td className="p-3 font-bold text-white">{record.checkedBy}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${record.solved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {record.solved ? 'SOLVED' : 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-slate-300">{record.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300 relative w-full pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"><ArrowLeft size={24} /></button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">{machine.name}</h1>
                            <StatusBadge status={machine.status} />
                            {primaryAlarm && !primaryAlarm.inProgressBy && (
                                <div className="bg-rose-500/20 border border-rose-500/30 text-rose-400 px-3 py-1 rounded text-xs font-bold uppercase animate-pulse flex items-center gap-2">
                                    <AlertTriangle size={14} /> Maintenance Req
                                </div>
                            )}
                            {primaryAlarm && primaryAlarm.inProgressBy && (
                                <div className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1 rounded text-xs font-bold uppercase flex items-center gap-2">
                                    <Clock size={14} /> Maint: {primaryAlarm.inProgressBy}
                                </div>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm mt-0.5 font-medium">{machine.code} • {machine.type} • Plant {machine.plantId}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                    {/* Period Selector (Added for Report Context) */}
                    <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1">
                        <FilterButton label="Day" />
                        <FilterButton label="Week" />
                        <FilterButton label="Month" />
                        <FilterButton label="Year" />
                    </div>

                    {/* Download Button */}
                    {canDownloadReport && (
                        <button 
                            onClick={handleDownloadReport}
                            disabled={isDownloading}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
                        >
                            {isDownloading ? (
                                <Loader2 size={16} className="animate-spin text-blue-400" />
                            ) : (
                                <FileText size={16} className="text-blue-400 group-hover:text-blue-300" />
                            )}
                            <span className="hidden sm:inline">{isDownloading ? 'Export PDF' : 'Export PDF'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            {visibleTabs.length > 0 ? (
                <div className="border-b border-slate-700 overflow-x-auto">
                    <nav className="flex space-x-6 min-w-max">
                        {visibleTabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`py-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'}`}>
                                {tab.key}
                                {tab.key === 'Maintenance' && activeAlarms.length > 0 && (<span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>)}
                            </button>
                        ))}
                    </nav>
                </div>
            ) : (<div className="p-6 bg-slate-900 rounded-xl text-slate-400 text-center text-lg">No details available for your role.</div>)}

            {/* Content Area */}
            <div className="min-h-[500px] pt-2">
                {activeTab === 'Performance' && renderPerformanceTab()}
                {activeTab === 'Packing' && renderPackingTab()}
                {activeTab === 'Process' && renderProcessTab()}
                {activeTab === 'Utility' && renderUtilityTab()}
                {activeTab === 'Alarms' && renderAlarmsTab()}
                {activeTab === 'Downtime' && renderDowntimeTab()}
                {activeTab === 'Maintenance' && renderMaintenanceTab()}
            </div>

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-xl font-bold animate-in slide-in-from-bottom-5 fade-in z-50 flex items-center gap-2">
                    <CheckCircle2 size={20} /> Downtime Event Logged
                </div>
            )}

            {/* Download Success Toast */}
            {showDownloadToast && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl shadow-emerald-900/30 flex items-center gap-3 border border-emerald-500/50">
                        <div className="bg-white/20 p-1 rounded-full">
                            <CheckCircle2 size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Report Downloaded</p>
                            <p className="text-emerald-100 text-xs mt-0.5">{machine.code}_Performance_{period}.pdf</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MachineDetail;