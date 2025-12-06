
import React, { useState, useMemo } from 'react';
import { Plant, UserRole } from '../types';
import { Card, MetricCard } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { utilityService } from '../services/utilityService';
import { maintenanceService } from '../services/maintenanceService'; // Import maintenanceService
import { ArrowLeft, Zap, TrendingUp, Clock, ChevronsUp, ChevronsDown, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Legend, Pie, PieChart, BarChart as RechartsBarChart } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface UtilitySummaryProps {
    plant: Plant;
    type: string;
    onBack: () => void;
    userRole: UserRole;
}

type Period = 'Day' | 'Week' | 'Month' | 'Year';

const UtilitySummary: React.FC<UtilitySummaryProps> = ({ plant, type, onBack, userRole }) => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('Day');

    // Context for visibility check - Only plantId is needed
    const visibilityContext = { plantId: plant.id };

    const config = useMemo(() => utilityService.getUtilityConfig(plant, type, period), [type, plant, period]);
    const trendData = useMemo(() => utilityService.getTrendData(config, period), [config, period]);
    const genericBreakdownData = useMemo(() => utilityService.getGenericBreakdown(), []);
    const quickStats = useMemo(() => utilityService.getQuickStats(config), [config]);
    
    // Period is already in correct format for utilityService
    const { periodMult } = utilityService.getMultipliers(plant.id, period);

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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"><ArrowLeft size={24} /></button>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2"><config.icon className={config.color} size={28} />{config.label} Detail</h1>
                        <p className="text-slate-400 text-sm font-medium">{plant.name}</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1 self-end sm:self-auto">
                    <FilterButton label="Day" />
                    <FilterButton label="Week" />
                    <FilterButton label="Month" />
                    <FilterButton label="Year" />
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                <MetricCard 
                    title={`Total ${config.label} (${period})`}
                    value={config.value.toLocaleString(undefined, { maximumFractionDigits: 1 })} 
                    unit={config.unit} 
                    icon={config.icon} 
                    trend={Math.abs(config.trend) + '%'} 
                    trendUp={config.trend > 0}
                    color={config.color}
                />
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card title={`${config.label} Usage Trend (${period})`} className="xl:col-span-2 min-h-[350px]">
                     <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} />
                            <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}/>
                            <Line type="monotone" dataKey="value" stroke={config.color.replace('text-', '#').split('-')[0]} strokeWidth={2} name={`Usage (${config.unit})`} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card title="Quick Stats">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg"><ChevronsUp size={20}/></div>
                            <div>
                                <p className="text-sm text-slate-400">Peak Usage</p>
                                <p className="text-lg font-bold text-white">{quickStats.peak.value} {quickStats.peak.unit}</p>
                                <p className="text-xs text-slate-500">at {quickStats.peak.time}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><Clock size={20}/></div>
                            <div>
                                <p className="text-sm text-slate-400">Average Usage</p>
                                <p className="text-lg font-bold text-white">{quickStats.average.value} {quickStats.average.unit}</p>
                            </div>
                        </div>
                         <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><ChevronsDown size={20}/></div>
                            <div>
                                <p className="text-sm text-slate-400">Lowest Usage</p>
                                <p className="text-lg font-bold text-white">{quickStats.low.value} {quickStats.low.unit}</p>
                                <p className="text-xs text-slate-500">at {quickStats.low.time}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <h3 className="text-xl font-bold text-slate-200 mt-2 mb-4 flex items-center gap-2">
                <TrendingUp size={22} /> {config.breakdownTitle}
            </h3>

            {type.toLowerCase() === 'electricity' ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                    {plant.lvmdps.map((panel) => {
                        const hasActiveAlarm = maintenanceService.hasActiveAlarm(panel.id);
                        const maintenanceUser = maintenanceService.getAlarmInProgress(panel.id);

                        return (
                            isDataItemVisible(userRole, 'LV_PANEL_ENERGY_TODAY', visibilityContext) && (
                                <div key={panel.id} onClick={() => navigate(`/app/lvmdp/${panel.id}`)} className="cursor-pointer">
                                    <Card className={`hover:border-blue-500 transition-all h-full group ${maintenanceUser ? 'border-blue-500/30 bg-blue-900/10' : hasActiveAlarm ? 'border-rose-500/30 bg-rose-900/10' : ''}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400"><Zap size={20} /></div>
                                            {maintenanceUser ? (
                                                <div className="flex items-center gap-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-2 py-1 rounded text-[10px] font-bold uppercase">
                                                    <Clock size={12} /> Maint: {maintenanceUser}
                                                </div>
                                            ) : hasActiveAlarm ? (
                                                <div className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/30 text-rose-400 px-2 py-1 rounded text-[10px] font-bold uppercase animate-pulse">
                                                    <AlertTriangle size={12} /> Maintenance Req
                                                </div>
                                            ) : (
                                                <div className="text-slate-600 group-hover:text-blue-400 transition-colors"><TrendingUp size={16} /></div>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-white text-lg mb-1">{panel.name}</h4>
                                        <div className="space-y-2 mt-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400 font-medium">Energy ({period})</span>
                                                <span className="text-white font-mono font-bold">{(panel.energyToday * periodMult).toLocaleString()} kWh</span>
                                            </div>
                                            {isDataItemVisible(userRole, 'LV_PANEL_LOAD_PERCENT', visibilityContext) &&
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400 font-medium">Load</span>
                                                <span className={`font-mono font-bold ${panel.currentLoadPercent > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>{panel.currentLoadPercent}%</span>
                                            </div>}
                                        </div>
                                    </Card>
                                </div>
                            )
                        );
                    })}
                </div>
            ) : (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Consumption by Area (Bar)" className="min-h-[350px]">
                        <ResponsiveContainer width="100%" height={300}>
                            <RechartsBarChart data={genericBreakdownData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" stroke="#94a3b8" tick={{fontSize: 12}} />
                                <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} width={100} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}/>
                                <Bar dataKey="value" fill={config.color.replace('text-', '#').split('-')[0]} name="Consumption (%)" radius={[0, 4, 4, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card title="Consumption by Area (Pie)" className="min-h-[350px]">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={genericBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}/>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                 </div>
            )}
        </div>
    );
};

export default UtilitySummary;
