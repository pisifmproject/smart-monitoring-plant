import React, { useState } from 'react';
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
// SIDEBAR COMPONENTS (STRICT CORPORATE TEXT ONLY)
// ---------------------------------------

const SidebarHeader = ({ label }: { label: string }) => (
  <div className="px-6 mt-8 mb-2">
    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
      {label}
    </p>
  </div>
);

const SidebarLink = ({ to, label, active }: { to: string; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`block px-6 py-2.5 text-sm font-medium transition-all duration-200 border-l-[3px] ${
      active
        ? 'border-blue-500 text-blue-400 bg-blue-900/10'
        : 'border-transparent text-slate-400 hover:text-blue-300 hover:bg-slate-900'
    }`}
  >
    {label}
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
    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300 shadow-sm shrink-0">
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

  // 1. Strict Auth Check: If no user or role, redirect immediately.
  if (!user || !user.role) {
      return <Navigate to="/login" replace />;
  }

  // 2. Role Permissions (derived from the non-null user object)
  const role = user.role;
  const isAdmin = role === UserRole.ADMINISTRATOR;
  
  // Logic for Global Dashboard visibility in sidebar (Operators cannot see it)
  const canViewGlobal = role !== UserRole.OPERATOR;

  return (
    <div className="flex h-screen bg-slate-950 font-sans text-slate-200">
      {/* SIDEBAR */}
      <div className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col shrink-0 z-20 shadow-xl">
        
        {/* BRAND HEADER */}
        <div className="px-6 pt-8 pb-6 border-b border-slate-900">
          <h1 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            PT Indofood Fortuna Makmur
          </h1>
          <h2 className="text-sm font-bold text-white tracking-tight leading-tight">
            Smart Monitoring Multi Plant
          </h2>
        </div>

        {/* USER INFO SECTION */}
        <div className="px-6 py-6 flex items-center gap-4 border-b border-slate-900 bg-slate-900/20">
          <UserAvatar name={user.name} />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">
              {user.role}
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          
          {/* OVERVIEW GROUP */}
          {canViewGlobal && (
            <>
              <SidebarHeader label="Overview" />
              <SidebarLink
                to="/app/dashboard/global"
                label="Global Overview"
                active={location.pathname.includes('/app/dashboard/global')}
              />
            </>
          )}

          {/* PLANTS GROUP */}
          <SidebarHeader label="Plants" />
          <div className="flex flex-col gap-0.5">
            {plantService.getAllPlants().map((plant) => (
              <SidebarLink
                key={plant.id}
                to={`/app/plants/${plant.id}`}
                label={plant.name}
                active={location.pathname.includes(`/app/plants/${plant.id}`)}
              />
            ))}
          </div>

          {/* SYSTEM GROUP (ADMIN ONLY) */}
          {isAdmin && (
            <>
              <SidebarHeader label="System" />
              <SidebarLink
                to="/app/settings"
                label="System Settings"
                active={location.pathname.startsWith('/app/settings')}
              />
            </>
          )}
        </nav>

        {/* FOOTER / LOGOUT */}
        <div className="p-6 border-t border-slate-900 bg-slate-950">
          <button
            onClick={() => {
              onLogout();
              // Redirect to landing page on logout
              window.location.hash = '/';
            }}
            className="w-full text-left text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-widest"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-950">
        <main className="flex-1 overflow-y-auto bg-slate-950 scroll-smooth">
          <div className="w-full max-w-[1800px] mx-auto px-6 py-8 md:px-12 md:py-10">
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

  // ACCESS RULE: 
  // BLOCKED: Management, Viewer
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

  // ACCESS RULE:
  // BLOCKED: Operator, QC, Management, Viewer
  const restrictedRoles = [UserRole.OPERATOR, UserRole.QC, UserRole.MANAGEMENT, UserRole.VIEWER];

  if (restrictedRoles.includes(userRole)) {
    return <Navigate to="/app/dashboard/global" replace />;
  }

  const panel = lvmdpService.getPanelById(panelId || '');
  if (!panel) return <div className="p-8 text-slate-500">Panel Not Found</div>;

  return <LVMDPDetail lvmdp={panel} onBack={() => navigate(-1)} userRole={userRole} />;
};

const UtilitySummaryWrapper = ({ userRole }: { userRole: UserRole }) => {
  const { type, plantId } = useParams();
  const navigate = useNavigate();

  // ACCESS RULE:
  // BLOCKED: Management, Viewer
  // ALLOWED: Operator (Read-only), QC (Read-only), Admin, Supervisor, Maintenance
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
      onBack={() => navigate(-1)}
      userRole={userRole}
    />
  );
};

// ---------------------------------------
// MAIN APP ROUTER
// ---------------------------------------

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    // Strict: Ensure the role is valid before setting the user
    if (loggedInUser && Object.values(UserRole).includes(loggedInUser.role)) {
      setUser(loggedInUser);
    } else {
      // Handle invalid login data by clearing the user state
      setUser(null);
    }
  };

  return (
    <HashRouter>
      <Routes>
        {/* PUBLIC: Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* PUBLIC: Login Page */}
        <Route
          path="/login"
          element={
            user ? (
              // If already logged in, redirect to the app's default page
              <Navigate to="/app" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        {/* PROTECTED: Main App */}
        <Route
          path="/app"
          element={
            user ? (
              <ProtectedLayout user={user} onLogout={() => setUser(null)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Default Route Logic: This runs ONLY if user is authenticated */}
          <Route index element={
            user && (user.role === UserRole.OPERATOR ? (
              <Navigate to="plants/CIKOKOL" replace />
            ) : (
              <Navigate to="dashboard/global" replace />
            ))
          } />

          {/* Global Dashboard */}
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

          {/* Plant Dashboard (Allowed for All Authenticated Roles) */}
          <Route
            path="plants/:plantId"
            element={user && <PlantDashboard userRole={user.role} />}
          />

          {/* Machine Detail (Wrapper handles role check) */}
          <Route
            path="machines/:machineId"
            element={user && <MachineDetailWrapper user={user} />}
          />

          {/* LVMDP Detail (Wrapper handles role check) */}
          <Route
            path="lvmdp/:panelId"
            element={user && <LVMDPDetailWrapper userRole={user.role} />}
          />

          {/* Utility Detail (Wrapper handles role check) */}
          <Route
            path="utility/:type/:plantId"
            element={user && <UtilitySummaryWrapper userRole={user.role} />}
          />

          {/* System Settings (Admin only) */}
          <Route
            path="settings"
            element={ user && (
              user.role === UserRole.ADMINISTRATOR ? (
                <SettingsView userRole={user.role} />
              ) : (
                <Navigate to="/app/dashboard/global" replace />
              )
            )}
          />
        </Route>

        {/* Catch-all: Redirect to Landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;