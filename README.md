# 📋 PISIFM - Project Information System

**Developer**: Septian Bagus Jumantoro  
**Last Updated**: December 1, 2025  
**License**: Confidential - PT Indofood Fortuna Makmur Internal Use Only

---

Project monitoring system untuk Indofood factory dengan real-time data visualization, daily reporting, dan comprehensive performance analytics.

## ✅ Production Server Status

**🟢 DEPLOYED & RUNNING** - Server production sudah aktif dan siap 24/7

### 🌐 Akses Website:

- **Lokal (dari PC server)**: http://localhost
- **Dari jaringan Ethernet**: http://10.125.48.102
- **Dari jaringan Wi-Fi**: http://172.20.10.6

### ⚙️ Server Configuration:

- ✅ **Apache 2.4** - Auto-start saat boot (Port 80)
- ✅ **Frontend Vue.js** - Deployed dan accessible
- ✅ **Backend Node.js** - Auto-start configured (Port 2000)
- ✅ **Database** - PostgreSQL connected

---

## 🚀 Setup Server (Sekali Saja)

### Backend Auto-Start Setup (WAJIB)

Agar backend otomatis running setelah PC restart:

```
1. Klik kanan: setup-autostart.bat
2. Pilih: Run as Administrator
3. Tunggu pesan "SUCCESS"
4. Restart PC untuk test
```

**Setelah restart**, backend akan otomatis start dan website langsung siap digunakan!

---

## 📖 Panduan Lengkap Server & Maintenance

### 🔧 Monitoring & Status Checks

**Cek Backend Running:**

```powershell
Get-Process node
```

Harus ada proses `node.exe` yang running. Jika tidak ada, backend tidak berjalan.

**Cek Apache Running:**

```powershell
Get-Service Apache2.4
```

Status yang baik: `Running` dengan StartType: `Automatic`

**Cek Task Scheduler (Auto-Start):**

1. Buka Task Scheduler (tekan Win+R, ketik `taskschd.msc`)
2. Task Scheduler Library → Cari `PISIFM_Backend_AutoStart`
3. Status harus: `Ready` atau `Running`
4. Trigger: `At log on` dengan highest privileges

**View Log Backend:**

```powershell
Get-Content backend-autostart.log -Tail 20
```

**View Log Apache Error:**

```powershell
Get-Content C:\MyServer\Apache24\logs\error.log -Tail 20
```

**View Log Apache Access:**

```powershell
Get-Content C:\MyServer\Apache24\logs\access.log -Tail 20
```

### 🔄 Restart Services

**Restart Backend:**

**Cara 1: Via Task Manager**

1. Buka Task Manager (Ctrl+Shift+Esc)
2. Tab "Details", cari `node.exe`
3. Klik kanan → End Task
4. Tunggu 10 detik, auto-start akan restart otomatis

**Cara 2: Manual Start (jika auto-start belum setup)**

```
Double-click: start-backend.bat
```

Jangan tutup window yang muncul - biarkan tetap terbuka!

**Cara 3: Via PowerShell**

```powershell
.\start-backend.ps1
```

**Restart Apache (Perlu Administrator):**

```powershell
Restart-Service Apache2.4
```

Atau gunakan batch file:

```
Klik kanan: restart-apache-admin.bat → Run as Administrator
```

**Via Command Prompt (as Admin):**

```cmd
net stop Apache2.4
net start Apache2.4
```

### 🚀 Deploy/Update Code

Jika ada perubahan code frontend atau backend:

**One-Command Deploy:**

```powershell
.\deploy.ps1
```

Script ini akan otomatis:

1. ✅ Build frontend → `/dist`
2. ✅ Build backend → `/dist`
3. ✅ Restart Apache
4. ✅ Tampilkan status deployment

**Setelah deploy:**

- Stop backend lama (Task Manager → End node.exe)
- Backend baru akan auto-start atau jalankan `start-backend.bat`

**Manual Build (jika perlu):**

```powershell
# Build frontend
cd pisifmfe\frontend
npm run build

# Build backend
cd ..\..\pisifmbe
npm run build
```

### 🛡️ Firewall Configuration

Port 80 sudah dikonfigurasi untuk HTTP access.

**Jika website tidak bisa diakses dari device lain:**

**Via PowerShell (as Administrator):**

```powershell
New-NetFirewallRule -DisplayName "Apache HTTP - PISIFM" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
```

**Via Command Prompt (as Administrator):**

```cmd
netsh advfirewall firewall add rule name="Apache HTTP - PISIFM" dir=in action=allow protocol=TCP localport=80
```

**Cek Firewall Rules:**

```powershell
Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*PISIFM*"}
```

### 📁 Struktur File Penting

```
C:\Users\netcom\Documents\ifm_septian\project\PISIFM\
├── pisifmfe\frontend\dist\          # Frontend (served by Apache)
├── pisifmbe\dist\                   # Backend compiled JavaScript
├── start-backend.bat                # Manual start backend
├── autostart-backend.bat            # Auto-start script (by Task Scheduler)
├── autostart-backend.ps1            # PowerShell version
├── setup-autostart.bat              # Setup auto-start (RUN AS ADMIN)
├── deploy.ps1                       # Deploy/update script
├── restart-apache-admin.bat         # Restart Apache helper
├── backend-autostart.log            # Backend runtime log
└── README.md                        # Dokumentasi lengkap (file ini)

C:\MyServer\Apache24\
├── conf\httpd.conf                  # Apache main config
├── conf\extra\pisifm.conf           # PISIFM vhost config
└── logs\                            # Apache logs (error.log, access.log)
```

### ⚙️ Task Scheduler Management

**Lokasi Task:**

- Buka: Task Scheduler → Task Scheduler Library
- Task Name: `PISIFM_Backend_AutoStart`

**Actions:**

- **Run Manual**: Klik kanan task → Run (test auto-start)
- **Enable**: Klik kanan task → Enable (aktifkan auto-start)
- **Disable**: Klik kanan task → Disable (matikan auto-start)
- **Delete**: Klik kanan task → Delete (hapus auto-start sepenuhnya)
- **View Log**: Klik kanan task → History (lihat run history)

**Task Properties:**

- **Trigger**: At log on (user netcom)
- **Action**: Start a program → autostart-backend.bat
- **Settings**: Run with highest privileges, allow on-demand start

**Recreate Task:**

Jika task terhapus atau error, run ulang:

```
Klik kanan: setup-autostart.bat → Run as Administrator
```

---

## 🚨 Troubleshooting Guide

### ❌ Website Tidak Bisa Diakses

**Gejala**: Browser menampilkan "Can't reach this site" atau timeout

**Diagnosis:**

```powershell
# 1. Cek Apache status
Get-Service Apache2.4

# 2. Cek port 80 listening
Get-NetTCPConnection -LocalPort 80

# 3. Test syntax Apache config
C:\MyServer\Apache24\bin\httpd.exe -t
```

**Solusi:**

1. ✅ Pastikan Apache Running: `Get-Service Apache2.4` (Status: Running)
2. ✅ Restart Apache jika Stopped: `Restart-Service Apache2.4` (as Admin)
3. ✅ Test dengan IP langsung: http://127.0.0.1
4. ✅ Clear browser cache: Ctrl+Shift+Delete
5. ✅ Cek firewall allow port 80
6. ✅ Restart PC jika masih gagal

### ❌ Data Website Tampil 0 / Kosong / Loading Terus

**Gejala**: Website terbuka tapi data tidak muncul, gauge 0, atau loading forever

**Diagnosis:**

```powershell
# 1. Cek backend process
Get-Process node

# 2. Cek backend log
Get-Content backend-autostart.log -Tail 20

# 3. Test API endpoint
Invoke-WebRequest http://localhost:2000/api/lvmdp1/shift-avg?date=2025-12-01
```

**Solusi:**

1. ✅ Cek backend running: `Get-Process node` (harus ada node.exe)
2. ✅ Jika tidak ada, start backend: `start-backend.bat`
3. ✅ Cek log untuk errors: `backend-autostart.log`
4. ✅ Pastikan database online dan connection string benar
5. ✅ Test API manual dengan browser: http://localhost:2000/api/lvmdp1/shift-avg?date=2025-12-01
6. ✅ Restart backend jika perlu (End Task node.exe → auto-restart)

### ❌ Backend Tidak Auto-Start Setelah Reboot

**Gejala**: Setelah restart PC, website terbuka tapi data 0

**Diagnosis:**

```powershell
# 1. Cek Task Scheduler
Get-ScheduledTask -TaskName "PISIFM_Backend_AutoStart"

# 2. Cek task history (PowerShell as Admin)
Get-WinEvent -LogName Microsoft-Windows-TaskScheduler/Operational | Where-Object {$_.Message -like "*PISIFM*"} | Select-Object -First 5
```

**Solusi:**

1. ✅ Buka Task Scheduler (`Win+R` → `taskschd.msc`)
2. ✅ Cari task: `PISIFM_Backend_AutoStart`
3. ✅ Klik kanan → Run (manual test)
4. ✅ Cek History tab untuk error messages
5. ✅ Jika task tidak ada, run ulang: `setup-autostart.bat` (as Admin)
6. ✅ Pastikan "Run with highest privileges" enabled
7. ✅ Trigger harus: "At log on"

### ❌ Port 80 Already in Use

**Gejala**: Apache tidak bisa start, error "port 80 already in use"

**Diagnosis:**

```powershell
# Cek process yang menggunakan port 80
Get-NetTCPConnection -LocalPort 80 | Select-Object OwningProcess | Get-Unique | ForEach-Object { Get-Process -Id $_.OwningProcess }
```

**Solusi:**

1. ✅ Identifikasi process yang pakai port 80
2. ✅ Jika IIS (W3SVC), stop service: `Stop-Service W3SVC`
3. ✅ Jika Skype, disable "Use port 80 and 443" di settings
4. ✅ Jika tidak dikenal, restart PC
5. ✅ Set Apache priority (optional): Change port atau stop conflicting service

### ❌ Apache Crash / Tidak Stabil

**Gejala**: Apache service tiba-tiba berhenti atau error saat start

**Diagnosis:**

```powershell
# Check Apache error log
Get-Content C:\MyServer\Apache24\logs\error.log -Tail 50

# Test Apache config syntax
C:\MyServer\Apache24\bin\httpd.exe -t

# Check VirtualHost config
C:\MyServer\Apache24\bin\httpd.exe -S
```

**Solusi:**

1. ✅ Cek syntax error: `httpd.exe -t` (harus "Syntax OK")
2. ✅ Review error.log untuk detail error
3. ✅ Jika config error, restore backup config
4. ✅ Restart Apache: `Restart-Service Apache2.4`
5. ✅ Jika masih error, reinstall Apache (backup config dulu!)

### ❌ Performa Lambat / Website Loading Lama

**Gejala**: Website loading >5 detik, slow response

**Diagnosis:**

```powershell
# Check CPU & Memory usage
Get-Process node | Select-Object CPU, WS

# Check disk space
Get-PSDrive C

# Check database connection
# (Test via backend API)
```

**Solusi:**

1. ✅ Monitor resource usage (Task Manager)
2. ✅ Cek disk space (min 10GB free)
3. ✅ Restart backend jika memory leak
4. ✅ Clear old logs (archive lalu delete)
5. ✅ Optimize database (vacuum, reindex)
6. ✅ Check network connection quality

### ❌ Shift 3 Data Tidak Muncul

**Gejala**: Shift 3 (22:01-07:00) tidak menampilkan data

**Diagnosis:**

```powershell
# Test API untuk specific date
Invoke-WebRequest http://localhost:2000/api/lvmdp1/daily-report/2025-12-01
```

**Solusi:**

1. ✅ Shift 3 memerlukan data dari 2 tanggal (today 22-23, tomorrow 0-6)
2. ✅ Pastikan hourly report ada untuk kedua tanggal
3. ✅ Jalankan backfill jika data kurang:
   ```powershell
   cd pisifmbe
   npx ts-node src/scripts/backfillHourlyReports.ts 2025-12-01 2025-12-02
   npx ts-node src/scripts/backfillDailyReports.ts 2025-12-01 2025-12-02
   ```

### ❌ Power Factor (cos φ) Menampilkan 0

**Gejala**: Gauge cos φ selalu 0 padahal data lain muncul

**Diagnosis:**

```sql
-- Check if cos_phi columns exist
SELECT column_name FROM information_schema.columns
WHERE table_name = 'daily_report_lvmdp_1' AND column_name LIKE '%cos_phi%';
```

**Solusi:**

1. ✅ Pastikan migration 0008 sudah dijalankan
2. ✅ Cek schema.ts memiliki `avgCosPhi` field
3. ✅ Verify controller mapping: `shift1AvgCosPhi` → `shift1CosPhi`
4. ✅ Regenerate daily report jika data lama
5. ✅ Check repository includes cosPhi in `onConflictDoUpdate`

### ❌ Socket.IO Disconnected

**Gejala**: Real-time data LVMDP tidak update, console error "socket disconnected"

**Diagnosis:**

```javascript
// Check browser console for errors
// Should see: "Socket.IO connected" on page load
```

**Solusi:**

1. ✅ Pastikan backend running
2. ✅ Cek proxy config Apache (`mod_proxy_wstunnel` enabled)
3. ✅ Test WebSocket: http://localhost:2000/socket.io/?EIO=4&transport=polling
4. ✅ Clear browser cache
5. ✅ Restart backend dan Apache

### 🆘 Emergency Recovery

**Jika semua gagal:**

1. **Backup Critical Files:**

   ```powershell
   # Backup config files
   Copy-Item C:\MyServer\Apache24\conf\httpd.conf C:\Backup\
   Copy-Item C:\MyServer\Apache24\conf\extra\pisifm.conf C:\Backup\
   ```

2. **Restart All Services:**

   ```powershell
   # Stop services
   Stop-Service Apache2.4
   Get-Process node | Stop-Process -Force

   # Wait 10 seconds
   Start-Sleep -Seconds 10

   # Start services
   Start-Service Apache2.4
   .\start-backend.bat
   ```

3. **Full System Restart:**

   ```
   1. Save all work
   2. Close applications
   3. Restart → tunggu 2-3 menit
   4. Verify Apache & backend auto-start
   5. Test website: http://localhost
   ```

4. **Contact Support:**
   - Developer: Septian Bagus Jumantoro
   - Check documentation: README.md
   - Review logs: backend-autostart.log, error.log

---

## 🔄 Development Mode

### Run Development Server

**Backend:**

```powershell
cd pisifmbe
npm run dev
```

**Frontend:**

```powershell
cd pisifmfe/frontend
npm run dev
```

Development URLs:

- Frontend: http://localhost:30
- Backend API: http://localhost:2000

---

## 📊 System Maintenance Schedule

### Harian:

- ✅ Cek website accessible (morning check)
- ✅ Monitor backend log untuk errors
- ✅ Pastikan data real-time update

### Mingguan:

- ✅ Review log files (backend-autostart.log)
- ✅ Cek disk space tersedia
- ✅ Backup log files lama

### Bulanan:

- ✅ Backup database
- ✅ Update dependencies jika ada
- ✅ Review performance metrics
- ✅ Clean up old log files

### Saat PC Restart:

- ✅ Tunggu 2-3 menit setelah login
- ✅ Verifikasi Apache auto-start
- ✅ Verifikasi backend auto-start
- ✅ Test website: http://localhost
- ✅ Cek data muncul dengan benar

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

## 🔄 Recent Updates

### December 1, 2025 - Production Deployment 🚀

**Major Achievement: Website Successfully Deployed to Production Server**

#### Infrastructure Setup

- ✅ **Apache 2.4 Web Server** - Installed dan dikonfigurasi di `C:\MyServer\Apache24`
- ✅ **DocumentRoot** - Configured to serve Vue.js dist folder
- ✅ **Proxy Configuration** - API dan WebSocket proxied ke backend (port 2000)
- ✅ **Apache Modules Enabled**: mod_proxy, mod_proxy_http, mod_proxy_wstunnel, mod_rewrite
- ✅ **Auto-Start** - Apache service set to automatic startup on boot

#### Backend Auto-Start System

- ✅ **Task Scheduler Integration** - Created Windows scheduled task
- ✅ **Auto-start Scripts** - `setup-autostart.bat`, `autostart-backend.bat`, `autostart-backend.ps1`
- ✅ **Logging System** - Auto-generated log file: `backend-autostart.log`
- ✅ **Run at Startup** - Backend automatically starts when user logs in
- ✅ **High Privilege** - Runs with highest privileges for reliability

#### Deployment Scripts & Tools

- ✅ **deploy.ps1** - One-command deployment (build frontend, build backend, restart Apache)
- ✅ **start-backend.bat** - Manual backend startup script
- ✅ **restart-apache-admin.bat** - Apache restart helper (requires admin)
- ✅ **setup-autostart.bat** - One-click auto-start configuration

#### Documentation & Support

- ✅ **SERVER-GUIDE.md** - Comprehensive server maintenance guide
- ✅ **CATATAN-SERVER.md** - Quick reference notes in Bahasa Indonesia
- ✅ **SERVER-DASHBOARD.html** - Interactive dashboard with quick links
- ✅ **QUICK-FIX.md** - Fast troubleshooting reference
- ✅ **Updated README.md** - Production-ready documentation

#### Network & Access

- ✅ **Multi-Network Access** - Accessible via localhost, Ethernet (10.125.48.102), Wi-Fi (172.20.10.6)
- ✅ **Firewall Configuration** - Port 80 properly configured
- ✅ **Production URLs** - All endpoints tested and working

#### File Cleanup

- ✅ Removed backup config files (httpd.conf.backup)
- ✅ Removed development-only .js files from frontend/src
- ✅ Removed .bckp TypeScript config files
- ✅ Cleaned up temporary files

#### Key Achievements

- 🎯 **Zero-downtime Deployment** - Backend auto-restarts, Apache handles requests
- 🎯 **Production Ready** - Full monitoring, logging, and error handling
- 🎯 **User Friendly** - Visual dashboard, clear documentation, simple maintenance
- 🎯 **24/7 Operation** - Auto-start ensures service continuity after reboots
- 🎯 **Scalable Architecture** - Easy to update, maintain, and troubleshoot

---

### November 26-28, 2025 - Performance Optimization

#### LVMDP Performance Optimization

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

#### Frontend Updates

- ✅ Sidebar auto-expand: Menu Utility/Electrical otomatis terbuka di daily report
- ✅ Sidebar active state: Menu LVMDP yang sesuai akan highlight berdasarkan `?panel=X`
- ✅ Daily report integration: Unified view untuk semua LVMDP panels
- ✅ Redesigned LVMDP with elegant layout (cyan theme, icon circles)
- ✅ Reduced bagmaker card sizes (proporsional design)
- ✅ Fixed responsive mobile layout (overflow-x hidden)
- ✅ Fixed efficiency bar bug on mobile/half screen

#### Backend Updates (Earlier November)

- ✅ Added KWH meter fields to all production tables
- ✅ Extended bagmaker tables with 11 new fields
- ✅ Added endpoint `/api/production/:lineId`
- ✅ Added endpoint `/api/packing/bagmaker/:lineId`
- ✅ Added endpoint `/api/packing/weigher/:lineId`
- ✅ Database migration completed successfully

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

## 📌 Quick Commands Reference

**Status Checks:**

```powershell
# Cek backend running
Get-Process node

# Cek Apache status
Get-Service Apache2.4

# Cek Task Scheduler
Get-ScheduledTask -TaskName "PISIFM_Backend_AutoStart"

# Test website
Invoke-WebRequest http://localhost
```

**View Logs:**

```powershell
# Backend log (last 20 lines)
Get-Content backend-autostart.log -Tail 20

# Apache error log
Get-Content C:\MyServer\Apache24\logs\error.log -Tail 20

# Apache access log
Get-Content C:\MyServer\Apache24\logs\access.log -Tail 20
```

**Service Management:**

```powershell
# Restart Apache (as Admin)
Restart-Service Apache2.4

# Start backend manual
.\start-backend.bat

# Deploy code updates
.\deploy.ps1

# Setup auto-start (as Admin)
.\setup-autostart.bat
```

**Troubleshooting:**

```powershell
# Check Apache config syntax
C:\MyServer\Apache24\bin\httpd.exe -t

# Check VirtualHost configuration
C:\MyServer\Apache24\bin\httpd.exe -S

# Check port 80 usage
Get-NetTCPConnection -LocalPort 80 | Select-Object OwningProcess | ForEach-Object { Get-Process -Id $_.OwningProcess }

# Check disk space
Get-PSDrive C
```

**Database Scripts:**

```powershell
# Backfill hourly reports
cd pisifmbe
npx ts-node src/scripts/backfillHourlyReports.ts 2025-12-01 2025-12-31

# Backfill daily reports
npx ts-node src/scripts/backfillDailyReports.ts 2025-12-01 2025-12-31

# Run migrations
npx ts-node src/scripts/runMigration.ts
```

---

## 📞 Support & Contact

### Getting Help

1. **Check This Documentation:**

   - All server maintenance info ada di README.md ini
   - Comprehensive troubleshooting guide tersedia di atas
   - Quick reference commands tersedia

2. **Interactive Dashboard:**

   - 🌐 Open `SERVER-DASHBOARD.html` in browser
   - Quick access to website dan monitoring tools

3. **Check Logs:**
   - Backend: `backend-autostart.log`
   - Apache Error: `C:\MyServer\Apache24\logs\error.log`
   - Apache Access: `C:\MyServer\Apache24\logs\access.log`

### DO's ✅

- ✅ Pastikan auto-start sudah di-setup dengan `setup-autostart.bat`
- ✅ Biarkan backend running 24/7
- ✅ Cek log secara berkala (weekly review)
- ✅ Monitor resource usage (RAM, CPU, Disk)
- ✅ Backup database secara rutin (monthly)
- ✅ Test website setelah restart PC
- ✅ Keep documentation updated

### DON'Ts ❌

- ❌ Jangan close window node.exe jika start manual
- ❌ Jangan matikan PC tanpa shutdown proper
- ❌ Jangan edit file config di production tanpa backup
- ❌ Jangan deploy tanpa test di development dulu
- ❌ Jangan delete Task Scheduler task tanpa alasan jelas
- ❌ Jangan modify database schema manual
- ❌ Jangan ignore error logs

---

## 👤 Project Information

**Project Name:** PISIFM (Project Information System for Indofood Factory Monitoring)  
**Developer:** Septian Bagus Jumantoro  
**Organization:** PT Indofood Fortuna Makmur  
**Environment:** Production Server (Windows + Apache 2.4 + Node.js)  
**Deployment Date:** December 1, 2025

**Tech Stack:**

- Frontend: Vue 3 + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + Socket.IO + Drizzle ORM
- Database: PostgreSQL
- Web Server: Apache 2.4

---
