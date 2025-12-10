import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plant, UserRole } from '../types';
import { plantService } from '../services/plantService';
import { Card, formatNumber, StatusBadge } from '../components/SharedComponents';
import { ArrowLeft, Cpu } from 'lucide-react';

interface ProductionLinesOverviewProps {
    userRole: UserRole;
}

const ProductionLinesOverview: React.FC<ProductionLinesOverviewProps> = ({ userRole }) => {
    const { plantId } = useParams();
    const navigate = useNavigate();
    const plant = plantService.getPlantById(plantId!);

    if (!plant) {
        return <div className="p-8 text-slate-300">Plant not found.</div>;
    }

    const machines = plant.machines;
    const canClickDetails = userRole !== UserRole.VIEWER;

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

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900/50 text-slate-300 font-bold uppercase text-xs tracking-wider">
                            <tr>
                                <th className="p-4">Machine Name</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">OEE</th>
                                <th className="p-4 text-center">Output (Shift)</th>
                                <th className="p-4 text-center">Reject Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {machines.map(machine => (
                                <tr 
                                    key={machine.id}
                                    onClick={() => canClickDetails && navigate(`/app/machines/${machine.id}`)}
                                    className={`group transition-colors ${canClickDetails ? 'cursor-pointer hover:bg-slate-800/50' : ''}`}
                                >
                                    <td className={`p-4 font-bold text-white transition-colors ${canClickDetails ? 'group-hover:text-blue-400' : ''}`}>{machine.name}</td>
                                    <td className="p-4 text-center"><StatusBadge status={machine.status} /></td>
                                    <td className={`p-4 text-center font-mono font-bold ${machine.oee > 0.8 ? 'text-emerald-400' : machine.oee > 0.6 ? 'text-amber-400' : 'text-rose-400'}`}>
                                        {formatNumber(machine.oee * 100, 1)}%
                                    </td>
                                    <td className="p-4 text-center font-mono text-white">
                                        {formatNumber(machine.totalOutputShift, 0)} kg
                                    </td>
                                    <td className="p-4 text-center font-mono text-rose-400">
                                        {formatNumber(machine.rejectRate, 2)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ProductionLinesOverview;
