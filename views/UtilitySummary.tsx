
import React, { useState, useMemo } from 'react';
import { Plant, PlantCode, UserRole } from '../types';
import { Card, MetricCard } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { ArrowLeft, Zap, Droplets, Flame, Wind, Cloud, Box, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

interface UtilitySummaryProps {
    plant: Plant;
    type: string;
    onBack: () => void;
    userRole: UserRole;
}

type Period = 'Day' | 'Week' | 'Month' | 'Year';

const generateTrendData = (base: number, variance: number, period: Period) => {
    let points = 24;
    let labelFormat = (i: number) => `${i}:00`;

    if (period === 'Week') {
        points = 7;
        labelFormat = (i: number) => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
    } else if (period === 'Month') {
        points = 30;
        labelFormat = (i: number) => `Day ${i + 1}`;
    } else if (period === 'Year') {
        points = 12;
        labelFormat = (i: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i];
    }

    return Array.from({ length: points }, (_, i) => ({
        time: labelFormat(i),
        value: Math.max(0, base + (Math.random() * variance * 2 - variance))
    }));
};

const UtilitySummary: React.FC<UtilitySummaryProps> = ({ plant, type, onBack, userRole }) => {
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('Day');

    // Utility Definitions
    const isLargePlant = [PlantCode.CIKOKOL, PlantCode.SEMARANG].includes(plant.id);
    const multiplier = isLargePlant ? 1.5 : 0.8;
    const periodMultiplier = period === 'Day' ? 1 : period === 'Week' ? 7 : period === 'Month' ? 30 : 365;

    // Determine config based on type
    const config = useMemo(() => {
        const t = type.toLowerCase();
        switch (t) {
            case 'electricity':
                const totalElec = plant.lvmdps.reduce((acc, p) => acc + p.energyToday, 0) * periodMultiplier;
                return {
                    label: 'Electricity',
                    unit: 'kWh',
                    icon: Zap,
                    color: 'text-yellow-400',
                    value: totalElec,
                    trend: 12,
                    trendBase: 150 * multiplier * periodMultiplier,
                    variance: 20 * multiplier * periodMultiplier,
                    breakdownTitle: 'Panel Breakdown'
                };
            case 'water':
                return {
                    label: 'Water',
                    unit: 'm³',
                    icon: Droplets,
                    color: 'text-blue-400',
                    value: 450 * multiplier * periodMultiplier,
                    trend: -5,
                    trendBase: 20 * multiplier * periodMultiplier,
                    variance: 5 * multiplier * periodMultiplier,
                    breakdownTitle: 'Area Consumption'
                };
            case 'gas':
                return {
                    label: 'Natural Gas',
                    unit: 'Nm³',
                    icon: Flame,
                    color: 'text-rose-400',
                    value: 1200 * multiplier * periodMultiplier,
                    trend: 2,
                    trendBase: 50 * multiplier * periodMultiplier,
                    variance: 10 * multiplier * periodMultiplier,
                    breakdownTitle: 'Area Consumption'
                };
            case 'steam':
                return {
                    label: 'Steam',
                    unit: 'Ton',
                    icon: Cloud,
                    color: 'text-slate-200',
                    value: 15 * multiplier * periodMultiplier,
                    trend: 8,
                    trendBase: 0.8 * multiplier * periodMultiplier,
                    variance: 0.2 * multiplier * periodMultiplier,
                    breakdownTitle: 'Line Consumption'
                };
            case 'air':
                return {
                    label: 'Compressed Air',
                    unit: 'Nm³',
                    icon: Wind,
                    color: 'text-cyan-400',
                    value: 18000 * multiplier * periodMultiplier,
                    trend: 0,
                    trendBase: 800 * multiplier * periodMultiplier,
                    variance: 50 * multiplier * periodMultiplier,
                    breakdownTitle: 'Line Consumption'
                };
            case 'nitrogen':
                return {
                    label: 'Nitrogen',
                    unit: 'Nm³',
                    icon: Box,
                    color: 'text-emerald-400',
                    value: 450 * multiplier * periodMultiplier,
                    trend: 15,
                    trendBase: 20 * multiplier * periodMultiplier,
                    variance: 2 * multiplier * periodMultiplier,
                    breakdownTitle: 'Line Consumption'
                };
            default:
                return {
                    label: type,
                    unit: 'Units',
                    icon: Box,
                    color: 'text-slate-400',
                    value: 0,
                    trend: 0,
                    trendBase: 100,
                    variance: 10,
                    breakdownTitle: 'Breakdown'
                };
        }
    }, [type, plant, multiplier, periodMultiplier]);

    const trendData = useMemo(() => generateTrendData(config.trendBase, config.variance, period), [config, period]);

    // Mock breakdown data for non-electricity types
    const genericBreakdownData = [
        { name: 'Production A', value: 40 },
        { name: 'Production B', value: 30 },
        { name: 'Utility', value: 15 },
        { name: 'General', value: 15 },
    ];

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
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                            <config.icon className={config.color} size={28} />
                            {config.label} Detail
                        </h1>
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

            {/* KPI Card */}
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

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Trend Chart */}
                <Card title={`${config.label} Usage Trend (${period})`} className="xl:col-span-2">
                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 13}} />
                            <YAxis stroke="#94a3b8" tick={{fontSize: 13}} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '14px' }} />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                name={`${config.label} (${config.unit})`} 
                                stroke="#3b82f6" 
                                strokeWidth={3} 
                                dot={false} 
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Right Side Stats */}
                <Card title="Quick Stats">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                            <span className="text-slate-400 text-sm font-medium">Peak Usage</span>
                            <span className="font-mono text-white text-base font-bold">
                                {Math.max(...trendData.map(d => d.value)).toFixed(1)} {config.unit}
                            </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                            <span className="text-slate-400 text-sm font-medium">Avg Usage</span>
                            <span className="font-mono text-white text-base font-bold">
                                {(trendData.reduce((a,b) => a + b.value, 0) / trendData.length).toFixed(1)} {config.unit}
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                            <span className="text-slate-400 text-sm font-medium">Efficiency Status</span>
                            <span className="font-mono text-emerald-400 font-bold text-base">Optimal</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Breakdown Section - Specific to Utility Type */}
            <h3 className="text-xl font-bold text-slate-200 mt-2 mb-4 flex items-center gap-2">
                <TrendingUp size={22} /> {config.breakdownTitle}
            </h3>

            {type.toLowerCase() === 'electricity' ? (
                /* ELECTRICITY: Show Panels */
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                    {plant.lvmdps.map((panel, idx) => {
                         // Scale panel energy based on period logic mock
                         const panelEnergy = panel.energyToday * periodMultiplier;
                         
                         const CardContent = (
                            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-all h-full shadow-sm group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                                        <Zap size={20} />
                                    </div>
                                    <div className="text-slate-600 group-hover:text-blue-400 transition-colors">
                                        <TrendingUp size={16} />
                                    </div>
                                </div>
                                <h4 className="font-bold text-white text-lg mb-1">{panel.name}</h4>
                                <div className="space-y-2 mt-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Energy ({period})</span>
                                        <span className="text-white font-mono font-bold">{panelEnergy.toLocaleString()} kWh</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Load</span>
                                        <span className={`font-mono font-bold ${panel.currentLoadPercent > 80 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {panel.currentLoadPercent}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );

                        return (
                            <div key={panel.id} onClick={() => navigate(`/lvmdp/${panel.id}`)}>
                                {CardContent}
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* OTHER UTILITIES: Show Generic Breakdown */
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Consumption by Area">
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={genericBreakdownData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={110} tick={{fontSize: 12, fontWeight: 500}} />
                                <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '14px' }} />
                                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} name="% Usage" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                 </div>
            )}
        </div>
    );
};

export default UtilitySummary;
