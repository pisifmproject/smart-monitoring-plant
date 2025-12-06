import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserRole, AlarmSeverity, Alarm } from './types';
import { Card, MetricCard, StatusBadge, formatNumber } from './components/SharedComponents';
import { isDataItemVisible } from './services/visibilityStore';
import { dashboardService } from './services/dashboardService';
import { plantService } from './services/plantService';
import { maintenanceService } from './services/maintenanceService';
import { 
    Factory, Activity, Zap, AlertTriangle, 
    ArrowLeft, TrendingUp, Clock, AlertCircle, AlertOctagon, Info
} from 'lucide-react';

interface PlantDashboardProps {
    userRole: UserRole;
}

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

const PlantDashboard: React.FC<PlantDashboardProps> = ({ userRole }) => {
    const { plantId } = useParams();
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('DAY');

    const plant = plantService.getPlantById(plantId || '');
    
    // Services
    const kpis = useMemo(() => plant ? dashboardService.getPlantKPIs(plant, period) : null, [plant, period]);
    const utilityMetrics = useMemo(() => plantId ? dashboardService.getUtilityMetrics(plantId, period) : [], [plantId, period]);
    const shifts = useMemo(() => plant ? dashboardService.getShifts(plant) : [], [plant]);
    const activeAlarms = useMemo(() => maintenanceService.getActiveAlarms(plantId), [plantId]); // Alarms are always real-time
    const productionMachines = useMemo(() => plantId ? plantService.getProductionLines(plantId, period) : [], [plantId, period]);

    if (!plant || !kpis) return <div className="p-8 text-slate-400">Plant not found</div>;

    // Role Logic
    const canClickDetails = ![UserRole.MANAGEMENT, UserRole.VIEWER].includes(userRole);
    const visibilityContext = { plantId: plant.id };

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

    // Helper for Alarm Icons
    const getAlarmIcon = (severity: AlarmSeverity) => {
        switch (severity) {
            case AlarmSeverity.CRITICAL: return <AlertOctagon size={16} className="text-rose-500" />;
            case AlarmSeverity.WARNING: return <AlertTriangle size={16} className="text-amber-500" />;
            case AlarmSeverity.INFO: return <Info size={16} className="text-blue-500" />;
            default: return <AlertCircle size={16} className="text-slate-500" />;
        }
    };

    const handleAlarmClick = (alarm: Alarm) => {
        if (!canClickDetails) return;
        
        // Safety check if machineId exists
        if (!alarm.machineId) return;

        // Determine target tab based on role
        // MAINTENANCE role -> 'Maintenance' tab (and scroll to form)
        // Others -> 'Alarms' tab (history)
        const targetTab = userRole === UserRole.MAINTENANCE ? 'Maintenance' : 'Alarms';

        // State to force opening the specific tab
        const state = { initialTab: targetTab };

        // Check if it is an LVMDP or a Machine based on ID convention
        if (alarm.machineId.includes('LVMDP')) {
            navigate(`/app/lvmdp/${alarm.machineId}`, { state });
        } else {
            navigate(`/app/machines/${alarm.machineId}`, { state });
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-300 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/app/dashboard/global')} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                            <Factory className="text-blue-500" size={28} />
                            {plant.name}
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mt-0.5">{plant.location}</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1 self-start md:self-auto">
                    <FilterButton label="DAY" />
                    <FilterButton label="WEEK" />
                    <FilterButton label="MONTH" />
                    <FilterButton label="YEAR" />
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                {isDataItemVisible(userRole, 'PLANT_OUTPUT_TODAY', visibilityContext) && (
                    <MetricCard 
                        title={`Output (${period})`} 
                        value={formatNumber(kpis.output)} 
                        unit="kg" 
                        icon={Factory} 
                        trend="3.2%" 
                        trendUp={true} 
                    />
                )}
                {isDataItemVisible(userRole, 'PLANT_OEE', visibilityContext) && (
                    <MetricCard 
                        title="OEE" 
                        value={formatNumber(kpis.oee)} 
                        unit="%" 
                        icon={Activity} 
                        trend="0.5%" 
                        trendUp={true} 
                        color="text-emerald-400" 
                    />
                )}
                {isDataItemVisible(userRole, 'PLANT_POWER_USAGE', visibilityContext) && (
                    <MetricCard 
                        title={`Energy (${period})`} 
                        value={formatNumber(kpis.energy)} 
                        unit="kWh" 
                        icon={Zap} 
                        trend="1.1%" 
                        trendUp={false} 
                        color="text-yellow-400" 
                    />
                )}
                {isDataItemVisible(userRole, 'PLANT_ALARM_COUNT', visibilityContext) && (
                    <MetricCard 
                        title="Total Alarms" 
                        value={kpis.alarms} 
                        icon={AlertTriangle} 
                        color="text-rose-400" 
                    />
                )}
            </div>

            {/* Utility Summary Cards */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                {utilityMetrics.map((metric) => (
                    isDataItemVisible(userRole, metric.key, visibilityContext) && (
                        <div 
                            key={metric.key}
                            onClick={() => canClickDetails && navigate(`/app/utility/${metric.type}/${plant.id}`)}
                            className={`bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col justify-between shadow-sm transition-all duration-200 group ${
                                canClickDetails ? 'hover:border-blue-500 hover:shadow-md cursor-pointer' : 'opacity-90 cursor-default'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg bg-slate-700/50 ${metric.color}`}>
                                    <metric.icon size={20} />
                                </div>
                                <TrendingUp className="text-slate-600 group-hover:text-blue-400 transition-colors" size={16} />
                            </div>
                            <div>
                                <span className="text-xs text-slate-400 font-bold uppercase">{metric.label}</span>
                                <div className="text-lg font-bold text-white font-mono mt-1">
                                    {metric.value} <span className="text-xs text-slate-500">{metric.unit}</span>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* Shift Performance & Active Alarms */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {isDataItemVisible(userRole, 'SHIFT_PERFORMANCE_TABLE', visibilityContext) && (
                    <Card title="Shift Performance">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-900/50 text-slate-400 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="p-3">Shift</th>
                                        <th className="p-3">Time</th>
                                        <th className="p-3">Output (kg)</th>
                                        <th className="p-3 text-center">OEE</th>
                                        <th className="p-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 text-slate-300">
                                    {shifts.map((shift) => (
                                        <tr key={shift.id} className={`transition-all duration-200 ${
                                            shift.status === 'ACTIVE' 
                                            ? 'bg-blue-600/20 border-l-4 border-blue-500 shadow-lg shadow-blue-900/10' 
                                            : 'hover:bg-slate-800/50 border-l-4 border-transparent'
                                        }`}>
                                            <td className="p-3 font-semibold text-white">{shift.name}</td>
                                            <td className="p-3 font-mono text-xs">{shift.time}</td>
                                            <td className="p-3 font-mono">{formatNumber(shift.output)}</td>
                                            <td className="p-3 text-center">
                                                <span className={`font-bold ${shift.oee > 0.8 ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                    {formatNumber(shift.oee * 100)}%
                                                </span>
                                            </td>
                                            <td className="p-3 text-center">
                                                <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${
                                                    shift.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                                                }`}>
                                                    {shift.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {isDataItemVisible(userRole, 'ACTIVE_ALARMS_LIST', visibilityContext) && (
                    <Card title="Active Alarms">
                        {activeAlarms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                                <Clock size={32} className="mb-2 opacity-50" />
                                <p>No active alarms</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                                {activeAlarms.map((alarm) => (
                                    <div 
                                        key={alarm.id} 
                                        onClick={() => handleAlarmClick(alarm)}
                                        className={`flex items-center justify-between bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 transition-all duration-200 group ${
                                            canClickDetails ? 'cursor-pointer hover:border-blue-500 hover:bg-slate-800 hover:shadow-md' : 'hover:border-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {getAlarmIcon(alarm.severity)}
                                            <div>
                                                <p className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors">{alarm.message}</p>
                                                <p className="text-xs text-slate-400">{alarm.timestamp} • {alarm.source}</p>
                                                {/* Maintenance Progress Indicator */}
                                                {maintenanceService.getAlarmInProgress(alarm.machineId || '') && (
                                                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-500/30">
                                                        <Clock size={10} /> Maintenance by {maintenanceService.getAlarmInProgress(alarm.machineId || '')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <StatusBadge status={alarm.severity} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                )}
            </div>

            {/* Production Lines Grid */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="text-slate-400" /> Production Lines
                </h3>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
                    {productionMachines.map((machine) => {
                        // Check if this specific machine should be visible based on its unique key
                        if (!isDataItemVisible(userRole, `SHOW_MACHINE_${machine.id}`, visibilityContext)) {
                            return null;
                        }

                        const machineContext = { ...visibilityContext, machineId: machine.id };
                        const maintenanceUser = maintenanceService.getAlarmInProgress(machine.id);
                        const hasActiveAlarm = maintenanceService.hasActiveAlarm(machine.id);

                        return (
                            <div 
                                key={machine.id}
                                onClick={() => canClickDetails && navigate(`/app/machines/${machine.id}`)}
                                className={`bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm relative overflow-hidden transition-all duration-200 group ${
                                    canClickDetails ? 'hover:border-blue-500 hover:shadow-md cursor-pointer' : 'opacity-90 cursor-default'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <h4 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{machine.name}</h4>
                                        {userRole === UserRole.ADMINISTRATOR && (
                                            <p className="text-xs text-slate-400 uppercase tracking-wider">{machine.code}</p>
                                        )}
                                    </div>
                                    <StatusBadge status={machine.status} />
                                </div>

                                {maintenanceUser ? (
                                    <div className="mb-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 flex items-center gap-2 text-xs font-bold text-blue-400">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        Maintenance by {maintenanceUser}
                                    </div>
                                ) : hasActiveAlarm ? (
                                    <div className="mb-4 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 flex items-center gap-2 text-xs font-bold text-rose-400">
                                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                                        Maintenance Required
                                    </div>
                                ) : null}

                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    {isDataItemVisible(userRole, 'MACHINE_CARD_OUTPUT', machineContext) && (
                                        <div>
                                            <p className="text-slate-500 text-xs font-bold uppercase">Output ({period})</p>
                                            <p className="text-white font-mono font-bold text-lg">{formatNumber(machine.scaledOutput || 0)} <span className="text-xs text-slate-500 font-normal">kg</span></p>
                                        </div>
                                    )}
                                    {isDataItemVisible(userRole, 'MACHINE_CARD_OEE', machineContext) && (
                                        <div>
                                            <p className="text-slate-500 text-xs font-bold uppercase">OEE</p>
                                            <p className={`font-mono font-bold text-lg ${
                                                (machine.scaledOEE || 0) >= 0.8 ? 'text-emerald-400' : (machine.scaledOEE || 0) >= 0.6 ? 'text-amber-400' : 'text-rose-400'
                                            }`}>
                                                {formatNumber((machine.scaledOEE || 0) * 100)}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {/* Decorative bar */}
                                <div className={`absolute bottom-0 left-0 h-1 transition-all duration-300 ${
                                    machine.status === 'RUNNING' ? 'bg-emerald-500 w-full' : 
                                    machine.status === 'IDLE' ? 'bg-amber-500 w-2/3' : 
                                    'bg-rose-500 w-full'
                                }`}></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlantDashboard;