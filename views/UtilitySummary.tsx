
import React, { useState, useMemo } from 'react';
import { Plant, UserRole } from '../types';
import { Card, MetricCard, formatNumber, StatusBadge } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { utilityService } from '../services/utilityService';
import { maintenanceService } from '../services/maintenanceService';
import { 
    ArrowLeft, Zap, TrendingUp, Clock, ChevronsUp, ChevronsDown, 
    AlertTriangle, FileText, Loader2, CheckCircle2, Battery, Activity, ArrowRight, Gauge, LayoutGrid
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar, Legend, Pie, PieChart, BarChart as RechartsBarChart, AreaChart, Area } from 'recharts';
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
    
    // Download State
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDownloadToast, setShowDownloadToast] = useState(false);

    // Context for visibility check - Only plantId is needed
    const visibilityContext = { plantId: plant.id };

    const config = useMemo(() => utilityService.getUtilityConfig(plant, type, period), [type, plant, period]);
    const trendData = useMemo(() => utilityService.getTrendData(config, period), [config, period]);
    const genericBreakdownData = useMemo(() => utilityService.getGenericBreakdown(), []);
    const quickStats = useMemo(() => utilityService.getQuickStats(config), [config]);
    
    // Period is already in correct format for utilityService
    const { periodMult } = utilityService.getMultipliers(plant.id, period);
    
    // Permissions
    const canDownloadReport = [UserRole.ADMINISTRATOR, UserRole.SUPERVISOR, UserRole.MANAGEMENT].includes(userRole);

    // Determine visibility keys prefix based on utility type
    const visibilityKeys = useMemo(() => {
        const prefix = type.toUpperCase().replace(' ', '_'); // AIR, ELECTRICITY, STEAM, WATER
        return {
            KPI_TOTAL: `${prefix}_DETAIL_KPI_TOTAL`,
            CHART_TREND: `${prefix}_DETAIL_CHART_TREND`,
            KPI_STATS: `${prefix}_DETAIL_KPI_STATS`,
            CONSUMPTION_BAR: `${prefix}_DETAIL_CONSUMPTION_BAR`,
            CONSUMPTION_PIE: `${prefix}_DETAIL_CONSUMPTION_PIE`
        };
    }, [type]);

    const handleDownloadReport = () => {
        if (isDownloading) return;
        setIsDownloading(true);

        // Simulate PDF generation delay
        setTimeout(() => {
            setIsDownloading(false);
            setShowDownloadToast(true);
            // Hide toast after 3 seconds
            setTimeout(() => setShowDownloadToast(false), 3000);
        }, 2000);
    };

    const FilterButton = ({ label }: { label: Period }) => {
        // Restricted: Operators can only see Day
        if (userRole === UserRole.OPERATOR && label !== 'Day') return null;

        return (
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
    };

    // ----------------------------------------------------------------------
    // ELECTRICITY DASHBOARD (Redesigned per Corporate Standard)
    // ----------------------------------------------------------------------
    if (type.toLowerCase() === 'electricity') {
        const INSTALLED_CAPACITY_KVA = 5540;
        
        // Aggregate Real-time Data from LVMDPs
        const totalKVA = plant.lvmdps.reduce((acc, p) => acc + p.totalPowerKVA, 0);
        const totalKW = plant.lvmdps.reduce((acc, p) => acc + p.totalPowerKW, 0);
        
        const utilizationPercent = (totalKVA / INSTALLED_CAPACITY_KVA) * 100;
        
        // Calculate Global Min/Max Current
        let maxCurrent = 0;
        let minCurrent = 99999;
        let avgPowerFactor = 0;

        plant.lvmdps.forEach(p => {
            const maxP = Math.max(p.currentR, p.currentS, p.currentT);
            const minP = Math.min(p.currentR, p.currentS, p.currentT);
            if(maxP > maxCurrent) maxCurrent = maxP;
            if(minP < minCurrent && minP > 0) minCurrent = minP;
            avgPowerFactor += p.powerFactor;
        });
        
        if(minCurrent === 99999) minCurrent = 0;
        if(plant.lvmdps.length > 0) avgPowerFactor = avgPowerFactor / plant.lvmdps.length;

        return (
            <div className="space-y-6 animate-in fade-in duration-300 w-full relative pb-12">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-300 hover:text-white"><ArrowLeft size={24} /></button>
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2"><Zap className="text-yellow-400" size={28} />Power Monitoring System</h1>
                            <p className="text-slate-300 text-sm font-medium">{plant.name} • Installed Capacity: <span className="text-white font-bold">{formatNumber(INSTALLED_CAPACITY_KVA)} kVA</span></p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                        <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1">
                            <FilterButton label="Day" />
                            <FilterButton label="Week" />
                            <FilterButton label="Month" />
                            <FilterButton label="Year" />
                        </div>
                        {canDownloadReport && (
                            <button onClick={handleDownloadReport} disabled={isDownloading} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm">
                                {isDownloading ? <Loader2 size={16} className="animate-spin text-blue-400" /> : <FileText size={16} className="text-blue-400 group-hover:text-blue-300" />}
                                <span className="hidden sm:inline">Export PDF</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Capacity & Load Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Capacity Utilization Card */}
                    <Card className="lg:col-span-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={120} className="text-yellow-500" /></div>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><Gauge size={20} className="text-blue-400"/> Plant Capacity Utilization</h3>
                        
                        <div className="flex flex-col gap-6">
                            <div className="relative pt-2 px-2">
                                <div className="flex justify-between text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                    <span>Current Load</span>
                                    <span>Capacity ({formatNumber(INSTALLED_CAPACITY_KVA)} kVA)</span>
                                </div>
                                <div className="h-8 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out relative ${utilizationPercent > 85 ? 'bg-rose-500' : utilizationPercent > 70 ? 'bg-amber-500' : 'bg-blue-500'}`} 
                                        style={{ width: `${Math.min(100, utilizationPercent)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-bar-stripes_1s_linear_infinite]"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-3 items-end">
                                    <div>
                                        <span className="text-4xl font-bold text-white font-mono">{formatNumber(totalKVA)}</span>
                                        <span className="text-sm font-medium text-slate-400 ml-2">kVA (Total Apparent Power)</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-2xl font-bold font-mono ${utilizationPercent > 85 ? 'text-rose-400' : utilizationPercent > 70 ? 'text-amber-400' : 'text-blue-400'}`}>{formatNumber(utilizationPercent)}%</span>
                                        <span className="block text-xs text-slate-500 uppercase font-bold">Utilization</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-700/50">
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">Total Active Power</p>
                                    <p className="text-xl font-bold text-yellow-400 font-mono">{formatNumber(totalKW)} <span className="text-xs text-slate-500">kW</span></p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">Avg Power Factor</p>
                                    <p className="text-xl font-bold text-emerald-400 font-mono">{formatNumber(avgPowerFactor, 3)}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">Max Current (Plant)</p>
                                    <p className="text-xl font-bold text-rose-400 font-mono">{formatNumber(maxCurrent)} <span className="text-xs text-slate-500">A</span></p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs font-bold uppercase">Min Current (Plant)</p>
                                    <p className="text-xl font-bold text-blue-400 font-mono">{formatNumber(minCurrent)} <span className="text-xs text-slate-500">A</span></p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Trend */}
                    <Card title={`Energy Trend (${period})`}>
                        <div className="h-[200px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <defs><linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/><stop offset="95%" stopColor="#facc15" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 10}} />
                                    <YAxis stroke="#94a3b8" tick={{fontSize: 10}} tickFormatter={(val) => formatNumber(val, 0)} />
                                    <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="value" stroke="#facc15" fill="url(#colorEnergy)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs font-medium text-slate-400">
                            <span>Total: {formatNumber(config.value)} kWh</span>
                            <span className={config.trend > 0 ? 'text-emerald-400' : 'text-emerald-400'}>
                                {config.trend > 0 ? '▲' : '▼'} {Math.abs(config.trend)}% vs prev
                            </span>
                        </div>
                    </Card>
                </div>

                {/* Panel Summaries Grid */}
                <h3 className="text-xl font-bold text-white mt-4 flex items-center gap-2"><LayoutGrid size={20} className="text-slate-400"/> Panel Summaries</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {plant.lvmdps.map((panel) => {
                        const maxPanelCurrent = Math.max(panel.currentR, panel.currentS, panel.currentT);
                        const minPanelCurrent = Math.min(panel.currentR, panel.currentS, panel.currentT);
                        const hasAlarm = maintenanceService.hasActiveAlarm(panel.id);

                        return (
                            <div 
                                key={panel.id}
                                onClick={() => navigate(`/app/lvmdp/${panel.id}`)}
                                className={`bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-xl p-5 cursor-pointer transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg relative overflow-hidden`}
                            >
                                {hasAlarm && <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-bl-lg animate-pulse"></div>}
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{panel.name}</h4>
                                        <p className="text-xs text-slate-400 font-mono">{panel.code}</p>
                                    </div>
                                    <div className={`p-2 rounded-lg ${hasAlarm ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-700 text-slate-300'}`}>
                                        <Activity size={20} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="pb-3 border-b border-slate-700/50">
                                        <span className="text-slate-400 text-xs font-bold uppercase">Total Power</span>
                                        <div className="text-2xl font-bold text-white font-mono mt-1">{formatNumber(panel.totalPowerKW)} <span className="text-xs text-slate-500">kW</span></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                                        <div>
                                            <span className="text-slate-500 text-[10px] uppercase font-bold">Max Current</span>
                                            <div className="text-sm font-bold text-rose-400 font-mono">{formatNumber(maxPanelCurrent)} A</div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 text-[10px] uppercase font-bold">Min Current</span>
                                            <div className="text-sm font-bold text-blue-400 font-mono">{formatNumber(minPanelCurrent)} A</div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 text-[10px] uppercase font-bold">Apparent</span>
                                            <div className="text-sm font-bold text-slate-300 font-mono">{formatNumber(panel.totalPowerKVA)} kVA</div>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 text-[10px] uppercase font-bold">PF</span>
                                            <div className="text-sm font-bold text-emerald-400 font-mono">{formatNumber(panel.powerFactor, 2)}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-700/30">
                                        <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300 transition-colors">View Detailed Analytics</span>
                                        <ArrowRight size={14} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Download Toast */}
                {showDownloadToast && (
                    <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                        <div className="bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl shadow-emerald-900/30 flex items-center gap-3 border border-emerald-500/50">
                            <div className="bg-white/20 p-1 rounded-full"><CheckCircle2 size={18} className="text-white" /></div>
                            <div><p className="font-bold text-sm">Report Downloaded</p><p className="text-emerald-100 text-xs mt-0.5">Electrical_Summary_{period}.pdf</p></div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ----------------------------------------------------------------------
    // GENERIC UTILITY DASHBOARD (Water, Gas, Air, etc.)
    // ----------------------------------------------------------------------
    return (
        <div className="space-y-6 animate-in fade-in duration-300 w-full relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-300 hover:text-white"><ArrowLeft size={24} /></button>
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2"><config.icon className={config.color} size={28} />{config.label} Detail</h1>
                        <p className="text-slate-300 text-sm font-medium">{plant.name}</p>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                    <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1">
                        <FilterButton label="Day" />
                        <FilterButton label="Week" />
                        <FilterButton label="Month" />
                        <FilterButton label="Year" />
                    </div>

                    {/* Download Button */}
                    {canDownloadReport && (
                        <button 
                            onClick={handleDownloadReport}
                            disabled={isDownloading}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm"
                        >
                            {isDownloading ? (
                                <Loader2 size={16} className="animate-spin text-blue-400" />
                            ) : (
                                <FileText size={16} className="text-blue-400 group-hover:text-blue-300" />
                            )}
                            <span className="hidden sm:inline">{isDownloading ? 'Export PDF' : 'Export PDF'}</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
                {isDataItemVisible(userRole, visibilityKeys.KPI_TOTAL, visibilityContext) && (
                    <MetricCard 
                        title={`Total ${config.label} (${period})`}
                        value={config.value.toLocaleString('id-ID', { maximumFractionDigits: 1 })} 
                        unit={config.unit} 
                        icon={config.icon} 
                        trend={Math.abs(config.trend) + '%'} 
                        trendUp={config.trend > 0}
                        color={config.color}
                    />
                )}
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {isDataItemVisible(userRole, visibilityKeys.CHART_TREND, visibilityContext) && (
                    <Card title={`${config.label} Usage Trend (${period})`} className="xl:col-span-2 min-h-[350px]">
                         <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trendData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} label={{ value: `Time (${period})`, position: 'insideBottom', dy: 15, fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(val) => formatNumber(val, 0)} label={{ value: `Usage (${config.unit})`, angle: -90, position: 'insideLeft', dx: -15, fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}/>
                                <Line type="monotone" dataKey="value" stroke={config.hexColor} strokeWidth={2} name={`Usage (${config.unit})`} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                )}
                {isDataItemVisible(userRole, visibilityKeys.KPI_STATS, visibilityContext) && (
                    <Card title="Quick Stats">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-500/10 text-rose-400 rounded-lg"><ChevronsUp size={20}/></div>
                                <div>
                                    <p className="text-sm text-slate-300">Peak Usage</p>
                                    <p className="text-lg font-bold text-white">{quickStats.peak.value} {quickStats.peak.unit}</p>
                                    <p className="text-xs text-slate-400">at {quickStats.peak.time}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><Clock size={20}/></div>
                                <div>
                                    <p className="text-sm text-slate-300">Average Usage</p>
                                    <p className="text-lg font-bold text-white">{quickStats.average.value} {quickStats.average.unit}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg"><ChevronsDown size={20}/></div>
                                <div>
                                    <p className="text-sm text-slate-300">Lowest Usage</p>
                                    <p className="text-lg font-bold text-white">{quickStats.low.value} {quickStats.low.unit}</p>
                                    <p className="text-xs text-slate-400">at {quickStats.low.time}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}
            </div>

            {![UserRole.VIEWER, UserRole.MANAGEMENT].includes(userRole) && (
                <>
                    <h3 className="text-xl font-bold text-slate-200 mt-2 mb-4 flex items-center gap-2">
                        <TrendingUp size={22} /> {config.breakdownTitle}
                    </h3>
                    
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {isDataItemVisible(userRole, visibilityKeys.CONSUMPTION_BAR, visibilityContext) && (
                            <Card title="Consumption by Area (Bar)" className="min-h-[350px]">
                                <ResponsiveContainer width="100%" height={300}>
                                    <RechartsBarChart data={genericBreakdownData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis type="number" stroke="#94a3b8" tick={{fontSize: 12}} label={{ value: 'Consumption (%)', position: 'insideBottom', dy: 15, fill: '#94a3b8', fontSize: 12 }} />
                                        <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{fontSize: 12}} width={100} label={{ value: 'Area', angle: -90, position: 'insideLeft', dx: -25, fill: '#94a3b8', fontSize: 12 }} />
                                        <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}/>
                                        <Bar dataKey="value" fill={config.hexColor} name="Consumption (%)" radius={[0, 4, 4, 0]} />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </Card>
                        )}
                        {isDataItemVisible(userRole, visibilityKeys.CONSUMPTION_PIE, visibilityContext) && (
                            <Card title="Consumption by Area (Pie)" className="min-h-[350px]">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={genericBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
                                        <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}/>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        )}
                     </div>
                </>
            )}

            {/* Download Success Toast */}
            {showDownloadToast && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl shadow-emerald-900/30 flex items-center gap-3 border border-emerald-500/50">
                        <div className="bg-white/20 p-1 rounded-full">
                            <CheckCircle2 size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Report Downloaded</p>
                            <p className="text-emerald-100 text-xs mt-0.5">{config.label}_Detail_{period}.pdf</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UtilitySummary;
