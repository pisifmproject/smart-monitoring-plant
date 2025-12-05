
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation, useNavigate, useParams, Outlet } from 'react-router-dom';
import { PLANTS, getMachineById, getLVMDPById } from './services/mockData';
import { PlantCode, Machine, LVMDP, User, UserRole } from './types';
import { MetricCard, Card, StatusBadge } from './components/SharedComponents';
import MachineDetail from './views/MachineDetail';
import LVMDPDetail from './views/LVMDPDetail';
import UtilitySummary from './views/UtilitySummary';
import SettingsView from './views/Settings';
import Login from './views/Login';
import { isDataItemVisible } from './services/visibilityStore';
import { maintenanceService } from './services/maintenanceService';
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
    Wind,
    Wrench,
    Flame
} from 'lucide-react';
// Recharts imports removed from App.tsx as they are no longer used in the simplified dashboard
// (They remain in Detail views which import them directly)

// --- Dashboard Components ---

const GlobalDashboard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const [period, setPeriod] = useState<'DAY' | 'WEEK' | 'MONTH' | 'YEAR'>('DAY');
    const plants = Object.values(PLANTS);
    
    // Determine Multiplier based on Period
    const multiplier = period === 'DAY' ? 1 : period === 'WEEK' ? 6.5 : period === 'MONTH' ? 28 : 340;
    
    // Aggregate Data for KPIs
    const totalOutput = plants.reduce((acc, p) => acc + p.outputToday, 0) * multiplier;
    
    // OEE stays roughly the same average, but we simulate slight variance for realism over periods
    const baseAvgOEE = (plants.reduce((acc, p) => acc + p.oeeAvg, 0) / plants.filter(p => p.oeeAvg > 0).length) * 100;
    const avgOEE = Math.min(99.9, baseAvgOEE * (1 + (period === 'DAY' ? 0 : (Math.random() * 0.05 - 0.025))));

    const totalEnergy = plants.reduce((acc, p) => acc + p.energyTotal, 0) * multiplier;
    
    // Alarms: If DAY, show current Active. If longer, show "Total Alarms Events" (mocked)
    const activeAlarmsCount = maintenanceService.getActiveAlarms().length;
    const totalAlarmsValue = period === 'DAY' ? activeAlarmsCount : Math.floor(activeAlarmsCount * multiplier * 0.8) + 5; 
    const alarmLabel = period === 'DAY' ? 'Active Alarms' : 'Total Alarm Events';

    // Access Control Logic
    const isRestricted = [UserRole.MANAGEMENT, UserRole.VIEWER].includes(userRole);

    const FilterButton = ({ label, value }: { label: string, value: typeof period }) => (
        <button 
            onClick={() => setPeriod(value)}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                period === value 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6 animate-in fade-in w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Corporate Overview</h2>
                <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1">
                    <FilterButton label="Day" value="DAY" />
                    <FilterButton label="Week" value="WEEK" />
                    <FilterButton label="Month" value="MONTH" />
                    <FilterButton label="Year" value="YEAR" />
                </div>
            </div>
            
            {/* 1. Global KPIs - Adjusted for Period */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                {isDataItemVisible(userRole, 'GLOBAL_OUTPUT_TODAY') && (
                    <MetricCard 
                        title={period === 'DAY' ? "Total Output Today" : `Total Output (${period})`} 
                        value={totalOutput.toLocaleString(undefined, { maximumFractionDigits: 0 })} 
                        unit="kg" 
                        icon={Box} 
                        trend="12%" 
                        trendUp={true} 
                    />
                )}
                {isDataItemVisible(userRole, 'GLOBAL_OEE') && (
                    <MetricCard 
                        title={`Global Avg OEE (${period})`} 
                        value={avgOEE.toFixed(1)} 
                        unit="%" 
                        icon={Activity} 
                        trend="2%" 
                        trendUp={true} 
                        color="text-emerald-400" 
                    />
                )}
                {isDataItemVisible(userRole, 'GLOBAL_TOTAL_ENERGY') && (
                    <MetricCard 
                        title={`Total Energy (${period})`} 
                        value={totalEnergy.toLocaleString(undefined, { maximumFractionDigits: 0 })} 
                        unit="kWh" 
                        icon={Zap} 
                        trend="5%" 
                        trendUp={false} 
                        color="text-yellow-400" 
                    />
                )}
                {isDataItemVisible(userRole, 'GLOBAL_TOTAL_ALARMS') && (
                    <MetricCard 
                        title={alarmLabel} 
                        value={totalAlarmsValue} 
                        icon={Bell} 
                        color="text-rose-500" 
                    />
                )}
            </div>

            {/* 2. Plant Summary Grid */}
            {isDataItemVisible(userRole, 'GLOBAL_PLANT_LIST') && (
                <div>
                    <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Factory size={22} /> Plant Status Overview
                    </h3>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                        {plants.map(plant => {
                            // Status Logic (Derived from current state, irrespective of period selection for safety status)
                            // However, we display values based on period
                            const activeAlarms = maintenanceService.getActiveAlarms();
                            const plantAlarms = activeAlarms.filter(a => a.source.includes(plant.name) || a.machineId?.includes(plant.id));
                            const alarmCount = plantAlarms.length;

                            let status = 'NORMAL';
                            let statusColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
                            
                            if (alarmCount > 5 || plant.oeeAvg < 0.5) {
                                status = 'CRITICAL';
                                statusColor = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
                            } else if (alarmCount > 0 || plant.oeeAvg < 0.7) {
                                status = 'WARNING';
                                statusColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
                            }

                            // Plant specific period values
                            const plantOutput = plant.outputToday * multiplier;
                            const plantEnergy = plant.energyTotal * multiplier;
                            const plantOEE = Math.min(100, plant.oeeAvg * 100 * (1 + (Math.random()*0.02 - 0.01)));

                            const CardContent = (
                                <Card className={`h-full border-slate-700 ${!isRestricted ? 'hover:ring-2 hover:ring-blue-500/50 hover:bg-slate-800/80 cursor-pointer' : 'cursor-default opacity-100'} transition-all group p-5`}>
                                    <div className="flex justify-between items-start mb-5">
                                        <div>
                                            <h3 className={`font-bold text-lg text-white ${!isRestricted ? 'group-hover:text-blue-400' : ''} transition-colors tracking-tight`}>{plant.name}</h3>
                                            <p className="text-slate-500 text-sm mt-0.5">{plant.location}</p>
                                        </div>
                                        <div className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide border ${statusColor}`}>
                                            {status}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm items-center">
                                            <span className="text-slate-400 font-medium flex items-center gap-2"><Box size={16}/> Output</span>
                                            <span className="font-mono font-bold text-white text-base">{plantOutput.toLocaleString(undefined, { maximumFractionDigits: 0 })} kg</span>
                                        </div>
                                        <div className="flex justify-between text-sm items-center">
                                            <span className="text-slate-400 font-medium flex items-center gap-2"><Activity size={16}/> OEE</span>
                                            <span className={`font-mono font-bold text-base ${plantOEE >= 80 ? 'text-emerald-400' : plantOEE >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>{plantOEE.toFixed(0)}%</span>
                                        </div>
                                         <div className="flex justify-between text-sm items-center">
                                            <span className="text-slate-400 font-medium flex items-center gap-2"><Zap size={16}/> Energy</span>
                                            <span className="font-mono font-bold text-base text-yellow-500">{plantEnergy.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh</span>
                                        </div>
                                        <div className="flex justify-between text-sm items-center pt-2 border-t border-slate-700/50">
                                            <span className="text-slate-400 font-medium">Active Alarms</span>
                                            <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${alarmCount > 0 ? 'bg-rose-500/10 text-rose-400' : 'text-slate-500'}`}>{alarmCount}</span>
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
        </div>
    );
};

const PlantDashboard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { plantId } = useParams<{ plantId: string }>();
    const navigate = useNavigate();
    const plant = PLANTS[plantId as PlantCode];
    const [period, setPeriod] = useState<'DAY' | 'WEEK' | 'MONTH' | 'YEAR'>('DAY');

    // Force re-render to catch alarm updates
    const [_, setTick] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t+1), 2000); 
        return () => clearInterval(interval);
    }, []);

    if (!plant) return <div className="p-8 text-center text-slate-500 text-xl">Plant not found</div>;

    // Period Logic
    const multiplier = period === 'DAY' ? 1 : period === 'WEEK' ? 6.5 : period === 'MONTH' ? 28 : 340;
    const plantOutput = plant.outputToday * multiplier;
    const plantEnergy = plant.energyTotal * multiplier;
    const plantOEE = Math.min(100, plant.oeeAvg * 100 * (1 + (Math.random()*0.02 - 0.01)));
    
    const activeAlarms = maintenanceService.getActiveAlarms(plant.id);
    const activeAlarmCount = activeAlarms.length;
    // For historical periods, mock a total count
    const totalAlarmCount = period === 'DAY' ? activeAlarmCount : Math.floor(activeAlarmCount * multiplier * 0.8) + 3;
    const alarmLabel = period === 'DAY' ? 'Plant Alarms' : 'Total Alarms';

    const displayMachines = userRole === UserRole.OPERATOR 
        ? plant.machines.slice(0, 4) 
        : plant.machines;

    const shifts = [
        { id: 1, name: 'Shift 1', time: '07:01 - 14:30', output: plant.outputToday, target: 12000, oee: plant.oeeAvg, status: 'ACTIVE' },
        { id: 2, name: 'Shift 2', time: '14:31 - 22:00', output: 0, target: 12000, oee: 0, status: 'PENDING' },
        { id: 3, name: 'Shift 3', time: '22:01 - 07:00', output: 0, target: 12000, oee: 0, status: 'PENDING' },
    ];
    
    // Permission Checks
    const isMachineRestricted = [UserRole.MANAGEMENT, UserRole.VIEWER].includes(userRole);
    const canClickUtility = [UserRole.SUPERVISOR, UserRole.OPERATOR, UserRole.MAINTENANCE, UserRole.QC, UserRole.ADMINISTRATOR].includes(userRole);

    // Dynamic Calculation for Electricity from LVMDPs (Scaled)
    const electricityUsage = plant.lvmdps.reduce((acc, panel) => acc + panel.energyToday, 0) * multiplier;

    // Utility Data Definitions (Scaled)
    const utilBaseMult = [PlantCode.CIKOKOL, PlantCode.SEMARANG].includes(plant.id) ? 1.5 : 0.8;
    const utilityMetrics = [
        { key: 'UTILITY_ELECTRICITY_KWH', type: 'electricity', label: 'Electricity Usage', value: electricityUsage.toLocaleString(undefined, { maximumFractionDigits: 0 }), unit: 'kWh', icon: Zap, color: 'text-yellow-400' },
        { key: 'UTILITY_STEAM_KG', type: 'steam', label: 'Steam Usage', value: (15 * utilBaseMult * multiplier).toFixed(1), unit: 'Ton', icon: Cloud, color: 'text-slate-200' },
        { key: 'UTILITY_WATER_M3', type: 'water', label: 'Water Usage', value: (450 * utilBaseMult * multiplier).toFixed(0), unit: 'm³', icon: Droplets, color: 'text-blue-400' },
        { key: 'UTILITY_AIR_NM3', type: 'air', label: 'Compressed Air', value: (18000 * utilBaseMult * multiplier).toFixed(0), unit: 'Nm³', icon: Wind, color: 'text-cyan-400' },
        { key: 'UTILITY_NITROGEN_NM3', type: 'nitrogen', label: 'Nitrogen', value: (450 * utilBaseMult * multiplier).toFixed(0), unit: 'Nm³', icon: Box, color: 'text-emerald-400' },
        { key: 'UTILITY_GAS_NM3', type: 'gas', label: 'Natural Gas', value: (1200 * utilBaseMult * multiplier).toFixed(0), unit: 'Nm³', icon: Flame, color: 'text-rose-400' },
    ];

    const FilterButton = ({ label, value }: { label: string, value: typeof period }) => (
        <button 
            onClick={() => setPeriod(value)}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${
                period === value 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6 animate-in fade-in w-full">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{plant.name} Dashboard</h2>
                    {userRole === UserRole.OPERATOR && (
                        <p className="text-sm text-blue-400 mt-1 font-medium">* Showing only assigned machines</p>
                    )}
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                     <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1">
                        <FilterButton label="Day" value="DAY" />
                        <FilterButton label="Week" value="WEEK" />
                        <FilterButton label="Month" value="MONTH" />
                        <FilterButton label="Year" value="YEAR" />
                    </div>
                </div>
            </div>

            {/* Top Summary Cards - Scaled by Period */}
             <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                {isDataItemVisible(userRole, 'PLANT_OUTPUT_TODAY') && (
                    <MetricCard 
                        title={period === 'DAY' ? "Output Today" : `Output (${period})`} 
                        value={plantOutput.toLocaleString(undefined, { maximumFractionDigits: 0 })} 
                        unit="kg" 
                        icon={Box} 
                    />
                )}
                {isDataItemVisible(userRole, 'PLANT_OEE') && (
                    <MetricCard 
                        title={`OEE (${period})`} 
                        value={plantOEE.toFixed(1)} 
                        unit="%" 
                        icon={Activity} 
                        color="text-emerald-400" 
                    />
                )}
                {isDataItemVisible(userRole, 'PLANT_POWER_USAGE') && (
                    <MetricCard 
                        title={`Power Usage (${period})`} 
                        value={plantEnergy.toLocaleString(undefined, { maximumFractionDigits: 0 })} 
                        unit="kWh" 
                        icon={Zap} 
                        color="text-yellow-400" 
                    />
                )}
                {isDataItemVisible(userRole, 'PLANT_ALARM_COUNT') && (
                    <MetricCard 
                        title={alarmLabel} 
                        value={totalAlarmCount} 
                        icon={Bell} 
                        color="text-rose-500" 
                    />
                )}
            </div>
            
            {/* Utility Section - Scaled by Period */}
            <div>
                <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Droplets size={22} /> Utility Summary ({period})
                </h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                    {utilityMetrics.map((metric, idx) => {
                        if (!isDataItemVisible(userRole, metric.key)) return null;

                         const CardContent = (
                            <div className={`bg-slate-800 border border-slate-700 rounded-xl p-4 ${canClickUtility ? 'hover:border-blue-500 cursor-pointer group' : 'cursor-default'} transition-all h-full shadow-sm`}>
                                <div className="flex justify-between items-start">
                                    <div className={`p-2 rounded-lg bg-slate-700/50 ${metric.color}`}>
                                        <metric.icon size={20} />
                                    </div>
                                    {canClickUtility && <div className="text-slate-600 group-hover:text-blue-400 transition-colors"><TrendingUp size={16} /></div>}
                                </div>
                                <div className="mt-3">
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wide truncate">{metric.label}</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-xl font-bold text-white tracking-tight">{metric.value}</span>
                                        <span className="text-xs font-medium text-slate-500">{metric.unit}</span>
                                    </div>
                                </div>
                            </div>
                        );
                        
                        return canClickUtility ? (
                            <div key={idx} onClick={() => navigate(`/utility/${metric.type}/${plantId}`)}>{CardContent}</div>
                        ) : (
                            <div key={idx}>{CardContent}</div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {isDataItemVisible(userRole, 'SHIFT_PERFORMANCE_TABLE') && (
                    <Card title="Shift Performance (Daily)" className="xl:col-span-2">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-slate-300">
                                <thead className="bg-slate-900/50 uppercase tracking-wider text-sm font-bold">
                                    <tr>
                                        <th className="p-3 rounded-tl-lg text-slate-400">Shift</th>
                                        <th className="p-3 text-slate-400">Time</th>
                                        <th className="p-3 text-slate-400">Output (kg)</th>
                                        <th className="p-3 text-slate-400">Target</th>
                                        <th className="p-3 text-slate-400">OEE</th>
                                        <th className="p-3 rounded-tr-lg text-slate-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 text-base">
                                    {shifts.map(shift => (
                                        <tr key={shift.id} className={shift.status === 'ACTIVE' ? 'bg-blue-500/5' : 'hover:bg-slate-800/30'}>
                                            <td className="p-3 font-semibold text-white">{shift.name}</td>
                                            <td className="p-3 text-sm">{shift.time}</td>
                                            <td className="p-3 text-white font-medium">{shift.output.toLocaleString()}</td>
                                            <td className="p-3 font-medium">{shift.target.toLocaleString()}</td>
                                            <td className="p-3 font-bold">{(shift.oee * 100).toFixed(1)}%</td>
                                            <td className="p-3">
                                                {shift.status === 'ACTIVE' ? (
                                                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase"><Activity size={14}/> Active</span>
                                                ) : (
                                                    <span className="text-slate-500 text-xs font-bold uppercase">{shift.status}</span>
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
                    <Card title="Active Alarms" className="xl:col-span-1 flex flex-col max-h-[400px]">
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-2">
                            {activeAlarms.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
                                    <CheckCircle2 size={36} className="text-emerald-500 mb-2 opacity-50"/>
                                    <p className="text-base font-medium">No Active Alarms</p>
                                </div>
                            ) : (
                                activeAlarms.map(alarm => (
                                    <div key={alarm.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex gap-3 items-start hover:bg-slate-800/80 transition-colors">
                                        <div className={`mt-1 p-1 rounded-full shrink-0 ${
                                            alarm.severity === 'CRITICAL' ? 'bg-rose-500 text-white' :
                                            alarm.severity === 'WARNING' ? 'bg-amber-500 text-white' :
                                            'bg-blue-500 text-white'
                                        }`}>
                                            <AlertTriangle size={14} />
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center w-full gap-2">
                                                <p className="text-xs text-slate-400 font-mono mb-0.5">{alarm.timestamp}</p>
                                                <span className="text-[10px] font-bold uppercase text-slate-500 border border-slate-600 px-1 rounded">{alarm.code}</span>
                                            </div>
                                            <p className="text-sm font-bold text-white leading-tight">{alarm.message}</p>
                                            <p className="text-xs text-slate-500 mt-0.5 font-semibold uppercase tracking-wide">{alarm.source}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                )}
            </div>

            {/* Machines Grid */}
            <div>
                <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Factory size={22} /> Production Lines
                </h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                    {displayMachines.map(machine => {
                        // Check for Maintenance Status (Active Alarm)
                        const hasMaintenance = maintenanceService.hasActiveAlarm(machine.id);
                        const technician = maintenanceService.getAlarmInProgress(machine.id);

                        // Scale Data based on Period
                        // Output: kg/h rate * 15 hours * multiplier
                        const scaledOutput = machine.outputPerHour * 15 * multiplier;
                        
                        // OEE: Apply variance based on period to simulate history
                        const scaledOEE = Math.min(0.99, machine.oee * (1 + (Math.random() * 0.04 - 0.02)));

                        const outputLabel = period === 'DAY' ? 'Output Today (kg)' : `Output ${period} (kg)`;
                        
                        const CardContent = (
                            <div 
                                className={`bg-slate-800 border border-slate-700 ${!isMachineRestricted ? 'hover:border-blue-500 hover:bg-slate-800/90 cursor-pointer group' : 'cursor-default opacity-90'} rounded-xl p-4 transition-all h-full shadow-sm relative overflow-hidden`}
                            >
                                {hasMaintenance && (
                                    <div className="absolute top-0 right-0">
                                        <div className={`text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 ${technician ? 'bg-yellow-600' : 'bg-blue-600'}`}>
                                            <Wrench size={10} className="animate-pulse"/> 
                                            {technician ? `MAINTENANCE BY ${technician.toUpperCase()}` : 'MAINTENANCE REQ'}
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`font-bold text-lg text-white truncate pr-2 ${!isMachineRestricted ? 'group-hover:text-blue-400' : ''} transition-colors`}>{machine.name}</span>
                                    {isDataItemVisible(userRole, 'MACHINE_CARD_STATUS') && <StatusBadge status={machine.status} />}
                                </div>
                                <div className="grid grid-cols-2 gap-3 mt-1">
                                    {isDataItemVisible(userRole, 'MACHINE_CARD_OUTPUT') && (
                                        <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/30">
                                            <p className="text-slate-500 text-xs font-semibold uppercase">{outputLabel}</p>
                                            <p className="font-mono text-slate-100 text-lg font-bold mt-0.5">{scaledOutput.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                        </div>
                                    )}
                                    {isDataItemVisible(userRole, 'MACHINE_CARD_OEE') && (
                                        <div className="bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/30">
                                            <p className="text-slate-500 text-xs font-semibold uppercase">OEE</p>
                                            <p className={`font-mono text-lg font-bold mt-0.5 ${scaledOEE >= 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>{(scaledOEE * 100).toFixed(0)}%</p>
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
        </div>
    );
};

// --- Helper Pages & Wrappers ---

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in">
        <div className="bg-rose-500/10 p-8 rounded-full border border-rose-500/20">
            <ShieldAlert size={64} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-slate-400 text-base max-w-md">
            Your user role does not have permission to access this resource. 
            If you believe this is an error, please contact the System Administrator.
        </p>
        <Link to="/dashboard/global" className="bg-blue-600 px-6 py-2.5 rounded-lg text-white font-bold hover:bg-blue-700 transition-colors text-sm">
            Return to Dashboard
        </Link>
    </div>
);

const MachineDetailWrapper: React.FC<{ user: User }> = ({ user }) => {
    const { machineId } = useParams<{ machineId: string }>();
    const navigate = useNavigate();
    const machine = getMachineById(machineId || '');

    if (!machine) return <div className="p-8 text-center text-slate-500 text-xl">Machine not found</div>;

    return <MachineDetail machine={machine} onBack={() => navigate(-1)} userRole={user.role} currentUser={user.name} />;
};

const LVMDPDetailWrapper: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { panelId } = useParams<{ panelId: string }>();
    const navigate = useNavigate();
    const panel = getLVMDPById(panelId || '');

    if (!panel) return <div className="p-8 text-center text-slate-500 text-xl">Panel not found</div>;

    return <LVMDPDetail lvmdp={panel} onBack={() => navigate(-1)} userRole={userRole} />;
};

const UtilitySummaryWrapper: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { plantId, type } = useParams<{ plantId: string, type: string }>();
    const navigate = useNavigate();
    const plant = PLANTS[plantId as PlantCode];

    if (!plant) return <div className="p-8 text-center text-slate-500 text-xl">Plant not found</div>;

    return <UtilitySummary plant={plant} type={type || 'electricity'} onBack={() => navigate(-1)} userRole={userRole} />;
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
        if (path.includes('/utility/')) {
            const parts = path.split('/');
            const type = parts[2] || 'Utility';
            return `Utility / ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        }
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
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight">
                            SmartMonitor
                        </span>
                    ) : (
                        <Activity className="text-blue-400 w-6 h-6" />
                    )}
                </div>

                <nav className="flex-1 py-6 space-y-1 px-3">
                    <Link 
                        to="/dashboard/global"
                        className={`w-full flex items-center p-3 rounded-lg transition-colors ${location.pathname.includes('/dashboard/global') ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} />
                        {sidebarOpen && <span className="ml-3 font-semibold text-base">Dashboard</span>}
                    </Link>

                    <div className="pt-4 pb-2 px-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {sidebarOpen && 'Plants'}
                    </div>
                    {Object.values(PLANTS).map(plant => (
                        <Link
                            key={plant.id}
                            to={`/plants/${plant.id}`}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${location.pathname.includes(`/plants/${plant.id}`) ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Factory size={20} />
                            {sidebarOpen && <span className="ml-3 font-semibold text-base truncate">{plant.name}</span>}
                        </Link>
                    ))}

                    {user.role === UserRole.ADMINISTRATOR && (
                        <div className="pt-4 border-t border-slate-800 mt-4">
                            <Link 
                                to="/settings"
                                className={`w-full flex items-center p-3 rounded-lg transition-colors ${location.pathname === '/settings' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Settings size={20} />
                                {sidebarOpen && <span className="ml-3 font-semibold text-base">Settings</span>}
                            </Link>
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={onLogout}
                        className="flex items-center text-slate-400 hover:text-white transition-colors w-full p-2"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3 font-semibold text-base">Logout</span>}
                    </button>
                </div>
            </aside>

             <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-slate-900/50 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 mr-4">
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h2 className="text-base font-semibold text-slate-400">{breadcrumb}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-1">
                            <span className="text-sm font-bold text-white">{user.name}</span>
                            <span className="text-xs text-slate-400 font-medium">{user.role}</span>
                        </div>
                        <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                            {user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Main Content - Balanced Full Width */}
                <main className="flex-1 overflow-y-auto bg-slate-950 scroll-smooth">
                    <div className="mx-auto w-full max-w-[1800px] px-8 py-6 pb-12 min-[2000px]:px-12">
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
                                <MachineDetailWrapper user={user} />
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
                        path="utility/:type/:plantId" 
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
