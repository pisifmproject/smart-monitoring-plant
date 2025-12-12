import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Outlet,
} from 'react-router-dom';
import {
  Menu,
  ChevronsLeft,
  Loader2
} from 'lucide-react';

import { User, UserRole, PlantCode, Plant } from './types';
import Sidebar from './components/Sidebar';

// Lazy load views for better performance
const Landing = lazy(() => import('./views/Landing'));
const Login = lazy(() => import('./views/Login'));
const MachineDetail = lazy(() => import('./views/MachineDetail'));
const LVMDPDetail = lazy(() => import('./views/LVMDPDetail'));
const UtilitySummary = lazy(() => import('./views/UtilitySummary'));
const SettingsView = lazy(() => import('./views/Settings'));
const GlobalDashboard = lazy(() => import('./GlobalDashboard'));
const PlantDashboard = lazy(() => import('./views/PlantDashboard'));
const UtilitiesOverview = lazy(() => import('./views/UtilitiesOverview'));
const ProductionLinesOverview = lazy(() => import('./views/ProductionLinesOverview'));


// Services
import { plantService } from './services/plantService';
import { lvmdpService } from './services/lvmdpService';

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
// PROTECTED LAYOUT (WITH CONTEXTUAL SIDEBAR)
// ---------------------------------------
const ProtectedLayout = ({ user, onLogout }: { user: User | null; onLogout: () => void; }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // All hooks are now at the top level
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => localStorage.getItem('sidebarOpen') !== 'false');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Centralized Data Fetching for Sidebar & Context
    const [allPlants, setAllPlants] = useState<Plant[]>([]);

    useEffect(() => {
        // Fetch plants once on layout mount (or user change)
        const fetchPlants = async () => {
            const plants = await plantService.getAllPlants();
            setAllPlants(plants);
        };
        fetchPlants();
    }, [user]); // Re-fetch if user changes (though usually user is constant in session)

    // --- CONSOLIDATED REDIRECTION LOGIC ---
    useEffect(() => {
        // 1. Redirect to login if user is not authenticated
        if (!user) {
            navigate('/login', { replace: true });
            return;
        }

        // 2. Redirect non-global roles away from the global dashboard
        const isTryingGlobal = location.pathname === '/app' || location.pathname === '/app/dashboard/global';
        const canSeeGlobal = user.role === UserRole.ADMINISTRATOR || [UserRole.MANAGEMENT, UserRole.VIEWER].includes(user.role);

        if (!canSeeGlobal && isTryingGlobal && user.plantAccess && user.plantAccess.length > 0) {
            navigate(`/app/plants/${user.plantAccess[0]}`, { replace: true });
        }
    }, [user, location.pathname, navigate]);


    useEffect(() => {
        localStorage.setItem('sidebarOpen', String(isSidebarOpen));
    }, [isSidebarOpen]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // This guard prevents the rest of the component from rendering before authentication is confirmed and redirection logic runs.
    if (!user) {
        return <SuspenseSpinner />;
    }

    return (
        <div className="flex h-screen bg-slate-950 font-sans text-slate-200">
            <div className={`fixed inset-0 z-40 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="w-72 bg-[#0b1120] border-r border-slate-800 flex flex-col h-full">
                    <Sidebar
                        isCollapsed={false}
                        user={user}
                        allPlants={allPlants}
                        onLogout={onLogout}
                    />
                </div>
            </div>
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

            <div className={`hidden lg:flex flex-col bg-[#0b1120] border-r border-slate-800 shrink-0 z-20 shadow-2xl transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
                <Sidebar
                    isCollapsed={!isSidebarOpen}
                    user={user}
                    allPlants={allPlants}
                    onLogout={onLogout}
                />
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

const PlantDashboardAccessWrapper = ({ user }: { user: User | null }) => {
    if (!user) return <SuspenseSpinner />;
    const { plantId } = useParams();
    const navigate = useNavigate();

    if (user.role !== UserRole.ADMINISTRATOR && !user.plantAccess?.includes(plantId as PlantCode)) {
        const redirectTo = user.plantAccess && user.plantAccess.length > 0 ? `/app/plants/${user.plantAccess[0]}` : '/login';
        useEffect(() => navigate(redirectTo, { replace: true }), []);
        return <SuspenseSpinner />;
    }
    return <PlantDashboard userRole={user.role} />;
};


const MachineDetailWrapper = React.memo(({ user }: { user: User | null }) => {
  if (!user) return <SuspenseSpinner />;
  const { machineId } = useParams();
  const navigate = useNavigate();
  const [machine, setMachine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      plantService.getMachineById(machineId || '').then(m => {
          setMachine(m);
          setLoading(false);
      });
  }, [machineId]);

  if (loading) return <SuspenseSpinner />;
  if (!machine) return <div className="p-8 text-slate-500">Machine Not Found</div>;

  if (user.role !== UserRole.ADMINISTRATOR && !user.plantAccess?.includes(machine.plantId)) {
      return <Navigate to={`/app/plants/${user.plantAccess && user.plantAccess[0] ? user.plantAccess[0] : ''}`} replace />;
  }

  return (
    <MachineDetail
      machine={machine}
      onBack={() => navigate(-1)}
      userRole={user.role}
      currentUser={user.name}
    />
  );
});

const LVMDPDetailWrapper = React.memo(({ user }: { user: User | null }) => {
  if (!user) return <SuspenseSpinner />;
  const { panelId } = useParams();
  const navigate = useNavigate();
  const [panel, setPanel] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      lvmdpService.getPanelById(panelId || '').then(p => {
          setPanel(p);
          setLoading(false);
      });
  }, [panelId]);

  if (loading) return <SuspenseSpinner />;
  if (!panel) return <div className="p-8 text-slate-500">Panel Not Found</div>;

  if (user.role !== UserRole.ADMINISTRATOR && !user.plantAccess?.includes(panel.plantId)) {
      return <Navigate to={`/app/plants/${user.plantAccess && user.plantAccess[0] ? user.plantAccess[0] : ''}`} replace />;
  }

  return (
    <LVMDPDetail lvmdp={panel} onBack={() => navigate(-1)} userRole={user.role} />
  );
});

const UtilitySummaryWrapper = React.memo(({ user }: { user: User | null }) => {
  if (!user) return <SuspenseSpinner />;
  const { type, plantId } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      plantService.getPlantById(plantId || '').then(p => {
          setPlant(p);
          setLoading(false);
      });
  }, [plantId]);

  if (loading) return <SuspenseSpinner />;
  if (!plant) return <div className="p-8 text-slate-500">Plant Not Found</div>;

  if (user.role !== UserRole.ADMINISTRATOR && !user.plantAccess?.includes(plant.id)) {
      return <Navigate to={`/app/plants/${user.plantAccess && user.plantAccess[0] ? user.plantAccess[0] : ''}`} replace />;
  }

  return (
    <UtilitySummary
      plant={plant}
      type={type || 'electricity'}
      onBack={() => navigate(-1)}
      userRole={user.role}
    />
  );
});

const UtilitiesOverviewWrapper = React.memo(({ user }: { user: User | null }) => {
    if (!user) return <SuspenseSpinner />;
    return <UtilitiesOverview userRole={user.role} />
});

const ProductionLinesOverviewWrapper = React.memo(({ user }: { user: User | null }) => {
    if (!user) return <SuspenseSpinner />;
    return <ProductionLinesOverview userRole={user.role} />
});


const SettingsWrapper = React.memo(({ user }: { user: User | null }) => {
  if (!user) return <SuspenseSpinner />;
  return (
    <SettingsView userRole={user.role} />
  )
});

// ---------------------------------------
// MAIN APP ROUTER
// ---------------------------------------
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          <Route
            path="/app"
            element={<ProtectedLayout user={user} onLogout={handleLogout} />}
          >
            <Route index element={<Navigate to="dashboard/global" replace />} />
            <Route path="dashboard/global" element={<GlobalDashboard user={user} />} />

            <Route path="plants/:plantId" element={<PlantDashboardAccessWrapper user={user} />} />
            <Route path="plants/:plantId/utilities" element={<UtilitiesOverviewWrapper user={user} />} />
            <Route path="plants/:plantId/production-lines" element={<ProductionLinesOverviewWrapper user={user} />} />

            <Route path="machines/:machineId" element={<MachineDetailWrapper user={user} />} />
            <Route path="lvmdp/:panelId" element={<LVMDPDetailWrapper user={user} />} />
            <Route path="utility/:type/:plantId" element={<UtilitySummaryWrapper user={user} />} />

            <Route path="settings" element={<SettingsWrapper user={user} />} />

          </Route>
        </Routes>
      </HashRouter>
    </Suspense>
  );
};

export default App;
