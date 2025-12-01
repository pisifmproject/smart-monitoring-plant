@echo off
REM Setup PISIFM Backend Auto-Start
REM Script ini HARUS dijalankan sebagai Administrator

echo ===============================================
echo   Setup PISIFM Backend Auto-Start
echo ===============================================
echo.

REM Cek apakah running sebagai admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Script ini harus dijalankan sebagai Administrator!
    echo Klik kanan file ini dan pilih "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo Creating Task Scheduler entry for PISIFM Backend...
echo.

REM Hapus task lama jika ada
schtasks /Delete /TN "PISIFM_Backend_AutoStart" /F >nul 2>&1

REM Buat task baru
schtasks /Create /TN "PISIFM_Backend_AutoStart" /TR "C:\Users\netcom\Documents\ifm_septian\project\PISIFM\autostart-backend.bat" /SC ONLOGON /RL HIGHEST /F

if %errorLevel% equ 0 (
    echo.
    echo ===============================================
    echo   SUCCESS: Auto-start berhasil dikonfigurasi!
    echo ===============================================
    echo.
    echo Backend akan otomatis start saat:
    echo - Windows boot
    echo - User login
    echo.
    echo Task Name: PISIFM_Backend_AutoStart
    echo.
    echo Untuk melihat task: Task Scheduler ^> Task Scheduler Library
    echo Untuk disable: Klik kanan task ^> Disable
    echo Untuk enable: Klik kanan task ^> Enable
    echo.
) else (
    echo.
    echo ERROR: Gagal membuat scheduled task!
    echo.
)

pause
