
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';
import { dashboardService } from '../services/dashboardService';
import { plantService } from '../services/plantService';
import { Card, MetricCard, formatNumber } from '../components/SharedComponents';
import { 
    ArrowLeft, Zap, Leaf, Target, TrendingDown, 
    BarChart3, PieChart as PieChartIcon, CheckCircle2, Factory,
    Gauge, DollarSign, Cloud, Activity
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, Cell, ComposedChart, Line
} from 'recharts';

interface UtilitiesOverviewProps {
    userRole: UserRole;
}

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

const UtilitiesOverview: React.FC<UtilitiesOverviewProps> = ({ userRole }) => {
    const { plantId } = useParams();
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('DAY');
    
    const plant = useMemo(() => plantService.getPlantById(plantId || ''), [plantId]);
    const metrics = useMemo(() => plantId ? dashboardService.getUtilityMetrics(plantId, period) : [], [plantId, period]);
    const isoMetrics = useMemo(() => plantId ? dashboardService.getISO50001Metrics(plantId, period) : null, [plantId, period]);

    if (!plant || !isoMetrics) return <div className="p-8 text-slate-400">Plant not found</div>;

    // Mock trend data for SEC chart
    const secTrendData = useMemo(() => {
        const points = 12;
        return Array.from({length: points}, (_, i) => ({
            time: period === 'DAY' ? `${i*2}:00` : `Pt ${i+1}`,
            actual: isoMetrics.sec * (1 + (Math.random() * 0.1 - 0.05)),
            target: isoMetrics.secBaseline,
        }));
    }, [isoMetrics, period]);

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

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Leaf className="text-emerald-500" size={24} />
                            Utilities & Energy Efficiency
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">{plant.name} • Resource Consumption</p>
                    </div>
                </div>
                 <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1 self-start sm:self-auto">
                    <FilterButton label="DAY" />
                    <FilterButton label="WEEK" />
                    <FilterButton label="MONTH" />
                    <FilterButton label="YEAR" />
                </div>
            </div>

            {/* Top Level KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Efficiency Metric</p>
                            <h3 className="text-white text-lg font-bold">Specific Energy Cons.</h3>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-blue-400 font-mono">{formatNumber(isoMetrics.sec, 3)}</span>
                                <span className="text-xs text-slate-400">kWh/kg</span>
                            </div>
                        </div>
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><Gauge size={24}/></div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Baseline: <span className="text-slate-200">{formatNumber(isoMetrics.secBaseline, 3)}</span></span>
                        <span className={`font-bold ${isoMetrics.sec <= isoMetrics.secBaseline ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isoMetrics.sec <= isoMetrics.secBaseline ? 'Efficient' : 'Over Limit'}
                        </span>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                     <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Environment</p>
                            <h3 className="text-white text-lg font-bold">Carbon Footprint</h3>
                             <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-emerald-400 font-mono">{formatNumber(isoMetrics.co2Emissions / 1000, 2)}</span>
                                <span className="text-xs text-slate-400">Ton CO2e</span>
                            </div>
                        </div>
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Cloud size={24}/></div>
                    </div>
                     <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Factor: 0.85 kg/kWh</span>
                         <span className="text-emerald-400 font-bold flex items-center gap-1"><TrendingDown size={12}/> 2.4%</span>
                    </div>
                </Card>
                
                <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                     <div className="flex justify-between items-start">
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Consumption</p>
                            <h3 className="text-white text-lg font-bold">Total Energy</h3>
                             <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-yellow-400 font-mono">{formatNumber(isoMetrics.totalEnergyKWh)}</span>
                                <span className="text-xs text-slate-400">kWh</span>
                            </div>
                        </div>
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400"><Zap size={24}/></div>
                    </div>
                     <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-xs">
                        <span className="text-slate-400">Vs Production: <span className="text-white">{formatNumber(isoMetrics.totalProductionKg)} kg</span></span>
                    </div>
                </Card>
            </div>

            {/* SEC Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Energy Efficiency Trend (SEC) vs Baseline" className="lg:col-span-2 min-h-[400px]">
                    <div className="h-[350px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={secTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} label={{ value: 'SEC (kWh/kg)', angle: -90, position: 'insideLeft', dx: -15, fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip 
                                    formatter={(val: number) => formatNumber(val, 4)} 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Legend verticalAlign="top" height={36}/>
                                <Area type="monotone" dataKey="actual" fill="#3b82f6" fillOpacity={0.2} stroke="#3b82f6" name="Actual SEC" />
                                <Line type="step" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Target (Baseline)" dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-6">
                     <Card title="Utility Breakdown">
                        <div className="space-y-4">
                            {metrics.map((metric) => (
                                <div 
                                    key={metric.key} 
                                    onClick={() => navigate(`/app/utility/${metric.type}/${plant.id}`)}
                                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:bg-slate-800 cursor-pointer transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-md bg-slate-800 ${metric.color}`}>
                                            <metric.icon size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200 group-hover:text-white">{metric.label}</p>
                                            <p className="text-xs text-slate-500">Target: {formatNumber(Number(metric.value) * 0.95)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-white font-mono">{metric.value}</p>
                                        <p className="text-[10px] text-slate-400 uppercase">{metric.unit}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UtilitiesOverview;
