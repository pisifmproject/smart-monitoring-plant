# PISIFM - Technical Stack & Environment Documentation

**Project**: PISIFM (Project Information System - PT Indofood Fortuna Makmur)  
**Type**: Full-Stack Web Application (Factory Monitoring System)  
**Architecture**: Monorepo with separate Backend & Frontend  
**Developer**: Septian Bagus Jumantoro  
**Last Updated**: January 14, 2026

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Backend Architecture](#backend-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Database](#database)
7. [Development Environment](#development-environment)
8. [Deployment & Infrastructure](#deployment--infrastructure)
9. [Key Dependencies](#key-dependencies)

---

## 🎯 Project Overview

Real-time factory monitoring system untuk:

- Production lines monitoring
- Electrical panels (LVMDP) monitoring
- Packing lines monitoring
- Daily & hourly reporting
- Performance analytics
- Multi-plant support (Cikupa, Semarang, Cikokol, Agro)

---

## 🛠 Technology Stack

### **Backend**

- **Language**: TypeScript (99%)
- **Runtime**: Node.js
- **Framework**: Express.js v5.1.0
- **Real-time**: Socket.IO v4.8.1
- **Database ORM**: Drizzle ORM v0.44.7
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken v9.0.3) + bcrypt
- **Task Scheduling**: node-cron v4.2.1

### **Frontend**

- **Language**: TypeScript
- **Framework**: Vue.js v3.5.22 (Composition API)
- **Build Tool**: Vite v5.4.10
- **Router**: Vue Router v4.6.3
- **Styling**: Tailwind CSS v3.4.18
- **Charts**: ECharts v6.0.0 (vue-echarts v8.0.1)
- **Icons**: Lucide Vue Next v0.562.0
- **HTTP Client**: Axios v1.13.2
- **Real-time**: Socket.IO Client v4.8.1
- **Export**: jsPDF v3.0.4, xlsx v0.18.5

### **DevOps & Tools**

- **Web Server**: Apache 2.4
- **Process Manager**: Windows Task Scheduler (Auto-start)
- **Version Control**: Git
- **Package Manager**: npm
- **Development Server**: ts-node-dev (backend), Vite (frontend)

---

## 📁 Project Structure

```
PISIFM/
├── pisifmbe/                      # Backend (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── index.ts              # Express app configuration
│   │   ├── server.ts             # Server entry point
│   │   ├── socket.ts             # Socket.IO configuration
│   │   ├── auth/                 # Authentication & Authorization
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.middleware.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.schema.ts
│   │   │   └── users.controller.ts
│   │   ├── cron/                 # Scheduled tasks (reports, aggregations)
│   │   ├── dailyReport/          # Daily production reports
│   │   ├── db/                   # Database config & schemas
│   │   ├── electricalReport/     # Electrical reports (LVMDP)
│   │   ├── generators/           # Data generators & utilities
│   │   ├── lvmdp/                # LVMDP monitoring (4 panels)
│   │   ├── packing/              # Packing line monitoring
│   │   ├── production/           # Production data management
│   │   ├── routes/               # API routes
│   │   ├── scripts/              # Utility scripts
│   │   ├── shared/               # Shared types & utilities
│   │   ├── user/                 # User management
│   │   ├── utility/              # Helper utilities
│   │   ├── utils/                # Common utilities
│   │   └── visibility/           # Visibility settings
│   ├── drizzle/                  # Database migrations
│   │   └── meta/                 # Migration metadata
│   ├── package.json              # Backend dependencies
│   ├── tsconfig.json             # TypeScript config
│   └── drizzle.config.ts         # Drizzle ORM config
│
├── pisifmfe/
│   └── frontend/                 # Frontend (Vue.js + Vite + TypeScript)
│       ├── src/
│       │   ├── App.vue           # Root component
│       │   ├── main.ts           # Application entry point
│       │   ├── router/           # Vue Router configuration
│       │   ├── modules/          # Feature modules
│       │   │   ├── admin/        # Admin panel
│       │   │   ├── auth/         # Authentication views
│       │   │   ├── dashboard/    # Dashboard views
│       │   │   ├── production/   # Production monitoring
│       │   │   ├── lvmdp/        # LVMDP monitoring
│       │   │   ├── packing/      # Packing monitoring
│       │   │   └── reports/      # Reporting views
│       │   ├── components/       # Reusable components
│       │   ├── composables/      # Vue composables
│       │   ├── services/         # API services
│       │   ├── utils/            # Utility functions
│       │   └── assets/           # Static assets
│       ├── public/               # Public assets
│       ├── index.html            # HTML entry point
│       ├── package.json          # Frontend dependencies
│       ├── tsconfig.json         # TypeScript config
│       ├── vite.config.ts        # Vite configuration
│       ├── tailwind.config.js    # Tailwind CSS config
│       └── postcss.config.js     # PostCSS config
│
├── apache-config/
│   └── pisifm.conf               # Apache virtual host config
│
├── deploy.ps1                    # Deployment script
├── setup-autostart.bat           # Setup auto-start on boot
├── start-backend.bat             # Manual backend start
├── autostart-backend.ps1         # Backend auto-start script
├── package.json                  # Monorepo helper scripts
├── README.md                     # User documentation
└── DEPLOYMENT.md                 # Deployment documentation
```

---

## 🔧 Backend Architecture

### **Core Technologies**

- **Express.js**: RESTful API server
- **Socket.IO**: Real-time bidirectional communication
- **Drizzle ORM**: Type-safe SQL query builder & migrations
- **JWT**: Stateless authentication
- **node-cron**: Scheduled report generation

### **Module Structure**

#### 1. **Authentication & Authorization** (`src/auth/`)

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- User session management
- Roles: ADMINISTRATOR, SUPERVISOR, OPERATOR, MAINTENANCE, QC, MANAGEMENT, VIEWER

#### 2. **LVMDP Monitoring** (`src/lvmdp/`)

- 4 electrical panels (LVMDP 1-4)
- Real-time polling dari database
- Socket.IO broadcast ke clients
- Historical data tracking

#### 3. **Production Monitoring** (`src/production/`)

- Real-time production data
- Machine status tracking
- Performance metrics

#### 4. **Packing Lines** (`src/packing/`)

- Multiple packing line monitoring
- Simulation service untuk testing
- Real-time data polling

#### 5. **Reporting** (`src/dailyReport/`, `src/electricalReport/`)

- Daily shift reports (3 shifts)
- Hourly aggregated reports
- Electrical consumption reports
- PDF & Excel export

#### 6. **Scheduled Tasks** (`src/cron/`)

- Daily report generation (end of shift)
- Hourly data aggregation
- Electrical report generation
- Performance metrics calculation

#### 7. **Visibility Settings** (`src/visibility/`)

- Dynamic UI configuration
- Per-user visibility preferences
- Plant-specific settings

### **API Architecture**

- RESTful endpoints untuk CRUD operations
- Socket.IO events untuk real-time updates
- Middleware: CORS, JWT validation, error handling
- Response standardization

### **Database Migrations**

- Drizzle Kit untuk schema management
- 18 migrations (0000-0018)
- Includes: tables, indexes, performance optimizations

---

## 🎨 Frontend Architecture

### **Core Technologies**

- **Vue 3**: Progressive JavaScript framework (Composition API)
- **Vite**: Next-gen frontend build tool (fast HMR)
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vue Router**: Client-side routing

### **Module Structure**

#### 1. **Authentication Module** (`src/modules/auth/`)

- Login/logout views
- Token management
- Protected routes
- Role-based navigation

#### 2. **Dashboard Module** (`src/modules/dashboard/`)

- Overview of all systems
- Quick stats & KPIs
- Multi-plant selector

#### 3. **LVMDP Module** (`src/modules/lvmdp/`)

- Real-time electrical monitoring
- 4 panel views
- Trend charts (ECharts)
- Historical data viewer

#### 4. **Production Module** (`src/modules/production/`)

- Production line monitoring
- Machine status dashboard
- Performance metrics

#### 5. **Packing Module** (`src/modules/packing/`)

- Packing line monitoring
- Real-time throughput
- Line efficiency metrics

#### 6. **Reports Module** (`src/modules/reports/`)

- Daily reports viewer
- Hourly reports
- Electrical reports
- Export to PDF/Excel

#### 7. **Admin Module** (`src/modules/admin/`)

- User management
- Visibility settings
- System configuration

### **State Management**

- Vue 3 Composition API (reactive state)
- localStorage untuk token & preferences
- Visibility state service (centralized)

### **Real-time Communication**

- Socket.IO client connection
- Event listeners di components
- Automatic reconnection
- Error handling

### **Data Visualization**

- ECharts untuk line charts, bar charts
- Custom Vue components
- Responsive design
- Real-time chart updates

### **Styling Architecture**

- Tailwind CSS utility classes
- Custom CSS untuk specific needs
- Responsive design (mobile-first)
- Dark mode ready (foundation)

---

## 🗄️ Database

### **Database System**

- **Type**: PostgreSQL
- **ORM**: Drizzle ORM (type-safe, lightweight)
- **Migration Tool**: Drizzle Kit

### **Schema Overview**

#### Core Tables:

1. **app_users**: User accounts & authentication
2. **plants**: Factory plants (Cikupa, Semarang, etc.)
3. **machines**: Production machines
4. **LVMDP_X_data** (X=1,2,3,4): Electrical panel data
5. **daily_reports**: Daily shift production reports
6. **hourly_reports**: Hourly aggregated data
7. **daily_electrical_reports**: Daily electrical consumption
8. **visibility_settings**: UI visibility configuration
9. **packing_lines**: Packing line definitions
10. **packing_data**: Packing real-time data

#### Key Features:

- Indexes on `waktu` (timestamp) columns untuk performance
- Foreign keys untuk relational integrity
- Composite indexes untuk complex queries
- JSONB columns untuk flexible data

### **Migration History**

- 18 total migrations
- Includes: table creation, indexes, performance tuning
- Drizzle migrations are SQL-based & versioned

---

## 💻 Development Environment

### **System Requirements**

- **OS**: Windows 10/11 (production) or Linux/macOS (dev)
- **Node.js**: v18+ (LTS recommended)
- **PostgreSQL**: v14+
- **npm**: v9+
- **Apache**: 2.4+ (for production deployment)

### **Development Setup**

#### 1. **Install Dependencies**

```bash
# Install all dependencies (backend + frontend)
npm run install:all
```

#### 2. **Environment Variables**

**Backend** (`.env` in `pisifmbe/`):

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your_secret_key
```

**Frontend** (`.env` in `pisifmfe/frontend/`):

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001
```

#### 3. **Database Setup**

```bash
cd pisifmbe
npm run drizzle:migrate     # Run migrations
npm run seed:users          # Seed default users
```

#### 4. **Development Servers**

**Option 1: Run Both Simultaneously** (from root)

```bash
npm run dev
```

**Option 2: Run Separately**

```bash
# Terminal 1 - Backend
npm run start:be

# Terminal 2 - Frontend
npm run start:fe
```

### **Development Tools**

- **Backend**: ts-node-dev (auto-reload on file changes)
- **Frontend**: Vite HMR (instant hot module replacement)
- **Database**: Drizzle Studio (`npm run drizzle:studio`)

---

## 🚀 Deployment & Infrastructure

### **Production Environment**

- **OS**: Windows Server (or Windows 10/11)
- **Web Server**: Apache 2.4
- **Process Manager**: Windows Task Scheduler
- **Network**: 10.125.48.102 (internal network)

### **Deployment Architecture**

```
[Client Browser]
       ↓
[Apache :80] → Proxy requests
       ↓
[Frontend] → Static files served by Apache
       ↓
[Backend :3001] → Node.js Express + Socket.IO
       ↓
[PostgreSQL] → Database
```

### **Apache Configuration**

- Serves frontend static files from `pisifmfe/frontend/dist/`
- Proxies API requests to backend `:3001`
- WebSocket proxy untuk Socket.IO
- Configuration in `apache-config/pisifm.conf`

### **Auto-Start Configuration**

- Windows Task Scheduler task: `PISIFM_Backend_AutoStart`
- Runs on system startup
- Executes `autostart-backend.ps1`
- Logs to `backend-autostart.log`

### **Deployment Process**

#### Full Deployment:

```powershell
.\deploy.ps1
```

**What it does:**

1. Stops Apache service
2. Kills existing Node.js processes
3. Builds frontend (Vite production build)
4. Builds backend (TypeScript compilation)
5. Starts Apache service
6. Starts backend via Task Scheduler

#### Manual Steps:

```powershell
# Build frontend
cd pisifmfe/frontend
npm run build

# Build backend
cd pisifmbe
npm run build

# Restart services
Restart-Service Apache2.4
.\start-backend.bat
```

### **Monitoring & Logs**

- **Backend Log**: `backend-autostart.log`
- **Apache Logs**: Apache log directory
- **Process Monitoring**: Task Manager → node.exe

---

## 📦 Key Dependencies

### **Backend**

| Package      | Version | Purpose                 |
| ------------ | ------- | ----------------------- |
| express      | ^5.1.0  | Web framework           |
| socket.io    | ^4.8.1  | Real-time communication |
| drizzle-orm  | ^0.44.7 | Database ORM            |
| pg           | ^8.16.3 | PostgreSQL driver       |
| jsonwebtoken | ^9.0.3  | JWT authentication      |
| bcryptjs     | ^3.0.3  | Password hashing        |
| node-cron    | ^4.2.1  | Task scheduling         |
| dotenv       | ^17.2.3 | Environment variables   |
| cors         | ^2.8.5  | CORS middleware         |
| typescript   | ^5.9.3  | Type checking           |
| ts-node-dev  | ^2.0.0  | Dev server              |

### **Frontend**

| Package          | Version  | Purpose                 |
| ---------------- | -------- | ----------------------- |
| vue              | ^3.5.22  | UI framework            |
| vue-router       | ^4.6.3   | Routing                 |
| vite             | ^5.4.10  | Build tool              |
| tailwindcss      | ^3.4.18  | CSS framework           |
| echarts          | ^6.0.0   | Charts library          |
| vue-echarts      | ^8.0.1   | Vue wrapper for ECharts |
| axios            | ^1.13.2  | HTTP client             |
| socket.io-client | ^4.8.1   | WebSocket client        |
| lucide-vue-next  | ^0.562.0 | Icon library            |
| jspdf            | ^3.0.4   | PDF generation          |
| xlsx             | ^0.18.5  | Excel generation        |
| typescript       | ~5.5.4   | Type checking           |

---

## 🔐 Security

### **Authentication**

- JWT tokens dengan expiration
- bcrypt password hashing (10 rounds)
- Token stored in localStorage
- Protected routes dengan middleware

### **Authorization**

- Role-based access control (RBAC)
- 7 roles dengan different permissions
- Plant-based access control
- Visibility settings per role

### **API Security**

- CORS configured untuk trusted origins
- JWT validation pada protected endpoints
- Input validation & sanitization
- Error messages tidak expose sensitive info

---

## 🧪 Testing & Development

### **Development Workflow**

1. Create feature branch
2. Develop & test locally
3. Build & verify
4. Deploy to production via `deploy.ps1`

### **Testing Strategy**

- Manual testing di development
- User acceptance testing (UAT)
- Production testing dengan dummy data

### **Hot Reload**

- Backend: ts-node-dev (automatic)
- Frontend: Vite HMR (instant)

---

## 📝 Additional Documentation

- **[README.md](README.md)**: User guide & quick start
- **[DEPLOYMENT.md](DEPLOYMENT.md)**: Detailed deployment guide
- **[SCHEDULER_DOCS.ts](pisifmbe/SCHEDULER_DOCS.ts)**: Cron job documentation
- **[PACKING_BACKEND_SPECIFICATION.md](PACKING_BACKEND_SPECIFICATION.md)**: Packing API specs
- **[MACHINE_PROCESS_VARIABLES_DOCUMENTATION.md](MACHINE_PROCESS_VARIABLES_DOCUMENTATION.md)**: Machine variable docs
- **[DUMMY_DATA_VARIABLES_DOCUMENTATION.md](DUMMY_DATA_VARIABLES_DOCUMENTATION.md)**: Test data docs

---

## 🆘 Support & Maintenance

**Developer**: Septian Bagus Jumantoro  
**Organization**: PT Indofood Fortuna Makmur

For issues or questions, refer to:

1. README.md untuk user-facing issues
2. DEPLOYMENT.md untuk deployment issues
3. Source code comments untuk technical details
4. Git history untuk change tracking

---

**Last Updated**: January 14, 2026
