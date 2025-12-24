
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserRole, AlarmSeverity, Alarm } from '../types';
import { Card, MetricCard, StatusBadge, formatNumber } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { dashboardService } from '../services/dashboardService';
import { plantService } from '../services/plantService';
import { maintenanceService } from '../services/maintenanceService';
import { 
    Factory, Activity, Zap, AlertTriangle, 
    ArrowLeft, TrendingUp, Clock, AlertCircle, AlertOctagon, Info,
    Download, FileText, Loader2, CheckCircle2
} from 'lucide-react';

interface PlantDashboardProps {
    userRole: UserRole;
}

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

const PlantDashboard: React.FC<PlantDashboardProps> = ({ userRole }) => {
    const { plantId } = useParams();
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('DAY');
    
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDownloadToast, setShowDownloadToast] = useState(false);

    const plant = useMemo(() => plantService.getPlantById(plantId || ''), [plantId]);
    
    const kpis = useMemo(() => plant ? dashboardService.getPlantKPIs(plant, period) : null, [plant, period]);
    const utilityMetrics = useMemo(() => plantId ? dashboardService.getUtilityMetrics(plantId, period) : [], [plantId, period]);
    const shifts = useMemo(() => plant ? dashboardService.getShifts(plant) : [], [plant]);
    const activeAlarms = useMemo(() => maintenanceService.getActiveAlarms(plantId), [plantId]);
    const productionMachines = useMemo(() => plantId ? plantService.getProductionLines(plantId, period) : [], [plantId, period]);

    if (!plant || !kpis) return <div className="p-8 text-slate-400">Plant not found</div>;

    // UPDATE: Allow Viewer and Management to navigate to machine detail (which will be restricted to Summary view)
    const canNavigate = true; 
    
    // Actions like clicking specific alarms remain restricted for Viewers
    const canPerformAction = ![UserRole.VIEWER].includes(userRole);
    
    const canDownloadReport = [UserRole.ADMINISTRATOR, UserRole.SUPERVISOR, UserRole.MANAGEMENT].includes(userRole);
    const visibilityContext = { plantId: plant.id };
    const showAlarms = ![UserRole.VIEWER, UserRole.MANAGEMENT].includes(userRole);

    const FilterButton = ({ label }: { label: Period }) => {
        if (userRole === UserRole.OPERATOR && label !== 'DAY') return null;
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

    const getAlarmIcon = (severity: AlarmSeverity) => {
        switch (severity) {
            case AlarmSeverity.CRITICAL: return <AlertOctagon size={16} className="text-rose-500" />;
            case AlarmSeverity.WARNING: return <AlertTriangle size={16} className="text-amber-500" />;
            case AlarmSeverity.INFO: return <Info size={16} className="text-blue-500" />;
            default: return <AlertCircle size={16} className="text-slate-500" />;
        }
    };

    const handleAlarmClick = (alarm: Alarm) => {
        if (!canPerformAction || !alarm.machineId) return;
        const targetTab = userRole === UserRole.MAINTENANCE ? 'Maintenance' : 'Alarms';
        const state = { initialTab: targetTab };
        if (alarm.machineId.includes('LVMDP')) {
            navigate(`/app/lvmdp/${alarm.machineId}`, { state });
        } else {
            navigate(`/app/machines/${alarm.machineId}`, { state });
        }
    };

    const handleDownloadReport = () => {
        if (isDownloading) return;
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            setShowDownloadToast(true);
            setTimeout(() => setShowDownloadToast(false), 3000);
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 w-full relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {userRole !== UserRole.OPERATOR && (
                         <button onClick={() => navigate('/app/dashboard/global')} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
                            <Factory className="text-blue-500" size={28} />
                            {plant.name}
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mt-0.5">{plant.location}</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                    <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1">
                        <FilterButton label="DAY" />
                        <FilterButton label="WEEK" />
                        <FilterButton label="MONTH" />
                        <FilterButton label="YEAR" />
                    </div>

                    {canDownloadReport && (
                        <button 
                            onClick={handleDownloadReport}
                            disabled={isDownloading}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
                        >
                            {isDownloading ? <Loader2 size={16} className="animate-spin text-blue-400" /> : <FileText size={16} className="text-blue-400 group-hover:text-blue-300" />}
                            <span className="hidden sm:inline">{isDownloading ? 'Generating...' : 'Export PDF'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* NEW: Plant At a Glance Card */}
            <Card title="Plant At a Glance">
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${!showAlarms ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-5 mb-6 pb-6 border-b border-slate-700/50`}>
                    {isDataItemVisible(userRole, 'PLANT_OUTPUT_TODAY', visibilityContext) && (
                        <MetricCard title={`Output (${period})`} value={formatNumber(kpis.output)} unit="kg" icon={Factory} trend="3.2%" trendUp={true} />
                    )}
                    {isDataItemVisible(userRole, 'PLANT_OEE', visibilityContext) && (
                        <MetricCard title="OEE" value={formatNumber(kpis.oee)} unit="%" icon={Activity} trend="0.5%" trendUp={true} color="text-emerald-400" />
                    )}
                    {isDataItemVisible(userRole, 'PLANT_POWER_USAGE', visibilityContext) && (
                        <MetricCard title={`Energy (${period})`} value={formatNumber(kpis.energy)} unit="kWh" icon={Zap} trend="1.1%" trendUp={false} color="text-yellow-400" />
                    )}
                    {showAlarms && isDataItemVisible(userRole, 'PLANT_ALARM_COUNT', visibilityContext) && (
                        <MetricCard title="Total Alarms" value={kpis.alarms} icon={AlertTriangle} color="text-rose-400" />
                    )}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-300 mb-4">Utility Consumption ({period})</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                         {utilityMetrics.map((metric) => (
                            isDataItemVisible(userRole, metric.key, visibilityContext) && (
                                <div 
                                    key={metric.key}
                                    onClick={() => canNavigate && navigate(`/app/utility/${metric.type}/${plant.id}`)}
                                    className={`bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 flex items-center gap-3 transition-all duration-200 group ${
                                        canNavigate ? 'hover:border-blue-500 hover:bg-slate-800/50 cursor-pointer' : 'cursor-default'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg bg-slate-700/50 ${metric.color}`}>
                                        <metric.icon size={20} />
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 font-bold">{metric.label}</span>
                                        <div className="text-md font-bold text-white font-mono">
                                            {metric.value} <span className="text-xs text-slate-500">{metric.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                 <div className={!showAlarms ? "lg:col-span-5" : "lg:col-span-3"}>
                    {isDataItemVisible(userRole, 'SHIFT_PERFORMANCE_TABLE', visibilityContext) && (
                        <Card title="Shift Performance">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm min-w-[500px]">
                                    <thead className="bg-slate-900/50 text-slate-400 font-bold uppercase text-xs tracking-wider">
                                        <tr>
                                            <th className="p-3">Shift</th>
                                            <th className="p-3">Time</th>
                                            <th className="p-3">Output (kg)</th>
                                            <th className="p-3 text-center">OEE</th>
                                            <th className="p-3 text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/50 text-slate-300">
                                        {shifts.map((shift) => (
                                            <tr key={shift.id} className={`transition-all duration-200 ${
                                                shift.status === 'ACTIVE' 
                                                ? 'bg-blue-600/20 border-l-4 border-blue-500' 
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
                </div>

                <div className="lg:col-span-2">
                    {showAlarms && isDataItemVisible(userRole, 'ACTIVE_ALARMS_LIST', visibilityContext) && (
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
                                                canPerformAction ? 'cursor-pointer hover:border-blue-500 hover:bg-slate-800 hover:shadow-md' : 'hover:border-slate-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                {getAlarmIcon(alarm.severity)}
                                                <div className="min-w-0">
                                                    <p className="text-white font-bold text-sm group-hover:text-blue-400 transition-colors truncate">{alarm.message}</p>
                                                    <p className="text-xs text-slate-400 truncate">{alarm.timestamp} • {alarm.source}</p>
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
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="text-slate-400" /> Production Lines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {productionMachines.map((machine) => {
                        if (!isDataItemVisible(userRole, `SHOW_MACHINE_${machine.id}`, visibilityContext)) {
                            return null;
                        }
                        const machineContext = { ...visibilityContext, machineId: machine.id };
                        const hasActiveAlarm = maintenanceService.hasActiveAlarm(machine.id);

                        return (
                            <Card 
                                key={machine.id}
                                onClick={() => canNavigate && navigate(`/app/machines/${machine.id}`)}
                                className={`transition-all duration-200 group ${
                                    canNavigate ? 'hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'opacity-90 cursor-default'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{machine.name}</h4>
                                    <StatusBadge status={machine.status} />
                                </div>
                                
                                {showAlarms && hasActiveAlarm && (
                                    <div className="mb-3 bg-rose-500/10 border border-rose-500/20 rounded-md p-1.5 flex items-center gap-2 text-xs font-bold text-rose-400">
                                        <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                                        Maintenance Required
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 mt-auto pt-3 border-t border-slate-700/50">
                                    {isDataItemVisible(userRole, 'MACHINE_CARD_OUTPUT', machineContext) && (
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase">Output</p>
                                            <p className="text-white font-mono font-bold text-lg">{formatNumber(machine.scaledOutput || 0)} <span className="text-xs text-slate-500 font-normal">kg</span></p>
                                        </div>
                                    )}
                                    {isDataItemVisible(userRole, 'MACHINE_CARD_OEE', machineContext) && (
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase">OEE</p>
                                            <p className={`font-mono font-bold text-lg ${
                                                (machine.scaledOEE || 0) * 100 >= 80 ? 'text-emerald-400' : (machine.scaledOEE || 0) * 100 >= 60 ? 'text-amber-400' : 'text-rose-400'
                                            }`}>
                                                {formatNumber((machine.scaledOEE || 0) * 100)}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {showDownloadToast && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl shadow-emerald-900/30 flex items-center gap-3 border border-emerald-500/50">
                        <div className="bg-white/20 p-1 rounded-full">
                            <CheckCircle2 size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Report Downloaded</p>
                            <p className="text-emerald-100 text-xs mt-0.5">Plant_Performance_{period}.pdf</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlantDashboard;
