

import React, { useState, useEffect } from 'react';
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
  X
} from 'lucide-react';

import { User, UserRole } from './types';

// Views
import Landing from './views/Landing';
import Login from './views/Login';
import MachineDetail from './views/MachineDetail';
import LVMDPDetail from './views/LVMDPDetail';
import UtilitySummary from './views/UtilitySummary';
import SettingsView from './views/Settings';

// Dashboards
import GlobalDashboard from './GlobalDashboard';
import PlantDashboard from './PlantDashboard';

// Services
import { plantService } from './services/plantService';
import { lvmdpService } from './services/lvmdpService';

// ---------------------------------------
// SIDEBAR COMPONENTS (MODERN PILL DESIGN)
// ---------------------------------------

const SidebarLink: React.FC<{ to: string; label: string; active: boolean; icon?: any; isCollapsed: boolean }> = ({ to, label, active, icon: Icon, isCollapsed }) => (
  <Link
    to={to}
    title={isCollapsed ? label : undefined}
    className={`group relative flex items-center justify-between px-4 py-3 mx-2 my-1 rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
    } ${isCollapsed ? 'justify-center' : ''}`}
  >
    <div className="flex items-center gap-3">
        {Icon && (
            <Icon size={18} className={`transition-colors shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
        )}
        {!isCollapsed && <span>{label}</span>}
    </div>
    {active && !isCollapsed && <ChevronRight size={14} className="text-white/70" />}
  </Link>
);

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

// ---------------------------------------
// PROTECTED LAYOUT
// ---------------------------------------
const ProtectedLayout = ({
  user,
  onLogout,
}: {
  user: User | null;
  onLogout: () => void;
}) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => localStorage.getItem('sidebarOpen') !== 'false');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', String(isSidebarOpen));
  }, [isSidebarOpen]);
  
  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!user || !user.role) {
      return <Navigate to="/login" replace />;
  }

  const role = user.role;
  const isAdmin = role === UserRole.ADMINISTRATOR;
  const canViewGlobal = role !== UserRole.OPERATOR;
  
  const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <>
      {/* BRAND HEADER */}
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
  
      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto px-1 py-6 custom-scrollbar space-y-6">
        {canViewGlobal && (
          <div>
            {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">Dashboards</div>}
            <SidebarLink to="/app/dashboard/global" label="Global Overview" active={location.pathname.includes('/app/dashboard/global')} icon={LayoutDashboard} isCollapsed={isCollapsed} />
          </div>
        )}
        <div>
          {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">Production Plants</div>}
          <div className="space-y-0.5">
            {plantService.getAllPlants().map((plant) => (
              <SidebarLink key={plant.id} to={`/app/plants/${plant.id}`} label={plant.name} active={location.pathname.includes(`/app/plants/${plant.id}`)} icon={Building2} isCollapsed={isCollapsed} />
            ))}
          </div>
        </div>
        {isAdmin && (
          <div>
            {!isCollapsed && <div className="px-5 mb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">Administration</div>}
            <SidebarLink to="/app/settings" label="System Settings" active={location.pathname.startsWith('/app/settings')} icon={Settings} isCollapsed={isCollapsed} />
          </div>
        )}
      </nav>
  
      {/* USER PROFILE CARD & TOGGLE */}
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 text-xs font-bold uppercase tracking-wider transition-all border border-slate-700 hover:border-rose-500/30 group"
            >
              <LogOut size={14} className="group-hover:scale-110 transition-transform"/> Sign Out
            </button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-200">
      
      {/* --- MOBILE SIDEBAR (OVERLAY) --- */}
      <div className={`fixed inset-0 z-40 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="w-72 bg-[#0b1120] border-r border-slate-800 flex flex-col h-full">
            <SidebarContent isCollapsed={false} />
        </div>
      </div>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

      {/* --- DESKTOP SIDEBAR --- */}
      <div className={`hidden lg:flex flex-col bg-[#0b1120] border-r border-slate-800 shrink-0 z-20 shadow-2xl transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
          <SidebarContent isCollapsed={!isSidebarOpen} />
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-950">
        <header className="flex items-center justify-between h-16 px-6 border-b border-slate-800 shrink-0 lg:justify-end">
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
            </button>
            <button className="hidden lg:block text-slate-400 hover:text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
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
const MachineDetailWrapper = ({ user }: { user: User }) => {
  const { machineId } = useParams();
  const navigate = useNavigate();
  const restrictedRoles = [UserRole.MANAGEMENT, UserRole.VIEWER];
  
  if (restrictedRoles.includes(user.role)) {
    return <Navigate to="/app/dashboard/global" replace />;
  }

  const machine = plantService.getMachineById(machineId || '');
  if (!machine) return <div className="p-8 text-slate-500">Machine Not Found</div>;

  return (
    <MachineDetail
      machine={machine}
      onBack={() => navigate(-1)}
      userRole={user.role}
      currentUser={user.name}
    />
  );
};

const LVMDPDetailWrapper = ({ userRole }: { userRole: UserRole }) => {
  const { panelId } = useParams();
  const navigate = useNavigate();
  const restrictedRoles = [UserRole.OPERATOR, UserRole.QC, UserRole.MANAGEMENT, UserRole.VIEWER];

  if (restrictedRoles.includes(userRole)) {
    return <Navigate to="/app/dashboard/global" replace />;
  }

  const panel = lvmdpService.getPanelById(panelId || '');
  if (!panel) return <div className="p-8 text-slate-500">Panel Not Found</div>;

  return (
    <LVMDPDetail lvmdp={panel} onBack={() => navigate(-1)} userRole={userRole} />
  );
};

const UtilitySummaryWrapper = ({ userRole }: { userRole: UserRole }) => {
  const { type, plantId } = useParams();
  const navigate = useNavigate();
  const restrictedRoles = [UserRole.MANAGEMENT, UserRole.VIEWER];

  if (restrictedRoles.includes(userRole)) {
    return <Navigate to="/app/dashboard/global" replace />;
  }

  const plant = plantService.getPlantById(plantId || '');
  if (!plant) return <div className="p-8 text-slate-500">Plant Not Found</div>;

  return (
    <UtilitySummary
      plant={plant}
      type={type || 'electricity'}
      onBack={() => navigate(`/app/plants/${plantId}`)}
      userRole={userRole}
    />
  );
};


const SettingsWrapper = ({ userRole }: { userRole: UserRole }) => {
  return (
    <SettingsView userRole={userRole} />
  )
}
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
            user && (user.role === UserRole.OPERATOR ? (
              <Navigate to="plants/CIKOKOL" replace />
            ) : (
              <Navigate to="dashboard/global" replace />
            ))
          } />
          <Route
            path="dashboard/global"
            element={ user && (
              user.role !== UserRole.OPERATOR ? (
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
    </HashRouter>
  );
};

export default App;