
import React, { useState } from 'react';
import { LVMDP, UserRole } from '../types';
import { Card, StatusBadge, MetricCard } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { ArrowLeft, Zap, Activity, Battery, Gauge, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface LVMDPDetailProps {
    lvmdp: LVMDP;
    onBack: () => void;
    userRole: UserRole;
}

type Period = 'Day' | 'Week' | 'Month' | 'Year';

const LVMDPDetail: React.FC<LVMDPDetailProps> = ({ lvmdp, onBack, userRole }) => {
    const [period, setPeriod] = useState<Period>('Day');

    // Scaling Factor based on Period
    const periodMultiplier = period === 'Day' ? 1 : period === 'Week' ? 7 : period === 'Month' ? 30 : 365;

    // Mock trend data for Energy
    const points = period === 'Day' ? 24 : period === 'Week' ? 7 : period === 'Month' ? 30 : 12;
    const labels = period === 'Day' ? (i:number) => `${i}:00` : period === 'Week' ? (i:number) => ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i] : period === 'Month' ? (i:number) => `D${i+1}` : (i:number) => `M${i+1}`;
    
    const energyTrend = Array.from({ length: points }, (_, i) => ({
        time: labels(i),
        value: lvmdp.totalPowerKW * (0.6 + Math.random() * 0.4) * periodMultiplier * (period === 'Day' ? 1 : 24) / points // rough dist
    }));

    // Derived values for new layout
    const avgCurrent = (lvmdp.currentR + lvmdp.currentS + lvmdp.currentT) / 3;
    const maxCurrent = 2500;
    const loadPercent = (avgCurrent / maxCurrent) * 100;
    
    // Mock Deltas (vs Yesterday)
    const deltas = {
        kw: 2.4,
        kva: -1.1,
        kvar: 0.7,
        pf: -0.2,
        v_rs: 0.1,
        v_st: 0.0,
        v_tr: -0.2
    };

    // Shift Data Mock - Enhanced with Electrical Performance and New Timings
    const shiftData = [
        { 
            name: 'Shift 1 (07:01 - 14:30)', 
            kwh: lvmdp.energyToday * 0.45 * periodMultiplier, 
            avgPower: lvmdp.totalPowerKW * 0.9, 
            avgLoad: Math.min(100, loadPercent * 1.1),
            avgCurrent: avgCurrent * 1.1,
            avgPF: 0.96 
        },
        { 
            name: 'Shift 2 (14:31 - 22:00)', 
            kwh: lvmdp.energyToday * 0.35 * periodMultiplier, 
            avgPower: lvmdp.totalPowerKW * 0.75, 
            avgLoad: loadPercent * 0.8,
            avgCurrent: avgCurrent * 0.8,
            avgPF: 0.94 
        },
        { 
            name: 'Shift 3 (22:01 - 07:00)', 
            kwh: lvmdp.energyToday * 0.20 * periodMultiplier, 
            avgPower: lvmdp.totalPowerKW * 0.4, 
            avgLoad: loadPercent * 0.5,
            avgCurrent: avgCurrent * 0.5,
            avgPF: 0.92 
        },
    ];

    const FilterButton = ({ label }: { label: Period }) => (
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

    return (
        <div className="space-y-6 animate-in fade-in duration-300 w-full">
             {/* Header */}
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                            {lvmdp.name}
                            <StatusBadge status={lvmdp.status} />
                        </h1>
                        <p className="text-slate-400 text-sm mt-0.5 font-medium">Power Distribution Panel</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1 self-end sm:self-auto">
                    <FilterButton label="Day" />
                    <FilterButton label="Week" />
                    <FilterButton label="Month" />
                    <FilterButton label="Year" />
                </div>
            </div>

            {/* High-Level KPIs */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
                {isDataItemVisible(userRole, 'LV_KW') && (
                    <MetricCard 
                        title="Active Power" 
                        value={lvmdp.totalPowerKW.toLocaleString()} 
                        unit="kW" 
                        icon={Zap} 
                        trend={`${Math.abs(deltas.kw)}%`} 
                        trendUp={deltas.kw > 0} 
                        color="text-yellow-400" 
                    />
                )}
                {isDataItemVisible(userRole, 'LV_KVA') && (
                    <MetricCard 
                        title="Apparent Power" 
                        value={lvmdp.totalPowerKVA.toLocaleString()} 
                        unit="kVA" 
                        icon={Activity} 
                        trend={`${Math.abs(deltas.kva)}%`} 
                        trendUp={deltas.kva > 0} 
                        color="text-blue-400" 
                    />
                )}
                {isDataItemVisible(userRole, 'LV_KVAR') && (
                    <MetricCard 
                        title="Reactive Power" 
                        value={lvmdp.totalPowerKVAR.toLocaleString()} 
                        unit="kVAR" 
                        icon={Battery} 
                        trend={`${Math.abs(deltas.kvar)}%`} 
                        trendUp={deltas.kvar > 0} 
                        color="text-purple-400" 
                    />
                )}
                {isDataItemVisible(userRole, 'LV_PF') && (
                    <MetricCard 
                        title="Power Factor" 
                        value={lvmdp.powerFactor} 
                        icon={Gauge} 
                        trend={`${Math.abs(deltas.pf)}%`} 
                        trendUp={deltas.pf > 0} 
                        color="text-emerald-400" 
                    />
                )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column: Voltage & Current */}
                <div className="space-y-6 xl:col-span-1">
                     {/* Voltage Group */}
                    {isDataItemVisible(userRole, 'LV_VOLT_GROUP') && (
                        <Card title="Voltage Metrics">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                                    <span className="text-slate-400 font-medium text-sm">Voltage R-S</span>
                                    <div className="text-right">
                                        <div className="text-white font-bold font-mono text-lg">{lvmdp.voltageRS} V</div>
                                        <div className={`text-xs font-bold ${deltas.v_rs >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {deltas.v_rs > 0 ? '▲' : '▼'} {Math.abs(deltas.v_rs)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                                    <span className="text-slate-400 font-medium text-sm">Voltage S-T</span>
                                    <div className="text-right">
                                        <div className="text-white font-bold font-mono text-lg">{lvmdp.voltageST} V</div>
                                        <div className={`text-xs font-bold ${deltas.v_st >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {deltas.v_st > 0 ? '▲' : '▼'} {Math.abs(deltas.v_st)}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-medium text-sm">Voltage T-R</span>
                                    <div className="text-right">
                                        <div className="text-white font-bold font-mono text-lg">{lvmdp.voltageTR} V</div>
                                        <div className={`text-xs font-bold ${deltas.v_tr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {deltas.v_tr > 0 ? '▲' : '▼'} {Math.abs(deltas.v_tr)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Current Load Group */}
                    {isDataItemVisible(userRole, 'LV_CURRENT_LOAD_SECTION') && (
                        <Card title="Current Load Usage">
                            <div className="mt-2">
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-400 text-sm font-bold uppercase">Current Load</span>
                                    <span className="text-white font-bold font-mono">{loadPercent.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                                    <div 
                                        className={`h-3 rounded-full ${loadPercent > 80 ? 'bg-rose-500' : loadPercent > 60 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                                        style={{ width: `${Math.min(loadPercent, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs font-medium font-mono">
                                    <span className="text-white">Current: {avgCurrent.toFixed(0)} A</span>
                                    <span className="text-slate-500">Max: {maxCurrent} A</span>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Power Metrics Detailed List */}
                    {isDataItemVisible(userRole, 'LV_POWER_METRICS_LIST') && (
                         <Card title="Power Metrics">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-800 pb-2 border-dashed">
                                    <span className="text-slate-400 text-sm font-medium">Active Power</span>
                                    <div className="flex gap-3 items-center">
                                        <span className="text-white font-bold font-mono">{lvmdp.totalPowerKW} kW</span>
                                        <span className={`text-xs font-bold w-12 text-right ${deltas.kw >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {deltas.kw > 0 ? '▲' : '▼'} {Math.abs(deltas.kw)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-800 pb-2 border-dashed">
                                    <span className="text-slate-400 text-sm font-medium">Apparent Power</span>
                                    <div className="flex gap-3 items-center">
                                        <span className="text-white font-bold font-mono">{lvmdp.totalPowerKVA} kVA</span>
                                        <span className={`text-xs font-bold w-12 text-right ${deltas.kva >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {deltas.kva > 0 ? '▲' : '▼'} {Math.abs(deltas.kva)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm font-medium">Reactive Power</span>
                                    <div className="flex gap-3 items-center">
                                        <span className="text-white font-bold font-mono">{lvmdp.totalPowerKVAR} kVAR</span>
                                        <span className={`text-xs font-bold w-12 text-right ${deltas.kvar >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {deltas.kvar > 0 ? '▲' : '▼'} {Math.abs(deltas.kvar)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Column: Energy Trend */}
                <div className="xl:col-span-2 space-y-6">
                    {isDataItemVisible(userRole, 'LV_ENERGY_TREND') && (
                        <Card title={`Energy Usage Trend (${period})`} className="min-h-[400px]">
                                <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={energyTrend} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 13}} />
                                    <YAxis stroke="#94a3b8" tick={{fontSize: 13}} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', fontSize: '14px' }}
                                        formatter={(value: number) => [value.toFixed(1) + ' kWh', 'Usage']}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorEnergy)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    )}

                    {/* Shift Analysis Table */}
                     <Card title={`Shift Energy & Electrical Performance Summary (${period})`}>
                         <div className="overflow-x-auto">
                            <table className="w-full text-slate-300">
                                <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-bold text-slate-400">
                                    <tr>
                                        <th className="p-3 text-center">Shift</th>
                                        <th className="p-3 text-center">Total kWh</th>
                                        <th className="p-3 text-center">Avg Power (kW)</th>
                                        <th className="p-3 text-center">Avg Load (%)</th>
                                        <th className="p-3 text-center">Avg Current (A)</th>
                                        <th className="p-3 text-center">Avg PF</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800 text-sm">
                                    {shiftData.map((shift, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/30">
                                            <td className="p-3 font-semibold text-white flex items-center gap-2">
                                                <Clock size={16} className="text-blue-400" />
                                                {shift.name}
                                            </td>
                                            <td className="p-3 font-mono text-yellow-400 font-bold text-center">{shift.kwh.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                            <td className="p-3 font-mono text-center">{shift.avgPower.toFixed(1)}</td>
                                            <td className="p-3 font-mono text-center">
                                                <div className="flex justify-center">
                                                    <span className={`px-2 py-0.5 rounded ${shift.avgLoad > 80 ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                        {shift.avgLoad.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-3 font-mono text-center">{shift.avgCurrent.toFixed(1)}</td>
                                            <td className="p-3 font-mono text-emerald-400 text-center">{shift.avgPF.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                     </Card>
                </div>
            </div>
        </div>
    );
};

export default LVMDPDetail;
