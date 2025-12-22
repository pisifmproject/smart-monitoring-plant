# Smart Monitoring Plant - Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database configured
- Backend running on port 2000
- Frontend running on port 3000 (or 30 in dev)

---

## Starting the Application

### 1. Start Backend Server

```bash
cd pisifmbe
npm install
npm run dev
# Server will run on http://localhost:2000
```

### 2. Start Frontend Server

```bash
cd pisifmfe/frontend
npm install
npm run dev
# Frontend will run on http://localhost:3000 or :30
```

---

## Accessing the Application

### Landing Page

1. Navigate to: `http://localhost:3000`
2. You will see: **"Smart Monitoring Plant"** title
3. Click: "Access Dashboard" button

### Login Page

1. Enter valid credentials from database:
   - Example: `userifm` / `pisifm00`
   - Or any user account in `users` table
2. Click: "Login"
3. Redirected to: Dashboard/Summary page

---

## Key Features by Plant

### Plant Cikupa (Real Data)

- **Dashboard:** Real-time electrical monitoring
- **Data Source:** Live sensors (electricalMode = REAL)
- **Refresh Rate:** Every 10 seconds
- **Features:**
  - Live power distribution (kVA)
  - Panel metrics (voltage, current, power factor)
  - Load percentage with color coding
  - Min/Max load tracking
  - Historical reports & PDF export

### Other Plants (Dummy Data)

- **Plant Cikokol, Semarang, Agro**
- **Data Source:** Simulated (electricalMode = DUMMY)
- **Refresh Rate:** Every 30 seconds
- **Features:**
  - Same dashboard interface
  - Sample electrical metrics
  - For testing & demonstration

---

## Main Navigation

### Sidebar Menu

- **Electrical Dashboard** - Real-time power monitoring (Cikupa live)
- **LVMDP 1-4** - Panel-specific dashboards
- **Production** - Production line monitoring
- **Daily Report** - Historical daily reports
- **Hourly Report** - Hourly data analysis
- **Settings** - System configuration

---

## Real-time Features

### Live Electricity Summary (Cikupa Only)

```
Connected to: /api/summary/electrical
Update Interval: 10 seconds
Displays:
  • Total Power (kVA)
  • Load Percentage (%)
  • Min/Max Load Tracking
  • Panel-by-panel metrics
  • Last update timestamp
```

### Connection Status

- **Green Pulse:** Connected & data flowing
- **Yellow Pulse:** Attempting connection
- **Red Pulse:** Connection lost

---

## Authentication

### Login Flow

1. POST `/api/auth/login`
2. Validate against database
3. Return JWT token
4. Store token in localStorage
5. Auto-redirect to dashboard

### Token Management

- Token stored: `auth_state` in localStorage
- Token expiry: Set in JWT payload
- Auto-logout: On token expiry

### Logout

- Click profile → Logout
- Token removed from localStorage
- Redirected to landing page

---

## Data Sources

### Real Data (Cikupa)

```
Sensors (LVMDP 1-4)
    ↓
Database (PostgreSQL)
    ↓
Backend: /api/summary/electrical
    ↓
Frontend: Live Dashboard
```

### Dummy Data (Other Plants)

```
generateDummyPanels() function
    ↓
Frontend: ElectricalDummyDashboard.vue
    ↓
Refresh every 30 seconds
```

---

## Database Setup

### Required Tables

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50),
  plantAccess TEXT[] -- Array of plant codes
);

-- LVMDP data (already exists from migrations)
-- Daily reports (auto-generated)
-- Hourly reports (auto-generated)
```

### Insert Sample User

```sql
INSERT INTO users (username, password, name, role, plantAccess)
VALUES ('userifm', 'hashed_password', 'User Test', 'user', ARRAY['CIKUPA', 'CIKOKOL']);
```

---

## API Endpoints (Backend)

### Authentication

```
POST /api/auth/login
GET /api/auth/me
```

### Electrical Summary (Live)

```
GET /api/summary/electrical
```

### Electrical Reports (Historical)

```
GET /api/report/electrical?period=day&date=2025-12-22
GET /api/report/electrical?period=week&week=51&year=2025
GET /api/report/electrical?period=month&month=12&year=2025
```

### LVMDP Live Data

```
GET /api/lvmdp/{panelId}/latest
GET /api/lvmdp/{panelId}/history
```

---

## Common Tasks

### Generate Daily Report

- Automatic: 00:05 AM daily
- Manual: Dashboard → Download Report
- Select date → Click "Download PDF"

### Check Connection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for `/api/summary/electrical` requests
4. Should see 200 status code every 10 seconds

### Troubleshoot Real-time Data

1. Check backend is running: `curl http://localhost:2000/api/summary/electrical`
2. Check database has recent LVMDP readings
3. Verify plant is set to Cikupa
4. Check browser console for errors

### Switch Between Plants

1. In sidebar or plant selector
2. Dashboard automatically switches
3. Cikupa = Real data
4. Others = Dummy data

---

## File Structure Reference

### Frontend (pisifmfe/frontend/src/)

```
├── views/
│   ├── landing.vue ← "Smart Monitoring Plant" title
│   ├── login.vue ← Login form
│   ├── summary/ ← Electrical dashboard
│   ├── lvmdp/ ← LVMDP panels
│   └── ...
├── stores/
│   └── auth.ts ← Authentication state
├── config/
│   └── plants.js ← Plant configuration (REAL vs DUMMY)
├── composables/
│   └── useElectricalReport.ts ← Electrical data fetching
└── ...
```

### Backend (pisifmbe/src/)

```
├── auth/ ← Login & authentication
├── electricalReport/ ← Real-time & historical data
├── lvmdp/ ← Panel data management
├── cron/ ← Scheduled tasks (daily aggregation)
├── db/ ← Database ORM & queries
└── socket.ts ← WebSocket for real-time updates
```

---

## Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:2000/api
```

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_secret_key
PORT=2000
NODE_ENV=development
```

---

## Support & Troubleshooting

### 404 Errors

- Check API URL in `.env`
- Verify backend is running
- Check port configuration

### Authentication Errors

- Verify user exists in database
- Check password is correct
- Review auth.service.ts logs

### Real-time Data Not Updating

- Check database connection
- Verify LVMDP sensors are online
- Review Socket.IO connection
- Check browser console for errors

### PDF Export Not Working

- Ensure backend is running
- Check file system permissions
- Verify jsPDF is installed

---

## Version Info

- **Project:** Smart Monitoring Plant
- **Backend:** Node.js + Express + TypeScript
- **Frontend:** Vue 3 + Vite + TypeScript
- **Database:** PostgreSQL
- **Last Updated:** December 22, 2025

---

For detailed technical documentation, see: `INTEGRATION_SUMMARY.md`
