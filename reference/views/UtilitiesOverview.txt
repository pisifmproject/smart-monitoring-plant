import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plant, UserRole } from '../types';
import { plantService } from '../services/plantService';
import { utilityService } from '../services/utilityService';
import { Card, formatNumber } from '../components/SharedComponents';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface UtilitiesOverviewProps {
    userRole: UserRole;
}

type Period = 'Day' | 'Week' | 'Month' | 'Year';

const UtilitiesOverview: React.FC<UtilitiesOverviewProps> = ({ userRole }) => {
    const { plantId } = useParams();
    const navigate = useNavigate();
    const plant = plantService.getPlantById(plantId!);
    const [period, setPeriod] = useState<Period>('Day');

    if (!plant) {
        return <div className="p-8 text-slate-300">Plant not found.</div>;
    }

    const utilityTypes = utilityService.getUtilityTypes();
    const canClickDetails = ![UserRole.VIEWER, UserRole.MANAGEMENT].includes(userRole);

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
                        <h1 className="text-2xl font-bold text-white tracking-tight">Energy & Utilities Overview</h1>
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
                {utilityTypes.map(utilType => {
                    const config = utilityService.getUtilityConfig(plant, utilType.key, period);

                    return (
                        <Card 
                            key={utilType.key}
                            onClick={() => canClickDetails && navigate(`/app/utility/${utilType.key}/${plantId}`)}
                            className={`group transition-all duration-200 ${canClickDetails ? 'cursor-pointer hover:border-blue-500 hover:bg-slate-700/20' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-lg bg-slate-700/50 ${config.color}`}>
                                        <utilType.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`text-lg font-bold text-white transition-colors ${canClickDetails ? 'group-hover:text-blue-400' : ''}`}>{config.label}</h3>
                                        <p className="text-xs text-slate-300 font-bold uppercase">Total Consumption ({period})</p>
                                    </div>
                                </div>
                                <div className="flex items-baseline text-right">
                                    <span className="text-3xl font-bold text-white">{formatNumber(config.value, 1)}</span>
                                    <span className="ml-1.5 text-sm font-medium text-slate-300">{config.unit}</span>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default UtilitiesOverview;
