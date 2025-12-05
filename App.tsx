
import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation, useNavigate, useParams, Outlet } from 'react-router-dom';
import { PLANTS, MOCK_ALARMS, getMachineById, getLVMDPById } from './services/mockData';
import { PlantCode, Machine, LVMDP, User, UserRole } from './types';
import { MetricCard, Card, StatusBadge } from './components/SharedComponents';
import MachineDetail from './views/MachineDetail';
import LVMDPDetail from './views/LVMDPDetail';
import UtilitySummary from './views/UtilitySummary';
import SettingsView from './views/Settings';
import Login from './views/Login';
import { isDataItemVisible } from './services/visibilityStore';
import { 
    LayoutDashboard, 
    Factory, 
    Activity, 
    Zap, 
    Settings, 
    Bell, 
    LogOut,
    Menu,
    X,
    TrendingUp,
    Box,
    Calendar,
    Clock,
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    Droplets,
    ShieldAlert,
    Cloud,
    Wind
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

// --- Dashboard Components (Refactored for Router) ---

const GlobalDashboard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const [chartRange, setChartRange] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'YEAR'>('TODAY');
    const plants = Object.values(PLANTS);
    
    // Aggregate Data for KPIs
    const totalOutput = plants.reduce((acc, p) => acc + p.outputToday, 0);
    const avgOEE = (plants.reduce((acc, p) => acc + p.oeeAvg, 0) / plants.filter(p => p.oeeAvg > 0).length) * 100;
    const totalEnergy = plants.reduce((acc, p) => acc + p.energyTotal, 0);
    const totalAlarms = MOCK_ALARMS.length;

    // Calculate Chart Data based on Time Range
    const chartData = useMemo(() => {
        return plants.map(p => {
            let outputValue = p.outputToday;
            let oeeValue = parseFloat((p.oeeAvg * 100).toFixed(1));
            
            // Simulation multipliers for demo purposes
            // In a real app, this would query an API with ?range=...
            const randomVar = 0.9 + (p.name.length % 3) * 0.05; // Deterministic pseudo-random based on name length

            switch (chartRange) {
                case 'WEEK':
                    outputValue = Math.floor(p.outputToday * 6.5 * randomVar);
                    oeeValue = parseFloat(Math.min(98, oeeValue * (0.98 + (1-randomVar)*0.1)).toFixed(1));
                    break;
                case 'MONTH':
                    outputValue = Math.floor(p.outputToday * 28 * randomVar);
                    oeeValue = parseFloat(Math.min(99, oeeValue * (0.95 + (1-randomVar)*0.1)).toFixed(1));
                    break;
                case 'YEAR':
                    outputValue = Math.floor(p.outputToday * 340 * randomVar);
                    oeeValue = parseFloat(Math.min(95, oeeValue * (0.92 + (1-randomVar)*0.1)).toFixed(1));
                    break;
                default: // TODAY
                    // use raw values
                    break;
            }

            return {
                name: p.name.replace('Plant ', ''),
                output: outputValue,
                oee: oeeValue
            };
        });
    }, [plants, chartRange]);

    // Access Control Logic
    const isRestricted = [UserRole.MANAGEMENT, UserRole.VIEWER].includes(userRole);

    const FilterButton = ({ label, value }: { label: string, value: typeof chartRange }) => (
        <button 
            onClick={() => setChartRange(value)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                chartRange === value 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold mb-4">Corporate Overview</h2>
            
            {/* 1. Global KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isDataItemVisible(userRole, 'GLOBAL_OUTPUT_TODAY') && (
                    <MetricCard title="Total Output Today" value={totalOutput.toLocaleString()} unit="kg" icon={Box} trend="12%" trendUp={true} />
                )}
                {isDataItemVisible(userRole, 'GLOBAL_OEE') && (
                    <MetricCard title="Global Avg OEE" value={avgOEE.toFixed(1)} unit="%" icon={Activity} trend="2%" trendUp={true} color="text-emerald-400" />
                )}
                {isDataItemVisible(userRole, 'GLOBAL_TOTAL_ENERGY') && (
                    <MetricCard title="Total Energy" value={totalEnergy.toLocaleString()} unit="kWh" icon={Zap} trend="5%" trendUp={false} color="text-yellow-400" />
                )}
                {isDataItemVisible(userRole, 'GLOBAL_TOTAL_ALARMS') && (
                    <MetricCard title="Active Alarms" value={totalAlarms} icon={Bell} color="text-rose-500" />
                )}
            </div>

            {/* 2. Plant Summary Grid */}
            {isDataItemVisible(userRole, 'GLOBAL_PLANT_LIST') && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2">
                        <Factory size={18} /> Plant Status Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {plants.map(plant => {
                            // Status Logic
                            let status = 'NORMAL';
                            let statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                            
                            if (plant.activeAlarms > 5 || plant.oeeAvg < 0.5) {
                                status = 'CRITICAL';
                                statusColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
                            } else if (plant.activeAlarms > 0 || plant.oeeAvg < 0.7) {
                                status = 'WARNING';
                                statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                            }

                            const CardContent = (
                                <Card className={`h-full border-slate-700 ${!isRestricted ? 'hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-800/80 cursor-pointer' : 'cursor-default opacity-100'} transition-all group`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className={`font-bold text-lg text-white ${!isRestricted ? 'group-hover:text-blue-400' : ''} transition-colors`}>{plant.name}</h3>
                                            <p className="text-slate-500 text-sm">{plant.location}</p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${statusColor}`}>
                                            {status}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm items-center">
                                            <span className="text-slate-400 flex items-center gap-2"><Box size={14}/> Output</span>
                                            <span className="font-mono font-medium text-white">{plant.outputToday.toLocaleString()} kg</span>
                                        </div>
                                        <div className="flex justify-between text-sm items-center">
                                            <span className="text-slate-400 flex items-center gap-2"><Activity size={14}/> OEE</span>
                                            <span className={`font-mono font-bold ${plant.oeeAvg >= 0.8 ? 'text-emerald-400' : plant.oeeAvg >= 0.6 ? 'text-amber-400' : 'text-rose-400'}`}>{(plant.oeeAvg * 100).toFixed(0)}%</span>
                                        </div>
                                         <div className="flex justify-between text-sm items-center">
                                            <span className="text-slate-400 flex items-center gap-2"><Zap size={14}/> Energy</span>
                                            <span className="font-mono text-yellow-500">{plant.energyTotal.toLocaleString()} kWh</span>
                                        </div>
                                        <div className="flex justify-between text-sm items-center pt-2 border-t border-slate-700/50">
                                            <span className="text-slate-400">Active Alarms</span>
                                            <span className={`font-mono font-bold px-2 py-0.5 rounded ${plant.activeAlarms > 0 ? 'bg-rose-500/10 text-rose-400' : 'text-slate-500'}`}>{plant.activeAlarms}</span>
                                        </div>
                                    </div>
                                </Card>
                            );

                            return isRestricted ? (
                                <div key={plant.id}>{CardContent}</div>
                            ) : (
                                <Link to={`/plants/${plant.id}`} key={plant.id}>{CardContent}</Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 3. Comparison Charts */}
            <div>
                 <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-3 gap-2">
                    <h3 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
                        <BarChart3 size={18} /> Performance Comparison
                    </h3>
                    <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1">
                        <FilterButton label="Today" value="TODAY" />
                        <FilterButton label="Week" value="WEEK" />
                        <FilterButton label="Month" value="MONTH" />
                        <FilterButton label="Year" value="YEAR" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isDataItemVisible(userRole, 'GLOBAL_OUTPUT_COMPARISON_CHART') && (
                        <Card title={`Production Output (${chartRange.charAt(0) + chartRange.slice(1).toLowerCase()})`}>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip 
                                        cursor={{fill: '#334155', opacity: 0.2}} 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        formatter={(value: number) => [value.toLocaleString() + ' kg', 'Output']} 
                                    />
                                    <Bar dataKey="output" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} animationDuration={800}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#60a5fa'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    )}

                    {isDataItemVisible(userRole, 'GLOBAL_OEE_COMPARISON_CHART') && (
                        <Card title={`OEE Comparison (${chartRange.charAt(0) + chartRange.slice(1).toLowerCase()})`}>
                            <ResponsiveContainer width="100%" height={300}>
                                 <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                                    <Tooltip 
                                        cursor={{fill: '#334155', opacity: 0.2}} 
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        formatter={(value: number) => [value + '%', 'OEE']}
                                    />
                                    <Bar dataKey="oee" radius={[4, 4, 0, 0]} barSize={50} animationDuration={800}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.oee >= 80 ? '#10b981' : entry.oee >= 60 ? '#f59e0b' : '#f43f5e'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

const PlantDashboard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { plantId } = useParams<{ plantId: string }>();
    const navigate = useNavigate();
    const plant = PLANTS[plantId as PlantCode];

    if (!plant) return <div className="p-8 text-center text-slate-500">Plant not found</div>;

    const displayMachines = userRole === UserRole.OPERATOR 
        ? plant.machines.slice(0, 4) 
        : plant.machines;

    const plantNameKey = plant.name.replace('Plant ', '').toUpperCase();
    const currentAlarms = MOCK_ALARMS.filter(a => 
        a.source.toUpperCase().includes(plantNameKey) || 
        plant.machines.some(m => a.source.includes(m.code)) ||
        plant.lvmdps.some(l => a.source.includes(l.code))
    );

    const shifts = [
        { id: 1, name: 'Shift 1', time: '06:00 - 14:00', output: plant.outputToday, target: 12000, oee: plant.oeeAvg, status: 'ACTIVE' },
        { id: 2, name: 'Shift 2', time: '14:00 - 22:00', output: 0, target: 12000, oee: 0, status: 'PENDING' },
        { id: 3, name: 'Shift 3', time: '22:00 - 06:00', output: 0, target: 12000, oee: 0, status: 'PENDING' },
    ];
    
    // Permission Checks
    const isMachineRestricted = [UserRole.MANAGEMENT, UserRole.VIEWER].includes(userRole);
    const canClickUtility = [UserRole.SUPERVISOR, UserRole.OPERATOR, UserRole.MAINTENANCE, UserRole.QC, UserRole.ADMINISTRATOR].includes(userRole);
    const canClickLVMDP = [UserRole.SUPERVISOR, UserRole.MAINTENANCE, UserRole.ADMINISTRATOR].includes(userRole);

    // Mock Utility Data for Dashboard Cards
    const multiplier = [PlantCode.CIKOKOL, PlantCode.SEMARANG].includes(plant.id) ? 1.5 : 0.8;
    const utilityMetrics = [
        { key: 'UTILITY_ELECTRICITY_KWH', label: 'Electricity Usage', value: (3200 * multiplier).toFixed(0), unit: 'kWh', icon: Zap, color: 'text-yellow-400' },
        { key: 'UTILITY_STEAM_KG', label: 'Steam Usage', value: (15 * multiplier).toFixed(1), unit: 'kg', icon: Cloud, color: 'text-slate-200' },
        { key: 'UTILITY_WATER_M3', label: 'Water Usage', value: (450 * multiplier).toFixed(0), unit: 'm³', icon: Droplets, color: 'text-blue-400' },
        { key: 'UTILITY_AIR_NM3', label: 'Compressed Air', value: (18000 * multiplier).toFixed(0), unit: 'Nm³', icon: Wind, color: 'text-cyan-400' },
        { key: 'UTILITY_NITROGEN_NM3', label: 'Nitrogen', value: (450 * multiplier).toFixed(0), unit: 'Nm³', icon: Box, color: 'text-emerald-400' },
    ];

    const calculateLVMDP_Load = (panel: LVMDP) => {
        // Average current across 3 phases divided by 2500A capacity as per requirement
        const avgCurrent = (panel.currentR + panel.currentS + panel.currentT) / 3;
        return (avgCurrent / 2500) * 100;
    };

    return (
        <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">{plant.name} Dashboard</h2>
                    {userRole === UserRole.OPERATOR && (
                        <p className="text-xs text-blue-400 mt-1">* Showing only assigned machines</p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2 text-sm text-slate-400 hidden md:flex">
                        <span className="bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2"><Calendar size={14}/> {new Date().toLocaleDateString()}</span>
                        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full flex items-center gap-2"><Clock size={14}/> Shift 1</span>
                    </div>
                </div>
            </div>

            {/* Top Summary Cards */}
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {isDataItemVisible(userRole, 'PLANT_OUTPUT_TODAY') && (
                    <MetricCard title="Output Today" value={plant.outputToday.toLocaleString()} unit="kg" icon={Box} />
                )}
                {isDataItemVisible(userRole, 'PLANT_OEE') && (
                    <MetricCard title="OEE" value={(plant.oeeAvg * 100).toFixed(1)} unit="%" icon={Activity} color="text-emerald-400" />
                )}
                {isDataItemVisible(userRole, 'PLANT_POWER_USAGE') && (
                    <MetricCard title="Power Usage" value={plant.energyTotal} unit="kWh" icon={Zap} color="text-yellow-400" />
                )}
                {isDataItemVisible(userRole, 'PLANT_ALARM_COUNT') && (
                    <MetricCard title="Plant Alarms" value={currentAlarms.length} icon={Bell} color="text-rose-500" />
                )}
            </div>
            
            {/* Utility Section */}
            <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <Droplets size={18} /> Utility Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {utilityMetrics.map((metric, idx) => {
                        if (!isDataItemVisible(userRole, metric.key)) return null;

                         const CardContent = (
                            <div className={`bg-slate-800 border border-slate-700 rounded-lg p-3 ${canClickUtility ? 'hover:border-blue-500 cursor-pointer group' : 'cursor-default'} transition-all h-full`}>
                                <div className="flex justify-between items-start">
                                    <div className={`p-1.5 rounded-md bg-slate-700/50 ${metric.color}`}>
                                        <metric.icon size={16} />
                                    </div>
                                    {canClickUtility && <div className="text-slate-600 group-hover:text-blue-400 transition-colors"><TrendingUp size={14} /></div>}
                                </div>
                                <div className="mt-2">
                                    <p className="text-slate-400 text-xs font-medium uppercase truncate">{metric.label}</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-lg font-bold text-white">{metric.value}</span>
                                        <span className="text-[10px] text-slate-500">{metric.unit}</span>
                                    </div>
                                </div>
                            </div>
                        );
                        
                        return canClickUtility ? (
                            <div key={idx} onClick={() => navigate(`/utility/${plantId}`)}>{CardContent}</div>
                        ) : (
                            <div key={idx}>{CardContent}</div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {isDataItemVisible(userRole, 'SHIFT_PERFORMANCE_TABLE') && (
                    <Card title="Shift Performance" className="lg:col-span-2">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-semibold">
                                    <tr>
                                        <th className="p-3 rounded-tl-lg">Shift</th>
                                        <th className="p-3">Time</th>
                                        <th className="p-3">Output (kg)</th>
                                        <th className="p-3">Target</th>
                                        <th className="p-3">OEE</th>
                                        <th className="p-3 rounded-tr-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {shifts.map(shift => (
                                        <tr key={shift.id} className={shift.status === 'ACTIVE' ? 'bg-blue-500/5' : ''}>
                                            <td className="p-3 font-medium text-white">{shift.name}</td>
                                            <td className="p-3">{shift.time}</td>
                                            <td className="p-3 text-white">{shift.output.toLocaleString()}</td>
                                            <td className="p-3">{shift.target.toLocaleString()}</td>
                                            <td className="p-3">{(shift.oee * 100).toFixed(1)}%</td>
                                            <td className="p-3">
                                                {shift.status === 'ACTIVE' ? (
                                                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase"><Activity size={12}/> Active</span>
                                                ) : (
                                                    <span className="text-slate-500 text-xs uppercase">{shift.status}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {isDataItemVisible(userRole, 'ACTIVE_ALARMS_LIST') && (
                    <Card title="Active Alarms" className="lg:col-span-1 flex flex-col max-h-[300px]">
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-3">
                            {currentAlarms.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-8">
                                    <CheckCircle2 size={32} className="text-emerald-500 mb-2 opacity-50"/>
                                    <p>No Active Alarms</p>
                                </div>
                            ) : (
                                currentAlarms.map(alarm => (
                                    <div key={alarm.id} className="bg-slate-900/50 p-3 rounded border border-slate-700/50 flex gap-3 items-start">
                                        <div className={`mt-1 p-1 rounded-full shrink-0 ${
                                            alarm.severity === 'CRITICAL' ? 'bg-rose-500 text-white' :
                                            alarm.severity === 'WARNING' ? 'bg-amber-500 text-white' :
                                            'bg-blue-500 text-white'
                                        }`}>
                                            <AlertTriangle size={12} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-mono mb-0.5">{alarm.timestamp}</p>
                                            <p className="text-sm font-medium text-white leading-tight">{alarm.message}</p>
                                            <p className="text-xs text-slate-500 mt-1 uppercase">{alarm.source}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                )}
            </div>

            {/* Machines Grid - Always renders container, visibility of cards is implicit but here we render the section */}
            <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <Factory size={18} /> Production Lines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayMachines.map(machine => {
                        const CardContent = (
                            <div 
                                className={`bg-slate-800 border border-slate-700 ${!isMachineRestricted ? 'hover:border-blue-500 hover:bg-slate-800/80 cursor-pointer group' : 'cursor-default opacity-90'} rounded-lg p-4 transition-all h-full`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`font-semibold text-white truncate pr-2 ${!isMachineRestricted ? 'group-hover:text-blue-400' : ''} transition-colors`}>{machine.name}</span>
                                    {isDataItemVisible(userRole, 'MACHINE_CARD_STATUS') && <StatusBadge status={machine.status} />}
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                                    {isDataItemVisible(userRole, 'MACHINE_CARD_OUTPUT') && (
                                        <div>
                                            <p className="text-slate-500 text-xs">Output (kg/h)</p>
                                            <p className="font-mono text-slate-200 text-lg">{machine.outputPerHour}</p>
                                        </div>
                                    )}
                                    {isDataItemVisible(userRole, 'MACHINE_CARD_OEE') && (
                                        <div>
                                            <p className="text-slate-500 text-xs">OEE</p>
                                            <p className="font-mono text-slate-200 text-lg">{(machine.oee * 100).toFixed(0)}%</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );

                        return isMachineRestricted ? (
                            <div key={machine.id}>{CardContent}</div>
                        ) : (
                            <Link to={`/machines/${machine.id}`} key={machine.id}>{CardContent}</Link>
                        );
                    })}
                </div>
            </div>

            {/* LVMDP Grid */}
            <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2 mt-8">
                    <Zap size={18} /> Power Distribution
                </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plant.lvmdps.map((panel, idx) => {
                        const loadPercent = calculateLVMDP_Load(panel);
                        const CardContent = (
                            <div 
                                className={`bg-slate-900 border border-slate-700 rounded-lg p-4 relative overflow-hidden h-full ${canClickLVMDP ? 'hover:border-yellow-500 cursor-pointer group' : 'cursor-default'}`}
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Zap size={80} />
                                </div>
                                <h4 className="font-semibold text-slate-200 group-hover:text-yellow-400 transition-colors">Panel {idx + 1}</h4>
                                <div className="mt-4 space-y-3">
                                    {isDataItemVisible(userRole, 'LV_PANEL_ENERGY_TODAY') && (
                                        <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                            <span className="text-slate-500">Energy Today</span>
                                            <span className="text-yellow-400 font-mono font-bold">{panel.energyToday.toLocaleString()} kWh</span>
                                        </div>
                                    )}
                                    {isDataItemVisible(userRole, 'LV_PANEL_LOAD_PERCENT') && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Current Load</span>
                                            <span className={`font-mono font-bold ${loadPercent > 80 ? 'text-rose-400' : 'text-slate-300'}`}>{loadPercent.toFixed(1)}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );

                        return canClickLVMDP ? (
                            <Link to={`/lvmdp/${panel.id}`} key={panel.id}>{CardContent}</Link>
                        ) : (
                            <div key={panel.id}>{CardContent}</div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- Helper Pages & Wrappers ---

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in">
        <div className="bg-rose-500/10 p-6 rounded-full border border-rose-500/20">
            <ShieldAlert size={64} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-slate-400 max-w-md">
            Your user role does not have permission to access this resource. 
            If you believe this is an error, please contact the System Administrator.
        </p>
        <Link to="/dashboard/global" className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 transition-colors">
            Return to Dashboard
        </Link>
    </div>
);

const MachineDetailWrapper: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { machineId } = useParams<{ machineId: string }>();
    const navigate = useNavigate();
    const machine = getMachineById(machineId || '');

    if (!machine) return <div className="p-8 text-center text-slate-500">Machine not found</div>;

    return <MachineDetail machine={machine} onBack={() => navigate(-1)} userRole={userRole} />;
};

const LVMDPDetailWrapper: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { panelId } = useParams<{ panelId: string }>();
    const navigate = useNavigate();
    const panel = getLVMDPById(panelId || '');

    if (!panel) return <div className="p-8 text-center text-slate-500">Panel not found</div>;

    return <LVMDPDetail lvmdp={panel} onBack={() => navigate(-1)} userRole={userRole} />;
};

const UtilitySummaryWrapper: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { plantId } = useParams<{ plantId: string }>();
    const navigate = useNavigate();
    const plant = PLANTS[plantId as PlantCode];

    if (!plant) return <div className="p-8 text-center text-slate-500">Plant not found</div>;

    return <UtilitySummary plantId={plant.id} plantName={plant.name} onBack={() => navigate(-1)} userRole={userRole} />;
};

const SettingsWrapper: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    // Redundant check since ProtectedRoute handles it, but good for safety
    if (userRole !== UserRole.ADMINISTRATOR) return <AccessDenied />;
    return <SettingsView userRole={userRole} />;
};

// --- Layout & Protected Routes ---

const Layout: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const breadcrumb = useMemo(() => {
        const path = location.pathname;
        if (path.includes('/dashboard/global')) return 'Global Overview';
        if (path.includes('/plants/')) {
            const id = path.split('/')[2];
            return `Plant / ${PLANTS[id as PlantCode]?.name || id}`;
        }
        if (path.includes('/machines/')) return 'Machine Detail';
        if (path.includes('/settings')) return 'System Administration';
        return 'Smart Monitoring';
    }, [location]);

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
             <aside 
                className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-20`}
            >
                <div className="h-16 flex items-center justify-center border-b border-slate-800">
                    {sidebarOpen ? (
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                            SmartMonitor
                        </span>
                    ) : (
                        <Activity className="text-blue-400" />
                    )}
                </div>

                <nav className="flex-1 py-6 space-y-2 px-2">
                    <Link 
                        to="/dashboard/global"
                        className={`w-full flex items-center p-3 rounded-lg transition-colors ${location.pathname.includes('/dashboard/global') ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} />
                        {sidebarOpen && <span className="ml-3 font-medium">Dashboard</span>}
                    </Link>

                    <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {sidebarOpen && 'Plants'}
                    </div>
                    {Object.values(PLANTS).map(plant => (
                        <Link
                            key={plant.id}
                            to={`/plants/${plant.id}`}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${location.pathname.includes(`/plants/${plant.id}`) ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Factory size={20} />
                            {sidebarOpen && <span className="ml-3 font-medium truncate">{plant.name}</span>}
                        </Link>
                    ))}

                    {user.role === UserRole.ADMINISTRATOR && (
                        <div className="pt-4 border-t border-slate-800 mt-4">
                            <Link 
                                to="/settings"
                                className={`w-full flex items-center p-3 rounded-lg transition-colors ${location.pathname === '/settings' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Settings size={20} />
                                {sidebarOpen && <span className="ml-3 font-medium">Settings</span>}
                            </Link>
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={onLogout}
                        className="flex items-center text-slate-400 hover:text-white transition-colors w-full"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

             <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-slate-900/50 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-md text-slate-400 mr-4">
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h2 className="text-sm font-medium text-slate-400">{breadcrumb}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-white">{user.name}</span>
                            <span className="text-xs text-slate-400">{user.role}</span>
                        </div>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

interface ProtectedRouteProps {
    user: User;
    allowedRoles?: UserRole[]; // If undefined, allow all logged in
    restrictedForRoles?: UserRole[]; // Block these specific roles
    redirectPath?: string;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles, restrictedForRoles, redirectPath, children }) => {
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return redirectPath ? <Navigate to={redirectPath} replace /> : <AccessDenied />;
    }
    if (restrictedForRoles && restrictedForRoles.includes(user.role)) {
        return redirectPath ? <Navigate to={redirectPath} replace /> : <AccessDenied />;
    }
    return <>{children}</>;
};

// --- App Root ---

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    if (!user) {
        return <Login onLogin={setUser} />;
    }

    const managementRoles = [UserRole.MANAGEMENT, UserRole.VIEWER];
    // Detail pages restricted for Management/Guest
    const restrictedForManagement = managementRoles; 

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout user={user} onLogout={() => setUser(null)} />}>
                    <Route index element={<Navigate to="/dashboard/global" replace />} />
                    
                    <Route path="dashboard/global" element={<GlobalDashboard userRole={user.role} />} />
                    
                    <Route path="plants/:plantId" element={<PlantDashboard userRole={user.role} />} />
                    
                    {/* Restricted Routes */}
                    <Route 
                        path="machines/:machineId" 
                        element={
                            <ProtectedRoute 
                                user={user} 
                                restrictedForRoles={restrictedForManagement}
                                redirectPath="/dashboard/global"
                            >
                                <MachineDetailWrapper userRole={user.role} />
                            </ProtectedRoute>
                        } 
                    />
                     <Route 
                        path="lvmdp/:panelId" 
                        element={
                            <ProtectedRoute user={user} restrictedForRoles={restrictedForManagement}>
                                <LVMDPDetailWrapper userRole={user.role} />
                            </ProtectedRoute>
                        } 
                    />
                     <Route 
                        path="utility/:plantId" 
                        element={
                            <ProtectedRoute user={user} restrictedForRoles={restrictedForManagement}>
                                <UtilitySummaryWrapper userRole={user.role} />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="settings" 
                        element={
                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMINISTRATOR]}>
                                <SettingsWrapper userRole={user.role} />
                            </ProtectedRoute>
                        } 
                    />

                    <Route path="*" element={<Navigate to="/dashboard/global" replace />} />
                </Route>
            </Routes>
        </HashRouter>
    );
};

export default App;
