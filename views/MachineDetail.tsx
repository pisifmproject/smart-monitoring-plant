
import React, { useState } from 'react';
import { Machine, MachineStatus, UserRole, MachineType, AlarmSeverity } from '../types';
import { Card, StatusBadge, MetricCard } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { 
    Activity, Gauge, Thermometer, Zap, AlertTriangle, Settings, ArrowLeft, 
    ClipboardPen, Wrench, X, Flame, Wind, Droplets, CheckCircle2, 
    Waves, Beaker, Fan, Cloud, Box, Clock
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, Cell, Legend, AreaChart, Area 
} from 'recharts';

interface MachineDetailProps {
    machine: Machine;
    onBack: () => void;
    userRole: UserRole;
}

const ALL_TABS = [
    { key: 'Performance', visibilityKey: 'MACHINE_TAB_PERFORMANCE' },
    { key: 'Process', visibilityKey: 'MACHINE_TAB_PROCESS' },
    { key: 'Utility', visibilityKey: 'MACHINE_TAB_UTILITY' },
    { key: 'Alarms', visibilityKey: 'MACHINE_TAB_ALARMS' },
    { key: 'Downtime', visibilityKey: 'MACHINE_TAB_DOWNTIME' },
    { key: 'Maintenance', visibilityKey: 'MACHINE_TAB_MAINTENANCE' }
];

// --- Mock Data Generators ---
const generateTimeSeries = (points: number, base: number, variance: number) => {
    return Array.from({ length: points }, (_, i) => ({
        time: `${8 + Math.floor(i / 2)}:${(i % 2) * 30 || '00'}`,
        value: Number((base + (Math.random() * variance * 2 - variance)).toFixed(1)),
        target: base
    }));
};

const outputTrendData = generateTimeSeries(16, 950, 100);
const rejectTrendData = generateTimeSeries(16, 25, 15); // kg reject
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

const alarmLogs = [
    { id: 101, start: '10:45:22', end: '-', severity: 'CRITICAL', code: 'E-404', msg: 'Motor Overload', source: 'Main Drive', ackBy: '-' },
    { id: 102, start: '09:12:10', end: '09:15:00', severity: 'WARNING', code: 'W-202', msg: 'Temp Deviation Zone 2', source: 'Zone 2 Heater', ackBy: 'Budi' },
    { id: 103, start: '08:05:00', end: '08:05:30', severity: 'INFO', code: 'I-100', msg: 'Machine Started', source: 'System', ackBy: 'Auto' },
];

const MachineDetail: React.FC<MachineDetailProps> = ({ machine, onBack, userRole }) => {
    const visibleTabs = ALL_TABS.filter(t => isDataItemVisible(userRole, t.visibilityKey));
    const [activeTab, setActiveTab] = useState(visibleTabs.length > 0 ? visibleTabs[0].key : '');
    const [showDowntimeModal, setShowDowntimeModal] = useState(false);
    const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

    // Permission Check
    const canAddDowntime = userRole === UserRole.OPERATOR;
    const canAddMaintenance = userRole === UserRole.MAINTENANCE;

    // --- Render Functions ---

    const renderPerformanceTab = () => (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 {isDataItemVisible(userRole, 'MACHINE_OEE') && <MetricCard title="OEE" value={(machine.oee * 100).toFixed(1)} unit="%" icon={Activity} color="text-emerald-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_AVAILABILITY') && <MetricCard title="Availability" value="92.5" unit="%" icon={Clock} color="text-blue-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_PERFORMANCE') && <MetricCard title="Performance" value="88.0" unit="%" icon={Zap} color="text-yellow-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_QUALITY') && <MetricCard title="Quality" value="99.2" unit="%" icon={CheckCircle2} color="text-purple-400" />}
                 
                 {isDataItemVisible(userRole, 'MACHINE_OUTPUT_KG_H') && <MetricCard title="Output Rate" value={machine.outputPerHour} unit="kg/h" icon={Box} />}
                 {isDataItemVisible(userRole, 'MACHINE_OUTPUT_SHIFT') && <MetricCard title="Shift Total" value={machine.totalOutputShift} unit="kg" icon={Box} />}
                 {isDataItemVisible(userRole, 'MACHINE_REJECT_KG') && <MetricCard title="Reject Mass" value={(machine.totalOutputShift * (machine.rejectRate/100)).toFixed(1)} unit="kg" icon={AlertTriangle} color="text-rose-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_REJECT_PERCENT') && <MetricCard title="Reject %" value={machine.rejectRate} unit="%" icon={AlertTriangle} color="text-rose-400" />}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
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
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
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
        // Context-aware Content
        switch(machine.type) {
            case MachineType.EXTRUDER:
                content = (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {isDataItemVisible(userRole, 'PARAM_SCREW_SPEED') && (
                            <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Screw Speed</p>
                                <p className="text-xl font-bold text-white">125 <span className="text-sm font-normal text-slate-400">RPM</span></p>
                            </div>
                        )}
                        {isDataItemVisible(userRole, 'PARAM_DIE_PRESSURE') && (
                            <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Die Pressure</p>
                                <p className="text-xl font-bold text-amber-400">45 <span className="text-sm font-normal text-slate-400">Bar</span></p>
                            </div>
                        )}
                        {isDataItemVisible(userRole, 'PARAM_FEEDER_SPEED') && (
                            <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Feeder Speed</p>
                                <p className="text-xl font-bold text-blue-400">45.5 <span className="text-sm font-normal text-slate-400">Hz</span></p>
                            </div>
                        )}
                        {isDataItemVisible(userRole, 'PARAM_PRODUCT_TEMP_OUT') && (
                            <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Product Temp</p>
                                <p className="text-xl font-bold text-rose-400">145 <span className="text-sm font-normal text-slate-400">°C</span></p>
                            </div>
                        )}
                        
                        <div className="col-span-2 md:col-span-4 bg-slate-900 p-3 rounded border border-slate-700">
                            <p className="text-slate-500 text-xs uppercase mb-2">Barrel Temperatures (Zones 1-6)</p>
                            <div className="flex justify-between gap-1">
                                {[
                                    { k: 'PARAM_BARREL_TEMP_ZONE1', v: 140 }, { k: 'PARAM_BARREL_TEMP_ZONE2', v: 142 }, 
                                    { k: 'PARAM_BARREL_TEMP_ZONE3', v: 145 }, { k: 'PARAM_BARREL_TEMP_ZONE4', v: 148 }, 
                                    { k: 'PARAM_BARREL_TEMP_ZONE5', v: 150 }, { k: 'PARAM_BARREL_TEMP_ZONE6', v: 148 }
                                ].map((z, i) => (
                                    isDataItemVisible(userRole, z.k) && (
                                        <div key={i} className="text-center w-full bg-slate-800 rounded py-1">
                                            <p className="text-[10px] text-slate-500">Z{i+1}</p>
                                            <p className="font-mono font-bold text-emerald-400">{z.v}</p>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                );
                break;
            case MachineType.FRYER:
                content = (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        {isDataItemVisible(userRole, 'PARAM_OIL_TEMP') && (
                            <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Oil Temp</p>
                                <p className="text-xl font-bold text-rose-400">178.5 <span className="text-sm font-normal text-slate-400">°C</span></p>
                            </div>
                        )}
                        {isDataItemVisible(userRole, 'PARAM_CONVEYOR_SPEED') && (
                            <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Conveyor Speed</p>
                                <p className="text-xl font-bold text-white">4.2 <span className="text-sm font-normal text-slate-400">m/min</span></p>
                            </div>
                        )}
                        {isDataItemVisible(userRole, 'PARAM_OIL_LEVEL') && (
                            <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Oil Level</p>
                                <p className="text-xl font-bold text-emerald-400">85 <span className="text-sm font-normal text-slate-400">%</span></p>
                            </div>
                        )}
                        {isDataItemVisible(userRole, 'PARAM_EXHAUST_TEMP') && (
                            <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Exhaust Temp</p>
                                <p className="text-xl font-bold text-amber-400">110 <span className="text-sm font-normal text-slate-400">°C</span></p>
                            </div>
                        )}
                        {isDataItemVisible(userRole, 'PARAM_STEAM_PRESSURE') && (
                            <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Steam Pressure</p>
                                <p className="text-xl font-bold text-slate-200">6.5 <span className="text-sm font-normal text-slate-400">Bar</span></p>
                            </div>
                        )}
                    </div>
                );
                break;
            default:
                content = (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {isDataItemVisible(userRole, 'PARAM_LINE_SPEED') && (
                             <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Line Speed</p>
                                <p className="text-xl font-bold text-white">{machine.lineSpeed} <span className="text-sm font-normal text-slate-400">RPM</span></p>
                            </div>
                        )}
                        {isDataItemVisible(userRole, 'PARAM_TEMPERATURE') && (
                            <div className="bg-slate-900 p-3 rounded border border-slate-700">
                                <p className="text-slate-500 text-xs uppercase">Temperature</p>
                                <p className="text-xl font-bold text-amber-400">{machine.temperature} <span className="text-sm font-normal text-slate-400">°C</span></p>
                            </div>
                        )}
                    </div>
                );
        }

        return (
            <div className="space-y-6">
                {content}
                
                {isDataItemVisible(userRole, 'MACHINE_CHART_PROCESS_TREND') && (
                    <Card title="Multi-Parameter Process Trend (24h)">
                         <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={multiParamData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis yAxisId="left" stroke="#94a3b8" />
                                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {isDataItemVisible(userRole, 'MACHINE_UTIL_ELECTRICITY') && <MetricCard title="Electricity" value="125" unit="kWh" icon={Zap} color="text-yellow-400" />}
                {isDataItemVisible(userRole, 'MACHINE_UTIL_STEAM') && <MetricCard title="Steam" value="210" unit="kg/h" icon={Cloud} color="text-slate-200" />}
                {isDataItemVisible(userRole, 'MACHINE_UTIL_WATER') && <MetricCard title="Water" value="4.2" unit="m³/h" icon={Droplets} color="text-blue-400" />}
                {isDataItemVisible(userRole, 'MACHINE_UTIL_AIR') && <MetricCard title="Comp. Air" value="35.5" unit="Nm³/h" icon={Wind} color="text-cyan-400" />}
                {isDataItemVisible(userRole, 'MACHINE_UTIL_NITROGEN') && <MetricCard title="Nitrogen" value="5.2" unit="m³/h" icon={Box} color="text-emerald-400" />}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isDataItemVisible(userRole, 'MACHINE_CHART_UTILITY_ELEC') && (
                     <Card title="Electricity Consumption">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={utilityElecData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                                <Area type="monotone" dataKey="value" stroke="#eab308" fill="#eab308" fillOpacity={0.3} name="kWh" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </Card>
                )}
                {isDataItemVisible(userRole, 'MACHINE_CHART_UTILITY_STEAM') && (
                     <Card title="Steam Consumption">
                        <ResponsiveContainer width="100%" height={250}>
                            <AreaChart data={utilitySteamData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                                <Area type="monotone" dataKey="value" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.3} name="kg/h" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </Card>
                )}
            </div>
        </div>
    );

    const renderAlarmsTab = () => (
        <Card title="Alarm History">
            {/* Mock Filters */}
            <div className="flex gap-4 mb-4 text-sm">
                <select className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-slate-300">
                    <option>All Severities</option>
                    <option>Critical</option>
                    <option>Warning</option>
                </select>
                <div className="flex items-center gap-2 text-slate-400">
                     <span>Last 24 Hours</span>
                </div>
            </div>

            {isDataItemVisible(userRole, 'MACHINE_ALARM_TABLE') && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-slate-900/50 uppercase tracking-wider text-xs">
                            <tr>
                                <th className="p-3">Start</th>
                                <th className="p-3">End</th>
                                <th className="p-3">Severity</th>
                                <th className="p-3">Code</th>
                                <th className="p-3">Message</th>
                                <th className="p-3">Source</th>
                                <th className="p-3">Ack By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {alarmLogs.map(alarm => (
                                <tr key={alarm.id} className="hover:bg-slate-800/30">
                                    <td className="p-3 font-mono">{alarm.start}</td>
                                    <td className="p-3 font-mono">{alarm.end}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                            alarm.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 
                                            alarm.severity === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                            'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        }`}>
                                            {alarm.severity}
                                        </span>
                                    </td>
                                    <td className="p-3 font-mono text-slate-300">{alarm.code}</td>
                                    <td className="p-3 text-white">{alarm.msg}</td>
                                    <td className="p-3">{alarm.source}</td>
                                    <td className="p-3 text-xs">{alarm.ackBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );

    const renderDowntimeTab = () => (
        <div className="space-y-6">
            {isDataItemVisible(userRole, 'MACHINE_KPI_DOWNTIME_SUMMARY') && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="flex flex-col items-center justify-center py-4 bg-slate-800">
                        <p className="text-slate-400 text-xs uppercase mb-1">Total Downtime Today</p>
                        <p className="text-3xl font-bold text-rose-400">90 <span className="text-base text-slate-500">min</span></p>
                    </Card>
                    <Card className="col-span-2 py-4 bg-slate-800">
                        <p className="text-slate-400 text-xs uppercase mb-2 pl-4">Top 3 Downtime Reasons</p>
                        <div className="flex gap-4 px-4">
                            <div className="flex-1 bg-slate-900 rounded p-2 border-l-4 border-rose-500">
                                <p className="text-white font-bold">Changeover</p>
                                <p className="text-xs text-slate-500">45 min</p>
                            </div>
                            <div className="flex-1 bg-slate-900 rounded p-2 border-l-4 border-amber-500">
                                <p className="text-white font-bold">No Material</p>
                                <p className="text-xs text-slate-500">30 min</p>
                            </div>
                            <div className="flex-1 bg-slate-900 rounded p-2 border-l-4 border-blue-500">
                                <p className="text-white font-bold">Jam</p>
                                <p className="text-xs text-slate-500">15 min</p>
                            </div>
                        </div>
                    </Card>
                 </div>
            )}

            <Card title="Downtime Logs">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2">
                         {/* Mock Filters */}
                         <button className="text-xs bg-slate-700 px-3 py-1 rounded text-slate-300">Today</button>
                         <button className="text-xs hover:bg-slate-800 px-3 py-1 rounded text-slate-500">Week</button>
                    </div>
                    {canAddDowntime && isDataItemVisible(userRole, 'MACHINE_DOWNTIME_FORM') && (
                        <button 
                            onClick={() => setShowDowntimeModal(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 shadow-lg shadow-rose-900/20"
                        >
                            <ClipboardPen size={14}/> Add Downtime
                        </button>
                    )}
                </div>
                {isDataItemVisible(userRole, 'MACHINE_DOWNTIME_TABLE') && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-900/50 uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="p-3">Start</th>
                                    <th className="p-3">End</th>
                                    <th className="p-3">Duration</th>
                                    <th className="p-3">Reason</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3">Source</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {downtimeLogs.map(dt => (
                                    <tr key={dt.id}>
                                        <td className="p-3 font-mono">{dt.start}</td>
                                        <td className="p-3 font-mono">{dt.end}</td>
                                        <td className="p-3 font-bold text-white">{dt.duration}</td>
                                        <td className="p-3 text-amber-400">{dt.reason}</td>
                                        <td className="p-3">{dt.desc}</td>
                                        <td className="p-3">
                                            <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${dt.source === 'AUTO' ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-blue-900/30 text-blue-400 border-blue-800'}`}>
                                                {dt.source}
                                            </span>
                                        </td>
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
        <div className="space-y-4">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Maintenance Notes</h3>
                {canAddMaintenance && (
                    <button 
                        onClick={() => setShowMaintenanceModal(true)}
                        className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-600/50 px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
                    >
                        <Wrench size={16} /> New Entry
                    </button>
                )}
            </div>
            <Card>
                <div className="text-center py-8 text-slate-500">
                    <CheckCircle2 size={48} className="mx-auto mb-2 opacity-20" />
                    <p>No open maintenance requests.</p>
                </div>
            </Card>
        </div>
    );

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
                    <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md text-sm font-medium shadow-lg shadow-blue-900/20">
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
                                {tab.key}
                            </button>
                        ))}
                    </nav>
                </div>
            ) : (
                <div className="p-4 bg-slate-900 rounded-lg text-slate-400 text-center">
                    No details available for your role.
                </div>
            )}

            {/* Content Area */}
            <div className="min-h-[500px]">
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
                    <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <ClipboardPen size={18} className="text-rose-400" /> Input Downtime
                            </h3>
                            <button onClick={() => setShowDowntimeModal(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); setShowDowntimeModal(false); alert("Saved!"); }} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Reason Code</label>
                                <select className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:border-blue-500 outline-none">
                                    <option>Select Reason...</option>
                                    <option>Machine Breakdown</option>
                                    <option>Material Empty</option>
                                    <option>Quality Reject</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Start Time</label>
                                    <input type="time" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">End Time</label>
                                    <input type="time" className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowDowntimeModal(false)} className="px-4 py-2 text-slate-300 hover:text-white text-sm">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Maintenance Log Modal (MAINTENANCE ONLY) */}
            {showMaintenanceModal && canAddMaintenance && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-w-md w-full animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-slate-800">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Wrench size={18} className="text-amber-400" /> Log Maintenance Note
                            </h3>
                            <button onClick={() => setShowMaintenanceModal(false)} className="text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={(e) => { e.preventDefault(); setShowMaintenanceModal(false); alert("Note Added!"); }} className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Note</label>
                                <textarea className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white h-32" placeholder="Describe findings..."></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowMaintenanceModal(false)} className="px-4 py-2 text-slate-300 hover:text-white text-sm">Cancel</button>
                                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium">Save Note</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MachineDetail;
