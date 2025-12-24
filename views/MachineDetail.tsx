
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Machine, UserRole, MachineType, PlantCode, BagmakerDetails, WeigherDetails, Alarm, MachineStatus } from '../types';
import { Card, StatusBadge, MetricCard, formatNumber } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { maintenanceService } from '../services/maintenanceService';
import { plantService as ps } from '../services/plantService'; 
import { 
    Activity, Zap, AlertTriangle, ArrowLeft, 
    Wrench, CheckCircle2, 
    Wind, Droplets, Cloud, Box, Clock, Save, FileText, Loader2,
    Thermometer, Gauge, TrendingUp, ScanSearch, Scissors, LayoutDashboard, Settings2, Waves, Droplet, Layers,
    Target as TargetIcon, Power, Package, ChevronRight, ActivitySquare
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend
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

// --- Professional Corporate Instrument Component ---
const Instrument: React.FC<{ 
    label: string; 
    value: string | number; 
    unit?: string; 
    stpt?: string | number; 
    color?: string; 
    status?: string;
    subValue?: string;
    compact?: boolean;
}> = ({ label, value, unit, stpt, color = "text-blue-400", status, subValue, compact = false }) => (
    <div className={`bg-slate-900/60 border border-slate-800 rounded-lg transition-all hover:bg-slate-800/80 ${compact ? 'p-2' : 'p-3'}`}>
        <div className="flex justify-between items-start mb-1.5">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider truncate mr-2">{label}</span>
            {status && (
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                    ['AUTO', 'ON', 'ENABLED', 'FRESH'].includes(status) 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-slate-700/50 text-slate-400 border-slate-600'
                }`}>
                    {status}
                </span>
            )}
        </div>
        <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
                <span className={`text-xl font-mono font-bold tracking-tight drop-shadow-sm ${color}`}>{value}</span>
                {unit && <span className="text-[9px] font-bold text-slate-400 uppercase">{unit}</span>}
            </div>
            {subValue && <span className="text-[10px] font-mono font-bold text-slate-300">{subValue}</span>}
        </div>
        {stpt !== undefined && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-800/50 flex justify-between items-center">
                <span className="text-[8px] font-bold text-slate-600 uppercase">Setpoint</span>
                <span className="text-[10px] font-mono font-bold text-slate-400">{stpt}</span>
            </div>
        )}
    </div>
);

// --- PC39 PROCESS DASHBOARD (EXACT HMI REPLICA RE-REDESIGN) ---
const PC39FryerDashboard: React.FC<{ machine: Machine }> = ({ machine }) => {
    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* 1. COMPACT TOP HEADER */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl px-6 py-4 shadow-2xl flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                    <div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Product</span>
                        <span className="text-lg font-black text-white tracking-widest">WAVY</span>
                    </div>
                    <div className="h-10 w-px bg-slate-800"></div>
                    <div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Current Login</span>
                        <span className="text-sm font-bold text-blue-400">OPERATOR</span>
                    </div>
                </div>
                
                <div className="flex-1 flex justify-center">
                    <div className="flex flex-col items-center">
                        <div className="px-6 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md mb-1">
                            <span className="text-sm font-black text-emerald-400 tracking-[0.2em] flex items-center gap-2">
                                <Power size={14}/> NORMAL MODE
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">PLC Comms OK</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Status</span>
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[9px] font-black uppercase tracking-wider">MOISTURE AUTO</span>
                            <span className="text-2xl font-mono font-bold text-blue-400">1.94</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. THREE-COLUMN INDUSTRIAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* COLUMN 1: PREP / SLICING */}
                <div className="space-y-4">
                    <div className="bg-[#0f172a] border border-slate-800 border-t-4 border-t-emerald-500 rounded-xl p-4 shadow-lg flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/50">
                            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                                <Layers size={14} className="text-emerald-500" /> Prep / Slicing Systems
                            </h3>
                        </div>
                        <div className="space-y-2.5">
                            <Instrument label="Feed From Crates" value="ON" status="ON" color="text-emerald-400" />
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="p-2.5 bg-slate-900/50 rounded-lg border border-slate-800">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase">Peeler</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-emerald-500"></div>)}
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-400">ACTIVE</span>
                                </div>
                                <Instrument label="Potato Prep" value="AUTO" status="AUTO" compact />
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <Instrument label="Slicers" value="AUTO" status="AUTO" compact />
                                <Instrument label="Washer Drives" value="AUTO" status="AUTO" compact />
                            </div>
                            <Instrument label="Potato Feed" value="ON" status="ENABLED" color="text-emerald-400" subValue="(to Slicers)" />
                            <Instrument label="Slicers Incline" value="23.0" unit="%" color="text-white" />
                            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                                <span className="text-[9px] font-extrabold text-slate-500 uppercase mb-2 block tracking-wider">Slicer Gates</span>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {[1, 2, 3, 4].map(g => (
                                        <div key={g} className="text-center bg-emerald-500/10 text-emerald-400 py-1.5 rounded-md border border-emerald-500/20 font-black text-xs">{g}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-auto pt-2">
                                <Instrument label="Head Temp" value="39" unit="deg" color="text-amber-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: FLUID & THERMAL */}
                <div className="space-y-4 flex flex-col">
                    {/* Oil Flow Control */}
                    <div className="bg-[#0f172a] border border-slate-800 border-t-4 border-t-cyan-500 rounded-xl p-4 shadow-lg">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-800/50 flex items-center gap-2">
                            <Waves size={14} className="text-cyan-400" /> Oil Flow Control
                        </h3>
                        <Instrument label="Main Oil Circ" value="4,357" unit="L/M" stpt="4,366" status="AUTO" color="text-cyan-400" subValue="Ctrl: 97" />
                    </div>

                    {/* Fryer Inlet Temp Control */}
                    <div className="bg-[#0f172a] border border-slate-800 border-t-4 border-t-amber-500 rounded-xl p-4 shadow-lg flex-1">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-800/50 flex items-center gap-2">
                            <Thermometer size={14} className="text-amber-400" /> Fryer Inlet Temp Control
                        </h3>
                        <div className="space-y-2.5">
                            <Instrument label="Fryer Inlet" value="178.1" unit="°C" stpt="178.8" status="AUTO" color="text-amber-400" />
                            <Instrument label="Fryer Outlet" value="154.0" unit="°C" color="text-blue-400" />
                            <div className="grid grid-cols-2 gap-2.5">
                                <Instrument label="Delta T" value="24.0" unit="°C" color="text-slate-200" compact />
                                <Instrument label="Burner Output" value="43.7" unit="%" color="text-rose-500" compact />
                            </div>
                        </div>
                    </div>

                    {/* Oil Make-Up */}
                    <div className="bg-[#0f172a] border border-slate-800 border-t-4 border-t-emerald-500 rounded-xl p-4 shadow-lg">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-800/50 flex items-center gap-2">
                            <Droplet size={14} className="text-emerald-400" /> Oil Make-up
                        </h3>
                        <div className="space-y-2.5">
                            <div className="grid grid-cols-2 gap-2.5">
                                <Instrument label="Used Oil %" value="0" color="text-slate-400" compact />
                                <Instrument label="New Oil %" value="100" color="text-emerald-400" compact />
                            </div>
                            <Instrument label="Oil Level" value="148" unit="MM" stpt="151" status="FRESH" color="text-emerald-400" />
                            <Instrument label="Valve Output" value="54.5" unit="%" status="AUTO" color="text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* COLUMN 3: MOISTURE, QUALITY & DRIVES */}
                <div className="space-y-4 flex flex-col">
                    {/* Moisture Control */}
                    <div className="bg-[#0f172a] border border-slate-800 border-t-4 border-t-blue-500 rounded-xl p-4 shadow-lg">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-800/50 flex items-center gap-2">
                            <Cloud size={14} className="text-blue-400" /> Moisture Control
                        </h3>
                        <div className="space-y-2.5">
                            <Instrument label="Actual Moisture" value="1.94" unit="%" stpt="1.35" status="ENABLED" color="text-white" />
                            <Instrument label="Actual Oil" value="27.1" unit="%" stpt="35.0" color="text-amber-400" />
                        </div>
                    </div>

                    {/* Fryer Drives / Other Systems */}
                    <div className="bg-[#0f172a] border border-slate-800 border-t-4 border-t-slate-500 rounded-xl p-4 shadow-lg flex-1">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-800/50 flex items-center gap-2">
                            <Settings2 size={14} className="text-slate-400" /> Other Systems / Drives
                        </h3>
                        <div className="space-y-3">
                            <Instrument label="Master Speed" value="70.0" unit="%" status="AUTO" color="text-emerald-400" subValue="Lim: 76/64" />
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    {l: 'Paddle', v: '41%'},
                                    {l: 'Submerger', v: '51%'},
                                    {l: 'Take-out', v: '45%'}
                                ].map(d => (
                                    <div key={d.l} className="p-2 bg-slate-900/50 border border-slate-800 rounded text-center">
                                        <div className="text-[7px] text-slate-500 font-black uppercase mb-0.5">{d.l}</div>
                                        <div className="text-xs text-white font-bold">{d.v}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <Instrument label="Fryer Outfeed" value="AUTO" status="AUTO" compact />
                                <Instrument label="Take-Out Conv" value="ON" status="ENABLED" color="text-emerald-400" compact />
                            </div>
                            <Instrument label="Post Fryer" value="AUTO" status="AUTO" />
                        </div>
                    </div>

                    {/* Quality Specs */}
                    <div className="bg-[#0f172a] border border-slate-800 border-t-4 border-t-indigo-500 rounded-xl p-4 shadow-lg">
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-4 pb-2 border-b border-slate-800/50 flex items-center gap-2">
                            <Package size={14} className="text-indigo-400" /> Quality Specs
                        </h3>
                        <div className="grid grid-cols-2 gap-2.5">
                            <Instrument label="Slice Thick" value="1.750" color="text-white" />
                            <Instrument label="Potato Solids" value="20.0" unit="%" color="text-slate-300" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Standard generic horizontal dashboard for non-PC39 machines ---
const HorizontalProcessDashboard: React.FC<{ machine: Machine }> = ({ machine }) => {
    const horizontalData = {
        speed: { actual: 125, target: 130, infeed: 14.5 },
        sealing: { finLeft: 145.2, finRight: 144.8, finStpt: 145.0, finPressure: 3.2, endFront: 162.5, endRear: 161.9, endStpt: 162.0, endPressure: 4.5 },
        material: { tension: 12.4, offset: 0.25, regMark: 'OK', filmLeft: 68 },
        gas: { n2Flow: 25.4, o2Level: 0.8, pressure: 1.2 }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Motion Control" className="bg-slate-800/40">
                    <div className="grid grid-cols-2 gap-3">
                        <Instrument label="Machine Speed" value={horizontalData.speed.actual} unit="PPM" stpt={horizontalData.speed.target} color="text-emerald-400" />
                        <Instrument label="Infeed Speed" value={horizontalData.speed.infeed} unit="M/M" />
                    </div>
                </Card>
                <Card title="Sealing System" className="bg-slate-800/40">
                    <div className="grid grid-cols-2 gap-3">
                        <Instrument label="Fin Temp" value={horizontalData.sealing.finLeft} unit="°C" stpt={horizontalData.sealing.finStpt} color="text-amber-400" />
                        <Instrument label="Jaw Temp" value={horizontalData.sealing.endFront} unit="°C" stpt={horizontalData.sealing.endStpt} color="text-rose-400" />
                    </div>
                </Card>
                <Card title="Film Control" className="bg-slate-800/40">
                    <div className="grid grid-cols-2 gap-3">
                        <Instrument label="Reg. Offset" value={horizontalData.material.offset} unit="MM" color="text-blue-400" />
                        <Instrument label="Eye-mark" value={horizontalData.material.regMark} color="text-emerald-400" status="OK" />
                    </div>
                </Card>
            </div>
        </div>
    );
};

// --- ISO Standard Overview Component (Shared) ---
const MachineISOOverview: React.FC<{ machine: Machine; period: Period }> = ({ machine, period }) => {
    const timeSeriesData = useMemo(() => ps.getMachineTimeSeries(machine.id, period), [machine.id, period]);
    const activeAlarms = maintenanceService.getMachineActiveAlarms(machine.id);
    const topAlarms = activeAlarms.slice(0, 3);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={120} className="text-blue-500" /></div>
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Equipment Effectiveness</h3>
                            <div className="flex items-end gap-3 mb-4">
                                <span className={`text-6xl font-bold font-mono tracking-tighter ${machine.oee >= 0.85 ? 'text-emerald-400' : machine.oee >= 0.65 ? 'text-amber-400' : 'text-rose-400'}`}>
                                    {formatNumber(machine.oee * 100, 1)}%
                                </span>
                                <span className="text-sm text-slate-400 font-medium mb-2 bg-slate-800/80 px-2 py-1 rounded border border-slate-700">ISO 22400-2</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
                            <div><span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Availability</span><span className="text-2xl font-bold text-blue-400">{formatNumber((machine.availability || 0.9) * 100)}%</span></div>
                            <div><span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Performance</span><span className="text-2xl font-bold text-purple-400">{formatNumber((machine.performance || 0.85) * 100)}%</span></div>
                            <div><span className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Quality</span><span className="text-2xl font-bold text-emerald-400">{formatNumber((machine.quality || 0.99) * 100)}%</span></div>
                        </div>
                    </div>
                </Card>

                <Card className="flex flex-col justify-between relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Box size={120} className="text-white" /></div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Box size={16}/> Production Volume</h3>
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="text-4xl font-bold text-white font-mono">{formatNumber(machine.totalOutputShift)}</span>
                            <span className="text-sm text-slate-400 font-medium">Target: {formatNumber(machine.targetShift)} kg</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-4 mb-2 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${machine.totalOutputShift >= machine.targetShift * 0.9 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(100, (machine.totalOutputShift / machine.targetShift) * 100)}%` }}></div>
                        </div>
                        <div className="text-right"><span className={`text-sm font-bold ${machine.totalOutputShift >= machine.targetShift * 0.9 ? 'text-emerald-400' : 'text-amber-400'}`}>{formatNumber((machine.totalOutputShift / machine.targetShift) * 100, 1)}% Attainment</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-700/50">
                        <div className="bg-slate-900/50 p-3 rounded-lg"><p className="text-[10px] uppercase font-bold text-slate-500">Run Rate</p><p className="text-xl font-bold text-white">{formatNumber(machine.outputPerHour)} <span className="text-xs text-slate-500 font-normal">kg/h</span></p></div>
                        <div className="bg-slate-900/50 p-3 rounded-lg"><p className="text-[10px] uppercase font-bold text-slate-500">Reject Rate</p><p className="text-xl font-bold text-rose-400">{formatNumber(machine.rejectRate)}<span className="text-xs text-slate-500 font-normal">%</span></p></div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

// --- Summary Dashboard for Management/Viewer ---
const MachineSummaryDashboard: React.FC<{ machine: Machine; period: Period; onBack: () => void; }> = ({ machine, period, onBack }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 w-full pb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-300 hover:text-white"><ArrowLeft size={24} /></button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><LayoutDashboard className="text-blue-500" />{machine.name}</h1>
                        <p className="text-slate-400 text-sm font-medium">{machine.plantId} • Executive Summary</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={machine.status} />
                    <div className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-bold text-slate-300 uppercase tracking-wider">ISO 22400 Standard</div>
                </div>
            </div>
            <MachineISOOverview machine={machine} period={period} />
        </div>
    );
};

const MachineDetail: React.FC<MachineDetailProps> = ({ machine, onBack, userRole, currentUser }) => {
    const location = useLocation();
    const visibilityContext = { plantId: machine.plantId, machineId: machine.id };
    const [period, setPeriod] = useState<Period>('Day');

    if (userRole === UserRole.MANAGEMENT || userRole === UserRole.VIEWER) {
        return <MachineSummaryDashboard machine={machine} period={period} onBack={onBack} />;
    }

    const visibleTabs = useMemo(() => ALL_TABS_BASE.filter(t => isDataItemVisible(userRole, t.visibilityKey, visibilityContext)), [userRole, visibilityContext]);
    const [activeTab, setActiveTab] = useState(() => {
        const requestedTab = location.state?.initialTab;
        if (requestedTab && visibleTabs.find(t => t.key === requestedTab)) return requestedTab;
        return visibleTabs.length > 0 ? visibleTabs[0].key : '';
    });

    const [isDownloading, setIsDownloading] = useState(false);
    const [showDownloadToast, setShowDownloadToast] = useState(false);
    const maintenanceRef = useRef<HTMLDivElement>(null);
    const [tick, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    const timeSeriesData = useMemo(() => ps.getMachineTimeSeries(machine.id, period), [machine.id, period]);
    const accumulatedStats = useMemo(() => ps.getMachineStats(machine.id, period), [machine.id, period]);
    const alarmHistory = useMemo(() => maintenanceService.getAlarmHistory(machine.id), [machine.id, tick]);
    const maintenanceHistoryRecords = useMemo(() => maintenanceService.getMaintenanceHistory(machine.id), [machine.id, tick]);
    const activeAlarms = maintenanceService.getMachineActiveAlarms(machine.id);
    const downtimeLogs = useMemo(() => maintenanceService.getDowntimeLogs(machine.id), [machine.id, tick]);
    const primaryAlarm = activeAlarms.length > 0 ? activeAlarms[0] : null;

    const [startTechnicianName, setStartTechnicianName] = useState('');
    const [formCheckedBy, setFormCheckedBy] = useState('');
    const [maintenanceNote, setMaintenanceNote] = useState('');
    const [maintenanceSolved, setMaintenanceSolved] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);

    const handleMaintenanceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!primaryAlarm || !formCheckedBy.trim()) return;
        setFormSubmitting(true);
        setTimeout(() => {
            maintenanceService.submitMaintenanceAction({ alarmId: primaryAlarm.id, machineId: machine.id, checkedBy: formCheckedBy, solved: maintenanceSolved, note: maintenanceNote });
            setFormSubmitting(false);
            setMaintenanceNote('');
            setStartTechnicianName('');
            setFormCheckedBy('');
            forceUpdate();
        }, 800);
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Performance': return <MachineISOOverview machine={machine} period={period} />;
            case 'Process': return (machine.name.toUpperCase().includes('PC39') || machine.code.includes('PC39')) ? <PC39FryerDashboard machine={machine} /> : <HorizontalProcessDashboard machine={machine} />;
            case 'Packing': return <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-3xl">Packing analytics module.</div>;
            case 'Utility': 
                const util = accumulatedStats?.utility || { electricity: 0, steam: 0, water: 0, air: 0 };
                return (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard title="Electricity" value={formatNumber(util.electricity)} unit="kWh" icon={Zap} color="text-yellow-400" />
                        <MetricCard title="Steam" value={formatNumber(util.steam)} unit="kg" icon={Cloud} color="text-slate-200" />
                        <MetricCard title="Water" value={formatNumber(util.water)} unit="m³" icon={Droplets} color="text-blue-400" />
                        <MetricCard title="Air" value={formatNumber(util.air)} unit="Nm³" icon={Wind} color="text-cyan-400" />
                    </div>
                );
            case 'Alarms': 
                return (
                    <Card title="Alarm History">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="text-xs text-slate-300 uppercase font-bold bg-slate-900/50"><tr><th className="p-3">Time</th><th className="p-3">Code</th><th className="p-3">Message</th><th className="p-3 text-right">Status</th></tr></thead>
                                <tbody className="divide-y divide-slate-800">
                                    {alarmHistory.map(alarm => (
                                        <tr key={alarm.id} className="hover:bg-slate-800/50 transition-colors"><td className="p-3 text-slate-400 font-mono">{alarm.timestamp}</td><td className="p-3 font-mono text-xs">{alarm.code}</td><td className="p-3 font-bold text-white">{alarm.message}</td><td className="p-3 text-right"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${alarm.isActive ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{alarm.isActive ? 'ACTIVE' : 'CLEARED'}</span></td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                );
            case 'Downtime': return <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-3xl">Downtime diagnostics module.</div>;
            case 'Maintenance': 
                return (
                    <div className="space-y-6">
                        {primaryAlarm ? (
                            <Card className="border-rose-500/30 bg-rose-500/5 shadow-xl">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><AlertTriangle className="text-rose-500" /> {primaryAlarm.message}</h3>
                                        <div className="text-sm text-slate-400">Alarm Code: <span className="font-mono text-rose-400 font-bold">{primaryAlarm.code}</span> • Triggered at {primaryAlarm.timestamp}</div>
                                    </div>
                                    <form onSubmit={handleMaintenanceSubmit} className="space-y-4 w-full md:w-[450px]">
                                        <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-xl space-y-4">
                                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Technician Response</label>
                                            <input value={formCheckedBy} onChange={e => setFormCheckedBy(e.target.value)} required placeholder="Employee ID / Name" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm focus:border-blue-500 outline-none transition-all" />
                                            <textarea value={maintenanceNote} onChange={e => setMaintenanceNote(e.target.value)} required placeholder="Correction action details..." className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm h-28 focus:border-blue-500 outline-none transition-all" />
                                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group">
                                                <Save size={18} className="group-hover:scale-110 transition-transform" /> Submit Maintenance Log
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Card>
                        ) : (
                            <div className="p-20 text-center flex flex-col items-center gap-4 bg-slate-900/30 rounded-3xl border border-dashed border-slate-800 shadow-inner">
                                <CheckCircle2 size={56} className="text-emerald-500/20" />
                                <span className="text-slate-500 font-black uppercase tracking-[0.3em] text-sm">Plant Systems Integral</span>
                            </div>
                        )}
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 w-full pb-10 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-300 hover:text-white"><ArrowLeft size={24} /></button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-white tracking-tighter uppercase">{machine.name}</h1>
                            <StatusBadge status={machine.status} />
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-0.5">{machine.plantId} • {machine.type} INFRASTRUCTURE</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                    <div className="bg-slate-900 border border-slate-800 p-1 rounded-lg flex gap-1 shadow-inner">
                        {['Day', 'Week', 'Month', 'Year'].map(l => (
                            <button key={l} onClick={() => setPeriod(l as Period)} className={`px-4 py-1.5 text-[10px] font-black rounded-md uppercase tracking-widest transition-all ${period === l ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>{l}</button>
                        ))}
                    </div>
                    {([UserRole.ADMINISTRATOR, UserRole.SUPERVISOR, UserRole.MANAGEMENT].includes(userRole)) && <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"><FileText size={14} className="text-blue-500" /> Export PDF</button>}
                </div>
            </div>
            
            <div className="border-b border-slate-800"><nav className="-mb-px flex space-x-8 overflow-x-auto">{visibleTabs.map(tab => (<button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'}`}>{tab.key}</button>))}</nav></div>
            
            <div className="mt-8">{renderActiveTab()}</div>
        </div>
    );
};

export default MachineDetail;
