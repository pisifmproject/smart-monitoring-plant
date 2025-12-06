
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from './types';
import { Card, MetricCard, StatusBadge } from './components/SharedComponents';
import { isDataItemVisible } from './services/visibilityStore';
import { dashboardService } from './services/dashboardService';
import { Globe, Activity, Zap, AlertTriangle, Factory } from 'lucide-react';

interface GlobalDashboardProps {
    userRole: UserRole;
}

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ userRole }) => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('DAY');

    // Fetch Data from Service
    const kpis = useMemo(() => dashboardService.getGlobalKPIs(period), [period]);
    const plants = useMemo(() => dashboardService.getPlantOverview(period), [period]);

    // Role Logic
    const canDrillDown = ![UserRole.MANAGEMENT, UserRole.VIEWER].includes(userRole);

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
        <div className="p-4 md:p-6 space-y-6 animate-in fade-in duration-500 w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Globe className="text-blue-500" size={28} />
                        Corporate Overview
                    </h1>
                    <p className="text-slate-400 text-sm font-medium mt-1">Multi-Plant Performance Monitor</p>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1 self-start md:self-auto">
                    <FilterButton label="DAY" />
                    <FilterButton label="WEEK" />
                    <FilterButton label="MONTH" />
                    <FilterButton label="YEAR" />
                </div>
            </div>

            {/* Corporate KPIs */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                {isDataItemVisible(userRole, 'GLOBAL_OUTPUT_TODAY') && (
                    <MetricCard 
                        title={`Total Output (${period})`}
                        value={kpis.totalOutput.toLocaleString()} 
                        unit="kg" 
                        icon={Factory} 
                        trend="2.5%" 
                        trendUp={true} 
                        color="text-blue-400"
                    />
                )}
                {isDataItemVisible(userRole, 'GLOBAL_OEE') && (
                    <MetricCard 
                        title="Global Avg OEE" 
                        value={kpis.avgOEE.toFixed(1)} 
                        unit="%" 
                        icon={Activity} 
                        trend="1.2%" 
                        trendUp={true} 
                        color="text-emerald-400"
                    />
                )}
                {isDataItemVisible(userRole, 'GLOBAL_TOTAL_ENERGY') && (
                    <MetricCard 
                        title={`Total Energy (${period})`} 
                        value={kpis.totalEnergy.toLocaleString()} 
                        unit="kWh" 
                        icon={Zap} 
                        trend="0.8%" 
                        trendUp={false} 
                        color="text-yellow-400"
                    />
                )}
                {isDataItemVisible(userRole, 'GLOBAL_TOTAL_ALARMS') && (
                    <MetricCard 
                        title="Active Alarms" 
                        value={kpis.totalAlarmsValue} 
                        icon={AlertTriangle} 
                        color="text-rose-400"
                    />
                )}
            </div>

            {/* Plant Status Overview */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Factory size={20} className="text-slate-400"/> Plant Status Overview
                </h2>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                    {plants.map(plant => {
                        const visibilityKey = `GLOBAL_PLANT_${plant.id}`;
                        if (!isDataItemVisible(userRole, visibilityKey)) return null;

                        return (
                            <div 
                                key={plant.id}
                                onClick={() => canDrillDown && navigate(`/app/plants/${plant.id}`)}
                                className={`bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm transition-all duration-200 group relative overflow-hidden ${
                                    canDrillDown ? 'hover:border-blue-500 hover:shadow-md cursor-pointer' : 'opacity-90 cursor-default'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{plant.name}</h3>
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">{plant.location}</p>
                                    </div>
                                    <StatusBadge status={plant.computedStatus} />
                                </div>

                                <div className="grid grid-cols-2 gap-y-4 gap-x-2 relative z-10">
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase">Output</p>
                                        <p className="text-white font-mono font-bold text-lg">{plant.scaledOutput.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase">OEE</p>
                                        <p className={`font-mono font-bold text-lg ${plant.scaledOEE >= 80 ? 'text-emerald-400' : plant.scaledOEE >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                            {plant.scaledOEE.toFixed(1)}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase">Energy</p>
                                        <p className="text-yellow-400 font-mono font-bold">{plant.scaledEnergy.toLocaleString()} <span className="text-xs text-slate-500">kWh</span></p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 text-xs font-bold uppercase">Alarms</p>
                                        <p className={`font-mono font-bold ${plant.alarmCount > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                                            {plant.alarmCount} Active
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GlobalDashboard;
