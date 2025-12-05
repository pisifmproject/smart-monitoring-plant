
import React, { useState } from 'react';
import { LVMDP, UserRole } from '../types';
import { Card, StatusBadge } from '../components/SharedComponents';
import { isWidgetVisible } from '../services/visibilityStore';
import { ArrowLeft, Zap, Clock, CalendarRange, Thermometer, AlertTriangle, ShieldCheck, DoorOpen, Settings, RefreshCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LVMDPDetailProps {
    lvmdp: LVMDP;
    onBack: () => void;
    userRole: UserRole;
}

const LVMDPDetail: React.FC<LVMDPDetailProps> = ({ lvmdp, onBack, userRole }) => {
    const [showConfig, setShowConfig] = useState(false);

    // Permissions
    const canConfig = userRole === UserRole.ADMINISTRATOR;
    const canAck = [UserRole.ADMINISTRATOR, UserRole.MAINTENANCE].includes(userRole);
    const canReset = userRole === UserRole.ADMINISTRATOR;

    // Mock harmonics data
    const harmonicData = Array.from({ length: 15 }, (_, i) => ({
        order: `H${i * 2 + 1}`,
        value: i === 0 ? 100 : Math.random() * (10 - i * 0.5)
    }));

    // Mock trend data
    const kwTrend = Array.from({ length: 12 }, (_, i) => ({
        time: `${i * 2}:00`,
        value: lvmdp.totalPowerKW * (0.8 + Math.random() * 0.4)
    }));

    const handleAck = () => {
        alert("Alarms Acknowledged by " + userRole);
    };

    const handleResetCounter = () => {
        if(confirm("Are you sure you want to reset the energy counter? This action is logged.")) {
            alert("Counter Reset.");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
             {/* Header */}
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            {lvmdp.name}
                            <StatusBadge status={lvmdp.status} />
                        </h1>
                        <p className="text-slate-400 text-sm">{lvmdp.code} • Plant {lvmdp.plantId} • {lvmdp.frequency} Hz</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {canAck && lvmdp.status !== 'NORMAL' && (
                        <button onClick={handleAck} className="px-4 py-2 bg-amber-600/20 text-amber-400 border border-amber-600/50 hover:bg-amber-600/30 rounded-md text-sm font-medium flex items-center gap-2">
                            <ShieldCheck size={16} /> Ack Alarms
                        </button>
                    )}
                    {canConfig && (
                        <button onClick={() => setShowConfig(!showConfig)} className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-md text-sm font-medium flex items-center gap-2">
                            <Settings size={16} /> Panel Config
                        </button>
                    )}
                </div>
            </div>

            {/* Config Panel (Admin Only) */}
            {showConfig && canConfig && (
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 animate-in slide-in-from-top-2">
                    <h3 className="font-bold text-slate-300 mb-3 text-sm uppercase">Administration Actions</h3>
                    <div className="flex gap-4">
                         <button onClick={handleResetCounter} className="px-3 py-2 bg-rose-900/30 text-rose-400 border border-rose-800 hover:bg-rose-900/50 rounded text-sm flex items-center gap-2">
                            <RefreshCcw size={14} /> Reset Energy Counter
                        </button>
                        <button className="px-3 py-2 bg-blue-900/30 text-blue-400 border border-blue-800 hover:bg-blue-900/50 rounded text-sm flex items-center gap-2">
                            Update CT Ratio
                        </button>
                    </div>
                </div>
            )}

            {/* Main Power Metrics */}
            {isWidgetVisible(userRole, 'LVMDP_KPI_MAIN') && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-yellow-500">
                        <p className="text-slate-400 text-xs uppercase font-bold">Active Power (P)</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{lvmdp.totalPowerKW}</span>
                            <span className="text-sm text-slate-400">kW</span>
                        </div>
                        <div className="mt-2 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-yellow-500 h-full" style={{ width: `${lvmdp.currentLoadPercent}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 text-right">{lvmdp.currentLoadPercent}% Load</p>
                    </Card>
                     <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-blue-500">
                        <p className="text-slate-400 text-xs uppercase font-bold">Apparent Power (S)</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{lvmdp.totalPowerKVA}</span>
                            <span className="text-sm text-slate-400">kVA</span>
                        </div>
                    </Card>
                     <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-rose-500">
                        <p className="text-slate-400 text-xs uppercase font-bold">Reactive Power (Q)</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{lvmdp.totalPowerKVAR}</span>
                            <span className="text-sm text-slate-400">kVAR</span>
                        </div>
                    </Card>
                     <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-l-4 border-l-emerald-500">
                        <p className="text-slate-400 text-xs uppercase font-bold">Power Factor (PF)</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">{lvmdp.powerFactor}</span>
                        </div>
                        <p className="text-xs text-emerald-500 mt-1">Lagging</p>
                    </Card>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Phase Details */}
                {isWidgetVisible(userRole, 'LVMDP_WIDGET_PHASE') && (
                    <Card title="Phase Monitoring (R-S-T)" className="lg:col-span-1">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-500 text-xs uppercase">
                                    <th className="text-left py-2">Parameter</th>
                                    <th className="text-right py-2 text-red-400">R</th>
                                    <th className="text-right py-2 text-yellow-400">S</th>
                                    <th className="text-right py-2 text-blue-400">T</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700 font-mono">
                                <tr>
                                    <td className="py-3 text-slate-300 font-sans">Voltage (L-L)</td>
                                    <td className="text-right text-slate-200">{lvmdp.voltageRS}</td>
                                    <td className="text-right text-slate-200">{lvmdp.voltageST}</td>
                                    <td className="text-right text-slate-200">{lvmdp.voltageTR}</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-slate-300 font-sans">Current (A)</td>
                                    <td className="text-right text-slate-200">{lvmdp.currentR}</td>
                                    <td className="text-right text-slate-200">{lvmdp.currentS}</td>
                                    <td className="text-right text-slate-200">{lvmdp.currentT}</td>
                                </tr>
                                <tr>
                                    <td className="py-3 text-slate-300 font-sans">Active (kW)</td>
                                    <td className="text-right text-slate-500">{(lvmdp.totalPowerKW/3).toFixed(1)}</td>
                                    <td className="text-right text-slate-500">{(lvmdp.totalPowerKW/3).toFixed(1)}</td>
                                    <td className="text-right text-slate-500">{(lvmdp.totalPowerKW/3).toFixed(1)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="mt-4 pt-4 border-t border-slate-700 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-slate-500 uppercase">V-Unbalance</p>
                                <p className={`text-lg font-bold ${lvmdp.unbalanceVoltage > 2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {lvmdp.unbalanceVoltage}%
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase">I-Unbalance</p>
                                <p className={`text-lg font-bold ${lvmdp.unbalanceCurrent > 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {lvmdp.unbalanceCurrent}%
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Energy & Trends */}
                {isWidgetVisible(userRole, 'LVMDP_WIDGET_ENERGY') && (
                    <div className="lg:col-span-2 space-y-4">
                         {/* Energy Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
                                <p className="text-slate-400 text-xs uppercase flex items-center gap-2"><Clock size={14}/> Energy Today</p>
                                <p className="text-xl font-bold text-white mt-1 font-mono">{lvmdp.energyToday.toLocaleString()} <span className="text-xs text-slate-500">kWh</span></p>
                            </div>
                            <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
                                <p className="text-slate-400 text-xs uppercase flex items-center gap-2"><CalendarRange size={14}/> Energy MTD</p>
                                <p className="text-xl font-bold text-white mt-1 font-mono">{lvmdp.energyMTD.toLocaleString()} <span className="text-xs text-slate-500">kWh</span></p>
                            </div>
                            <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg">
                                <p className="text-slate-400 text-xs uppercase flex items-center gap-2"><Zap size={14}/> Total Energy</p>
                                <p className="text-xl font-bold text-white mt-1 font-mono">{lvmdp.energyTotal.toLocaleString()} <span className="text-xs text-slate-500">kWh</span></p>
                            </div>
                        </div>

                        <Card title="Active Power Trend (Today)">
                             <ResponsiveContainer width="100%" height={220}>
                                <LineChart data={kwTrend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                    <Line type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card>
                    </div>
                )}
            </div>

            {/* Bottom Row: Status & Quality */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Panel Environment & Status */}
                {isWidgetVisible(userRole, 'LVMDP_WIDGET_STATUS') && (
                    <Card title="Panel Status & Environment" className="lg:col-span-1">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-slate-900 p-3 rounded flex flex-col items-center">
                                <Thermometer className="text-rose-400 mb-2" />
                                <span className="text-2xl font-bold text-white">{lvmdp.panelTemp}°C</span>
                                <span className="text-xs text-slate-500">Internal Temp</span>
                            </div>
                             <div className="bg-slate-900 p-3 rounded flex flex-col items-center">
                                <Zap className={`${lvmdp.breakerStatus === 'TRIPPED' ? 'text-rose-500' : 'text-emerald-500'} mb-2`} />
                                <span className={`text-lg font-bold ${lvmdp.breakerStatus === 'TRIPPED' ? 'text-rose-400' : 'text-white'}`}>
                                    {lvmdp.breakerStatus}
                                </span>
                                <span className="text-xs text-slate-500">ACB Status</span>
                            </div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded flex items-center justify-between border border-slate-700">
                            <span className="text-sm text-slate-300 flex items-center gap-2">
                                <DoorOpen size={16} className="text-slate-400"/> Door Status
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${lvmdp.doorOpen ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                {lvmdp.doorOpen ? 'OPEN' : 'CLOSED'}
                            </span>
                        </div>
                         <div className="bg-slate-900 p-3 rounded flex items-center justify-between border border-slate-700 mt-2">
                            <span className="text-sm text-slate-300 flex items-center gap-2">
                                <AlertTriangle size={16} className="text-slate-400"/> Protection Relay
                            </span>
                            <span className="text-xs font-bold px-2 py-1 rounded uppercase bg-emerald-500/20 text-emerald-400">
                                HEALTHY
                            </span>
                        </div>
                    </Card>
                )}

                {/* Power Quality */}
                {isWidgetVisible(userRole, 'LVMDP_WIDGET_QUALITY') && (
                    <Card title="Power Quality Analysis" className="lg:col-span-2">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-48">
                                <p className="text-xs text-slate-400 mb-2 text-center">Voltage Harmonics (THD-V)</p>
                                 <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={harmonicData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="order" stroke="#94a3b8" tick={{fontSize: 10}} />
                                        <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                        <Line type="step" dataKey="value" stroke="#a855f7" strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-4 flex flex-col justify-center">
                                <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-400 text-sm">THD Voltage</span>
                                        <span className={`font-bold ${lvmdp.thdV > 5 ? 'text-rose-400' : 'text-white'}`}>{lvmdp.thdV}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div className={`h-full ${lvmdp.thdV > 5 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(lvmdp.thdV * 10, 100)}%` }}></div>
                                    </div>
                                </div>
                                 <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-400 text-sm">THD Current</span>
                                        <span className={`font-bold ${lvmdp.thdI > 10 ? 'text-rose-400' : 'text-white'}`}>{lvmdp.thdI}%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div className={`h-full ${lvmdp.thdI > 10 ? 'bg-rose-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(lvmdp.thdI * 5, 100)}%` }}></div>
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-900/10 border border-blue-900/30 rounded text-xs text-blue-300">
                                    <p>Standard IEEE 519 Limit: THD-V &lt; 5%</p>
                                </div>
                            </div>
                         </div>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default LVMDPDetail;
