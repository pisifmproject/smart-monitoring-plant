import React from 'react';
import { LucideIcon } from 'lucide-react';
import { MachineStatus } from '../types';

export const formatNumber = (value: number | undefined | null, maxDecimals: number = 2): string => {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString('id-ID', { maximumFractionDigits: maxDecimals });
};

// FIX: Added onClick prop to allow Card component to be clickable.
export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode; onClick?: React.MouseEventHandler<HTMLDivElement>; }> = ({ children, className = "", title, action, onClick }) => (
    <div onClick={onClick} className={`bg-slate-800 border border-slate-700 rounded-xl p-4 md:p-5 shadow-sm transition-all duration-300 ${className}`}>
        {(title || action) && (
            <div className="flex justify-between items-center mb-4">
                {title && <h3 className="text-slate-200 font-semibold text-lg tracking-normal">{title}</h3>}
                {action && <div>{action}</div>}
            </div>
        )}
        {children}
    </div>
);

export const MetricCard: React.FC<{ title: string; value: string | number; unit?: string; icon: LucideIcon; trend?: string; trendUp?: boolean; color?: string }> = ({ 
    title, value, unit, icon: Icon, trend, trendUp, color = "text-blue-400" 
}) => (
    <Card className="hover:border-slate-500 hover:bg-slate-700/50 transition-colors duration-200">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-slate-300 text-sm font-medium uppercase tracking-wide">{title}</p>
                <div className="mt-2 flex items-baseline">
                    <span className="text-2xl lg:text-[1.6rem] font-bold text-white tracking-tight leading-none">{value}</span>
                    {unit && <span className="ml-1.5 text-sm font-medium text-slate-300">{unit}</span>}
                </div>
            </div>
            <div className={`p-2.5 rounded-lg bg-slate-700/50 ${color}`}>
                <Icon size={24} strokeWidth={2} />
            </div>
        </div>
        {trend && (
            <div className={`mt-3 text-sm font-medium flex items-center ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span>{trendUp ? '↑' : '↓'} {trend}</span>
                <span className="text-slate-400 ml-1.5 font-normal">vs yesterday</span>
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
        <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide ${colorClass}`}>
            {status}
        </span>
    );
};