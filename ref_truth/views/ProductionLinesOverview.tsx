
import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserRole, MachineStatus } from '../types';
import { plantService } from '../services/plantService';
import { dashboardService } from '../services/dashboardService';
import { Card, StatusBadge, formatNumber, MetricCard } from '../components/SharedComponents';
import { ArrowLeft, BarChart3, PieChart, Activity, Box, AlertOctagon } from 'lucide-react';
import { 
    ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface ProductionLinesOverviewProps {
    userRole: UserRole;
}

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

const ProductionLinesOverview: React.FC<ProductionLinesOverviewProps> = ({ userRole }) => {
    const { plantId } = useParams();
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('DAY');

    const plant = useMemo(() => plantService.getPlantById(plantId || ''), [plantId]);
    const machines = useMemo(() => plantId ? plantService.getProductionLines(plantId, period) : [], [plantId, period]);
    const stats = useMemo(() => plantId ? dashboardService.getProductionAggregateStats(plantId, period) : null, [plantId, period]);

    if (!plant || !stats) return <div className="p-8 text-slate-400">Plant not found</div>;

    const statusData = [
        { name: 'Running', value: stats.statusCounts[MachineStatus.RUNNING], color: '#10b981' },
        { name: 'Idle', value: stats.statusCounts[MachineStatus.IDLE], color: '#f59e0b' },
        { name: 'Breakdown', value: stats.statusCounts[MachineStatus.BREAKDOWN], color: '#f43f5e' },
        { name: 'Offline', value: stats.statusCounts[MachineStatus.OFFLINE], color: '#475569' },
    ].filter(d => d.value > 0);

    const oeeData = [
        { name: 'Availability', value: stats.oee.availability * 100, fill: '#3b82f6' },
        { name: 'Performance', value: stats.oee.performance * 100, fill: '#8b5cf6' },
        { name: 'Quality', value: stats.oee.quality * 100, fill: '#10b981' },
    ];

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
        <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            Production Summary
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">{plant.name} • {stats.totalMachines} Lines Configured</p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1 self-start sm:self-auto">
                    <FilterButton label="DAY" />
                    <FilterButton label="WEEK" />
                    <FilterButton label="MONTH" />
                    <FilterButton label="YEAR" />
                </div>
            </div>

            {/* Summary Dashboard Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* 1. Aggregate KPIs */}
                <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <MetricCard 
                        title="Overall Plant OEE" 
                        value={formatNumber(stats.oee.overall * 100)} 
                        unit="%" 
                        icon={Activity} 
                        color="text-emerald-400"
                        trend="1.2%"
                        trendUp={true}
                    />
                    <MetricCard 
                        title={`Total Output (${period})`} 
                        value={formatNumber(stats.totalOutput)} 
                        unit="kg" 
                        icon={Box} 
                        color="text-blue-400"
                    />
                     <MetricCard 
                        title="Active Breakdowns" 
                        value={stats.statusCounts[MachineStatus.BREAKDOWN]} 
                        icon={AlertOctagon} 
                        color={stats.statusCounts[MachineStatus.BREAKDOWN] > 0 ? "text-rose-400" : "text-slate-400"}
                    />
                    <MetricCard 
                        title="Running Lines" 
                        value={`${stats.statusCounts[MachineStatus.RUNNING]} / ${stats.totalMachines}`} 
                        icon={BarChart3} 
                        color="text-emerald-400"
                    />
                </div>

                {/* 2. OEE Factors Chart */}
                <Card title="OEE Factor Analysis" className="min-h-[300px]">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={oeeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" tick={{fontSize: 12}} />
                            <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} width={80} />
                            <Tooltip 
                                formatter={(val: number) => `${formatNumber(val)}%`}
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {oeeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* 3. Status Distribution */}
                <Card title="Line Status Distribution" className="min-h-[300px]">
                     <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                            <Legend verticalAlign="bottom" height={36}/>
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </Card>

                 {/* 4. Top Performers (Mock Data for Viz) */}
                 <Card title="Top Performing Lines (OEE)" className="min-h-[300px]">
                    <div className="space-y-3">
                        {machines
                            .sort((a, b) => b.scaledOEE - a.scaledOEE)
                            .slice(0, 5)
                            .map((m, i) => (
                                <div key={m.id} className="flex items-center justify-between p-2 rounded bg-slate-900/50 border border-slate-700/30">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-medium text-slate-200">{m.name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400">{formatNumber(m.scaledOEE * 100)}%</span>
                                </div>
                            ))
                        }
                    </div>
                 </Card>
            </div>

            {/* Separator */}
            <div className="border-t border-slate-800 my-4"></div>

            {/* Detailed Grid List */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">All Production Lines</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                    {machines.map((machine) => (
                        <Card 
                            key={machine.id}
                            onClick={() => navigate(`/app/machines/${machine.id}`)}
                            className="cursor-pointer hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group bg-slate-800/50"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors truncate pr-2">{machine.name}</h4>
                                <StatusBadge status={machine.status} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-auto pt-3 border-t border-slate-700/50">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">Output</p>
                                    <p className="text-white font-mono font-bold text-lg">{formatNumber(machine.scaledOutput || 0)} <span className="text-xs text-slate-500 font-normal">kg</span></p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">OEE</p>
                                    <p className={`font-mono font-bold text-lg ${
                                        (machine.scaledOEE || 0) * 100 >= 80 ? 'text-emerald-400' : (machine.scaledOEE || 0) * 100 >= 60 ? 'text-amber-400' : 'text-rose-400'
                                    }`}>
                                        {formatNumber((machine.scaledOEE || 0) * 100)}%
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductionLinesOverview;
