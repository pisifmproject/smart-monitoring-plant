
import React, { useState } from 'react';
import { PlantCode, UserRole } from '../types';
import { Card, MetricCard } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { ArrowLeft, Zap, Droplets, Flame, Wind, Cloud, Box } from 'lucide-react'; // Box used as generic container or Nitrogen cylinder
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface UtilitySummaryProps {
    plantId: PlantCode;
    plantName: string;
    onBack: () => void;
    userRole: UserRole;
}

const generateTrendData = (base: number, variance: number) => {
    return Array.from({ length: 24 }, (_, i) => ({
        time: `${i}:00`,
        value: Math.max(0, base + (Math.random() * variance * 2 - variance))
    }));
};

const UtilitySummary: React.FC<UtilitySummaryProps> = ({ plantId, plantName, onBack, userRole }) => {
    const [activeTab, setActiveTab] = useState<'Electricity' | 'Water' | 'Gas' | 'Steam' | 'Air' | 'Nitrogen'>('Electricity');

    // Mock Data based on plantId (pseudo-random per plant type)
    const isLargePlant = [PlantCode.CIKOKOL, PlantCode.SEMARANG].includes(plantId);
    const multiplier = isLargePlant ? 1.5 : 0.8;

    const summaryData = {
        electricity: { value: 3200 * multiplier, unit: 'kWh', trend: 12 },
        water: { value: 450 * multiplier, unit: 'm³', trend: -5 },
        gas: { value: 1200 * multiplier, unit: 'Nm³', trend: 2 },
        steam: { value: 15 * multiplier, unit: 'Ton', trend: 8 },
        air: { value: 18000 * multiplier, unit: 'Nm³', trend: 0 },
        nitrogen: { value: 450 * multiplier, unit: 'Nm³', trend: 15 },
    };

    const getTrendData = (type: string) => {
        switch(type) {
            case 'Electricity': return generateTrendData(150 * multiplier, 20);
            case 'Water': return generateTrendData(20 * multiplier, 5);
            case 'Gas': return generateTrendData(50 * multiplier, 10);
            case 'Steam': return generateTrendData(0.8 * multiplier, 0.2);
            case 'Air': return generateTrendData(800 * multiplier, 50);
            case 'Nitrogen': return generateTrendData(20 * multiplier, 2);
            default: return [];
        }
    };

    const currentTrend = getTrendData(activeTab);

    // Mock consumption breakdown by area
    const breakdownData = [
        { name: 'Production Line A', value: 40 },
        { name: 'Production Line B', value: 30 },
        { name: 'Utility Room', value: 15 },
        { name: 'Warehouse/Office', value: 15 },
    ];

    // Map active tab to visibility key
    const getChartVisibilityKey = (tab: string) => {
        // Simplified mapping, ideally each has its own chart key
        return 'UTILITY_CHART_TREND'; 
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Utility Summary</h1>
                        <p className="text-slate-400 text-sm">{plantName}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="bg-slate-800 rounded-md p-1 flex">
                        <button className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded shadow-sm">Today</button>
                        <button className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-white">Month</button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {isDataItemVisible(userRole, 'UTILITY_ELECTRICITY_KWH') && (
                    <div 
                        onClick={() => setActiveTab('Electricity')}
                        className={`cursor-pointer transition-all transform hover:scale-105 ${activeTab === 'Electricity' ? 'ring-2 ring-blue-500' : ''}`}
                    >
                        <MetricCard 
                            title="Electricity" 
                            value={summaryData.electricity.value.toLocaleString()} 
                            unit={summaryData.electricity.unit} 
                            icon={Zap} 
                            trend={summaryData.electricity.trend + '%'} 
                            trendUp={summaryData.electricity.trend > 0}
                            color="text-yellow-400"
                        />
                    </div>
                )}
                {isDataItemVisible(userRole, 'UTILITY_WATER_M3') && (
                    <div 
                        onClick={() => setActiveTab('Water')}
                        className={`cursor-pointer transition-all transform hover:scale-105 ${activeTab === 'Water' ? 'ring-2 ring-blue-500' : ''}`}
                    >
                        <MetricCard 
                            title="Water" 
                            value={summaryData.water.value.toLocaleString()} 
                            unit={summaryData.water.unit} 
                            icon={Droplets} 
                            trend={Math.abs(summaryData.water.trend) + '%'} 
                            trendUp={summaryData.water.trend > 0}
                            color="text-blue-400"
                        />
                    </div>
                )}
                {/* Gas is not in the original requested granularity but good to have, reusing keys or adding if strictly needed */}
                <div 
                    onClick={() => setActiveTab('Gas')}
                    className={`cursor-pointer transition-all transform hover:scale-105 ${activeTab === 'Gas' ? 'ring-2 ring-blue-500' : ''}`}
                >
                    <MetricCard 
                        title="Natural Gas" 
                        value={summaryData.gas.value.toLocaleString()} 
                        unit={summaryData.gas.unit} 
                        icon={Flame} 
                        trend={summaryData.gas.trend + '%'} 
                        trendUp={summaryData.gas.trend > 0}
                        color="text-rose-400"
                    />
                </div>
                {isDataItemVisible(userRole, 'UTILITY_STEAM_KG') && (
                    <div 
                        onClick={() => setActiveTab('Steam')}
                        className={`cursor-pointer transition-all transform hover:scale-105 ${activeTab === 'Steam' ? 'ring-2 ring-blue-500' : ''}`}
                    >
                        <MetricCard 
                            title="Steam" 
                            value={summaryData.steam.value.toFixed(1)} 
                            unit={summaryData.steam.unit} 
                            icon={Cloud} 
                            trend={summaryData.steam.trend + '%'} 
                            trendUp={summaryData.steam.trend > 0}
                            color="text-slate-200"
                        />
                    </div>
                )}
                 {isDataItemVisible(userRole, 'UTILITY_AIR_NM3') && (
                     <div 
                        onClick={() => setActiveTab('Air')}
                        className={`cursor-pointer transition-all transform hover:scale-105 ${activeTab === 'Air' ? 'ring-2 ring-blue-500' : ''}`}
                    >
                        <MetricCard 
                            title="Comp. Air" 
                            value={summaryData.air.value.toLocaleString()} 
                            unit={summaryData.air.unit} 
                            icon={Wind} 
                            trend="0%"
                            trendUp={true}
                            color="text-cyan-400"
                        />
                    </div>
                 )}
                 {isDataItemVisible(userRole, 'UTILITY_NITROGEN_NM3') && (
                    <div 
                        onClick={() => setActiveTab('Nitrogen')}
                        className={`cursor-pointer transition-all transform hover:scale-105 ${activeTab === 'Nitrogen' ? 'ring-2 ring-blue-500' : ''}`}
                    >
                        <MetricCard 
                            title="Nitrogen" 
                            value={summaryData.nitrogen.value.toLocaleString()} 
                            unit={summaryData.nitrogen.unit} 
                            icon={Box} 
                            trend={summaryData.nitrogen.trend + '%'} 
                            trendUp={summaryData.nitrogen.trend > 0}
                            color="text-emerald-400"
                        />
                    </div>
                 )}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trend Chart */}
                <Card title={`${activeTab} Consumption Trend (24h)`} className="lg:col-span-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={currentTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="time" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }} />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="value" 
                                name={`${activeTab} (${summaryData[activeTab.toLowerCase() as keyof typeof summaryData].unit})`} 
                                stroke="#3b82f6" 
                                strokeWidth={2} 
                                dot={false} 
                                activeDot={{ r: 6 }}
                                fill="url(#colorU)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                {/* Distribution Breakdown */}
                <div className="space-y-6">
                    <Card title={`${activeTab} Distribution`}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={breakdownData} layout="vertical" margin={{ left: 10, right: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" hide />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{fontSize: 11}} />
                                <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} name="% Usage" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Quick Stats">
                            <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                                <span className="text-slate-400">Peak Usage</span>
                                <span className="font-mono text-white">
                                    {Math.max(...currentTrend.map(d => d.value)).toFixed(1)} {summaryData[activeTab.toLowerCase() as keyof typeof summaryData].unit}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                                <span className="text-slate-400">Avg Usage</span>
                                <span className="font-mono text-white">
                                    {(currentTrend.reduce((a,b) => a + b.value, 0) / currentTrend.length).toFixed(1)} {summaryData[activeTab.toLowerCase() as keyof typeof summaryData].unit}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pb-1">
                                <span className="text-slate-400">Efficiency</span>
                                <span className="font-mono text-emerald-400">Good</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UtilitySummary;
