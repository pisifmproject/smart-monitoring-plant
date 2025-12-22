@echo off
echo ========================================
echo CLEANING VITE & NODE CACHE
echo ========================================
echo.

cd /d c:\Users\netcom\Documents\ifm_septian\project\Smart-Monitoring-Plant\pisifmfe\frontend

echo 1. Removing node_modules\.vite folder...
if exist node_modules\.vite (
    rmdir /s /q node_modules\.vite
    echo    [OK] Removed
) else (
    echo    [OK] Not found
)

echo.
echo 2. Removing dist folder...
if exist dist (
    rmdir /s /q dist
    echo    [OK] Removed
) else (
    echo    [OK] Not found
)

echo.
echo 3. Clearing browser localStorage...
echo    (User must clear manually via browser console)

echo.
echo ========================================
echo CACHE CLEANED
echo ========================================
echo.
echo Next steps:
echo 1. HARD RELOAD BROWSER: Ctrl+Shift+Delete
echo 2. Close all browser tabs COMPLETELY
echo 3. Clear browser cache (all time)
echo 4. Reopen browser
echo 5. Go to http://10.125.48.102:30/login
echo 6. Try login: admin / admifm
echo.
pause
