
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { LVMDP, UserRole } from '../types';
import { Card, StatusBadge, MetricCard, formatNumber } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { lvmdpService } from '../services/lvmdpService';
import { maintenanceService } from '../services/maintenanceService';
import { 
    ArrowLeft, Zap, Activity, Battery, Gauge, AlertTriangle, Clock, 
    Wrench, Camera, CheckCircle2, Save, FileText, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LVMDPDetailProps {
    lvmdp: LVMDP;
    onBack: () => void;
    userRole: UserRole;
}

type Period = 'Day' | 'Week' | 'Month' | 'Year';

const LVMDPDetail: React.FC<LVMDPDetailProps> = ({ lvmdp, onBack, userRole }) => {
    const [period, setPeriod] = useState<Period>('Day');
    const location = useLocation();
    const maintenanceSectionRef = useRef<HTMLDivElement>(null);
    const historySectionRef = useRef<HTMLDivElement>(null);
    
    // Download State
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDownloadToast, setShowDownloadToast] = useState(false);

    // Auto-scroll logic
    useEffect(() => {
        // If maintenance requested, scroll to form
        if (location.state?.initialTab === 'Maintenance' && maintenanceSectionRef.current) {
            maintenanceSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        // If alarms requested (for non-maintenance users), scroll to history
        else if (location.state?.initialTab === 'Alarms' && historySectionRef.current) {
            historySectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [location.state]);
    
    // Force re-render helper for mock service updates
    const [tick, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    // Visibility context only needs plantId (and machineId if applicable), not category
    const visibilityContext = { plantId: lvmdp.plantId };
    
    // Permissions
    const canDownloadReport = [UserRole.ADMINISTRATOR, UserRole.SUPERVISOR, UserRole.MANAGEMENT].includes(userRole);

    // Dynamic key generation based on panel ID (e.g. LVMDP-1 vs LVMDP-2)
    // Assumes code format "LVMDP-X"
    const visibilityKeys = useMemo(() => {
        const num = lvmdp.code.split('-')[1]; // "1", "2", "3", "4"
        const prefix = num === '1' ? 'LV' : `PANEL${num}`; // Backward compatibility for Panel 1 (LV_)
        
        return {
            KW: `${prefix}_KW`,
            KVA: `${prefix}_KVA`,
            KVAR: `${prefix}_KVAR`,
            PF: `${prefix}_PF`,
            VOLT_GROUP: `${prefix}_VOLT_GROUP`,
            CURRENT_LOAD_SECTION: `${prefix}_CURRENT_LOAD_SECTION`,
            POWER_METRICS_LIST: `${prefix}_POWER_METRICS_LIST`,
            ENERGY_TREND: `${prefix}_ENERGY_TREND`,
            SHIFT_DATA: `${prefix}_SHIFT_DATA`
        };
    }, [lvmdp.code]);

    const energyTrend = lvmdpService.getEnergyTrend(lvmdp.id, period);
    const shiftData = lvmdpService.getShiftAnalysis(lvmdp.id, period);
    const deltas = lvmdpService.getDeltas(lvmdp.id);

    const avgCurrent = (lvmdp.currentR + lvmdp.currentS + lvmdp.currentT) / 3;
    const maxCurrent = 2500;
    const loadPercent = (avgCurrent / maxCurrent) * 100;

    // Maintenance Data
    const activeAlarms = maintenanceService.getMachineActiveAlarms(lvmdp.id);
    const primaryAlarm = activeAlarms.length > 0 ? activeAlarms[0] : null;
    const hasActiveAlarm = activeAlarms.length > 0;
    const maintenanceUser = primaryAlarm?.inProgressBy;
    const alarmHistory = useMemo(() => maintenanceService.getMaintenanceHistory(lvmdp.id), [lvmdp.id, tick]);

    // Maintenance Form State
    const [startTechnicianName, setStartTechnicianName] = useState('');
    const [formCheckedBy, setFormCheckedBy] = useState('');
    const [maintenanceNote, setMaintenanceNote] = useState('');
    const [maintenanceSolved, setMaintenanceSolved] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);

    const canPerformMaintenance = userRole === UserRole.MAINTENANCE || userRole === UserRole.ADMINISTRATOR;

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
                machineId: lvmdp.id,
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

    const DeltaIndicator = ({ value }: { value: number }) => (
        <span className={`text-xs font-bold ${value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {value >= 0 ? '▲' : '▼'} {formatNumber(Math.abs(value))}%
        </span>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300 w-full pb-10 relative">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                                {lvmdp.name}
                            </h1>
                            <StatusBadge status={lvmdp.status} />
                            {hasActiveAlarm && !maintenanceUser && (
                                <div className="bg-rose-500/20 border border-rose-500/30 text-rose-400 px-3 py-1 rounded text-xs font-bold uppercase animate-pulse flex items-center gap-2">
                                    <AlertTriangle size={14} /> Maintenance Req
                                </div>
                            )}
                            {maintenanceUser && (
                                <div className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-3 py-1 rounded text-xs font-bold uppercase flex items-center gap-2">
                                    <Clock size={14} /> Maint: {maintenanceUser}
                                </div>
                            )}
                        </div>
                        <p className="text-slate-400 text-sm mt-0.5 font-medium">Power Distribution Panel</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
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

            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
                {isDataItemVisible(userRole, visibilityKeys.KW, visibilityContext) && (
                    <MetricCard 
                        title="Active Power" 
                        value={formatNumber(lvmdp.totalPowerKW)} 
                        unit="kW" 
                        icon={Zap} 
                        trend={`${formatNumber(Math.abs(deltas.kw))}%`} 
                        trendUp={deltas.kw > 0} 
                        color="text-yellow-400" 
                    />
                )}
                {isDataItemVisible(userRole, visibilityKeys.KVA, visibilityContext) && (
                    <MetricCard 
                        title="Apparent Power" 
                        value={formatNumber(lvmdp.totalPowerKVA)} 
                        unit="kVA" 
                        icon={Activity} 
                        trend={`${formatNumber(Math.abs(deltas.kva))}%`} 
                        trendUp={deltas.kva > 0} 
                        color="text-blue-400" 
                    />
                )}
                {isDataItemVisible(userRole, visibilityKeys.KVAR, visibilityContext) && (
                    <MetricCard 
                        title="Reactive Power" 
                        value={formatNumber(lvmdp.totalPowerKVAR)} 
                        unit="kVAR" 
                        icon={Battery} 
                        trend={`${formatNumber(Math.abs(deltas.kvar))}%`} 
                        trendUp={deltas.kvar > 0} 
                        color="text-purple-400" 
                    />
                )}
                {isDataItemVisible(userRole, visibilityKeys.PF, visibilityContext) && (
                    <MetricCard 
                        title="Power Factor" 
                        value={formatNumber(lvmdp.powerFactor)} 
                        icon={Gauge} 
                        trend={`${formatNumber(Math.abs(deltas.pf * 100))}%`} 
                        trendUp={deltas.pf > 0} 
                        color="text-emerald-400" 
                    />
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="space-y-6 xl:col-span-1">
                    {isDataItemVisible(userRole, visibilityKeys.VOLT_GROUP, visibilityContext) && (
                        <Card title="Voltage Metrics">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm"><span className="text-slate-400">Voltage R-S</span><div className="flex items-center gap-2"><span className="font-mono text-white font-bold">{formatNumber(lvmdp.voltageRS)} V</span> <DeltaIndicator value={deltas.v_rs} /></div></div>
                                <div className="flex justify-between items-center text-sm"><span className="text-slate-400">Voltage S-T</span><div className="flex items-center gap-2"><span className="font-mono text-white font-bold">{formatNumber(lvmdp.voltageST)} V</span> <DeltaIndicator value={deltas.v_st} /></div></div>
                                <div className="flex justify-between items-center text-sm"><span className="text-slate-400">Voltage T-R</span><div className="flex items-center gap-2"><span className="font-mono text-white font-bold">{formatNumber(lvmdp.voltageTR)} V</span> <DeltaIndicator value={deltas.v_tr} /></div></div>
                            </div>
                        </Card>
                    )}
                    {isDataItemVisible(userRole, visibilityKeys.CURRENT_LOAD_SECTION, visibilityContext) && (
                        <Card title="Current Load Usage">
                            <div className="space-y-3">
                                <div className="w-full bg-slate-700 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${loadPercent}%` }}></div>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-2xl font-bold text-white">{formatNumber(loadPercent)}%</span>
                                    <span className="text-sm text-slate-400 font-medium">Max: {formatNumber(maxCurrent)} A</span>
                                </div>
                                <p className="text-sm text-slate-400">Current: <span className="font-bold text-white font-mono">{formatNumber(avgCurrent)} A</span></p>
                            </div>
                        </Card>
                    )}
                     {isDataItemVisible(userRole, visibilityKeys.POWER_METRICS_LIST, visibilityContext) && (
                         <Card title="System Frequency">
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-white font-mono tracking-tighter">
                                        {formatNumber(lvmdp.frequency)}
                                    </span>
                                    <span className="text-slate-400 font-bold text-lg">Hz</span>
                                </div>
                                <div className="mt-2 text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    Stable
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                <div className="xl:col-span-2 space-y-6">
                    {isDataItemVisible(userRole, visibilityKeys.ENERGY_TREND, visibilityContext) && (
                        <Card title={`Energy Usage Trend (${period})`} className="min-h-[400px]">
                             <ResponsiveContainer width="100%" height={320}>
                                <AreaChart data={energyTrend}>
                                    <defs><linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} />
                                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(val) => formatNumber(val, 0)} />
                                    <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                    <Area type="monotone" dataKey="value" stroke="#f59e0b" fill="url(#colorEnergy)" name="Energy (kWh)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    )}
                </div>
            </div>

            {/* Shift Data Table - Moved outside grid to span full width */}
            {isDataItemVisible(userRole, visibilityKeys.SHIFT_DATA, visibilityContext) && (
                <Card title={`Shift Energy & Electrical Performance (${period})`}>
                    <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-slate-400 uppercase font-bold bg-slate-900/50">
                            <tr>
                                <th className="p-3 text-center">Shift</th>
                                <th className="p-3 text-center">Total kWh</th>
                                <th className="p-3 text-center">Avg Power (kW)</th>
                                <th className="p-3 text-center">Avg Load (%)</th>
                                <th className="p-3 text-center">Avg Current (A)</th>
                                <th className="p-3 text-center">Avg PF</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {shiftData.map(s => (
                                <tr key={s.name}>
                                    <td className="p-3 font-semibold text-white text-center">{s.name.split(' ')[1]}</td>
                                    <td className="p-3 font-mono text-yellow-400 text-center">{formatNumber(s.kwh)}</td>
                                    <td className="p-3 font-mono text-center">{formatNumber(s.avgPower)}</td>
                                    <td className="p-3 font-mono text-blue-400 text-center">{formatNumber(s.avgLoad)}</td>
                                    <td className="p-3 font-mono text-center">{formatNumber(s.avgCurrent)}</td>
                                    <td className="p-3 font-mono text-emerald-400 text-center">{formatNumber(s.avgPF)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </Card>
            )}

            {/* MAINTENANCE SECTION */}
            <div className="space-y-6" ref={maintenanceSectionRef}>
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mt-8">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><Wrench className="text-slate-400" /> Maintenance & Alarms</h2>
                </div>

                {primaryAlarm ? (
                    <div className="bg-rose-900/20 border border-rose-500/50 rounded-xl p-5 shadow-inner">
                        <div className="flex flex-col lg:flex-row items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-rose-500/20 rounded-full animate-pulse">
                                        <AlertTriangle className="text-rose-500" size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Active Alarm: {primaryAlarm.message}</h3>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-rose-300 font-mono mb-4 pl-1">
                                    <span>Code: {primaryAlarm.code}</span>
                                    <span>Time: {primaryAlarm.timestamp}</span>
                                    <span>Severity: {primaryAlarm.severity}</span>
                                </div>
                            </div>

                            {/* Maintenance Action Form */}
                            {canPerformMaintenance && (
                                <div className="w-full lg:w-[500px] bg-slate-900/80 border border-slate-700 rounded-lg p-5">
                                    <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide border-b border-slate-800 pb-2">Action Required</h4>
                                    
                                    {!primaryAlarm.inProgressBy ? (
                                        <form onSubmit={handleStartMaintenance} className="space-y-3">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Technician Name</label>
                                                <input 
                                                    type="text" 
                                                    required
                                                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                                                    placeholder="Enter your name..."
                                                    value={startTechnicianName}
                                                    onChange={e => setStartTechnicianName(e.target.value)}
                                                />
                                            </div>
                                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-bold transition-colors flex items-center justify-center gap-2">
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
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <label className="flex items-center gap-2 cursor-pointer bg-slate-800 px-3 py-1.5 rounded border border-slate-700 hover:border-emerald-500 transition-colors">
                                                            <input type="radio" checked={maintenanceSolved} onChange={() => setMaintenanceSolved(true)} className="accent-emerald-500 w-4 h-4"/>
                                                            <span className="text-emerald-400 font-bold text-xs uppercase">Solved</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer bg-slate-800 px-3 py-1.5 rounded border border-slate-700 hover:border-rose-500 transition-colors">
                                                            <input type="radio" checked={!maintenanceSolved} onChange={() => setMaintenanceSolved(false)} className="accent-rose-500 w-4 h-4"/>
                                                            <span className="text-rose-400 font-bold text-xs uppercase">Pending</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Maintenance Note</label>
                                                <textarea 
                                                    required
                                                    className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-white focus:border-blue-500 outline-none h-20 text-sm"
                                                    placeholder="Describe action taken..."
                                                    value={maintenanceNote}
                                                    onChange={e => setMaintenanceNote(e.target.value)}
                                                ></textarea>
                                            </div>
                                            <button disabled={formSubmitting} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                                {formSubmitting ? 'Saving...' : <><Save size={16}/> Submit Report</>}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                     <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-xl text-center flex flex-col items-center justify-center min-h-[150px]">
                        <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
                        <h3 className="text-lg font-bold text-white">System Healthy</h3>
                        <p className="text-emerald-400/60 text-sm">No active alarms on this panel.</p>
                    </div>
                )}

                <div ref={historySectionRef}>
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
                                        <tr><td colSpan={4} className="p-6 text-center text-slate-500 italic">No maintenance history recorded for this panel.</td></tr>
                                    ) : alarmHistory.map(record => (
                                        <tr key={record.id} className="hover:bg-slate-800/50">
                                            <td className="p-3 font-mono text-slate-400">{record.timestamp}</td>
                                            <td className="p-3 font-bold text-white">{record.checkedBy}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${record.solved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
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
                </div>
            </div>

            {/* Download Success Toast */}
            {showDownloadToast && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl shadow-emerald-900/30 flex items-center gap-3 border border-emerald-500/50">
                        <div className="bg-white/20 p-1 rounded-full">
                            <CheckCircle2 size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Report Downloaded</p>
                            <p className="text-emerald-100 text-xs mt-0.5">{lvmdp.code}_Report_{period}.pdf</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LVMDPDetail;
