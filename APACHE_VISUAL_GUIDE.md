# 🎨 Apache Configuration - Visual Guide

## 📂 File Locations Map

```
Windows System
│
├── C:\Apache24\                              ← Apache Installation
│   ├── bin\
│   │   └── httpd.exe                         ← Apache executable
│   ├── conf\
│   │   ├── httpd.conf                        ← Main config (EDIT THIS)
│   │   └── extra\
│   │       └── pisifm.conf                   ← PISIFM config (COPY HERE)
│   └── logs\
│       ├── error.log                         ← Apache errors
│       └── pisifm-error.log                  ← PISIFM errors
│
└── Your Project\
    └── PISIFM\
        ├── pisifmfe\frontend\dist\           ← Frontend files (Apache serves from here)
        ├── pisifmbe\dist\server.js           ← Backend (runs on port 2000)
        └── apache-config\pisifm.conf         ← Config source (copy to Apache)
```

## 🔧 Step-by-Step Configuration

### STEP 1: Edit httpd.conf - Enable Modules

**File:** `C:\Apache24\conf\httpd.conf`

**Find these lines and remove the `#` at the beginning:**

```apache
Before:
#LoadModule rewrite_module modules/mod_rewrite.so
#LoadModule proxy_module modules/mod_proxy.so
#LoadModule proxy_http_module modules/mod_proxy_http.so
#LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so

After:
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
```

### STEP 2: Copy PISIFM Config

```
From: PISIFM\apache-config\pisifm.conf
  To: C:\Apache24\conf\extra\pisifm.conf
```

### STEP 3: Include PISIFM Config

**File:** `C:\Apache24\conf\httpd.conf` (same file as STEP 1)

**Add at the BOTTOM of the file:**

```apache
# PISIFM Configuration
Include conf/extra/pisifm.conf
```

## 🔄 Request Flow Diagram

```
Browser Request (http://localhost)
        ↓
   Apache:80
        ↓
   ┌────────────────┐
   │  Is it /api/*? │
   └────────────────┘
         ↓              ↓
       YES             NO
         ↓              ↓
   Backend:2000    Static Files
   (Proxy Pass)    (dist folder)
         ↓              ↓
   ┌──────────┐   ┌──────────┐
   │ Database │   │ HTML/JS/ │
   │ (Postgres│   │ CSS Files│
   │  :5432)  │   │          │
   └──────────┘   └──────────┘
         ↓              ↓
      Response      Response
         └──────┬───────┘
                ↓
            Browser
```

## 📄 PISIFM Config Explained

**File:** `C:\Apache24\conf\extra\pisifm.conf`

```apache
<VirtualHost *:80>
    ServerName pisifm.local
    ServerAlias localhost

    # 📁 Where frontend files are located
    DocumentRoot "C:/Users/netcom/Documents/ifm_septian/project/PISIFM/pisifmfe/frontend/dist"

    # 🔐 Directory permissions
    <Directory "C:/Users/netcom/Documents/ifm_septian/project/PISIFM/pisifmfe/frontend/dist">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted

        # 🔄 Vue Router support (History Mode)
        <IfModule mod_rewrite.c>
            RewriteEngine On
            RewriteBase /
            RewriteRule ^index\.html$ - [L]
            RewriteCond %{REQUEST_FILENAME} !-f
            RewriteCond %{REQUEST_FILENAME} !-d
            RewriteRule . /index.html [L]
        </IfModule>
    </Directory>

    # 🔌 Proxy /api requests to backend
    ProxyPreserveHost On
    ProxyPass /api http://localhost:2000/api
    ProxyPassReverse /api http://localhost:2000/api

    # 🔌 WebSocket support
    ProxyPass /socket.io http://localhost:2000/socket.io
    ProxyPassReverse /socket.io http://localhost:2000/socket.io

    # 📝 Logs
    ErrorLog "logs/pisifm-error.log"
    CustomLog "logs/pisifm-access.log" common
</VirtualHost>
```

## ✅ Verification Commands

### Check Apache Config Syntax

```powershell
cd C:\Apache24\bin
.\httpd.exe -t
```

**Expected:** `Syntax OK`

### Check Loaded Modules

```powershell
cd C:\Apache24\bin
.\httpd.exe -M | Select-String "proxy|rewrite"
```

**Expected output should include:**

```
proxy_module (shared)
proxy_http_module (shared)
proxy_wstunnel_module (shared)
rewrite_module (shared)
```

### Test Ports

```powershell
# Apache should be on port 80
netstat -ano | findstr :80

# Backend should be on port 2000
netstat -ano | findstr :2000
```

## 🎯 Common Issues

### Issue 1: "Cannot load modules"

**Solution:** Make sure module files exist in `C:\Apache24\modules\`

### Issue 2: "Forbidden" error

**Solution:** Check Directory permissions in pisifm.conf - should have `Require all granted`

### Issue 3: "Cannot connect to backend"

**Solution:**

1. Check backend is running: `netstat -ano | findstr :2000`
2. Start backend: `node dist/server.js`

### Issue 4: Vue Router shows 404

**Solution:** Make sure `mod_rewrite` is enabled and RewriteRules are in place

## 🎨 Frontend Static Files Structure

```
dist/
├── index.html                    ← Entry point
├── assets/
│   ├── index-DMugy0FU.js        ← Vue app bundle
│   ├── index-DHt3FolJ.css       ← Styles
│   └── [other chunks].js        ← Code-split chunks
└── [other static files]
```

When user visits `http://localhost`:

1. Apache serves `dist/index.html`
2. Browser loads JS/CSS from `dist/assets/`
3. Vue app makes API calls to `/api/*`
4. Apache proxies `/api/*` to `http://localhost:2000/api/*`

## 🚀 Testing Flow

1. ✅ **Start Backend**

   ```powershell
   cd pisifmbe
   node dist/server.js
   # Should see: "Server running on port 2000"
   ```

2. ✅ **Start Apache**

   ```powershell
   cd C:\Apache24\bin
   .\httpd.exe -k start
   ```

3. ✅ **Open Browser**

   ```
   http://localhost
   ```

4. ✅ **Check Console (F12)**
   - No errors in Console tab
   - Network tab shows successful API calls (status 200)

## 📊 Port Usage Summary

| Service    | Port | URL                   | Purpose         |
| ---------- | ---- | --------------------- | --------------- |
| Apache     | 80   | http://localhost      | Serves frontend |
| Backend    | 2000 | http://localhost:2000 | API & WebSocket |
| PostgreSQL | 5432 | localhost:5432        | Database        |

---

**Remember:**

- Apache needs to be running first
- Backend needs to be running for API calls
- Database needs to be running for data
