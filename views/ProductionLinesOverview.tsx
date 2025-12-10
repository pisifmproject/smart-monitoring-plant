import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plant, UserRole, Machine } from '../types';
import { plantService } from '../services/plantService';
import { Card, formatNumber, StatusBadge } from '../components/SharedComponents';
import { ArrowLeft, Cpu, Activity, Box, Clock, AlertTriangle } from 'lucide-react';

interface ProductionLinesOverviewProps {
    userRole: UserRole;
}

const MetricItem: React.FC<{ icon: React.ElementType; label: string; value: string; colorClass?: string }> = ({ icon: Icon, label, value, colorClass = "text-white" }) => (
    <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Icon size={14} />
            {label}
        </p>
        <p className={`text-2xl font-bold font-mono mt-1 ${colorClass}`}>{value}</p>
    </div>
);


const ProductionLinesOverview: React.FC<ProductionLinesOverviewProps> = ({ userRole }) => {
    const { plantId } = useParams();
    const navigate = useNavigate();
    const plant = plantService.getPlantById(plantId!);

    if (!plant) {
        return <div className="p-8 text-slate-300">Plant not found.</div>;
    }

    const machines = plant.machines;
    const canClickDetails = userRole !== UserRole.VIEWER;

    const getOeeColor = (oee: number) => {
        if (oee > 0.8) return 'text-emerald-400';
        if (oee > 0.6) return 'text-amber-400';
        return 'text-rose-400';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-300 w-full">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(`/app/plants/${plantId}`)} className="p-1.5 hover:bg-slate-800 rounded-full transition-colors text-slate-300 hover:text-white">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Cpu className="text-blue-500" />
                        Production Lines Overview
                    </h1>
                    <p className="text-slate-300 text-sm font-medium">{plant.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {machines.map(machine => (
                    <Card 
                        key={machine.id}
                        onClick={() => canClickDetails && navigate(`/app/machines/${machine.id}`)}
                        className={`flex flex-col transition-all duration-200 group ${canClickDetails ? 'cursor-pointer hover:border-blue-500 hover:shadow-lg hover:-translate-y-1' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className={`font-bold text-white text-lg transition-colors ${canClickDetails ? 'group-hover:text-blue-400' : ''}`}>{machine.name}</h3>
                            <StatusBadge status={machine.status} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-5 gap-x-4 mt-auto pt-4 border-t border-slate-700/50">
                            <MetricItem 
                                icon={Activity}
                                label="OEE"
                                value={`${formatNumber(machine.oee * 100, 1)}%`}
                                colorClass={getOeeColor(machine.oee)}
                            />
                            <MetricItem 
                                icon={Box}
                                label="Output (Shift)"
                                value={`${formatNumber(machine.totalOutputShift, 0)} kg`}
                            />
                             <MetricItem 
                                icon={Clock}
                                label="Availability"
                                value={`${formatNumber((machine.availability || 0) * 100, 1)}%`}
                            />
                            <MetricItem 
                                icon={AlertTriangle}
                                label="Reject Rate"
                                value={`${formatNumber(machine.rejectRate, 2)}%`}
                                colorClass="text-rose-400"
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ProductionLinesOverview;