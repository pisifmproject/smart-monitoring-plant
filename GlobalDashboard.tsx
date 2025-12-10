import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole, User } from './types';
import { Card, MetricCard, StatusBadge, formatNumber } from './components/SharedComponents';
import { isDataItemVisible } from './services/visibilityStore';
import { dashboardService } from './services/dashboardService';
import { Globe, Activity, Zap, AlertTriangle, Factory } from 'lucide-react';

interface GlobalDashboardProps {
    user: User;
}

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

const GlobalDashboard: React.FC<GlobalDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('DAY');
    const { role: userRole } = user;

    const kpis = useMemo(() => dashboardService.getGlobalKPIs(period), [period]);
    const plants = useMemo(() => dashboardService.getPlantOverview(period), [period]);

    const plantsToShow = useMemo(() => {
        if (user.role === UserRole.ADMINISTRATOR || !user.plantAccess || user.plantAccess.length === 0) {
            return plants;
        }
        return plants.filter(p => user.plantAccess?.includes(p.id));
    }, [plants, user]);

    const canDrillDown = true; // Always allow drill down

    const FilterButton = ({ label }: { label: Period }) => (
        <button 
            onClick={() => setPeriod(label)}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                period === label 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
        >
            {label}
        </button>
    );

    const showAlarms = ![UserRole.VIEWER, UserRole.MANAGEMENT].includes(userRole);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Globe className="text-blue-500" size={28} />
                        Corporate Overview
                    </h1>
                    <p className="text-slate-300 text-sm font-medium mt-1">Multi-Plant Performance Monitor</p>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1 self-start sm:self-auto">
                    <FilterButton label="DAY" />
                    <FilterButton label="WEEK" />
                    <FilterButton label="MONTH" />
                    <FilterButton label="YEAR" />
                </div>
            </div>

            <Card title="Global Performance At a Glance">
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${!showAlarms ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-5`}>
                    {isDataItemVisible(userRole, 'GLOBAL_OUTPUT_TODAY') && (
                        <MetricCard 
                            title={`Total Output (${period})`}
                            value={formatNumber(kpis.totalOutput)} 
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
                            value={formatNumber(kpis.avgOEE)} 
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
                            value={formatNumber(kpis.totalEnergy)} 
                            unit="kWh" 
                            icon={Zap} 
                            trend="0.8%" 
                            trendUp={false} 
                            color="text-yellow-400"
                        />
                    )}
                    {showAlarms && isDataItemVisible(userRole, 'GLOBAL_TOTAL_ALARMS') && (
                        <MetricCard 
                            title="Active Alarms" 
                            value={kpis.totalAlarmsValue} 
                            icon={AlertTriangle} 
                            color="text-rose-400"
                        />
                    )}
                </div>
            </Card>

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Factory size={20} className="text-slate-300"/> Plant Status Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-5">
                    {plantsToShow.map(plant => {
                        const visibilityKey = `GLOBAL_PLANT_${plant.id}`;
                        if (!isDataItemVisible(userRole, visibilityKey)) return null;

                        const plantStatus = !showAlarms ? 'NORMAL' : plant.computedStatus;

                        return (
                            <div 
                                key={plant.id}
                                onClick={() => canDrillDown && navigate(`/app/plants/${plant.id}`)}
                                className={`bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-sm transition-all duration-300 group relative overflow-hidden ${
                                    canDrillDown ? 'hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'opacity-90 cursor-default'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{plant.name}</h3>
                                        <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider mt-1">{plant.location}</p>
                                    </div>
                                    <StatusBadge status={plantStatus} />
                                </div>

                                <div className="grid grid-cols-2 gap-y-5 gap-x-4 relative z-10 pt-4 mt-4 border-t border-slate-700/50">
                                    <div>
                                        <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Output</p>
                                        <p className="text-white font-mono font-bold text-lg">{formatNumber(plant.scaledOutput)} <span className="text-xs font-normal text-slate-400">kg</span></p>
                                    </div>
                                    <div>
                                        <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">OEE</p>
                                        <p className={`font-mono font-bold text-lg ${plant.scaledOEE >= 80 ? 'text-emerald-400' : plant.scaledOEE >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                                            {formatNumber(plant.scaledOEE)}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Energy</p>
                                        <p className="text-yellow-400 font-mono font-bold">{formatNumber(plant.scaledEnergy)} <span className="text-xs font-normal text-slate-400">kWh</span></p>
                                    </div>
                                    {showAlarms && (
                                        <div>
                                            <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Alarms</p>
                                            <p className={`font-mono font-bold ${plant.alarmCount > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                                                {plant.alarmCount} Active
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="absolute -top-8 -right-8 w-36 h-36 bg-slate-700/10 rounded-full pointer-events-none group-hover:scale-125 group-hover:bg-blue-900/20 transition-transform duration-300"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GlobalDashboard;