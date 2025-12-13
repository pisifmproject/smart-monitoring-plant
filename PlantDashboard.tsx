import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserRole, AlarmSeverity, Alarm } from './types';
import { Card, MetricCard, StatusBadge, formatNumber } from './components/SharedComponents';
import { isDataItemVisible } from './services/visibilityStore';
import { dashboardService } from './services/dashboardService';
import { plantService } from './services/plantService';
import { maintenanceService } from './services/maintenanceService';
import { 
    Factory, Activity, Zap, AlertTriangle, 
    ArrowLeft, TrendingUp, Clock, AlertCircle, AlertOctagon, Info,
    Download, FileText, Loader2, CheckCircle2
} from 'lucide-react';

interface PlantDashboardProps {
    userRole: UserRole;
}

type Period = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

const PlantDashboard: React.FC<PlantDashboardProps> = ({ userRole }) => {
    const { plantId } = useParams();
    const navigate = useNavigate();
    const [period, setPeriod] = useState<Period>('DAY');
    
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDownloadToast, setShowDownloadToast] = useState(false);

    const plant = useMemo(() => plantService.getPlantById(plantId || ''), [plantId]);
    
    const kpis = useMemo(() => plant ? dashboardService.getPlantKPIs(plant, period) : null, [plant, period]);
    const utilityMetrics = useMemo(() => plantId ? dashboardService.getUtilityMetrics(plantId, period) : [], [plantId, period]);
    const shifts = useMemo(() => plant ? dashboardService.getShifts(plant) : [], [plant]);
    const activeAlarms = useMemo(() => maintenanceService.getActiveAlarms(plantId), [plantId]);
    const productionMachines = useMemo(() => plantId ? plantService.getProductionLines(plantId, period) : [], [plantId, period]);

    if (!plant || !kpis) return <div className="p-8 text-slate-300">Plant not found</div>;

    const canClickDetails = ![UserRole.VIEWER].includes(userRole);
    const canDownloadReport = [UserRole.ADMINISTRATOR, UserRole.SUPERVISOR, UserRole.MANAGEMENT].includes(userRole);
    const visibilityContext = { plantId: plant.id };
    const showAlarms = ![UserRole.VIEWER, UserRole.MANAGEMENT].includes(userRole);

    const FilterButton = ({ label }: { label: Period }) => {
        if (userRole === UserRole.OPERATOR && label !== 'DAY') return null;
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

    const getAlarmIcon = (severity: AlarmSeverity) => {
        switch (severity) {
            case AlarmSeverity.CRITICAL: return <AlertOctagon size={16} className="text-rose-500" />;
            case AlarmSeverity.WARNING: return <AlertTriangle size={16} className="text-amber-500" />;
            case AlarmSeverity.INFO: return <Info size={16} className="text-blue-500" />;
            default: return <AlertCircle size={16} className="text-slate-500" />;
        }
    };

    const handleAlarmClick = (alarm: Alarm) => {
        if (!canClickDetails || !alarm.machineId) return;
        const targetTab = userRole === UserRole.MAINTENANCE ? 'Maintenance' :