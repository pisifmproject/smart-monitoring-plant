import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plant, UserRole, Machine } from '../types';
import { plantService } from '../services/plantService';
import { Card, formatNumber, StatusBadge } from '../components/SharedComponents';
import { ArrowLeft, Cpu, Activity, Box, Clock, AlertTriangle } from 'lucide-react';

interface ProductionLinesOverviewProps {
    userRole: UserRole;
}

type Period = 'Day' | 'Week' | 'Month' | 'Year';

const MetricItem: React.FC<{ icon: React.ElementType; label: string; value: string; colorClass?: string }> = ({ icon: Icon, label, value, colorClass = "text-white" }) => (
    <div>
        <p className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
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
    const [period, setPeriod] = useState<Period>('Day');

    if (!plant) {
        return <div className="p-8 text-slate-300">Plant not found.</div>;
    }

    const scaledMachines = useMemo(() => {
        const multiplier = period === 'Day' ? 1 : period === 'Week' ? 7 : period === 'Month' ? 30 : 365;
        return plant.machines.map(machine => ({
            ...machine,
            scaledOutput: machine.totalOutputShift * multiplier,
            // OEE is an average, so we add a slight random variance for different periods for realism
            scaledOee: Math.min(0.99, machine.oee * (1 + (multiplier > 1 ? (Math.random() - 0.5) * 0.1 : 0))),
        }));
    }, [plant.machines, period]);

    const canClickDetails = true;

    const getOeeColor = (oee: number) => {
        if (oee > 0.8) return 'text-emerald-400';
        if (oee > 0.6) return 'text-amber-400';
        return 'text-rose-400';
    };
    
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
        <div className="space-y-6 animate-in fade-in duration-300 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                 <div className="bg-slate-900 border border-slate-700 p-1 rounded-lg flex gap-1 self-start sm:self-auto">
                    <FilterButton label="Day" />
                    <FilterButton label="Week" />
                    <FilterButton label="Month" />
                    <FilterButton label="Year" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {scaledMachines.map(machine => (
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
                                value={`${formatNumber(machine.scaledOee * 100, 1)}%`}
                                colorClass={getOeeColor(machine.scaledOee)}
                            />
                            <MetricItem 
                                icon={Box}
                                label={`Output (${period})`}
                                value={`${formatNumber(machine.scaledOutput, 0)} kg`}
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
