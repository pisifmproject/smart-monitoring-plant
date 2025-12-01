# Start PISIFM Backend
# Script untuk menjalankan backend PISIFM

$BackendPath = "C:\Users\netcom\Documents\ifm_septian\project\PISIFM\pisifmbe"

Write-Host "Starting PISIFM Backend..." -ForegroundColor Green

# Pindah ke direktori backend
Set-Location $BackendPath

# Jalankan backend (JavaScript dari hasil build)
Write-Host "Running backend on port 2000..." -ForegroundColor Cyan
node dist/server.js
