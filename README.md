# PISIFM - Project Information System

**Developer**: Septian Bagus Jumantoro  
**Last Updated**: December 1, 2025  
**Organization**: PT Indofood Fortuna Makmur

Real-time factory monitoring system untuk production lines, electrical panels (LVMDP), dan packing lines dengan daily reporting dan performance analytics.

## 🌐 Akses Website

- **Lokal**: http://localhost
- **Ethernet**: http://10.125.48.102
- **Wi-Fi**: http://172.20.10.6

## 🚀 Quick Start

### Setup Auto-Start (Sekali Saja)

```bash
# Klik kanan setup-autostart.bat → Run as Administrator
# Backend akan otomatis start setiap PC restart
```

### Deploy/Update Code

```powershell
.\deploy.ps1  # Build frontend + backend, restart Apache
```

### Start Backend Manual

```bash
.\start-backend.bat  # Jangan tutup window yang muncul
```

## 📖 Server Management

### Monitoring Status

```powershell
Get-Process node              # Cek backend running
Get-Service Apache2.4         # Cek Apache status
Get-Content backend-autostart.log -Tail 20  # View backend log
```

### Restart Services

```powershell
# Restart backend: Task Manager → End node.exe → auto-restart
# Restart Apache
Restart-Service Apache2.4     # Perlu Administrator
```

## 🚨 Troubleshooting

### Website Tidak Bisa Diakses

```powershell
Get-Service Apache2.4         # Cek status Apache
Restart-Service Apache2.4     # Restart Apache (as Admin)
```

### Data Tidak Muncul / Loading

```powershell
Get-Process node              # Cek backend running
.\start-backend.bat           # Start backend jika tidak ada
Get-Content backend-autostart.log -Tail 20  # Cek error log
```

### Backend Tidak Auto-Start

```powershell
# Buka Task Scheduler → Cari "PISIFM_Backend_AutoStart"
# Klik kanan → Run (test manual)
# Jika task tidak ada, jalankan: setup-autostart.bat (as Admin)
```

### Emergency Recovery

```powershell
Stop-Service Apache2.4
Get-Process node | Stop-Process -Force
Start-Sleep -Seconds 10
Start-Service Apache2.4
.\start-backend.bat
```

## 🔄 Development Mode

```powershell
# Backend dev
cd pisifmbe
npm run dev

# Frontend dev
cd pisifmfe/frontend
npm run dev
```

Development URLs: Frontend `localhost:30` | Backend `localhost:2000`

## 🏭 System Modules

### LVMDP - 4 Panels (Electrical Monitoring)

- Real-time: kW, Frequency, Power Factor (cos φ)
- Shift tracking: Shift 1 (07:01-14:30), Shift 2 (14:31-22:00), Shift 3 (22:01-07:00)
- Daily/Hourly reports with pre-aggregated data
- Performance: DB-side aggregation, indexed tables

### Production Lines - 8 Machines

- PC39, PC14, TS1000, FCP, TWS56, TWS72, COPACK, IHP
- OEE tracking (Availability, Performance, Quality)
- KWH meter monitoring
- Shift summary (Target vs Actual)

### Packing Lines - 9 Lines (A-I)

- **Weigher**: Target/Actual packs, weight metrics, efficiency
- **Bagmaker**: Production metrics, efficiency, quality detection, waste management

## 🚀 Tech Stack

- **Frontend**: Vue 3, TypeScript, Vite, Tailwind CSS, ECharts, Socket.IO
- **Backend**: Express.js, Drizzle ORM, PostgreSQL
- **Server**: Apache 2.4 (port 80) → Backend (port 2000)

## 📊 Database Architecture

### LVMDP Optimization (3-tier)

1. **View Tables**: `v_lvmdp_1-4` - Raw HMI data (millions of records, slow)
2. **Hourly Reports**: `hourly_report_lvmdp_1-4` - Pre-aggregated (24 rows/day, indexed)
3. **Daily Reports**: `daily_report_lvmdp_1-4` - Shift summaries (1 row/day)

**Performance**: 95% faster queries (3-71ms vs 132-269ms)

### Production & Packing Tables

- Production: `production_line_a_*` (OEE, KWH meter data)
- Packing: `packing_line_*_weigher`, `packing_line_*_bagmaker`

## 📌 Quick Commands

```powershell
# Status
Get-Process node                    # Backend running?
Get-Service Apache2.4               # Apache status

# Restart
Restart-Service Apache2.4           # Restart Apache (as Admin)
Get-Process node | Stop-Process -Force  # Kill backend (auto-restart)

# Deploy
.\deploy.ps1                        # Build + deploy

# Logs
Get-Content backend-autostart.log -Tail 20
Get-Content C:\MyServer\Apache24\logs\error.log -Tail 20

# Database scripts
cd pisifmbe
npx ts-node src/scripts/backfillHourlyReports.ts 2025-12-01 2025-12-31
npx ts-node src/scripts/backfillDailyReports.ts 2025-12-01 2025-12-31
```

## Project Info

**Developer**: Septian Bagus Jumantoro  
**Organization**: PT Indofood Fortuna Makmur  
**Environment**: Windows + Apache 2.4 + Node.js + PostgreSQL  
**Deployment**: December 1, 2025

---
