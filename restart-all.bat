@echo off
echo ============================================
echo  PISIFM - Restart All Services
echo ============================================
echo.

echo [1/3] Stopping existing processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend (port 2000)...
start "PISIFM Backend" cmd /k "cd /d %~dp0pisifmbe && npm run dev"
timeout /t 5 /nobreak >nul

echo [3/3] Starting Frontend (port 30)...
start "PISIFM Frontend" cmd /k "cd /d %~dp0pisifmfe\frontend && npm run dev"

echo.
echo ============================================
echo  Services Started!
echo ============================================
echo  Backend:  http://localhost:2000
echo  Frontend: http://10.125.48.102:30
echo.
echo  Login credentials:
echo  Username: admin
echo  Password: admifm
echo ============================================
echo.
pause
