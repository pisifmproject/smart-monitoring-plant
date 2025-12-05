
import React, { useState, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation, useNavigate, useParams, Outlet } from 'react-router-dom';
import { PLANTS, MOCK_ALARMS, getMachineById, getLVMDPById } from './services/mockData';
import { PlantCode, Machine, LVMDP, User, UserRole } from './types';
import { MetricCard, Card, StatusBadge } from './components/SharedComponents';
import MachineDetail from './views/MachineDetail';
import LVMDPDetail from './views/LVMDPDetail';
import UtilitySummary from './views/UtilitySummary';
import SettingsView from './views/Settings';
import Login from './views/Login';
import { isWidgetVisible } from './services/visibilityStore';
import { 
    LayoutDashboard, 
    Factory, 
    Activity, 
    Zap, 
    Settings, 
    Bell, 
    LogOut,
    Menu,
    X,
    TrendingUp,
    Box,
    Calendar,
    Clock,
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    Droplets,
    ShieldAlert
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

// --- Dashboard Components (Refactored for Router) ---

const GlobalDashboard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const [outputPeriod, setOutputPeriod] = useState<'Hour' | 'Day' | 'Month' | 'Year'>('Day');
    
    const plants = Object.values(PLANTS);
    const totalOutput = plants.reduce((acc, p) => acc + p.outputToday, 0);
    const avgOEE = (plants.reduce((acc, p) => acc + p.oeeAvg, 0) / plants.filter(p => p.oeeAvg > 0).length) * 100;
    
    const getOutputValue = (dailyVal: number) => {
        switch (outputPeriod) {
            case 'Hour': return Math.round(dailyVal / 12);
            case 'Month': return dailyVal * 26;
            case 'Year': return dailyVal * 312;
            default: return dailyVal;
        }
    };

    const chartData = plants.map(p => ({
        name: p.name.replace('Plant ', ''),
        output: getOutputValue(p.outputToday),
        energy: p.energyTotal,
        downtimeMinutes: Math.floor(Math.random() * 60) + (p.activeAlarms * 30) 
    }));

    const downtimeRankingData = [...chartData].sort((a, b) => b.downtimeMinutes - a.downtimeMinutes);

    return (
        <div className="space-y-6 animate-in fade-in">
            <h2 className="text-2xl font-bold mb-4">Corporate Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isWidgetVisible(userRole, 'GLOBAL_KPI_OUTPUT') && (
                    <MetricCard title="Total Output Today" value={totalOutput.toLocaleString()} unit="kg" icon={Box} trend="12%" trendUp={true} />
                )}
                {isWidgetVisible(userRole, 'GLOBAL_KPI_OEE') && (
                    <MetricCard title="Avg OEE (All Plants)" value={avgOEE.toFixed(1)} unit="%" icon={Activity} trend="2%" trendUp={true} color="text-emerald-400" />
                )}
                {isWidgetVisible(userRole, 'GLOBAL_KPI_ENERGY') && (
                    <MetricCard title="Total Energy" value={plants.reduce((acc, p) => acc + p.energyTotal, 0).toLocaleString()} unit="kWh" icon={Zap} trend="5%" trendUp={false} color="text-yellow-400" />
                )}
                {isWidgetVisible(userRole, 'GLOBAL_KPI_ALARMS') && (
                    <MetricCard title="Active Alarms" value={MOCK_ALARMS.length} icon={Bell} color="text-rose-500" />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isWidgetVisible(userRole, 'GLOBAL_CHART_OUTPUT') && (
                    <Card 
                        title={`Production Output (${outputPeriod})`} 
                        action={
                            <div className="flex bg-slate-700 rounded-md p-0.5">
                                {(['Hour', 'Day', 'Month', 'Year'] as const).map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setOutputPeriod(period)}
                                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                            outputPeriod === period 
                                            ? 'bg-blue-600 text-white shadow-sm' 
                                            : 'text-slate-400 hover:text-white hover:bg-slate-600'
                                        }`}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                        }
                    >
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip 
                                    cursor={{fill: '#334155', opacity: 0.2}} 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                    formatter={(value: number) => [value.toLocaleString() + ' kg', 'Output']} 
                                />
                                <Bar dataKey="output" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Output" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                )}

                {isWidgetVisible(userRole, 'GLOBAL_CHART_DOWNTIME') && (
                    <Card title="Downtime Ranking (Today - Minutes)">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={downtimeRankingData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" />
                                <YAxis dataKey="name" type="category" stroke="#94a3b8" width={80} />
                                <Tooltip 
                                    cursor={{fill: '#334155', opacity: 0.2}} 
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} 
                                    formatter={(value: number) => [value + ' min', 'Downtime']}
                                />
                                <Bar dataKey="downtimeMinutes" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={30} name="Downtime" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isWidgetVisible(userRole, 'GLOBAL_CHART_ENERGY') && (
                    <Card title="Energy Consumption by Plant">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="energy" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Energy (kWh)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                )}
                
                {isWidgetVisible(userRole, 'GLOBAL_CHART_OEE_COMP') && (
                    <Card title="OEE Comparison">
                        <ResponsiveContainer width="100%" height={250}>
                             <BarChart data={plants.map(p => ({ name: p.name.replace('Plant ', ''), oee: (p.oeeAvg * 100).toFixed(1) }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                                <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Bar dataKey="oee" fill="#10b981" radius={[4, 4, 0, 0]} name="OEE %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                )}
            </div>

            {isWidgetVisible(userRole, 'GLOBAL_PLANT_LIST') && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2">
                        <Factory size={18} /> Plant Status Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {plants.map(plant => (
                            <Link to={`/plants/${plant.id}`} key={plant.id}>
                                <Card className="hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer group h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{plant.name}</h3>
                                            <p className="text-slate-500 text-sm">{plant.location}</p>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                                            plant.activeAlarms > 5 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 
                                            plant.activeAlarms > 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 
                                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        }`}>
                                            {plant.activeAlarms > 5 ? 'Critical' : plant.activeAlarms > 0 ? 'Warning' : 'Normal'}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Output (Today)</span>
                                            <span className="font-mono">{plant.outputToday.toLocaleString()} kg</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">OEE</span>
                                            <span className="font-mono">{(plant.oeeAvg * 100).toFixed(0)}%</span>
                                        </div>
                                         <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">Energy</span>
                                            <span className="font-mono">{plant.energyTotal} kWh</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const PlantDashboard: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { plantId } = useParams<{ plantId: string }>();
    const plant = PLANTS[plantId as PlantCode];

    if (!plant) return <div className="p-8 text-center text-slate-500">Plant not found</div>;

    const displayMachines = userRole === UserRole.OPERATOR 
        ? plant.machines.slice(0, 4) 
        : plant.machines;

    const plantNameKey = plant.name.replace('Plant ', '').toUpperCase();
    const currentAlarms = MOCK_ALARMS.filter(a => 
        a.source.toUpperCase().includes(plantNameKey) || 
        plant.machines.some(m => a.source.includes(m.code)) ||
        plant.lvmdps.some(l => a.source.includes(l.code))
    );

    const shifts = [
        { id: 1, name: 'Shift 1', time: '06:00 - 14:00', output: plant.outputToday, target: 12000, oee: plant.oeeAvg, status: 'ACTIVE' },
        { id: 2, name: 'Shift 2', time: '14:00 - 22:00', output: 0, target: 12000, oee: 0, status: 'PENDING' },
        { id: 3, name: 'Shift 3', time: '22:00 - 06:00', output: 0, target: 12000, oee: 0, status: 'PENDING' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in">
             <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">{plant.name} Dashboard</h2>
                    {userRole === UserRole.OPERATOR && (
                        <p className="text-xs text-blue-400 mt-1">* Showing only assigned machines</p>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <Link 
                        to={`/utility/${plantId}`}
                        className="bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 border border-blue-800/50 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <Droplets size={16} /> View Utility Summary
                    </Link>
                    <div className="flex gap-2 text-sm text-slate-400 hidden md:flex">
                        <span className="bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2"><Calendar size={14}/> {new Date().toLocaleDateString()}</span>
                        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full flex items-center gap-2"><Clock size={14}/> Shift 1</span>
                    </div>
                </div>
            </div>

             {isWidgetVisible(userRole, 'PLANT_KPI_SUMMARY') && (
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <MetricCard title="Output Today" value={plant.outputToday.toLocaleString()} unit="kg" icon={Box} />
                    <MetricCard title="OEE" value={(plant.oeeAvg * 100).toFixed(1)} unit="%" icon={Activity} color="text-emerald-400" />
                    <MetricCard title="Power Usage" value={plant.energyTotal} unit="kWh" icon={Zap} color="text-yellow-400" />
                    <MetricCard title="Plant Alarms" value={currentAlarms.length} icon={Bell} color="text-rose-500" />
                </div>
             )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {isWidgetVisible(userRole, 'PLANT_WIDGET_SHIFT') && (
                    <Card title="Shift Performance" className="lg:col-span-2">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-900/50 uppercase tracking-wider text-xs font-semibold">
                                    <tr>
                                        <th className="p-3 rounded-tl-lg">Shift</th>
                                        <th className="p-3">Time</th>
                                        <th className="p-3">Output (kg)</th>
                                        <th className="p-3">Target</th>
                                        <th className="p-3">OEE</th>
                                        <th className="p-3 rounded-tr-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {shifts.map(shift => (
                                        <tr key={shift.id} className={shift.status === 'ACTIVE' ? 'bg-blue-500/5' : ''}>
                                            <td className="p-3 font-medium text-white">{shift.name}</td>
                                            <td className="p-3">{shift.time}</td>
                                            <td className="p-3 text-white">{shift.output.toLocaleString()}</td>
                                            <td className="p-3">{shift.target.toLocaleString()}</td>
                                            <td className="p-3">{(shift.oee * 100).toFixed(1)}%</td>
                                            <td className="p-3">
                                                {shift.status === 'ACTIVE' ? (
                                                    <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold uppercase"><Activity size={12}/> Active</span>
                                                ) : (
                                                    <span className="text-slate-500 text-xs uppercase">{shift.status}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {isWidgetVisible(userRole, 'PLANT_WIDGET_ALARMS') && (
                    <Card title="Active Alarms" className="lg:col-span-1 flex flex-col max-h-[300px]">
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-3">
                            {currentAlarms.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-8">
                                    <CheckCircle2 size={32} className="text-emerald-500 mb-2 opacity-50"/>
                                    <p>No Active Alarms</p>
                                </div>
                            ) : (
                                currentAlarms.map(alarm => (
                                    <div key={alarm.id} className="bg-slate-900/50 p-3 rounded border border-slate-700/50 flex gap-3 items-start">
                                        <div className={`mt-1 p-1 rounded-full shrink-0 ${
                                            alarm.severity === 'CRITICAL' ? 'bg-rose-500 text-white' :
                                            alarm.severity === 'WARNING' ? 'bg-amber-500 text-white' :
                                            'bg-blue-500 text-white'
                                        }`}>
                                            <AlertTriangle size={12} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-mono mb-0.5">{alarm.timestamp}</p>
                                            <p className="text-sm font-medium text-white leading-tight">{alarm.message}</p>
                                            <p className="text-xs text-slate-500 mt-1 uppercase">{alarm.source}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                )}
            </div>

            {isWidgetVisible(userRole, 'PLANT_GRID_MACHINES') && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2">
                        <Factory size={18} /> Production Lines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {displayMachines.map(machine => (
                            <Link to={`/machines/${machine.id}`} key={machine.id}>
                                <div 
                                    className="bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-800/80 group h-full"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-white truncate pr-2 group-hover:text-blue-400 transition-colors">{machine.name}</span>
                                        <StatusBadge status={machine.status} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                                        <div>
                                            <p className="text-slate-500 text-xs">Output (kg/h)</p>
                                            <p className="font-mono text-slate-200 text-lg">{machine.outputPerHour}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-500 text-xs">OEE</p>
                                            <p className="font-mono text-slate-200 text-lg">{(machine.oee * 100).toFixed(0)}%</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {isWidgetVisible(userRole, 'PLANT_GRID_LVMDP') && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-300 mb-3 flex items-center gap-2 mt-8">
                        <Zap size={18} /> Power Distribution (LVMDP)
                    </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {plant.lvmdps.map(panel => (
                            <Link to={`/lvmdp/${panel.id}`} key={panel.id}>
                                <div 
                                    className="bg-slate-900 border border-slate-700 hover:border-yellow-500 rounded-lg p-4 cursor-pointer relative overflow-hidden group h-full"
                                >
                                    <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Zap size={80} />
                                    </div>
                                    <h4 className="font-semibold text-slate-200 group-hover:text-yellow-400 transition-colors">{panel.code}</h4>
                                    <div className="mt-4 space-y-3">
                                        <div className="flex justify-between text-sm border-b border-slate-800 pb-2">
                                            <span className="text-slate-500">Power</span>
                                            <span className="text-yellow-400 font-mono font-bold">{panel.totalPowerKW} kW</span>
                                        </div>
                                         <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">PF / Load</span>
                                            <span className="text-slate-300 font-mono">{panel.powerFactor} / {panel.currentLoadPercent}%</span>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <StatusBadge status={panel.status} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Helper Pages & Wrappers ---

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-in fade-in zoom-in">
        <div className="bg-rose-500/10 p-6 rounded-full border border-rose-500/20">
            <ShieldAlert size={64} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-slate-400 max-w-md">
            Your user role does not have permission to access this resource. 
            If you believe this is an error, please contact the System Administrator.
        </p>
        <Link to="/dashboard/global" className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 transition-colors">
            Return to Dashboard
        </Link>
    </div>
);

const MachineDetailWrapper: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { machineId } = useParams<{ machineId: string }>();
    const navigate = useNavigate();
    const machine = getMachineById(machineId || '');

    if (!machine) return <div className="p-8 text-center text-slate-500">Machine not found</div>;

    return <MachineDetail machine={machine} onBack={() => navigate(-1)} userRole={userRole} />;
};

const LVMDPDetailWrapper: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { panelId } = useParams<{ panelId: string }>();
    const navigate = useNavigate();
    const panel = getLVMDPById(panelId || '');

    if (!panel) return <div className="p-8 text-center text-slate-500">Panel not found</div>;

    return <LVMDPDetail lvmdp={panel} onBack={() => navigate(-1)} userRole={userRole} />;
};

const UtilitySummaryWrapper: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    const { plantId } = useParams<{ plantId: string }>();
    const navigate = useNavigate();
    const plant = PLANTS[plantId as PlantCode];

    if (!plant) return <div className="p-8 text-center text-slate-500">Plant not found</div>;

    return <UtilitySummary plantId={plant.id} plantName={plant.name} onBack={() => navigate(-1)} userRole={userRole} />;
};

const SettingsWrapper: React.FC<{ userRole: UserRole }> = ({ userRole }) => {
    // Redundant check since ProtectedRoute handles it, but good for safety
    if (userRole !== UserRole.ADMINISTRATOR) return <AccessDenied />;
    return <SettingsView userRole={userRole} />;
};

// --- Layout & Protected Routes ---

const Layout: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();

    const breadcrumb = useMemo(() => {
        const path = location.pathname;
        if (path.includes('/dashboard/global')) return 'Global Overview';
        if (path.includes('/plants/')) {
            const id = path.split('/')[2];
            return `Plant / ${PLANTS[id as PlantCode]?.name || id}`;
        }
        if (path.includes('/machines/')) return 'Machine Detail';
        if (path.includes('/settings')) return 'System Administration';
        return 'Smart Monitoring';
    }, [location]);

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
             <aside 
                className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col z-20`}
            >
                <div className="h-16 flex items-center justify-center border-b border-slate-800">
                    {sidebarOpen ? (
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                            SmartMonitor
                        </span>
                    ) : (
                        <Activity className="text-blue-400" />
                    )}
                </div>

                <nav className="flex-1 py-6 space-y-2 px-2">
                    <Link 
                        to="/dashboard/global"
                        className={`w-full flex items-center p-3 rounded-lg transition-colors ${location.pathname.includes('/dashboard/global') ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} />
                        {sidebarOpen && <span className="ml-3 font-medium">Dashboard</span>}
                    </Link>

                    <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {sidebarOpen && 'Plants'}
                    </div>
                    {Object.values(PLANTS).map(plant => (
                        <Link
                            key={plant.id}
                            to={`/plants/${plant.id}`}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${location.pathname.includes(`/plants/${plant.id}`) ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <Factory size={20} />
                            {sidebarOpen && <span className="ml-3 font-medium truncate">{plant.name}</span>}
                        </Link>
                    ))}

                    {user.role === UserRole.ADMINISTRATOR && (
                        <div className="pt-4 border-t border-slate-800 mt-4">
                            <Link 
                                to="/settings"
                                className={`w-full flex items-center p-3 rounded-lg transition-colors ${location.pathname === '/settings' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Settings size={20} />
                                {sidebarOpen && <span className="ml-3 font-medium">Settings</span>}
                            </Link>
                        </div>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button 
                        onClick={onLogout}
                        className="flex items-center text-slate-400 hover:text-white transition-colors w-full"
                    >
                        <LogOut size={20} />
                        {sidebarOpen && <span className="ml-3 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

             <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-slate-900/50 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 z-10">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-md text-slate-400 mr-4">
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <h2 className="text-sm font-medium text-slate-400">{breadcrumb}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-2">
                            <span className="text-sm font-bold text-white">{user.name}</span>
                            <span className="text-xs text-slate-400">{user.role}</span>
                        </div>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <div className="max-w-7xl mx-auto pb-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

interface ProtectedRouteProps {
    user: User;
    allowedRoles?: UserRole[]; // If undefined, allow all logged in
    restrictedForRoles?: UserRole[]; // Block these specific roles
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, allowedRoles, restrictedForRoles, children }) => {
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <AccessDenied />;
    }
    if (restrictedForRoles && restrictedForRoles.includes(user.role)) {
        return <AccessDenied />;
    }
    return <>{children}</>;
};

// --- App Root ---

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    if (!user) {
        return <Login onLogin={setUser} />;
    }

    const managementRoles = [UserRole.MANAGEMENT, UserRole.VIEWER];
    // Detail pages restricted for Management/Guest
    const restrictedForManagement = managementRoles; 

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Layout user={user} onLogout={() => setUser(null)} />}>
                    <Route index element={<Navigate to="/dashboard/global" replace />} />
                    
                    <Route path="dashboard/global" element={<GlobalDashboard userRole={user.role} />} />
                    
                    <Route path="plants/:plantId" element={<PlantDashboard userRole={user.role} />} />
                    
                    {/* Restricted Routes */}
                    <Route 
                        path="machines/:machineId" 
                        element={
                            <ProtectedRoute user={user} restrictedForRoles={restrictedForManagement}>
                                <MachineDetailWrapper userRole={user.role} />
                            </ProtectedRoute>
                        } 
                    />
                     <Route 
                        path="lvmdp/:panelId" 
                        element={
                            <ProtectedRoute user={user} restrictedForRoles={restrictedForManagement}>
                                <LVMDPDetailWrapper userRole={user.role} />
                            </ProtectedRoute>
                        } 
                    />
                     <Route 
                        path="utility/:plantId" 
                        element={
                            <ProtectedRoute user={user} restrictedForRoles={restrictedForManagement}>
                                <UtilitySummaryWrapper userRole={user.role} />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route 
                        path="settings" 
                        element={
                            <ProtectedRoute user={user} allowedRoles={[UserRole.ADMINISTRATOR]}>
                                <SettingsWrapper userRole={user.role} />
                            </ProtectedRoute>
                        } 
                    />

                    <Route path="*" element={<Navigate to="/dashboard/global" replace />} />
                </Route>
            </Routes>
        </HashRouter>
    );
};

export default App;
