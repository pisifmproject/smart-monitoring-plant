# 🏭 SMART MONITORING PLANT - TRANSFORMATION PLAN

**Corporate Multi-Plant Industrial Monitoring System**

Date: December 13, 2025
Status: Implementation Plan
Based on: Reference Architecture in /reference folder

---

## 📋 EXECUTIVE SUMMARY

Transform current PISIFM (Plant Cikupa only) into **Smart Monitoring Plant** -
a corporate-level, multi-plant monitoring system with role-based access control (RBAC),
dark modern UI, and ISO 50001 compliant energy reporting.

---

## 🎯 KEY TRANSFORMATION OBJECTIVES

### 1. **Multi-Plant Architecture**

- **Current**: Single plant (Cikupa) with real-time data
- **Target**: Multi-plant support with:
  - **Plant Cikupa**: Real-time data from existing database
  - **Plant Cikokol**: Dummy/simulated data
  - **Plant Semarang**: Dummy/simulated data
  - **Plant Agro**: Dummy/simulated data

### 2. **User Management & RBAC**

- **Current**: No authentication, single user level
- **Target**: Multi-role authentication system:
  ```
  ADMINISTRATOR  → Full system access, all plants
  SUPERVISOR     → Plant-level management, reporting
  OPERATOR       → Machine operation, data entry
  MAINTENANCE    → Equipment maintenance, service logs
  QC             → Quality control, inspection
  MANAGEMENT     → Executive dashboards, KPI overview
  VIEWER/GUEST   → Read-only access
  ```

### 3. **Corporate Dashboard Hierarchy**

```
Level 1: Global Dashboard (Corporate Overview)
  ├─ Total output across all plants
  ├─ Global OEE average
  ├─ Total energy consumption
  ├─ Active alarms count
  └─ Plant performance comparison

Level 2: Plant Dashboard (Per-Plant View)
  ├─ Plant-specific KPIs
  ├─ Utilities overview (LVMDP electrical)
  ├─ Production lines status
  └─ Equipment health

Level 3: Detail Views
  ├─ LVMDP Detail (Electrical monitoring)
  ├─ Machine Detail (Individual equipment)
  └─ Utility Summary (Energy reports)
```

### 4. **Dark Modern UI Theme**

- **Colors**:
  - Background: Slate 950 (#0f172a)
  - Cards: Slate 900 (#1e293b) with subtle borders
  - Primary: Blue 600 (#2563eb)
  - Text: White/Slate 100
  - Accents: Emerald (success), Amber (warning), Rose (danger)
- **Typography**: Clean, bold headers with medium body text
- **Components**: Rounded corners, subtle shadows, smooth transitions

---

## 📊 SYSTEM ARCHITECTURE

### Backend Structure

```
pisifmbe/src/
├── auth/                           [NEW]
│   ├── auth.controller.ts         - Login/logout endpoints
│   ├── auth.service.ts            - JWT token management
│   └── auth.middleware.ts         - Route protection
│
├── users/                          [NEW]
│   ├── user.controller.ts         - CRUD operations
│   ├── user.service.ts            - User business logic
│   ├── user.repository.ts         - Database operations
│   └── types.ts                   - User, Role interfaces
│
├── plants/                         [NEW]
│   ├── plant.controller.ts        - Plant management
│   ├── plant.service.ts           - Multi-plant logic
│   ├── plant.repository.ts        - Plant data access
│   └── mockData.ts                - Dummy data for non-Cikupa plants
│
├── electricalReport/               [EXISTING - Enhanced]
│   └── + plantId filter support
│
├── lvmdp/                          [EXISTING - Enhanced]
│   └── + multi-plant routing
│
└── kpi/                            [NEW]
    ├── kpi.controller.ts          - Global/plant KPI endpoints
    └── kpi.service.ts             - Aggregation logic
```

### Frontend Structure

```
pisifmfe/frontend/src/
├── views/
│   ├── Login.vue                  [NEW] - Authentication
│   ├── GlobalDashboard.vue        [NEW] - Corporate overview
│   ├── PlantDashboard.vue         [REFACTOR] - From current summary
│   ├── LVMDPDetail.vue            [EXISTING] - Enhanced with plant filter
│   ├── UtilitySummary.vue         [NEW] - Energy reports per plant
│   └── Settings.vue               [NEW] - User/plant management (admin only)
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.vue
│   │   └── ProtectedRoute.vue
│   ├── navigation/
│   │   ├── Sidebar.vue            - Role-based menu
│   │   └── PlantSelector.vue
│   └── shared/
│       ├── MetricCard.vue
│       ├── StatusBadge.vue
│       └── AlertCard.vue
│
├── composables/
│   ├── useAuth.ts                 [NEW] - Auth state management
│   ├── usePlants.ts               [NEW] - Multi-plant logic
│   └── useElectricalReport.ts     [EXISTING] - Enhanced
│
└── stores/
    ├── authStore.ts               [NEW] - Pinia auth store
    └── plantStore.ts              [NEW] - Selected plant state
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### User Roles & Permissions Matrix

| Feature/View     | ADMIN | SUPERVISOR           | OPERATOR | MAINTENANCE | QC  | MANAGEMENT | VIEWER |
| ---------------- | ----- | -------------------- | -------- | ----------- | --- | ---------: | ------ |
| Global Dashboard | ✅    | ✅                   | ❌       | ❌          | ❌  |         ✅ | ✅     |
| Plant Dashboard  | ✅    | ✅ (assigned plants) | ✅       | ✅          | ✅  |         ✅ | ✅     |
| LVMDP Detail     | ✅    | ✅                   | ✅       | ✅          | ❌  |         ✅ | ✅     |
| Machine Control  | ✅    | ✅                   | ✅       | ❌          | ❌  |         ❌ | ❌     |
| Maintenance Logs | ✅    | ✅                   | ❌       | ✅          | ❌  |         ❌ | ❌     |
| Settings/Admin   | ✅    | ❌                   | ❌       | ❌          | ❌  |         ❌ | ❌     |
| Download Reports | ✅    | ✅                   | ✅       | ✅          | ✅  |         ✅ | ✅     |

### Default Users

```typescript
{
  username: 'admin',
  password: 'admifm',
  role: 'ADMINISTRATOR',
  name: 'System Administrator',
  plantAccess: null  // null = all plants
}

{
  username: 'supervisor',
  password: 'spvifm',
  role: 'SUPERVISOR',
  name: 'Supervisor Cikokol',
  plantAccess: ['CIKOKOL']
}

{
  username: 'operator',
  password: 'oprifm',
  role: 'OPERATOR',
  name: 'Operator Semarang',
  plantAccess: ['SEMARANG']
}

{
  username: 'maintenance',
  password: 'mtcifm',
  role: 'MAINTENANCE',
  name: 'Maintenance Multi',
  plantAccess: ['CIKUPA', 'SEMARANG']
}

{
  username: 'management',
  password: 'mngifm',
  role: 'MANAGEMENT',
  name: 'Management Agro',
  plantAccess: ['AGRO']
}

{
  username: 'guest',
  password: 'gsifm',
  role: 'VIEWER',
  name: 'Guest Viewer',
  plantAccess: ['CIKOKOL', 'SEMARANG']
}
```

---

## 🏭 PLANT CONFIGURATION

### Plant Definitions

```typescript
enum PlantCode {
  CIKUPA = "CIKUPA",
  CIKOKOL = "CIKOKOL",
  SEMARANG = "SEMARANG",
  AGRO = "AGRO",
}

interface Plant {
  id: PlantCode;
  name: string;
  location: string;
  capacity_kW: number;
  isActive: boolean;
  hasRealTimeData: boolean; // Only CIKUPA = true
  lvmdpCount: number;
  productionLines: number;
}
```

### Plant Data Sources

#### **CIKUPA (Real-Time)**

- Source: Existing PostgreSQL database
- LVMDP: v_lvmdp_1, v_lvmdp_2, v_lvmdp_3, v_lvmdp_4
- Real aggregation with trapezoid integration
- Live socket connections

#### **CIKOKOL, SEMARANG, AGRO (Simulated)**

- Source: Mock data service
- Randomized within realistic ranges:
  - Energy: ±10% daily variance
  - Power: 300-900 kW per LVMDP
  - Voltage: 380-420V
  - Current: 500-1200A
  - Power Factor: 0.85-0.98
- Updated every 5 minutes
- Consistent with historical patterns

---

## 📈 KEY PERFORMANCE INDICATORS (KPIs)

### Global Level (All Plants Combined)

- **Total Output**: Sum of all plant production (kg)
- **Global Avg OEE**: Weighted average across plants
- **Total Energy**: Aggregated kWh consumption
- **Active Alarms**: Count across all facilities
- **Best Performing Plant**: Highest OEE/efficiency

### Plant Level

- **Daily Output**: Production quantity
- **OEE**: Overall Equipment Effectiveness
- **Energy Consumption**: kWh per day/week/month
- **Peak Demand**: Maximum kW and timestamp
- **Utilization**: % of installed capacity
- **Load Factor**: Average load / Peak demand
- **Power Quality**: Voltage stability, THD
- **Downtime**: Unplanned stops, duration

---

## 🎨 UI/UX DESIGN GUIDELINES

### Color Palette (Dark Theme)

```css
/* Backgrounds */
--bg-primary: #0f172a; /* Slate 950 */
--bg-secondary: #1e293b; /* Slate 900 */
--bg-tertiary: #334155; /* Slate 700 */

/* Borders */
--border-subtle: #334155; /* Slate 700 */
--border-normal: #475569; /* Slate 600 */

/* Text */
--text-primary: #f8fafc; /* Slate 50 */
--text-secondary: #cbd5e1; /* Slate 300 */
--text-muted: #94a3b8; /* Slate 400 */

/* Status Colors */
--success: #10b981; /* Emerald 500 */
--warning: #f59e0b; /* Amber 500 */
--danger: #ef4444; /* Rose 500 */
--info: #3b82f6; /* Blue 500 */
--primary: #2563eb; /* Blue 600 */
```

### Component Standards

- **Cards**: Rounded (12px), subtle border, hover elevation
- **Buttons**: Bold text, 10px rounded, smooth transitions
- **Inputs**: Dark background, blue focus ring
- **Tables**: Alternating row colors, hover highlight
- **Charts**: High contrast colors, smooth animations
- **Icons**: Lucide React (consistent style)

### Responsive Breakpoints

- **Mobile**: < 768px (Stack vertically)
- **Tablet**: 768px - 1024px (2-column grid)
- **Desktop**: > 1024px (Full dashboard layout)

---

## 🚀 IMPLEMENTATION PHASES

### **Phase 1: Authentication & User Management** (Week 1)

- [ ] Backend: Auth controllers, JWT middleware
- [ ] Database: Users table, roles enum
- [ ] Frontend: Login page, auth store
- [ ] Default users seeded
- [ ] Protected routes implemented

### **Phase 2: Multi-Plant Infrastructure** (Week 1-2)

- [ ] Backend: Plant service with mock data
- [ ] Database: Plants table
- [ ] Frontend: Plant selector component
- [ ] Global dashboard skeleton
- [ ] Plant filtering in existing APIs

### **Phase 3: Global Dashboard** (Week 2)

- [ ] Corporate KPI aggregation
- [ ] Plant comparison cards
- [ ] Global energy chart
- [ ] Alarm summary panel
- [ ] Navigation to plant drilldown

### **Phase 4: Enhanced Plant Dashboard** (Week 2-3)

- [ ] Refactor existing summary dashboard
- [ ] Plant-specific KPIs
- [ ] Utilities overview section
- [ ] Production lines section
- [ ] Equipment status grid

### **Phase 5: Settings & Admin Panel** (Week 3)

- [ ] User management (CRUD)
- [ ] Plant management (CRUD)
- [ ] Role assignment interface
- [ ] System configuration
- [ ] Audit logs

### **Phase 6: Dark Theme Polish** (Week 3-4)

- [ ] Apply consistent color scheme
- [ ] Update all components
- [ ] Smooth transitions
- [ ] Loading states
- [ ] Error states

### **Phase 7: Testing & Deployment** (Week 4)

- [ ] Unit tests for auth
- [ ] Integration tests for multi-plant
- [ ] E2E testing for user flows
- [ ] Performance optimization
- [ ] Production deployment

---

## 📝 DATABASE SCHEMA UPDATES

### New Tables

#### users

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  plant_access TEXT[],  -- Array of plant codes
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### plants

```sql
CREATE TABLE plants (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  capacity_kw INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  has_real_time_data BOOLEAN DEFAULT FALSE,
  lvmdp_count INTEGER DEFAULT 0,
  production_lines INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### sessions (Optional - for JWT blacklist)

```sql
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Modified Tables

#### daily_electrical_reports

```sql
ALTER TABLE daily_electrical_reports
ADD COLUMN plant_id VARCHAR(20) REFERENCES plants(id);

CREATE INDEX idx_daily_electrical_reports_plant
ON daily_electrical_reports(plant_id);
```

---

## 🔧 TECHNICAL STACK

### Backend (Node.js/Express)

- **Framework**: Express 4.x
- **Database**: PostgreSQL 14+
- **ORM**: Drizzle ORM
- **Auth**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **WebSocket**: Socket.io (for real-time Cikupa)
- **Cron**: node-cron (for scheduled aggregation)

### Frontend (Vue 3)

- **Framework**: Vue 3 Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Router**: Vue Router 4
- **UI Components**: Custom (Tailwind CSS)
- **Charts**: ECharts
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **PDF Generation**: jsPDF (existing)

### DevOps

- **Web Server**: Apache 2.4
- **Reverse Proxy**: Apache mod_proxy
- **SSL**: Let's Encrypt (production)
- **Process Manager**: PM2 (backend)
- **Deployment**: PowerShell scripts

---

## ✅ CORPORATE SOP COMPLIANCE

### Code Quality Standards

- TypeScript strict mode enabled
- ESLint + Prettier configured
- Git commit message conventions
- Code review required for merges
- Unit test coverage > 70%

### Security Standards

- All passwords hashed with bcrypt (cost factor 12)
- JWT tokens with 8-hour expiration
- HTTPS only in production
- SQL injection prevention (parameterized queries)
- XSS prevention (input sanitization)
- CSRF tokens for state-changing operations
- Rate limiting on auth endpoints

### Documentation Standards

- API documentation (Swagger/OpenAPI)
- Database schema diagrams
- User manual for each role
- Deployment runbooks
- Incident response procedures

### Operational Standards

- Automated daily backups (database + config)
- Health check endpoints (/health, /metrics)
- Structured logging (Winston)
- Error tracking (Sentry or similar)
- Performance monitoring (response times < 500ms)
- Uptime SLA: 99.5%

---

## 📋 TESTING CHECKLIST

### Unit Tests

- [ ] Auth service (login, token validation)
- [ ] User CRUD operations
- [ ] Plant service (mock data generation)
- [ ] Electrical report calculations
- [ ] Permission checks for each role

### Integration Tests

- [ ] Login flow end-to-end
- [ ] Multi-plant data filtering
- [ ] Report generation with plant filter
- [ ] WebSocket connections (Cikupa only)
- [ ] API response formats

### User Acceptance Tests

- [ ] Admin can create/edit users
- [ ] Supervisor sees only assigned plants
- [ ] Operator can access machine controls
- [ ] Management sees executive dashboard
- [ ] Guest has read-only access
- [ ] PDF reports work for all plants

---

## 🚨 KNOWN LIMITATIONS & FUTURE ENHANCEMENTS

### Current Limitations

1. Mock data for non-Cikupa plants (no real-time)
2. Single-language (Indonesian/English mix)
3. No mobile app (web-only)
4. Limited historical data for dummy plants

### Future Enhancements (Backlog)

- [ ] Machine learning for predictive maintenance
- [ ] Energy optimization recommendations
- [ ] Advanced analytics (trend analysis, forecasting)
- [ ] Mobile app (React Native)
- [ ] Multi-language support (i18n)
- [ ] Export to Excel/CSV
- [ ] Email/SMS alerts
- [ ] Integration with ERP systems
- [ ] Real-time collaboration (chat, notes)

---

## 📞 SUPPORT & MAINTENANCE

### Contact Information

- **System Admin**: admin@smartmonitoringplant.com
- **Technical Support**: support@smartmonitoringplant.com
- **Emergency Hotline**: +62-XXX-XXXX-XXXX

### Maintenance Windows

- **Regular Maintenance**: Every Sunday 02:00-04:00 WIB
- **Emergency Patches**: As needed (with 1-hour notice)
- **Planned Upgrades**: Quarterly (Q1, Q2, Q3, Q4)

---

**End of Transformation Plan**

Generated: December 13, 2025
Version: 1.0
Status: Ready for Implementation

For questions or clarifications, contact the development team.
