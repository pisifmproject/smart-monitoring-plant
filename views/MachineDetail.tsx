
import React, { useState } from 'react';
import { Machine, MachineStatus, UserRole, MachineType } from '../types';
import { Card, StatusBadge, MetricCard } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { maintenanceService } from '../services/maintenanceService';
import { 
    Activity, Zap, AlertTriangle, ArrowLeft, 
    ClipboardPen, Wrench, X, CheckCircle2, 
    Wind, Droplets, Cloud, Box, Clock, Camera
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, AreaChart, Area, Legend 
} from 'recharts';

interface MachineDetailProps {
    machine: Machine;
    onBack: () => void;
    userRole: UserRole;
    currentUser: string; // Used ONLY for role/permission logic, NOT for data entry
}

const ALL_TABS = [
    { key: 'Performance', visibilityKey: 'MACHINE_TAB_PERFORMANCE' },
    { key: 'Process', visibilityKey: 'MACHINE_TAB_PROCESS' },
    { key: 'Utility', visibilityKey: 'MACHINE_TAB_UTILITY' },
    { key: 'Alarms', visibilityKey: 'MACHINE_TAB_ALARMS' },
    { key: 'Downtime', visibilityKey: 'MACHINE_TAB_DOWNTIME' },
    { key: 'Maintenance', visibilityKey: 'MACHINE_TAB_MAINTENANCE' }
];

// --- Mock Data Generators (kept from previous version) ---
const generateTimeSeries = (points: number, base: number, variance: number) => {
    return Array.from({ length: points }, (_, i) => ({
        time: `${8 + Math.floor(i / 2)}:${(i % 2) * 30 || '00'}`,
        value: Number((base + (Math.random() * variance * 2 - variance)).toFixed(1)),
        target: base
    }));
};

const outputTrendData = generateTimeSeries(16, 950, 100);
const rejectTrendData = generateTimeSeries(16, 25, 15);
const multiParamData = Array.from({ length: 16 }, (_, i) => ({
    time: `${8 + Math.floor(i / 2)}:${(i % 2) * 30 || '00'}`,
    temp: 140 + Math.random() * 10,
    pressure: 40 + Math.random() * 5,
    speed: 80 + Math.random() * 2
}));

const utilityElecData = generateTimeSeries(24, 150, 20);
const utilitySteamData = generateTimeSeries(24, 500, 50);

const downtimeLogs = [
    { id: 1, start: '10:15:00', end: '10:30:00', duration: '15m', reason: 'Jam', desc: 'Infeed blockage', source: 'AUTO' },
    { id: 2, start: '08:00:00', end: '08:45:00', duration: '45m', reason: 'Changeover', desc: 'Product change', source: 'MANUAL' },
    { id: 3, start: 'Yesterday', end: 'Yesterday', duration: '30m', reason: 'No Material', desc: 'Waiting for raw mat', source: 'MANUAL' },
];

const MachineDetail: React.FC<MachineDetailProps> = ({ machine, onBack, userRole, currentUser }) => {
    const visibleTabs = ALL_TABS.filter(t => isDataItemVisible(userRole, t.visibilityKey));
    const [activeTab, setActiveTab] = useState(visibleTabs.length > 0 ? visibleTabs[0].key : '');
    const [showDowntimeModal, setShowDowntimeModal] = useState(false);
    
    // Force Update for Service Changes
    const [tick, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    // Maintenance Service Data
    const activeAlarms = maintenanceService.getMachineActiveAlarms(machine.id);
    const maintenanceHistory = maintenanceService.getMaintenanceHistory(machine.id);
    const primaryAlarm = activeAlarms.length > 0 ? activeAlarms[0] : null;

    // Maintenance Form State
    const [startTechnicianName, setStartTechnicianName] = useState('');
    const [formCheckedBy, setFormCheckedBy] = useState('');
    const [maintenanceNote, setMaintenanceNote] = useState('');
    const [maintenanceSolved, setMaintenanceSolved] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);

    // Permission Check
    const canAddDowntime = userRole === UserRole.OPERATOR;
    const canPerformMaintenance = userRole === UserRole.MAINTENANCE;
    const canViewHistory = [UserRole.ADMINISTRATOR, UserRole.SUPERVISOR].includes(userRole);

    const handleStartMaintenance = (e: React.FormEvent) => {
        e.preventDefault();
        if (!primaryAlarm || !startTechnicianName.trim()) return;
        
        maintenanceService.startMaintenance(primaryAlarm.id, startTechnicianName);
        setFormCheckedBy(startTechnicianName); // Pre-fill form with the name used to start
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
                checkedBy: formCheckedBy, // Uses manual input, NOT currentUser
                solved: maintenanceSolved,
                note: maintenanceNote,
                photoUrl: '' 
            });
            setFormSubmitting(false);
            setMaintenanceNote('');
            setStartTechnicianName('');
            setFormCheckedBy('');
            forceUpdate();
            alert('Maintenance Record Saved. Alarm Cleared.');
        }, 800);
    };

    // --- Render Functions ---

    const renderPerformanceTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                 {isDataItemVisible(userRole, 'MACHINE_OEE') && <MetricCard title="OEE" value={(machine.oee * 100).toFixed(1)} unit="%" icon={Activity} color="text-emerald-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_AVAILABILITY') && <MetricCard title="Availability" value="92.5" unit="%" icon={Clock} color="text-blue-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_PERFORMANCE') && <MetricCard title="Performance" value="88.0" unit="%" icon={Zap} color="text-yellow-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_QUALITY') && <MetricCard title="Quality" value="99.2" unit="%" icon={CheckCircle2} color="text-purple-400" />}
                 
                 {isDataItemVisible(userRole, 'MACHINE_OUTPUT_KG_H') && <MetricCard title="Output Rate" value={machine.outputPerHour} unit="kg/h" icon={Box} />}
                 {isDataItemVisible(userRole, 'MACHINE_OUTPUT_SHIFT') && <MetricCard title="Shift Total" value={machine.totalOutputShift} unit="kg" icon={Box} />}
                 {isDataItemVisible(userRole, 'MACHINE_REJECT_KG') && <MetricCard title="Reject Mass" value={(machine.totalOutputShift * (machine.rejectRate/100)).toFixed(1)} unit="kg" icon={AlertTriangle} color="text-rose-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_REJECT_PERCENT') && <MetricCard title="Reject %" value={machine.rejectRate} unit="%" icon={AlertTriangle} color="text-rose-400" />}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-6">
                {isDataItemVisible(userRole, 'MACHINE_OUTPUT_TREND_CHART') && (
                    <Card title="Output vs Target Trend">
                         <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={outputTrendData}>
                                <defs>
                                    <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 13}} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 13}} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '14px' }} />
                                <Legend />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOutput)" name="Actual (kg)" />
                                <Line type="step" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                )}
                {isDataItemVisible(userRole, 'MACHINE_REJECT_TREND_CHART') && (
                    <Card title="Reject Rate Trend">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={rejectTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 13}} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 13}} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '14px' }} />
                                <Bar dataKey="value" fill="#f43f5e" name="Reject (kg)" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                )}
            </div>
        </div>
    );

    const renderProcessTab = () => {
        let content = null;
        switch(machine.type) {
            case MachineType.EXTRUDER:
                content = (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-6">
                        {isDataItemVisible(userRole, 'PARAM_SCREW_SPEED') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Screw Speed</p><p className="text-2xl font-bold text-white mt-1">125 <span className="text-sm font-normal text-slate-400">RPM</span></p></div>}
                        {isDataItemVisible(userRole, 'PARAM_DIE_PRESSURE') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Die Pressure</p><p className="text-2xl font-bold text-amber-400 mt-1">45 <span className="text-sm font-normal text-slate-400">Bar</span></p></div>}
                        {isDataItemVisible(userRole, 'PARAM_FEEDER_SPEED') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Feeder Speed</p><p className="text-2xl font-bold text-blue-400 mt-1">45.5 <span className="text-sm font-normal text-slate-400">Hz</span></p></div>}
                        {isDataItemVisible(userRole, 'PARAM_PRODUCT_TEMP_OUT') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Product Temp</p><p className="text-2xl font-bold text-rose-400 mt-1">145 <span className="text-sm font-normal text-slate-400">°C</span></p></div>}
                        
                        <div className="col-span-full bg-slate-900 p-4 rounded-lg border border-slate-700">
                            <p className="text-slate-500 text-xs font-semibold uppercase mb-3 tracking-wide">Barrel Temperatures (Zones 1-6)</p>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                {[{ k: 'PARAM_BARREL_TEMP_ZONE1', v: 140 }, { k: 'PARAM_BARREL_TEMP_ZONE2', v: 142 }, { k: 'PARAM_BARREL_TEMP_ZONE3', v: 145 }, { k: 'PARAM_BARREL_TEMP_ZONE4', v: 148 }, { k: 'PARAM_BARREL_TEMP_ZONE5', v: 150 }, { k: 'PARAM_BARREL_TEMP_ZONE6', v: 148 }].map((z, i) => (
                                    isDataItemVisible(userRole, z.k) && (
                                        <div key={i} className="text-center w-full bg-slate-800 rounded-lg py-2.5"><p className="text-[11px] font-bold text-slate-500 uppercase">Z{i+1}</p><p className="font-mono font-bold text-lg text-emerald-400 mt-0.5">{z.v}</p></div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                );
                break;
            case MachineType.FRYER:
                content = (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-6">
                        {isDataItemVisible(userRole, 'PARAM_OIL_TEMP') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Oil Temp</p><p className="text-2xl font-bold text-rose-400 mt-1">178.5 <span className="text-sm font-normal text-slate-400">°C</span></p></div>}
                        {isDataItemVisible(userRole, 'PARAM_CONVEYOR_SPEED') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Conveyor Speed</p><p className="text-2xl font-bold text-white mt-1">4.2 <span className="text-sm font-normal text-slate-400">m/min</span></p></div>}
                        {isDataItemVisible(userRole, 'PARAM_OIL_LEVEL') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Oil Level</p><p className="text-2xl font-bold text-emerald-400 mt-1">85 <span className="text-sm font-normal text-slate-400">%</span></p></div>}
                        {isDataItemVisible(userRole, 'PARAM_EXHAUST_TEMP') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Exhaust Temp</p><p className="text-2xl font-bold text-amber-400 mt-1">110 <span className="text-sm font-normal text-slate-400">°C</span></p></div>}
                        {isDataItemVisible(userRole, 'PARAM_STEAM_PRESSURE') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Steam Pressure</p><p className="text-2xl font-bold text-slate-200 mt-1">6.5 <span className="text-sm font-normal text-slate-400">Bar</span></p></div>}
                    </div>
                );
                break;
            default:
                content = (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5 mb-6">
                        {isDataItemVisible(userRole, 'PARAM_LINE_SPEED') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Line Speed</p><p className="text-2xl font-bold text-white mt-1">{machine.lineSpeed} <span className="text-sm font-normal text-slate-400">RPM</span></p></div>}
                        {isDataItemVisible(userRole, 'PARAM_TEMPERATURE') && <div className="bg-slate-900 p-4 rounded-lg border border-slate-700"><p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Temperature</p><p className="text-2xl font-bold text-amber-400 mt-1">{machine.temperature} <span className="text-sm font-normal text-slate-400">°C</span></p></div>}
                    </div>
                );
        }

        return (
            <div className="space-y-6">
                {content}
                {isDataItemVisible(userRole, 'MACHINE_CHART_PROCESS_TREND') && (
                    <Card title="Multi-Parameter Process Trend (24h)">
                         <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={multiParamData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 13}} />
                                <YAxis yAxisId="left" stroke="#94a3b8" tick={{fontSize: 13}} />
                                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tick={{fontSize: 13}} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '14px' }} />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#f43f5e" name="Temp (°C)" dot={false} strokeWidth={2} />
                                <Line yAxisId="right" type="monotone" dataKey="pressure" stroke="#f59e0b" name="Pressure (Bar)" dot={false} strokeWidth={2} />
                                <Line yAxisId="left" type="monotone" dataKey="speed" stroke="#3b82f6" name="Speed (RPM)" dot={false} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                )}
            </div>
        );
    };

    const renderUtilityTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                {isDataItemVisible(userRole, 'MACHINE_UTIL_ELECTRICITY') && <MetricCard title="Electricity" value="125" unit="kWh" icon={Zap} color="text-yellow-400" />}
                {isDataItemVisible(userRole, 'MACHINE_UTIL_STEAM') && <MetricCard title="Steam" value="210" unit="kg/h" icon={Cloud} color="text-slate-200" />}
                {isDataItemVisible(userRole, 'MACHINE_UTIL_WATER') && <MetricCard title="Water" value="4.2" unit="m³/h" icon={Droplets} color="text-blue-400" />}
                {isDataItemVisible(userRole, 'MACHINE_UTIL_AIR') && <MetricCard title="Comp. Air" value="35.5" unit="Nm³/h" icon={Wind} color="text-cyan-400" />}
                {isDataItemVisible(userRole, 'MACHINE_UTIL_NITROGEN') && <MetricCard title="Nitrogen" value="5.2" unit="m³/h" icon={Box} color="text-emerald-400" />}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-6">
                {isDataItemVisible(userRole, 'MACHINE_CHART_UTILITY_ELEC') && (
                     <Card title="Electricity Consumption">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={utilityElecData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 13}} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 13}} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '14px' }} />
                                <Area type="monotone" dataKey="value" stroke="#eab308" fill="#eab308" fillOpacity={0.3} name="kWh" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </Card>
                )}
                {isDataItemVisible(userRole, 'MACHINE_CHART_UTILITY_STEAM') && (
                     <Card title="Steam Consumption">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={utilitySteamData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 13}} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 13}} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '14px' }} />
                                <Area type="monotone" dataKey="value" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.3} name="kg/h" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </Card>
                )}
            </div>
        </div>
    );

    const renderAlarmsTab = () => (
        <Card title="Active Alarms">
            {isDataItemVisible(userRole, 'MACHINE_ALARM_LIST') && (
                <div className="overflow-x-auto">
                    {activeAlarms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                             <CheckCircle2 size={48} className="text-emerald-500 mb-2 opacity-50"/>
                             <p className="text-base font-medium">No active alarms. Machine is healthy.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-slate-300">
                            <thead className="bg-slate-900/50 uppercase tracking-wider text-sm font-bold text-slate-400">
                                <tr>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Severity</th>
                                    <th className="p-3">Code</th>
                                    <th className="p-3">Message</th>
                                    <th className="p-3">Source</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 text-base">
                                {activeAlarms.map(alarm => (
                                    <tr key={alarm.id} className="hover:bg-slate-800/30">
                                        <td className="p-3 font-mono">{alarm.timestamp}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${
                                                alarm.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 
                                                alarm.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                                'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                            }`}>
                                                {alarm.severity}
                                            </span>
                                        </td>
                                        <td className="p-3 font-mono font-semibold text-slate-300">{alarm.code}</td>
                                        <td className="p-3 text-white font-medium">{alarm.message}</td>
                                        <td className="p-3 text-sm uppercase">{alarm.source}</td>
                                        <td className="p-3">
                                            {alarm.inProgressBy ? (
                                                <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">IN PROGRESS</span>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">OPEN</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </Card>
    );

    const renderDowntimeTab = () => (
        <div className="space-y-6">
            {isDataItemVisible(userRole, 'MACHINE_KPI_DOWNTIME_SUMMARY') && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Card className="flex flex-col items-center justify-center py-5 bg-slate-800">
                        <p className="text-slate-400 text-xs font-bold uppercase mb-1">Total Downtime Today</p>
                        <p className="text-3xl font-bold text-rose-400">90 <span className="text-sm text-slate-500 font-medium">min</span></p>
                    </Card>
                    <Card className="col-span-2 py-5 bg-slate-800">
                        <p className="text-slate-400 text-xs font-bold uppercase mb-3 pl-3">Top 3 Downtime Reasons</p>
                        <div className="flex gap-5 px-3">
                            <div className="flex-1 bg-slate-900 rounded-lg p-2.5 border-l-4 border-rose-500"><p className="text-white font-bold text-base">Changeover</p><p className="text-sm text-slate-500 font-medium">45 min</p></div>
                            <div className="flex-1 bg-slate-900 rounded-lg p-2.5 border-l-4 border-amber-500"><p className="text-white font-bold text-base">No Material</p><p className="text-sm text-slate-500 font-medium">30 min</p></div>
                            <div className="flex-1 bg-slate-900 rounded-lg p-2.5 border-l-4 border-blue-500"><p className="text-white font-bold text-base">Jam</p><p className="text-sm text-slate-500 font-medium">15 min</p></div>
                        </div>
                    </Card>
                 </div>
            )}

            <Card title="Downtime Logs">
                 <div className="flex justify-between items-center mb-5">
                    <div className="flex gap-2">
                         <button className="text-xs font-bold bg-slate-700 px-3 py-1.5 rounded text-slate-300">Today</button>
                         <button className="text-xs font-bold hover:bg-slate-800 px-3 py-1.5 rounded text-slate-500">Week</button>
                    </div>
                    {canAddDowntime && isDataItemVisible(userRole, 'MACHINE_DOWNTIME_FORM') && (
                        <button 
                            onClick={() => setShowDowntimeModal(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-rose-900/20 transition-all"
                        >
                            <ClipboardPen size={16}/> Add Downtime
                        </button>
                    )}
                </div>
                {isDataItemVisible(userRole, 'MACHINE_DOWNTIME_TABLE') && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-300">
                            <thead className="bg-slate-900/50 uppercase tracking-wider text-sm font-bold text-slate-400">
                                <tr>
                                    <th className="p-3">Start</th>
                                    <th className="p-3">End</th>
                                    <th className="p-3">Duration</th>
                                    <th className="p-3">Reason</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 text-base">
                                {downtimeLogs.map(dt => (
                                    <tr key={dt.id}>
                                        <td className="p-3 font-mono">{dt.start}</td>
                                        <td className="p-3 font-mono">{dt.end}</td>
                                        <td className="p-3 font-bold text-white">{dt.duration}</td>
                                        <td className="p-3 text-amber-400 font-medium">{dt.reason}</td>
                                        <td className="p-3">{dt.desc}</td>
                                        <td className="p-3"><span className={`text-xs font-bold uppercase px-2 py-0.5 rounded border ${dt.source === 'AUTO' ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-blue-900/30 text-blue-400 border-blue-800'}`}>{dt.source}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );

    const renderMaintenanceTab = () => (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Wrench size={20}/> Maintenance Workflow</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Active Alarm & Form */}
                <div className="space-y-6">
                    <Card title="Active Alarm Details">
                         {primaryAlarm ? (
                            <div className="bg-rose-900/20 border border-rose-500/30 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-rose-400 text-lg flex items-center gap-2"><AlertTriangle size={20}/> {primaryAlarm.severity}</span>
                                    <span className="text-slate-400 font-mono text-sm">{primaryAlarm.timestamp}</span>
                                </div>
                                <h4 className="text-white text-xl font-bold mb-1">{primaryAlarm.message}</h4>
                                <p className="text-slate-400 text-sm">Code: {primaryAlarm.code} | Source: {primaryAlarm.source}</p>
                                {primaryAlarm.inProgressBy && (
                                     <div className="mt-3 bg-blue-500/10 border border-blue-500/30 p-2 rounded flex items-center gap-2">
                                        <Wrench size={16} className="text-blue-400"/>
                                        <span className="text-sm font-bold text-blue-300">
                                            Work in Progress by: <span className="text-white uppercase">{primaryAlarm.inProgressBy}</span>
                                        </span>
                                     </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500 bg-slate-900/50 rounded-lg">
                                <CheckCircle2 size={40} className="mx-auto mb-2 text-emerald-500 opacity-50"/>
                                <p>No Active Alarms requiring maintenance.</p>
                            </div>
                        )}
                    </Card>

                    {/* Step 1: Start Maintenance (Manual Name Entry) */}
                    {isDataItemVisible(userRole, 'MAINTENANCE_FORM') && primaryAlarm && !primaryAlarm.inProgressBy && canPerformMaintenance && (
                        <Card title="Start Maintenance" className="border-t-4 border-t-yellow-500">
                            <form onSubmit={handleStartMaintenance} className="space-y-4">
                                <div className="bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20 mb-4">
                                    <p className="text-yellow-200 text-sm">Please identify yourself to begin work on this alarm.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Technician Name (Manual Entry)</label>
                                    <input 
                                        type="text" 
                                        value={startTechnicianName}
                                        onChange={(e) => setStartTechnicianName(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none font-medium"
                                        placeholder="Type your name here..."
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-yellow-900/20 transition-all flex justify-center items-center gap-2"
                                >
                                    <Wrench size={18}/> Start Maintenance
                                </button>
                            </form>
                        </Card>
                    )}

                    {/* Step 2: Complete Maintenance Form */}
                    {isDataItemVisible(userRole, 'MAINTENANCE_FORM') && primaryAlarm && primaryAlarm.inProgressBy && canPerformMaintenance && (
                        <Card title="Maintenance Action Form" className="border-t-4 border-t-blue-500">
                             <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Checked By (Manual Entry)</label>
                                    <input 
                                        type="text" 
                                        value={formCheckedBy || primaryAlarm.inProgressBy} 
                                        onChange={(e) => setFormCheckedBy(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-medium focus:border-blue-500 outline-none" 
                                        placeholder="Technician name..."
                                        required
                                    />
                                    <p className="text-xs text-slate-500 mt-1">* Confirm or edit your name</p>
                                </div>
                                
                                <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-slate-700">
                                    <span className="text-sm font-bold text-white">Problem Solved?</span>
                                    <button 
                                        type="button"
                                        onClick={() => setMaintenanceSolved(!maintenanceSolved)}
                                        className={`w-12 h-6 rounded-full relative transition-colors ${maintenanceSolved ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                    >
                                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${maintenanceSolved ? 'left-7' : 'left-1'}`}></span>
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Maintenance Note</label>
                                    <textarea 
                                        value={maintenanceNote}
                                        onChange={(e) => setMaintenanceNote(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white h-24 text-sm focus:border-blue-500 outline-none" 
                                        placeholder="Describe the action taken..."
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                     <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Evidence (Optional)</label>
                                     <button type="button" className="w-full border-2 border-dashed border-slate-700 rounded-lg py-3 text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-colors flex items-center justify-center gap-2 text-sm font-bold">
                                        <Camera size={16}/> Upload Photo
                                     </button>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={formSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all flex justify-center items-center gap-2"
                                >
                                    {formSubmitting ? 'Saving...' : <><CheckCircle2 size={18}/> Submit & Clear Alarm</>}
                                </button>
                             </form>
                        </Card>
                    )}
                </div>

                {/* Right: History */}
                <div>
                     {isDataItemVisible(userRole, 'MAINTENANCE_HISTORY') && canViewHistory && (
                        <Card title="Maintenance History" className="h-full">
                            <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left text-slate-300">
                                    <thead className="bg-slate-900 uppercase tracking-wider text-xs font-bold text-slate-400 sticky top-0">
                                        <tr>
                                            <th className="p-3">Time</th>
                                            <th className="p-3">Technician</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Note</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800 text-sm">
                                        {maintenanceHistory.length === 0 ? (
                                             <tr><td colSpan={4} className="p-8 text-center text-slate-500">No history found.</td></tr>
                                        ) : maintenanceHistory.map((rec) => (
                                            <tr key={rec.id} className="hover:bg-slate-800/50">
                                                <td className="p-3 font-mono text-xs">{rec.timestamp}</td>
                                                <td className="p-3 font-semibold text-white">{rec.checkedBy}</td>
                                                <td className="p-3">
                                                    {rec.solved ? (
                                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">Solved</span>
                                                    ) : (
                                                        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase">Pending</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-slate-400 italic">{rec.note}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                     )}
                     
                     {/* For Maintenance Role, show only their own recent entries based on checking name match roughly or just simplified view */}
                     {!canViewHistory && (
                         <Card title="Recent Activity">
                             <div className="space-y-4">
                                {maintenanceHistory.slice(0, 5).map(rec => (
                                    <div key={rec.id} className="border-b border-slate-800 pb-2 last:border-0">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-mono text-slate-500">{rec.timestamp}</span>
                                            <span className="text-xs font-bold text-slate-300">{rec.checkedBy}</span>
                                        </div>
                                        <p className="text-sm text-slate-300 mt-1">{rec.note}</p>
                                    </div>
                                ))}
                                {maintenanceHistory.length === 0 && (
                                    <p className="text-slate-500 italic p-4 text-center">No recent maintenance activity.</p>
                                )}
                             </div>
                         </Card>
                     )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300 relative w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                            {machine.name}
                            <StatusBadge status={machine.status} />
                        </h1>
                        <p className="text-slate-400 text-sm mt-0.5 font-medium">{machine.code} • {machine.type} • Plant {machine.plantId}</p>
                    </div>
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
                                className={`py-3 px-1 border-b-2 font-bold text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${
                                    activeTab === tab.key
                                        ? 'border-blue-500 text-blue-400'
                                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                                }`}
                            >
                                {tab.key}
                                {tab.key === 'Maintenance' && activeAlarms.length > 0 && (
                                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            ) : (
                <div className="p-6 bg-slate-900 rounded-xl text-slate-400 text-center text-lg">
                    No details available for your role.
                </div>
            )}

            {/* Content Area */}
            <div className="min-h-[500px] pt-2">
                {activeTab === 'Performance' && renderPerformanceTab()}
                {activeTab === 'Process' && renderProcessTab()}
                {activeTab === 'Utility' && renderUtilityTab()}
                {activeTab === 'Alarms' && renderAlarmsTab()}
                {activeTab === 'Downtime' && renderDowntimeTab()}
                {activeTab === 'Maintenance' && renderMaintenanceTab()}
            </div>

             {/* Downtime Input Modal (OPERATOR ONLY) */}
             {showDowntimeModal && canAddDowntime && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <ClipboardPen size={20} className="text-rose-400" /> Input Downtime
                            </h3>
                            <button onClick={() => setShowDowntimeModal(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); setShowDowntimeModal(false); alert("Saved!"); }} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Reason Code</label>
                                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:border-blue-500 outline-none text-sm">
                                    <option>Select Reason...</option>
                                    <option>Machine Breakdown</option>
                                    <option>Material Empty</option>
                                    <option>Quality Reject</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">Start Time</label>
                                    <input type="time" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5">End Time</label>
                                    <input type="time" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white text-sm" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowDowntimeModal(false)} className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MachineDetail;
