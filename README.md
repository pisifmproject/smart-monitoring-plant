# 📋 PISIFM - Project Information System

**Developer**: Septian Bagus Jumantoro  
**Last Updated**: November 29, 2025  
**License**: Confidential - PT Indofood Fortuna Makmur Internal Use Only

---

Project monitoring system untuk Indofood factory dengan real-time data visualization, daily reporting, dan comprehensive performance analytics.

---

## 🚀 Quick Start

### Development Mode

```powershell
# Backend
cd pisifmbe
npm run dev

# Frontend
cd pisifmfe/frontend
npm run dev
```

### Production Deployment (Apache24)

```powershell
# Build frontend & backend
cd pisifmfe/frontend
npm run build

cd ../../pisifmbe
npm run build

# Start backend
node dist/server.js

# Configure & start Apache (see QUICKSTART.md)
```

📖 **Deployment Guides:**

- **QUICKSTART.md** - Step-by-step checklist untuk deploy
- **DEPLOYMENT_GUIDE.md** - Tutorial lengkap dengan troubleshooting
- **APACHE_VISUAL_GUIDE.md** - Visual guide konfigurasi Apache

---

## 📚 Quick Overview

**Project**: PISIFM (Project Information System for Indofood Factory Monitoring)  
**Tech Stack**: Vue 3 + TypeScript + Vite + Tailwind CSS  
**Backend**: Express.js + Drizzle ORM + PostgreSQL  
**Port**:

- Development: Frontend `localhost:30` | Backend `localhost:2000`
- Production: Apache `localhost:80` (port 80) → Backend `localhost:2000`

---

## 🏭 System Modules

### 1. **LVMDP (Low Voltage Main Distribution Panel)** - 4 Panels

- **Real-time monitoring**: kW, Frequency, Power Factor (cos φ)
- **Shift tracking**: 3 shifts dengan perhitungan otomatis berdasarkan jam
  - Shift 1: 07:01-14:30
  - Shift 2: 14:31-22:00
  - Shift 3: 22:01-07:00 (cross midnight)
- **Daily reports**: Aggregated shift summaries dengan pre-calculated metrics
- **Hourly reports**: Pre-aggregated data untuk performa query yang optimal
- **Performance optimization**: DB-side aggregation, indexed tables

### 2. **Production Lines** - 8 Machines

- PC39, PC14, TS1000, FCP, TWS56, TWS72, COPACK, IHP
- OEE tracking (Availability, Performance, Quality)
- KWH meter monitoring (Power consumption, Voltage, Current)
- Shift summary (Target vs Actual production)
- Daily report dengan breakdown per shift

### 3. **Packing Lines** - 9 Lines (A-I)

**Weigher:**

- Target/Actual packs, Reject count
- Weight metrics (Avg, Min, Max)
- Efficiency tracking
- Shift performance reporting

**Bagmaker:**

- Production metrics (Target, Actual, Good, Not Good bags)
- Efficiency (Weigher, BagMaker, Total)
- Quality detection (Metal detect, Printer error, Product in seal, Splice detect)
- Waste management (Film percentage, Speed monitoring)
- Shift performance (3 shifts)

---

## 🚀 Tech Stack

### Frontend

- **Vue 3** (^3.5.22) - Composition API, SFC, Reactive state
- **TypeScript** (~5.9.3) - Type safety
- **Vite** (^7.1.7) - Lightning fast build tool
- **Tailwind CSS** (^3.4.18) - Utility-first styling
- **Vue Router** (^4.6.3) - Client-side routing

### Data Visualization

- **ECharts** (^6.0.0) - Gauge charts, real-time graphs
- **vue-echarts** (^8.0.1) - Vue integration

### Networking

- **Axios** (^1.13.2) - HTTP client
- **Socket.IO** (^4.8.1) - Real-time WebSocket communication

### UI Components

- **lucide-vue-next** - Modern icon library

### Communication Patterns:

```typescript
// REST API calls
axios.get('/api/data')

// Real-time WebSocket events
socket.on('lvmdp1:data', (data) => { ... })
socket.emit('subscribe:lvmdp1')
```

---

## 📦 Development Dependencies

| Teknologi         | Versi   | Fungsi                                           |
| ----------------- | ------- | ------------------------------------------------ |
| **@types/node**   | ^24.6.0 | TypeScript definitions untuk Node.js             |
| **@vue/tsconfig** | ^0.8.1  | Recommended TypeScript config untuk Vue projects |

---

## ⚙️ TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM"],
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] },
    "types": ["vite/client"]
  }
}
```

---

## 📝 Scripts

```bash
npm run dev       # Dev server (localhost:30)
npm run build     # Production build
npm run preview   # Preview production build
```

---

## 🗂️ Project Structure

```
PISIFM/
├── pisifmfe/frontend/              # Frontend Vue.js application
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── brandLogo.vue
│   │   │   ├── sideBar.vue         # Nested sidebar dengan auto-expand
│   │   │   ├── gaugeSimple.vue     # ECharts gauge component
│   │   │   ├── shiftCard.vue       # Shift performance card
│   │   │   ├── statusBar.vue
│   │   │   └── reportButton.vue
│   │   │
│   │   ├── composables/            # Reusable logic
│   │   │   ├── useLvmdpLive.ts     # LVMDP real-time Socket.IO
│   │   │   └── useShiftAverage.ts
│   │   │
│   │   ├── views/                  # Page components
│   │   │   ├── lvmdp/              # 4 LVMDP panels
│   │   │   ├── production/         # 8 production lines
│   │   │   ├── packing/            # Weigher & Bagmaker (9 lines each)
│   │   │   └── dailyReport/        # Daily report views
│   │   │       ├── lvmdp/
│   │   │       │   └── lvmdpDailyReport.vue  # Unified daily report
│   │   │       ├── production/
│   │   │       ├── weigher/
│   │   │       └── bagmaker/
│   │   │
│   │   ├── router/                 # Vue Router config
│   │   ├── layouts/                # Layout components
│   │   └── assets/                 # Static assets
│   │
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── pisifmbe/                       # Backend Express.js application
│   ├── src/
│   │   ├── server.ts               # Express server entry point
│   │   ├── socket.ts               # Socket.IO setup
│   │   ├── index.ts                # Main application
│   │   │
│   │   ├── db/
│   │   │   ├── index.ts            # Drizzle database connection
│   │   │   └── schema.ts           # Database schema definitions
│   │   │
│   │   ├── lvmdp/                  # LVMDP modules (1-4)
│   │   │   ├── lvmdpPoller.ts      # Real-time data polling
│   │   │   └── LVMDP_X/
│   │   │       ├── lvmdp_X.controller.ts
│   │   │       ├── lvmdp_X.services.ts
│   │   │       ├── lvmdp_X.repository.ts
│   │   │       ├── lvmdp_X.dailyReport.controller.ts
│   │   │       ├── lvmdp_X.dailyReport.services.ts
│   │   │       ├── lvmdp_X.dailyReport.repository.ts
│   │   │       ├── lvmdp_X.hourlyReport.controller.ts
│   │   │       ├── lvmdp_X.hourlyReport.services.ts
│   │   │       └── lvmdp_X.hourlyReport.repository.ts
│   │   │
│   │   ├── production/             # Production line modules
│   │   │   ├── production.controller.ts
│   │   │   ├── production.services.ts
│   │   │   └── production.repository.ts
│   │   │
│   │   ├── packing/                # Packing line modules
│   │   │   ├── packing.controller.ts
│   │   │   ├── packing.services.ts
│   │   │   └── packing.repository.ts
│   │   │
│   │   ├── cron/                   # Scheduled tasks
│   │   │   ├── hourlyReportScheduler.ts   # Runs every hour at :05
│   │   │   └── dailyReportScheduler.ts    # Runs daily at 00:05
│   │   │
│   │   ├── scripts/                # Utility scripts
│   │   │   ├── backfillHourlyReports.ts   # Backfill historical hourly data
│   │   │   ├── backfillDailyReports.ts    # Backfill historical daily data
│   │   │   └── runMigration.ts            # Run SQL migrations
│   │   │
│   │   └── routes/                 # API route definitions
│   │       ├── lvmdp.router.ts
│   │       └── dailyReport.router.ts
│   │
│   ├── drizzle/                    # Database migrations
│   │   ├── 0000_grey_dorian_gray.sql
│   │   ├── 0001_lucky_anita_blake.sql
│   │   ├── ...
│   │   ├── 0007_add_hourly_report_tables.sql
│   │   ├── 0008_add_cos_phi_to_daily_reports.sql
│   │   └── meta/
│   │
│   ├── drizzle.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── README.md                       # This file
```

---

## 🎨 Design System

### Color Palette

- **Purple**: `#8b5cf6` - Bagmaker theme
- **Cyan/Blue**: `#0ea5e9` - LVMDP theme
- **Green**: `#10b981` - Success states
- **Orange**: `#f59e0b` - Warning states
- **Red**: `#ef4444` - Error states

### Layout Pattern

- **Header**: Gradient background, icon circle, status badge
- **2x2 Grid**: Production overview cards
- **Responsive**: Mobile-first (480px, 768px, 1024px breakpoints)
- **Card Design**: Rounded corners, shadows, hover effects, gradient backgrounds

### Typography

- **Headings**: Inter/System font, bold weights (700-800)
- **Body**: 0.75rem - 1rem
- **Metrics**: 2.125rem - 2.5rem (large values)
- **Labels**: Uppercase, letter-spacing, 0.75rem

---

## 🔌 API Endpoints

### Backend (localhost:2000)

#### LVMDP Endpoints

```
# Real-time data (Socket.IO)
Socket.IO Event: 'lvmdp1:data', 'lvmdp2:data', 'lvmdp3:data', 'lvmdp4:data'
Socket.IO Emit: 'subscribe:lvmdp1', 'subscribe:lvmdp2', etc.

# Shift averages (legacy/on-the-fly calculation)
GET /api/lvmdp1/shift-avg?date=YYYY-MM-DD
GET /api/lvmdp2/shift-avg?date=YYYY-MM-DD
GET /api/lvmdp3/shift-avg?date=YYYY-MM-DD
GET /api/lvmdp4/shift-avg?date=YYYY-MM-DD

# Daily reports (optimized, pre-aggregated)
GET /api/lvmdp1/daily-report/all          # All daily reports
GET /api/lvmdp1/daily-report/:date        # Specific date
GET /api/lvmdp1/daily-report/month?year=2025&month=11
POST /api/lvmdp1/daily-report/:date       # Generate report

# Hourly reports (optimized, pre-aggregated)
GET /api/lvmdp1/daily-report/hourly/:date # 24 hourly aggregates
POST /api/lvmdp1/hourly-report/:date      # Generate hourly data
GET /api/lvmdp1/hourly-report/range?start=YYYY-MM-DD&end=YYYY-MM-DD

# Similar endpoints for lvmdp2, lvmdp3, lvmdp4
```

#### Production Endpoints

```
GET /api/production/:lineId          # Production data by line
                                     # lineId: pc39, pc14, ts1000, fcp,
                                     #         tws56, tws72, copack, ihp
```

#### Packing Endpoints

```
GET /api/packing/bagmaker/:lineId    # Bagmaker data by line (A-I)
GET /api/packing/weigher/:lineId     # Weigher data by line (A-I)
```

---

## 🪝 Key Features

- ✅ **Real-time Updates**: Socket.IO for live LVMDP data (30s refresh for others)
- ✅ **Responsive Design**: Mobile-first, tablet, desktop breakpoints
- ✅ **Dark Mode Ready**: Color schemes support dark theme
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Modular Architecture**: Composables, components, views separation
- ✅ **Production Ready**: Optimized builds, lazy loading, code splitting

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js LTS
npm or yarn
Backend running on localhost:2000
```

### Installation

```bash
cd pisifmfe/frontend
npm install
npm run dev  # Start dev server on localhost:30
```

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:2000
VITE_SOCKET_URL=http://localhost:2000
```

---

## 📊 Database Schema (Backend)

### LVMDP Tables (Optimized Architecture)

#### View Tables (Source of Truth)

- `v_lvmdp_1` to `v_lvmdp_4` - Database views containing raw HMI data
  - Potentially millions of records
  - Direct access is slow (200-500ms per query)

#### Hourly Report Tables (Pre-aggregated)

- `hourly_report_lvmdp_1` to `hourly_report_lvmdp_4`
- **Purpose**: Pre-calculated hourly aggregates (max 24 rows per day)
- **Fields**:
  - `report_date` (DATE)
  - `hour` (INTEGER 0-23)
  - `count` (INTEGER) - number of records
  - `total_kwh` (DOUBLE PRECISION) - sum of kWh
  - `avg_kwh` (DOUBLE PRECISION) - average kWh
  - `avg_current` (DOUBLE PRECISION) - average current
  - `avg_cos_phi` (DOUBLE PRECISION) - average power factor
  - `created_at`, `updated_at`
- **Indexes**: UNIQUE(report_date, hour), INDEX(report_date)
- **Performance**: 30-126ms to generate, <10ms to fetch

#### Daily Report Tables (Shift Summaries)

- `daily_report_lvmdp_1` to `daily_report_lvmdp_4`
- **Purpose**: Daily shift summaries (1 row per day)
- **Fields**:
  - `id` (TEXT, UUID)
  - `report_date` (DATE, UNIQUE)
  - Shift 1 (07:01-14:30): `shift1_count`, `shift1_avg_kwh`, `shift1_avg_current`, `shift1_avg_cos_phi`
  - Shift 2 (14:31-22:00): `shift2_count`, `shift2_avg_kwh`, `shift2_avg_current`, `shift2_avg_cos_phi`
  - Shift 3 (22:01-07:00): `shift3_count`, `shift3_avg_kwh`, `shift3_avg_current`, `shift3_avg_cos_phi`
  - `created_at`, `updated_at`
- **Special Logic**: Shift 3 crosses midnight (22:00-23:59 today + 00:00-07:00 tomorrow)
- **Performance**: 3-71ms (vs 132-269ms legacy method)

### Production Tables

- `production_line_a_pc39` - PC39 data + KWH meter
- `production_line_a_pc14` - PC14 data + KWH meter
- `production_line_a_ts1000` - TS1000 data + KWH meter
- `production_line_a_fcp` - FCP data + KWH meter
- `production_line_a_tws56` - TWS56 data + KWH meter
- `production_line_a_tws72` - TWS72 data + KWH meter
- `production_line_a_copack` - COPACK data + KWH meter
- `production_line_a_ihp` - IHP data + KWH meter

**Fields**: targetProduction, actualProduction, defectCount, oeePercentage, availability, performance, quality, kwhMeter, powerConsumption, voltageInput, currentAmpere

### Packing Tables

- `packing_line_a_weigher` to `packing_line_i_weigher` (9 lines)
- `packing_line_a_bagmaker` to `packing_line_i_bagmaker` (9 lines)

**Bagmaker Fields**: targetBags, actualBags, goodBags, notGoodBags, totalEfficiency, efficiencyWeigher, efficiencyBagMaker, metalDetect, printerError, productInSeal, spliceDetect, actualSpeed, wastedFilmPercentage

**Weigher Fields**: targetPacks, actualPacks, rejectCount, avgWeight, minWeight, maxWeight, efficiency

---

## 🔧 Recent Updates (Nov 2025)

### LVMDP Performance Optimization (Nov 26-28)

**Problem**: Query view dengan jutaan records sangat lambat (200-500ms)

**Solution**: Implemented 3-tier architecture

1. **Hourly Report System**

   - ✅ Created `hourly_report_lvmdp_1-4` tables
   - ✅ Pre-aggregate data setiap jam (automated scheduler at :05)
   - ✅ DB-side aggregation using SQL GROUP BY
   - ✅ Indexed on (report_date, hour)
   - ✅ Performance: 30-126ms to generate, <10ms to fetch

2. **Daily Report System**

   - ✅ Created optimized `generateFromHourlyReport()` function
   - ✅ Reads from hourly_report instead of raw view
   - ✅ Fixed Shift 3 calculation (cross-midnight logic)
   - ✅ Added power factor (cos_phi) to all shift reports
   - ✅ Performance: 3-71ms (vs 132-269ms before)

3. **Database Migrations**

   - ✅ Migration 0007: Created hourly_report tables with indexes
   - ✅ Migration 0008: Added cos_phi columns to daily_report tables
   - ✅ Updated schemas for LVMDP 1-4

4. **API Improvements**

   - ✅ Added compatibility endpoints for frontend
   - ✅ Fixed controller to map `shift1AvgCosPhi` → `shift1CosPhi`
   - ✅ Repository upsert with `onConflictDoUpdate` for data safety

5. **Bug Fixes**
   - ✅ Fixed Shift 3 crossing midnight (hours 0-6 from next day)
   - ✅ Fixed power factor showing 0 (was hardcoded in controller)
   - ✅ Fixed date boundary issues in shift calculations

### Frontend Updates (Nov 26-28)

✅ Sidebar auto-expand: Menu Utility/Electrical otomatis terbuka di daily report  
✅ Sidebar active state: Menu LVMDP yang sesuai akan highlight berdasarkan `?panel=X`  
✅ Daily report integration: Unified view untuk semua LVMDP panels  
✅ Redesigned LVMDP with elegant layout (cyan theme, icon circles)  
✅ Reduced bagmaker card sizes (proporsional design)  
✅ Fixed responsive mobile layout (overflow-x hidden)  
✅ Fixed efficiency bar bug on mobile/half screen

### Backend Updates (Earlier Nov 2025)

✅ Added KWH meter fields to all production tables  
✅ Extended bagmaker tables with 11 new fields  
✅ Added endpoint `/api/production/:lineId`  
✅ Added endpoint `/api/packing/bagmaker/:lineId`  
✅ Added endpoint `/api/packing/weigher/:lineId`  
✅ Database migration completed successfully

---

## 🏗️ Architecture Decisions

### Why Pre-aggregation?

**Problem**:

- View tables contain millions of records
- Each query scans entire dataset
- Response time: 200-500ms unacceptable for user experience

**Solution**:

1. **Hourly Pre-aggregation**: Reduce millions of rows to 24 rows/day
2. **Daily Summary**: Single row per day with shift breakdown
3. **Automated Schedulers**: Background jobs maintain data freshness
4. **Indexed Tables**: Fast lookups using composite indexes

**Result**:

- 95% faster queries (3-71ms vs 132-269ms)
- Predictable performance (max 24 hourly records to process)
- Scalable architecture (future dates automatically handled)

### Shift 3 Cross-Midnight Logic

**Challenge**: Shift 3 (22:01-07:00) spans two calendar dates

**Solution**:

```typescript
const SHIFT_HOURS = {
  shift1: [7, 8, 9, 10, 11, 12, 13, 14], // 07:01-14:30
  shift2: [14, 15, 16, 17, 18, 19, 20, 21], // 14:31-22:00
  shift3_today: [22, 23], // 22:01-23:59 (today)
  shift3_tomorrow: [0, 1, 2, 3, 4, 5, 6], // 00:00-07:00 (tomorrow)
};

// Fetch both today and tomorrow's hourly data
// Combine for accurate shift 3 calculation
```

**Why It Matters**:

- Nov 26 Shift 3 includes hours 22-23 from Nov 26 + hours 0-6 from Nov 27
- Nov 27 only has morning data (hours 0-6) → Shows as Shift 1 of Nov 27
- Correct reporting prevents data misattribution

---

## 📝 Development Guidelines

### Adding New Features

1. **Database Changes**

   - Create migration SQL in `drizzle/`
   - Update `schema.ts` with new table definitions
   - Run migration: `npx ts-node src/scripts/runMigration.ts`
   - Test with sample data

2. **Backend Development**

   - Repository layer: Database operations (CRUD)
   - Service layer: Business logic and calculations
   - Controller layer: HTTP endpoints and validation
   - Follow pattern: `moduleName.repository.ts`, `moduleName.services.ts`, `moduleName.controller.ts`

3. **Frontend Development**
   - Create view in `src/views/`
   - Add route in `src/router/index.ts`
   - Update sidebar in `src/components/sideBar.vue`
   - Use composables for shared logic
   - Follow responsive design patterns

### Performance Best Practices

1. **Database**

   - Always add indexes for frequently queried columns
   - Use DB-side aggregation (SQL GROUP BY) instead of application-side
   - Prefer pre-aggregated tables for heavy queries
   - Use `UNIQUE` constraints to prevent duplicate data

2. **API**

   - Cache results when appropriate
   - Use pagination for large datasets
   - Implement efficient date range filtering
   - Return only needed fields (avoid SELECT \*)

3. **Frontend**
   - Use Socket.IO only for truly real-time data (LVMDP)
   - Use polling (30s) for less critical data
   - Implement loading states and error handling
   - Debounce user inputs and API calls

### Code Organization

```
Module Structure:
├── controller.ts      # HTTP endpoints, request/response handling
├── services.ts        # Business logic, data transformation
├── repository.ts      # Database queries, ORM operations
└── types.ts           # TypeScript interfaces (if needed)

Follow this pattern for consistency across all modules.
```

### Testing

```bash
# Backend
cd pisifmbe
npm run dev          # Development with hot reload

# Frontend
cd pisifmfe/frontend
npm run dev          # Vite dev server

# Database scripts
npx ts-node src/scripts/backfillHourlyReports.ts 2025-11-01 2025-11-27
npx ts-node src/scripts/backfillDailyReports.ts 2025-11-14 2025-11-27
```

---

## 📝 Important Notes

- **Timezone**: All timestamps use Asia/Jakarta (UTC+7)
- **Data Freshness**:
  - LVMDP: Real-time via Socket.IO
  - Hourly reports: Updated at :05 every hour
  - Daily reports: Updated at 00:05 daily
  - Other modules: 30-second polling
- **Database Views**: Do NOT modify `v_lvmdp_1-4` (managed by database admin)
- **Scheduler**: Runs automatically on server start (hourly/daily jobs)
- **Design Philosophy**: Proporsional, elegant, not too big, not too small

---

## 🐛 Troubleshooting

### Power Factor Shows 0

- Check if `shift1_avg_cos_phi` columns exist in database
- Verify controller maps `shift1AvgCosPhi` → `shift1CosPhi`
- Ensure repository includes cosPhi in `onConflictDoUpdate`

### Slow Query Performance

- Check if hourly_report tables are populated
- Verify indexes exist: `(report_date, hour)` and `(report_date)`
- Run backfill scripts if data is missing

### Shift 3 Data Incorrect

- Verify `generateFromHourlyReport()` fetches tomorrow's data
- Check SHIFT_HOURS split: `shift3_today` and `shift3_tomorrow`
- Ensure hourly data exists for both dates

### Sidebar Menu Not Active

- Check route path matches pattern in `isItemActive()`
- Verify query parameter exists: `?panel=1`
- Check `watchEffect` auto-expands parent menus

---
