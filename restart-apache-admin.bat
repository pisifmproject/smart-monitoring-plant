@echo off
REM Fix Apache DocumentRoot - Run as Administrator
echo Stopping Apache...
net stop Apache2.4

echo Waiting for Apache to stop...
timeout /t 3 /nobreak

echo Starting Apache...
net start Apache2.4

echo.
echo Apache restarted! Testing website...
timeout /t 3 /nobreak

powershell -Command "try { $resp = Invoke-WebRequest -Uri 'http://localhost/' -UseBasicParsing; Write-Host 'Status:' $resp.StatusCode; if($resp.Content -match 'frontend') { Write-Host 'SUCCESS: Website PISIFM loaded!' -ForegroundColor Green } else { Write-Host 'Content:' $resp.Content.Substring(0, 100) } } catch { Write-Host 'Error:' $_.Exception.Message -ForegroundColor Red }"

pause
