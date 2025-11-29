# 🚀 PISIFM - Tutorial Deploy ke Apache24

## 📦 Prerequisites

### 1. Install Apache24

- Download dari: https://www.apachelounge.com/download/
- Extract ke `C:\Apache24`
- Atau install ke lokasi lain (sesuaikan path di konfigurasi)

### 2. Install Apache sebagai Windows Service

Buka PowerShell/CMD sebagai Administrator:

```powershell
cd C:\Apache24\bin
.\httpd.exe -k install
```

## 🔧 Konfigurasi Apache

### 3. Enable Required Modules

Edit `C:\Apache24\conf\httpd.conf`, uncomment (hapus `#`) pada baris berikut:

```apache
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
```

### 4. Copy Konfigurasi PISIFM

Copy file `apache-config/pisifm.conf` ke `C:\Apache24\conf\extra\`:

```powershell
Copy-Item "C:\Users\netcom\Documents\ifm_septian\project\PISIFM\apache-config\pisifm.conf" -Destination "C:\Apache24\conf\extra\"
```

### 5. Include Konfigurasi di httpd.conf

Edit `C:\Apache24\conf\httpd.conf`, tambahkan di akhir file:

```apache
# PISIFM Configuration
Include conf/extra/pisifm.conf
```

### 6. Test Konfigurasi Apache

```powershell
cd C:\Apache24\bin
.\httpd.exe -t
```

Jika muncul "Syntax OK", lanjutkan ke step berikutnya.

## 🗄️ Database Setup

### 7. Pastikan PostgreSQL Running

Cek service PostgreSQL di Windows Services:

- Tekan `Win + R` → ketik `services.msc`
- Cari `postgresql-x64-xx`
- Pastikan status: **Running**

## 🔥 Start Backend

### Opsi A: Manual (untuk testing)

```powershell
cd C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe
npm run build
node dist/server.js
```

### Opsi B: Menggunakan Batch File

Double-click `start-backend-bg.bat` di root project.

### Opsi C: Menggunakan PM2 (Recommended for Production)

Install PM2 globally:

```powershell
npm install -g pm2
npm install -g pm2-windows-startup
```

Setup PM2:

```powershell
# Install PM2 sebagai Windows Service
pm2-startup install

# Start backend
cd C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe
npm run build
pm2 start dist/server.js --name "pisifm-backend"

# Save configuration
pm2 save

# List running processes
pm2 list
```

PM2 Commands:

```powershell
pm2 list          # Lihat status semua proses
pm2 logs          # Lihat logs
pm2 restart all   # Restart semua
pm2 stop all      # Stop semua
pm2 delete all    # Delete semua
```

## ▶️ Start Apache

### 8. Start Apache Service

```powershell
# Via Command
cd C:\Apache24\bin
.\httpd.exe -k start

# Atau via Windows Services
# Win + R → services.msc → cari "Apache2.4" → Start
```

## 🌐 Akses Website

### 9. Buka Browser

Akses: **http://localhost**

Default Login:

- Username: `admin`
- Password: _(sesuai database)_

## 🔍 Troubleshooting

### Cek Port Conflicts

```powershell
# Cek port 80 (Apache)
netstat -ano | findstr :80

# Cek port 2000 (Backend)
netstat -ano | findstr :2000
```

### Cek Apache Logs

```
C:\Apache24\logs\error.log
C:\Apache24\logs\pisifm-error.log
```

### Restart Services

```powershell
# Restart Apache
cd C:\Apache24\bin
.\httpd.exe -k restart

# Restart Backend (jika pakai PM2)
pm2 restart pisifm-backend
```

### Rebuild Frontend (jika ada perubahan)

```powershell
cd C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmfe\frontend
npm run build
```

### Test Backend API

```powershell
# Test via curl atau browser
curl http://localhost:2000/api/health
```

## 🔄 Auto-Start on Boot

### Apache

Sudah otomatis jika install sebagai service.

### Backend dengan PM2

```powershell
pm2 startup
pm2 save
```

## 📝 File Locations

| Component             | Location                                                                      |
| --------------------- | ----------------------------------------------------------------------------- |
| Apache Config         | `C:\Apache24\conf\httpd.conf`                                                 |
| PISIFM Config         | `C:\Apache24\conf\extra\pisifm.conf`                                          |
| Frontend (Production) | `C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmfe\frontend\dist` |
| Backend               | `C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe`               |
| Apache Logs           | `C:\Apache24\logs\`                                                           |

## 🎯 Next Steps

1. ✅ Build frontend → **DONE**
2. ⬜ Enable Apache modules → **DO THIS**
3. ⬜ Copy config file → **DO THIS**
4. ⬜ Include config in httpd.conf → **DO THIS**
5. ⬜ Test Apache config → **DO THIS**
6. ⬜ Start Backend → **DO THIS**
7. ⬜ Start Apache → **DO THIS**
8. ⬜ Test di browser → **DO THIS**

## 🆘 Need Help?

**Backend tidak running?**

- Cek: `pm2 logs` atau lihat window "PISIFM Backend"
- Pastikan PostgreSQL running
- Cek environment variables (.env file)

**Apache tidak start?**

- Cek: `C:\Apache24\logs\error.log`
- Test config: `httpd.exe -t`
- Pastikan port 80 tidak dipakai program lain

**Website tidak muncul?**

- Cek Apache running: `netstat -ano | findstr :80`
- Cek backend running: `netstat -ano | findstr :2000`
- Clear browser cache (Ctrl + F5)

**Data realtime tidak update?**

- Cek backend logs
- Pastikan database streaming data
- Cek browser console (F12) untuk errors
