
import React, { useState } from 'react';
import { LVMDP, UserRole } from '../types';
import { Card, StatusBadge } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { ArrowLeft, Zap, Clock, CalendarRange, Settings, RefreshCcw } from 'lucide-react';
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

    // Mock trend data for Energy (Active Power kW as proxy for usage load)
    const energyTrend = Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: lvmdp.totalPowerKW * (0.6 + Math.random() * 0.4)
    }));

    // Mock trend data for Load % (derived from Energy trend roughly)
    const loadTrend = energyTrend.map(d => ({
        time: d.time,
        value: (d.value / (lvmdp.totalPowerKVA * 0.9)) * 100 // Approximation
    }));

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
                        <p className="text-slate-400 text-sm">Power Distribution Panel</p>
                    </div>
                </div>
                <div className="flex gap-2">
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
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                {/* Energy & Trends */}
                <div className="space-y-6">
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {isDataItemVisible(userRole, 'LV_DETAIL_ENERGY_TREND') && (
                            <Card title="Energy Usage Trend (24h)">
                                 <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={energyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="time" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" label={{ value: 'kW', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                        <Line type="monotone" dataKey="value" stroke="#eab308" strokeWidth={2} dot={false} name="Usage (kW)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                        )}

                        {isDataItemVisible(userRole, 'LV_DETAIL_LOAD_TREND') && (
                             <Card title="Load % Trend (24h)">
                                 <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={loadTrend}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="time" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} name="Load %" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LVMDPDetail;
