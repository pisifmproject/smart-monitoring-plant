





import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Machine, UserRole, MachineType, PlantCode, BagmakerDetails, WeigherDetails, Alarm } from '../types';
import { Card, StatusBadge, MetricCard, formatNumber } from '../components/SharedComponents';
import { isDataItemVisible } from '../services/visibilityStore';
import { maintenanceService } from '../services/maintenanceService';
import { plantService as ps } from '../services/plantService'; // Using correct import path
import { 
    Activity, Zap, AlertTriangle, ArrowLeft, 
    ClipboardPen, Wrench, X, CheckCircle2, 
    Wind, Droplets, Cloud, Box, Clock, Camera, Plus, History, Save, FileText, Loader2,
    Scale, Package, Film, Thermometer, Gauge, TrendingUp, Trash2, ScanSearch, Printer, Archive, Scissors, GaugeCircle, Server, Eye,
    // FIX: Add missing icons for alarm tab
    AlertOctagon, Info, AlertCircle
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, AreaChart, Area, Legend 
} from 'recharts';

interface MachineDetailProps {
    machine: Machine;
    onBack: () => void;
    userRole: UserRole;
    currentUser: string; 
}

type Period = 'Day' | 'Week' | 'Month' | 'Year';

const ALL_TABS_BASE = [
    { key: 'Performance', visibilityKey: 'MACHINE_TAB_PERFORMANCE' },
    { key: 'Process', visibilityKey: 'MACHINE_TAB_PROCESS' },
    { key: 'Packing', visibilityKey: 'MACHINE_TAB_PACKING' },
    { key: 'Utility', visibilityKey: 'MACHINE_TAB_UTILITY' },
    { key: 'Alarms', visibilityKey: 'MACHINE_TAB_ALARMS' },
    { key: 'Downtime', visibilityKey: 'MACHINE_TAB_DOWNTIME' },
    { key: 'Maintenance', visibilityKey: 'MACHINE_TAB_MAINTENANCE' }
];

const MachineDetail: React.FC<MachineDetailProps> = ({ machine, onBack, userRole, currentUser }) => {
    const location = useLocation();
    const visibilityContext = { plantId: machine.plantId, machineId: machine.id };
    
    // Check which tabs are visible based on role
    const visibleTabs = useMemo(() => {
        if (userRole === UserRole.MANAGEMENT) {
            return ALL_TABS_BASE.filter(t => t.key === 'Performance');
        }

        // Existing logic for other roles
        return ALL_TABS_BASE.filter(t => {
            if (userRole === UserRole.VIEWER && (t.key === 'Alarms' || t.key === 'Maintenance')) {
                return false;
            }
            return isDataItemVisible(userRole, t.visibilityKey, visibilityContext)
        });
    }, [userRole, visibilityContext]);
    
    // Set active tab with priority:
    // 1. Navigation state (e.g. from clicking an alarm on dashboard)
    // 2. First visible tab
    const [activeTab, setActiveTab] = useState(() => {
        const requestedTab = location.state?.initialTab;
        if (requestedTab && visibleTabs.find(t => t.key === requestedTab)) {
            return requestedTab;
        }
        return visibleTabs.length > 0 ? visibleTabs[0].key : '';
    });

    const [period, setPeriod] = useState<Period>('Day');
    
    // Download State
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDownloadToast, setShowDownloadToast] = useState(false);
    
    // Ref for scrolling to maintenance form
    const maintenanceRef = useRef<HTMLDivElement>(null);

    // Scroll to maintenance tab content if requested via navigation
    useEffect(() => {
        if (activeTab === 'Maintenance' && location.state?.initialTab === 'Maintenance' && maintenanceRef.current) {
             maintenanceRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [activeTab, location.state]);
    
    // Force re-render helper
    const [tick, setTick] = useState(0);
    const forceUpdate = () => setTick(t => t + 1);

    // Fetch real data from services with Period context
    const timeSeriesData = useMemo(() => ps.getMachineTimeSeries(machine.id, period), [machine.id, period]);
    const accumulatedStats = useMemo(() => ps.getMachineStats(machine.id, period), [machine.id, period]);

    const alarmHistory = useMemo(() => maintenanceService.getAlarmHistory(machine.id), [machine.id, tick]); // Refresh on maintenance action
    const maintenanceHistoryRecords = useMemo(() => maintenanceService.getMaintenanceHistory(machine.id), [machine.id, tick]);
    const activeAlarms = maintenanceService.getMachineActiveAlarms(machine.id);
    const downtimeLogs = useMemo(() => maintenanceService.getDowntimeLogs(machine.id), [machine.id, tick]);
    
    const primaryAlarm = activeAlarms.length > 0 ? activeAlarms[0] : null;

    // Maintenance Form State
    const [startTechnicianName, setStartTechnicianName] = useState('');
    const [formCheckedBy, setFormCheckedBy] = useState('');
    const [maintenanceNote, setMaintenanceNote] = useState('');
    const [maintenanceSolved, setMaintenanceSolved] = useState(true);
    const [formSubmitting, setFormSubmitting] = useState(false);

    // Downtime Form State
    const [isDowntimeModalOpen, setIsDowntimeModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [newDowntime, setNewDowntime] = useState({
        start: '',
        end: '',
        reason: 'Jam',
        description: ''
    });

    // Permissions
    const canAddDowntime = userRole === UserRole.OPERATOR || userRole === UserRole.ADMINISTRATOR || userRole === UserRole.SUPERVISOR;
    const canPerformMaintenance = userRole === UserRole.MAINTENANCE;
    const canViewHistory = true;
    const canDownloadReport = [UserRole.ADMINISTRATOR, UserRole.SUPERVISOR, UserRole.MANAGEMENT].includes(userRole);
    
    // Handle tab switching safety
    useEffect(() => {
        if (!visibleTabs.find(t => t.key === activeTab) && visibleTabs.length > 0) {
            setActiveTab(visibleTabs[0].key);
        }
    }, [userRole, visibleTabs, activeTab]);

    const handleStartMaintenance = (e: React.FormEvent) => {
        e.preventDefault();
        if (!primaryAlarm || !startTechnicianName.trim()) return;
        
        maintenanceService.startMaintenance(primaryAlarm.id, startTechnicianName);
        setFormCheckedBy(startTechnicianName); 
        forceUpdate();
    };

    const handleMaintenanceSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!primaryAlarm || !formCheckedBy.trim()) return;
        
        setFormSubmitting(true);
        setTimeout(() => {
            maintenanceService.submitMaintenanceAction({
                alarmId: primaryAlarm.id,
                machineId: machine.id,
                checkedBy: formCheckedBy, 
                solved: maintenanceSolved,
                note: maintenanceNote,
                photoUrl: '' 
            });
            setFormSubmitting(false);
            setMaintenanceNote('');
            setStartTechnicianName('');
            setFormCheckedBy('');
            forceUpdate();
        }, 800);
    };

    const handleAddDowntimeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDowntime.start || !newDowntime.end) return;

        // Simple duration calculation for demo (assuming same day)
        let duration = "0m";
        try {
            // Using arbitrary date to calculate time difference
            const d1 = new Date(`2024-01-01T${newDowntime.start}`);
            const d2 = new Date(`2024-01-01T${newDowntime.end}`);
            let diffMs = d2.getTime() - d1.getTime();
            
            // Handle cross-midnight by adding 24 hours if end is before start
            if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
            
            const totalMinutes = Math.floor(diffMs / 60000);
            const h = Math.floor(totalMinutes / 60);
            const m = Math.floor(totalMinutes % 60);
            
            if (h > 0) duration = `${h}h ${m}m`;
            else duration = `${m}m`;

        } catch (err) {
            console.error("Date calc error", err);
        }

        maintenanceService.addDowntimeLog({
            machineId: machine.id,
            start: newDowntime.start,
            end: newDowntime.end,
            duration: duration,
            reason: newDowntime.reason,
            description: newDowntime.description,
            source: 'MANUAL'
        });

        setIsDowntimeModalOpen(false);
        setNewDowntime({ start: '', end: '', reason: 'Jam', description: '' });
        forceUpdate();
        
        // Show success toast
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };
    
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

    const renderPerformanceTab = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                 {isDataItemVisible(userRole, 'MACHINE_OEE', visibilityContext) && <MetricCard title="OEE" value={formatNumber(machine.oee * 100)} unit="%" icon={Activity} color="text-emerald-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_AVAILABILITY', visibilityContext) && <MetricCard title="Availability" value={formatNumber((machine.availability || 0.95) * 100)} unit="%" icon={Clock} color="text-blue-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_PERFORMANCE', visibilityContext) && <MetricCard title="Performance" value={formatNumber((machine.performance || 0.92) * 100)} unit="%" icon={Zap} color="text-yellow-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_QUALITY', visibilityContext) && <MetricCard title="Quality" value={formatNumber((machine.quality || 0.99) * 100)} unit="%" icon={CheckCircle2} color="text-purple-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_OUTPUT_KG_H', visibilityContext) && <MetricCard title="Output Rate" value={formatNumber(machine.outputPerHour)} unit="kg/h" icon={Box} />}
                 {isDataItemVisible(userRole, 'MACHINE_OUTPUT_SHIFT', visibilityContext) && <MetricCard title={`Total Output (${period})`} value={formatNumber(accumulatedStats?.totalOutput || 0)} unit="kg" icon={Box} />}
                 {isDataItemVisible(userRole, 'MACHINE_REJECT_KG', visibilityContext) && <MetricCard title={`Reject Mass (${period})`} value={formatNumber(accumulatedStats?.rejectMass || 0)} unit="kg" icon={AlertTriangle} color="text-rose-400" />}
                 {isDataItemVisible(userRole, 'MACHINE_REJECT_PERCENT', visibilityContext) && <MetricCard title="Reject %" value={formatNumber(machine.rejectRate)} unit="%" icon={AlertTriangle} color="text-rose-400" />}
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-6">
                {isDataItemVisible(userRole, 'MACHINE_OUTPUT_TREND_CHART', visibilityContext) && (
                    <Card title={`Output vs Target Trend (${period})`}>
                         <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={timeSeriesData.output}>
                                <defs><linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 13}} />
                                <YAxis stroke="#94a3b8" tick={{fontSize: 13}} tickFormatter={(val) => formatNumber(val, 0)} />
                                <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', fontSize: '14px' }} />
                                <Legend />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOutput)" name="Actual (kg)" />
                                <Line type="step" dataKey="target" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" name="Target" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                )}
            </div>
        </div>
    );
    
    // Sub-component for the multi-unit Cikupa dashboard
    const MultiUnitPackingDashboard = ({ machine, userRole, visibilityContext }: { machine: Machine, userRole: UserRole, visibilityContext: any }) => {
        const [selectedUnit, setSelectedUnit] = useState<{ type: 'bagmaker' | 'weigher', index: number } | null>(null);
        const { bagmakerUnits = [], weigherUnits = [], code } = machine;

        const totalBagmakers = bagmakerUnits.length;
        const onlineBagmakers = bagmakerUnits.filter(u => u.status === 'Production').length;
        const totalWeighers = weigherUnits.length;
        const onlineWeighers = weigherUnits.filter(u => u.status === 'Production').length;
        const overallEfficiency = totalBagmakers > 0 ? (bagmakerUnits.reduce((acc, u) => acc + u.totalEfficiency, 0) / totalBagmakers) * 100 : 0;
    
        const getStatusColor = (status: 'Production' | 'Stop' | 'Offline' | 'Idle') => {
            if (status === 'Production') return 'bg-emerald-500 hover:bg-emerald-400';
            if (status === 'Stop') return 'bg-rose-500 hover:bg-rose-400';
            if (status === 'Idle') return 'bg-amber-500 hover:bg-amber-400';
            return 'bg-slate-700 hover:bg-slate-600';
        };

        const getStatusTextColor = (status: 'Production' | 'Stop' | 'Offline' | 'Idle') => {
            if (status === 'Production') return 'text-emerald-400';
            if (status === 'Stop') return 'text-rose-400';
            if (status === 'Idle') return 'text-amber-400';
            return 'text-slate-500';
        };
    
        const renderDetailPanel = () => {
            if (!selectedUnit) {
                 return (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-8">
                        <Eye size={40} className="mb-4" />
                        <h4 className="text-lg font-bold text-slate-300">Select a Unit</h4>
                        <p className="text-sm">Click on a bagmaker or weigher from the grid to view its detailed performance data.</p>
                    </div>
                );
            }
    
            if (selectedUnit.type === 'bagmaker') {
                const unit = bagmakerUnits[selectedUnit.index];
                if (!unit) return null;
                return <SingleBagmakerDetailPanel unit={unit} unitNumber={selectedUnit.index + 1} userRole={userRole} visibilityContext={visibilityContext} />;
            }
    
            if (selectedUnit.type === 'weigher') {
                const unit = weigherUnits[selectedUnit.index];
                if (!unit) return null;
                return <SingleWeigherDetailPanel unit={unit} unitNumber={selectedUnit.index + 1} userRole={userRole} visibilityContext={visibilityContext} />;
            }
            return null;
        };
    
        return (
            <div className="space-y-6">
                <Card title={`${code} Line Control Center`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        {isDataItemVisible(userRole, 'PACKING_MULTI_UNIT_SUMMARY_TOTALS', visibilityContext) && (
                            <>
                                <div className="p-4 bg-slate-900 rounded-lg"><p className="text-xs text-slate-300 uppercase font-bold">Total Bagmakers</p><p className="text-2xl font-bold text-white">{onlineBagmakers}/{totalBagmakers}</p></div>
                                <div className="p-4 bg-slate-900 rounded-lg"><p className="text-xs text-slate-300 uppercase font-bold">Total Weighers</p><p className="text-2xl font-bold text-white">{onlineWeighers}/{totalWeighers}</p></div>
                            </>
                        )}
                        {isDataItemVisible(userRole, 'PACKING_MULTI_UNIT_SUMMARY_EFFICIENCY', visibilityContext) && (
                            <div className="p-4 bg-slate-900 rounded-lg"><p className="text-xs text-slate-300 uppercase font-bold">Overall Efficiency</p><p className="text-2xl font-bold text-emerald-400">{formatNumber(overallEfficiency, 1)}%</p></div>
                        )}
                        {isDataItemVisible(userRole, 'PACKING_MULTI_UNIT_SUMMARY_STATUS', visibilityContext) && (
                            <div className="p-4 bg-slate-900 rounded-lg"><p className="text-xs text-slate-300 uppercase font-bold">Line Status</p><p className="text-2xl font-bold text-emerald-400">OPERATIONAL</p></div>
                        )}
                    </div>
                </Card>
    
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <Card title={`Bagmaker Units (${totalBagmakers})`}>
                            <div className="grid grid-cols-11 gap-2">
                                {bagmakerUnits.map((unit, index) => (
                                    <button 
                                        key={`b-${index}`}
                                        onClick={() => setSelectedUnit({ type: 'bagmaker', index })}
                                        className={`w-full aspect-square rounded-md text-white text-xs font-bold transition-all duration-200 ${getStatusColor(unit.status)} ${selectedUnit?.type === 'bagmaker' && selectedUnit.index === index ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''}`}
                                    >
                                        B{index + 1}
                                    </button>
                                ))}
                            </div>
                        </Card>
                        <Card title={`Weigher Units (${totalWeighers})`}>
                            <div className="grid grid-cols-11 gap-2">
                                {weigherUnits.map((unit, index) => (
                                    <button 
                                        key={`w-${index}`}
                                        onClick={() => setSelectedUnit({ type: 'weigher', index })}
                                        className={`w-full aspect-square rounded-md text-white text-xs font-bold transition-all duration-200 ${getStatusColor(unit.status)} ${selectedUnit?.type === 'weigher' && selectedUnit.index === index ? 'ring-2 ring-offset-2 ring-offset-slate-800 ring-white' : ''}`}
                                    >
                                        W{index + 1}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>
                    
                    <Card title="Selected Unit Details" className="min-h-[400px]">
                        {renderDetailPanel()}
                    </Card>
                </div>
            </div>
        );
    };

    const SingleBagmakerDetailPanel = ({ unit, unitNumber, userRole, visibilityContext }: { unit: BagmakerDetails, unitNumber: number, userRole: UserRole, visibilityContext: any }) => {
        const getStatusTextColor = (status: 'Production' | 'Stop' | 'Offline' | 'Idle') => {
            if (status === 'Production') return 'text-emerald-400';
            if (status === 'Stop') return 'text-rose-400';
            if (status === 'Idle') return 'text-amber-400';
            return 'text-slate-500';
        };
        const StopEventCounter: React.FC<{ icon: any; label: string; value: number; color: string; visible: boolean }> = ({ icon: Icon, label, value, color, visible }) => {
            if (!visible) return null;
            return (
                <div className="flex items-center justify-between p-2 bg-slate-950/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-3"><Icon size={16} className={color} /><span className="text-xs font-medium text-slate-300">{label}</span></div>
                    <span className="font-mono text-base font-bold text-white">{value}</span>
                </div>
            );
        };
        return (
             <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-white">Bagmaker #{unitNumber} - <span className={getStatusTextColor(unit.status)}>{unit.status}</span></h3>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {isDataItemVisible(userRole, 'PACKING_ACTUAL_SPEED', visibilityContext) && <MetricCard title="Actual Speed" value={formatNumber(unit.actualSpeed)} unit="bpm" icon={Gauge} color="text-blue-400" />}
                    {isDataItemVisible(userRole, 'PACKING_GOOD_BAG_PERCENT', visibilityContext) && <MetricCard title="Good Bag %" value={formatNumber(unit.bagPercentage, 2)} unit="%" icon={CheckCircle2} color="text-emerald-400" />}
                    {isDataItemVisible(userRole, 'PACKING_WASTED_FILM', visibilityContext) && <MetricCard title="Wasted Film" value={formatNumber(unit.wastedFilmPercentage, 2)} unit="%" icon={Trash2} color="text-rose-400" />}
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Stop Event Counters (Shift)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <StopEventCounter icon={ScanSearch} label="Metal Detect" value={unit.metalDetectCount} color="text-rose-400" visible={isDataItemVisible(userRole, 'PACKING_METAL_DETECT', visibilityContext)} />
                        <StopEventCounter icon={Printer} label="Printer Error" value={unit.printerDateErrorCount} color="text-amber-400" visible={isDataItemVisible(userRole, 'PACKING_PRINTER_ERROR', visibilityContext)} />
                        <StopEventCounter icon={Archive} label="Product in Seal" value={unit.productInSealCount} color="text-amber-400" visible={isDataItemVisible(userRole, 'PACKING_PRODUCT_IN_SEAL', visibilityContext)} />
                        <StopEventCounter icon={Scissors} label="Splice Detect" value={unit.spliceDetectCount} color="text-blue-400" visible={isDataItemVisible(userRole, 'PACKING_SPLICE_DETECT', visibilityContext)} />
                    </div>
                </div>
            </div>
        )
    };
    
    const SingleWeigherDetailPanel = ({ unit, unitNumber, userRole, visibilityContext }: { unit: WeigherDetails, unitNumber: number, userRole: UserRole, visibilityContext: any }) => {
        const getStatusTextColor = (status: 'Production' | 'Stop' | 'Offline' | 'Idle') => {
            if (status === 'Production') return 'text-emerald-400';
            if (status === 'Stop') return 'text-rose-400';
            if (status === 'Idle') return 'text-amber-400';
            return 'text-slate-500';
        };
        const StatItem: React.FC<{ label: string; value: string | number; unit?: string; visible: boolean }> = ({ label, value, unit, visible }) => {
            if (!visible) return null;
            return (
                <div className="flex justify-between items-baseline"><span className="text-sm font-medium text-slate-300">{label}</span><div><span className="font-mono text-base font-bold text-white">{value}</span>{unit && <span className="ml-1.5 text-xs text-slate-400">{unit}</span>}</div></div>
            );
        };
        return (
            <div className="space-y-4 animate-in fade-in duration-300">
                 <h3 className="text-lg font-bold text-white">Weigher #{unitNumber} - <span className={getStatusTextColor(unit.status)}>{unit.status}</span></h3>
                 <div className="grid grid-cols-2 gap-3">
                    {isDataItemVisible(userRole, 'PACKING_WEIGHER_GIVEAWAY', visibilityContext) && <MetricCard title="Giveaway" value={formatNumber(unit.giveaway, 2)} unit="%" icon={AlertTriangle} color="text-amber-400" />}
                    {isDataItemVisible(userRole, 'PACKING_WEIGHER_STD_DEV', visibilityContext) && <MetricCard title="Std. Deviation" value={formatNumber(unit.standardDeviation, 3)} unit="g" icon={Activity} color="text-purple-400" />}
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2 p-3 bg-slate-900/40 rounded-lg border border-slate-700/50">
                        <h5 className="font-bold text-white text-sm">Weigher 1</h5>
                        <StatItem label="Speed" value={formatNumber(unit.speed1, 0)} unit="bpm" visible={isDataItemVisible(userRole, 'PACKING_WEIGHER_SPEED_1', visibilityContext)} />
                        <StatItem label="Total Weight" value={formatNumber(unit.totalWeight1, 0)} unit="kg" visible={isDataItemVisible(userRole, 'PACKING_WEIGHER_TOTAL_WEIGHT_1', visibilityContext)} />
                    </div>
                    <div className="space-y-2 p-3 bg-slate-900/40 rounded-lg border border-slate-700/50">
                        <h5 className="font-bold text-white text-sm">Weigher 2</h5>
                        <StatItem label="Speed" value={formatNumber(unit.speed2, 0)} unit="bpm" visible={isDataItemVisible(userRole, 'PACKING_WEIGHER_SPEED_2', visibilityContext)} />
                        <StatItem label="Total Weight" value={formatNumber(unit.totalWeight2, 0)} unit="kg" visible={isDataItemVisible(userRole, 'PACKING_WEIGHER_TOTAL_WEIGHT_2', visibilityContext)} />
                    </div>
                </div>
            </div>
        )
    };


    const renderSingleUnitPackingTab = () => {
        const { weigher, bagmaker } = machine;
        if (!weigher || !bagmaker) return <div className="p-4 text-slate-500">Packing data not available.</div>;
        
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <Card title="Line Performance Summary">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {isDataItemVisible(userRole, 'PACKING_TOTAL_EFFICIENCY', visibilityContext) && 
                            <MetricCard icon={GaugeCircle} title="Total Efficiency" value={formatNumber(bagmaker.totalEfficiency * 100, 1)} unit="%" color="text-blue-400" />}
                        {isDataItemVisible(userRole, 'PACKING_EFFICIENCY_WEIGHER', visibilityContext) && 
                            <MetricCard icon={Scale} title="Weigher Efficiency" value={formatNumber(bagmaker.efficiencyWeigher * 100, 1)} unit="%" color="text-emerald-400" />}
                        {isDataItemVisible(userRole, 'PACKING_EFFICIENCY_BAGMAKER', visibilityContext) && 
                            <MetricCard icon={Package} title="Bagmaker Efficiency" value={formatNumber(bagmaker.efficiencyBagmaker * 100, 1)} unit="%" color="text-purple-400" />}
                    </div>
                </Card>
    
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <Card title="Multihead Weigher Analysis">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-300 mb-3 pb-2 border-b border-slate-700/80">Overall Performance</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {isDataItemVisible(userRole, 'PACKING_WEIGHER_GIVEAWAY', visibilityContext) && <MetricCard title="Giveaway" value={formatNumber(weigher.giveaway, 2)} unit="%" icon={AlertTriangle} color="text-amber-400" />}
                                    {isDataItemVisible(userRole, 'PACKING_WEIGHER_STD_DEV', visibilityContext) && <MetricCard title="Std. Deviation" value={formatNumber(weigher.standardDeviation, 3)} unit="g" icon={Activity} color="text-purple-400" />}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-300 mb-3 mt-4 pb-2 border-b border-slate-700/80">Individual Weigher Stats</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3 p-3 bg-slate-900/40 rounded-lg border border-slate-700/50"><h5 className="font-bold text-white text-sm">Weigher 1</h5>{isDataItemVisible(userRole, 'PACKING_WEIGHER_SPEED_1', visibilityContext) && <div className="flex justify-between items-baseline"><span className="text-sm font-medium text-slate-300">Speed</span><div><span className="font-mono text-base font-bold text-white">{formatNumber(weigher.speed1, 0)}</span><span className="ml-1.5 text-xs text-slate-400">bpm</span></div></div>}{isDataItemVisible(userRole, 'PACKING_WEIGHER_TOTAL_WEIGHT_1', visibilityContext) && <div className="flex justify-between items-baseline"><span className="text-sm font-medium text-slate-300">Total Weight</span><div><span className="font-mono text-base font-bold text-white">{formatNumber(weigher.totalWeight1, 0)}</span><span className="ml-1.5 text-xs text-slate-400">kg</span></div></div>}</div>
                                    <div className="space-y-3 p-3 bg-slate-900/40 rounded-lg border border-slate-700/50"><h5 className="font-bold text-white text-sm">Weigher 2</h5>{isDataItemVisible(userRole, 'PACKING_WEIGHER_SPEED_2', visibilityContext) && <div className="flex justify-between items-baseline"><span className="text-sm font-medium text-slate-300">Speed</span><div><span className="font-mono text-base font-bold text-white">{formatNumber(weigher.speed2, 0)}</span><span className="ml-1.5 text-xs text-slate-400">bpm</span></div></div>}{isDataItemVisible(userRole, 'PACKING_WEIGHER_TOTAL_WEIGHT_2', visibilityContext) && <div className="flex justify-between items-baseline"><span className="text-sm font-medium text-slate-300">Total Weight</span><div><span className="font-mono text-base font-bold text-white">{formatNumber(weigher.totalWeight2, 0)}</span><span className="ml-1.5 text-xs text-slate-400">kg</span></div></div>}</div>
                                </div>
                            </div>
                        </div>
                    </Card>
    
                    <Card title="Bagmaker Analysis">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-300 mb-3 pb-2 border-b border-slate-700/80">Key Metrics</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {isDataItemVisible(userRole, 'PACKING_GOOD_BAG_PERCENT', visibilityContext) && <MetricCard title="Good Bag %" value={formatNumber(bagmaker.bagPercentage, 2)} unit="%" icon={CheckCircle2} color="text-emerald-400" />}
                                    {isDataItemVisible(userRole, 'PACKING_WASTED_FILM', visibilityContext) && <MetricCard title="Wasted Film" value={formatNumber(bagmaker.wastedFilmPercentage, 2)} unit="%" icon={Trash2} color="text-rose-400" />}
                                    {isDataItemVisible(userRole, 'PACKING_ACTUAL_SPEED', visibilityContext) && <MetricCard title="Actual Speed" value={formatNumber(bagmaker.actualSpeed)} unit="bpm" icon={Gauge} color="text-blue-400" />}
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-sm font-bold text-slate-300 mb-3 mt-4 pb-2 border-b border-slate-700/80">Stop Event Counters (Shift)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {isDataItemVisible(userRole, 'PACKING_METAL_DETECT', visibilityContext) && <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg border border-slate-700/50"><div className="flex items-center gap-3"><ScanSearch size={18} className="text-rose-400" /><span className="text-sm font-medium text-slate-300">Metal Detect</span></div><span className="font-mono text-lg font-bold text-white">{bagmaker.metalDetectCount}</span></div>}
                                    {isDataItemVisible(userRole, 'PACKING_PRINTER_ERROR', visibilityContext) && <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg border border-slate-700/50"><div className="flex items-center gap-3"><Printer size={18} className="text-amber-400" /><span className="text-sm font-medium text-slate-300">Printer Error</span></div><span className="font-mono text-lg font-bold text-white">{bagmaker.printerDateErrorCount}</span></div>}
                                    {isDataItemVisible(userRole, 'PACKING_PRODUCT_IN_SEAL', visibilityContext) && <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg border border-slate-700/50"><div className="flex items-center gap-3"><Archive size={18} className="text-amber-400" /><span className="text-sm font-medium text-slate-300">Product in Seal</span></div><span className="font-mono text-lg font-bold text-white">{bagmaker.productInSealCount}</span></div>}
                                    {isDataItemVisible(userRole, 'PACKING_SPLICE_DETECT', visibilityContext) && <div className="flex items-center justify-between p-2.5 bg-slate-950/50 rounded-lg border border-slate-700/50"><div className="flex items-center gap-3"><Scissors size={18} className="text-blue-400" /><span className="text-sm font-medium text-slate-300">Splice Detect</span></div><span className="font-mono text-lg font-bold text-white">{bagmaker.spliceDetectCount}</span></div>}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        );
    };

    const renderPackingTab = () => {
        // If the machine has multi-unit data, render the special dashboard
        if (machine.bagmakerUnits && machine.bagmakerUnits.length > 0) {
            return <MultiUnitPackingDashboard machine={machine} userRole={userRole} visibilityContext={visibilityContext} />;
        }
        return renderSingleUnitPackingTab();
    };


    const renderProcessTab = () => {
        const params = machine.processParams || {};
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                    {Object.entries(params).map(([key, value]) => (
                        isDataItemVisible(userRole, `PARAM_${key.toUpperCase().replace(/\s/g,'_')}`, visibilityContext) && (
                            <Card key={key} className="flex flex-col justify-center items-center text-center p-6 bg-slate-800/50">
                                <span className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2">{key}</span>
                                <span className="text-2xl font-bold text-white font-mono">{typeof value === 'number' ? formatNumber(value) : value}</span>
                            </Card>
                        )
                    ))}
                </div>
                {isDataItemVisible(userRole, 'MACHINE_PROCESS_TREND_CHART', visibilityContext) && (
                    <Card title="Process Parameter Trend">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={timeSeriesData.params}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="time" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" tickFormatter={(val) => formatNumber(val, 0)} />
                                <Tooltip formatter={(val) => formatNumber(Number(val))} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                <Legend />
                                <Line type="monotone" dataKey="temp" stroke="#f59e0b" name="Temp" dot={false} strokeWidth={2} />
                                <Line type="monotone" dataKey="pressure" stroke="#3b82f6" name="Pressure" dot={false} strokeWidth={2} />
                                <Line type="monotone" dataKey="speed" stroke="#10b981" name="Speed" dot={false} strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                )}
            </div>
        );
    };

    const renderUtilityTab = () => {
        const util = accumulatedStats?.utility || { electricity: 0, steam: 0, water: 0, air: 0 };
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_ELECTRICITY', visibilityContext) && <MetricCard title={`Electricity (${period})`} value={formatNumber(util.electricity)} unit="kWh" icon={Zap} color="text-yellow-400" />}
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_STEAM', visibilityContext) && <MetricCard title={`Steam (${period})`} value={formatNumber(util.steam)} unit="kg" icon={Cloud} color="text-slate-200" />}
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_WATER', visibilityContext) && <MetricCard title={`Water (${period})`} value={formatNumber(util.water)} unit="m³" icon={Droplets} color="text-blue-400" />}
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_AIR', visibilityContext) && <MetricCard title={`Air (${period})`} value={formatNumber(util.air)} unit="Nm³" icon={Wind} color="text-cyan-400" />}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {isDataItemVisible(userRole, 'MACHINE_UTIL_ELEC_CHART', visibilityContext) && (
                        <Card title="Electricity Consumption Trend">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={timeSeriesData.utility.electricity}>
                                    <defs><linearGradient id="colorElec" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/><stop offset="95%" stopColor="#facc15" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                    <Area type="monotone" dataKey="value" stroke="#facc15" fill="url(#colorElec)" name="kWh" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    )}
                     {isDataItemVisible(userRole, 'MACHINE_UTIL_STEAM_CHART', visibilityContext) && (
                        <Card title="Steam Consumption Trend">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={timeSeriesData.utility.steam}>
                                    <defs><linearGradient id="colorSteam" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#e2e8f0" stopOpacity={0.3}/><stop offset="95%" stopColor="#e2e8f0" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="time" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                                    <Area type="monotone" dataKey="value" stroke="#e2e8f0" fill="url(#colorSteam)" name="kg" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Card>
                    )}
                </div>
            </div>
        );
    };

    const renderAlarmsTab = () => (
        <Card title="Alarm History" className="animate-in fade-in slide-in-from-bottom-2">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="text-xs text-slate-300 uppercase font-bold bg-slate-900/50">
                        <tr>
                            <th className="p-3">Time</th>
                            <th className="p-3">Code</th>
                            <th className="p-3">Message</th>
                            <th className="p-3">Severity</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {alarmHistory.map((alarm : Alarm) => (
                             <tr key={alarm.id} className="hover:bg-slate-800/50">
                                <td className="p-3 font-mono text-slate-300">{alarm.timestamp}</td>
                                <td className="p-3 font-mono text-slate-300">{alarm.code}</td>
                                <td className="p-3 font-semibold text-white">{alarm.message}</td>
                                <td className="p-3"><StatusBadge status={alarm.severity} /></td>
                                <td className="p-3">
                                    <span className={`text-xs font-bold ${alarm.isActive ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {alarm.isActive ? 'ACTIVE' : 'CLEARED'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );

    const renderDowntimeTab = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {canAddDowntime && (
                <div className="flex justify-end">
                    <button onClick={() => setIsDowntimeModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md">
                        <Plus size={16} /> Add Downtime Log
                    </button>
                </div>
            )}
            <Card title="Downtime Logs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-slate-300 uppercase font-bold bg-slate-900/50">
                            <tr>
                                <th className="p-3">Start</th>
                                <th className="p-3">End</th>
                                <th className="p-3">Duration</th>
                                <th className="p-3">Reason</th>
                                <th className="p-3">Description</th>
                                <th className="p-3">Source</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {downtimeLogs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-800/50">
                                    <td className="p-3 font-mono text-slate-300">{log.start}</td>
                                    <td className="p-3 font-mono text-slate-300">{log.end}</td>
                                    <td className="p-3 font-bold text-white">{log.duration}</td>
                                    <td className="p-3"><span className="bg-slate-700 px-2 py-1 rounded-md text-xs font-semibold">{log.reason}</span></td>
                                    <td className="p-3 text-slate-300">{log.description}</td>
                                    <td className="p-3 font-mono text-xs">{log.source}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    const renderMaintenanceTab = () => (
        <div ref={maintenanceRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
             {isDataItemVisible(userRole, 'MACHINE_MAINTENANCE_ACTIVE_ALARM', visibilityContext) && (
                primaryAlarm ? (
                     <Card title="Active Alarm" className="bg-rose-900/20 border border-rose-500/50">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">{primaryAlarm.message}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-rose-300 font-mono">
                                    <span>Code: {primaryAlarm.code}</span>
                                    <span>Time: {primaryAlarm.timestamp}</span>
                                    <span>Severity: <StatusBadge status={primaryAlarm.severity} /></span>
                                </div>
                            </div>
                            {canPerformMaintenance && isDataItemVisible(userRole, 'MACHINE_MAINTENANCE_FORM', visibilityContext) && (
                                <div className="w-full lg:w-[400px] bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                                     {!primaryAlarm.inProgressBy ? (
                                        <form onSubmit={handleStartMaintenance}>
                                            <label className="text-xs font-bold text-slate-300 uppercase mb-2 block">Technician Name</label>
                                            <input type="text" value={startTechnicianName} onChange={e => setStartTechnicianName(e.target.value)} required className="w-full bg-slate-800 p-2 rounded border border-slate-600 mb-3" />
                                            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold">Start Maintenance</button>
                                        </form>
                                    ) : (
                                         <form onSubmit={handleMaintenanceSubmit} className="space-y-3">
                                            <div><label className="text-xs font-bold text-slate-300 uppercase block">Checked By</label><input type="text" value={formCheckedBy} onChange={e => setFormCheckedBy(e.target.value)} required className="w-full bg-slate-800 p-2 rounded border border-slate-600" /></div>
                                            <div><label className="text-xs font-bold text-slate-300 uppercase block">Note</label><textarea value={maintenanceNote} onChange={e => setMaintenanceNote(e.target.value)} required className="w-full bg-slate-800 p-2 rounded border border-slate-600 h-24" /></div>
                                            <div className="flex items-center gap-4"><label className="text-xs font-bold text-slate-300 uppercase">Solved?</label><input type="checkbox" checked={maintenanceSolved} onChange={e => setMaintenanceSolved(e.target.checked)} className="w-5 h-5 accent-emerald-500" /></div>
                                            <button disabled={formSubmitting} type="submit" className="w-full bg-emerald-600 text-white p-2 rounded font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                                                {formSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Submit Report
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>
                ) : (
                    <Card className="text-center py-12 bg-emerald-900/10 border-emerald-500/20">
                        <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                        <h3 className="font-bold text-white text-lg">System Healthy</h3>
                        <p className="text-sm text-slate-300">No active alarms on this machine.</p>
                    </Card>
                )
            )}
             {canViewHistory && isDataItemVisible(userRole, 'MACHINE_MAINTENANCE_HISTORY_TABLE', visibilityContext) && (
                 <Card title="Maintenance History">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-xs text-slate-300 uppercase font-bold bg-slate-900/50">
                                <tr>
                                    <th className="p-3">Time</th>
                                    <th className="p-3">Technician</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {maintenanceHistoryRecords.map(record => (
                                     <tr key={record.id} className="hover:bg-slate-800/50">
                                        <td className="p-3 font-mono text-slate-300">{record.timestamp}</td>
                                        <td className="p-3 font-semibold text-white">{record.checkedBy}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${record.solved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                {record.solved ? 'SOLVED' : 'PENDING'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-slate-300">{record.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Performance': return renderPerformanceTab();
            case 'Process': return renderProcessTab();
            case 'Packing': return renderPackingTab();
            case 'Utility': return renderUtilityTab();
            case 'Alarms': return renderAlarmsTab();
            case 'Downtime': return renderDowntimeTab();
            case 'Maintenance': return renderMaintenanceTab();
            default: return null;
        }
    };
    
    return (
        <div className="space-y-6 animate-in fade-in duration-300 w-full pb-10 relative">
             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-300 hover:text-white">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-white tracking-tight">{machine.name}</h1>
                            <StatusBadge status={machine.status} />
                        </div>
                        <p className="text-slate-300 text-sm mt-0.5 font-medium">{machine.plantId} / {machine.type}</p>
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
                            <span className="hidden sm:inline">{isDownloading ? 'Generating...' : 'Export PDF'}</span>
                        </button>
                    )}
                </div>
            </div>
            
             {visibleTabs.length > 1 && (
                <div className="border-b border-slate-800">
                    <nav className="-mb-px flex space-x-6 overflow-x-auto">
                        {visibleTabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`whitespace-nowrap py-3 px-1 border-b-2 font-bold text-sm transition-colors ${
                                    activeTab === tab.key
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-300'
                                }`}
                            >
                                {tab.key}
                            </button>
                        ))}
                    </nav>
                </div>
            )}
            
            <div className="mt-6">
                {renderActiveTab()}
            </div>
            
            {/* Downtime Modal */}
            {isDowntimeModalOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                    <Card title="Add Manual Downtime Log" className="w-full max-w-lg bg-slate-900 border-slate-700">
                        <form onSubmit={handleAddDowntimeSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-300 uppercase mb-1 block">Start Time</label>
                                    <input type="time" value={newDowntime.start} onChange={e => setNewDowntime({...newDowntime, start: e.target.value})} required className="w-full bg-slate-800 p-2 rounded border border-slate-600"/>
                                </div>
                                 <div>
                                    <label className="text-xs font-bold text-slate-300 uppercase mb-1 block">End Time</label>
                                    <input type="time" value={newDowntime.end} onChange={e => setNewDowntime({...newDowntime, end: e.target.value})} required className="w-full bg-slate-800 p-2 rounded border border-slate-600"/>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-300 uppercase mb-1 block">Reason</label>
                                <select value={newDowntime.reason} onChange={e => setNewDowntime({...newDowntime, reason: e.target.value})} className="w-full bg-slate-800 p-2 rounded border border-slate-600">
                                    <option>Jam</option>
                                    <option>Changeover</option>
                                    <option>Cleaning</option>
                                    <option>No Material</option>
                                    <option>Operator Break</option>
                                    <option>Other</option>
                                </select>
                            </div>
                             <div>
                                <label className="text-xs font-bold text-slate-300 uppercase mb-1 block">Description (Optional)</label>
                                <textarea value={newDowntime.description} onChange={e => setNewDowntime({...newDowntime, description: e.target.value})} className="w-full bg-slate-800 p-2 rounded border border-slate-600 h-20" />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setIsDowntimeModalOpen(false)} className="px-4 py-2 rounded font-bold text-slate-300 hover:text-white">Cancel</button>
                                <button type="submit" className="px-6 py-2 rounded bg-blue-600 text-white font-bold flex items-center gap-2"><Save size={16}/> Save Log</button>
                            </div>
                        </form>
                    </Card>
                 </div>
            )}
            
            {/* Success Toast */}
             {showSuccess && (
                <div className="fixed bottom-8 right-8 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3">
                    <CheckCircle2 size={20} />
                    <p className="font-bold text-sm">Downtime logged successfully!</p>
                </div>
            )}

            {/* Download Toast */}
             {showDownloadToast && (
                <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className="bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl shadow-emerald-900/30 flex items-center gap-3 border border-emerald-500/50">
                        <div className="bg-white/20 p-1 rounded-full"><CheckCircle2 size={18} className="text-white" /></div>
                        <div>
                            <p className="font-bold text-sm">Report Downloaded</p>
                            <p className="text-emerald-100 text-xs mt-0.5">{machine.code}_Report_{period}.pdf</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MachineDetail;