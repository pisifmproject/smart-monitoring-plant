





import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
  useNavigate,
  Link,
  Outlet,
} from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Building2, 
  ChevronRight,
  User as UserIcon,
  ChevronsLeft,
  Menu,
  X,
  Loader2,
  Factory,
  ArrowLeft,
  Zap,
  Cpu
} from 'lucide-react';

import { User, UserRole, Plant } from './types';

// Lazy load views for better performance
const Landing = lazy(() => import('./views/Landing'));
const Login = lazy(() => import('./views/Login'));
const MachineDetail = lazy(() => import('./views/MachineDetail'));
const LVMDPDetail = lazy(() => import('./views/LVMDPDetail'));
const UtilitySummary = lazy(() => import('./views/UtilitySummary'));
const SettingsView = lazy(() => import('./views/Settings'));
const GlobalDashboard = lazy(() => import('./GlobalDashboard'));
const PlantDashboard = lazy(() => import('./views/PlantDashboard'));

// Services
import { plantService } from './services/plantService';
import { lvmdpService } from './services/lvmdpService';
import { utilityService } from './services/utilityService';

// Fallback component for Suspense
const SuspenseSpinner: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center p-20">
    <div className="flex flex-col items-center gap-4">
      <Loader2 size={32} className="text-blue-500 animate-spin" />
      <span className="text-sm font-medium text-slate-400">Loading Module...</span>
    </div>
  </div>
);


// ---------------------------------------
// SIDEBAR COMPONENTS (REFACTORED)
// ---------------------------------------

const SidebarLink: React.FC<{ to: string; label: string; active: boolean; icon?: any; isCollapsed: boolean; onClick?: (e: React.MouseEvent) => void }> = ({ to, label, active, icon: Icon, isCollapsed, onClick }) => (
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
            <Icon size={18} className={`transition-colors shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
        )}
        {!isCollapsed && <span className="truncate">{label}</span>}
    </div>
    {active && !isCollapsed && <ChevronRight size={14} className="text-white/70" />}
  </Link>
);

const NestedSidebarLink: React.FC<{ to: string; label: string; active: boolean; }> = ({ to, label, active }) => (
    <Link to={to} className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? 'text-white bg-slate-700/50' : 'text-slate-300 hover:text-white'}`}>
        {label}
    </Link>
);

const DropdownMenu: React.FC<{ title: string; icon: any; isCollapsed: boolean; children: React.ReactNode; defaultOpen?: boolean; }> = ({ title, icon: Icon, isCollapsed, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    // Sync open state if defaultOpen prop changes (e.g., on navigation)
    useEffect(() => {
        setIsOpen(defaultOpen);
    }, [defaultOpen]);

    if (isCollapsed) {
        return (
            <div className="flex justify-center my-3 mx-2 p-2 bg-slate-800/30 rounded-lg border border-slate-700/50" title={title}>
                <Icon size={18} className="text-slate-400" />
            </div>
        );
    }

    return (
        <div className="px-3 my-1">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors">
                <div className="flex items-center gap-3">
                    <Icon size={18} className="text-slate-400" />
                    <span className="text-sm font-bold">{title}</span>
                </div>
                <ChevronRight size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
            </button>
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
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0">
      {initials}
    </div>
  );
};

const UserProfileFooter: React.FC<{ user: User; onLogout: () => void; isCollapsed: boolean; }> = ({ user, onLogout, isCollapsed }) => (
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


// ---------------------------------------
// PROTECTED LAYOUT (WITH CONTEXTUAL SIDEBAR)
// ---------------------------------------
const ProtectedLayout = ({ user, onLogout }: { user: User | null; onLogout: () => void; }) => {
    const location = useLocation();
    const params = useParams();

    const [isSidebarOpen, setIsSidebarOpen] = useState(() => localStorage.getItem('sidebarOpen') !== 'false');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('sidebarOpen', String(isSidebarOpen));
    }, [isSidebarOpen]);
  
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    if (!user || !user.role) return <Navigate to="/login" replace />;

    const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => {
        // --- CONTEXT & ROLE DETECTION ---
        const plant = useMemo(() => {
            if (params.plantId) return plantService.getPlantById(params.plantId);
            if (params.machineId) {
                const machine = plantService.getMachineById(params.machineId);
                return machine ? plantService.getPlantById(machine.plantId) : null;
            }
            if (location.pathname.startsWith('/app/utility/')) {
                 const pathParts = location.pathname.split('/');
                 const plantId = pathParts[pathParts.length-1];
                 return plantService.getPlantById(plantId);
            }
            return null;
        }, [params.plantId, params.machineId, location.pathname]);

        const isPrivilegedRole = [UserRole.ADMINISTRATOR, UserRole.MANAGEMENT].includes(user.role);
        const isGuestRole = user.role === UserRole.VIEWER;
        const isOperationalRole = !isPrivilegedRole && !isGuestRole;

        const allPlants = plantService.getAllPlants();
        const isAdmin = user.role === UserRole.ADMINISTRATOR;
        const canViewGlobal = [UserRole.ADMINISTRATOR, UserRole.MANAGEMENT, UserRole.VIEWER].includes(user.role);

        // --- RENDER LOGIC BASED ON ROLE ---
        if (isGuestRole) {
            // --- GUEST SIDEBAR (ALWAYS GLOBAL) ---
            return (
                <>
                    <div className={`px-6 py-8 border-b border-slate-800/50 bg-[#0b1120] flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                        <div className="flex flex-col items-center">
                            <h1 className={`text-sm font-extrabold text-white tracking-tighter whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>
                                PT INDOFOOD FORTUNA MAKMUR
                            </h1>
                            <p className={`text-[11px] font-bold text-blue-500 mt-1.5 uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                Smart Monitoring Multi Plant
                            </p>
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto px-1 py-6 custom-scrollbar space-y-6">
                        {canViewGlobal && (
                            <div>
                                {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dashboards</div>}
                                <SidebarLink to="/app/dashboard/global" label="Global Overview" active={location.pathname.includes('/app/dashboard/global')} icon={LayoutDashboard} isCollapsed={isCollapsed} />
                            </div>
                        )}
                        <div>
                            {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Production Plants</div>}
                            <div className="space-y-0.5">
                                {allPlants.map((plantItem) => (
                                    <SidebarLink key={plantItem.id} to={`/app/plants/${plantItem.id}`} label={plantItem.name} active={location.pathname.includes(`/app/plants/${plantItem.id}`)} icon={Building2} isCollapsed={isCollapsed} />
                                ))}
                            </div>
                        </div>
                    </nav>
                    <UserProfileFooter user={user} onLogout={onLogout} isCollapsed={isCollapsed} />
                </>
            );
        } else if (isOperationalRole) {
            // --- OPERATIONAL (HYBRID ACCORDION) SIDEBAR ---
            const [expandedPlant, setExpandedPlant] = useState<string | null>(null);

            useEffect(() => {
                // If we are on a detail page, expand its parent plant
                if (plant && (location.pathname.startsWith('/app/machines/') || location.pathname.startsWith('/app/utility/'))) {
                    setExpandedPlant(plant.id);
                } else {
                    // When on a plant dashboard, keep it collapsed by default.
                    setExpandedPlant(null);
                }
            }, [location.pathname, plant]);

            const togglePlant = (plantId: string) => {
                setExpandedPlant(current => current === plantId ? null : plantId);
            };

            return (
                <>
                    <div className={`px-6 py-8 border-b border-slate-800/50 bg-[#0b1120] flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                         <div className="flex flex-col items-center">
                            <h1 className={`text-sm font-extrabold text-white tracking-tighter whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>
                                PT INDOFOOD FORTUNA MAKMUR
                            </h1>
                        </div>
                    </div>
                    <nav className="flex-1 overflow-y-auto px-1 py-6 custom-scrollbar space-y-1">
                        {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Production Plants</div>}
                        {allPlants.map(plantItem => {
                            const isCurrentPlantActive = plant?.id === plantItem.id;
                            const isExpanded = expandedPlant === plantItem.id;

                            return (
                                <div key={plantItem.id} className={`mx-2 my-1 rounded-xl transition-colors ${isCurrentPlantActive ? 'bg-slate-800/30 border border-slate-800' : ''}`}>
                                    <SidebarLink 
                                        to={`/app/plants/${plantItem.id}`} 
                                        onClick={(e) => {
                                            if (isCurrentPlantActive) {
                                                e.preventDefault();
                                                togglePlant(plantItem.id);
                                            }
                                        }}
                                        label={plantItem.name} 
                                        active={location.pathname === `/app/plants/${plantItem.id}`} 
                                        icon={Building2} 
                                        isCollapsed={isCollapsed} 
                                    />
                                    <div style={{ maxHeight: isExpanded ? '1000px' : '0px', transition: 'max-height 0.4s ease-out', overflow: 'hidden' }}>
                                        <div className="pt-2 pb-1 border-t border-slate-800/50 mx-4">
                                            <DropdownMenu title="Energy & Utilities" icon={Zap} isCollapsed={isCollapsed} defaultOpen={location.pathname.startsWith(`/app/utility/`)}>
                                                {utilityService.getUtilityTypes().map(util => (
                                                    <NestedSidebarLink key={util.key} to={`/app/utility/${util.key}/${plantItem.id}`} label={util.label} active={location.pathname === `/app/utility/${util.key}/${plantItem.id}`} />
                                                ))}
                                            </DropdownMenu>
                                            <DropdownMenu title="Production Lines" icon={Cpu} isCollapsed={isCollapsed} defaultOpen={location.pathname.startsWith(`/app/machines/`)}>
                                                {plantItem.machines.map(machine => (
                                                    <NestedSidebarLink key={machine.id} to={`/app/machines/${machine.id}`} label={machine.name} active={location.pathname === `/app/machines/${machine.id}`} />
                                                ))}
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {isAdmin && (
                            <div className="pt-4">
                                {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Administration</div>}
                                <SidebarLink to="/app/settings" label="System Settings" active={location.pathname.startsWith('/app/settings')} icon={Settings} isCollapsed={isCollapsed} />
                            </div>
                        )}
                    </nav>
                    <UserProfileFooter user={user} onLogout={onLogout} isCollapsed={isCollapsed} />
                </>
            );
        } else { // Privileged Roles (Admin/Management)
            if (plant) {
                // --- PRIVILEGED PLANT-SPECIFIC SIDEBAR ---
                const utilityTypes = utilityService.getUtilityTypes();
                const machines = plant.machines;
                const isUtilityActive = location.pathname.startsWith(`/app/utility/`);
                const isProductionActive = location.pathname.startsWith(`/app/machines/`);
                
                return (
                    <>
                        <div className={`px-4 py-6 border-b border-slate-800/50 flex items-center gap-4 ${isCollapsed ? 'justify-center py-8' : ''}`}>
                            {!isCollapsed && <div className="p-2.5 bg-slate-800 rounded-lg border border-slate-700"><Factory size={20} className="text-blue-400" /></div>}
                            {!isCollapsed && <div className="min-w-0"><p className="text-base font-bold text-white truncate">{plant.name}</p><p className="text-xs text-slate-300 font-medium">{plant.location}</p></div>}
                            {isCollapsed && <Factory size={24} className="text-blue-400" />}
                        </div>
                        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                            <SidebarLink to="/app/dashboard/global" label="Back to Global" icon={ArrowLeft} isCollapsed={isCollapsed} active={false} />
                            <div className="my-4 border-t border-slate-800 mx-4"></div>
                            <DropdownMenu title="Energy & Utilities" icon={Zap} isCollapsed={isCollapsed} defaultOpen={isUtilityActive}>
                                {utilityTypes.map(util => <NestedSidebarLink key={util.key} to={`/app/utility/${util.key}/${plant.id}`} label={util.label} active={location.pathname === `/app/utility/${util.key}/${plant.id}`} />)}
                            </DropdownMenu>
                            <DropdownMenu title="Production Lines" icon={Cpu} isCollapsed={isCollapsed} defaultOpen={isProductionActive}>
                                {machines.map(machine => <NestedSidebarLink key={machine.id} to={`/app/machines/${machine.id}`} label={machine.name} active={location.pathname === `/app/machines/${machine.id}`} />)}
                            </DropdownMenu>
                        </nav>
                        <UserProfileFooter user={user} onLogout={onLogout} isCollapsed={isCollapsed} />
                    </>
                );
            } else {
                // --- PRIVILEGED GLOBAL SIDEBAR ---
                return (
                    <>
                        <div className={`px-6 py-8 border-b border-slate-800/50 bg-[#0b1120] flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
                            <div className="flex flex-col items-center">
                                <h1 className={`text-sm font-extrabold text-white tracking-tighter whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>PT INDOFOOD FORTUNA MAKMUR</h1>
                                <p className={`text-[11px] font-bold text-blue-500 mt-1.5 uppercase tracking-wider flex items-center gap-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>Smart Monitoring Multi Plant</p>
                            </div>
                        </div>
                        <nav className="flex-1 overflow-y-auto px-1 py-6 custom-scrollbar space-y-6">
                            {canViewGlobal && (
                                <div>
                                    {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dashboards</div>}
                                    <SidebarLink to="/app/dashboard/global" label="Global Overview" active={location.pathname.includes('/app/dashboard/global')} icon={LayoutDashboard} isCollapsed={isCollapsed} />
                                </div>
                            )}
                            <div>
                                {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Production Plants</div>}
                                <div className="space-y-0.5">{allPlants.map((plantItem) => <SidebarLink key={plantItem.id} to={`/app/plants/${plantItem.id}`} label={plantItem.name} active={location.pathname.includes(`/app/plants/${plantItem.id}`)} icon={Building2} isCollapsed={isCollapsed} />)}</div>
                            </div>
                            {isAdmin && (
                                <div>
                                    {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Administration</div>}
                                    <SidebarLink to="/app/settings" label="System Settings" active={location.pathname.startsWith('/app/settings')} icon={Settings} isCollapsed={isCollapsed} />
                                </div>
                            )}
                        </nav>
                        <UserProfileFooter user={user} onLogout={onLogout} isCollapsed={isCollapsed} />
                    </>
                );
            }
        }
    };

    return (
        <div className="flex h-screen bg-slate-950 font-sans text-slate-200">
            <div className={`fixed inset-0 z-40 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-72 bg-[#0b1120] border-r border-slate-800 flex flex-col h-full">
                    <SidebarContent isCollapsed={false} />
                </div>
            </div>
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

            <div className={`hidden lg:flex flex-col bg-[#0b1120] border-r border-slate-800 shrink-0 z-20 shadow-2xl transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
                <SidebarContent isCollapsed={!isSidebarOpen} />
            </div>

            <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-950 transition-all duration-300">
                <header className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-slate-800 shrink-0">
                    <button
                        className="lg:hidden flex items-center justify-center w-9 h-9 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:border-slate-600 hover:text-white transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                    <button
                        className="hidden lg:flex items-center justify-center w-9 h-9 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:border-slate-600 hover:text-white transition-all duration-200"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <ChevronsLeft size={20} className={`transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto bg-slate-950 scroll-smooth">
                    <div className="w-full max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

// ---------------------------------------
// ACCESS CONTROL WRAPPERS
// ---------------------------------------
const MachineDetailWrapper = React.memo(({ user }: { user: User }) => {
  const { machineId } = useParams();
  const navigate = useNavigate();
  const restrictedRoles = [UserRole.VIEWER];
  
  if (restrictedRoles.includes(user.role)) {
    return <Navigate to="/app/dashboard/global" replace />;
  }

  const machine = React.useMemo(() => plantService.getMachineById(machineId || ''), [machineId]);
  
  if (!machine) return <div className="p-8 text-slate-500">Machine Not Found</div>;

  return (
    <MachineDetail
      machine={machine}
      onBack={() => navigate(-1)}
      userRole={user.role}
      currentUser={user.name}
    />
  );
});

const LVMDPDetailWrapper = React.memo(({ userRole }: { userRole: UserRole }) => {
  const { panelId } = useParams();
  const navigate = useNavigate();
  const restrictedRoles = [UserRole.OPERATOR, UserRole.QC, UserRole.VIEWER];

  if (restrictedRoles.includes(userRole)) {
    return <Navigate to="/app/dashboard/global" replace />;
  }

  const panel = React.useMemo(() => lvmdpService.getPanelById(panelId || ''), [panelId]);

  if (!panel) return <div className="p-8 text-slate-500">Panel Not Found</div>;

  return (
    <LVMDPDetail lvmdp={panel} onBack={() => navigate(-1)} userRole={userRole} />
  );
});

const UtilitySummaryWrapper = React.memo(({ userRole }: { userRole: UserRole }) => {
  const { type, plantId } = useParams();
  const navigate = useNavigate();
  const restrictedRoles = [UserRole.VIEWER];

  if (restrictedRoles.includes(userRole)) {
    return <Navigate to="/app/dashboard/global" replace />;
  }
  
  const plant = React.useMemo(() => plantService.getPlantById(plantId || ''), [plantId]);

  if (!plant) return <div className="p-8 text-slate-500">Plant Not Found</div>;

  return (
    <UtilitySummary
      plant={plant}
      type={type || 'electricity'}
      onBack={() => navigate(`/app/plants/${plantId}`)}
      userRole={userRole}
    />
  );
});


const SettingsWrapper = React.memo(({ userRole }: { userRole: UserRole }) => {
  return (
    <SettingsView userRole={userRole} />
  )
});

// ---------------------------------------
// MAIN APP ROUTER
// ---------------------------------------
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    if (loggedInUser && Object.values(UserRole).includes(loggedInUser.role)) {
      setUser(loggedInUser);
    } else {
      setUser(null);
    }
  };

  return (
    <HashRouter>
      <Suspense fallback={<SuspenseSpinner />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/app" replace /> : <Login onLogin={handleLogin} />}
          />
          <Route
            path="/app"
            element={user ? <ProtectedLayout user={user} onLogout={() => setUser(null)} /> : <Navigate to="/login" replace />}
          >
            <Route index element={
              user && (
                [UserRole.ADMINISTRATOR, UserRole.MANAGEMENT, UserRole.VIEWER].includes(user.role) ? (
                  <Navigate to="dashboard/global" replace />
                ) : (
                  <Navigate to="plants/CIKOKOL" replace /> 
                )
              )
            } />
            <Route
              path="dashboard/global"
              element={ user && (
                [UserRole.ADMINISTRATOR, UserRole.MANAGEMENT, UserRole.VIEWER].includes(user.role) ? (
                  <GlobalDashboard userRole={user.role} />
                ) : (
                  <Navigate to="/app/plants/CIKOKOL" replace />
                )
              )}
            />
            <Route
              path="plants/:plantId"
              element={user && <PlantDashboard userRole={user.role} />}
            />
            <Route
              path="machines/:machineId"
              element={user && <MachineDetailWrapper user={user} />}
            />
            <Route
              path="lvmdp/:panelId"
              element={user && <LVMDPDetailWrapper userRole={user.role} />}
            />
            <Route
              path="utility/:type/:plantId"
              element={user && <UtilitySummaryWrapper userRole={user.role} />}
            />
            <Route
              path="settings"
              element={ user && (
                user.role === UserRole.ADMINISTRATOR ? (
                  <SettingsWrapper userRole={user.role} />
                ) : (
                  <Navigate to="/app/dashboard/global" replace />
                )
              )}
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;