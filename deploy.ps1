# Deploy PISIFM - Complete Deployment Script
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  PISIFM Deployment Script" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Build Frontend
Write-Host "[1/4] Building Frontend..." -ForegroundColor Yellow
Set-Location "C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmfe\frontend"
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "X Frontend build failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 2. Build Backend
Write-Host "[2/4] Building Backend..." -ForegroundColor Yellow
Set-Location "C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe"
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK Backend build successful" -ForegroundColor Green
} else {
    Write-Host "X Backend build failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 3. Copy Apache Config
Write-Host "[3/5] Copying Apache Config..." -ForegroundColor Yellow
Set-Location "C:\Users\netcom\Documents\ifm_septian\project\PISIFM"
Copy-Item "apache-config\pisifm.conf" "C:\MyServer\Apache24\conf\extra\pisifm.conf" -Force
Write-Host "OK Apache config copied" -ForegroundColor Green
Write-Host ""

# 4. Restart Apache
Write-Host "[4/5] Restarting Apache..." -ForegroundColor Yellow
& "C:\MyServer\Apache24\bin\httpd.exe" -k restart
Start-Sleep -Seconds 2
Write-Host "OK Apache restarted" -ForegroundColor Green
Write-Host ""

# 5. Get IP Address
Write-Host "[5/5] Network Information..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch "Loopback" -and $_.IPAddress -notmatch "^169" } | Select-Object -First 1).IPAddress
Write-Host "OK Local IP Address: $ipAddress" -ForegroundColor Green
Write-Host ""

# Summary
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "What was deployed:" -ForegroundColor Yellow
Write-Host "  Frontend and Backend built successfully" -ForegroundColor White
Write-Host "  Apache restarted" -ForegroundColor White
Write-Host ""
Write-Host "Access Website:" -ForegroundColor Yellow
Write-Host "  Local: http://localhost" -ForegroundColor Cyan
Write-Host "  Network: http://${ipAddress}" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend Status:" -ForegroundColor Yellow
$backendProcess = Get-Process -Name node -ErrorAction SilentlyContinue
if ($backendProcess) {
    Write-Host "  Backend is running - Restart to apply changes" -ForegroundColor Green
    Write-Host "  Stop: Task Manager, End node.exe" -ForegroundColor White
    Write-Host "  Start: Run start-backend.bat" -ForegroundColor White
} else {
    Write-Host "  Backend is NOT running" -ForegroundColor Red
    Write-Host "  Start: Run start-backend.bat" -ForegroundColor White
}
Write-Host ""

Set-Location "C:\Users\netcom\Documents\ifm_septian\project\PISIFM"
