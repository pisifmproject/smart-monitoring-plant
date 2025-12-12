import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Building2,
  ChevronRight,
  ArrowLeft,
  Factory,
  Zap,
  Cpu
} from 'lucide-react';
import { User, UserRole, Plant, PlantCode } from '../types';
import { utilityService } from '../services/utilityService';

// --- Sub-components ---

export const SidebarLink: React.FC<{ to: string; label: string; active: boolean; icon?: any; isCollapsed: boolean; onClick?: (e: React.MouseEvent) => void }> = ({ to, label, active, icon: Icon, isCollapsed, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    title={isCollapsed ? label : undefined}
    className={`group relative flex items-center justify-between px-4 py-3 mx-2 my-1 rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
        : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
    } ${isCollapsed ? 'justify-center' : ''}`}
  >
    <div className="flex items-center gap-3">
        {Icon && (
            <Icon size={18} className={`transition-colors shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`} />
        )}
        {!isCollapsed && <span className="truncate">{label}</span>}
    </div>
    {active && !isCollapsed && <ChevronRight size={14} className="text-white/70" />}
  </Link>
);

export const NestedSidebarLink: React.FC<{ to: string; label: string; active: boolean; }> = ({ to, label, active }) => (
    <Link to={to} className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'text-white bg-slate-700/50' : 'text-slate-300 hover:text-white'}`}>
        {label}
    </Link>
);

export const DropdownMenu: React.FC<{ title: string; to: string; icon: any; isCollapsed: boolean; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, to, icon: Icon, isCollapsed, children, isOpen, onToggle }) => {
    if (isCollapsed) {
        return (
            <div className="flex justify-center my-3 mx-2 p-2 bg-slate-800/30 rounded-lg border border-slate-700/50" title={title}>
                <Icon size={18} className="text-slate-400" />
            </div>
        );
    }

    return (
        <div className="px-3 my-1">
            <div className="w-full flex items-center justify-between p-1 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
                <Link to={to} className="flex-1 flex items-center gap-3 p-2 rounded-md">
                    <Icon size={18} className="text-slate-400" />
                    <span className="text-sm font-bold">{title}</span>
                </Link>
                <button onClick={onToggle} className="p-2 rounded-md hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                    <ChevronRight size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                </button>
            </div>
            <div style={{
                maxHeight: isOpen ? '1000px' : '0px',
                transition: 'max-height 0.5s ease-in-out, opacity 0.3s ease-in-out',
                opacity: isOpen ? 1 : 0,
                overflow: 'hidden'
            }}>
                <div className="pt-1 pb-2 pl-4 border-l-2 border-slate-800 ml-5 space-y-0.5">
                    {children}
                </div>
            </div>
        </div>
    );
};

const UserAvatar = ({ name }: { name: string }) => {
  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
      {initials}
    </div>
  );
};

export const UserProfileFooter: React.FC<{ user: User; onLogout: () => void; isCollapsed: boolean; }> = ({ user, onLogout, isCollapsed }) => (
    <div className="p-3 border-t border-slate-800">
        <div className={`p-2 transition-all duration-300 bg-slate-900/50 border border-slate-800/80 rounded-2xl ${isCollapsed ? 'w-14 mx-auto' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
                <UserAvatar name={user.name} />
                {!isCollapsed && (
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user.name}</p>
                        <p className="text-xs text-blue-400 font-medium truncate">{user.role}</p>
                    </div>
                )}
            </div>
            {!isCollapsed && (
                <button
                    onClick={() => { onLogout(); window.location.hash = '/'; }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 text-xs font-bold uppercase tracking-wider transition-all border border-slate-700 hover:border-rose-500/30 group"
                >
                    <LogOut size={14} className="group-hover:scale-110 transition-transform"/> Sign Out
                </button>
            )}
        </div>
    </div>
);

// --- Main Sidebar Component ---

interface SidebarProps {
    isCollapsed: boolean;
    user: User;
    allPlants: Plant[];
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ isCollapsed, user, allPlants, onLogout }) => {
    const location = useLocation();
    const params = useParams();
    const utilityTypes = utilityService.getUtilityTypes();

    // State for local UI interactions (accordions/dropdowns)
    const [expandedPlant, setExpandedPlant] = useState<string | null>(null);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const userInteractedRef = useRef(false);

    // Filter plants based on access
    const plantsToShow = useMemo(() => {
        if (user.role === UserRole.ADMINISTRATOR) return allPlants;
        return allPlants.filter(p => user.plantAccess?.includes(p.id));
    }, [allPlants, user.role, user.plantAccess]);

    // Resolve context (current plant) based on URL
    const plantContext = useMemo(() => {
        // 1. Try to find plant ID in path segments
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const plantIdFromPath = pathSegments.find(seg => allPlants.some(p => p.id === seg));

        if (plantIdFromPath) {
            return allPlants.find(p => p.id === plantIdFromPath) || null;
        }

        // 2. Try to infer from machine ID or panel ID in params
        // Note: machines must be populated in allPlants
        if (params.machineId) {
             for (const p of allPlants) {
                 if (p.machines.some(m => m.id === params.machineId)) return p;
             }
        }
        // TODO: Handle LVMDP logic if they are populated in allPlants
        return null;
    }, [location.pathname, params.machineId, params.panelId, allPlants]);

    // Effect to auto-expand menus based on current route
    useEffect(() => {
        if (userInteractedRef.current) {
            return;
        }

        const path = location.pathname;
        const isMachineDetail = path.startsWith('/app/machines/');
        const isUtilityDetail = path.startsWith('/app/utility/');
        const isPlantDashboard = path.match(/^\/app\/plants\/[A-Z_]+$/);
        const isOverview = path.endsWith('/utilities') || path.endsWith('/production-lines');

        if (isMachineDetail) {
            setOpenDropdown('production');
        } else if (isUtilityDetail) {
            setOpenDropdown('utilities');
        } else {
            setOpenDropdown(null);
        }

        if ((isMachineDetail || isUtilityDetail || isPlantDashboard || isOverview) && plantContext) {
             setExpandedPlant(plantContext.id);
        }

    }, [location.pathname, plantContext]);

    const handleManualDropdownToggle = (dropdown: 'utilities' | 'production') => {
        userInteractedRef.current = true;
        setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
    };

     const handleManualAccordionToggle = (plantId: string) => {
        userInteractedRef.current = true;
        setExpandedPlant(prev => (prev === plantId ? null : plantId));
    };

    const canSeeGlobalDashboard = user.role === UserRole.ADMINISTRATOR || [UserRole.MANAGEMENT, UserRole.VIEWER].includes(user.role);

    let displayMode: 'GLOBAL' | 'CONTEXTUAL' | 'HYBRID' = 'GLOBAL';

    if (plantContext) {
        if ([UserRole.ADMINISTRATOR, UserRole.MANAGEMENT].includes(user.role)) {
            displayMode = 'CONTEXTUAL';
        } else { // All other roles get HYBRID
            displayMode = 'HYBRID';
        }
    }

    const SidebarHeader = () => (
         <div className={`px-6 py-8 border-b border-slate-800/50 bg-[#0b1120] flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
            <div className="flex flex-col items-center">
                <h1 className={`text-sm font-extrabold text-white tracking-tighter whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>
                    PT INDOFOOD FORTUNA MAKMUR
                </h1>
            </div>
        </div>
    );

    return (
        <>
            <SidebarHeader />
             <nav className="flex-1 overflow-y-auto px-1 py-6 custom-scrollbar space-y-1">
                {/* CONTEXTUAL: Admin/Management on a Plant page */}
                {displayMode === 'CONTEXTUAL' && plantContext && (
                    <>
                       {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Navigation</div>}
                       <SidebarLink to="/app/dashboard/global" label="Back to Global Overview" active={false} icon={ArrowLeft} isCollapsed={isCollapsed} />

                       {!isCollapsed && <div className="px-5 mb-2 mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{plantContext.name}</div>}
                       <SidebarLink to={`/app/plants/${plantContext.id}`} label="Plant Dashboard" active={location.pathname === `/app/plants/${plantContext.id}`} icon={Factory} isCollapsed={isCollapsed} />

                       <DropdownMenu
                            title="Energy & Utilities"
                            to={`/app/plants/${plantContext.id}/utilities`}
                            icon={Zap}
                            isCollapsed={isCollapsed}
                            isOpen={openDropdown === 'utilities'}
                            onToggle={() => handleManualDropdownToggle('utilities')}
                       >
                            {utilityTypes.map(util => <NestedSidebarLink key={util.key} to={`/app/utility/${util.key}/${plantContext.id}`} label={util.label} active={location.pathname === `/app/utility/${util.key}/${plantContext.id}`} />)}
                       </DropdownMenu>

                       <DropdownMenu
                            title="Production Lines"
                            to={`/app/plants/${plantContext.id}/production-lines`}
                            icon={Cpu}
                            isCollapsed={isCollapsed}
                            isOpen={openDropdown === 'production'}
                            onToggle={() => handleManualDropdownToggle('production')}
                       >
                            {plantContext.machines.map(m => <NestedSidebarLink key={m.id} to={`/app/machines/${m.id}`} label={m.name} active={params.machineId === m.id} />)}
                       </DropdownMenu>
                    </>
                )}

                {/* HYBRID: Supervisor/Operator/Guest etc on any page */}
                {displayMode === 'HYBRID' && (
                     <>
                        {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Production Plants</div>}
                        {plantsToShow.map(plantItem => {
                            const isActivePlant = plantContext?.id === plantItem.id;
                            const isExpanded = expandedPlant === plantItem.id;

                            return (
                                 <div key={plantItem.id} className={`mx-2 my-1 rounded-xl transition-all duration-300 ${isActivePlant ? 'bg-slate-800' : ''}`}>
                                    <SidebarLink
                                        to={`/app/plants/${plantItem.id}`}
                                        label={plantItem.name}
                                        active={location.pathname === `/app/plants/${plantItem.id}`}
                                        icon={Building2}
                                        isCollapsed={isCollapsed}
                                        onClick={(e) => {
                                            if (isActivePlant) {
                                                e.preventDefault();
                                                handleManualAccordionToggle(plantItem.id);
                                            } else {
                                                userInteractedRef.current = false;
                                            }
                                        }}
                                    />
                                    {isActivePlant && !isCollapsed && (
                                        <div style={{ maxHeight: isExpanded ? '1000px' : '0px', transition: 'max-height 0.5s ease-in-out', overflow: 'hidden' }}>
                                             <div className="border-t border-slate-700/50 mx-4 my-2"></div>
                                             <DropdownMenu
                                                title="Energy & Utilities"
                                                to={`/app/plants/${plantItem.id}/utilities`}
                                                icon={Zap}
                                                isCollapsed={isCollapsed}
                                                isOpen={openDropdown === 'utilities'}
                                                onToggle={() => handleManualDropdownToggle('utilities')}
                                              >
                                                {utilityTypes.map(util => <NestedSidebarLink key={util.key} to={`/app/utility/${util.key}/${plantItem.id}`} label={util.label} active={location.pathname === `/app/utility/${util.key}/${plantItem.id}`} />)}
                                            </DropdownMenu>
                                             <DropdownMenu
                                                title="Production Lines"
                                                to={`/app/plants/${plantItem.id}/production-lines`}
                                                icon={Cpu}
                                                isCollapsed={isCollapsed}
                                                isOpen={openDropdown === 'production'}
                                                onToggle={() => handleManualDropdownToggle('production')}
                                             >
                                                {plantItem.machines.map(m => <NestedSidebarLink key={m.id} to={`/app/machines/${m.id}`} label={m.name} active={params.machineId === m.id} />)}
                                            </DropdownMenu>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                     </>
                )}

                {/* GLOBAL: Default view for Admins/Mgmt/Guests on non-plant pages */}
                {displayMode === 'GLOBAL' && (
                     <>
                        {canSeeGlobalDashboard && (
                            <div className="mb-4">
                                {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dashboards</div>}
                                <SidebarLink to="/app/dashboard/global" label="Global Overview" active={location.pathname.includes('/app/dashboard/global')} icon={LayoutDashboard} isCollapsed={isCollapsed} />
                            </div>
                        )}

                        {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Production Plants</div>}
                        {plantsToShow.map(plantItem => (
                            <SidebarLink key={plantItem.id} to={`/app/plants/${plantItem.id}`} label={plantItem.name} active={location.pathname.includes(`/app/plants/${plantItem.id}`)} icon={Building2} isCollapsed={isCollapsed} />
                        ))}
                     </>
                )}

                {/* Admin settings link, always available at the bottom */}
                {user.role === UserRole.ADMINISTRATOR && (
                    <div className="pt-4">
                        {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administration</div>}
                        <SidebarLink to="/app/settings" label="System Settings" active={location.pathname.startsWith('/app/settings')} icon={Settings} isCollapsed={isCollapsed} />
                    </div>
                )}
            </nav>
            <UserProfileFooter user={user} onLogout={onLogout} isCollapsed={isCollapsed} />
        </>
    );
});

export default Sidebar;
