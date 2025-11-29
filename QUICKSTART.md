# 📋 Quick Start Checklist - Deploy PISIFM ke Apache24

## ✅ Yang Sudah Selesai:

- [x] Frontend sudah di-build ke folder `dist/`
- [x] Backend sudah di-build ke folder `dist/`
- [x] File konfigurasi Apache sudah dibuat
- [x] Batch scripts untuk start backend sudah dibuat

## 🎯 Langkah-Langkah Deploy (Urut dari Atas)

### 1️⃣ Install Apache24 (jika belum)

```powershell
# Download dari: https://www.apachelounge.com/download/
# Extract ke C:\Apache24
# Atau install via installer
```

### 2️⃣ Install Apache sebagai Windows Service

```powershell
cd C:\Apache24\bin
.\httpd.exe -k install
```

### 3️⃣ Enable Module Apache

Edit file: `C:\Apache24\conf\httpd.conf`

Cari dan uncomment (hapus `#`) baris berikut:

```apache
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
```

### 4️⃣ Copy Config PISIFM

```powershell
# Manual: Copy file ini
Copy-Item "apache-config\pisifm.conf" -Destination "C:\Apache24\conf\extra\"

# Atau copy manual dari folder:
# From: apache-config/pisifm.conf
# To: C:\Apache24\conf\extra\pisifm.conf
```

### 5️⃣ Include Config di httpd.conf

Edit file: `C:\Apache24\conf\httpd.conf`

Tambahkan di **akhir file**:

```apache
# PISIFM Configuration
Include conf/extra/pisifm.conf
```

### 6️⃣ Test Konfigurasi Apache

```powershell
cd C:\Apache24\bin
.\httpd.exe -t
```

**Expected output:** `Syntax OK`

### 7️⃣ Start Backend

**Pilih salah satu:**

#### Opsi A: Double-click Batch File (Paling Mudah)

```
Double-click: start-backend-bg.bat
```

#### Opsi B: Manual via PowerShell

```powershell
cd pisifmbe
node dist/server.js
```

#### Opsi C: Install PM2 (Production - Recommended)

```powershell
npm install -g pm2
cd pisifmbe
pm2 start dist/server.js --name "pisifm-backend"
pm2 save
```

### 8️⃣ Start Apache

```powershell
cd C:\Apache24\bin
.\httpd.exe -k start
```

### 9️⃣ Test Website

Buka browser:

```
http://localhost
```

---

## 🔍 Verifikasi

### Cek Backend Running

```powershell
netstat -ano | findstr :2000
```

Harus ada output menunjukkan port 2000 listening.

### Cek Apache Running

```powershell
netstat -ano | findstr :80
```

Harus ada output menunjukkan port 80 listening.

### Cek Logs

```powershell
# Apache logs
Get-Content C:\Apache24\logs\error.log -Tail 20

# Backend logs (jika pakai PM2)
pm2 logs
```

---

## 🚨 Troubleshooting

### Problem: Port 80 Already in Use

```powershell
# Cari program yang pakai port 80
netstat -ano | findstr :80
# Kill process (ganti PID dengan hasil di atas)
taskkill /PID <PID> /F
```

### Problem: Backend Tidak Start

1. Cek PostgreSQL running
2. Cek file `.env` ada di `pisifmbe/`
3. Pastikan `node_modules` sudah di-install: `npm install`
4. Build ulang: `npm run build`

### Problem: Website Error 502/503

Backend belum running. Start backend dulu (langkah 7).

### Problem: Data Tidak Muncul

1. Cek backend logs
2. Buka browser console (F12) → cek error
3. Pastikan database streaming data

---

## 🔄 Update Setelah Perubahan Code

### Update Frontend

```powershell
cd pisifmfe\frontend
npm run build
# Refresh browser (Ctrl + F5)
```

### Update Backend

```powershell
cd pisifmbe
npm run build

# Restart backend:
# Jika pakai batch file: tutup window, jalankan lagi start-backend-bg.bat
# Jika pakai PM2: pm2 restart pisifm-backend
# Jika manual: Ctrl+C lalu jalankan lagi node dist/server.js
```

### Restart Apache

```powershell
cd C:\Apache24\bin
.\httpd.exe -k restart
```

---

## 📞 Command Referensi Cepat

| Task                   | Command                                      |
| ---------------------- | -------------------------------------------- |
| Start Apache           | `cd C:\Apache24\bin; .\httpd.exe -k start`   |
| Stop Apache            | `cd C:\Apache24\bin; .\httpd.exe -k stop`    |
| Restart Apache         | `cd C:\Apache24\bin; .\httpd.exe -k restart` |
| Test Config            | `cd C:\Apache24\bin; .\httpd.exe -t`         |
| Start Backend (manual) | `cd pisifmbe; node dist/server.js`           |
| Start Backend (PM2)    | `pm2 start pisifm-backend`                   |
| Stop Backend (PM2)     | `pm2 stop pisifm-backend`                    |
| View PM2 Logs          | `pm2 logs`                                   |
| Build Frontend         | `cd pisifmfe\frontend; npm run build`        |
| Build Backend          | `cd pisifmbe; npm run build`                 |

---

## ✨ Auto-Start on Windows Boot

### Apache

Sudah otomatis jika di-install sebagai service (langkah 2).

### Backend dengan PM2

```powershell
npm install -g pm2-windows-startup
pm2-startup install
pm2 save
```

---

## 📁 File Structure

```
PISIFM/
├── pisifmfe/frontend/dist/          ← Frontend production (diakses Apache)
├── pisifmbe/dist/                    ← Backend compiled
├── apache-config/pisifm.conf         ← Apache config
├── start-backend.bat                 ← Start backend (foreground)
├── start-backend-bg.bat              ← Start backend (background)
└── DEPLOYMENT_GUIDE.md               ← Dokumentasi lengkap
```

---

Untuk detail lengkap, lihat **DEPLOYMENT_GUIDE.md**
