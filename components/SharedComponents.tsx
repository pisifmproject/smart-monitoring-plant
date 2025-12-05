import React from 'react';
import { LucideIcon } from 'lucide-react';
import { MachineStatus } from '../types';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }> = ({ children, className = "", title, action }) => (
    <div className={`bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-sm ${className}`}>
        {(title || action) && (
            <div className="flex justify-between items-center mb-4">
                {title && <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider">{title}</h3>}
                {action && <div>{action}</div>}
            </div>
        )}
        {children}
    </div>
);

export const MetricCard: React.FC<{ title: string; value: string | number; unit?: string; icon: LucideIcon; trend?: string; trendUp?: boolean; color?: string }> = ({ 
    title, value, unit, icon: Icon, trend, trendUp, color = "text-blue-400" 
}) => (
    <Card className="hover:border-slate-600 transition-colors">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-slate-400 text-xs font-medium uppercase">{title}</p>
                <div className="mt-2 flex items-baseline">
                    <span className="text-2xl font-bold text-white">{value}</span>
                    {unit && <span className="ml-1 text-sm text-slate-400">{unit}</span>}
                </div>
            </div>
            <div className={`p-2 rounded-md bg-slate-700/50 ${color}`}>
                <Icon size={20} />
            </div>
        </div>
        {trend && (
            <div className={`mt-2 text-xs flex items-center ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span>{trendUp ? '↑' : '↓'} {trend}</span>
                <span className="text-slate-500 ml-1">vs yesterday</span>
            </div>
        )}
    </Card>
);

export const StatusBadge: React.FC<{ status: MachineStatus | string }> = ({ status }) => {
    let colorClass = 'bg-slate-600 text-slate-200';
    
    switch (status) {
        case MachineStatus.RUNNING:
        case 'NORMAL':
            colorClass = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            break;
        case MachineStatus.IDLE:
        case 'WARNING':
            colorClass = 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
            break;
        case MachineStatus.BREAKDOWN:
        case 'CRITICAL':
            colorClass = 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
            break;
        case MachineStatus.OFFLINE:
            colorClass = 'bg-slate-700 text-slate-400 border border-slate-600';
            break;
    }

    return (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${colorClass}`}>
            {status}
        </span>
    );
};
